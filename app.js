const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

const healthRoutes = require("./Routes/healthRoutes");
const serviceRoute = require("./Routes/serviceRoute");

const { connectDB } = require("./config/db");


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==========================================
// PUBLIC WEBSITE
// ==========================================

app.use(
    express.static(
        path.join(__dirname, "../html")
    )
);


// ==========================================
// ADMIN PANEL
// ==========================================

app.use(
    "/admin",
    express.static(
        path.join(__dirname, "../Admin_Pannel")
    )
);


// ==========================================
// API ROUTES
// ==========================================

app.use("/api", healthRoutes);
app.use("/api", serviceRoute);


// ==========================================
// PUBLIC HOME PAGE
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../html",
            "index.html"
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
            "../Admin_Pannel",
            "dashboard.html"
        )
    );

});


// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {

    try {

        await connectDB();

        app.listen(PORT, () => {

            console.log(
                `🚀 Server running on http://localhost:${PORT}`
            );

        });

    } catch (error) {

        console.error(
            "❌ Server could not start."
        );

    }

};

startServer();