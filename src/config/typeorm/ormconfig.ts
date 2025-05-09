import 'dotenv/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { IdeaEntity } from '../../idea/idea.entity';
import { UserEntity } from '../../user/user.entity';
import { CommentEntity } from "../../comment/comment.entity";

export const ORMConfig: TypeOrmModuleOptions = {
  type: 'mysql', // MySQL as the DB type
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false, // Avoid auto schema synchronization in production
  dropSchema: false,
  logging: true,
  logger: 'file',
  entities: [IdeaEntity, UserEntity, CommentEntity],
  migrations: [join(__dirname, '..', '**', 'migrations', '*.{ts,js}')], // Correct path
  migrationsTableName: 'migrations',
};

module.exports = { ORMConfig: ORMConfig };
