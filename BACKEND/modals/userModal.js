const mongoose = require("mongoose");

const userData = new mongoose.Schema({
    userName:{
        type: String
    },
    userPassword:{
        type:Number
    }
});

module.exports = mongoose.model("userData", userData);