import { Module } from '@nestjs/common';
import {authController} from './auth.controller';
import {authService} from './auth.service';
import {PrismaService} from '../Prisma/prisma.service';

import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports : [MongooseModule.forRoot('mongodb+srv://admin:PBxsg6Kw7p0mLA60@cluster0-krkj7.mongodb.net/spotify?retryWrites=true&w=majority',{useNewUrlParser: true , useUnifiedTopology: true})],
    controllers : [authController],
    providers : [authService,PrismaService]
})
export class AuthModule {}
