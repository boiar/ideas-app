import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { IdeaEntity } from '../idea/idea.entity';
import { CommentResponseObject } from './comment.dto';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column('text')
  comment: string;

  @ManyToOne(() => UserEntity)
  @JoinTable()
  author: UserEntity;

  @ManyToOne(() => IdeaEntity, (idea) => idea.comments)
  idea: IdeaEntity;

  toResponseObject(): CommentResponseObject {
    const returnObj: any = {
      ...this,
      author: this.author.toResponseObject(false),
    };

    return returnObj;
  }
}
