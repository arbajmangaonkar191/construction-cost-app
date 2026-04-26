const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const XLSX = require("xlsx");

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 MongoDB connect (yaha apna Atlas URL daalo)
mongoose.connect("mongodb://arbajmangaonkar191_db_user:Arbaj789@ac-wssyryd-shard-00-00.pexos5y.mongodb.net:27017,ac-wssyryd-shard-00-01.pexos5y.mongodb.net:27017,ac-wssyryd-shard-00-02.pexos5y.mongodb.net:27017/?ssl=true&replicaSet=atlas-binby8-shard-0&authSource=admin&appName=Cluster0")
.then(()=> console.log("DB Connected"))
.catch(err => console.log(err));

// 📦 Schema
const SiteSchema = new mongoose.Schema({
    siteName: String,
    location: String,
    expenses: [
        {
            material: String,
            quantity: Number,
            price: Number,
            labour: Number
        }
    ]
});

const { siteName, location, expenses } = req.body;

const site = new Site({
    siteName,
    location,
    expenses: expenses && expenses.length > 0 ? expenses : [
        {
            material: "Default Material",
            quantity: 1,
            price: 100,
            labour: 50
        }
    ]
});

// ✅ Add Site API
app.post("/add-site", async (req,res)=>{
    try {
        const site = new Site(req.body);
        await site.save();
        res.send("Saved Successfully");
    } catch (err) {
        res.status(500).send(err);
    }
});

// ✅ Get All Sites API (IMPORTANT)
app.get("/sites", async (req,res)=>{
    try {
        const data = await Site.find();
        res.json(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

// ✅ Excel Download API (FIXED VERSION)
app.get("/download", async (req,res)=>{
    const data = await Site.find();

    let excelData = [];

    data.forEach(site => {

        // 🔥 YAHI LINE ADD KARNA HAI
        if (!site.expenses || site.expenses.length === 0) return;

        site.expenses.forEach(exp => {
            excelData.push({
                SiteName: site.siteName,
                Location: site.location,
                Material: exp.material,
                Quantity: exp.quantity,
                Price: exp.price,
                Labour: exp.labour,
                Total: (exp.quantity * exp.price) + exp.labour
            });
        });
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Construction");

    XLSX.writeFile(workbook, "construction_data.xlsx");

    res.download("construction_data.xlsx");
});
// 🚀 Server start
app.listen(5000, ()=> console.log("Server running on port 5000"));