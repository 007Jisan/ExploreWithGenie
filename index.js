const express = require("express");
const mongoose = require("mongoose");

const app = express();

// middleware (good practice)
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/explorewithgenie")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB error:", err));

// routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server running" });
});

app.get("/about", (req, res) => {
  res.status(200).json({ message: "About page" });
});

// 404 handler (important improvement)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
