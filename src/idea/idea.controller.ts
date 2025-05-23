import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query,
  UseGuards,
  UsePipes
} from "@nestjs/common";
import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '../shared/auth.gaurd';
import { User } from '../user/user.decorator';
import { BookmarksActionsEnum } from '../shared/BookmarksActionsEnum';
import { VoteActionsEnum } from '../shared/VoteActionsEnum';

@Controller('api/idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}
  @Get()
  showAllIdeas(@Query('page') page: number) {
    return this.ideaService.showAllIdeas(page);
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createIdea(@User('id') user, @Body() data: IdeaDto) {
    return this.ideaService.create(user, data);
  }

  @Get(':id')
  readIdea(@Param('id') id: string) {
    return this.ideaService.readIdea(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateIdea(
    @Param('id') id: string,
    @User('id') user,
    @Body() data: Partial<IdeaDto>,
  ) {
    return this.ideaService.update(id, user, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyIdea(@Param('id') id: string, @User('id') user) {
    return this.ideaService.destroy(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(new AuthGuard())
  bookmarkIdea(@Param('id') id: string, @User('id') user) {
    return this.ideaService.bookmark(id, user, BookmarksActionsEnum.Add);
  }

  @Delete(':id/unbookmark')
  @UseGuards(new AuthGuard())
  unBookmarkIdea(@Param('id') id: string, @User('id') user) {
    return this.ideaService.bookmark(id, user, BookmarksActionsEnum.Remove);
  }

  @Post(':id/upvote')
  @UseGuards(new AuthGuard())
  upvote(@Param('id') id: string, @User('id') userId: string) {
    return this.ideaService.vote(id, userId, VoteActionsEnum.up);
  }

  @Post(':id/downvote')
  @UseGuards(new AuthGuard())
  downvote(@Param('id') id: string, @User('id') userId: string) {
    return this.ideaService.vote(id, userId, VoteActionsEnum.down);
  }
}
