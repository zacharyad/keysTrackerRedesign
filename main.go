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
var electionData ElectionData

type KeyConst struct {
	Wikihref    string
	Title       string
	Information string
}
type Key struct {
	Data           KeyConst
	Shade          int
	HistoricalDesc string
}

type Election struct {
	Year               string
	TrueCandidateName  string
	FalseCandidateName string
	Keys               []Key
}

type ElectionData map[string]Election

type KeyConsts []KeyConst

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

	if len(electionData["1860"].Year) == 0 {
		electionData = buildElectionData()
	}

	foundElec := electionData[strYear]

	if foundElec.Year != strYear {
		return nil
	}

	return c.Render("historical", fiber.Map{"KeysData": foundElec})
}

func buildElectionData() ElectionData {
	keyconsts := []KeyConst{
		{Wikihref: "https://en.wikipedia.org/wiki/The_Keys_to_the_White_House#Key_1:_Party_mandate", Title: "Key 1: Midterm Gains", Information: "info for 1"},
		{Wikihref: "https://en.wikipedia.org/wiki/The_Keys_to_the_White_House#Key_2:_No_primary_contest", Title: "Key 2: No Primary Contest", Information: "info for 2"},
		{Wikihref: "https://en.wikipedia.org/wiki/The_Keys_to_the_White_House#Key_3:_Incumbent_seeking_re-election", Title: "Key 3: Incumbent Seeking Re-election", Information: "info for 3"},
		{Wikihref: "https://en.wikipedia.org/wiki/The_Keys_to_the_White_House#Key_4:_No_third_party", Title: "Key 4: No Third Party", Information: "info for 4"},
		{Wikihref: "https://en.wikipedia.org/wiki/The_Keys_to_the_White_House#Keys_5_and_6:_Strong_long-term_and_short-term_economy", Title: "Key 5: Strong Short-Term Economy", Information: "info for 5"},
		{Wikihref: "https://en.wikipedia.org/wiki/The_Keys_to_the_White_House#Keys_5_and_6:_Strong_long-term_and_short-term_economy", Title: "Key 6: Strong Long-Term Economy", Information: "info for 6"},
		{Wikihref: "https://en.wikipedia.org/wiki/The_Keys_to_the_White_House#Key_7:_Major_policy_change", Title: "Key 7: Major Policy Change", Information: "info for 7"},
		{Wikihref: "https://en.wikipedia.org/wiki/The_Keys_to_the_White_House#Key_8:_No_social_unrest", Title: "Key 8: No Social Unrest", Information: "info for 8"},
		{Wikihref: "https://en.wikipedia.org/wiki/The_Keys_to_the_White_House#Key_9:_No_scandal", Title: "Key 9: No Scandal", Information: "info for 9"},
		{Wikihref: "https://en.wikipedia.org/wiki/The_Keys_to_the_White_House#Keys_10_and_11:_Foreign_or_military_failure_and_success", Title: "Key 10: No Foreign/Military Failure", Information: "info for 10"},
		{Wikihref: "https://en.wikipedia.org/wiki/The_Keys_to_the_White_House#Keys_10_and_11:_Foreign_or_military_failure_and_success", Title: "Key 11: Major Foreign/Military Success", Information: "info for 11"},
		{Wikihref: "https://en.wikipedia.org/wiki/The_Keys_to_the_White_House#Keys_12_and_13:_Candidate_charisma", Title: "Key 12: Charismatic Incumbent", Information: "info for 12"},
		{Wikihref: "https://en.wikipedia.org/wiki/The_Keys_to_the_White_House#Keys_12_and_13:_Candidate_charisma", Title: "Key 13: Uncharismatic Challenger", Information: "info for 13"},
	}

	// building Election Data
	election1 := new(Election)
	election1.Year = "1860"
	election1.TrueCandidateName = "Stephen A. Douglas"
	election1.FalseCandidateName = "Abraham Lincoln"
	election1.Keys = []Key{
		{Data: keyconsts[0], Shade: 1, HistoricalDesc: "description of the race"},
		{Data: keyconsts[1], Shade: 4, HistoricalDesc: "description of the race"},
		{Data: keyconsts[2], Shade: 4, HistoricalDesc: "description of the race"},
		{Data: keyconsts[3], Shade: 4, HistoricalDesc: "description of the race"},
		{Data: keyconsts[4], Shade: 1, HistoricalDesc: "description of the race"},
		{Data: keyconsts[5], Shade: 1, HistoricalDesc: "description of the race"},
		{Data: keyconsts[6], Shade: 4, HistoricalDesc: "description of the race"},
		{Data: keyconsts[7], Shade: 4, HistoricalDesc: "description of the race"},
		{Data: keyconsts[8], Shade: 1, HistoricalDesc: "description of the race"},
		{Data: keyconsts[9], Shade: 1, HistoricalDesc: "description of the race"},
		{Data: keyconsts[10], Shade: 4, HistoricalDesc: "description of the race"},
		{Data: keyconsts[11], Shade: 4, HistoricalDesc: "description of the race"},
		{Data: keyconsts[12], Shade: 1, HistoricalDesc: "description of the race"},
	}

	election2 := new(Election)
	election2.Year = "1864"
	election2.TrueCandidateName = "Abraham Lincoln"
	election2.FalseCandidateName = "George McClellan"
	election2.Keys = []Key{
		{Data: keyconsts[0], Shade: 1, HistoricalDesc: "description of the race"},
		{Data: keyconsts[1], Shade: 1, HistoricalDesc: "description of the race"},
		{Data: keyconsts[2], Shade: 1, HistoricalDesc: "description of the race"},
		{Data: keyconsts[3], Shade: 1, HistoricalDesc: "description of the race"},
		{Data: keyconsts[4], Shade: 1, HistoricalDesc: "description of the race"},
		{Data: keyconsts[5], Shade: 4, HistoricalDesc: "description of the race"},
		{Data: keyconsts[6], Shade: 1, HistoricalDesc: "description of the race"},
		{Data: keyconsts[7], Shade: 4, HistoricalDesc: "description of the race"},
		{Data: keyconsts[8], Shade: 1, HistoricalDesc: "description of the race"},
		{Data: keyconsts[9], Shade: 1, HistoricalDesc: "description of the race"},
		{Data: keyconsts[10], Shade: 1, HistoricalDesc: "description of the race"},
		{Data: keyconsts[11], Shade: 4, HistoricalDesc: "description of the race"},
		{Data: keyconsts[12], Shade: 1, HistoricalDesc: "description of the race"},
	}

	return ElectionData{"1860": *election1, "1864": *election2}
}
