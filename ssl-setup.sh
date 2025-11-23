#!/bin/bash

# AWS Lightsail에서 도메인 및 SSL 인증서 설정 스크립트
# 사용법: ./ssl-setup.sh your-domain.com

set -e

if [ -z "$1" ]; then
    echo "❌ 도메인을 입력해주세요."
    echo "사용법: $0 your-domain.com"
    exit 1
fi

DOMAIN=$1

echo "🔒 SSL 인증서 설정을 시작합니다..."
echo "도메인: $DOMAIN"

# Certbot 설치
echo "📦 Certbot 설치 중..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# SSL 인증서 발급
echo "🔐 SSL 인증서 발급 중..."
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Nginx 설정 업데이트 (자동 리다이렉션 포함)
echo "🌐 Nginx 설정 업데이트 중..."

# 기존 설정 백업
sudo cp /etc/nginx/sites-available/eunpyeong-archive /etc/nginx/sites-available/eunpyeong-archive.backup

# 새로운 SSL 설정으로 업데이트
sudo tee /etc/nginx/sites-available/eunpyeong-archive > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    
    # SSL 설정
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # 보안 헤더
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # 클라이언트 최대 업로드 크기 (논문 파일용)
    client_max_body_size 100M;

    # Frontend (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # 파일 업로드/다운로드
    location /uploads/ {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Nginx 설정 테스트 및 재시작
sudo nginx -t
sudo systemctl reload nginx

# 환경 변수 업데이트
echo "🔧 환경 변수 업데이트 중..."
sudo sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=https://$DOMAIN|" /home/ubuntu/eunpyeong-archive/backend/.env

# 백엔드 서비스 재시작
sudo systemctl restart eunpyeong-backend

# 자동 갱신 설정
echo "🔄 자동 갱신 설정 중..."
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

echo "✅ SSL 설정이 완료되었습니다!"
echo "🌐 웹사이트: https://$DOMAIN"
echo "🔒 SSL 인증서는 자동으로 갱신됩니다."