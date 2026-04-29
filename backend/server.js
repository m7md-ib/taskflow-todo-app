require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB ─────────────────────────────────────────────
connectDB();

// ─── Allowed Origins ────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "https://chatapp-drab-delta.vercel.app",
];

// ─── CORS Middleware ────────────────────────────────────────────────
app.use(
  cors({
    origin: function (origin, callback) {
      // allow tools like Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ─── Handle Preflight Requests ──────────────────────────────────────
app.options("*", cors());

// ─── Middleware ──────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "Todo API is running 🚀",
    version: "1.0.0",
  });
});

app.use("/tasks", taskRoutes);

// ─── Error Handling ──────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
});
