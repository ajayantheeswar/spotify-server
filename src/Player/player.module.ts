import { MiddlewareConsumer, Module } from '@nestjs/common';
import { userAuthMiddleware } from 'src/auth/auth.middleware';
import { authService } from 'src/auth/auth.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { AlbumService } from './album.service';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

@Module({
    controllers: [PlayerController],
    providers: [PlayerService,PrismaService,AlbumService,authService],
})
export class PlayerModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(userAuthMiddleware)
          .forRoutes('/profile');
      }
};