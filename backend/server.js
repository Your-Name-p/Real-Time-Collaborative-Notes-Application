require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");

const authRoutes = require("./src/routes/authRoutes");
const noteRoutes = require("./src/routes/noteRoutes");
const collaboratorRoutes = require("./src/routes/collaboratorRoutes");
const activityRoutes = require("./src/routes/activityRoutes");
const shareRoutes = require("./src/routes/shareRoutes");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: "*" }
});

app.use(cors({
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/notes", collaboratorRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api", shareRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Notes API Server Running", timestamp: new Date().toISOString() });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Socket.io setup
require("./src/sockets/noteSocket")(io);

const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});