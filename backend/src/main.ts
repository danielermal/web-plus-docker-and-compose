import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';

import configuration from './configuration/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const corsOptions = {
    origin: ['http://kpd.ermalyukd.nomoredomains.work', 'https://kpd.ermalyukd.nomoredomains.work'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['authorization', 'content-type'],
  };
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(configuration().port);
}
bootstrap();
