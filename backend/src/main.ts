import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { customJsSwagger } from './swagger/custom';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['verbose', 'debug', 'warn', 'error', 'fatal', 'log'],
  });

  //Cookie Parser
  app.use(cookieParser());

  //Validation Pipe

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //SWAGGER
  const config = new DocumentBuilder()
    .setTitle('House Core Swagger')
    .setDescription('House App to keep everything in house ordered')
    .setVersion('1.0')
    .addTag('house')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  const swaggerCustomOptions: SwaggerCustomOptions = {
    customJsStr: customJsSwagger,
  };
  SwaggerModule.setup('api', app, documentFactory, swaggerCustomOptions);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
