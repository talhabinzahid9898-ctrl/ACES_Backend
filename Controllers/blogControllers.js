"use strict";

const blogModel = require("../Models/blogModel");
const cloudinary = require("../Config/cloudinary");


// =====================================================
// CLOUDINARY IMAGE/VIDEO UPLOAD
// =====================================================

function uploadToCloudinary(
    fileBuffer,
    resourceType = "auto"
) {

    return new Promise((resolve, reject) => {

        const uploadStream =
            cloudinary.uploader.upload_stream(
                {
                    folder: "ACES/User Home Page",
                    resource_type: resourceType
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


// =====================================================
// DELETE CLOUDINARY FILE
// =====================================================

async function deleteFromCloudinary(
    publicId,
    resourceType = "image"
) {

    if (!publicId) {
        return;
    }

    try {

        await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: resourceType
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
// GET ALL BLOGS
// =====================================================

async function getBlogs(req, res) {

    try {

        const blogs =
            await blogModel.getBlogs();

        res.status(200).json({
            success: true,
            data: blogs
        });

    } catch (error) {

        console.error(
            "Get blogs error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch blogs"
        });
    }
}


// =====================================================
// GET SINGLE BLOG
// =====================================================

async function getBlog(req, res) {

    try {

        const id =
            parseInt(req.params.id);

        if (isNaN(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid blog ID"
            });
        }


        const blog =
            await blogModel.getBlog(id);


        if (!blog) {

            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }


        res.status(200).json({
            success: true,
            data: blog
        });

    } catch (error) {

        console.error(
            "Get blog error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch blog"
        });
    }
}


// =====================================================
// CREATE BLOG
// =====================================================

async function createBlog(req, res) {

    let uploadedImage = null;
    let uploadedVideo = null;

    try {

        const {
            title,
            slug,
            excerpt,
            content,
            category,
            author,
            status,
            is_featured,
            published_at
        } = req.body;


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!title || !title.trim()) {

            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }


        if (!content || !content.trim()) {

            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }


        // -------------------------------------------------
        // IMAGE UPLOAD
        // -------------------------------------------------

        if (req.files && req.files.image) {

            uploadedImage =
                await uploadToCloudinary(
                    req.files.image[0].buffer,
                    "image"
                );
        }


        // -------------------------------------------------
        // VIDEO UPLOAD
        // -------------------------------------------------

        // if (req.files && req.files.video) {

        //     uploadedVideo =
        //         await uploadToCloudinary(
        //             req.files.video[0].buffer,
        //             "video"
        //         );
        // }
        if (req.files && req.files.video) {

    console.log({
        name: req.files.video[0].originalname,
        mimetype: req.files.video[0].mimetype,
        size: req.files.video[0].size
    });

    console.log("Uploading video to Cloudinary...");

    uploadedVideo =
        await uploadToCloudinary(
            req.files.video[0].buffer,
            "video"
        );

    console.log("VIDEO UPLOAD SUCCESS:");
    console.log(uploadedVideo);

}


        // -------------------------------------------------
        // DATABASE
        // -------------------------------------------------

        const blog =
            await blogModel.createBlog({

                title: title.trim(),

                slug:
                    slug
                        ? slug.trim()
                        : null,

                excerpt:
                    excerpt
                        ? excerpt.trim()
                        : null,

                content:
                    content.trim(),

                category:
                    category
                        ? category.trim()
                        : null,

                author:
                    author
                        ? author.trim()
                        : null,

                featured_image:
                    uploadedImage
                        ? uploadedImage.secure_url
                        : null,

                image_public_id:
                    uploadedImage
                        ? uploadedImage.public_id
                        : null,

                video_url:
                    uploadedVideo
                        ? uploadedVideo.secure_url
                        : null,

                video_public_id:
                    uploadedVideo
                        ? uploadedVideo.public_id
                        : null,

                status:
                    status === "true" ||
                    status === true,

                is_featured:
                    is_featured === "true" ||
                    is_featured === true,

                published_at:
                    published_at
                        ? new Date(published_at)
                        : null
            });


        res.status(201).json({

            success: true,

            message:
                "Blog created successfully",

            data: blog
        });


    } catch (error) {

        console.error(
            "Create blog error:",
            error
        );


        // Delete uploaded image if DB failed

        if (uploadedImage) {

            await deleteFromCloudinary(
                uploadedImage.public_id,
                "image"
            );
        }


        // Delete uploaded video if DB failed

        if (uploadedVideo) {

            await deleteFromCloudinary(
                uploadedVideo.public_id,
                "video"
            );
        }


        res.status(500).json({

            success: false,

            message:
                "Failed to create blog"
        });
    }
}


// =====================================================
// UPDATE BLOG
// =====================================================

async function updateBlog(req, res) {

    let uploadedImage = null;
    let uploadedVideo = null;

    try {

        const id =
            parseInt(req.params.id);


        if (isNaN(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid blog ID"
            });
        }


        // -------------------------------------------------
        // GET EXISTING BLOG
        // -------------------------------------------------

        const existingBlog =
            await blogModel.getBlog(id);


        if (!existingBlog) {

            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }


        const {
            title,
            slug,
            excerpt,
            content,
            category,
            author,
            status,
            is_featured,
            published_at
        } = req.body;


        if (!title || !title.trim()) {

            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }


        if (!content || !content.trim()) {

            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }


        // -------------------------------------------------
        // NEW IMAGE
        // -------------------------------------------------

        if (req.files && req.files.image) {

            uploadedImage =
                await uploadToCloudinary(
                    req.files.image[0].buffer,
                    "image"
                );
        }


        // -------------------------------------------------
        // NEW VIDEO
        // -------------------------------------------------

        if (req.files && req.files.video) {

            uploadedVideo =
                await uploadToCloudinary(
                    req.files.video[0].buffer,
                    "video"
                );
        }


        // -------------------------------------------------
        // UPDATE DATABASE
        // -------------------------------------------------

        const updatedBlog =
            await blogModel.updateBlog(
                id,
                {

                    title: title.trim(),

                    slug:
                        slug
                            ? slug.trim()
                            : null,

                    excerpt:
                        excerpt
                            ? excerpt.trim()
                            : null,

                    content:
                        content.trim(),

                    category:
                        category
                            ? category.trim()
                            : null,

                    author:
                        author
                            ? author.trim()
                            : null,

                    status:
                        status === "true" ||
                        status === true,

                    is_featured:
                        is_featured === "true" ||
                        is_featured === true,

                    published_at:
                        published_at
                            ? new Date(published_at)
                            : null,

                    featured_image:
                        uploadedImage
                            ? uploadedImage.secure_url
                            : null,

                    image_public_id:
                        uploadedImage
                            ? uploadedImage.public_id
                            : null,

                    video_url:
                        uploadedVideo
                            ? uploadedVideo.secure_url
                            : null,

                    video_public_id:
                        uploadedVideo
                            ? uploadedVideo.public_id
                            : null
                }
            );


        // -------------------------------------------------
        // DELETE OLD IMAGE
        // -------------------------------------------------

        if (
            uploadedImage &&
            existingBlog.image_public_id
        ) {

            await deleteFromCloudinary(
                existingBlog.image_public_id,
                "image"
            );
        }


        // -------------------------------------------------
        // DELETE OLD VIDEO
        // -------------------------------------------------

        if (
            uploadedVideo &&
            existingBlog.video_public_id
        ) {

            await deleteFromCloudinary(
                existingBlog.video_public_id,
                "video"
            );
        }


        res.status(200).json({

            success: true,

            message:
                "Blog updated successfully",

            data: updatedBlog
        });


    } catch (error) {

        console.error(
            "Update blog error:",
            error
        );


        if (uploadedImage) {

            await deleteFromCloudinary(
                uploadedImage.public_id,
                "image"
            );
        }


        if (uploadedVideo) {

            await deleteFromCloudinary(
                uploadedVideo.public_id,
                "video"
            );
        }


        res.status(500).json({

            success: false,

            message:
                "Failed to update blog"
        });
    }
}


// =====================================================
// DELETE BLOG
// =====================================================

async function deleteBlog(req, res) {

    try {

        const id =
            parseInt(req.params.id);


        if (isNaN(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid blog ID"
            });
        }


        const existingBlog =
            await blogModel.getBlog(id);


        if (!existingBlog) {

            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }


        const deletedBlog =
            await blogModel.deleteBlog(id);


        // Delete image

        if (existingBlog.image_public_id) {

            await deleteFromCloudinary(
                existingBlog.image_public_id,
                "image"
            );
        }


        // Delete video

        if (existingBlog.video_public_id) {

            await deleteFromCloudinary(
                existingBlog.video_public_id,
                "video"
            );
        }


        res.status(200).json({

            success: true,

            message:
                "Blog deleted successfully",

            data: deletedBlog
        });


    } catch (error) {

        console.error(
            "Delete blog error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to delete blog"
        });
    }
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog
};