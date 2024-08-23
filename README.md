## Description

Hamkke Studt Web Server Repository

## URL
-

## Running the app

#### 0. 사전 준비

a) Docker 설치 <br/>
[Linux](https://docs.docker.com/desktop/install/linux-install/), 
[Mac](https://docs.docker.com/desktop/install/mac-install/), 
[Windows](https://docs.docker.com/desktop/install/windows-install/)

b) Docker 설치 확인 <br/>
  i) 로컬 terminal 실행 <br/>
  ii) docker --version 입력시 버전 정보 확인 <br/>


#### 1. `.env`파일을 프로젝트 루트에 생성 후에 아래의 코드를 복사 & 붙여넣기합니다.
<strong>[Example]</strong><br/>

[.env 예시](https://github.com/chipmunk-dev/hamkke-server/wiki/Create-%60.env%60-Template)

#### 2. 서버를 실행하고 데이터베이스를 초기화 합니다.

```bash
# 도커 실행 (서버 실행)
$ npm run docker:build

# 터미널 접속
$ npm run docker

# 데이터베이스 마이그레이션
$ npm run migration:generate
$ npm run migration:run

# 서버 종료
$ npm run docker:stop
```

## 명령어
npm 을 기본으로 사용합니다. <br />

**prefix: `npm run`**
- `docker:start`: 서버 실행
- `docker:build`: 서버에 변경점이 생겼을 경우 빌드 후 실행
- `docker:restart`: 서버 재 실행
- `docker:log`: 서버의 실시간 로그 확인
- `docker:exec`: 실행중인 도커 컨테이너 터미널 접속
- `docker:stop`: 서버 종료

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
