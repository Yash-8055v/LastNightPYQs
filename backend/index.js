import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config({
  path: './.env'
})


const app = express();

//! Configuration: telling express how to handle data from req
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public")) //! temp files,img ect ko store karne ke liye public folder use karte hai


import cors from "cors";

// ✅ Allow frontend (localhost:5173) to access backend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));




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


app.use("/api/auth", authRoutes);
import paperRoutes from "./routes/paperRoutes.js";
app.use("/api/papers", paperRoutes);







