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
  description = "Allow SSH, HTTP, and application ports inbound traffic"

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access"
  }

  # Standard HTTP
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

  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    mongodb_uri = var.mongodb_uri
    jwt_secret  = var.jwt_secret
  }))

  tags = {
    Name = "food-optimizer-server"
  }

  # Wait for the instance to be ready before considering it complete
  provisioner "remote-exec" {
    inline = [
      "echo 'Waiting for Docker to be ready...'",
      "timeout 60 bash -c 'until command -v docker &> /dev/null; do sleep 5; done'",
      "echo 'Waiting for application setup to complete...'",
      "timeout 300 bash -c 'until [ -f /home/ec2-user/setup-complete ]; do sleep 10; done'",
      "echo 'Setup complete! Checking application status...'",
      "docker ps",
      "echo 'Application should be running now!'"
    ]

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file("C:/Users/sscar/.ssh/id_rsa")
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