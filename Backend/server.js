const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connect
mongoose.connect("mongodb://arbajmangaonkar191_db_user:Arbaj123@ac-wssyryd-shard-00-00.pexos5y.mongodb.net:27017,ac-wssyryd-shard-00-01.pexos5y.mongodb.net:27017,ac-wssyryd-shard-00-02.pexos5y.mongodb.net:27017/?ssl=true&replicaSet=atlas-binby8-shard-0&authSource=admin&appName=Cluster0")
.then(() => console.log("DB Connected"))
.catch(err => console.log("DB Error:", err));

// Schema
const SiteSchema = new mongoose.Schema({
    siteName: String,
    totalCost: Number
});

const Site = mongoose.model("Site", SiteSchema);

// Save API
app.post("/save", async (req, res) => {
    const data = new Site(req.body);
    await data.save();
    res.json({ message: "Saved" });
});

// Get API
app.get("/sites", async (req, res) => {
    const data = await Site.find();
    res.json(data);
});

app.delete("/delete/:id", async (req, res) => {
    try {
        await Site.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.json({ error: err });
    }
});

const cors = require("cors");

app.use(cors({
    origin: "*"
}));

app.listen(5000, () => console.log("Server running on port 5000"));