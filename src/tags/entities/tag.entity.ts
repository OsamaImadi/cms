import { Post } from 'src/posts/entities/post.entity';
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToMany } from 'typeorm';

@Entity({name:'Tag'})
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({nullable:true})
    picture: string;

    @Column()
    active: boolean;

    @ManyToMany(() => Post, (post) => post.tags)
    posts: Post[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
