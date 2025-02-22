import helmet from 'helmet';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
// import cookieParser from 'cookie-parser';
import cookieParser = require('cookie-parser');  

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  // Security middleware
  app.use(helmet());
  app.enableCors({
    origin: configService.get('ALLOWED_ORIGINS').split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  const port = configService.get('PORT') || 8000;
  await app.listen(port);
}
bootstrap();
