#!/bin/bash

# Eunpyeong Archive System Management Script

set -e

PROJECT_DIR="/home/ubuntu/eunpyeong-archive"
BACKUP_DIR="/home/ubuntu/backups"

function show_help() {
    echo "Eunpyeong Archive System Management Tool"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  status      - Check all service status"
    echo "  restart     - Restart all services"
    echo "  logs        - View real-time logs"
    echo "  backup      - Backup database and files"
    echo "  update      - Update application"
    echo "  monitor     - Monitor system resources"
    echo "  help        - Show this help message"
}

function check_status() {
    echo "Checking system status..."
    echo ""
    
    echo "=== Service Status ==="
    sudo systemctl status eunpyeong-backend --no-pager -l || true
    echo ""
    sudo systemctl status eunpyeong-frontend --no-pager -l || true
    echo ""
    sudo systemctl status nginx --no-pager -l || true
    echo ""
    sudo systemctl status postgresql --no-pager -l || true
    echo ""
    
    echo "=== Disk Usage ==="
    df -h
    echo ""
    
    echo "=== Memory Usage ==="
    free -h
    echo ""
}

function restart_services() {
    echo "Restarting services..."
    
    sudo systemctl restart eunpyeong-backend
    echo "Backend restarted successfully"
    
    sudo systemctl restart eunpyeong-frontend
    echo "Frontend restarted successfully"
    
    sudo systemctl restart nginx
    echo "Nginx restarted successfully"
    
    echo "All services restarted successfully."
}

function show_logs() {
    echo "Real-time log viewer (press Ctrl+C to exit)"
    echo "Select log to view:"
    echo "1) Backend"
    echo "2) Frontend" 
    echo "3) Nginx"
    echo "4) All"
    
    read -p "Select option (1-4): " choice
    
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
            echo "Invalid selection."
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
    echo "Starting application update..."
    
    cd $PROJECT_DIR
    
    # Pull latest code from Git
    echo "Pulling latest code..."
    git pull origin main
    
    # Update Frontend
    echo "Updating Frontend..."
    npm install
    npm run build
    
    # Update Backend
    echo "Updating Backend..."
    cd backend
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
    
    # Restart services
    echo "Restarting services..."
    sudo systemctl restart eunpyeong-backend
    sudo systemctl restart eunpyeong-frontend
    
    echo "Update completed successfully."
}

function monitor_system() {
    echo "System monitoring (press Ctrl+C to exit)"
    echo ""
    
    while true; do
        clear
        echo "=== System Resource Monitoring ==="
        echo "Time: $(date)"
        echo ""
        
        echo "CPU Usage:"
        top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//'
        echo ""
        
        echo "Memory Usage:"
        free -h | grep "Mem:"
        echo ""
        
        echo "Disk Usage:"
        df -h | grep -E "(Filesystem|/dev/)"
        echo ""
        
        echo "Active Connections:"
        ss -tuln | wc -l
        echo ""
        
        echo "Service Status:"
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