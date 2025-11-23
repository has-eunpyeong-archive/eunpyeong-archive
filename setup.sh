#!/bin/bash

# AWS Lightsail Initial Setup Script (Simplified Version)
# For environments with Node.js v22, Python 3.13, and firewall pre-configured

set -e

echo "Starting Eunpyeong Archive System Installation..."

# Check currently installed versions
echo "Checking current environment..."
echo "Node.js version: $(node --version)"
echo "Python version: $(python3 --version)"
echo "npm version: $(npm --version)"

# System package update
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages only (excluding Node.js, Python)
echo "Installing essential packages..."
sudo apt install -y curl wget git nginx postgresql postgresql-contrib

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL not found. Installing..."
    sudo apt install -y postgresql postgresql-contrib
fi

# PostgreSQL configuration
echo "Configuring PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create PostgreSQL user and database (ignore errors if already exists)
echo "Creating database user and DB..."
sudo -u postgres psql -c "CREATE USER eunpyeong WITH PASSWORD 'eunpyeong123!';" 2>/dev/null || echo "User eunpyeong already exists."
sudo -u postgres psql -c "CREATE DATABASE eunpyeong_archive OWNER eunpyeong;" 2>/dev/null || echo "Database eunpyeong_archive already exists."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE eunpyeong_archive TO eunpyeong;" 2>/dev/null || echo "Privileges already granted."

# Check essential Python packages
echo "Checking Python environment..."
if ! python3 -c "import venv" 2>/dev/null; then
    echo "Installing python3-venv..."
    sudo apt install -y python3-venv
fi

if ! python3 -c "import pip" 2>/dev/null; then
    echo "Installing python3-pip..."
    sudo apt install -y python3-pip
fi

echo "System setup completed!"
echo ""
echo "Installed environment info:"
echo "  - Node.js: $(node --version)"
echo "  - npm: $(npm --version)"
echo "  - Python: $(python3 --version)"
echo "  - PostgreSQL: $(sudo -u postgres psql -c 'SELECT version();' -t | head -1 | xargs)"
echo ""
echo "Next steps:"
echo "1. Clone the project: git clone https://github.com/has-eunpyeong-archive/eunpyeong-archive.git"
echo "2. Change directory: cd eunpyeong-archive"
echo "3. Run application setup: ./deploy.sh"