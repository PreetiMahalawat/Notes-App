const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import Notes Routes
const noteRoutes = require("./routes/notes");

// Create Express App
const app = express();


// =========================
// MIDDLEWARE
// =========================

// Allow Cross-Origin Requests
app.use(cors());

// Read JSON Data
app.use(express.json());

// Serve Frontend Files
app.use(express.static(path.join(__dirname, "public")));


// =========================
// API ROUTES
// =========================

// Notes API
app.use("/api/notes", noteRoutes);


// =========================
// MONGODB CONNECTION
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });


// =========================
// HOME ROUTE
// =========================

// If index.html exists inside public folder,
// opening http://localhost:5000 will automatically
// show that page.


// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});