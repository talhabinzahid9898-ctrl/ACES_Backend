"use strict";

const teamModel = require("../Models/teamModel");
const cloudinary = require("../Config/cloudinary");


// ============================================================
// CLOUDINARY UPLOAD
// ============================================================

function uploadToCloudinary(fileBuffer) {

    return new Promise((resolve, reject) => {

        const uploadStream =
            cloudinary.uploader.upload_stream(

                {
                    folder: "ACES/User Home Page",
                    resource_type: "image"
                },

                (error, result) => {

                    if (error) {

                        reject(error);

                    } else {

                        resolve(result);

                    }

                }

            );

        uploadStream.end(fileBuffer);

    });

}


// ============================================================
// CLOUDINARY DELETE
// ============================================================

async function deleteFromCloudinary(publicId) {

    if (!publicId) {
        return;
    }

    try {

        await cloudinary.uploader.destroy(publicId);

    } catch (error) {

        console.error(
            "Cloudinary delete error:",
            error.message
        );

    }

}


// ============================================================
// GET ALL TEAMS
// GET /api/teams
// ============================================================

async function getTeams(req, res) {

    try {

        console.log("GET /api/teams");

        const teams = await teamModel.getAllTeams();

        console.log("Teams from database:", teams);

        return res.status(200).json({
            success: true,
            data: teams
        });

    } catch (error) {

        console.error("================================");
        console.error("GET TEAMS DATABASE ERROR");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Original Error:", error.originalError);
        console.error("================================");

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// ============================================================
// GET ONE TEAM
// GET /api/teams/:id
// ============================================================

async function getTeam(req, res) {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid team ID"
            });
        }

        const team = await teamModel.getTeamById(id);

        if (!team) {

            return res.status(404).json({
                success: false,
                message: "Team member not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: team
        });

    } catch (error) {

        console.error("Get team error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch team member"
        });
    }
}


// ============================================================
// CREATE TEAM
// POST /api/teams
// ============================================================

async function createTeam(req, res) {

    let uploadedImage = null;

    try {

        console.log("================================");
        console.log("CREATE TEAM CALLED");
        console.log("BODY:", req.body);
        console.log("FILE:", req.file ? req.file.originalname : "No image");
        console.log("================================");


        const {
            name,
            position,
            department,
            bio,
            display_order,
            status
        } = req.body;


        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (!name || !name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Name is required"

            });

        }


        if (!position || !position.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Position is required"

            });

        }


        // ----------------------------------------------------
        // CLOUDINARY IMAGE
        // ----------------------------------------------------

        if (req.file) {

            uploadedImage =
                await uploadToCloudinary(
                    req.file.buffer
                );

        }


        // ----------------------------------------------------
        // DATABASE
        // ----------------------------------------------------

        const team =
            await teamModel.createTeam({

                name:
                    name.trim(),

                position:
                    position.trim(),

                department:
                    department
                        ? department.trim()
                        : null,

                bio:
                    bio
                        ? bio.trim()
                        : null,

                display_order:
                    Number(display_order) || 0,

                status:
                    status !== "false",

                image_url:
                    uploadedImage
                        ? uploadedImage.secure_url
                        : null,

                image_public_id:
                    uploadedImage
                        ? uploadedImage.public_id
                        : null

            });


        return res.status(201).json({

            success: true,

            message:
                "Team member created successfully",

            data: team

        });

    } catch (error) {

        console.error(
            "Create team error:",
            error
        );


        // If database fails after Cloudinary upload
        if (uploadedImage) {

            await deleteFromCloudinary(
                uploadedImage.public_id
            );

        }


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to create team member"

        });

    }

}


// ============================================================
// UPDATE TEAM
// PUT /api/teams/:id
// ============================================================

async function updateTeam(req, res) {

    let newImage = null;

    try {

        const id =
            Number(req.params.id);


        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid team ID"

            });

        }


        const existingTeam =
            await teamModel.getTeamById(id);


        if (!existingTeam) {

            return res.status(404).json({

                success: false,

                message:
                    "Team member not found"

            });

        }


        const {
            name,
            position,
            department,
            bio,
            display_order,
            status
        } = req.body;


        if (!name || !name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Name is required"

            });

        }


        if (!position || !position.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Position is required"

            });

        }


        // ----------------------------------------------------
        // UPLOAD NEW IMAGE ONLY IF USER SELECTED ONE
        // ----------------------------------------------------

        if (req.file) {

            newImage =
                await uploadToCloudinary(
                    req.file.buffer
                );

        }


        const updatedTeam =
            await teamModel.updateTeam(

                id,

                {

                    name:
                        name.trim(),

                    position:
                        position.trim(),

                    department:
                        department
                            ? department.trim()
                            : null,

                    bio:
                        bio
                            ? bio.trim()
                            : null,

                    display_order:
                        Number(display_order) || 0,

                    status:
                        status !== "false",

                    image_url:
                        newImage
                            ? newImage.secure_url
                            : null,

                    image_public_id:
                        newImage
                            ? newImage.public_id
                            : null

                }

            );


        // ----------------------------------------------------
        // DELETE OLD IMAGE
        // ----------------------------------------------------

        if (
            newImage &&
            existingTeam.image_public_id
        ) {

            await deleteFromCloudinary(
                existingTeam.image_public_id
            );

        }


        return res.status(200).json({

            success: true,

            message:
                "Team member updated successfully",

            data:
                updatedTeam

        });

    } catch (error) {

        console.error(
            "Update team error:",
            error
        );


        if (newImage) {

            await deleteFromCloudinary(
                newImage.public_id
            );

        }


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to update team member"

        });

    }

}


// ============================================================
// DELETE TEAM
// DELETE /api/teams/:id
// ============================================================

async function deleteTeam(req, res) {

    try {

        const id =
            Number(req.params.id);


        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid team ID"

            });

        }


        const existingTeam =
            await teamModel.getTeamById(id);


        if (!existingTeam) {

            return res.status(404).json({

                success: false,

                message:
                    "Team member not found"

            });

        }


        const deletedTeam =
            await teamModel.deleteTeam(id);


        // Delete Cloudinary image
        if (existingTeam.image_public_id) {

            await deleteFromCloudinary(
                existingTeam.image_public_id
            );

        }


        return res.status(200).json({

            success: true,

            message:
                "Team member deleted successfully",

            data:
                deletedTeam

        });

    } catch (error) {

        console.error(
            "Delete team error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to delete team member"

        });

    }

}


// ============================================================
// EXPORT
// ============================================================
createTeam
module.exports = {

    getTeams,

    getTeam,

    createTeam,

    updateTeam,

    deleteTeam

};