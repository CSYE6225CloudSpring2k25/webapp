packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.8"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

source "amazon-ebs" "ubuntu" {
  ami_name      = "${var.project_name}-ami-{{timestamp}}"
  instance_type = var.instance_type
  region        = var.aws_region
  source_ami    = var.source_ami
  ssh_username  = var.ssh_username
  ami_users     = var.ami_users
}

# GCP Compute Engine Source (optional, uncomment if needed)
# source "googlecompute" "ubuntu" {
#   project_id          = var.gcp_project_id
#   source_image_family = "ubuntu-2404-lts"
#   zone                = "us-east1-b"
#   image_name          = "${var.project_name}-image-{{timestamp}}"
#   ssh_username        = var.ssh_username
# }