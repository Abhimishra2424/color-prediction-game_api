const db = require("../db");
const User = db.user;

const UserService = {
    // ✅ Create User
    async createUser(userData) {
        return await User.create(userData);
    },

    // ✅ Get All Users
    async getAllUsers() {
        return await User.findAll();
    },

    // ✅ Get User By ID
    async getUserById(userId) {
        return await User.findByPk(userId);
    },

    // ✅ Update User
    async updateUser(userId, userData) {
        const user = await User.findByPk(userId);
        if (!user) return null;
        await user.update(userData);
        return user;
    },

    // ✅ Delete User
    async deleteUser(userId) {
        return await User.destroy({ where: { id: userId } });
    },
};

module.exports = UserService;
