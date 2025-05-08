import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  ManyToMany, OneToMany
} from "typeorm";
import { UserEntity } from '../user/user.entity';
import { JoinTable } from 'typeorm';
import { CommentEntity } from "../comment/comment.entity";

@Entity('idea')
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  idea: string;

  @Column('text')
  description: string;

  @ManyToOne((type) => UserEntity, (author) => author.ideas)
  author: UserEntity;

  @ManyToMany(() => UserEntity, { cascade: true })
  @JoinTable({
    name: 'idea_upvotes_users', // exact table name in your MySQL
    joinColumn: {
      name: 'ideaId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  upvotes: UserEntity[];

  @ManyToMany(() => UserEntity, { cascade: true })
  @JoinTable({
    name: 'idea_downvotes_users',
    joinColumn: {
      name: 'ideaId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  downvotes: UserEntity[];

  @OneToMany(() => CommentEntity, comment.idea, { cascade: true })
  comments: CommentEntity[];

}
