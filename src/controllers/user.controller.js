const userService = require("../services/user.service");

const UserController = {
    // ✅ Create a new user
    async createUser(req, res) {
        try {
            const user = await userService.createUser(req.body);
            return res.status(201).json({ success: true, message: "User created successfully", data: user });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    },

    // ✅ Get all users
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).json({ success: true, data: users });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // ✅ Get user by ID
    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            return res.status(200).json({ success: true, data: user });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // ✅ Update user
    async updateUser(req, res) {
        try {
            const updatedUser = await userService.updateUser(req.params.id, req.body);
            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            return res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    },

    // ✅ Delete user
    async deleteUser(req, res) {
        try {
            const deleted = await userService.deleteUser(req.params.id);
            if (!deleted) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            return res.status(200).json({ success: true, message: "User deleted successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
};

module.exports = UserController;
