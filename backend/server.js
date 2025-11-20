const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = require("./app.js");
const connectDB = require("./config/db.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

// Dynamic CORS configuration for better security
const allowedOrigins = [
  "http://localhost:5173",
  "http://10.1.0.222:5173",
  // Add your production frontend URL here when deployed
  // "https://your-frontend-domain.vercel.app",
  // Add more specific IPs as needed
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in our allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // For development, you might want to allow any localhost
      if (
        process.env.NODE_ENV === "development" &&
        origin.includes("localhost")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // allow cookies, if needed
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

const userRouter = require("./routes/auth.route.js");
const profileRouter = require("./routes/profile.route.js");
const connectionRouter = require("./routes/connectionrequest.route.js");
const getConnectionRouter = require("./routes/user.route.js");
const initializeSocket = require("./utils/socket.js");
const chatRouter = require("./routes/chat.route.js");

app.get("/", (req, res) => {
  res.send("Welcome to CommX Backend Server");
});

// Routes

app.use("/auth", userRouter);
app.use("/user", profileRouter);
app.use("/connectionrequest", connectionRouter);
app.use("/connection", getConnectionRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server, allowedOrigins);

// Connect DB and Start Server
connectDB().then(() => {
  server.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
});
