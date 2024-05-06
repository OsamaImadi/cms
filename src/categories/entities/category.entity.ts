import { Post } from 'src/posts/entities/post.entity';
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToMany } from 'typeorm';

@Entity({name:'Category'})
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column()
    picture: string;

    @Column({nullable:true})
    description: string;

    @Column()
    status: boolean;
    
    @ManyToMany(() => Post, (post) => post.categories)
    posts: Post[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
