import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as fs from 'fs';
import * as morgan from 'morgan';

const logStream = fs.createWriteStream('api.log', {
  flags: 'a', // append
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config=new DocumentBuilder()
  .setTitle('linkedin')
  .setDescription('linkedin swagger')
  .setVersion('1.0')
  .addTag('linkedin')
  .build()
  const document=SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('docs',app,document)
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('tiny', { stream: logStream }));
  await app.listen(3000);
}
bootstrap();
