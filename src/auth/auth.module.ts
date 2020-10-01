import { Module } from '@nestjs/common';
import {authController} from './auth.controller';
import {authService} from './auth.service';
import {PrismaService} from '../Prisma/prisma.service';

import { MongooseModule } from '@nestjs/mongoose';


@Module({
    imports : [],
    controllers : [authController],
    providers : [authService,PrismaService,]
})
export class AuthModule {}
