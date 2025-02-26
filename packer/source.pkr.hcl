packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.8"
      source  = "github.com/hashicorp/amazon"
    }
    googlecompute = {
      version = ">=0.2.0"
      source  = "github.com/hashicorp/googlecompute"
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

source "googlecompute" "ubuntu" {
  project_id              = var.gcp_project_id
  source_image            = "ubuntu-2404-noble-amd64-v20250214"
  source_image_family     = "ubuntu-2404-noble-amd64"
  credentials_file        = var.credentials_file
  zone                    = var.gcp_zone
  machine_type            = "n1-standard-1"
  disk_size               = 10
  disk_type               = "pd-standard"
  network                 = "default"
  tags                    = ["csye6225"]
  image_project_id        = var.gcp_project_id
  image_description       = "Custom Ubuntu 20.04 server image"
  image_storage_locations = ["us"]
  image_name              = "learn-packer-linux-gcp"
  image_family            = "my-custom-ami"
  ssh_username            = var.ssh_username
}

# GCP Compute Engine Source (optional, uncomment if needed)
# source "googlecompute" "ubuntu" {
#   project_id          = var.gcp_project_id
#   source_image_family = "ubuntu-2404-lts"
#   zone                = "us-east1-b"
#   image_name          = "${var.project_name}-image-{{timestamp}}"
#   ssh_username        = var.ssh_username
# }