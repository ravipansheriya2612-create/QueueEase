import express from "express";
import { createService, getServices, deleteService } from "../controllers/serviceController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createService);
router.get("/", getServices);
router.delete("/:id", protect, adminOnly, deleteService);

export default router;