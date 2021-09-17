import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    async validateUser(){}

    async login(user: any) {
        const payload = { login: user.login, sub: user._id };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }
}
