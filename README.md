# User Management System - Full Stack (Golang + React)

A complete full-stack application with a **Golang backend** (Echo + GORM + PostgreSQL) and **React frontend** for User CRUD operations with soft-delete functionality. This is a learning project for understanding Golang backend development, REST APIs, and database integration.

## 📋 Project Overview

This project demonstrates:
- ✅ **Golang backend** with Echo framework and GORM ORM
- ✅ **PostgreSQL database** with soft delete support
- ✅ **REST API** with all CRUD operations
- ✅ **React frontend** with TypeScript and modern UI components
- ✅ **Unit tests** for all API endpoints
- ✅ **Soft delete pattern** (records never physically deleted)

## 🛠️ Tech Stack

### Backend
- **Language**: Golang 1.23
- **Web Framework**: Echo v4
- **ORM**: GORM
- **Database**: PostgreSQL
- **Validation**: go-playground/validator
- **Testing**: Go testing package + testify

### Frontend
- **Framework**: React 19 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Shadcn/UI + Radix UI
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite

## 📁 Project Structure

```
.
├── go-backend/                 # Golang backend
│   ├── models/
│   │   └── user.go            # User model with GORM
│   ├── handlers/
│   │   └── user.go            # API route handlers
│   ├── database/
│   │   └── database.go        # Database connection & migration
│   ├── tests/
│   │   └── user_test.go       # Unit tests
│   ├── main.go                # Entry point
│   ├── go.mod                 # Go dependencies
│   └── go.sum
│
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── lib/
│   │   │   ├── api.ts         # API client
│   │   │   └── types.ts       # TypeScript types
│   │   ├── pages/
│   │   │   └── users.tsx      # User management page
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
│
├── server/                     # Node.js proxy server
│   ├── index.ts
│   └── routes.ts              # Proxies /api to Go backend
│
├── package.json               # Node.js dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites

**On Windows 11**:
1. **Node.js 16+**: [Download from nodejs.org](https://nodejs.org/)
2. **Go 1.23+**: [Download from go.dev](https://go.dev/dl/)
3. **PostgreSQL 14+**: [Download from postgresql.org](https://www.postgresql.org/download/windows/)
4. **Git**: [Download from git-scm.com](https://git-scm.com/download/win)
5. **Visual Studio Code** (recommended): [Download from code.visualstudio.com](https://code.visualstudio.com/)

### Installation Steps

#### Step 1: Clone/Download the Project

```bash
cd path\to\project
```

#### Step 2: Set Up PostgreSQL Database

1. **Start PostgreSQL** (use pgAdmin or command line)
2. **Create a database**:
   ```sql
   CREATE DATABASE user_management;
   ```

3. **Create a `.env` file** in the `go-backend` folder:
   ```bash
   cd go-backend
   notepad .env
   ```

4. **Add database credentials** to `.env`:
   ```env
   PGHOST=localhost
   PGUSER=postgres
   PGPASSWORD=your_password_here
   PGDATABASE=user_management
   PGPORT=5432
   PORT=8080
   ```

   Or use a single `DATABASE_URL`:
   ```env
   DATABASE_URL=postgres://postgres:your_password@localhost:5432/user_management?sslmode=disable
   PORT=8080
   ```

#### Step 3: Install Backend Dependencies

```bash
cd go-backend
go mod download
go mod tidy
```

#### Step 4: Install Frontend Dependencies

```bash
# Go back to root directory
cd ..
npm install
```

## ▶️ Running the Application

You need to run **TWO servers**: the Go backend and the React frontend.

### Option A: Run Both Servers (Recommended)

**Terminal 1 - Start Go Backend**:
```bash
cd go-backend
go run main.go
```

You should see:
```
Database connection established successfully
Database migration completed successfully
Server starting on port 8080...
```

**Terminal 2 - Start React Frontend**:
```bash
# From project root
npm run dev:client
```

You should see:
```
VITE v7.1.12  ready in XXX ms
➜  Local:   http://localhost:5000/
```

**Open in browser**: `http://localhost:5000`

### Option B: Run with Node.js Proxy (Alternative)

This runs a Node.js server that proxies API requests to the Go backend.

**Terminal 1 - Start Go Backend**:
```bash
cd go-backend
go run main.go
```

**Terminal 2 - Start Full Stack**:
```bash
# From project root
npm run dev
```

**Open in browser**: `http://localhost:5000`

## 🧪 Running Tests

### Backend Unit Tests

The Go backend includes comprehensive unit tests for all endpoints.

```bash
cd go-backend
go test ./tests -v
```

**Expected output**:
```
=== RUN   TestCreateUser
--- PASS: TestCreateUser (0.05s)
=== RUN   TestCreateUserDuplicateEmail
--- PASS: TestCreateUserDuplicateEmail (0.03s)
=== RUN   TestGetUsers
--- PASS: TestGetUsers (0.02s)
=== RUN   TestGetUserByID
--- PASS: TestGetUserByID (0.02s)
=== RUN   TestGetUserByIDNotFound
--- PASS: TestGetUserByIDNotFound (0.01s)
=== RUN   TestUpdateUser
--- PASS: TestUpdateUser (0.03s)
=== RUN   TestDeleteUser
--- PASS: TestDeleteUser (0.02s)
=== RUN   TestGetUsersExcludesSoftDeleted
--- PASS: TestGetUsersExcludesSoftDeleted (0.03s)
=== RUN   TestUpdateSoftDeletedUser
--- PASS: TestUpdateSoftDeletedUser (0.02s)
PASS
ok      go-backend-learning/tests       0.456s
```

**Run specific test**:
```bash
go test ./tests -run TestCreateUser -v
```

### Frontend Type Checking

```bash
npm run check
```

## 📡 API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| **POST** | `/api/users` | Create a new user | `{"name": "string", "email": "string", "password": "string"}` |
| **GET** | `/api/users` | Get all active users (excludes soft-deleted) | - |
| **GET** | `/api/users/:id` | Get user by ID (404 if soft-deleted) | - |
| **PUT** | `/api/users/:id` | Update user (cannot update soft-deleted) | `{"name": "string", "email": "string", "password": "string"}` |
| **DELETE** | `/api/users/:id` | Soft delete user (sets `deleted_at`) | - |

### Example API Calls (using curl or Postman)

**Create User**:
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

**Get All Users**:
```bash
curl http://localhost:8080/api/users
```

**Get User by ID**:
```bash
curl http://localhost:8080/api/users/1
```

**Update User**:
```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Updated\"}"
```

**Soft Delete User**:
```bash
curl -X DELETE http://localhost:8080/api/users/1
```

## 💾 Database Schema

### User Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-generated user ID |
| `name` | VARCHAR | NOT NULL | User's full name |
| `email` | VARCHAR | UNIQUE, NOT NULL | User's email address |
| `password` | VARCHAR | NOT NULL | User's password (store hashed in production!) |
| `created_at` | TIMESTAMP | NOT NULL | Record creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | Record last update timestamp |
| `deleted_at` | TIMESTAMP | NULL | Soft delete timestamp (NULL = active) |

**Indexes**:
- Primary key on `id`
- Unique index on `email`
- Index on `deleted_at` (for soft delete queries)

## 🔒 Understanding Soft Delete

This application implements the **soft delete** pattern using GORM:

- Records are **never physically removed** from the database
- When a user is "deleted", the `deleted_at` field is set to the current timestamp
- GORM automatically excludes soft-deleted records from all queries
- Soft-deleted records can be restored by clearing the `deleted_at` field

**Benefits**:
- ✅ Maintains data integrity and audit trails
- ✅ Allows data recovery if needed
- ✅ Complies with data retention policies
- ✅ Production-standard practice

**How it works in GORM**:
```go
// Soft delete (sets deleted_at to current time)
db.Delete(&user)

// Normal queries automatically exclude soft-deleted records
db.Find(&users) // Only returns non-deleted users

// To include soft-deleted records (for admin views)
db.Unscoped().Find(&users)

// Permanently delete (hard delete - use with caution!)
db.Unscoped().Delete(&user)
```

## 🎨 Features

### User Management Dashboard

#### View Users
- Table displaying all active users
- Real-time statistics (Total, Active, Soft Deleted)
- Search functionality to filter by name or email
- Status badges indicating user state

#### Create User
- Modal form with validation
- Required fields: name, email, password
- Email uniqueness validation
- Toast notifications for success/error

#### Update User
- Edit user details via modal
- Partial updates supported
- Cannot update soft-deleted users (404 error)
- Password is optional when updating

#### Soft Delete User
- Confirmation dialog prevents accidental deletion
- Sets `deleted_at` timestamp in database
- User no longer appears in standard queries
- Can be restored (requires admin functionality)

## 🐛 Troubleshooting

### Backend Issues

**Error: "failed to connect to database"**
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Ensure database `user_management` exists

**Error: "bind: address already in use"**
```bash
# Kill process on port 8080 (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process -Force
```

**Error: "module not found"**
```bash
cd go-backend
go mod tidy
```

### Frontend Issues

**Error: "Module not found"**
```bash
# Delete node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

**Port 5000 already in use**
```bash
# Kill process on port 5000 (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

**API requests fail with "503 Service Unavailable"**
- Make sure the Go backend is running on port 8080
- Check `go-backend/main.go` is running without errors

## 📚 Learning Outcomes

This project teaches you:

### Backend (Golang)
- ✅ Golang project structure and module management
- ✅ REST API design with Echo framework
- ✅ Database operations with GORM ORM
- ✅ PostgreSQL integration and migrations
- ✅ Request validation and error handling
- ✅ Soft delete implementation
- ✅ Unit testing with Go testing package
- ✅ Environment variable configuration

### Frontend (React + TypeScript)
- ✅ React hooks and component composition
- ✅ TypeScript for type safety
- ✅ API integration with fetch
- ✅ Form handling with validation (React Hook Form + Zod)
- ✅ State management with TanStack Query
- ✅ Modern UI with Shadcn/UI components
- ✅ Responsive design with Tailwind CSS

### Full Stack Concepts
- ✅ Frontend-backend communication
- ✅ RESTful API principles
- ✅ CRUD operations
- ✅ Database design and relationships
- ✅ Authentication patterns (ready for JWT implementation)

## 🔐 Security Notes

**⚠️ IMPORTANT**: This is a **learning project**. For production use:

1. **Hash passwords**: Use `bcrypt` to hash passwords before storing
   ```go
   import "golang.org/x/crypto/bcrypt"
   
   hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
   ```

2. **Add authentication**: Implement JWT or session-based auth
3. **Add HTTPS**: Use TLS certificates in production
4. **Add rate limiting**: Prevent brute force attacks
5. **Validate input**: Already implemented, but review for security
6. **Add CORS**: Configure proper CORS policies
7. **Environment variables**: Never commit `.env` files to Git

## 🌐 Git Workflow & Branching (For Learning)

To practice professional Git workflow:

### Create a New Branch
```bash
git checkout -b task/user-crud-delete
```

### Make Changes and Commit
```bash
git add .
git commit -m "feat: implement user CRUD with soft delete"
```

### Push to GitHub
```bash
git push origin task/user-crud-delete
```

### Create a Pull Request
1. Go to your GitHub repository
2. Click "Pull Requests" > "New Pull Request"
3. Select `task/user-crud-delete` → `main`
4. Add description:
   ```
   ## What I Learned
   - Implemented User CRUD operations with Echo and GORM
   - Learned soft delete pattern and database migrations
   - Wrote unit tests for all API endpoints
   - Built React frontend to consume the API
   
   ## Testing
   - All unit tests pass: `go test ./tests -v`
   - Manual testing with Postman completed
   ```
5. Submit the PR

## 🚀 Next Steps

1. **Add authentication**: Implement JWT-based auth
2. **Add authorization**: Role-based access control (admin, user)
3. **Add password hashing**: Use bcrypt for security
4. **Add pagination**: For large user lists
5. **Add filtering**: Filter users by status, date, etc.
6. **Add restore endpoint**: `POST /api/users/:id/restore`
7. **Add middleware**: Logging, rate limiting, CORS
8. **Deploy to production**: Use Docker, Kubernetes, or cloud services

## 📖 Additional Resources

### Golang
- [Golang Documentation](https://go.dev/doc/)
- [Echo Framework Guide](https://echo.labstack.com/docs)
- [GORM Documentation](https://gorm.io/docs/)
- [Go Testing Guide](https://go.dev/doc/tutorial/add-a-test)

### Frontend
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Shadcn/UI](https://ui.shadcn.com/)

### Database
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [SQL Tutorial](https://www.w3schools.com/sql/)

## 📝 License

MIT

---

**Built with ❤️ for learning Golang backend development**

Happy coding! 🚀
