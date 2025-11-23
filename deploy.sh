#!/bin/bash

# 은평구 아카이브 애플리케이션 배포 스크립트

set -e

PROJECT_DIR="/home/ubuntu/eunpyeong-archive"
BACKEND_DIR="$PROJECT_DIR/backend"
NGINX_CONFIG="/etc/nginx/sites-available/eunpyeong-archive"

echo "🚀 은평구 아카이브 애플리케이션 배포를 시작합니다..."

# 현재 디렉터리가 프로젝트 루트인지 확인
if [[ ! -f "package.json" ]]; then
    echo "❌ 프로젝트 루트 디렉터리에서 실행해주세요."
    exit 1
fi

# 환경 변수 파일 생성
echo "📝 환경 변수 설정 중..."
cat > backend/.env << EOF
DATABASE_URL=postgresql://eunpyeong:eunpyeong123!@localhost/eunpyeong_archive
SECRET_KEY=your-super-secret-key-change-this-in-production
FLASK_ENV=production
UPLOAD_FOLDER=/home/ubuntu/eunpyeong-archive/uploads
EOF

# 업로드 디렉터리 생성
mkdir -p uploads

# Frontend 설치 및 빌드
echo "🔧 Frontend 설치 및 빌드 중..."
npm install
npm run build

# Backend Python 가상환경 설정
echo "🐍 Backend Python 환경 설정 중..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 데이터베이스 초기화
echo "🗄️ 데이터베이스 초기화 중..."
flask init-db

cd ..

# systemd 서비스 파일 생성 - Backend
echo "⚙️ systemd 서비스 설정 중..."
sudo tee /etc/systemd/system/eunpyeong-backend.service > /dev/null << EOF
[Unit]
Description=Eunpyeong Archive Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=$BACKEND_DIR
Environment=PATH=$BACKEND_DIR/venv/bin
ExecStart=$BACKEND_DIR/venv/bin/gunicorn --bind 127.0.0.1:5001 --workers 3 app:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# systemd 서비스 파일 생성 - Frontend
sudo tee /etc/systemd/system/eunpyeong-frontend.service > /dev/null << EOF
[Unit]
Description=Eunpyeong Archive Frontend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=$PROJECT_DIR
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Nginx 설정
echo "🌐 Nginx 설정 중..."
sudo tee $NGINX_CONFIG > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;
    
    # 클라이언트 최대 업로드 크기 (논문 파일용)
    client_max_body_size 100M;

    # Frontend (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 파일 업로드/다운로드
    location /uploads/ {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Nginx 사이트 활성화
sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 설정 파일 테스트
sudo nginx -t

# 서비스 시작 및 활성화
echo "🔄 서비스 시작 중..."
sudo systemctl daemon-reload
sudo systemctl enable eunpyeong-backend
sudo systemctl enable eunpyeong-frontend
sudo systemctl enable nginx

sudo systemctl start eunpyeong-backend
sudo systemctl start eunpyeong-frontend
sudo systemctl restart nginx

# 헬스체크 스크립트 설정
echo "⚙️ 헬스체크 시스템 설정 중..."
chmod +x healthcheck.sh
sudo cp healthcheck.sh /usr/local/bin/
sudo touch /var/log/eunpyeong-healthcheck.log
sudo chown ubuntu:ubuntu /var/log/eunpyeong-healthcheck.log

# Cron 작업 추가 (5분마다 헬스체크 실행)
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/healthcheck.sh") | crontab -

# 관리 스크립트 권한 설정
chmod +x manage.sh
chmod +x ssl-setup.sh

echo "✅ 배포가 완료되었습니다!"
echo "🌐 웹사이트가 http://your-lightsail-ip 에서 실행 중입니다."
echo ""
echo "📋 유용한 명령어:"
echo "  - 백엔드 로그 확인: sudo journalctl -u eunpyeong-backend -f"
echo "  - 프론트엔드 로그 확인: sudo journalctl -u eunpyeong-frontend -f"
echo "  - Nginx 로그 확인: sudo tail -f /var/log/nginx/error.log"
echo "  - 서비스 상태 확인: sudo systemctl status eunpyeong-backend eunpyeong-frontend nginx"