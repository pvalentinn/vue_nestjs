import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LobbyResolver } from './lobby.resolver';
import { LobbyService } from './lobby.service';
import { Lobby, LobbySchema } from './lobby.model';

import { UserModule } from 'src/user/user.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Lobby.name, schema: LobbySchema }]),
        UserModule,
        ChatModule
    ],
    providers: [LobbyService, LobbyResolver],
    exports: [LobbyService, MongooseModule]
})
export class LobbyModule {}
