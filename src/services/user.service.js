const db = require("../db");
const User = db.user;

const userService = {
    // ✅ Create a new user
    async createUser(userData) {
        return await User.create(userData);
    },

    // ✅ Get all users
    async getAllUsers() {
        return await User.findAll();
    },

    // ✅ Get user by ID
    async getUserById(id) {
        return await User.findByPk(id);
    },

    // ✅ Get user by email (For Login)
    async getUserByEmail(email) {
        return await User.findOne({ where: { email } });
    },

    // ✅ Update user
    async updateUser(id, updateData) {
        const user = await User.findByPk(id);
        if (!user) return null;
        await user.update(updateData);
        return user;
    },

    // ✅ Delete user
    async deleteUser(id) {
        return await User.destroy({ where: { id } });
    },
};

module.exports = userService;
