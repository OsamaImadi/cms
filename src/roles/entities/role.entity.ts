import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({name:'Role'})
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column()
    status: boolean;

    @OneToMany(() => User, (user) => user.role, {nullable:true})
    users: User[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
