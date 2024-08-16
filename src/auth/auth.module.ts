import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import ConfigModule from '../config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
