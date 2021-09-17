import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import 'dotenv/config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5000);
}
bootstrap();
