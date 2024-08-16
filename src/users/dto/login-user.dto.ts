import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: '사용자의 이메일',
    example: 'test@test.com',
    required: true,
  })
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    type: String,
    description: '사용자의 비밀번호',
    example: 'password1234',
    required: true,
    minLength: 8,
    maxLength: 20,
  })
  password: string;
}
