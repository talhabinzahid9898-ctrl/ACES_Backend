"use strict";

const express =
    require("express");

const multer =
    require("multer");

const projectController =
    require("../Controllers/projectControllers");


const router =
    express.Router();


// =====================================================
// MULTER MEMORY STORAGE
// =====================================================

const storage =
    multer.memoryStorage();


// =====================================================
// FILE FILTER
// =====================================================

const fileFilter =
    (req, file, cb) => {

        if (
            file.fieldname ===
            "project_image"
        ) {

            const allowed =
                [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];


            if (
                allowed.includes(
                    file.mimetype
                )
            ) {

                return cb(
                    null,
                    true
                );

            }


            return cb(
                new Error(
                    "Only JPG, PNG and WEBP images are allowed"
                )
            );
        }


        if (
            file.fieldname ===
            "project_gallery"
        ) {

            const allowed =
                [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];


            if (
                allowed.includes(
                    file.mimetype
                )
            ) {

                return cb(
                    null,
                    true
                );

            }


            return cb(
                new Error(
                    "Only JPG, PNG and WEBP gallery images are allowed"
                )
            );
        }


        cb(
            new Error(
                "Unexpected file field"
            )
        );

    };


// =====================================================
// MULTER
// =====================================================

const upload =
    multer({

        storage,

        fileFilter,

        limits: {

            fileSize:
                10 * 1024 * 1024,

            files:
                21

        }

    });


// =====================================================
// GET ALL
// =====================================================

router.get(
    "/",
    projectController.getProjects
);


// =====================================================
// GET ONE
// =====================================================

router.get(
    "/:id",
    projectController.getProject
);


// =====================================================
// CREATE
// =====================================================

router.post(

    "/",

    upload.fields([

        {
            name:
                "project_image",

            maxCount:
                1
        },

        {
            name:
                "project_gallery",

            maxCount:
                20
        }

    ]),

    projectController.createProject

);


// =====================================================
// UPDATE
// =====================================================

router.put(

    "/:id",

    upload.fields([

        {
            name:
                "project_image",

            maxCount:
                1
        },

        {
            name:
                "project_gallery",

            maxCount:
                20
        }

    ]),

    projectController.updateProject

);


// =====================================================
// DELETE PROJECT
// =====================================================

router.delete(
    "/:id",
    projectController.deleteProject
);


// =====================================================
// DELETE GALLERY IMAGE
// =====================================================

router.delete(

    "/gallery/:id",

    projectController.deleteGalleryImage

);


module.exports = router;