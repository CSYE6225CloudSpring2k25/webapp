#!/bin/bash

set -e  # Exit immediately if any command fails

echo "Starting Automated Application Setup..."

# Step 1: Updating the package lists and upgrading packages
echo "Updating package lists and upgrading system..."
sudo apt update -y && sudo apt upgrade -y

# Step 2: Fixing broken packages if needed
echo "Fixing broken dependencies..."
sudo apt --fix-broken install -y

# Step 3: Removing any existing MySQL installation to prevent conflicts
echo "Removing previous MySQL installation (if any)..."
sudo apt remove --purge mysql-server mysql-client mysql-common mysql-server-core-* mysql-client-core-* -y || true
sudo rm -rf /etc/mysql /var/lib/mysql /var/log/mysql
sudo apt autoremove -y
sudo apt autoclean -y

# Step 4: Installing MySQL Server
echo "Installing MySQL Server..."
sudo apt update -y
sudo apt install mysql-server -y

# Step 5: Start and Enable MySQL Service
echo "Starting and enabling MySQL service..."
sudo systemctl start mysql
sudo systemctl enable mysql

# Step 6: Secure MySQL Installation (Automated)
echo "Securing MySQL installation and setting root password..."
ROOT_PASSWORD="$ROOT_PASSWORD"
sudo mysql --user=root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$ROOT_PASSWORD';
DELETE FROM mysql.user WHERE User='';
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';
FLUSH PRIVILEGES;
EOF
echo "MySQL root password has been set!"

# Step 7: Creating a new database and user
DB_NAME="HealthCheckstest"
DB_USER="$DB_USER"
DB_PASS="$DB_PASS"

echo "Creating database $DB_NAME and user $DB_USER..."
sudo mysql --user=root --password="$ROOT_PASSWORD" <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF
echo "Database and user setup completed!"

# Step 8: Creating a new Linux group
GROUP_NAME="csyegroup"
echo "Creating group $GROUP_NAME..."
sudo groupadd -f $GROUP_NAME  # -f prevents error if group already exists

# Step 9: Creating a new Linux user and assigning to the group
USER_NAME="yash"
echo "Creating user $USER_NAME and adding to group $GROUP_NAME..."
if id "$USER_NAME" &>/dev/null; then
    echo "User $USER_NAME already exists, skipping creation..."
else
    sudo useradd -m -g $GROUP_NAME -s /bin/bash $USER_NAME
    echo "$USER_NAME:$DB_PASS" | sudo chpasswd
    echo "User $USER_NAME created successfully!"
fi

# Step 10: Creating application directory
APP_DIR="/opt/csye6225"
echo "Creating application directory at $APP_DIR..."
sudo mkdir -p $APP_DIR

# Step 11: Ensure unzip is installed before extracting files
echo "Checking if unzip is installed..."
if ! command -v unzip &>/dev/null; then
    echo "Installing unzip..."
    sudo apt install unzip -y
else
    echo "Unzip is already installed."
fi

# Step 11: Unzipping application (if exists)
APP_ZIP="/tmp/app.zip"
if [ -f "$APP_ZIP" ]; then
    echo "Unzipping application..."
    sudo unzip -o $APP_ZIP -d $APP_DIR
else
    echo "Application zip not found at $APP_ZIP, skipping unzip step..."
fi

# Step 12: Updating permissions for application directory
echo "Updating permissions for $APP_DIR..."
sudo chown -R $USER_NAME:$GROUP_NAME $APP_DIR
sudo chmod -R 750 $APP_DIR

echo "Setup completed successfully!"
