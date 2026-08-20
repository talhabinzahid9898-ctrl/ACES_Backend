const express = require("express");

const router = express.Router();

const serviceController = require("../Controllers/serviceController");


// ==========================================
// GET ALL SERVICES
// GET /api/services
// ==========================================

router.get(
    "/",
    serviceController.getServices
);


// ==========================================
// GET ONE SERVICE
// GET /api/services/:id
// ==========================================

router.get(
    "/:id",
    serviceController.getService
);


// ==========================================
// CREATE SERVICE
// POST /api/services
// ==========================================

router.post(
    "/",
    serviceController.createService
);


// ==========================================
// UPDATE SERVICE
// PUT /api/services/:id
// ==========================================

router.put(
    "/:id",
    serviceController.updateService
);


// ==========================================
// DELETE SERVICE
// DELETE /api/services/:id
// ==========================================

router.delete(
    "/:id",
    serviceController.deleteService
);


module.exports = router;