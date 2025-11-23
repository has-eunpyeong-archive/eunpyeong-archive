#!/bin/bash

# 은평구 아카이브 시스템 헬스체크 스크립트
# Cron으로 주기적 실행하여 서비스 상태 모니터링

LOGFILE="/var/log/eunpyeong-healthcheck.log"
SERVICES=("eunpyeong-backend" "eunpyeong-frontend" "nginx" "postgresql")

function log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOGFILE
}

function check_service() {
    local service=$1
    if ! systemctl is-active --quiet $service; then
        log_message "WARNING: $service is not running. Attempting to restart..."
        if systemctl restart $service; then
            log_message "SUCCESS: $service has been restarted"
        else
            log_message "ERROR: Failed to restart $service"
        fi
    fi
}

function check_disk_space() {
    local usage=$(df / | awk 'NR==2 {print $(NF-1)}' | sed 's/%//')
    if [ $usage -gt 85 ]; then
        log_message "WARNING: Disk space usage is ${usage}%"
        # 오래된 백업 파일 정리
        find /home/ubuntu/backups -name "*_backup_*" -mtime +3 -delete 2>/dev/null || true
        log_message "INFO: Old backup files cleaned up"
    fi
}

function check_memory() {
    local mem_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ $mem_usage -gt 90 ]; then
        log_message "WARNING: Memory usage is ${mem_usage}%"
    fi
}

function check_web_response() {
    if ! curl -f -s http://localhost:3000 > /dev/null; then
        log_message "ERROR: Web server is not responding"
        systemctl restart eunpyeong-frontend
        log_message "INFO: Frontend service restarted due to web response failure"
    fi
    
    if ! curl -f -s http://localhost:5001/api/documents > /dev/null; then
        log_message "ERROR: API server is not responding"
        systemctl restart eunpyeong-backend
        log_message "INFO: Backend service restarted due to API response failure"
    fi
}

# 메인 헬스체크 실행
log_message "INFO: Starting health check"

# 서비스 상태 확인
for service in "${SERVICES[@]}"; do
    check_service $service
done

# 시스템 리소스 확인
check_disk_space
check_memory

# 웹 응답 확인
check_web_response

log_message "INFO: Health check completed"

# 로그 파일 크기 제한 (1MB 이상시 회전)
if [ -f $LOGFILE ] && [ $(stat -c%s $LOGFILE) -gt 1048576 ]; then
    mv $LOGFILE ${LOGFILE}.old
    touch $LOGFILE
    chown ubuntu:ubuntu $LOGFILE
fi