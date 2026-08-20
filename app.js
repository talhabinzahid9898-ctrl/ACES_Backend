"use strict";

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { connectDB } = require("./config/db");

const healthRoutes = require("./Routes/healthRoutes");
const serviceRoutes = require("./Routes/serviceRoute");
const teamRoutes = require("./Routes/teamRoutes");
const blogRoutes = require("./Routes/blogRoutes");
const dashboardRoutes = require("./Routes/dashboardRoutes");

const app = express();
const PORT = 3000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ==========================================
// PUBLIC WEBSITE
// ==========================================

app.use(
    express.static(
        path.join(__dirname, "../Frontend/html")
    )
);


// ==========================================
// ADMIN PANEL
// ==========================================

app.use(
    "/admin",
    express.static(
        path.join(__dirname, "../Frontend/Admin_Pannel")
    )
);


// ==========================================
// API ROUTES
// ==========================================

app.use("/api", healthRoutes);

app.use("/api/services", serviceRoutes);

app.use("/api/teams", teamRoutes);

app.use("/api/blogs", blogRoutes);

app.use("/api/dashboard", dashboardRoutes);
// ==========================================
// PUBLIC HOME PAGE
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../Frontend/html/index.html"
        )
    );

});


// ==========================================
// ADMIN HOME PAGE
// ==========================================

app.get("/admin", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../Frontend/Admin_Pannel/dashboard.html"
        )
    );

});


// ==========================================
// API TEST
// ==========================================

app.get("/api", (req, res) => {

    res.json({
        success: true,
        message: "ACES API is running"
    });

});


// ==========================================
// API 404
// ==========================================

app.use("/api", (req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});


// ==========================================
// START SERVER
// ==========================================

async function startServer() {

    try {

        await connectDB();

        app.listen(PORT, () => {

            console.log("========================================");
            console.log("ACES BACKEND");
            console.log("========================================");
            console.log(`Server running on:`);
            console.log(`http://localhost:${PORT}`);

        });

    } catch (error) {

        console.error("❌ Server could not start:");
        console.error(error);

        process.exit(1);
    }
}

startServer();