# 은평구 아카이브 - 빠른 시작 가이드

## AWS Lightsail 배포 (권장)

### 1단계: Lightsail 인스턴스 생성

```bash
# Ubuntu 20.04/22.04 LTS, 최소 $10/월 플랜 (2GB RAM) 선택
# 고정 IP 할당
```

### 2단계: SSH 접속 후 초기 설정

```bash
ssh -i your-key.pem ubuntu@your-lightsail-ip

# 시스템 초기 설정 (PostgreSQL, Node.js, Python 설치)
wget https://raw.githubusercontent.com/has-eunpyeong-archive/eunpyeong-archive/main/setup.sh
chmod +x setup.sh
./setup.sh
```

### 3단계: 프로젝트 배포

```bash
# 프로젝트 클론
git clone https://github.com/has-eunpyeong-archive/eunpyeong-archive.git
cd eunpyeong-archive

# 자동 배포 실행
chmod +x deploy.sh
./deploy.sh
```

### 4단계: 접속 확인

- 웹사이트: `http://your-lightsail-ip`
- 관리 도구: `./manage.sh`

## 로컬 개발 환경

### 필요 조건

- Node.js 18+
- Python 3.8+
- PostgreSQL

### 설정

```bash
# 1. 의존성 설치
npm install
cd backend && pip install -r requirements.txt

# 2. PostgreSQL 데이터베이스 생성
createdb eunpyeong_archive

# 3. 환경 변수 설정
cp backend/.env.example backend/.env
# backend/.env 파일에서 DATABASE_URL 등 수정

# 4. 데이터베이스 초기화
cd backend && flask init-db

# 5. 개발 서버 실행
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && python app.py
```

## 관리 명령어

```bash
./manage.sh status    # 서비스 상태 확인
./manage.sh restart   # 서비스 재시작
./manage.sh logs      # 로그 확인
./manage.sh backup    # 백업 생성
./manage.sh update    # 애플리케이션 업데이트
./manage.sh monitor   # 시스템 모니터링
```

## SSL 설정 (도메인이 있는 경우)

```bash
./ssl-setup.sh your-domain.com
```

더 자세한 내용은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.
