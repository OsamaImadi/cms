import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import  * as _ from 'lodash';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    public commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    public postRepository: Repository<Post>,
    @InjectRepository(User)
    public userRepository: Repository<User>
  ) {}
  
  async create(createCommentDto: CreateCommentDto) {
    try{
      let {
        userId,
        postId,
        parentCommentId
      } = createCommentDto;
      let user = await this.userRepository.findOne({where:{id: userId}})
      if(!user) throw new NotFoundException('User not found')

      let post = await this.postRepository.findOne({where:{id: postId}})
      if(!post) throw new NotFoundException('Post Not found')
      
      let parentComment:Comment;
      if(parentCommentId){
        parentComment = await this.commentRepository.findOne({where:{id:parentCommentId}})
        if(!parentComment) throw new NotFoundException("Parent comment not found")
      }

      let createComment = _.omit(createCommentDto,['userId', 'postId', 'parentCommentId', 'replyCommentId'])

      let comment = await this.commentRepository.create({
        ...createComment,
        postId: post,
        userId: user,
        parentComment
      })
      return await this.commentRepository.save(comment)
    }catch(err){
      throw err
    }
  }

  findAll(query?) {
    return this.commentRepository.find({where:query});
  }

  findOne(id: number) {
    return this.commentRepository.findOne({where:{id}, relations:['parentComment','replyComment']});
  }

  async findByPostId(id: number) {
    let post = await this.postRepository.findOne({where:{id: id}})
    if(!post) throw new NotFoundException('Post Not found')
    return this.commentRepository.findOne({where:{postId:post}});
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try{
      let comment = await this.findOne(id);
      if(!comment) throw new NotFoundException('Resource not found');
      return this.commentRepository.save({
        ...comment,
        ...updateCommentDto
      })
    }catch(err){
      throw err
    }
  }

  async upvote(id: number) {
    try{
      let comment = await this.findOne(id);
      if(!comment) throw new NotFoundException('Resource not found');
      comment.rating++;
      return this.commentRepository.save(comment)
    }catch(err){
      throw err
    }
  }

  async remove(id: number) {
    try{
      let comment = await this.commentRepository.delete(id)
      if(comment.affected){
        return {message: 'Comment deleted successfully'}
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
