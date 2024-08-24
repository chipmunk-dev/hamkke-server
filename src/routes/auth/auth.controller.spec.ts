import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/routes/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('회원가입 성공 시 AuthResponseDto를 반환해야 합니다', async () => {
      const signupDto = {
        username: 'test@example.com',
        password: 'password123',
        nickname: 'testuser',
      };
      const mockAuthResponse = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
        info: {
          userId: 1,
          nickname: 'testuser',
          profileImageUrl: null,
        },
      };

      jest.spyOn(authService, 'signup').mockResolvedValue(mockAuthResponse);

      const result = await controller.signup(signupDto);

      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('login', () => {
    it('로그인 성공 시 AuthResponseDto를 반환해야 합니다', async () => {
      const loginDto = {
        username: 'test@example.com',
        password: 'password123',
      };
      const mockAuthResponse = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
        info: {
          userId: 1,
          nickname: 'testuser',
          profileImageUrl: 'http://example.com/profile.jpg',
        },
      };

      jest.spyOn(authService, 'login').mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockAuthResponse);
    });
  });
});
