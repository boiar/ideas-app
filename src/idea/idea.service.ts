import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDto, IdeaResponseObject } from './idea.dto';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObj(idea: IdeaEntity): IdeaResponseObject {
    return {
      ...idea,
      author: idea.author.toResponseObject(false),
    };
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
    const ideas = await this.ideaRepository.find({ relations: ['author'] });
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
}
