import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { AlbumController } from './admin.controller';
import { AdminService } from './admin.service';
import {StorageService} from '../storage/stotage.service'

@Module({
    controllers: [AlbumController],
    providers: [PrismaService,AdminService,StorageService],
})
export class AdminModule {};