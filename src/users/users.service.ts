import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import  * as _ from 'lodash';
import { fileUpload } from 'src/utils/fileupload';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public userRepository: Repository<User>,
    @InjectRepository(Role)
    public roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try{
      let {
        password,
        role
      } = createUserDto;
      if(!role){
        let newRole = await this.roleRepository.findOne({where: {name: 'USER'}})
        role = newRole.id
      }
      let userRole = await this.roleRepository.findOne({where:{id:role}})
      const hashedPassword = await bcrypt.hash(password, 10);
      createUserDto.password = hashedPassword;
      delete createUserDto.role;
      let userNew = {
        ...createUserDto,
        role: userRole
      }
      const user = this.userRepository.create(userNew);
      let newUser = await this.userRepository.save(user);
  
      return _.omit(newUser,['password'])
    }catch(err){
      if(err.code == '23505')
        {
          throw new ConflictException(err.detail)
        }
      throw err
    }
  }

  findAll(query?) {
    return this.userRepository.find({where:query});
  }

  async findByEmail(email:string) {
    return await this.userRepository.findOne({where:{email},select:['id', 'email', 'password' ], relations:['role']});
  }

  findOne(id: number) {
    return this.userRepository.findOne({where:{id}});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try{
      let user = await this.findOne(id);
      if(!user) throw new NotFoundException('Resource not found');
      delete updateUserDto.role;
      let updateUser = _.omit(updateUserDto,['role'])
      return this.userRepository.save({
        ...user,
        ...updateUser
      })
    }catch(err){
      if(err.code == '23505')
        {
          throw new ConflictException(err.detail)
        }
      throw err
    }
  }

  async addPicture(id: number, file: Express.Multer.File) {
    let user = await this.findOne(id);
    if(!user) throw new NotFoundException('Resource not found');
    let res = await fileUpload(file);
    return this.userRepository.save({
      ...user,
      picture: res?.Location
    })
  }

  async assignRole(id: number, roleId: number) {
    let user = await this.findOne(id);
    if(!user) throw new NotFoundException('User not found');
    let role = await this.roleRepository.findOne({where:{id:roleId}})
    if(!role) throw new NotFoundException('Role not found');
    return this.userRepository.save({
      ...user,
      role
    })
  }

  async remove(id: number) {
    let user = await this.userRepository.delete(id)
    if(user.affected){
      return {message: 'User deleted successfully'}
    }
    throw new NotFoundException("Resource not found")
  }
}
