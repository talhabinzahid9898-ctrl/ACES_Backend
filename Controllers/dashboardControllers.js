"use strict";

const dashboardModel =
    require("../Models/dashboardModel");


// ============================================================
// GET DASHBOARD
// ============================================================

async function getDashboard(req, res) {

    try {

        const dashboard =
            await dashboardModel.getDashboard();


        res.status(200).json({

            success: true,

            data: dashboard

        });

    } catch (error) {

        console.error(
            "======================================"
        );

        console.error(
            "DASHBOARD ERROR:"
        );

        console.error(
            error
        );

        console.error(
            "MESSAGE:",
            error.message
        );

        console.error(
            "STACK:",
            error.stack
        );

        console.error(
            "======================================"
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to load dashboard",

            // Temporary debugging information
            error:
                error.message

        });

    }
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    getDashboard
};