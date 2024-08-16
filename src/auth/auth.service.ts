import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { plainToClass } from 'class-transformer';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async signup(data: CreateUserDto) {
    const user = await this.findUser(data.username);
    if (user) {
      throw new ConflictException('이미 존재하는 이메일입니다');
    }

    const hashedPassword = await this.hashPassword(data.password);
    const createdUser = await this.usersService.createUser({
      ...data,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } =
      await this.createAccessAndRefreshToken(createdUser.id);

    const result = {
      accessToken,
      refreshToken,
      info: {
        userId: createdUser.id,
        nickname: createdUser.nickname,
        profileImageUrl: null,
      },
    };

    return plainToClass(AuthResponseDto, result);
  }

  async login(data: LoginUserDto) {
    const user = await this.findUser(data.username);
    if (!user) {
      return new NotFoundException('존재하지 않는 계정입니다');
    }

    const isMath = await compare(data.password, user.password);
    if (!isMath) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const { accessToken, refreshToken } =
      await this.createAccessAndRefreshToken(user.id);

    const result = {
      accessToken,
      refreshToken,
      info: {
        userId: user.id,
        nickname: user.nickname,
        profileImageUrl: user.profileImageUrl,
      },
    };

    return plainToClass(AuthResponseDto, result);
  }

  async findUser(username: string) {
    return await this.usersService.findUserByUsername(username);
  }

  async createAccessAndRefreshToken(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.createTokens(userId, false),
      this.createTokens(userId, true),
    ]);

    return { accessToken, refreshToken };
  }

  async hashPassword(password: string) {
    const SALT_ROUNDS = parseInt(this.configService.get('SALT_ROUNDS'), 10);
    const hashedPassword = await hash(password, SALT_ROUNDS);

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
