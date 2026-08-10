const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

const healthRoutes = require("./routes/healthRoutes");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "../html")));

// API routes
app.use("/api", healthRoutes);

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../html", "index.html"));
});

const { connectDB } = require("./config/db");
connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

