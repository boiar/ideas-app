import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CommentDto, CommentResponseObject } from './comment.dto';
import { IdeaEntity } from '../idea/idea.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showIdeaComments(ideaId: string): Promise<CommentResponseObject[]> {
    const comments = await this.commentRepository.find({
      where: {
        idea: { id: ideaId },
      },
      relations: ['idea', 'author'],
      order: { created: 'DESC' }, // Optional: newest first
    });

    return comments.map((comment) => comment.toResponseObject());
  }


  async show(id: string): Promise<CommentResponseObject> {
    const comment = await this.commentRepository.findOne({
      where: { id },
    });

    return comment.toResponseObject();
  }
  async create(
    ideaId: string,
    userId: string,
    data: CommentDto,
  ): Promise<CommentResponseObject> {
    const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const comment = await this.commentRepository.create({
      ...data,
      idea,
      author: user,
    });

    await this.commentRepository.save(comment);

    return comment.toResponseObject();
  }

  async showUserComments(userId: string): Promise<CommentResponseObject[]> {
    const comments = await this.commentRepository.find({
      where: { author: { id: userId } },
      relations: ['idea', 'author'],
    });

    return comments.map((comment) => comment.toResponseObject());
  }

  async destroy(commentId: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
        author: { id: userId },
      },
      relations: ['idea', 'author'],
    });

    if (!comment) {
      throw new HttpException(
        'can not remove this comment',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.commentRepository.remove(comment);

    return { deleted: true };
  }
}
