import { MiddlewareConsumer, Module } from '@nestjs/common';
import { userAuthMiddleware } from 'src/auth/auth.middleware';
import { authService } from 'src/auth/auth.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { AlbumService } from './album.service';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import {SearchService} from './search.service';
import {ElasticsearchModule} from '@nestjs/elasticsearch'

@Module({
    imports: [ElasticsearchModule.register({
        node: 'http://localhost:9200',
    })],
    controllers: [PlayerController],
    providers: [PlayerService,PrismaService,AlbumService,authService,SearchService],
})
export class PlayerModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(userAuthMiddleware)
          .forRoutes('/profile');
      }
};