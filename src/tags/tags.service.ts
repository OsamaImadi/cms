import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fileUpload } from 'src/utils/fileupload';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    public tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto, file: Express.Multer.File) {
    try{
      let res;
      if(file){
        res = await fileUpload(file);
      }
      let tag = await this.tagRepository.create({
        ...createTagDto,
        picture: res?.Location
      })
      return await this.tagRepository.save(tag)
    }catch(err){
      if(err.code == '23505')
        {
          throw new ConflictException(err.detail)
        }
      throw err
    }
  }

  findAll(query?) {
    return this.tagRepository.find({where:query});
  }

  findOne(id: number) {
    return this.tagRepository.findOne({where:{id}});
  }

  async update(id: number, updateTagDto: UpdateTagDto, file: Express.Multer.File) {
    try{
      let tag = await this.findOne(id);
      let res;
      if(file){
        res = await fileUpload(file);
      }
      if(!tag) throw new NotFoundException('Resource not found');
      return this.tagRepository.save({
        ...tag,
        ...updateTagDto,
        picture: res?.Location
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
      let tag = await this.tagRepository.delete(id)
      if(tag.affected){
        return {message: 'Tag deleted successfully'}
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
