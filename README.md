# 은평구 아카이브 시스템

은평구 지역의 논문, 자료 등을 체계적으로 관리하고 공유하는 웹 기반 아카이브 시스템입니다.

## 주요 기능

- **사용자 관리**: 회원가입, 로그인, 프로필 관리
- **문서 관리**: 논문 업로드, 다운로드, 검색, 분류
- **카테고리 시스템**: 체계적인 자료 분류 및 관리
- **파일 관리**: 안전한 파일 업로드 및 저장
- **통계 기능**: 조회수, 다운로드 수 추적

## 기술 스택

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- React Google Maps API

### Backend

- Python Flask
- SQLAlchemy (ORM)
- PostgreSQL
- JWT 인증
- Gunicorn (WSGI 서버)

### Infrastructure

- Nginx (리버스 프록시)
- systemd (서비스 관리)
- AWS Lightsail 호스팅

## 빠른 시작

### AWS Lightsail 배포 (권장)

1. **인스턴스 생성**

   - Ubuntu 20.04/22.04 LTS
   - 최소 $10/월 플랜 (2GB RAM)
   - 고정 IP 할당

2. **자동 배포**

```bash
# SSH 접속
ssh -i your-key.pem ubuntu@your-lightsail-ip

# 시스템 초기 설정
wget https://raw.githubusercontent.com/has-eunpyeong-archive/eunpyeong-archive/main/setup.sh
chmod +x setup.sh && ./setup.sh

# 프로젝트 배포
git clone https://github.com/has-eunpyeong-archive/eunpyeong-archive.git
cd eunpyeong-archive
chmod +x deploy.sh && ./deploy.sh
```

3. **접속 확인**
   - 웹사이트: `http://your-lightsail-ip`

자세한 배포 가이드는 [QUICKSTART.md](./QUICKSTART.md)를 참고하세요.

### 로컬 개발

```bash
# 1. 저장소 클론
git clone https://github.com/has-eunpyeong-archive/eunpyeong-archive.git
cd eunpyeong-archive

# 2. Frontend 설치 및 실행
npm install
npm run dev

# 3. Backend 설치 및 실행 (새 터미널)
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## 관리 도구

배포 후 시스템 관리를 위한 편리한 명령어들:

```bash
./manage.sh status    # 서비스 상태 확인
./manage.sh restart   # 서비스 재시작
./manage.sh logs      # 로그 확인
./manage.sh backup    # 데이터 백업
./manage.sh update    # 애플리케이션 업데이트
./manage.sh monitor   # 시스템 모니터링
```

## SSL 설정

도메인이 있는 경우 무료 SSL 인증서 설정:

```bash
./ssl-setup.sh your-domain.com
```

## 프로젝트 구조

```
├── app/                    # Next.js 앱 디렉터리
│   ├── archive/           # 아카이브 페이지
│   ├── login/            # 로그인 페이지
│   └── ...
├── backend/               # Flask 백엔드
│   ├── app.py            # 메인 애플리케이션
│   ├── requirements.txt  # Python 의존성
│   └── .env.example      # 환경변수 예시
├── components/            # React 컴포넌트
├── contexts/             # React Context
├── deploy.sh             # 자동 배포 스크립트
├── manage.sh            # 시스템 관리 도구
├── setup.sh             # 초기 시스템 설정
├── ssl-setup.sh         # SSL 설정 스크립트
└── healthcheck.sh       # 헬스체크 스크립트
```

## 시스템 요구사항

### 프로덕션 환경

- Ubuntu 20.04/22.04 LTS
- 최소 2GB RAM
- 60GB+ 디스크 공간
- Node.js 18+
- Python 3.8+
- PostgreSQL 13+

### 개발 환경

- Node.js 18+
- Python 3.8+
- PostgreSQL (로컬 또는 Docker)

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 지원

- 📖 [배포 가이드](./DEPLOYMENT.md)
- 🚀 [빠른 시작](./QUICKSTART.md)
- 🐛 [이슈 신고](https://github.com/has-eunpyeong-archive/eunpyeong-archive/issues)

---

**은평구 아카이브 시스템** - 지역 지식의 체계적 보존과 공유를 위한 디지털 플랫폼
