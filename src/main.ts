import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const port = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  Logger.log(`Server running om http:localhost:${port}`);

  console.log('Connecting with:');
  console.log('Host:', process.env.DATABASE_HOST);
  console.log('User:', process.env.DATABASE_USERNAME);
  console.log('Pass:', process.env.DATABASE_PASSWORD);
  console.log('DB:', process.env.DATABASE_NAME);

}
bootstrap();
