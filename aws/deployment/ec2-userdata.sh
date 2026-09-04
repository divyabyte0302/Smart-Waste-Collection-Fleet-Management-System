#!/usr/bin/env bash
# ==============================================================================
# AWS EC2 User Data Bootstrap Script
# Amazon Linux 2 / Amazon Linux 2023 Provisioning for Smart Waste Management
# ==============================================================================
set -euo pipefail

echo "[*] Updating system packages..."
dnf update -y || yum update -y

echo "[*] Installing Node.js 18.x and Git..."
dnf install -y nodejs npm git nginx || {
  curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
  yum install -y nodejs git nginx
}

echo "[*] Installing PM2 process manager..."
npm install -g pm2

echo "[*] Creating application directory..."
mkdir -p /var/www/smart-waste-management
cd /var/www/smart-waste-management

# Clone or deploy repository
# git clone <YOUR_REPO_URL> .

# Setup permissions
chown -R ec2-user:ec2-user /var/www/smart-waste-management

echo "[*] Configuring systemd PM2 service..."
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Configure CloudWatch Unified Agent
dnf install -y amazon-cloudwatch-agent || yum install -y amazon-cloudwatch-agent

echo "[*] Bootstrap completed successfully."
