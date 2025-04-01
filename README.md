# webapp

# Health Check API Endpoint

This is a simple backend API for performing health checks using Node.js, Express, and Sequelize. The `/healthz` endpoint monitors the application's health by validating database connectivity and handles various HTTP requests.



---

## **Prerequisites**




Before running this project, ensure you have the following installed:

1. **Node.js** (v16 or higher) and npm
2. **MySQL** database server

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone git@github.com:CSYE6225CloudSpring2k25/webapp.git
cd webapp
cd src
```

### **2. Create a Database**

Before starting the application, create a database named HealthChecks in your PostgreSQL or MySQL server.

For **MySQL**, you can use the following commands:
```sql
CREATE DATABASE HealthChecks;
```

### **3. Create a `.env` File**
In the root of the project folder, create a `.env` file and add the following environment variables:

```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=Use 3306 for MySQL
PORT=8080 # Optional, default is 8080
```

### **4. Install Dependencies**
Install the required Node.js packages by running:
```bash
npm install
```

### **5. Run the Application**
You can run the application using either of the following commands:

- Using Node.js:
  ```bash
  node app.js
  ```

- Using npm (if a `start` script is defined in `package.json`):
  ```bash
  npm start
  ```

The application will start on the default port `8080` or the port specified in the `.env` file. The API will be accessible at:
```
http://localhost:8080/healthz
```

---

## **Testing the API**

### **Using Postman**

1. Open Postman and create a new request.
2. Use the following details:
   - **Method**: `GET`
   - **URL**: `http://localhost:8080/healthz`

#### Test Scenarios:

| Scenario                                    | Expected Status Code | Notes                                |
|--------------------------------------------|----------------------|--------------------------------------|
| Valid `GET` request without body           | `200 OK`             | Health check successful              |
| `GET` request with an empty JSON body      | `400 Bad Request`    | Request body is not allowed          |
| `GET` request with a non-empty JSON body   | `400 Bad Request`    | Request body is not allowed          |
| Invalid JSON `{"name":}`                  | `400 Bad Request`    | Malformed JSON request               |
| Unsupported HTTP method (e.g., `PUT`)      | `405 Method Not Allowed` | Only `GET` is supported            |
| Database unavailable                       | `503 Service Unavailable` | Database connectivity issue       |

---

### **Using Curl**
Here are the `curl` commands for testing the API:

#### **1. Valid `GET` Request (No Payload)**
```bash
curl -vvvv http://localhost:8080/healthz
```
**Expected**: `200 OK`

#### **2. `GET` Request with Empty JSON Body**
```bash
curl -vvvv -X GET -d '{}' -H "Content-Type: application/json" http://localhost:8080/healthz
```
**Expected**: `400 Bad Request`

#### **3. `GET` Request with Non-Empty JSON Body**
```bash
curl -vvvv -X GET -d '{"key":"value"}' -H "Content-Type: application/json" http://localhost:8080/healthz
```
**Expected**: `400 Bad Request`

#### **4. Unsupported HTTP Method (`POST,PUT,PATCH,DELETE,OPTIONS`)**
```bash
curl -vvvv -X POST http://localhost:8080/healthz
```
```bash
curl -vvvv -X PUT http://localhost:8080/healthz
```
```bash
curl -vvvv -X PATCH http://localhost:8080/healthz
```
```bash
curl -vvvv -X DELETE http://localhost:8080/healthz
```
```bash
curl -vvvv -X OPTIONS http://localhost:8080/healthz
```
**Expected**: `405 Method Not Allowed`

#### **5. Database Unavailable**
- Stop the database server and run:
  ```bash
  curl -vvvv http://localhost:8080/healthz
  ```
**Expected**: `503 Service Unavailable`

#### **6. Invalid URL**
```bash
curl -vvvv http://localhost:8080/invalid
```
**Expected**: `404 Not Found`

---

## **Verifying Data in MySQL**
After successfully hitting the API with a `200 OK` response, you can verify the database records using the following MySQL commands:

1. **Open MySQL terminal and select the database:**
   ```sql
   USE HealthChecks;
   ```

2. **Retrieve all records from the `HealthChecks` table:**
   ```sql
   SELECT * FROM HealthChecks;
   ```

This will display all stored health check records.

---

## **Project Details**

### **Database**
- This API uses **PostgreSQL** or **MySQL** as the database.
- The `HealthCheck` table contains:
  - `checkId` (Primary Key, Auto-Increment)
  - `datetime` (UTC Timestamp)

### **Endpoints**
| Endpoint           | Method | Description                           |
|--------------------|--------|---------------------------------------|
| `/healthz`         | `GET`  | Performs a health check               |


# Running Unit Tests for Health Check API

---

## **📌 Prerequisites**

Before running the tests, ensure you have the following installed:

1. **Node.js** (v16 or higher) and npm
2. **Jest** and **Supertest** for testing
3. **A valid Express.js application with Sequelize ORM**

---

## **🚀 Step 1: Install Required Dependencies**

Navigate to your project root directory and install Jest and Supertest:

```bash
npm install --save-dev jest supertest
```

This command installs Jest and Supertest as development dependencies.

Ensure you have `sequelize` and `express` installed as well:

```bash
npm install sequelize express dotenv
```

---

## \*\*🛠 Step 2: Configure Jest in \*\***`package.json`**

Modify your `package.json` file to include Jest in the test script:

```json
"scripts": {
  "test": "jest"
}
```

Now, you can run tests using:

```bash
npm test
```

or explicitly:

```bash
npx jest
```

---

## **🎯 Summary**

| **Step**                     | **Command**                             |
| ---------------------------- | --------------------------------------- |
| **Install Jest & Supertest** | `npm install --save-dev jest supertest` |
| **Run Tests**                | `npm test` or `npx jest`                |


# **Project Setup and Deployment Guide on Digital Ocean**

## **1. Logging into Your Digital Ocean VM**

### **Using SSH (Secure Shell)**

To connect to your Digital Ocean VM, open your terminal and run:

```bash
ssh -i ~/.ssh/digitalocean root@your_droplet_ip
```

- Replace `your_droplet_ip` with the actual IP address of your Digital Ocean droplet.
- If you set up SSH keys, no password will be required.
- If prompted, enter your root password.

---

## **2. Transferring Files to Digital Ocean VM**

### **Using SCP (Secure Copy Protocol)**

To send a file from your local machine to the Digital Ocean VM, use:

```bash
scp -i ~/.ssh/digitalocean (filename) root@your_droplet_ip:/destination/path/
```

For example, to send a script to the `/root/` directory:

```bash
scp -i ~/.ssh/digitalocean firstscript.sh root@your_droplet_ip:/destination/path/
```

---

## **3. Running Files on Digital Ocean VM**

### **Making Scripts Executable**

After transferring files, log into your VM and navigate to the directory where the script is located:

```bash
cd /root/
```

Make the script executable:

```bash
chmod +x firstscript.sh
```

Run the script:

```bash
./firstscript.sh
```

---

## **4. Common Debugging Commands**

### **Checking MySQL Service Status**

```bash
sudo systemctl status mysql
```

### **Restarting MySQL Service**

```bash
sudo systemctl restart mysql
```

### **Checking Node.js Version**

```bash
node -v
npm -v
```

### **Checking Running Processes**

```bash
ps aux | grep node
```

### **Stopping a Running Process (if necessary)**

```bash
kill -9 process_id
```

## (Replace `process_id` with the actual ID from `ps aux`.)

## **8. Closing the SSH Session**

To log out of your Digital Ocean VM, simply type:

```bash
exit
```

testCI
