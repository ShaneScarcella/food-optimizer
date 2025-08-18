#!/bin/bash

# Log everything for debugging
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "Starting user data script..."

# Update system
yum update -y

# Install required packages
yum install -y docker git

# Start Docker service
systemctl start docker
systemctl enable docker

# Add ec2-user to docker group
usermod -aG docker ec2-user

# Install docker-compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Wait for Docker to be fully ready
sleep 30

# Create a script to run as ec2-user after the system is fully booted
cat << 'SCRIPT_EOF' > /home/ec2-user/setup-app.sh
#!/bin/bash
cd /home/ec2-user

# Clone the repository
git clone https://github.com/ShaneScarcella/food-optimizer.git
cd food-optimizer
git checkout develop

# Create .env file
cat > .env << 'ENV_EOF'
SPRING_DATA_MONGODB_URI=${mongodb_uri}
SPRING_DATA_MONGODB_DATABASE=food-optimizer-db
APPLICATION_SECURITY_JWT_SECRET_KEY=${jwt_secret}
APPLICATION_SECURITY_JWT_EXPIRATION=86400000
ENV_EOF

# Build and start the application
docker-compose up --build -d

# Create completion marker
touch /home/ec2-user/setup-complete

echo "Application setup completed successfully!"
SCRIPT_EOF

# Make the script executable and owned by ec2-user
chown ec2-user:ec2-user /home/ec2-user/setup-app.sh
chmod +x /home/ec2-user/setup-app.sh

# Create a systemd service to run the setup script after boot
cat << 'SERVICE_EOF' > /etc/systemd/system/food-optimizer-setup.service
[Unit]
Description=Food Optimizer Application Setup
After=network.target docker.service
Requires=docker.service

[Service]
Type=oneshot
User=ec2-user
ExecStart=/home/ec2-user/setup-app.sh
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
SERVICE_EOF

# Enable and start the setup service
systemctl daemon-reload
systemctl enable food-optimizer-setup.service
systemctl start food-optimizer-setup.service

echo "User data script completed!"