// "use strict";

// const {
//     sql,
//     getPool
// } = require("../Config/db");


// // ============================================================
// // GET ALL TEAMS
// // ============================================================

// async function getAllTeams() {

//     const pool =
//         await getPool();


//     const result =
//         await pool.request().query(`

//             SELECT
//                 id,
//                 name,
//                 position,
//                 department,
//                 bio,
//                 image_url,
//                 image_public_id,
//                 display_order,
//                 status,
//                 created_at,
//                 uploaded_at

//             FROM Teams

//             ORDER BY
//                 display_order ASC,
//                 created_at DESC

//         `);


//     return result.recordset;

// }


// // ============================================================
// // GET ONE TEAM
// // ============================================================

// async function getTeamById(id) {

//     const pool =
//         await getPool();


//     const result =
//         await pool.request()

//             .input(
//                 "id",
//                 sql.Int,
//                 id
//             )

//             .query(`

//                 SELECT
//                     id,
//                     name,
//                     position,
//                     department,
//                     bio,
//                     image_url,
//                     image_public_id,
//                     display_order,
//                     status,
//                     created_at,
//                     uploaded_at

//                 FROM Teams

//                 WHERE id = @id

//             `);


//     return result.recordset[0];

// }


// // ============================================================
// // CREATE TEAM
// // ============================================================

// async function createTeam(teamData) {

//     const pool =
//         await getPool();


//     const result =
//         await pool.request()

//             .input(
//                 "name",
//                 sql.NVarChar(150),
//                 teamData.name
//             )

//             .input(
//                 "position",
//                 sql.NVarChar(150),
//                 teamData.position
//             )

//             .input(
//                 "department",
//                 sql.NVarChar(150),
//                 teamData.department
//             )

//             .input(
//                 "bio",
//                 sql.NVarChar(sql.MAX),
//                 teamData.bio
//             )

//             .input(
//                 "image_url",
//                 sql.NVarChar(1000),
//                 teamData.image_url
//             )

//             .input(
//                 "image_public_id",
//                 sql.NVarChar(500),
//                 teamData.image_public_id
//             )

//             .input(
//                 "display_order",
//                 sql.Int,
//                 teamData.display_order
//             )

//             .input(
//                 "status",
//                 sql.Bit,
//                 teamData.status ? 1 : 0
//             )

//             .input(
//                 "uploaded_at",
//                 sql.DateTime2,
//                 teamData.image_url
//                     ? new Date()
//                     : null
//             )

//             .query(`

//                 INSERT INTO Teams
//                 (
//                     name,
//                     position,
//                     department,
//                     bio,
//                     image_url,
//                     image_public_id,
//                     display_order,
//                     status,
//                     uploaded_at
//                 )

//                 OUTPUT INSERTED.*

//                 VALUES
//                 (
//                     @name,
//                     @position,
//                     @department,
//                     @bio,
//                     @image_url,
//                     @image_public_id,
//                     @display_order,
//                     @status,
//                     @uploaded_at
//                 )

//             `);


//     return result.recordset[0];

// }


// // ============================================================
// // UPDATE TEAM
// // ============================================================

// async function updateTeam(id, teamData) {

//     const pool =
//         await getPool();


//     const request =
//         pool.request();


//     request.input(
//         "id",
//         sql.Int,
//         id
//     );


//     request.input(
//         "name",
//         sql.NVarChar(150),
//         teamData.name
//     );


//     request.input(
//         "position",
//         sql.NVarChar(150),
//         teamData.position
//     );


//     request.input(
//         "department",
//         sql.NVarChar(150),
//         teamData.department
//     );


//     request.input(
//         "bio",
//         sql.NVarChar(sql.MAX),
//         teamData.bio
//     );


//     request.input(
//         "display_order",
//         sql.Int,
//         teamData.display_order
//     );


//     request.input(
//         "status",
//         sql.Bit,
//         teamData.status ? 1 : 0
//     );


//     // --------------------------------------------------------
//     // IF NEW IMAGE
//     // --------------------------------------------------------

//     if (teamData.image_url) {

//         request.input(
//             "image_url",
//             sql.NVarChar(1000),
//             teamData.image_url
//         );


//         request.input(
//             "image_public_id",
//             sql.NVarChar(500),
//             teamData.image_public_id
//         );


//         request.input(
//             "uploaded_at",
//             sql.DateTime2,
//             new Date()
//         );


//         const result =
//             await request.query(`

//                 UPDATE Teams

//                 SET
//                     name = @name,
//                     position = @position,
//                     department = @department,
//                     bio = @bio,
//                     image_url = @image_url,
//                     image_public_id = @image_public_id,
//                     display_order = @display_order,
//                     status = @status,
//                     uploaded_at = @uploaded_at

//                 OUTPUT INSERTED.*

//                 WHERE id = @id

//             `);


//         return result.recordset[0];

//     }


//     // --------------------------------------------------------
//     // WITHOUT NEW IMAGE
//     // --------------------------------------------------------

//     const result =
//         await request.query(`

//             UPDATE Teams

//             SET
//                 name = @name,
//                 position = @position,
//                 department = @department,
//                 bio = @bio,
//                 display_order = @display_order,
//                 status = @status

//             OUTPUT INSERTED.*

//             WHERE id = @id

//         `);


//     return result.recordset[0];

// }


// // ============================================================
// // DELETE TEAM
// // ============================================================

// async function deleteTeam(id) {

//     const pool =
//         await getPool();


//     const result =
//         await pool.request()

//             .input(
//                 "id",
//                 sql.Int,
//                 id
//             )

//             .query(`

//                 DELETE FROM Teams

//                 OUTPUT DELETED.*

//                 WHERE id = @id

//             `);


//     return result.recordset[0];

// }


// // ============================================================
// // EXPORT
// // ============================================================

// module.exports = {

//     getAllTeams,

//     getTeamById,

//     createTeam,

//     updateTeam,

//     deleteTeam

// };


"use strict";

const {
    getPool
} = require("../Config/db");


// ============================================================
// GET ALL TEAMS
// ============================================================

async function getAllTeams() {

    const pool =
        await getPool();


    const [rows] =
        await pool.query(`

            SELECT
                id,
                name,
                position,
                department,
                bio,
                image_url,
                image_public_id,
                display_order,
                status,
                created_at,
                uploaded_at

            FROM Teams

            ORDER BY
                display_order ASC,
                created_at DESC

        `);


    return rows;

}


// ============================================================
// GET ONE TEAM
// ============================================================

async function getTeamById(id) {

    const pool =
        await getPool();


    const [rows] =
        await pool.query(
            `

                SELECT
                    id,
                    name,
                    position,
                    department,
                    bio,
                    image_url,
                    image_public_id,
                    display_order,
                    status,
                    created_at,
                    uploaded_at

                FROM Teams

                WHERE id = ?

            `,
            [id]
        );


    return rows[0];

}


// ============================================================
// CREATE TEAM
// ============================================================

async function createTeam(teamData) {

    const pool =
        await getPool();


    const uploadedAt =
        teamData.image_url
            ? new Date()
            : null;


    const [result] =
        await pool.query(
            `

                INSERT INTO Teams
                (
                    name,
                    position,
                    department,
                    bio,
                    image_url,
                    image_public_id,
                    display_order,
                    status,
                    uploaded_at
                )

                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )

            `,
            [
                teamData.name,
                teamData.position,
                teamData.department,
                teamData.bio,
                teamData.image_url,
                teamData.image_public_id,
                teamData.display_order,
                teamData.status ? 1 : 0,
                uploadedAt
            ]
        );


    // MySQL has no OUTPUT INSERTED.* — fetch the row we just created
    return getTeamById(result.insertId);

}


// ============================================================
// UPDATE TEAM
// ============================================================

async function updateTeam(id, teamData) {

    const pool =
        await getPool();


    // --------------------------------------------------------
    // IF NEW IMAGE
    // --------------------------------------------------------

    if (teamData.image_url) {

        await pool.query(
            `

                UPDATE Teams

                SET
                    name = ?,
                    position = ?,
                    department = ?,
                    bio = ?,
                    image_url = ?,
                    image_public_id = ?,
                    display_order = ?,
                    status = ?,
                    uploaded_at = ?

                WHERE id = ?

            `,
            [
                teamData.name,
                teamData.position,
                teamData.department,
                teamData.bio,
                teamData.image_url,
                teamData.image_public_id,
                teamData.display_order,
                teamData.status ? 1 : 0,
                new Date(),
                id
            ]
        );


        // MySQL has no OUTPUT INSERTED.* — fetch the row after updating
        return getTeamById(id);

    }


    // --------------------------------------------------------
    // WITHOUT NEW IMAGE
    // --------------------------------------------------------

    await pool.query(
        `

            UPDATE Teams

            SET
                name = ?,
                position = ?,
                department = ?,
                bio = ?,
                display_order = ?,
                status = ?

            WHERE id = ?

        `,
        [
            teamData.name,
            teamData.position,
            teamData.department,
            teamData.bio,
            teamData.display_order,
            teamData.status ? 1 : 0,
            id
        ]
    );


    return getTeamById(id);

}


// ============================================================
// DELETE TEAM
// ============================================================

async function deleteTeam(id) {

    const pool =
        await getPool();


    // MySQL has no OUTPUT DELETED.* — read the row before deleting it
    const deletedTeam =
        await getTeamById(id);


    await pool.query(
        `

            DELETE FROM Teams

            WHERE id = ?

        `,
        [id]
    );


    return deletedTeam;

}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getAllTeams,

    getTeamById,

    createTeam,

    updateTeam,

    deleteTeam

};