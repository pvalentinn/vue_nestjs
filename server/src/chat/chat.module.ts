import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { LobbyModule } from 'src/lobby/lobby.module';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './chat.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    LobbyModule,
    UserModule
  ],
  providers: [ChatService, ChatResolver],
  exports: [ChatService, MongooseModule]
})
export class ChatModule {}
