const express = require("express");
const app = express();

// Home route
app.get("/", (req, res) => {
  res.send("Server running");
});

// About route
app.get("/about", (req, res) => {
  res.send("About page");
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});