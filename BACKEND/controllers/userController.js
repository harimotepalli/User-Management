const userData = require("../modals/userModal");

const bcrypt = require("bcrypt");

// Create - To add a new user
const AddUser = async (req, res) => {
    const { userName,userEmail ,userPassword } = req.body;
    try {
        const imagePath = req.file ? req.file.path : null; // Get the image path from the request

        // converting password to hashcode

        const hashPassword =await bcrypt.hash(userPassword,10);

        const mydata = new userData({
            userName:userName,
            userEmail: userEmail,
            userPassword: hashPassword, 
            userImage: imagePath // Include the image if present
        });

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
    const { userName,userEmail ,userPassword } = req.body;

    try {
        const updatedUser = await userData.findByIdAndUpdate(
            id,
            { userName, userEmail,userPassword },
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

//Login function

const LoginUser = async (req, res) => {

    const { userEmail, userPassword } = req.body;

   try{
    const user = await userData.findOne({ "userEmail": userEmail });

    if(!user) {
        return res.status(404).json({ message: "User not found" });
    };

    // Compare the password with the hashed password
    const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({
        message: "Login successful",
        user: {
            userName: user.userName,
            userEmail: user.userEmail
        }
    });
   }
   catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Error during login", error: error.message });
    }

}


module.exports = { AddUser, GetUsers, UpdateUser, DeleteUser,LoginUser };
