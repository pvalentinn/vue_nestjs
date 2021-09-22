import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.model';
import { PayloadType } from './jwt.payload';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ){}

    login(user: User) {
        const payload = { login: user.login, sub: user._id, roles: user.roles, lobby: user.lobby };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }

    decode(token: string) {
        try {
            return this.jwtService.decode(token) as PayloadType;
        } catch(e) {
            return false;
        }
    }
}
