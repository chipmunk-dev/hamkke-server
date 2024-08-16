import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({
    type: String,
    description: '사용자의 이메일',
    example: 'test@test.com',
    required: true,
  })
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      '비밀번호는 대문자, 소문자, 숫자 또는 특수 문자를 포함해야 합니다.',
  })
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
