"use strict";

const projectModel =
    require("../Models/projectModel");

const cloudinary =
    require("../Config/Cloudinary");


// =====================================================
// CLOUDINARY UPLOAD
// =====================================================

function uploadToCloudinary(
    buffer
) {

    return new Promise(
        (resolve, reject) => {

            const stream =
                cloudinary.uploader.upload_stream(

                    {
                        folder:
                            "ACES/Projects",

                        resource_type:
                            "image"
                    },

                    (
                        error,
                        result
                    ) => {

                        if (error) {

                            reject(error);

                        } else {

                            resolve(result);

                        }

                    }

                );


            stream.end(buffer);

        }
    );
}


// =====================================================
// DELETE CLOUDINARY IMAGE
// =====================================================

async function deleteFromCloudinary(
    publicId
) {

    if (!publicId) {
        return;
    }


    try {

        await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: "image"
            }
        );

    } catch (error) {

        console.error(
            "Cloudinary delete error:",
            error.message
        );

    }
}


// =====================================================
// GET ALL PROJECTS
// =====================================================

async function getProjects(
    req,
    res
) {

    try {

        const projects =
            await projectModel.getProjects();


        res.status(200).json({

            success: true,

            data: projects

        });

    } catch (error) {

        console.error(
            "Get projects error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch projects"

        });

    }
}


// =====================================================
// GET SINGLE PROJECT
// =====================================================

async function getProject(
    req,
    res
) {

    try {

        const id =
            parseInt(
                req.params.id
            );


        if (isNaN(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid project ID"

            });

        }


        const project =
            await projectModel.getProject(id);


        if (!project) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found"

            });

        }


        res.status(200).json({

            success: true,

            data: project

        });

    } catch (error) {

        console.error(
            "Get project error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch project"

        });

    }
}


// =====================================================
// CREATE PROJECT
// =====================================================

async function createProject(
    req,
    res
) {

    let uploadedMainImage = null;

    const uploadedGallery =
        [];


    try {

        const {

            project_title,

            category,

            client,

            location,

            description,

            completion_date,

            status,

            project_area,

            offered_service

        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !project_title ||
            !project_title.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Project title is required"

            });

        }


        if (
            !category ||
            !category.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Project category is required"

            });

        }


        // =================================================
        // MAIN PROJECT IMAGE
        // =================================================

        if (
            req.files &&
            req.files.project_image &&
            req.files.project_image.length > 0
        ) {

            uploadedMainImage =
                await uploadToCloudinary(

                    req.files
                        .project_image[0]
                        .buffer

                );

        }


        // =================================================
        // CREATE PROJECT
        // =================================================

        const project =
            await projectModel.createProject({

                project_title:
                    project_title.trim(),

                category:
                    category.trim(),

                client:
                    client
                        ? client.trim()
                        : null,

                location:
                    location
                        ? location.trim()
                        : null,

                description:
                    description
                        ? description.trim()
                        : null,

                project_image:
                    uploadedMainImage
                        ? uploadedMainImage.secure_url
                        : null,

                project_image_public_id:
                    uploadedMainImage
                        ? uploadedMainImage.public_id
                        : null,

                completion_date:
                    completion_date || null,

                status:
                    status || "Completed",

                project_area:
                    project_area
                        ? project_area.trim()
                        : null,

                offered_service:
                    offered_service
                        ? offered_service.trim()
                        : null,

                uploaded_at:
                    new Date()

            });


        // =================================================
        // GALLERY IMAGES
        // =================================================

        if (
            req.files &&
            req.files.project_gallery
        ) {

            for (
                const file
                of req.files.project_gallery
            ) {

                const uploaded =
                    await uploadToCloudinary(
                        file.buffer
                    );


                uploadedGallery.push(
                    uploaded
                );


                await projectModel.addGalleryImage(

                    project.id,

                    uploaded.secure_url,

                    uploaded.public_id

                );

            }

        }


        const finalProject =
            await projectModel.getProject(
                project.id
            );


        res.status(201).json({

            success: true,

            message:
                "Project created successfully",

            data:
                finalProject

        });

    } catch (error) {

        console.error(
            "Create project error:",
            error
        );


        // =================================================
        // CLEAN CLOUDINARY MAIN IMAGE
        // =================================================

        if (uploadedMainImage) {

            await deleteFromCloudinary(
                uploadedMainImage.public_id
            );

        }


        // =================================================
        // CLEAN CLOUDINARY GALLERY
        // =================================================

        for (
            const image
            of uploadedGallery
        ) {

            await deleteFromCloudinary(
                image.public_id
            );

        }


        res.status(500).json({

            success: false,

            message:
                "Failed to create project"

        });

    }
}


// =====================================================
// UPDATE PROJECT
// =====================================================

async function updateProject(
    req,
    res
) {

    let uploadedMainImage = null;


    try {

        const id =
            parseInt(
                req.params.id
            );


        if (isNaN(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid project ID"

            });

        }


        const existingProject =
            await projectModel.getProject(id);


        if (!existingProject) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found"

            });

        }


        const {

            project_title,

            category,

            client,

            location,

            description,

            completion_date,

            status,

            project_area,

            offered_service

        } = req.body;


        if (
            !project_title ||
            !project_title.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Project title is required"

            });

        }


        if (
            !category ||
            !category.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Project category is required"

            });

        }


        // =================================================
        // NEW MAIN IMAGE
        // =================================================

        if (
            req.files &&
            req.files.project_image &&
            req.files.project_image.length > 0
        ) {

            uploadedMainImage =
                await uploadToCloudinary(

                    req.files
                        .project_image[0]
                        .buffer

                );

        }


        const updated =
            await projectModel.updateProject(

                id,

                {

                    project_title:
                        project_title.trim(),

                    category:
                        category.trim(),

                    client:
                        client
                            ? client.trim()
                            : null,

                    location:
                        location
                            ? location.trim()
                            : null,

                    description:
                        description
                            ? description.trim()
                            : null,

                    completion_date:
                        completion_date || null,

                    status:
                        status || "Completed",

                    project_area:
                        project_area
                            ? project_area.trim()
                            : null,

                    offered_service:
                        offered_service
                            ? offered_service.trim()
                            : null,

                    project_image:
                        uploadedMainImage
                            ? uploadedMainImage.secure_url
                            : null,

                    project_image_public_id:
                        uploadedMainImage
                            ? uploadedMainImage.public_id
                            : null

                }

            );


        // =================================================
        // DELETE OLD MAIN IMAGE
        // =================================================

        if (
            uploadedMainImage &&
            existingProject.project_image_public_id
        ) {

            await deleteFromCloudinary(

                existingProject
                    .project_image_public_id

            );

        }


        // =================================================
        // ADD NEW GALLERY IMAGES
        // =================================================

        if (
            req.files &&
            req.files.project_gallery
        ) {

            for (
                const file
                of req.files.project_gallery
            ) {

                const uploaded =
                    await uploadToCloudinary(
                        file.buffer
                    );


                await projectModel.addGalleryImage(

                    id,

                    uploaded.secure_url,

                    uploaded.public_id

                );

            }

        }


        const finalProject =
            await projectModel.getProject(id);


        res.status(200).json({

            success: true,

            message:
                "Project updated successfully",

            data:
                finalProject

        });

    } catch (error) {

        console.error(
            "Update project error:",
            error
        );


        if (uploadedMainImage) {

            await deleteFromCloudinary(
                uploadedMainImage.public_id
            );

        }


        res.status(500).json({

            success: false,

            message:
                "Failed to update project"

        });

    }
}


// =====================================================
// DELETE PROJECT
// =====================================================

async function deleteProject(
    req,
    res
) {

    try {

        const id =
            parseInt(
                req.params.id
            );


        if (isNaN(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid project ID"

            });

        }


        const existingProject =
            await projectModel.getProject(id);


        if (!existingProject) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found"

            });

        }


        const deleted =
            await projectModel.deleteProject(id);


        // =================================================
        // DELETE MAIN IMAGE
        // =================================================

        if (
            existingProject
                .project_image_public_id
        ) {

            await deleteFromCloudinary(

                existingProject
                    .project_image_public_id

            );

        }


        // =================================================
        // DELETE GALLERY IMAGES
        // =================================================

        if (
            existingProject.gallery
        ) {

            for (
                const image
                of existingProject.gallery
            ) {

                await deleteFromCloudinary(

                    image.image_public_id

                );

            }

        }


        res.status(200).json({

            success: true,

            message:
                "Project deleted successfully",

            data:
                deleted

        });

    } catch (error) {

        console.error(
            "Delete project error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to delete project"

        });

    }
}


// =====================================================
// DELETE GALLERY IMAGE
// =====================================================

async function deleteGalleryImage(
    req,
    res
) {

    try {

        const id =
            parseInt(
                req.params.id
            );


        if (isNaN(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid gallery image ID"

            });

        }


        const deleted =
            await projectModel.deleteGalleryImage(
                id
            );


        if (!deleted) {

            return res.status(404).json({

                success: false,

                message:
                    "Gallery image not found"

            });

        }


        if (
            deleted.image_public_id
        ) {

            await deleteFromCloudinary(

                deleted.image_public_id

            );

        }


        res.status(200).json({

            success: true,

            message:
                "Gallery image deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete gallery image error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to delete gallery image"

        });

    }
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getProjects,

    getProject,

    createProject,

    updateProject,

    deleteProject,

    deleteGalleryImage

};