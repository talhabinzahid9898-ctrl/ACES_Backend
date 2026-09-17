const express = require("express");

const router = express.Router();

const { getHealth } = require("../Controllers/healthControllers");

router.get("/health", getHealth);

module.exports = router;