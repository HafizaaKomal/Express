const express = require("express");
const router = express.Router();
const userController = require("./userController");


router.post("/signup", signup);
router.post("/login", login);
router.get("/getallusers", getAllUsers);
router.get("/getuserbyemail/:email", getUserByEmail);
router.get("/userbyEmail", userbyEmail);

module.exports = router;