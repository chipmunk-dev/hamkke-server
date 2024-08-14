import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async signup(data: CreateUserDto) {
    const user = await this.usersService.findUserByUsername(data.username);
    if (user) {
      throw new ConflictException('이미 존재하는 이메일입니다');
    }

    const hashedPassword = await this.hashPassword(data.password);
    const createdUser = await this.usersService.createUser({
      ...data,
      password: hashedPassword,
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.createTokens(createdUser.id, false),
      this.createTokens(createdUser.id, true),
    ]);

    return {
      accessToken,
      refreshToken,
      info: {
        userId: createdUser.id,
        nickname: createdUser.nickname,
        profileImageUrl: null,
      },
    };
  }

  async hashPassword(password: string) {
    const SALT_ROUNDS = parseInt(this.configService.get('SALT_ROUNDS'), 10);
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return hashedPassword;
  }

  async createTokens(userId: number, isRefreshToken: boolean) {
    const payload = {
      sub: userId,
      type: isRefreshToken ? 'refresh' : 'access',
    };
    const expiresIn =
      this.configService.get(
        isRefreshToken ? 'JWT_REFRESH_EXPIRATION_TIME' : 'JWT_EXPIRATION_TIME',
      ) ?? 3600;

    return this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }
}
