#!/bin/bash

# AWS Lightsail 인스턴스 초기 설정 스크립트
# Ubuntu 20.04/22.04 LTS 기준

set -e

echo "🚀 은평구 아카이브 시스템 설치를 시작합니다..."

# 시스템 업데이트
echo "📦 시스템 패키지 업데이트 중..."
sudo apt update && sudo apt upgrade -y

# 필수 패키지 설치
echo "🛠 필수 패키지 설치 중..."
sudo apt install -y curl wget git nginx postgresql postgresql-contrib python3 python3-venv python3-pip

# Node.js 설치 (v18 LTS)
echo "📦 Node.js 설치 중..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL 설정
echo "🗄️ PostgreSQL 설정 중..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# PostgreSQL 사용자 및 데이터베이스 생성
sudo -u postgres psql -c "CREATE USER eunpyeong WITH PASSWORD 'eunpyeong123!';"
sudo -u postgres psql -c "CREATE DATABASE eunpyeong_archive OWNER eunpyeong;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE eunpyeong_archive TO eunpyeong;"

# 방화벽 설정 (포트 80, 443, 22만 허용)
echo "🔥 방화벽 설정 중..."
sudo ufw --force enable
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

echo "✅ 시스템 설정이 완료되었습니다!"
echo "📋 다음 단계를 진행하세요:"
echo "1. 프로젝트를 클론하세요: git clone https://github.com/has-eunpyeong-archive/eunpyeong-archive.git"
echo "2. 프로젝트 디렉터리로 이동: cd eunpyeong-archive"
echo "3. 애플리케이션 설정을 실행하세요: ./deploy.sh"