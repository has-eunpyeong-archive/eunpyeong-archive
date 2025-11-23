#!/bin/bash

# 은평구 아카이브 시스템 관리 스크립트

set -e

PROJECT_DIR="/home/ubuntu/eunpyeong-archive"
BACKUP_DIR="/home/ubuntu/backups"

function show_help() {
    echo "은평구 아카이브 시스템 관리 도구"
    echo ""
    echo "사용법: $0 [명령어]"
    echo ""
    echo "명령어:"
    echo "  status      - 모든 서비스 상태 확인"
    echo "  restart     - 모든 서비스 재시작"
    echo "  logs        - 실시간 로그 확인"
    echo "  backup      - 데이터베이스 및 파일 백업"
    echo "  update      - 애플리케이션 업데이트"
    echo "  monitor     - 시스템 리소스 모니터링"
    echo "  help        - 이 도움말 표시"
}

function check_status() {
    echo "🔍 시스템 상태 확인 중..."
    echo ""
    
    echo "=== 서비스 상태 ==="
    sudo systemctl status eunpyeong-backend --no-pager -l || true
    echo ""
    sudo systemctl status eunpyeong-frontend --no-pager -l || true
    echo ""
    sudo systemctl status nginx --no-pager -l || true
    echo ""
    sudo systemctl status postgresql --no-pager -l || true
    echo ""
    
    echo "=== 디스크 사용량 ==="
    df -h
    echo ""
    
    echo "=== 메모리 사용량 ==="
    free -h
    echo ""
}

function restart_services() {
    echo "🔄 서비스 재시작 중..."
    
    sudo systemctl restart eunpyeong-backend
    echo "✅ Backend 재시작 완료"
    
    sudo systemctl restart eunpyeong-frontend
    echo "✅ Frontend 재시작 완료"
    
    sudo systemctl restart nginx
    echo "✅ Nginx 재시작 완료"
    
    echo "🎉 모든 서비스 재시작이 완료되었습니다."
}

function show_logs() {
    echo "📋 실시간 로그 확인 (Ctrl+C로 종료)"
    echo "선택할 로그:"
    echo "1) Backend"
    echo "2) Frontend" 
    echo "3) Nginx"
    echo "4) 전체"
    
    read -p "번호를 선택하세요 (1-4): " choice
    
    case $choice in
        1)
            sudo journalctl -u eunpyeong-backend -f
            ;;
        2)
            sudo journalctl -u eunpyeong-frontend -f
            ;;
        3)
            sudo tail -f /var/log/nginx/error.log
            ;;
        4)
            sudo journalctl -u eunpyeong-backend -u eunpyeong-frontend -f
            ;;
        *)
            echo "잘못된 선택입니다."
            ;;
    esac
}

function backup_system() {
    echo "💾 시스템 백업 시작..."
    
    # 백업 디렉터리 생성
    mkdir -p $BACKUP_DIR
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    # 데이터베이스 백업
    echo "📊 데이터베이스 백업 중..."
    sudo -u postgres pg_dump eunpyeong_archive > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
    
    # 업로드된 파일 백업
    echo "📁 업로드 파일 백업 중..."
    cd $PROJECT_DIR
    tar -czf "$BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz" uploads/
    
    echo "✅ 백업 완료:"
    echo "  - 데이터베이스: $BACKUP_DIR/db_backup_$TIMESTAMP.sql"
    echo "  - 파일: $BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz"
    
    # 오래된 백업 정리 (7일 이상)
    find $BACKUP_DIR -name "*_backup_*" -mtime +7 -delete
    echo "🗑️  7일 이상 된 백업 파일을 정리했습니다."
}

function update_app() {
    echo "🔄 애플리케이션 업데이트 시작..."
    
    cd $PROJECT_DIR
    
    # Git에서 최신 코드 가져오기
    echo "📥 최신 코드 가져오는 중..."
    git pull origin main
    
    # Frontend 업데이트
    echo "🔧 Frontend 업데이트 중..."
    npm install
    npm run build
    
    # Backend 업데이트
    echo "🐍 Backend 업데이트 중..."
    cd backend
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
    
    # 서비스 재시작
    echo "🔄 서비스 재시작 중..."
    sudo systemctl restart eunpyeong-backend
    sudo systemctl restart eunpyeong-frontend
    
    echo "✅ 업데이트가 완료되었습니다."
}

function monitor_system() {
    echo "📊 시스템 모니터링 (Ctrl+C로 종료)"
    echo ""
    
    while true; do
        clear
        echo "=== 시스템 리소스 모니터링 ==="
        echo "시간: $(date)"
        echo ""
        
        echo "CPU 사용량:"
        top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//'
        echo ""
        
        echo "메모리 사용량:"
        free -h | grep "Mem:"
        echo ""
        
        echo "디스크 사용량:"
        df -h | grep -E "(Filesystem|/dev/)"
        echo ""
        
        echo "활성 연결:"
        ss -tuln | wc -l
        echo ""
        
        echo "서비스 상태:"
        systemctl is-active eunpyeong-backend eunpyeong-frontend nginx postgresql
        echo ""
        
        sleep 5
    done
}

# 메인 실행 로직
case "${1:-help}" in
    status)
        check_status
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    backup)
        backup_system
        ;;
    update)
        update_app
        ;;
    monitor)
        monitor_system
        ;;
    help|*)
        show_help
        ;;
esac