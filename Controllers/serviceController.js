const Service = require("../models/serviceModel");


// ==========================================
// GET ALL SERVICES
// ==========================================

const getServices = async (req, res) => {

    try {

        const services = await Service.getAllServices();

        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });

    } catch (error) {

        console.error("Get Services Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch services"
        });
    }
};


// ==========================================
// GET ONE SERVICE
// ==========================================

const getService = async (req, res) => {

    try {

        const id = Number(req.params.id);

        // Validate ID BEFORE sending it to SQL Server
        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid service ID"
            });

        }

        const service = await Service.getServiceById(id);

        if (!service) {

            return res.status(404).json({
                success: false,
                message: "Service not found"
            });

        }

        res.status(200).json({
            success: true,
            data: service
        });

    } catch (error) {

        console.error("Get Service Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch service"
        });
    }
};


// ==========================================
// CREATE SERVICE
// ==========================================

const createService = async (req, res) => {

    try {

        const {
            title,
            category,
            description,
            status
        } = req.body;


        if (!title || !title.trim()) {

            return res.status(400).json({
                success: false,
                message: "Service title is required"
            });

        }


        const serviceId = await Service.createService(
            title.trim(),
            category ? category.trim() : null,
            description ? description.trim() : null,
            status || "Published"
        );


        const service =
            await Service.getServiceById(serviceId);


        res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: service
        });

    } catch (error) {

        console.error("Create Service Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create service"
        });
    }
};


// ==========================================
// UPDATE SERVICE
// ==========================================

const updateService = async (req, res) => {

    try {

        const id = Number(req.params.id);

        // Validate ID
        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid service ID"
            });

        }


        const {
            title,
            category,
            description,
            status
        } = req.body;


        if (!title || !title.trim()) {

            return res.status(400).json({
                success: false,
                message: "Service title is required"
            });

        }


        const result =
            await Service.updateService(
                id,
                title.trim(),
                category ? category.trim() : null,
                description ? description.trim() : null,
                status || "Published"
            );


        if (result.rowsAffected[0] === 0) {

            return res.status(404).json({
                success: false,
                message: "Service not found"
            });

        }


        const service =
            await Service.getServiceById(id);


        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: service
        });

    } catch (error) {

        console.error("Update Service Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update service"
        });
    }
};


// ==========================================
// DELETE SERVICE
// ==========================================

const deleteService = async (req, res) => {

    try {

        const id = Number(req.params.id);

        // Validate ID
        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid service ID"
            });

        }


        const result =
            await Service.deleteService(id);


        if (result.rowsAffected[0] === 0) {

            return res.status(404).json({
                success: false,
                message: "Service not found"
            });

        }


        res.status(200).json({
            success: true,
            message: "Service deleted successfully"
        });

    } catch (error) {

        console.error("Delete Service Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete service"
        });
    }
};


module.exports = {
    getServices,
    getService,
    createService,
    updateService,
    deleteService
};