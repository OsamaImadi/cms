import { Comment } from 'src/comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({name:'User'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    username: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ length: 100, select:false })
    password: string;

    @Column({ type: 'date' })
    dob: string;

    @Column({nullable:true})
    picture: string;

    @Column()
    website: string;

    @Column()
    gender: string;

    @Column({ unique: true })
    socialMediaHandler: string;

    @Column({ unique: true })
    phone: string;

    @Column()
    status: boolean;

    @ManyToOne(() => Role, (role) => role.users,{nullable:true})
    role: Role

    @OneToMany(() => Post, (post) => post.author, {nullable:true})
    posts: Post[]

    @OneToMany(() => Comment, (comment) => comment.userId, {nullable:true})
    comments: Comment[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}