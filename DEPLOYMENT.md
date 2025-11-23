# 은평구 아카이브 AWS Lightsail 배포 가이드

## 개요

이 프로젝트는 Next.js (Frontend) + Flask (Backend) + PostgreSQL을 단일 AWS Lightsail 인스턴스에서 구동하도록 설계되었습니다.

## 필요 사항

- AWS Lightsail Ubuntu 20.04/22.04 LTS 인스턴스 (최소 2GB RAM 권장)
- 고정 IP 할당
- SSH 키 페어

## 배포 단계

### 1. Lightsail 인스턴스 생성

1. AWS Lightsail 콘솔에서 인스턴스 생성
2. Ubuntu 20.04/22.04 LTS 선택
3. 최소 $10/월 플랜 (2GB RAM, 1 vCPU, 60GB SSD) 선택
4. 고정 IP 할당
5. SSH 키 페어 다운로드 및 보관

### 2. 인스턴스 초기 설정

```bash
# SSH로 인스턴스 접속
ssh -i your-key.pem ubuntu@your-lightsail-ip

# 초기 설정 스크립트 다운로드 및 실행
wget https://raw.githubusercontent.com/has-eunpyeong-archive/eunpyeong-archive/main/setup.sh
chmod +x setup.sh
./setup.sh
```

### 3. 프로젝트 배포

```bash
# 프로젝트 클론
git clone https://github.com/has-eunpyeong-archive/eunpyeong-archive.git
cd eunpyeong-archive

# 배포 스크립트 실행
chmod +x deploy.sh
./deploy.sh
```

### 4. 확인

- 웹사이트: http://your-lightsail-ip
- 관리자 패널에서 테스트 계정 생성 및 로그인 확인
- 파일 업로드/다운로드 기능 테스트

## 시스템 구성

### 포트 구성

- **80**: Nginx (웹서버)
- **3000**: Next.js Frontend (내부)
- **5001**: Flask Backend (내부)
- **5432**: PostgreSQL (내부)

### 서비스 관리

```bash
# 서비스 상태 확인
sudo systemctl status eunpyeong-backend eunpyeong-frontend nginx postgresql

# 서비스 재시작
sudo systemctl restart eunpyeong-backend
sudo systemctl restart eunpyeong-frontend
sudo systemctl restart nginx

# 로그 확인
sudo journalctl -u eunpyeong-backend -f
sudo journalctl -u eunpyeong-frontend -f
sudo tail -f /var/log/nginx/error.log
```

### 파일 저장 위치

- **업로드된 논문**: `/home/ubuntu/eunpyeong-archive/uploads/`
- **데이터베이스**: PostgreSQL 기본 경로
- **로그**: `/var/log/nginx/`, `journalctl`

## 보안 설정

### 방화벽

- 포트 22 (SSH), 80 (HTTP), 443 (HTTPS)만 허용
- 내부 서비스 포트는 localhost에서만 접근 가능

### 데이터베이스

- PostgreSQL은 localhost에서만 접근 가능
- 전용 사용자 계정 사용

## 업데이트 방법

```bash
cd /home/ubuntu/eunpyeong-archive

# 코드 업데이트
git pull origin main

# Frontend 재빌드
npm install
npm run build
sudo systemctl restart eunpyeong-frontend

# Backend 업데이트
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart eunpyeong-backend
```

## 백업

### 데이터베이스 백업

```bash
# 백업 생성
sudo -u postgres pg_dump eunpyeong_archive > backup_$(date +%Y%m%d_%H%M%S).sql

# 백업 복원
sudo -u postgres psql eunpyeong_archive < backup_file.sql
```

### 파일 백업

```bash
# 업로드된 파일 백업
tar -czf uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz uploads/
```

## 문제 해결

### 자주 발생하는 문제

1. **서비스가 시작되지 않는 경우**: `sudo journalctl -u service-name -f`로 로그 확인
2. **데이터베이스 연결 오류**: PostgreSQL 서비스 상태 및 환경 변수 확인
3. **파일 업로드 실패**: Nginx 설정의 `client_max_body_size` 확인
4. **메모리 부족**: 인스턴스 크기 업그레이드 고려

### 모니터링

```bash
# 시스템 리소스 확인
htop
df -h
free -h

# 서비스 상태 확인
sudo systemctl list-units --failed
```

## SSL/HTTPS 설정 (선택사항)

도메인이 있는 경우 Let's Encrypt를 사용하여 SSL 인증서를 설정할 수 있습니다:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```
