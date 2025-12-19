package config

import (
	"log"

	"go-backend-learning/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// InitTestDB initializes database connection for tests
func InitTestDB() {
	dsn := "host=localhost user=postgres password=postgres dbname=user_management port=5432 sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to test database:", err)
	}

	DB = db

	// Auto-create tables needed for tests
	err = db.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatal("❌ Failed to migrate test database:", err)
	}
}
