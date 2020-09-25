/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const mongoose = require('mongoose');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({credentials : true , origin: "http://localhost:8080"});
  await mongoose.connect('mongodb+srv://admin:PBxsg6Kw7p0mLA60@cluster0-krkj7.mongodb.net/spotify?retryWrites=true&w=majority',{useNewUrlParser: true , useUnifiedTopology: true})
  await app.listen(3000);
}
bootstrap();
