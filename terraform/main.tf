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

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allows SSH from any IP address
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allows HTTP from any IP address
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # "-1" means all protocols
    cidr_blocks = ["0.0.0.0/0"]
  }
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
                yum install -y docker
                systemctl start docker
                systemctl enable docker
                usermod -aG docker ec2-user
                EOF

  tags = {
    Name = "food-optimizer-server"
  }
}

output "instance_ip" {
  value = aws_instance.food-optimizer-server.public_ip
}