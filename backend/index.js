import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js";
import authRoutes from "./routes/authRoutes.js";
import paperRoutes from "./routes/paperRoutes.js";

dotenv.config({
  path: './.env'
});

const app = express();

// ✅ CORS Configuration for Production
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5173"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/papers", paperRoutes);

// ✅ Health Check Endpoint (useful for deployment)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

app.get("/", (req, res) => {
  res.json({ message: "LastNightPYQs Backend API is running" });
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { error: err })
  });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Connect to DB and Start Server
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log(`Error: `, error);
      throw error;
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log(`✅ Server is running on port: ${process.env.PORT || 3000}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed!!", err);
    process.exit(1);
  });

export default app;