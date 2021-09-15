import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LobbyResolver } from './lobby.resolver';
import { LobbyService } from './lobby.service';
import { Lobby, LobbySchema } from './lobby.model';
import { User, UserSchema } from 'src/user/user.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Lobby.name, schema: LobbySchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [LobbyService, LobbyResolver],
})
export class LobbyModule {}
