"use strict";

const dashboardModel =
    require("../Models/dashboardModel");


// =====================================================
// GET DASHBOARD
// =====================================================

async function getDashboard(req, res) {

    try {

        const stats =
            await dashboardModel.getDashboardStats();


        const activities =
            await dashboardModel.getRecentActivities();


        res.status(200).json({

            success: true,

            data: {

                stats,

                activities

            }

        });

    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to load dashboard"

        });

    }
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getDashboard
};