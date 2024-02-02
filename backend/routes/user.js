//file for login and singup operations
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user")




router.post("/singup", UserController.createUser);

router.post("/login", UserController.userLogin)




module.exports = router;