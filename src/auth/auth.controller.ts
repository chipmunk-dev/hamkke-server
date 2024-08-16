import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '이메일 기반 회원가입',
    description: '사용자에게 정보를 입력받아 회원가입',
  })
  @Post('signup/email')
  async signup(@Body() data: CreateUserDto) {
    return await this.authService.signup(data);
  }

  @ApiOperation({
    summary: '이메일 기반 로그인',
    description: '사용자에게 정보를 입력받아 로그인',
  })
  @Post('login/email')
  async login(@Body() data: LoginUserDto) {
    return await this.authService.login(data);
  }
}
