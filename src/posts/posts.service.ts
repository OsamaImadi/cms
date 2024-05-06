import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository, DataSource } from 'typeorm';
import { fileUpload } from 'src/utils/fileupload';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import  * as _ from 'lodash';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    public postRepository: Repository<Post>,
    @InjectRepository(User)
    public userRepository: Repository<User>,
    @InjectRepository(Category)
    public categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    public tagRepository: Repository<Tag>,
    @InjectRepository(Comment)
    public commentRepository: Repository<Comment>,
  ) {}
  
  async create(createPostDto: CreatePostDto, file?: Express.Multer.File) {
    try{
      let {
        author,
        tags,
        categories
      } = createPostDto
      console.log(createPostDto)
      let res;
      if(file){
        res = await fileUpload(file);
      }
      let user:User = null;
      let postCategories:Category[] = []
      let postTags:Tag[] = []
      if(author){
        user = await this.userRepository.findOne({where:{id: author}})
      }
      if(categories){
        for(let i=0; i<categories.length; i++){
          let postCategory = await this.categoryRepository.findOne({where:{id:categories[i]}})
          postCategories.push(postCategory)
        }
      }
      if(tags){
        for(let i=0; i<tags.length; i++){
          let postTag = await this.tagRepository.findOne({where:{id:tags[i]}})
          postTags.push(postTag)
        }
      }
      let createPost = _.omit(createPostDto,['tags', 'categories', 'author'])
      let post = await this.postRepository.create({
        ...createPost,
        featuredImage: res?.Location,
        author: user,
        categories: postCategories,
        tags: postTags
      })
      return await this.postRepository.save(post)
    }catch(err){
      if(err.code == '23505')
        {
          throw new ConflictException(err.detail)
        }
      throw err
    }
  }

  findAll(query?) {
    return this.postRepository.find({where:query});
  }

  findOne(id: number) {
    return this.postRepository.findOne({
      where:{id},
      relations:['author','tags', 'categories','comments']
    });
  }

  async approvePost(id: number) {
    let post = await this.postRepository.findOne({
      where:{id}
    });
    if(!post) throw new NotFoundException("Post not found")
    post.status = true;
    post.publishUpdated = new Date()
    return await this.postRepository.save(post)
  }

  async findPostByCategory(name: string) {
    let category = await this.categoryRepository.findOne({
      where:{name},
    });

    return await this.postRepository.createQueryBuilder('post')
    .leftJoinAndSelect('post.categories', 'category')
    .where('category.id = :id', { id: category.id })
    .getMany();
  }

  async findPostBytags(name: string) {
    let tag = await this.tagRepository.findOne({
      where:{name},
    });

    return await this.postRepository.createQueryBuilder('post')
    .leftJoinAndSelect('post.tags', 'tag')
    .where('tag.id = :id', { id: tag.id })
    .getMany();
  }

  async update(id: number, updatePostDto: UpdatePostDto, file?: Express.Multer.File) {
    try{
      let post = await this.findOne(id);
      if(!post) throw new NotFoundException('Resource not found');
      let res;
      if(file){
        res = await fileUpload(file);
      }
      let postCategories:Category[] = []
      let postTags:Tag[] = []

      let {
        tags,
        categories
      } = updatePostDto

      if(categories){
        for(let i=0; i<categories.length; i++){
          let postCategory = await this.categoryRepository.findOne({where:{id:categories[i]}})
          postCategories.push(postCategory)
        }
      }
      if(tags){
        for(let i=0; i<tags.length; i++){
          let postTag = await this.tagRepository.findOne({where:{id:tags[i]}})
          postTags.push(postTag)
        }
      }

      let updatePost = _.omit(updatePostDto,['tags', 'categories', 'author'])
      return this.postRepository.save({
        ...post,
        ...updatePost,
        tags: postTags[0]? postTags : post.tags,
        categories: postCategories[0]? postCategories : post.categories,
        featuredImage: res?.Location
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
      let post = await this.postRepository.delete(id)
      if(post.affected){
        return {message: 'post deleted successfully'}
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
