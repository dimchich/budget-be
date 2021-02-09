import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Group } from '../interfaces/groups.interface';
import { UserEntity } from './users.entity';

@Entity()
@Unique(['name'])
export class GroupEntity implements Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, author => author.groups)
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @Column({ nullable: true })
  authorId: number;
}
