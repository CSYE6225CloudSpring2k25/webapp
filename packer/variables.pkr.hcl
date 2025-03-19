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
  type        = list(string)
  description = "List of AWS account IDs to share the AMI with"
}

variable "source_ami" {
  type    = string
  default = "ami-04b4f1a9cf54c11d0"
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

# variable "gcp_project_id" {
#   default = "csye6225-452007"
# }

# variable "gcp_source_image" {
#   default = "ubuntu-2404-noble-amd64-v20250214"
# }

# variable "gcp_source_image_family" {
#   default = "ubuntu-2404-noble-amd64"
# }

# variable "gcp_zone" {
#   default = "us-east1-d"
# }

# variable "credentials_file" {
#   description = "GCP Service Account Credentials"
# }

# variable "gcp_machine_type" {
#   default = "n1-standard-1"
# }

# variable "gcp_disk_size" {
#   default = 10
# }

# variable "gcp_disk_type" {
#   default = "pd-standard"
# }

# variable "gcp_network" {
#   default = "default"
# }

# variable "gcp_image_description" {
#   default = "Custom Ubuntu 20.04 server image"
# }

# variable "gcp_image_name" {
#   default = "learn-packer-linux-gcp"
# }

# variable "gcp_image_family" {
#   default = "my-custom-ami"
# }