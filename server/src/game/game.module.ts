import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { MongooseModule } from '@nestjs/mongoose';

import { Game, GameSchema } from './game.model';
import { LobbyModule } from 'src/lobby/lobby.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    UserModule,
    LobbyModule
  ],
  providers: [GameService, GameResolver],
  exports: [GameService, MongooseModule]
})
export class GameModule {}
