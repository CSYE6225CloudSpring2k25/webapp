build {
  # sources = ["source.amazon-ebs.ubuntu", "source.googlecompute.ubuntu"]
  sources = ["source.amazon-ebs.ubuntu"]

  # Copying the src/ directory to the instance
  provisioner "file" {
    source      = "./src"
    destination = "/tmp/app"
  }

  provisioner "file" {
    source      = "./src/cloudwatch-config.json"
    destination = "/tmp/cloudwatch-config.json"
  }

  # Provisioning the instance and creating .env 
  provisioner "shell" {
    inline = [
      "sudo apt-get update -y",
      "sudo apt-get install -y unzip jq",

      "if ! command -v aws &> /dev/null; then",
      "  curl \"https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip\" -o \"awscliv2.zip\"",
      "  unzip awscliv2.zip",
      "  sudo ./aws/install",
      "  rm -rf awscliv2.zip aws",
      "fi",
      "aws --version",
      "sudo apt-get install -y nodejs npm",
      "wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb -O /tmp/amazon-cloudwatch-agent.deb",
      "[ -f /tmp/amazon-cloudwatch-agent.deb ] || { echo 'Failed to download CloudWatch Agent'; exit 1; }",
      "sudo dpkg -i /tmp/amazon-cloudwatch-agent.deb || sudo apt-get install -f -y",
      "sudo systemctl enable amazon-cloudwatch-agent",
      # "sudo apt-get install -y mysql-server nodejs npm",
      # "sudo systemctl enable mysql",
      # "sudo systemctl start mysql",
      # "sudo mysql -e \"ALTER USER '${var.DB_USERNAME}'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY '${var.DB_PASSWORD}'; CREATE DATABASE IF NOT EXISTS ${var.DB_NAME}; GRANT ALL PRIVILEGES ON ${var.DB_NAME}.* TO '${var.DB_USERNAME}'@'localhost'; FLUSH PRIVILEGES;\"",
      "sudo useradd -r -s /usr/sbin/nologin csye6225 || true",
      "getent group csye6225 || sudo groupadd csye6225",
      "sudo usermod -a -G csye6225 csye6225",
      "sudo mkdir -p /opt/csye6225/webapp",
      "sudo cp -r /tmp/app/* /opt/csye6225/webapp",
      # Creating .env file 
      # "sudo bash -c 'echo \"DB_NAME=${var.DB_NAME}\" > /opt/csye6225/webapp/.env'",
      # "sudo bash -c 'echo \"DB_USERNAME=${var.DB_USERNAME}\" >> /opt/csye6225/webapp/.env'",
      # "sudo bash -c 'echo \"DB_PASSWORD=${var.DB_PASSWORD}\" >> /opt/csye6225/webapp/.env'",
      # "sudo bash -c 'echo \"DB_HOST=localhost\" >> /opt/csye6225/webapp/.env'",
      # "sudo bash -c 'echo \"DB_PORT=3306\" >> /opt/csye6225/webapp/.env'",
      # "sudo bash -c 'echo \"PORT=${var.app_port}\" >> /opt/csye6225/webapp/.env'",
      # "sudo bash -c 'echo \"NODE_ENV=production\" >> /opt/csye6225/webapp/.env'",
      # Installing dependencies inside src/
      "cd /opt/csye6225/webapp",
      "sudo npm install",
      "sudo chown -R csye6225:csye6225 /opt/csye6225",
      "sudo chmod -R 750 /opt/csye6225",
      "sudo cp /opt/csye6225/webapp/csye6225.service /etc/systemd/system/csye6225.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable csye6225.service",
      "sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc",
      "sudo mv /tmp/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json",
      "sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json || { echo 'Failed to configure CloudWatch Agent'; exit 1; }"
    ]
  }
}