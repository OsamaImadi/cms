import { Category } from 'src/categories/entities/category.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity({name:'Post'})
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    body: string;

    @Column()
    slug: string;

    @Column()
    featuredImage: string;

    @Column()
    summary: string;

    @Column({default: false})
    status: boolean;

    @Column({nullable:true})
    publishUpdated: Date;

    @ManyToOne(() => User, (user) => user.posts, {nullable:true})
    author: User

    @ManyToMany(() => Category, {nullable:true})
    @JoinTable()
    categories: Category[]

    @ManyToMany(() => Tag, {nullable:true})
    @JoinTable()
    tags: Tag[]

    @OneToMany(() => Comment, (comment) => comment.postId, {nullable:true})
    comments: Comment[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}