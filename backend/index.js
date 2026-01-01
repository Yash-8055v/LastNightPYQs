import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import authRoutes from "./routes/authRoutes.js";
import paperRoutes from "./routes/paperRoutes.js";

dotenv.config({
  path: './.env'
})


const app = express();

//! Configuration: telling express how to handle data from req
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public")) //! temp files,img ect ko store karne ke liye public folder use karte hai


// ✅ CORS Configuration - Allow both development and production origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL // Production frontend URL from environment variable
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// Health check endpoint for monitoring
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  res.send("LastNightPYQs API is running");
});


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/papers", paperRoutes);


// Database connection and server startup
connectDB()
  .then(() => {
    app.on("error", (error) => {   // for checking app is working or not
        console.log(`Error: `, error);
        throw error;
      })
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port: ${process.env.PORT || 3000}`);
    })
  })
  .catch((err) => {
  console.log("MONGO db connection failed!!", err);
  })








