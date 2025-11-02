import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: './.env'
})


const app = express();



connectDB()
  .then(() => {
    app.on("error", (error) => {   // for checking app is working or not
        console.log(`Error: `, error);
        throw error;
      })
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port: http://localhost:${process.env.PORT}`);
    })
  })
  .catch((err) => {
  console.log("MONGO db connection failed!!", err);
  })



app.get("/", (req, res) => {
  res.send("working");
});




