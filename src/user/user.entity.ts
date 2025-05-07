import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as process from 'process';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showAuthToken: boolean = true) {
    const { id, created, username, authToken } = this;
    const responseObj: any = { id, created, username };

    if (showAuthToken) {
      responseObj.authToken = authToken;
    }

    return responseObj;
  }

  async comparePassword(inComePassword: string) {
    return await bcrypt.compare(inComePassword, this.password);
  }

  private get authToken() {
    const { id, username } = this;
    return jwt.sign({ id, username }, process.env.SECRET, { expiresIn: '7d' });
  }
}

export class UserResponseObject{
  id: string;
  username: string;
  created: Date;
  token?: string;
}
