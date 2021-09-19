import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
		  	useFactory: async () => ({
				secret: process.env.JWT_SECRET,
				signOptions: {
					expiresIn: '1d',
				},
		  	}),
		}),
	],
  	providers: [AuthService, JwtStrategy],
  	exports: [AuthService]
})
export class AuthModule {}
