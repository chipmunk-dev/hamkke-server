import { IsNotEmpty, MinLength } from 'class-validator';
import { LoginUserDto } from './login-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends LoginUserDto {
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
}
