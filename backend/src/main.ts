import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('HeyCash+ API')
    .setDescription('API documentation for HeyCash+ platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Sentry (optionnel - décommenter si configuré)
  // if (process.env.SENTRY_DSN) {
  //   const Sentry = require('@sentry/nestjs');
  //   Sentry.init({
  //     dsn: process.env.SENTRY_DSN,
  //     environment: process.env.NODE_ENV || 'development',
  //   });
  // }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api`);
}

bootstrap();


