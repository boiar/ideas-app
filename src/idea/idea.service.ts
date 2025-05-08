import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDto, IdeaResponseObject } from './idea.dto';
import { UserEntity } from '../user/user.entity';
import { BookmarksActionsEnum } from '../shared/BookmarksActionsEnum';
import { VoteActionsEnum } from "../shared/VoteActionsEnum";

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObj(idea: IdeaEntity): IdeaResponseObject {
    const resObj: any = {
      ...idea,
      author: idea.author.toResponseObject(false),
    };

    if (resObj.upvotes) {
      resObj.upvotes = idea.upvotes.length;
    }

    if (resObj.downvotes) {
      resObj.downvotes = idea.downvotes.length;
    }

    return resObj;
  }

  private ensureOwnership(idea: IdeaEntity, userId: string) {
    if (idea.author.id != userId) {
      throw new HttpException(
        'you are not the owner of the post',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async showAllIdeas(): Promise<IdeaResponseObject[]> {
    const ideas = await this.ideaRepository.find({
      relations: ['author', 'upvotes', 'downvotes'],
    });
    return ideas.map((idea) => this.toResponseObj(idea));
  }

  async create(userId: string, data: IdeaDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const idea = await this.ideaRepository.create({
      ...data,
      author: user,
    });
    await this.ideaRepository.save(idea);
    return this.toResponseObj(idea);
  }

  async readIdea(id: string): Promise<IdeaResponseObject> {
    const idea = await this.getIdea(id);
    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObj(idea);
  }

  async update(
    id: string,
    userId: string,
    data: Partial<IdeaDto>,
  ): Promise<IdeaResponseObject> {
    let idea = await this.getIdea(id);
    if (!idea) {
      throw new HttpException('Not found--', HttpStatus.NOT_FOUND);
    }

    this.ensureOwnership(idea, userId);

    await this.ideaRepository.update({ id }, data);
    idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    return this.toResponseObj(idea);
  }

  async destroy(id: string, userId: string) {
    const idea = await this.getIdea(id);
    if (!idea) {
      throw new HttpException('Not found--', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(idea, userId);

    await this.ideaRepository.delete({ id });
    return { deleted: true };
  }

  private async getIdea(id: string) {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return idea;
  }

  async bookmark(id: string, userId: string, action: BookmarksActionsEnum) {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (!idea) {
      throw new HttpException('idea is undefined', HttpStatus.BAD_REQUEST);
    }

    if (!user) {
      throw new HttpException('user is undefined', HttpStatus.BAD_REQUEST);
    }

    if (
      action == BookmarksActionsEnum.Add &&
      user.bookmarks.filter((bookmark) => bookmark.id == idea.id).length < 1
    ) {
      user.bookmarks.push(idea);
      await this.userRepository.save(user);
    }

    if (
      action == BookmarksActionsEnum.Remove &&
      user.bookmarks.filter((bookmark) => bookmark.id == idea.id).length > 0
    ) {
      user.bookmarks = user.bookmarks.filter(
        (bookmark) => bookmark.id !== idea.id,
      );

      await this.userRepository.save(user);
    }

    return user.toResponseObject(false);
  }

  async vote(id: string, userId: string, action: VoteActionsEnum) {
    const idea: any = await this.ideaRepository.findOne({
      where: { id },
      relations: ['upvotes', 'downvotes'],
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!idea) {
      throw new HttpException('idea is undefined', HttpStatus.BAD_REQUEST);
    }

    if (!user) {
      throw new HttpException('user is undefined', HttpStatus.BAD_REQUEST);
    }

    const otherAction =
      action == VoteActionsEnum.up ? VoteActionsEnum.down : VoteActionsEnum.up;

    if (idea[action].filter((voter) => voter.id === user.id).length > 0) {
      idea[action] = idea[otherAction].filter((voter) => voter.id !== user.id);
      await this.ideaRepository.save(idea);
    } else if (
      idea[action].filter((voter) => voter.id === user.id).length === 0
    ) {
      idea[otherAction] = idea[otherAction].filter(
        (voter) => voter.id !== user.id,
      );
      idea[action].push(user);

      await this.ideaRepository.save(idea);
    }

    idea.upvotes = idea.upvotes.map((user) => user.toResponseObject(false));
    idea.downvotes = idea.downvotes.map((user) => user.toResponseObject(false));

    return idea;
  }
}
