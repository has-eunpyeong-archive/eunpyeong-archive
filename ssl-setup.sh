#!/bin/bash

# SSL Certificate Setup Script for AWS Lightsail
# Usage: ./ssl-setup.sh your-domain.com

set -e

if [ -z "$1" ]; then
    echo "Please provide a domain name."
    echo "Usage: $0 your-domain.com"
    exit 1
fi

DOMAIN=$1

echo "Starting SSL certificate setup..."
echo "Domain: $DOMAIN"

# Install Certbot
echo "Installing Certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Issue SSL certificate
echo "Issuing SSL certificate..."
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Update Nginx configuration (with automatic redirection)
echo "Updating Nginx configuration..."

# Backup existing configuration
sudo cp /etc/nginx/sites-available/eunpyeong-archive /etc/nginx/sites-available/eunpyeong-archive.backup

# Update with new SSL configuration
sudo tee /etc/nginx/sites-available/eunpyeong-archive > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Maximum client upload size (for research papers)
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

    # File upload/download
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

# Test and restart Nginx configuration
sudo nginx -t
sudo systemctl reload nginx

# Update environment variables
echo "Updating environment variables..."
sudo sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=https://$DOMAIN|" /home/ubuntu/eunpyeong-archive/backend/.env

# Restart backend service
sudo systemctl restart eunpyeong-backend

# Setup automatic renewal
echo "Setting up automatic renewal..."
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

echo "SSL setup completed successfully!"
echo "Website: https://$DOMAIN"
echo "SSL certificates will be automatically renewed."