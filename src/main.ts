import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { setupSwagger } from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new IoAdapter(app));

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`Running on PORT=${process.env.PORT ?? 3000}`, 'NestApplication');
  Logger.log(`Swagger docs at http://localhost:${process.env.PORT ?? 3000}/api/docs`, 'NestApplication');
}
bootstrap();
