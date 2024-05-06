import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { User } from './users/entities/user.entity';
import { RolesModule } from './roles/roles.module';
import 'dotenv/config'
import { Role } from './roles/entities/role.entity';
import { Tag } from './tags/entities/tag.entity';
import { Post } from './posts/entities/post.entity';
import { Comment } from './comments/entities/comment.entity';
import { Category } from './categories/entities/category.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: 5432,
        password: process.env.DATABASE_PASSWORD,
        username: process.env.DATABASE_USERNAME,
        entities: [User, Role, Tag, Post, Comment,Category],
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true
      }),
    UsersModule,
    PostsModule,
    CommentsModule,
    CategoriesModule,
    TagsModule,
    RolesModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
