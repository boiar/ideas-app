import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserResponseObject } from './user.entity';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll(): Promise<UserResponseObject[]> {
    const users = await this.userRepository.find();
    return users.map((user) => user.toResponseObject(false));
  }

  async login(data: UserDto): Promise<UserResponseObject> {
    const user = await this.checkIfUserExist(data);

    if (!user || !(await user.comparePassword(data.password))) {
      throw new HttpException(
        'Invalid username or password !',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject();
  }

  async register(data: UserDto): Promise<UserResponseObject> {
    let user = await this.checkIfUserExist(data);
    if (user) {
      throw new HttpException('User already exists !', HttpStatus.BAD_REQUEST);
    }

    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject();
  }

  async checkIfUserExist(data: UserDto) {
    const { username } = data;
    return await this.userRepository.findOne({ where: { username } });
  }
}
