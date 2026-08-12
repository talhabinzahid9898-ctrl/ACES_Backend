const express = require("express");

const router = express.Router();

const serviceController = require("../controllers/serviceController");


// ==========================================
// GET ALL SERVICES
// GET /api/services
// ==========================================

router.get(
    "/services",
    serviceController.getServices
);


// ==========================================
// GET ONE SERVICE
// GET /api/services/:id
// ==========================================

router.get(
    "/services/:id",
    serviceController.getService
);


// ==========================================
// CREATE SERVICE
// POST /api/services
// ==========================================

router.post(
    "/services",
    serviceController.createService
);


// ==========================================
// UPDATE SERVICE
// PUT /api/services/:id
// ==========================================

router.put(
    "/services/:id",
    serviceController.updateService
);


// ==========================================
// DELETE SERVICE
// DELETE /api/services/:id
// ==========================================

router.delete(
    "/services/:id",
    serviceController.deleteService
);


module.exports = router;