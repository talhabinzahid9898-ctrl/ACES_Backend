"use strict";

const express =
    require("express");

const dashboardController =
    require("../Controllers/dashboardControllers");

const router =
    express.Router();


// ============================================================
// GET DASHBOARD
// ============================================================

router.get(
    "/",
    dashboardController.getDashboard
);


module.exports = router;