# main.tf

# Configure the AWS Provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Define variables for your AWS credentials
variable "aws_access_key" {}
variable "aws_secret_key" {}

# Configure the AWS provider with your region and credentials
provider "aws" {
  region     = "us-east-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

resource "aws_security_group" "food-optimizer-sg" {
  name        = "food-optimizer-sg"
  description = "Allow SSH and HTTP inbound traffic"

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access"
  }

  # HTTP access
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP access"
  }

  # Frontend application port
  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Frontend application"
  }

  # Backend API port
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Backend API"
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = {
    Name = "food-optimizer-sg"
  }
}

# Define variables for sensitive data
variable "mongodb_uri" {
  description = "MongoDB connection URI"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

# Define the AWS server (EC2 Instance)
resource "aws_instance" "food-optimizer-server" {
  ami           = "ami-0de716d6197524dd9"
  instance_type = "t3.micro"
  key_name      = "food-optimizer-key"

  vpc_security_group_ids = [aws_security_group.food-optimizer-sg.id]

  user_data = <<-EOF
                #!/bin/bash
                yum update -y
                yum install -y docker git libxcrypt-compat
                systemctl start docker
                systemctl enable docker
                usermod -aG docker ec2-user
                
                # Install docker-compose
                curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
                chmod +x /usr/local/bin/docker-compose
                
                # Wait for docker to be ready
                sleep 30
                
                # Clone repository as ec2-user
                su - ec2-user -c "
                  cd /home/ec2-user
                  git clone https://github.com/ShaneScarcella/food-optimizer.git
                  cd food-optimizer
                  git checkout develop
                  
                  # Create .env file
                  cat > .env << 'EOL'
SPRING_DATA_MONGODB_URI=${var.mongodb_uri}
SPRING_DATA_MONGODB_DATABASE=food-optimizer-db
APPLICATION_SECURITY_JWT_SECRET_KEY=${var.jwt_secret}
APPLICATION_SECURITY_JWT_EXPIRATION=86400000
EOL
                  
                  # Start the application
                  docker-compose up --build -d
                "
                EOF

  tags = {
    Name = "food-optimizer-server"
  }

  # Wait for the instance to be ready before considering it complete
  provisioner "remote-exec" {
    inline = [
      "echo 'Waiting for application to start...'",
      "timeout 300 bash -c 'until docker ps | grep food-optimizer; do sleep 5; done'",
      "echo 'Application containers are running!'"
    ]

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file("./food-optimizer-key.pem")  # Adjust path to your key file
      host        = self.public_ip
    }
  }
}

output "instance_ip" {
  value = aws_instance.food-optimizer-server.public_ip
}

output "frontend_url" {
  value = "http://${aws_instance.food-optimizer-server.public_ip}:5173"
}

output "backend_url" {
  value = "http://${aws_instance.food-optimizer-server.public_ip}:8080"
}