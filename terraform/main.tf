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
  region     = "us-east-1" # US East (N. Virginia) is a common default
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

# Define the AWS server (EC2 Instance)
resource "aws_instance" "food-optimizer-server" {
  ami           = "ami-0c55b159cbfafe1f0" # An Amazon Linux 2 AMI with Docker
  instance_type = "t2.micro"             # This is eligible for the AWS Free Tier
  tags = {
    Name = "food-optimizer-server"
  }
}