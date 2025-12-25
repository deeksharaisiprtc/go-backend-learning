package handlers

import  (
	 "net/http"
     "strconv"
     "strings"

    "go-backend-learning/config"
    "go-backend-learning/models"

    "github.com/go-playground/validator/v10"
    "github.com/labstack/echo/v4"
    "golang.org/x/crypto/bcrypt"
    "gorm.io/gorm"
)

var validate = validator.New()

// CreateUser handles POST /users - Create a new user
func CreateUser(c echo.Context) error {
	var req models.CreateUserRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	// Validate request
	if err := validate.Struct(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	// Create user
	 // Create user
    user := models.User{
        Name:     req.Name,
        Email:    req.Email,
        Password: req.Password,
    }
    
    // Hash the password
    if err := user.HashPassword(); err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to hash password"})
    }

    if err := config.DB.Create(&user).Error; err != nil {
        // Check for unique constraint violation
        if strings.Contains(err.Error(), "duplicate key value violates unique constraint") ||
            strings.Contains(err.Error(), "UNIQUE constraint failed") {
            return c.JSON(http.StatusConflict, map[string]string{"error": "Email already exists"})
        }
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create user", "details": err.Error()})
    }

// GetUsers handles GET /users - Get all active users (exclude soft-deleted)
func GetUsers(c echo.Context) error {
	var users []models.User

	// GORM automatically excludes soft-deleted records
	if err := config.DB.Find(&users).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch users"})
	}

	// Convert to response format (exclude passwords)
	responses := make([]models.UserResponse, len(users))
	for i, user := range users {
		responses[i] = user.ToResponse()
	}

	return c.JSON(http.StatusOK, responses)
}

// GetUserByID handles GET /users/:id - Get user by ID (404 if soft-deleted)
func GetUserByID(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	var user models.User
	// GORM automatically excludes soft-deleted records
	if err := config.DB.First(&user, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch user"})
	}

	return c.JSON(http.StatusOK, user.ToResponse())
}

// UpdateUser handles PUT /users/:id - Update user (do not update soft-deleted users)
func UpdateUser(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	var req models.UpdateUserRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	// Validate request
	if err := validate.Struct(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	// Check if user exists and is not soft-deleted
	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found or has been deleted"})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch user"})
	}

	// Update only provided fields
    updates := make(map[string]interface{})
    if req.Name != nil {
        updates["name"] = *req.Name
    }
    if req.Email != nil {
        updates["email"] = *req.Email
    }
    if req.Password != nil {
        // Hash the new password
        hashedPassword, err := bcrypt.GenerateFromPassword([]byte(*req.Password), bcrypt.DefaultCost)
        if err != nil {
            return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to hash password"})
        }
        updates["password"] = string(hashedPassword)
    }

	// Fetch updated user
	config.DB.First(&user, id)

	return c.JSON(http.StatusOK, user.ToResponse())
}

// DeleteUser handles DELETE /users/:id - Soft delete user (set deleted_at)
func DeleteUser(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	// Check if user exists and is not already soft-deleted
	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch user"})
	}

	// Soft delete the user (GORM sets deleted_at automatically)
	if err := config.DB.Delete(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete user"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "User deleted successfully"})
}

// Helper function to check if string contains substring
func contains(s, substr string) bool {
    return strings.Contains(strings.ToLower(s), strings.ToLower(substr))
}
func containsHelper(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
