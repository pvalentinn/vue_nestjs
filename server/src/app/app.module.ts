import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

import { UserModule } from '../user/user.module';
import { LobbyModule } from '../lobby/lobby.module';
import { ChatModule } from 'src/chat/chat.module';
import { AuthModule } from 'src/auth/auth.module';
import { PubSubModule } from 'src/pubsub/pubsub.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from 'src/game/game.module';

@Module({
  	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.local'],
		}),
		MongooseModule.forRoot(process.env.MONGODB_URL),
		GraphQLModule.forRoot({
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
			sortSchema: true,
			playground: true,
			debug: false,
			installSubscriptionHandlers: true,
			cors: {
				origin: process.env.CLIENT_URL,
				credentials: true,
			}
		}),
		LobbyModule,
		UserModule,
		ChatModule,
		GameModule,
		PubSubModule,
		AuthModule
 	],
	controllers: [AppController],
	providers: [AppService],
	exports: [ConfigModule]
})
export class AppModule {}