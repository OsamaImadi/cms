import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { fileUpload } from 'src/utils/fileupload';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    public categoryRepository: Repository<Category>,
  ) {}
  
  async create(createCategoryDto: CreateCategoryDto, file: Express.Multer.File) {
    try{
      let res;
      if(file){
        res = await fileUpload(file);
      }
      let tag = await this.categoryRepository.create({
        ...createCategoryDto,
        picture: res?.Location
      })
      return await this.categoryRepository.save(tag)
    }catch(err){
      if(err.code == '23505')
        {
          throw new ConflictException(err.detail)
        }
      throw err
    }
  }

  findAll(query?) {
    return this.categoryRepository.find({where:query});
  }

  findOne(id: number) {
    return this.categoryRepository.findOne({where:{id}});
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, file: Express.Multer.File) {
    try{
      let tag = await this.findOne(id);
      let res;
      if(file){
        res = await fileUpload(file);
      }
      if(!tag) throw new NotFoundException('Resource not found');
      return this.categoryRepository.save({
        ...tag,
        ...updateCategoryDto,
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
      let category = await this.categoryRepository.delete(id)
      if(category.affected){
        return {message: 'category deleted successfully'}
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
