import { IsString } from 'class-validator';
import { UserResponseObject } from '../user/user.entity';

export class IdeaDto {
  @IsString()
  idea: string;

  @IsString()
  description: string;
}

export class IdeaResponseObject {
  id?: string;
  updated: Date;
  created: Date;
  idea: string;
  description: string;
  author: UserResponseObject;
}
