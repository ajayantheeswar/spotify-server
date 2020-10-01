/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { NestSessionOptions, SessionModule } from 'nestjs-session';
import { MongooseModule  } from '@nestjs/mongoose';
import { ProfileModule } from './profile/profile.module';
import { AdminModule } from './admin/admin.module';
import { PlayerModule } from './Player/player.module';

const mongoose = require('mongoose');
const session= require('express-session');
const mongoStore = require('connect-mongo')(session);



@Module({
  imports: [
    SessionModule.forRoot({
      session : {
        secret : 'secret',
        store : new mongoStore({mongooseConnection : mongoose.connection}),
        resave :false,
        saveUninitialized : false,
      }
    }),
    AuthModule,
    ProfileModule,
    AdminModule,
    PlayerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
