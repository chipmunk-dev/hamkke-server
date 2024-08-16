import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/login-response.dto';

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
  @Post('login/email')
  async login(@Body() data: LoginUserDto) {
    return await this.authService.login(data);
  }
}
