const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// 🔥 IMPORTANT
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"]
}));

// 👉 MongoDB Connection
mongoose.connect("YOUR_MONGODB_URL")
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

// 👉 Schema
const siteSchema = new mongoose.Schema({
    siteName: String,
    totalCost: Number
});

const Site = mongoose.model("Site", siteSchema);

// 👉 SAVE API
app.post("/save", async (req, res) => {
    try {
        const data = new Site(req.body);
        await data.save();
        res.json({ message: "Saved" });
    } catch (err) {
        res.json({ error: err });
    }
});

// 👉 GET API
app.get("/sites", async (req, res) => {
    const data = await Site.find();
    res.json(data);
});

// 👉 DELETE API
app.delete("/delete/:id", async (req, res) => {
    await Site.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// 👉 START SERVER
app.listen(5000, () => console.log("Server running"));