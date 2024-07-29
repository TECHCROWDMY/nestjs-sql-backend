import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { SeederService } from './database/seeders/seeder.service';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const seeder = app.get(SeederService);
  await seeder.seed();

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
