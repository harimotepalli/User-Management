// schema for user data
const mongoose = require("mongoose");

const userData = new mongoose.Schema({
    userName:{
        type: String,
    },
    userEmail:{
        type:String,
        unique: true
    },
    userPassword:{
        type:String,
        required: true,
    },
    userImage:{
        type: String,
    }
});

module.exports = mongoose.model("userData", userData);