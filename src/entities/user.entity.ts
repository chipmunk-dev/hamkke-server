import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({
    description: '유저 비밀번호',
    example: '1234',
    type: String,
    required: true,
    minLength: 8,
  })
  password: string;

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
  profileImageUrl: string;

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
