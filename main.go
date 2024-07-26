package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
)

var db *sql.DB

func main() {
	var err error
	// Initialize the database
	db, err = InitDB("./database.db")
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer db.Close()

	// Seed the database
	// err = SeedData(db)
	// if err != nil {
	// 	log.Fatal("Failed to seed database:", err)
	// }

	tempVars := "8080"
	engine := html.NewFileSystem(http.Dir("./views"), ".html")

	app := fiber.New(fiber.Config{
		Views: engine,
	})
	app.Static("/static", "./static")

	app.Get("/", HandleRenderLandingPage)

	log.Fatal(app.Listen(":" + tempVars))
}

func HandleRenderLandingPage(c *fiber.Ctx) error {
	return c.Render("index", fiber.Map{})
}
