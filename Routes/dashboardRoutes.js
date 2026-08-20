"use strict";

const express = require("express");

const router =
    express.Router();

const dashboardController =
    require("../Controllers/dashboardControllers");


// =====================================================
// GET DASHBOARD DATA
// GET /api/dashboard
// =====================================================

router.get(
    "/",
    dashboardController.getDashboard
);


module.exports = router;