#!/bin/bash

# Eunpyeong Archive System Health Check Script
# Run periodically via Cron to monitor service status

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
        # Clean up old backup files
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

# Main health check execution
log_message "INFO: Starting health check"

# Check service status
for service in "${SERVICES[@]}"; do
    check_service $service
done

# Check system resources
check_disk_space
check_memory

# Check web response
check_web_response

log_message "INFO: Health check completed"

# Log file size limit (rotate if larger than 1MB)
if [ -f $LOGFILE ] && [ $(stat -c%s $LOGFILE) -gt 1048576 ]; then
    mv $LOGFILE ${LOGFILE}.old
    touch $LOGFILE
    chown ubuntu:ubuntu $LOGFILE
fi