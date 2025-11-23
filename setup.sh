#!/bin/bash

# AWS Lightsail 인스턴스 초기 설정 스크립트 (간소화 버전)
# Node.js v22, Python 3.13, 방화벽이 이미 설정된 환경용

set -e

echo "🚀 은평구 아카이브 시스템 설치를 시작합니다..."

# 현재 설치된 버전 확인
echo "📋 현재 환경 확인 중..."
echo "Node.js 버전: $(node --version)"
echo "Python 버전: $(python3 --version)"
echo "npm 버전: $(npm --version)"

# 시스템 패키지 업데이트
echo "📦 시스템 패키지 업데이트 중..."
sudo apt update && sudo apt upgrade -y

# 필수 패키지만 설치 (Node.js, Python은 제외)
echo "🛠 필수 패키지 설치 중..."
sudo apt install -y curl wget git nginx postgresql postgresql-contrib

# PostgreSQL이 설치되어 있는지 확인
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL이 설치되지 않았습니다. 설치를 진행합니다..."
    sudo apt install -y postgresql postgresql-contrib
fi

# PostgreSQL 설정
echo "🗄️ PostgreSQL 설정 중..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# PostgreSQL 사용자 및 데이터베이스 생성 (이미 있으면 오류 무시)
echo "📊 데이터베이스 사용자 및 DB 생성 중..."
sudo -u postgres psql -c "CREATE USER eunpyeong WITH PASSWORD 'eunpyeong123!';" 2>/dev/null || echo "사용자 eunpyeong이 이미 존재합니다."
sudo -u postgres psql -c "CREATE DATABASE eunpyeong_archive OWNER eunpyeong;" 2>/dev/null || echo "데이터베이스 eunpyeong_archive가 이미 존재합니다."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE eunpyeong_archive TO eunpyeong;" 2>/dev/null || echo "권한이 이미 설정되어 있습니다."

# 필수 Python 패키지 확인
echo "🐍 Python 환경 확인 중..."
if ! python3 -c "import venv" 2>/dev/null; then
    echo "python3-venv 설치 중..."
    sudo apt install -y python3-venv
fi

if ! python3 -c "import pip" 2>/dev/null; then
    echo "python3-pip 설치 중..."
    sudo apt install -y python3-pip
fi

echo "✅ 시스템 설정이 완료되었습니다!"
echo ""
echo "🔍 설치된 환경 정보:"
echo "  - Node.js: $(node --version)"
echo "  - npm: $(npm --version)"
echo "  - Python: $(python3 --version)"
echo "  - PostgreSQL: $(sudo -u postgres psql -c 'SELECT version();' -t | head -1 | xargs)"
echo ""
echo "📋 다음 단계를 진행하세요:"
echo "1. 프로젝트를 클론하세요: git clone https://github.com/has-eunpyeong-archive/eunpyeong-archive.git"
echo "2. 프로젝트 디렉터리로 이동: cd eunpyeong-archive"
echo "3. 애플리케이션 설정을 실행하세요: ./deploy.sh"