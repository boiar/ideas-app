import { IsNotEmpty, IsString } from 'class-validator';
import { UserResponseObject } from '../user/user.entity';
import { IdeaResponseObject } from '../idea/idea.dto';

export class CommentDto {
  @IsNotEmpty()
  @IsString()
  comment: string;
}

export class CommentResponseObject {
  id: string;
  comment: string;
  created: Date;

  author: UserResponseObject;
  idea: IdeaResponseObject;
}
