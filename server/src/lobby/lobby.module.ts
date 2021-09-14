import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Lobby, LobbySchema } from './lobby.model';
import { LobbyService } from './lobby.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Lobby.name, schema: LobbySchema }]),
    ],
    providers: [LobbyService],
})
export class LobbyModule {}
