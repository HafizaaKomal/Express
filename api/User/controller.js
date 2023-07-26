const { hash, compare } = require("bcryptjs");
const User = require("./usersschema");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1); 
  });


const signup = async (req, res) => {
  const { username, password, email } = req.body;

  try {
   
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await hash(password, 10);

   
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      process.env.JWT_SECRET
    );

    return res
      .status(201)
      .json({ message: "User created successfully", token });
  } catch (error) {
    console.error("Error during user sign-up:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const login = async (req, res) => {
  const { username, password } = req.body;

  try {
   
    const user = await User.findOne({ username });

  
    if (!user || !(await compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user by email using query params 
const userbyEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login, getAllUsers, getUserByEmail, userbyEmail };
