import { MiddlewareConsumer, Module } from '@nestjs/common';
import { userAuthMiddleware } from 'src/auth/auth.middleware';
import { authService } from 'src/auth/auth.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    imports:[userAuthMiddleware],
    controllers: [ProfileController],
    providers: [ProfileService,PrismaService,authService],
})
export class ProfileModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(userAuthMiddleware)
          .forRoutes('/profile');
      }
};