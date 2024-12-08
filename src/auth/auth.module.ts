import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import constants from '../shared/security/constants';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule,
        JwtModule.register({
          secret: constants.JWT_SECRET,
          signOptions: { expiresIn: constants.JWT_EXPIRES_IN },
        })
      ],
    providers: [AuthService, UserService, JwtService, LocalStrategy, JwtStrategy], 
    exports: [AuthService]
    
})
export class AuthModule {}