import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ValidationFilter } from './filter/filter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET, POST, PATCH, PUT, DELETE',
      allowedHeaders: 'Content-Type',
      credentials: true,
    },
  });
  app.useGlobalFilters(new ValidationFilter());

  await app.listen(3001);
}
bootstrap();
