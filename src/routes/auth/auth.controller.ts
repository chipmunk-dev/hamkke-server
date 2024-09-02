import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserDto } from 'src/routes/users/dto/create-user.dto';
import { LoginUserDto } from 'src/routes/users/dto/login-user.dto';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/login-response.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { GoogleUser } from './types/google-user.type';
import { UserType } from 'src/entities/user.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자를 생성 및 토큰 발급',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: '회원가입에 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '유효성 검사 실패',
  })
  @ApiResponse({
    status: 409,
    description: '이미 존재하는 이메일',
  })
  @Post('signup/email')
  async signup(@Body() data: CreateUserDto) {
    return await this.authService.signup(data);
  }

  @ApiOperation({
    summary: '로그인',
    description: '사용자 인증 및 토큰 발급',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 이메일',
  })
  @ApiResponse({
    status: 401,
    description: '비밀번호 불일치',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login/email')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({
    summary: '구글 로그인',
    description: '구글 로그인 페이지로 이동',
  })
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth() {}

  @ApiExcludeEndpoint()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Request() req) {
    return this.authService.oauthLogin(req.user as GoogleUser, UserType.GOOGLE);
  }

  @ApiOperation({
    summary: '액세스 토큰 재발급',
    description: '리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '새로운 액세스 토큰 발급 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 리프레시 토큰',
  })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
