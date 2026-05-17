const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");

router.post("/add", UserController.addUser);
router.get("/:id", UserController.getUserById);
router.put("/update/:id", UserController.updateUserById);
router.delete("/delete/:id", UserController.deleteUserById);
router.get("/", UserController.getAllUsers);
router.post('/login', UserController.loginUser);

module.exports = router;

// Model
// Repository
// Service
// Controller
// Route