const mongoose = require("mongoose");

const userData = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    userPassword: {
        type: String,
        required: true,
    },
    userImage: {
        type: String,
    },
});

module.exports = mongoose.model("userData", userData);