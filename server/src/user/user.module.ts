import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './user.model';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { Lobby, LobbySchema } from 'src/lobby/lobby.model';

const UserFeature = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
@Module({
    imports: [
        UserFeature,
        MongooseModule.forFeature([{ name: Lobby.name, schema: LobbySchema }]),
    ],
    providers: [UserService, UserResolver],
    exports: [UserService, UserFeature]
})
export class UserModule {}
