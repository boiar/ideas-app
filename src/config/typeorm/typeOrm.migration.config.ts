import 'dotenv/config';
import { IdeaEntity } from '../../idea/idea.entity';
import { UserEntity } from '../../user/user.entity';
import { DataSource } from 'typeorm';

export const ORMConfig: DataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  dropSchema: false,
  logging: true,
  entities: [IdeaEntity, UserEntity],
  migrations: ['src/**/migrations/*.js', 'dist/**/migrations/*.js'],
});

module.exports = {
  ORMConfig: ORMConfig,
};
