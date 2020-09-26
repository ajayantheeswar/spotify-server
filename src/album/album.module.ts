import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

@Module({
    controllers: [AlbumController],
    providers: [PrismaService,AlbumService],
})
export class AlbumModule {};