const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const userRouter = require("./routers/userRouters");

const app = express();
app.use(bodyparser.json());
app.use(cors());

require('dotenv').config();

// 1.modal     2.controller   3.router

// 1.postman   2.thunderclient  --> extension


// for img uploading
// we neeed to install multer
// it supports all types of files
//FS
//PATH

const mongoDB_url = process.env.MONGODB_URL;

// const mongoDB_url = "mongodb+srv://durgahari012:Hari1432@cluster0.bmneanm.mongodb.net/MCA_FSD?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoDB_url)
.then(() => console.log("DB connected"))
.catch((err) => console.log("DB connection error:", err));


app.get("/",(req , res)=>{
    console.log("data sending");
    res.send("Server running successfully");
})

app.use('/', userRouter);

app.listen(7000,()=>{
    console.log("Server running at port 7000");
})