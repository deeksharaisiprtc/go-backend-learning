User Management System (Golang Backend)

A backend-only User Management System built using Golang, Echo framework, GORM, and PostgreSQL.
This is a learning project focused on REST API development, database integration, soft delete implementation, and unit testing.

📋 Project Overview

This project demonstrates:

✅ Golang backend with Echo framework

✅ PostgreSQL database integration using GORM

✅ REST API with full User CRUD operations

✅ Soft delete functionality (deleted_at)

✅ Proper validation and error handling

✅ Unit tests for all API endpoints

🛠️ Tech Stack
Backend

Language: Golang 1.23

Web Framework: Echo v4

ORM: GORM

Database: PostgreSQL

Validation: go-playground/validator

Testing: Go testing package + testify

📁 Project Structure

.
├── backend/
│   ├── config/
│   │   └── database.go             # Database connection & migration
│   ├── handlers/
│   │   └── user_handler.go         # API route handlers
│   ├── models/
│   │   └── user.go                 # User model (GORM)
│   ├── routes/
│   │   └── routes.go               # API routes
│   ├── tests/
│   │   └── user_test.go            # Unit tests
│   └── main.go                     # Application entry point
│
├── postman/
│   └── user-crud-api.postman_collection.json  # Postman collection for API testing
│
├── .env                            # Environment variables (not committed)
├── go.mod                          # Go dependencies
├── go.sum
├── README.md


🚀 Getting Started
Prerequisites (Windows 11)

Go 1.23+ – https://go.dev/dl/

PostgreSQL 14+ – https://www.postgresql.org/download/windows/

Git – https://git-scm.com/download/win

Visual Studio Code (recommended)

🔧 Database Setup
Step 1: Create Database
CREATE DATABASE user_management;

Step 2: Configure Environment Variables

Create a .env file inside the go-backend directory:

PGHOST=localhost
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=user_management
PGPORT=5432
PORT=8080


Or use a single connection string:

DATABASE_URL=postgres://postgres:your_password@localhost:5432/user_management?sslmode=disable
PORT=8080

📦 Install Dependencies
cd go-backend
go mod download
go mod tidy

▶️ Running the Backend Server
go run main.go


Expected output:

Database connection established successfully
Database migration completed successfully
Server starting on port 8080...

🧪 Running Unit Tests

Run all tests:

go test ./tests -v


Run a specific test:

go test ./tests -run TestCreateUser -v

📡 API Endpoints

All endpoints are prefixed with /api.

Method	Endpoint	Description
POST	/api/users	Create a new user
GET	/api/users	Get all active users
GET	/api/users/:id	Get user by ID
PUT	/api/users/:id	Update user
DELETE	/api/users/:id	Soft delete user
🧪 API Testing with Postman

A Postman collection is provided to make it easy to test and verify all User
CRUD API endpoints.

📂 Location of Postman Collection:
backend/postman/user-crud-api.postman_collection.json

🔹 How to use:
1. Open Postman
2. Click on **Import**
3. Import the file:
   postman/user-crud-api.postman_collection.json
4. Set the base URL (for example):
   http://localhost:8080
5. Test the available API endpoints