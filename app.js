"use strict";

const express = require("express");
const path = require("path");
const session = require("express-session");
const MSSQLStore = require("connect-mssql-v2");

require("dotenv").config();

const { connectDB } = require("./Config/db");

const app = express();
const PORT = 3000;



/* =========================================================
   BODY PARSER
========================================================= */

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


/* =========================================================
   SQL SERVER SESSION STORE
========================================================= */

const sessionDBConfig = {

    server:
        process.env.DB_SERVER,

    database:
        process.env.DB_DATABASE,

    options: {

        trustedConnection: true,

        trustServerCertificate: true,

        encrypt: false

    }

};


// const sessionStore =
//     new MSSQLStore(
//         sessionDBConfig,
//         {

//             ttl:
//                 1000 *
//                 60 *
//                 60 *
//                 8,

//             autoRemove: true,

//             autoRemoveInterval:
//                 1000 *
//                 60 *
//                 10

//         }
//     );


/* =========================================================
   SESSION MIDDLEWARE
========================================================= */

// app.use(
//     session({

//         store:
//             sessionStore,

//         secret:
//             process.env.SESSION_SECRET,

//         name:
//             "aces.sid",

//         resave:
//             false,

//         saveUninitialized:
//             false,

//         rolling:
//             true,

//         cookie: {

//             httpOnly:
//                 true,

//             secure:
//                 process.env.NODE_ENV === "production",

//             sameSite:
//                 "lax",

//             maxAge:
//                 1000 *
//                 60 *
//                 60 *
//                 8

//         }

//     })
// );


/* =========================================================
   AUTH ROUTES
========================================================= */

const authRoutes = require("./routes/authRoutes");
const authenticateAdmin = require("./middleware/authMiddleware");
const healthRoutes = require("./Routes/healthRoutes");
const serviceRoutes = require("./Routes/serviceRoute");
const teamRoutes = require("./Routes/teamRoutes");
const blogRoutes = require("./Routes/blogRoutes");
const dashboardRoutes = require("./Routes/dashboardRoutes");
const projectRoutes = require("./Routes/projectRoutes");



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

app.use("/api/auth",authRoutes);

app.use("/api/services", serviceRoutes);

app.use("/api/teams", teamRoutes);

app.use("/api/blogs", blogRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/project", projectRoutes);

app.get(
    "/api/auth/me",
    authenticateAdmin,
    (req, res) => {

        res.json({

            success: true,

            admin: req.admin

        });

    }
);

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
            "../Frontend/Admin_Pannel/login.html"
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