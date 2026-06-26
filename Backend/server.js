import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/tokens", tokenRoutes);

app.get("/", (req, res) => {
    res.send("QueueEase Backend Running");
});

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

app.set("io", io);

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join_department", (serviceId) => {
        socket.join(serviceId);
        console.log(`User joined department: ${serviceId}`);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});