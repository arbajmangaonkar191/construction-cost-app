const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const XLSX = require("xlsx");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const db = new sqlite3.Database("data.db");

// Create table
db.run(`CREATE TABLE IF NOT EXISTS costs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item TEXT,
    type TEXT,
    qty INTEGER,
    rate INTEGER,
    total INTEGER
)`);

// Home page
app.get("/", (req, res) => {
    db.all("SELECT * FROM costs", [], (err, rows) => {
        res.render("index", { data: rows });
    });
});

// Add data
app.post("/add", (req, res) => {
    const { item, type, qty, rate } = req.body;
    const total = qty * rate;

    db.run(
        "INSERT INTO costs (item, type, qty, rate, total) VALUES (?, ?, ?, ?, ?)",
        [item, type, qty, rate, total]
    );

    res.redirect("/");
});

// Download Excel
app.get("/download", (req, res) => {
    db.all("SELECT * FROM costs", [], (err, rows) => {
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");

        XLSX.writeFile(wb, "report.xlsx");
        res.download("report.xlsx");
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});