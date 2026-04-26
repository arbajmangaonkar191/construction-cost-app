const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const XLSX = require("xlsx");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// PORT FIX (IMPORTANT)
const PORT = process.env.PORT || 3000;

// DB connect
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

// Home route
app.get("/", (req, res) => {
    db.all("SELECT * FROM costs", [], (err, rows) => {
        if (err) return res.send("DB Error");
        res.render("index", { data: rows });
    });
});

// Add entry
app.post("/add", (req, res) => {
    const { item, type, qty, rate } = req.body;
    const total = qty * rate;

    db.run(
        "INSERT INTO costs (item, type, qty, rate, total) VALUES (?, ?, ?, ?, ?)",
        [item, type, qty, rate, total],
        (err) => {
            if (err) return res.send("Insert Error");
            res.redirect("/");
        }
    );
});

// Download Excel
app.get("/download", (req, res) => {
    db.all("SELECT * FROM costs", [], (err, rows) => {
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");

        const filePath = "report.xlsx";
        XLSX.writeFile(wb, filePath);

        res.download(filePath);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});