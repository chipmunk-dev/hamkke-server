## Description

Hamkke Studt Web Server Repository

## URL
-

## Running the app

#### 1. `.env`파일을 프로젝트 루트에 생성 후에 아래의 코드를 복사 & 붙여넣기합니다.
<strong>[Example]</strong>
```.env
PORT=8080

DB_HOST=db
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=example
DB_LOGGING=false

JWT_SECRET=SecretKey
JWT_EXPIRATION_TIME=3600
JWT_REFRESH_EXPIRATION_TIME=604800
SALT_ROUNDS=10
```

#### 2. 서버를 실행하고 데이터베이스를 초기화 합니다.

```bash
# 도커 실행
$ npm run docker:build

# 터미널 접속
$ npm run docker

# 데이터베이스 마이그레이션
$ npm run migration:generate
$ npm run migration:run
```

## API Documents

#### Local
```URL
# .env.port 는 위에서 작성한 env파일의 port번호를 입력합니다.
http://localhost:{.env.port}/api
```

#### Deploy
```URL
...
```
