variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "project_name" {
  type    = string
  default = "csye6225"
}

variable "DB_PASSWORD" {
  type      = string
  sensitive = true
  default   = "root"
}

variable "DB_NAME" {
  type    = string
  default = "HealthChecks"
}

variable "DB_USERNAME" {
  type    = string
  default = "root"
}

variable "app_port" {
  type    = string
  default = "8080"
}

variable "ami_users" {
  type    = list(string)
  default = ["222634376924"]
}

variable "source_ami" {
  type    = string
  default = "ami-04b4f1a9cf54c11d0"
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}