import Service from "../models/Service.js";

export const createService = async (req, res) => {
    try {
        const { name, description, averageServiceTime } = req.body;

        const service = await Service.create({ name, description, averageServiceTime });

        res.status(201).json({
            message: "Service created successfully",
            service,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getServices = async (req, res) => {
    try {
        const services = await Service.find({ isActive: true });

        res.status(200).json({
            services,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                message: "Department not found",
            });
        }
        await service.deleteOne();

        res.status(200).json({
            message: "Department deleted successfully",
        });
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};