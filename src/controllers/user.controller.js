const userService = require("../services/user.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserController = {
    // ✅ Register a new user
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const existingUser = await userService.getUserByEmail(email);

            if (existingUser) {
                return res.status(400).json({ success: false, message: "Email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await userService.createUser({ username, email, password: hashedPassword });

            return res.status(201).json({ success: true, message: "User registered successfully", data: newUser });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // ✅ Login user
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userService.getUserByEmail(email);

            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid email or password" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Invalid email or password" });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return res.status(200).json({ success: true, message: "Login successful", token });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // ✅ Create a new user (Admin only)
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