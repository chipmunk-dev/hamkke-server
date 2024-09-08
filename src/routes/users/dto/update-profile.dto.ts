import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: true, description: '변경할 닉네임' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  nickname: string;
}
