import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserType {
  LOCAL = 'local',
  GOOGLE = 'google',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: '유저 아이디',
    example: 1,
    type: Number,
    required: true,
    readOnly: true,
  })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  @ApiProperty({
    description: '유저 아이디',
    example: 'hamkke@gmail.com',
    type: String,
    required: true,
  })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    description: '유저 비밀번호',
    example: '1234',
    type: String,
    required: false,
    minLength: 8,
  })
  password: string | null;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @ApiProperty({
    description: '유저 닉네임',
    example: 'hamkke',
    type: String,
    required: true,
    minLength: 2,
  })
  nickname: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  @ApiProperty({
    description: '유저 이미지 URL',
    example: 'https://hamkke.com/image.png',
    type: String,
    required: false,
  })
  profileImageUrl: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.LOCAL,
    nullable: false,
  })
  @ApiProperty({
    description: '유저 타입',
    example: 'local',
    type: 'enum',
    default: UserType.LOCAL,
    enum: UserType,
    required: true,
  })
  userType: UserType;

  @UpdateDateColumn()
  @ApiProperty({
    description: '유저 업데이트 날짜',
    example: '2021-01-01',
    type: Date,
    required: true,
  })
  updatedAt: Date;

  @CreateDateColumn()
  @ApiProperty({
    description: '유저 회원가입 날짜',
    example: '2020-01-01',
    type: Date,
    required: true,
  })
  createdAt: Date;
}
