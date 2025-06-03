const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const mailController = require("../controllers/mailController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const imagePath = path.join(__dirname, "..", "public", "userImages");
if (!fs.existsSync(imagePath)) {
    try {
        fs.mkdirSync(imagePath, { recursive: true });
        console.log("Created directory:", imagePath);
    } catch (err) {
        console.error("Failed to create directory:", err);
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(`Saving file to: ${imagePath}`);
        cb(null, imagePath);
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        console.log(`Generated filename: ${filename}`);
        cb(null, filename);
    },
});

const uploadImage = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only JPEG, PNG, and GIF files are allowed"));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("userImage");

const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

router.post("/add-user", uploadImage, multerErrorHandler, userController.AddUser);
router.get("/get-users", userController.GetUsers);
router.put("/update-user/:id", uploadImage, multerErrorHandler, userController.UpdateUser);
router.delete("/delete-user/:id", userController.DeleteUser);
router.post("/send-mail", mailController.sendMail);
router.post("/login", userController.LoginUser);

module.exports = router;