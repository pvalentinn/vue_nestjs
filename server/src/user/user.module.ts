import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './user.model';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { Lobby, LobbySchema } from 'src/lobby/lobby.model';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Lobby.name, schema: LobbySchema }]),
        JwtModule.register({
            secret: 'secret',
            signOptions: { expiresIn: '30m' },
        })
    ],
    providers: [UserService, UserResolver, AuthService]
})
export class UserModule {}
