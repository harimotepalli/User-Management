const userData = require("../modals/userModal");

// Create - Add a new user
const AddUser = async (req, res) => {
    const { userName, userPassword } = req.body;
    try {
        const mydata = new userData({ userName, userPassword });
        await mydata.save();
        res.status(200).json({ message: "User Added Successfully", data: mydata });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Error adding user", error: error.message });
    }
};

// Read - Get all users
const GetUsers = async (req, res) => {
    try {
        const users = await userData.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// Update - Update user by ID
const UpdateUser = async (req, res) => {
    const { id } = req.params;
    const { userName, userPassword } = req.body;

    try {
        const updatedUser = await userData.findByIdAndUpdate(
            id,
            { userName, userPassword },
            { new: true }
        );
        res.status(200).json({ message: "User Updated Successfully", data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

// Delete - Delete user by ID
const DeleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await userData.findByIdAndDelete(id);
        res.status(200).json({ message: "User Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

module.exports = { AddUser, GetUsers, UpdateUser, DeleteUser };
