import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        JwtService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneByUsername: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('signup', () => {
    it('이미 존재하는 사용자의 경우 오류를 반환한다.', async () => {
      const user: CreateUserDto = {
        username: 'test@test.com',
        password: 'password',
        nickname: 'nickname',
      };

      const findUser: User = {
        id: 1,
        username: 'test@test.com',
        password: 'password',
        nickname: 'nickname',
        profileImageUrl: 'profileImageUrl',
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      jest
        .spyOn(usersService, 'findUserByUsername')
        .mockResolvedValue(findUser);

      try {
        await service.signup(user);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('이미 존재하는 사용자입니다');
        expect(error.getStatus()).toBe(409);
      }
    });

    it('새로운 사용자의 경우 새로운 사용자를 생성한다.', async () => {
      const user: CreateUserDto = {
        username: 'test@test.com',
        password: 'password',
        nickname: 'nickname',
      };

      const createdUser: User = {
        id: 1,
        username: 'test@test.com',
        password: 'hashedPassword',
        nickname: 'nickname',
        profileImageUrl: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      const mockAuthResponse = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
        info: {
          userId: createdUser.id,
          nickname: createdUser.nickname,
          profileImageUrl: null,
        },
      };

      jest.spyOn(usersService, 'findUserByUsername').mockResolvedValue(null);
      jest.spyOn(usersService, 'createUser').mockResolvedValue(createdUser);
      jest.spyOn(service, 'hashPassword').mockResolvedValue('hashedPassword');
      jest.spyOn(service, 'createAccessAndRefreshToken').mockResolvedValue({
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      });

      const result = await service.signup(user);

      expect(usersService.findUserByUsername).toHaveBeenCalledWith(
        user.username,
      );
      expect(usersService.createUser).toHaveBeenCalledWith({
        ...user,
        password: 'hashedPassword',
      });
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('login', () => {
    it('존재하지 않는 사용자의 경우 NotFoundException을 반환한다', async () => {
      const loginDto: LoginUserDto = {
        username: 'nonexistent@test.com',
        password: 'password',
      };

      jest.spyOn(usersService, 'findUserByUsername').mockResolvedValue(null);

      try {
        await service.login(loginDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('존재하지 않는 사용자입니다');
        expect(error.getStatus()).toBe(404);
      }
    });

    it('비밀번호가 일치하지 않는 경우 UnauthorizedException을 반환한다', async () => {
      const loginDto: LoginUserDto = {
        username: 'test@test.com',
        password: 'wrongpassword',
      };

      const user: User = {
        id: 1,
        username: 'test@test.com',
        password: 'hashedPassword',
        nickname: 'nickname',
        profileImageUrl: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      jest.spyOn(usersService, 'findUserByUsername').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      try {
        await service.login(loginDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('비밀번호가 일치하지 않습니다');
        expect(error.getStatus()).toBe(401);
      }
    });

    it('올바른 로그인 정보로 로그인 시 토큰과 사용자 정보를 반환한다', async () => {
      const loginDto: LoginUserDto = {
        username: 'test@test.com',
        password: 'password',
      };

      const user: User = {
        id: 1,
        username: 'test@test.com',
        password: 'hashedPassword',
        nickname: 'nickname',
        profileImageUrl: 'profileImageUrl',
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      const mockAuthResponse = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
        info: {
          userId: user.id,
          nickname: user.nickname,
          profileImageUrl: user.profileImageUrl,
        },
      };

      jest.spyOn(usersService, 'findUserByUsername').mockResolvedValue(user);
      jest.spyOn(service, 'createAccessAndRefreshToken').mockResolvedValue({
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      });

      const result = await service.login(loginDto);

      expect(usersService.findUserByUsername).toHaveBeenCalledWith(
        loginDto.username,
      );
      expect(service.createAccessAndRefreshToken).toHaveBeenCalledWith(user.id);
      expect(result).toEqual(mockAuthResponse);
    });
  });
});
