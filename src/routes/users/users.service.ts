import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async createUser(data: CreateUserDto) {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async findUserByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findUserById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    user.nickname = updateProfileDto.nickname;

    return this.userRepository.save(user);
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const isPasswordValid = await this.authService.comparePassword(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
    }

    const hashedNewPassword = await this.authService.hashPassword(
      changePasswordDto.newPassword,
    );
    user.password = hashedNewPassword;

    await this.userRepository.save(user);
  }
}
