import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '../shared/auth.gaurd';
import { ValidationPipe } from '../shared/validation.pipe';
import { User } from '../user/user.decorator';
import { IdeaDto } from '../idea/idea.dto';
import { CommentEntity } from './comment.entity';

@Controller('api/comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('idea/:ideaId')
  async showCommentByIdea(@Param('id') ideaId: string) {
    return this.commentService.showIdeaComments(ideaId);
  }

  @Get('user/:id')
  async showCommentByUser(@Param('id') userId: string) {
    return this.commentService.showUserComments(userId);
  }

  @Post('idea/:ideaId')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createComment(
    @Param('ideaId') ideaId: string,
    idea,
    @User('id') userId,
    @Body() data: CommentEntity,
  ) {
    return this.commentService.create(ideaId, userId, data);
  }

  @Get(':id')
  async showComment(@Param('id') id: string) {}

  @Delete(':commentId')
  @UseGuards(new AuthGuard())
  async destroyComment(
    @Param('commentId') commentId: string,
    @User('id') userId,
  ) {
    return this.commentService.destroy(commentId, userId);
  }
}
