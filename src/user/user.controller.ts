import {
  Body,
  Controller,
  Get,
  Post, Query,
  UseGuards,
  UsePipes
} from "@nestjs/common";
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '../shared/auth.gaurd';
import { User } from './user.decorator';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/users')
  @UseGuards(new AuthGuard())
  showAllUsers(@User() user, @Query('page') page: number) {
    return this.userService.showAll(page);
  }
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() data: UserDto) {
    return this.userService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() data: UserDto) {
    return this.userService.register(data);
  }
}
