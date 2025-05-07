import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDto } from './idea.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
  ) {}

  async showAllIdeas() {
    return await this.ideaRepository.find();
  }

  async create(data: IdeaDto) {
    const idea = this.ideaRepository.create(data);
    await this.ideaRepository.save(idea);
    return idea;
  }

  async readIdea(id: string) {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return idea;
  }

  async update(id: string, data: Partial<IdeaDto>) {
    const idea = await this.readIdea(id);
    if (!idea) {
      throw new HttpException('Not found--', HttpStatus.NOT_FOUND);
    }

    await this.ideaRepository.update(id, data);
    return await this.ideaRepository.findOne({ where: { id } });
  }

  async destroy(id: string) {
    const idea = await this.readIdea(id);
    if (!idea) {
      throw new HttpException('Not found--', HttpStatus.NOT_FOUND);
    }

    await this.ideaRepository.delete({ id });
    return { deleted: true };
  }
}
