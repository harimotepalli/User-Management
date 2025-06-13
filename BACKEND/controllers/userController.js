const userData = require("../modals/userModal");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const AddUser = async (req, res) => {
    const { userName, userEmail, userPassword } = req.body;
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }
        const imagePath = req.file.filename; // Use filename directly
        console.log(`Saving user ${userName} with image: ${imagePath}`);
        const hashPassword = await bcrypt.hash(userPassword, 10);

        const mydata = new userData({
            userName,
            userEmail,
            userPassword: hashPassword,
            userImage: imagePath,
        });

        await mydata.save();
        res.status(200).json({ message: "User Added Successfully", data: mydata });
    } catch (error) {
        console.error(`Error adding user ${userName}:`, error);
        res.status(500).json({ message: "Error adding user", error: error.message });
    }
};

const GetUsers = async (req, res) => {
    try {
        const users = await userData.find().select("-userPassword");
        console.log(`Fetched ${users.length} users`);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};
// delete user function 
const UpdateUser = async (req, res) => {
    const { id } = req.params;
    const { userName, userEmail, userPassword } = req.body;
    try {
        const updateData = { userName, userEmail };
        if (userPassword) {
            updateData.userPassword = await bcrypt.hash(userPassword, 10);
        }
        if (req.file) {
            updateData.userImage = req.file.filename; // Use filename directly
            console.log(`Updating user ${id} with new image: ${updateData.userImage}`);
        }
        const updatedUser = await userData.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", data: updatedUser });
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};
const DeleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userData.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.userImage) {
            const imagePath = path.join(__dirname, "..", "public", "userImages", user.userImage);
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`Deleted image: ${imagePath}`);
                }
            } catch (err) {
                console.error(`Failed to delete image ${imagePath}:`, err);
            }
        }
        await userData.findByIdAndDelete(id);
        res.status(200).json({ message: "User Deleted Successfully" });
    } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

const LoginUser = async (req, res) => {
    const { userEmail, userPassword } = req.body;
    try {
        const user = await userData.findOne({ userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                userName: user.userName,
                userEmail: user.userEmail,
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Error during login", error: error.message });
    }
};

module.exports = { AddUser, GetUsers, UpdateUser, DeleteUser, LoginUser };