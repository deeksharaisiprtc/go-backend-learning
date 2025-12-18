package tests

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"go-backend-learning/database"
	"go-backend-learning/handlers"
	"go-backend-learning/models"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

var e *echo.Echo

// Setup test environment
func TestMain(m *testing.M) {
	// Set test database environment variables
	os.Setenv("PGHOST", os.Getenv("PGHOST"))
	os.Setenv("PGUSER", os.Getenv("PGUSER"))
	os.Setenv("PGPASSWORD", os.Getenv("PGPASSWORD"))
	os.Setenv("PGDATABASE", os.Getenv("PGDATABASE"))
	os.Setenv("PGPORT", os.Getenv("PGPORT"))

	// Connect to database
	if err := database.Connect(); err != nil {
		panic(fmt.Sprintf("Failed to connect to test database: %v", err))
	}

	// Clean up test data before running tests
	database.DB.Exec("DELETE FROM users")

	// Create Echo instance
	e = echo.New()

	// Run tests
	code := m.Run()

	// Clean up after tests
	database.DB.Exec("DELETE FROM users")

	os.Exit(code)
}

// TestCreateUser tests the POST /users endpoint
func TestCreateUser(t *testing.T) {
	// Clean up before test
	database.DB.Exec("DELETE FROM users")

	reqBody := models.CreateUserRequest{
		Name:     "John Doe",
		Email:    "john@example.com",
		Password: "password123",
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest(http.MethodPost, "/users", bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// Execute handler
	if assert.NoError(t, handlers.CreateUser(c)) {
		assert.Equal(t, http.StatusCreated, rec.Code)

		var response models.UserResponse
		json.Unmarshal(rec.Body.Bytes(), &response)
		assert.Equal(t, "John Doe", response.Name)
		assert.Equal(t, "john@example.com", response.Email)
		assert.NotZero(t, response.ID)
	}
}

// TestCreateUserDuplicateEmail tests creating a user with duplicate email
func TestCreateUserDuplicateEmail(t *testing.T) {
	// Clean up before test
	database.DB.Exec("DELETE FROM users")

	// Create first user
	reqBody := models.CreateUserRequest{
		Name:     "John Doe",
		Email:    "duplicate@example.com",
		Password: "password123",
	}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest(http.MethodPost, "/users", bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	handlers.CreateUser(c)

	// Try to create second user with same email
	req = httptest.NewRequest(http.MethodPost, "/users", bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	handlers.CreateUser(c)
	assert.Equal(t, http.StatusConflict, rec.Code)
}

// TestGetUsers tests the GET /users endpoint
func TestGetUsers(t *testing.T) {
	// Clean up before test
	database.DB.Exec("DELETE FROM users")

	// Create test users
	database.DB.Create(&models.User{Name: "Alice", Email: "alice@test.com", Password: "pass123"})
	database.DB.Create(&models.User{Name: "Bob", Email: "bob@test.com", Password: "pass123"})

	req := httptest.NewRequest(http.MethodGet, "/users", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, handlers.GetUsers(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)

		var users []models.UserResponse
		json.Unmarshal(rec.Body.Bytes(), &users)
		assert.Equal(t, 2, len(users))
	}
}

// TestGetUserByID tests the GET /users/:id endpoint
func TestGetUserByID(t *testing.T) {
	// Clean up before test
	database.DB.Exec("DELETE FROM users")

	// Create test user
	user := models.User{Name: "Charlie", Email: "charlie@test.com", Password: "pass123"}
	database.DB.Create(&user)

	req := httptest.NewRequest(http.MethodGet, "/users/"+fmt.Sprint(user.ID), nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprint(user.ID))

	if assert.NoError(t, handlers.GetUserByID(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)

		var response models.UserResponse
		json.Unmarshal(rec.Body.Bytes(), &response)
		assert.Equal(t, "Charlie", response.Name)
		assert.Equal(t, user.ID, response.ID)
	}
}

// TestGetUserByIDNotFound tests GET /users/:id with non-existent ID
func TestGetUserByIDNotFound(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/users/99999", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("99999")

	handlers.GetUserByID(c)
	assert.Equal(t, http.StatusNotFound, rec.Code)
}

// TestUpdateUser tests the PUT /users/:id endpoint
func TestUpdateUser(t *testing.T) {
	// Clean up before test
	database.DB.Exec("DELETE FROM users")

	// Create test user
	user := models.User{Name: "David", Email: "david@test.com", Password: "pass123"}
	database.DB.Create(&user)

	newName := "David Updated"
	reqBody := models.UpdateUserRequest{Name: &newName}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest(http.MethodPut, "/users/"+fmt.Sprint(user.ID), bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprint(user.ID))

	if assert.NoError(t, handlers.UpdateUser(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)

		var response models.UserResponse
		json.Unmarshal(rec.Body.Bytes(), &response)
		assert.Equal(t, "David Updated", response.Name)
	}
}

// TestDeleteUser tests the DELETE /users/:id endpoint (soft delete)
func TestDeleteUser(t *testing.T) {
	// Clean up before test
	database.DB.Exec("DELETE FROM users")

	// Create test user
	user := models.User{Name: "Eve", Email: "eve@test.com", Password: "pass123"}
	database.DB.Create(&user)

	req := httptest.NewRequest(http.MethodDelete, "/users/"+fmt.Sprint(user.ID), nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprint(user.ID))

	if assert.NoError(t, handlers.DeleteUser(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)

		// Verify user is soft-deleted (should not appear in normal queries)
		var deletedUser models.User
		err := database.DB.First(&deletedUser, user.ID).Error
		assert.Error(t, err) // Should not find the user
	}
}

// TestGetUsersExcludesSoftDeleted tests that GET /users excludes soft-deleted users
func TestGetUsersExcludesSoftDeleted(t *testing.T) {
	// Clean up before test
	database.DB.Exec("DELETE FROM users")

	// Create active user
	database.DB.Create(&models.User{Name: "Active User", Email: "active@test.com", Password: "pass123"})

	// Create and soft-delete user
	deletedUser := models.User{Name: "Deleted User", Email: "deleted@test.com", Password: "pass123"}
	database.DB.Create(&deletedUser)
	database.DB.Delete(&deletedUser)

	req := httptest.NewRequest(http.MethodGet, "/users", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, handlers.GetUsers(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)

		var users []models.UserResponse
		json.Unmarshal(rec.Body.Bytes(), &users)
		assert.Equal(t, 1, len(users)) // Only active user should be returned
		assert.Equal(t, "Active User", users[0].Name)
	}
}

// TestUpdateSoftDeletedUser tests that updating a soft-deleted user returns 404
func TestUpdateSoftDeletedUser(t *testing.T) {
	// Clean up before test
	database.DB.Exec("DELETE FROM users")

	// Create and soft-delete user
	user := models.User{Name: "To Delete", Email: "todelete@test.com", Password: "pass123"}
	database.DB.Create(&user)
	database.DB.Delete(&user)

	newName := "Updated Name"
	reqBody := models.UpdateUserRequest{Name: &newName}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest(http.MethodPut, "/users/"+fmt.Sprint(user.ID), bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprint(user.ID))

	handlers.UpdateUser(c)
	assert.Equal(t, http.StatusNotFound, rec.Code)
}
