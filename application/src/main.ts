import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ValidationFilter } from './filter/filter.filter';

import * as cookieParser from 'cookie-parser';
// TODO: validate if server_profile has assetId and make sure if they are not same with user avatar asset id, if they are same dont delete the image from cloudinary
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.ORIGIN || '*',
      methods: 'GET, POST, PATCH, PUT, DELETE',
      allowedHeaders: ['content-type', 'Cookie'],
      credentials: true,
    },
  });
  app.use(cookieParser());
  // app.useGlobalGuards(new AuthGuard());
  app.useGlobalFilters(new ValidationFilter());

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
