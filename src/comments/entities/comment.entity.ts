import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity({name:'Comment'})
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    body: string;

    @Column({default: 0})
    rating: number;

    @Column({default: false})
    approved: boolean;

    @ManyToOne(() => User, (user) => user.comments, {nullable:true})
    userId: User

    @ManyToOne(() => Post, (post) => post.comments, {nullable:true})
    postId: Post

    @ManyToOne(() => Comment, (comment) => comment.replyComment,{
        onDelete: "CASCADE"
    })
    parentComment: Comment

    @OneToMany(() => Comment, (comment) => comment.parentComment)
    @JoinColumn()
    replyComment: Comment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
