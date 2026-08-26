"use strict";

const express = require("express");
const multer = require("multer");

const blogController =
    require("../Controllers/blogControllers");

const router = express.Router();


// =====================================================
// MULTER
// =====================================================

const storage =
    multer.memoryStorage();


const fileFilter =
    (req, file, cb) => {

        // Image

        if (
            file.fieldname === "image"
        ) {

            const allowedImages = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (
                allowedImages.includes(
                    file.mimetype
                )
            ) {

                return cb(null, true);
            }

            return cb(
                new Error(
                    "Only JPG, PNG and WEBP images are allowed"
                )
            );
        }


        // Video

        if (
            file.fieldname === "video"
        ) {

            const allowedVideos = [
                "video/mp4",
                "video/webm",
                "video/quicktime"
            ];

            if (
                allowedVideos.includes(
                    file.mimetype
                )
            ) {

                return cb(null, true);
            }

            return cb(
                new Error(
                    "Only MP4, WEBM and MOV videos are allowed"
                )
            );
        }


        cb(
            new Error(
                "Unexpected file field"
            )
        );
    };


const upload =
    multer({

        storage,

        fileFilter,

        limits: {

            // Adjust according to your Cloudinary plan

            fileSize:
                100 * 1024 * 1024
        }
    });


// =====================================================
// GET ALL
// =====================================================

router.get(
    "/",
    blogController.getBlogs
);


// =====================================================
// GET ONE
// =====================================================

router.get(
    "/:id",
    blogController.getBlog
);


// =====================================================
// CREATE
// =====================================================

router.post(
    "/",
    upload.fields([
        {
            name: "image",
            maxCount: 1
        },
        {
            name: "video",
            maxCount: 1
        }
    ]),
    blogController.createBlog
);


// =====================================================
// UPDATE
// =====================================================

router.put(
    "/:id",
    upload.fields([
        {
            name: "image",
            maxCount: 1
        },
        {
            name: "video",
            maxCount: 1
        }
    ]),
    blogController.updateBlog
);


// =====================================================
// DELETE
// =====================================================

router.delete(
    "/:id",
    blogController.deleteBlog
);


module.exports = router;