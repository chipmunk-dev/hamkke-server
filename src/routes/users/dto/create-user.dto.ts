import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from 'src/entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: '사용자의 이메일',
    example: 'example@example.com',
    required: true,
  })
  username: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: '사용자의 비밀번호',
    example: 'password',
    required: false,
  })
  password?: string;

  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({
    type: String,
    description: '사용자의 닉네임',
    example: '닉네임',
    required: true,
    minLength: 2,
    maxLength: 10,
  })
  nickname: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: '사용자의 프로필 이미지 URL',
    example: 'https://example.com/image.png',
    required: false,
  })
  profileImageUrl?: string;

  @IsOptional()
  @IsEnum(UserType)
  @ApiProperty({
    type: String,
    description: '사용자의 타입',
    example: 'local',
    required: false,
    enum: UserType,
  })
  userType?: UserType;
}
