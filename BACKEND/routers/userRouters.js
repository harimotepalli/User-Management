const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Create
router.post("/add-user", userController.AddUser);

// Read
router.get("/get-users", userController.GetUsers);

// Update
router.put("/update-user/:id", userController.UpdateUser);

// Delete
router.delete("/delete-user/:id", userController.DeleteUser);

module.exports = router;
