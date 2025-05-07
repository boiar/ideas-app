import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';

@Controller('api/idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}
  @Get()
  showAllIdeas() {
    return this.ideaService.showAllIdeas();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createIdea(@Body() data: IdeaDto) {
    return this.ideaService.create(data);
  }

  @Get(':id')
  readIdea(@Param('id') id: string) {
    return this.ideaService.readIdea(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDto>) {
    return this.ideaService.update(id, data);
  }

  @Delete(':id')
  destroyIdea(@Param('id') id: string) {
    return this.ideaService.destroy(id);
  }
}
