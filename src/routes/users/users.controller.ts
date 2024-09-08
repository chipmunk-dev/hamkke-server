import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from 'src/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '현재 사용자 정보 조회',
    description: '인증된 사용자의 정보를 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 성공',
    type: User, // User 엔티티 타입을 import 해야 합니다.
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {accessToken}',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    return this.usersService.findUserById(req.user.sub);
  }

  @ApiOperation({ summary: '프로필 업데이트' })
  @ApiResponse({ status: 200, description: '프로필 업데이트 성공', type: User })
  @ApiResponse({ status: 400, description: '잘못된 입력 데이터' })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.sub, updateProfileDto);
  }

  @ApiOperation({ summary: '비밀번호 변경' })
  @ApiResponse({ status: 200, description: '비밀번호 변경 성공' })
  @ApiResponse({ status: 400, description: '잘못된 입력 데이터' })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자 또는 현재 비밀번호가 일치하지 않음',
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(req.user.sub, changePasswordDto);
    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }
}
