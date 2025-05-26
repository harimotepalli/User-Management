const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//node mailer controller import
const mailController = require("../controllers/mailController");

// for img uploading
const multer = require("multer");
const fs= require("fs");
const path = require("path");


// defining path for image upload
const imagePath = path.join(__dirname, '..','public','userImages');
if(!fs.existsSync(imagePath)){
    fs.mkdirSync(imagePath, { recursive: true });
}

// multer configuration

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, imagePath);
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const uploadImage = multer({ storage: storage }).single("userImage");


// Create
router.post("/add-user", uploadImage , userController.AddUser);

// Read
router.get("/get-users", userController.GetUsers);

// Update
router.put("/update-user/:id", userController.UpdateUser);

// Delete
router.delete("/delete-user/:id", userController.DeleteUser);

// Send mail
router.post("/send-mail", mailController.sendMail);
module.exports = router;
