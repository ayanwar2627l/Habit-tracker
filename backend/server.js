import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";

dotenv.config();      // Loads .env variables
connectDB();          // Connect to MongoDB

const app = express();
app.use(cors());       // Allows frontend to connect to backend
app.use(express.json()); // Parse JSON request bodies

// Test route
app.get("/", (req, res) => res.send("API is running..."));

// Mount your routes
app.use("/api/users", userRoutes);
app.use("/api/habits", habitRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
