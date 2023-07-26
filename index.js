const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./User/userRouter.js");

dotenv.config();

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URI);


mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});


mongoose.connection.once("open", () => {
  console.log("DB Connected Successfully");
});


app.use("/api/users", userRouter);


const SERVER_PORT = process.env.SERVER_PORT;
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on SERVER_PORT ${SERVER_PORT}`);
});
