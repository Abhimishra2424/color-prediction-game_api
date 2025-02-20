const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/create", UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/get", authMiddleware, UserController.getUserById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;