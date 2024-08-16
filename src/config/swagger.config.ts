import { DocumentBuilder } from '@nestjs/swagger';

export default new DocumentBuilder()
  .setTitle('Hamkke API Document')
  .setDescription('함께 서비스 API 문서입니다.')
  .setVersion('1.0')
  .build();
