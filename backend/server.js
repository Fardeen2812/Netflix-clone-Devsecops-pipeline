const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// App Config

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connection Successful"))
    .catch((err) => {
        console.log(err);
    });

// Routes
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});
