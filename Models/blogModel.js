"use strict";

const {
    getPool,
    sql
} = require("../Config/db");


// =====================================================
// GET ALL BLOGS
// =====================================================

async function getBlogs() {

    const pool = await getPool();

    const result = await pool.request().query(`
        SELECT
            id,
            title,
            slug,
            excerpt,
            content,
            category,
            author,
            featured_image,
            image_public_id,
            video_url,
            video_public_id,
            status,
            is_featured,
            published_at,
            created_at,
            updated_at
        FROM Blogs
        ORDER BY
            published_at DESC,
            created_at DESC
    `);

    return result.recordset;
}


// =====================================================
// GET SINGLE BLOG
// =====================================================

async function getBlog(id) {

    const pool = await getPool();

    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`
            SELECT
                id,
                title,
                slug,
                excerpt,
                content,
                category,
                author,
                featured_image,
                image_public_id,
                video_url,
                video_public_id,
                status,
                is_featured,
                published_at,
                created_at,
                updated_at
            FROM Blogs
            WHERE id = @id
        `);

    return result.recordset[0];
}


// =====================================================
// CREATE BLOG
// =====================================================

async function createBlog(blogData) {

    const pool = await getPool();

    const result = await pool.request()

        .input(
            "title",
            sql.NVarChar(250),
            blogData.title
        )

        .input(
            "slug",
            sql.NVarChar(300),
            blogData.slug
        )

        .input(
            "excerpt",
            sql.NVarChar(1000),
            blogData.excerpt || null
        )

        .input(
            "content",
            sql.NVarChar(sql.MAX),
            blogData.content
        )

        .input(
            "category",
            sql.NVarChar(100),
            blogData.category || null
        )

        .input(
            "author",
            sql.NVarChar(150),
            blogData.author || null
        )

        .input(
            "featured_image",
            sql.NVarChar(1000),
            blogData.featured_image || null
        )

        .input(
            "image_public_id",
            sql.NVarChar(500),
            blogData.image_public_id || null
        )

        .input(
            "video_url",
            sql.NVarChar(1000),
            blogData.video_url || null
        )

        .input(
            "video_public_id",
            sql.NVarChar(500),
            blogData.video_public_id || null
        )

        .input(
            "status",
            sql.Bit,
            blogData.status ? 1 : 0
        )

        .input(
            "is_featured",
            sql.Bit,
            blogData.is_featured ? 1 : 0
        )

        .input(
            "published_at",
            sql.DateTime2,
            blogData.published_at || null
        )

        .query(`
            INSERT INTO Blogs
            (
                title,
                slug,
                excerpt,
                content,
                category,
                author,
                featured_image,
                image_public_id,
                video_url,
                video_public_id,
                status,
                is_featured,
                published_at
            )

            OUTPUT INSERTED.*

            VALUES
            (
                @title,
                @slug,
                @excerpt,
                @content,
                @category,
                @author,
                @featured_image,
                @image_public_id,
                @video_url,
                @video_public_id,
                @status,
                @is_featured,
                @published_at
            )
        `);

    return result.recordset[0];
}


// =====================================================
// UPDATE BLOG
// =====================================================

async function updateBlog(id, blogData) {

    const pool = await getPool();

    const request = pool.request();

    request.input("id", sql.Int, id);

    request.input(
        "title",
        sql.NVarChar(250),
        blogData.title
    );

    request.input(
        "slug",
        sql.NVarChar(300),
        blogData.slug
    );

    request.input(
        "excerpt",
        sql.NVarChar(1000),
        blogData.excerpt || null
    );

    request.input(
        "content",
        sql.NVarChar(sql.MAX),
        blogData.content
    );

    request.input(
        "category",
        sql.NVarChar(100),
        blogData.category || null
    );

    request.input(
        "author",
        sql.NVarChar(150),
        blogData.author || null
    );

    request.input(
        "status",
        sql.Bit,
        blogData.status ? 1 : 0
    );

    request.input(
        "is_featured",
        sql.Bit,
        blogData.is_featured ? 1 : 0
    );

    request.input(
        "published_at",
        sql.DateTime2,
        blogData.published_at || null
    );


    // -------------------------------------------------
    // IMAGE
    // -------------------------------------------------

    if (blogData.featured_image) {

        request.input(
            "featured_image",
            sql.NVarChar(1000),
            blogData.featured_image
        );

        request.input(
            "image_public_id",
            sql.NVarChar(500),
            blogData.image_public_id
        );
    }


    // -------------------------------------------------
    // VIDEO
    // -------------------------------------------------

    if (blogData.video_url) {

        request.input(
            "video_url",
            sql.NVarChar(1000),
            blogData.video_url
        );

        request.input(
            "video_public_id",
            sql.NVarChar(500),
            blogData.video_public_id
        );
    }


    // -------------------------------------------------
    // BUILD UPDATE QUERY
    // -------------------------------------------------

    let query = `
        UPDATE Blogs
        SET
            title = @title,
            slug = @slug,
            excerpt = @excerpt,
            content = @content,
            category = @category,
            author = @author,
            status = @status,
            is_featured = @is_featured,
            published_at = @published_at,
            updated_at = GETDATE()
    `;


    if (blogData.featured_image) {

        query += `,
            featured_image = @featured_image,
            image_public_id = @image_public_id
        `;
    }


    if (blogData.video_url) {

        query += `,
            video_url = @video_url,
            video_public_id = @video_public_id
        `;
    }


    query += `
        OUTPUT INSERTED.*
        WHERE id = @id
    `;


    const result = await request.query(query);

    return result.recordset[0];
}


// =====================================================
// DELETE BLOG
// =====================================================

async function deleteBlog(id) {

    const pool = await getPool();

    const result = await pool.request()

        .input(
            "id",
            sql.Int,
            id
        )

        .query(`
            DELETE FROM Blogs

            OUTPUT DELETED.*

            WHERE id = @id
        `);

    return result.recordset[0];
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