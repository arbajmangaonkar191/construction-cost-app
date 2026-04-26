const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ExcelJS = require("exceljs");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// MongoDB connect
mongoose.connect("YOUR_MONGODB_URL")
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

// Schema
const siteSchema = new mongoose.Schema({
    siteName: String,
    labour: Number,
    material: Number,
    other: Number,
    totalCost: Number
});

const Site = mongoose.model("Site", siteSchema);

// SAVE
app.post("/save", async (req, res) => {
    try {
        const data = new Site(req.body);
        await data.save();
        res.json({ message: "Saved" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// GET ALL
app.get("/sites", async (req, res) => {
    try {
        const data = await Site.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// DELETE
app.delete("/delete/:id", async (req, res) => {
    try {
        await Site.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// EXCEL DOWNLOAD
app.get("/download", async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Projects");

    sheet.columns = [
        { header: "Site Name", key: "siteName", width: 20 },
        { header: "Labour", key: "labour", width: 15 },
        { header: "Material", key: "material", width: 15 },
        { header: "Other", key: "other", width: 15 },
        { header: "Total", key: "totalCost", width: 20 }
    ];

    const data = await Site.find();

    data.forEach(item => {
        sheet.addRow(item);
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        "attachment; filename=projects.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
});

// Root check
app.get("/", (req, res) => {
    res.send("Server Running ✅");
});

app.listen(5000, () => console.log("Server running on port 5000"));