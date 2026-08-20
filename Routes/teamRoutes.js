const express = require("express");
const multer = require("multer");

const teamController = require("../Controllers/teamControllers");

const router = express.Router();

// router.use((req, res, next) => {

//     console.log(
//         "TEAM ROUTER:",
//         req.method,
//         req.originalUrl,
//         "params:",
//         req.params
//     );

//     next();
// });

// ==========================================
// MULTER CONFIGURATION
// ==========================================

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, PNG and WEBP images are allowed"
            ),
            false
        );
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


// ==========================================
// GET ALL TEAMS
// GET /api/teams
// ==========================================

router.get("/", teamController.getTeams);


// ==========================================
// GET SINGLE TEAM
// GET /api/teams/:id
// ==========================================

router.get("/:id", teamController.getTeam);


// ==========================================
// CREATE TEAM
// POST /api/teams
// ==========================================

router.post(
    "/",
    upload.single("image"),
    teamController.createTeam
);


// ==========================================
// UPDATE TEAM
// PUT /api/teams/:id
// ==========================================

router.put(
    "/:id",
    upload.single("image"),
    teamController.updateTeam
);


// ==========================================
// DELETE TEAM
// DELETE /api/teams/:id
// ==========================================

router.delete(
    "/:id",
    teamController.deleteTeam
);


module.exports = router;