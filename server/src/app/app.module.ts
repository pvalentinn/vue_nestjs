import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

import { UserModule } from '../user/user.module';
import { LobbyModule } from '../lobby/lobby.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PubSubModule } from 'src/pubsub/pubsub.module';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27042/test'),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      debug: false,
      installSubscriptionHandlers: true,
    }),
    UserModule,
    LobbyModule,
    PubSubModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: "/graphql", method: RequestMethod.ALL })
  }
}
