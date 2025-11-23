#!/bin/bash

# Eunpyeong Archive Application Deployment Script

set -e

PROJECT_DIR="/home/ubuntu/eunpyeong-archive"
BACKEND_DIR="$PROJECT_DIR/backend"
NGINX_CONFIG="/etc/nginx/sites-available/eunpyeong-archive"

echo "Starting Eunpyeong Archive Application Deployment..."

# Check if current directory is project root
if [[ ! -f "package.json" ]]; then
    echo "Please run this script from the project root directory."
    exit 1
fi

# Create environment variables file
echo "Setting up environment variables..."
cat > backend/.env << EOF
DATABASE_URL=postgresql://eunpyeong:eunpyeong123!@localhost/eunpyeong_archive
SECRET_KEY=your-super-secret-key-change-this-in-production
FLASK_ENV=production
UPLOAD_FOLDER=/home/ubuntu/eunpyeong-archive/uploads
EOF

# Create upload directory
mkdir -p uploads

# Install and build Frontend
echo "Installing and building Frontend..."
npm install
npm run build

# Setup Backend Python virtual environment
echo "Setting up Backend Python environment..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Initialize database
echo "Initializing database..."
flask init-db

cd ..

# Create systemd service files - Backend
echo "Setting up systemd services..."
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

# Nginx configuration
echo "Configuring Nginx..."
sudo tee $NGINX_CONFIG > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;
    
    # Maximum client upload size (for research papers)
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

    # File upload/download
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

# Check for processes using port 80 and stop them
echo "Checking for port 80 conflicts..."
if sudo lsof -Pi :80 -sTCP:LISTEN -t >/dev/null ; then
    echo "Port 80 is in use. Checking for Apache..."
    if systemctl is-active --quiet apache2; then
        echo "Stopping Apache server..."
        sudo systemctl stop apache2
        sudo systemctl disable apache2
    fi
    
    # Check for other processes on port 80
    PORT_80_PROCESSES=$(sudo lsof -Pi :80 -sTCP:LISTEN -t 2>/dev/null)
    if [ ! -z "$PORT_80_PROCESSES" ]; then
        echo "Warning: Other processes are using port 80:"
        sudo lsof -Pi :80 -sTCP:LISTEN
        echo "You may need to stop these processes manually."
    fi
fi

# Nginx 사이트 활성화
sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 설정 파일 테스트
sudo nginx -t

# Start and enable services
echo "Starting services..."
sudo systemctl daemon-reload
sudo systemctl enable eunpyeong-backend
sudo systemctl enable eunpyeong-frontend
sudo systemctl enable nginx

# Start backend and frontend first
sudo systemctl start eunpyeong-backend
sudo systemctl start eunpyeong-frontend

# Start nginx with better error handling
echo "Starting Nginx..."
if ! sudo systemctl start nginx; then
    echo "Failed to start Nginx. Checking for port conflicts..."
    sudo ss -tlnp | grep :80
    echo "Attempting to kill processes on port 80..."
    sudo fuser -k 80/tcp || true
    sleep 2
    sudo systemctl start nginx
fi

# Setup healthcheck script
echo "Setting up healthcheck system..."
chmod +x healthcheck.sh
sudo cp healthcheck.sh /usr/local/bin/
sudo touch /var/log/eunpyeong-healthcheck.log
sudo chown ubuntu:ubuntu /var/log/eunpyeong-healthcheck.log

# Add cron job (run healthcheck every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/healthcheck.sh") | crontab -

# Set permissions for management scripts
chmod +x manage.sh
chmod +x ssl-setup.sh

echo "Deployment completed successfully!"
echo "Website is running at http://your-lightsail-ip"
echo ""
echo "Useful commands:"
echo "  - Check backend logs: sudo journalctl -u eunpyeong-backend -f"
echo "  - Check frontend logs: sudo journalctl -u eunpyeong-frontend -f"
echo "  - Check Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "  - Check service status: sudo systemctl status eunpyeong-backend eunpyeong-frontend nginx"