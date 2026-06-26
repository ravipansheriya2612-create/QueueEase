import Token from "../models/Token.js";
import Service from "../models/Service.js";
import sendSMS from "../utils/sendSMS.js";

export const generateToken = async (req, res) => {
    try {
        const { serviceId } = req.body;

        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({
                message: "Service not found",
            })
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const lastToken = await Token.findOne({
            service: serviceId,
            queueDate: {
                $gte: today,
                $lte: tomorrow,
            }
        }).sort({ tokenNumber: -1 });

        const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

        const peopleBeforeUser = await Token.countDocuments({
            service: serviceId,
            status: "waiting",
            queueDate: {
                $gte: today,
                $lt: tomorrow,
            },
        })

        const estimatedWaitTime = peopleBeforeUser * service.averageServiceTime;

        const token = await Token.create({
            user: req.user._id,
            service: serviceId,
            tokenNumber,
            estimatedWaitTime,
        })

        // await token.populate("user", "name phone");
        // await token.populate("service", "name");

        // if (token.user?.name) {
        //     await sendSMS(
        //         token.user.phone,
        //         `MediQueue: Your token #${token.tokenNumber} has been generated for ${token.service.name}. Estimated wait time: ${token.estimatedWaitTime} minutes.`
        //     );
        // }

        const io = req.app.get("io");

        io.to(serviceId).emit("queue_updated", {
            message: "New token generated",
            token,
        })

        res.status(201).json({
            message: "Token generated successfully",
            token,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const myToken = async (req, res) => {
    try {
        const token = await Token.findOne({
            user: req.user._id,
            status: { $in: ["waiting", "called", "in-progress"] },
        }).populate("service");

        res.status(200).json({
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const liveQueue = async (req, res) => {
    try {

        const { serviceId } = req.params;

        const tokens = await Token.find({
            service: serviceId,
            status: { $in: ["waiting", "called", "in-progress"] },
        }).populate("user", "name email").populate("service", "name averageServiceTime").sort({ tokenNumber: 1 });

        res.status(200).json({
            tokens,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const callToken = async (req, res) => {
    try {
        const token = await Token.findById(req.params.id);

        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        token.status = "called";
        token.startTime = new Date();

        await token.save();

        // await token.populate("user", "name phone");
        // await token.populate("service", "name");

        // if (token.user?.phone) {
        //     await sendSMS(
        //         token.user.phone,
        //         `MediQueue: Your token #${token.tokenNumber} has been called. Please proceed to ${token.service.name}.`
        //     );
        // }

        const io = req.app.get("io");

        io.to(token.service.toString()).emit("token_called", {
            message: "Token called",
            token,
        })

        res.status(200).json({
            message: "Token called successfully",
            token,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const completeToken = async (req, res) => {
    try {

        const token = await Token.findById(req.params.id);

        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        token.status = "completed";
        token.completedTime = new Date();

        await token.save();

        const io = req.app.get("io");

        io.to(token.service.toString()).emit("token_completed", {
            message: "Token completed",
            token,
        })

        res.status(200).json({
            message: "Token completed successfully",
            token,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const skipToken = async (req, res) => {
    try {

        const token = await Token.findById(req.params.id);

        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        token.status = "skipped";

        await token.save();

        // await token.populate("user", "name phone");
        // await token.populate("service", "name");

        // if (token.user?.phone) {
        //     await sendSMS(
        //         token.user.phone,
        //         `MediQueue: Your token #${token.tokenNumber} has been skipped. Please contact reception if needed.`
        //     );
        // }

        const io = req.app.get("io");

        io.to(token.service.toString()).emit("queue_updated", {
            message: "Token skipped",
            token,
        })

        res.status(200).json({
            message: "Token skipped successfully",
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const cancelToken = async (req, res) => {
    try {

        const token = await Token.findById(req.params.id);

        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        if (token.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You cannot cancel this token" });
        }

        if (token.status !== "waiting") {
            return res.status(400).json({
                message: "Only waiting token can be cancelled",
            });
        }

        token.status = "cancelled";
        await token.save()

        const io = req.app.get("io");

        io.to(token.service.toString()).emit("queue_updated", {
            message: "Token cancelled",
            token,
        });

        res.status(200).json({
            message: "Token cancelled successfully",
            token,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAnalytics = async (req, res) => {
    try {

        const totalTokens = await Token.countDocuments();

        const completedTokens = await Token.countDocuments({ status: "completed" })

        const cancelledTokens = await Token.countDocuments({ status: "cancelled" })

        const skippedTokens = await Token.countDocuments({ status: "skipped" })

        const waitingTokens = await Token.countDocuments({ status: "waiting" })

        res.status(200).json({
            totalTokens,
            completedTokens,
            cancelledTokens,
            skippedTokens,
            waitingTokens,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAdvancedAnalytics = async (req, res) => {
    try {
        const statusWiseTokens = await Token.aggregate([
            {
                $group: {
                    _id: "$status",
                    total: { $sum: 1 },
                },
            },
        ]);

        const departmentWiseTokens = await Token.aggregate([
            {
                $group: {
                    _id: "$service",
                    totalTokens: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "services",
                    localField: "_id",
                    foreignField: "_id",
                    as: "department",
                },
            },
            {
                $unwind: "$department",
            },
            {
                $project: {
                    _id: 1,
                    departmentName: "$department.name",
                    totalTokens: 1,
                },
            },
        ]);

        const averageWaitingTimeData = await Token.aggregate([
            {
                $match: {
                    startTime: { $exists: true, $ne: null },
                    checkInTime: { $exists: true, $ne: null },
                },
            },
            {
                $project: {
                    waitingTime: {
                        $divide: [
                            { $subtract: ["$startTime", "$checkInTime"] },
                            1000 * 60,
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    avgWaitingTime: { $avg: "$waitingTime" },
                },
            },
        ]);

        res.status(200).json({
            statusWiseTokens,
            departmentWiseTokens,
            averageWaitingTime:
                averageWaitingTimeData.length > 0
                    ? Number(averageWaitingTimeData[0].avgWaitingTime.toFixed(2))
                    : 0,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};