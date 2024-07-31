package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"

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
	app.Get("/:year", HandleRenderHistoricalPage)

	log.Fatal(app.Listen(":" + tempVars))
}

func HandleRenderLandingPage(c *fiber.Ctx) error {
	return c.Render("index", fiber.Map{})
}

func HandleRenderHistoricalPage(c *fiber.Ctx) error {
	strYear := c.Params("year")

	year, err := strconv.Atoi(c.Params("year"))

	if err != nil {
		return err
	}

	if year < 1860 || year > 2024 {
		fmt.Println("issue with the year.", year)
		return c.Render("historicalError", fiber.Map{})
	}

	type Key struct {
		Title          string
		Information    string
		Shade          int
		HistoricalDesc string
	}

	type Election struct {
		Year               string
		TrueCandidateName  string
		FalseCandidateName string
		Keys               []Key
	}

	election1 := new(Election)
	election1.Year = "1860"
	election1.TrueCandidateName = "Stephen A. Douglas"
	election1.FalseCandidateName = "Abraham Lincoln"
	election1.Keys = []Key{
		{Title: "Key 1: Midterm Gains", Information: "info for 1", Shade: 1, HistoricalDesc: "description of the race"},
		{Title: "Key 2: No Primary Contest", Information: "info for 2", Shade: 4, HistoricalDesc: "description of the race"},
		{Title: "Key 3: Incumbent Seeking Re-election", Information: "info for 3", Shade: 4, HistoricalDesc: "description of the race"},
		{Title: "Key 4: No Third Party", Information: "info for 4", Shade: 4, HistoricalDesc: "description of the race"},
		{Title: "Key 5: Strong Short-Term Economy", Information: "info for 5", Shade: 1, HistoricalDesc: "description of the race"},
		{Title: "Key 6: Strong Long-Term Economy", Information: "info for 6", Shade: 1, HistoricalDesc: "description of the race"},
		{Title: "Key 7: Major Policy Change", Information: "info for 7", Shade: 4, HistoricalDesc: "description of the race"},
		{Title: "Key 8: No Social Unrest", Information: "info for 8", Shade: 4, HistoricalDesc: "description of the race"},
		{Title: "Key 9: No Scandal", Information: "info for 9", Shade: 1, HistoricalDesc: "description of the race"},
		{Title: "Key 10: No Foreign/Military Failure", Information: "info for 10", Shade: 1, HistoricalDesc: "description of the race"},
		{Title: "Key 11: Major Foreign/Military Success", Information: "info for 11", Shade: 4, HistoricalDesc: "description of the race"},
		{Title: "Key 12: Charismatic Incumbent", Information: "info for 12", Shade: 4, HistoricalDesc: "description of the race"},
		{Title: "Key 13: Uncharismatic Challenger", Information: "info for 13", Shade: 1, HistoricalDesc: "description of the race"},
	}

	election2 := new(Election)
	election2.Year = "1864"
	election2.TrueCandidateName = "Abraham Lincoln"
	election2.FalseCandidateName = "George McClellan"
	election2.Keys = []Key{
		{Title: "Key 1: Midterm Gains", Information: "info for 1", Shade: 1, HistoricalDesc: "description of the race"},
		{Title: "Key 2: No Primary Contest", Information: "info for 2", Shade: 1, HistoricalDesc: "description of the race"},
		{Title: "Key 3: Incumbent Seeking Re-election", Information: "info for 3", Shade: 1, HistoricalDesc: "description of the race"},
		{Title: "Key 4: No Third Party", Information: "info for 4", Shade: 1, HistoricalDesc: "description of the race"},
		{Title: "Key 5: Strong Short-Term Economy", Information: "info for 5", Shade: 1, HistoricalDesc: "description of the race"},
		{Title: "Key 6: Strong Long-Term Economy", Information: "info for 6", Shade: 4, HistoricalDesc: "description of the race"},
		{Title: "Key 7: Major Policy Change", Information: "info for 7", Shade: 1, HistoricalDesc: "description of the race"},
		{Title: "Key 8: No Social Unrest", Information: "info for 8", Shade: 4, HistoricalDesc: "description of the race"},
		{Title: "Key 9: No Scandal", Information: "info for 9", Shade: 1, HistoricalDesc: "description of the race"},
		{Title: "Key 10: No Foreign/Military Failure", Information: "info for 10", Shade: 1, HistoricalDesc: "description of the race"},
		{Title: "Key 11: Major Foreign/Military Success", Information: "info for 11", Shade: 1, HistoricalDesc: "description of the race"},
		{Title: "Key 12: Charismatic Incumbent", Information: "info for 12", Shade: 4, HistoricalDesc: "description of the race"},
		{Title: "Key 13: Uncharismatic Challenger", Information: "info for 13", Shade: 1, HistoricalDesc: "description of the race"},
	}

	type ElectionData map[string]Election

	electionData := ElectionData{"1860": *election1, "1864": *election2}

	foundElec := electionData[strYear]

	if foundElec.Year != strYear {
		return nil
	}

	return c.Render("historical", fiber.Map{"KeysData": foundElec})
}
