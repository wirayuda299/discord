import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ValidationFilter } from './filter/filter.filter';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      methods: 'GET, POST, PATCH, PUT, DELETE',
      allowedHeaders: ['content-type', 'Cookie'],
      credentials: true,
    },
  });
  app.use(cookieParser());
  app.useGlobalFilters(new ValidationFilter());

  await app.listen(3001);
}
bootstrap();
