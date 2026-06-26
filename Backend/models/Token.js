import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },

    tokenNumber: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: [
            "waiting",
            "called",
            "in-progress",
            "completed",
            "skipped",
            "cancelled",
        ],
        default: "waiting",
    },

    queueDate: {
        type: Date,
        default: Date.now,
    },

    checkInTime: {
        type: Date,
        default: Date.now,
    },

    startTime: Date,

    completedTime: Date,

    estimatedWaitTime: {
        type: Number,
        default: 0,
    },
}, { timeseries: true });

const Token = mongoose.model("Token", tokenSchema);

export default Token;