const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routers/userRouters");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
}));
app.use("/public", express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path) => {
        console.log(`Serving static file: ${path}`);
    }
}));

require("dotenv").config();

const mongoDB_url = process.env.MONGODB_URL;

mongoose.connect(mongoDB_url)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("DB connection error:", err));

app.get("/", (req, res) => {
    console.log("data sending");
    res.send("Server running successfully");
});

app.use("/", userRouter);

app.listen(7000, () => {
    console.log("Server running at port 7000");
});