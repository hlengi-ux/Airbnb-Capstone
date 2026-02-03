const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const accommodationRoutes = require("./routes/accommodationRoutes");
const userRoutes = require("./routes/userRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", process.env.CLIENT_URL].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.use("/api/accommodations", accommodationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Backend API is running!",
    timestamp: new Date().toISOString(),
  });
});

const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected successfully!");

      const User = require("./models/User");
      const existingUser = await User.findOne({ username: "hlengiwe" });
      if (!existingUser) {
        const bcrypt = require("bcryptjs");
        const defaultUser = new User({
          username: "hlengiwe",
          password: bcrypt.hashSync("hlengi345", 12),
          role: "host",
        });
        await defaultUser.save();
        console.log("Default host user created");
      }
    } else {
      console.log("MONGODB_URI not found in environment variables");
    }
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
Server is running on port ${PORT}
Environment: ${process.env.NODE_ENV || "development"}
Database: ${mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"}
`);
  });
};

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});

startServer();
