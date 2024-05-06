import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    public roleRepository: Repository<Role>
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    try{
      let role = await this.roleRepository.create(createRoleDto)
      return await this.roleRepository.save(role)
    }catch(err){
      if(err.code == '23505')
        {
          throw new ConflictException(err.detail)
        }
      throw err
    }
  }

  findAll(query?) {
    return this.roleRepository.find({where:query});
  }

  findOne(id: number) {
    return this.roleRepository.findOne({
      where:{id}
    });
  }

  findOneWithRelations(id:number){
    return this.roleRepository.findOne({
      where:{id},
      relations:['users']
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try{
      let role = await this.findOne(id);
      if(!role) throw new NotFoundException('Resource not found');
      return this.roleRepository.save({
        ...role,
        ...updateRoleDto
      })
    }catch(err){
      if(err.code == '23505')
        {
          throw new ConflictException(err.detail)
        }
      throw err
    }
  }

  async remove(id: number) {
    try{
      let role = await this.roleRepository.delete(id)
      if(role.affected){
        return {message: 'role deleted successfully'}
      }
    }catch(err){
      if(err.code == '23503')
        {
          throw new BadRequestException(err.detail)
        }
      throw err
    }
  }
}
