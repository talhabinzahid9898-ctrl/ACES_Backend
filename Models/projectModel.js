"use strict";

const {
    getPool,
    sql
} = require("../Config/db");


// =====================================================
// GET ALL PROJECTS
// =====================================================

async function getProjects() {

    const pool = await getPool();

    const result = await pool.request().query(`

        SELECT
            id,
            project_title,
            category,
            client,
            location,
            description,
            project_image,
            image_public_id,
            completion_date,
            status,
            project_area,
            offered_service,
            uploaded_at,
            created_at,
            updated_at

        FROM Projects

        ORDER BY
            created_at DESC

    `);

    return result.recordset;
}


// =====================================================
// GET SINGLE PROJECT
// =====================================================

async function getProject(id) {

    const pool = await getPool();

    const projectResult =
        await pool.request()

            .input(
                "id",
                sql.Int,
                id
            )

            .query(`

                SELECT
                    id,
                    project_title,
                    category,
                    client,
                    location,
                    description,
                    project_image,
                    image_public_id,
                    completion_date,
                    status,
                    project_area,
                    offered_service,
                    uploaded_at,
                    created_at,
                    updated_at

                FROM Projects

                WHERE id = @id

            `);


    if (
        projectResult.recordset.length === 0
    ) {

        return null;

    }


    const project =
        projectResult.recordset[0];


    // =================================================
    // GET GALLERY
    // =================================================

    const galleryResult =
        await pool.request()

            .input(
                "project_id",
                sql.Int,
                id
            )

            .query(`

                SELECT

                    id,
                    project_id,
                    image_url,
                    image_public_id,
                    created_at

                FROM ProjectGallery

                WHERE project_id = @project_id

                ORDER BY id ASC

            `);


    project.gallery =
        galleryResult.recordset;


    return project;
}


// =====================================================
// CREATE PROJECT
// =====================================================

async function createProject(projectData) {

    const pool = await getPool();


    const result =
        await pool.request()

            .input(
                "project_title",
                sql.NVarChar(250),
                projectData.project_title
            )

            .input(
                "category",
                sql.NVarChar(100),
                projectData.category
            )

            .input(
                "client",
                sql.NVarChar(200),
                projectData.client || null
            )

            .input(
                "location",
                sql.NVarChar(250),
                projectData.location || null
            )

            .input(
                "description",
                sql.NVarChar(sql.MAX),
                projectData.description || null
            )

            .input(
                "project_image",
                sql.NVarChar(1000),
                projectData.project_image || null
            )

            .input(
                "image_public_id",
                sql.NVarChar(500),
                projectData.image_public_id || null
            )

            .input(
                "completion_date",
                sql.Date,
                projectData.completion_date || null
            )

            .input(
                "status",
                sql.NVarChar(50),
                projectData.status || "Completed"
            )

            .input(
                "project_area",
                sql.NVarChar(100),
                projectData.project_area || null
            )

            .input(
                "offered_service",
                sql.NVarChar(1000),
                projectData.offered_service || null
            )

            .input(
                "uploaded_at",
                sql.DateTime2,
                projectData.uploaded_at || new Date()
            )

            .query(`

                INSERT INTO Projects
                (
                    project_title,
                    category,
                    client,
                    location,
                    description,
                    project_image,
                    image_public_id,
                    completion_date,
                    status,
                    project_area,
                    offered_service,
                    uploaded_at
                )

                OUTPUT INSERTED.*

                VALUES
                (
                    @project_title,
                    @category,
                    @client,
                    @location,
                    @description,
                    @project_image,
                    @image_public_id,
                    @completion_date,
                    @status,
                    @project_area,
                    @offered_service,
                    @uploaded_at
                )

            `);


    return result.recordset[0];
}


// =====================================================
// UPDATE PROJECT
// =====================================================

async function updateProject(
    id,
    projectData
) {

    const pool = await getPool();

    const request =
        pool.request();


    request.input(
        "id",
        sql.Int,
        id
    );


    request.input(
        "project_title",
        sql.NVarChar(250),
        projectData.project_title
    );


    request.input(
        "category",
        sql.NVarChar(100),
        projectData.category
    );


    request.input(
        "client",
        sql.NVarChar(200),
        projectData.client || null
    );


    request.input(
        "location",
        sql.NVarChar(250),
        projectData.location || null
    );


    request.input(
        "description",
        sql.NVarChar(sql.MAX),
        projectData.description || null
    );


    request.input(
        "completion_date",
        sql.Date,
        projectData.completion_date || null
    );


    request.input(
        "status",
        sql.NVarChar(50),
        projectData.status || "Completed"
    );


    request.input(
        "project_area",
        sql.NVarChar(100),
        projectData.project_area || null
    );


    request.input(
        "offered_service",
        sql.NVarChar(1000),
        projectData.offered_service || null
    );


    let query = `

        UPDATE Projects

        SET

            project_title = @project_title,

            category = @category,

            client = @client,

            location = @location,

            description = @description,

            completion_date = @completion_date,

            status = @status,

            project_area = @project_area,

            offered_service = @offered_service,

            updated_at = GETDATE()

    `;


    // =================================================
    // MAIN IMAGE
    // =================================================

    if (projectData.project_image) {

        request.input(
            "project_image",
            sql.NVarChar(1000),
            projectData.project_image
        );


        request.input(
            "image_public_id",
            sql.NVarChar(500),
            projectData.image_public_id
        );


        query += `,

            project_image = @project_image,

            image_public_id =
                @image_public_id

        `;
    }


    query += `

        OUTPUT INSERTED.*

        WHERE id = @id

    `;


    const result =
        await request.query(query);


    return result.recordset[0];
}


// =====================================================
// DELETE PROJECT
// =====================================================

async function deleteProject(id) {

    const pool = await getPool();


    const result =
        await pool.request()

            .input(
                "id",
                sql.Int,
                id
            )

            .query(`

                DELETE FROM Projects

                OUTPUT DELETED.*

                WHERE id = @id

            `);


    return result.recordset[0];
}


// =====================================================
// ADD GALLERY IMAGE
// =====================================================

async function addGalleryImage(
    projectId,
    imageUrl,
    publicId
) {

    const pool = await getPool();


    const result =
        await pool.request()

            .input(
                "project_id",
                sql.Int,
                projectId
            )

            .input(
                "image_url",
                sql.NVarChar(1000),
                imageUrl
            )

            .input(
                "image_public_id",
                sql.NVarChar(500),
                publicId
            )

            .query(`

                INSERT INTO ProjectGallery
                (
                    project_id,
                    image_url,
                    image_public_id
                )

                OUTPUT INSERTED.*

                VALUES
                (
                    @project_id,
                    @image_url,
                    @image_public_id
                )

            `);


    return result.recordset[0];
}


// =====================================================
// DELETE GALLERY IMAGE
// =====================================================

async function deleteGalleryImage(id) {

    const pool = await getPool();


    const result =
        await pool.request()

            .input(
                "id",
                sql.Int,
                id
            )

            .query(`

                DELETE FROM ProjectGallery

                OUTPUT DELETED.*

                WHERE id = @id

            `);


    return result.recordset[0];
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

    addGalleryImage,

    deleteGalleryImage

};