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
  ami_name = "${var.project_name}-ami-{{timestamp}}"
  instance_type = var.instance_type
  region               = var.aws_region
  source_ami    = var.source_ami
  ssh_username  = var.ssh_username
  ami_users     = var.ami_users
}

source "googlecompute" "ubuntu" {
  project_id              = var.gcp_project_id
  source_image            = var.gcp_source_image
  source_image_family     = var.gcp_source_image_family
  credentials_file        = var.credentials_file
  zone                    = var.gcp_zone
  machine_type            = var.gcp_machine_type
  disk_size               = var.gcp_disk_size
  disk_type               = var.gcp_disk_type
  network                 = var.gcp_network
  tags                    = ["csye6225"]
  image_project_id        = var.gcp_project_id
  image_description       = var.gcp_image_description
  image_storage_locations = ["us"]
  image_name              = var.gcp_image_name
  image_family            = var.gcp_image_family
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