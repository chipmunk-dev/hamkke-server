import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({ example: 1, description: '사용자 ID' })
  userId: number;

  @ApiProperty({ example: '홍길동', description: '사용자 닉네임' })
  nickname: string;

  @ApiProperty({
    example: 'http://example.com/profile.jpg',
    description: '프로필 이미지 URL',
    nullable: true,
  })
  profileImageUrl: string | null;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: '액세스 토큰',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: '리프레시 토큰',
  })
  refreshToken: string;

  @ApiProperty({ type: UserInfoDto, description: '사용자 정보' })
  info: UserInfoDto;
}
