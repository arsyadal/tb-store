package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// Define the Item struct
type Item struct {
    ID          int     `json:"id" gorm:"primaryKey"`
    Name        string  `json:"name"`
    Quantity    int     `json:"quantity"`
    Image       string  `json:"image"`
    Price       float64 `json:"price"`
    Description string  `json:"description"` // New column
}

// Define the User struct
type User struct {
    ID       int    `json:"id" gorm:"primaryKey"`
    Email    string `json:"email"`
    Password string `json:"password"`
}

var db *gorm.DB
var err error

func init() {
    dsn := os.Getenv("_N")
    if dsn == "" {
        dsn = "root:@tcp(localhost:3306)/testgo?charset=utf8mb4&parseTime=True&loc=Local"
    }
    db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    if err := db.AutoMigrate(&Item{}, &User{}); err != nil {
        log.Fatal("Failed to migrate database:", err)
    }
}

func getItems(c *gin.Context) {
    var items []Item
    if result := db.Find(&items); result.Error != nil {
        c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Failed to retrieve items"})
        return
    }
    c.IndentedJSON(http.StatusOK, items)
}

func postItem(c *gin.Context) {
    var newItem Item

    if err := c.BindJSON(&newItem); err != nil {
        c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Invalid request payload"})
        return
    }

    if result := db.Create(&newItem); result.Error != nil {
        c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Failed to create item"})
        return
    }
    c.IndentedJSON(http.StatusCreated, newItem)
}

func getItemByID(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
        return
    }

    var item Item
    if result := db.First(&item, id); result.Error != nil {
        c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Item not found"})
        return
    }

    c.IndentedJSON(http.StatusOK, item)
}

func updateItem(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
        return
    }

    var updatedItem Item
    if err := c.BindJSON(&updatedItem); err != nil {
        c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Invalid request payload"})
        return
    }

    var item Item
    if result := db.First(&item, id); result.Error != nil {
        c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Item not found"})
        return
    }

    item.Name = updatedItem.Name
    item.Quantity = updatedItem.Quantity
    item.Image = updatedItem.Image
    item.Price = updatedItem.Price
    item.Description = updatedItem.Description // Update new column
    if result := db.Save(&item); result.Error != nil {
        c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Failed to update item"})
        return
    }

    c.IndentedJSON(http.StatusOK, item)
}

func deleteItem(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
        return
    }

    var item Item
    if result := db.First(&item, id); result.Error != nil {
        c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Item not found"})
        return
    }

    if result := db.Delete(&item); result.Error != nil {
        c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete item"})
        return
    }
    c.IndentedJSON(http.StatusOK, gin.H{"message": "Item deleted"})
}

func registerUser(c *gin.Context) {
    var newUser User

    if err := c.BindJSON(&newUser); err != nil {
        c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Invalid request payload"})
        return
    }

    if result := db.Create(&newUser); result.Error != nil {
        c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Failed to register user"})
        return
    }
    c.IndentedJSON(http.StatusCreated, newUser)
}

func loginUser(c *gin.Context) {
    var loginDetails User

    if err := c.BindJSON(&loginDetails); err != nil {
        c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Invalid request payload"})
        return
    }

    var user User
    if result := db.Where("email = ? AND password = ?", loginDetails.Email, loginDetails.Password).First(&user); result.Error != nil {
        c.IndentedJSON(http.StatusUnauthorized, gin.H{"message": "Invalid email or password"})
        return
    }

    c.IndentedJSON(http.StatusOK, gin.H{"message": "Login successful"})
}

func searchItems(c *gin.Context) {
    query := c.Query("q")
    var items []Item
    if result := db.Where("name LIKE ?", "%"+query+"%").Find(&items); result.Error != nil {
        c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Failed to search items"})
        return
    }
    c.IndentedJSON(http.StatusOK, items)
}

func main() {
    router := gin.Default()
    router.Use(cors.Default()) // Enable CORS
    router.GET("/", func(c *gin.Context) {
        c.String(http.StatusOK, "Welcome to the Item API!")
    })
    router.GET("/items", getItems)
    router.GET("/items/:id", getItemByID)
    router.POST("/items", postItem)
    router.PUT("/items/:id", updateItem)
    router.DELETE("/items/:id", deleteItem)
    router.POST("/register", registerUser)
    router.POST("/login", loginUser)
    router.GET("/search", searchItems) // Tambahkan rute pencarian

    srv := &http.Server{
        Addr:    "localhost:8080",
        Handler: router,
    }

    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("listen: %s\n", err)
        }
    }()

    // Wait for interrupt signal to gracefully shutdown the server with a timeout of 5 seconds.
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    log.Println("Shutting down server...")

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("Server forced to shutdown:", err)
    }

    log.Println("Server exiting")
}