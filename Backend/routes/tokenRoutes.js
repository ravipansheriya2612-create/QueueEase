import express from "express";
import { generateToken, myToken, liveQueue, callToken, completeToken, skipToken, cancelToken, getAnalytics, getAdvancedAnalytics } from "../controllers/tokenController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateToken);
router.get("/my-token", protect, myToken);
router.get("/live/:serviceId", liveQueue);

router.put("/admin/:id/call", protect, adminOnly, callToken);
router.put("/admin/:id/complete", protect, adminOnly, completeToken);
router.put("/admin/:id/skip", protect, adminOnly, skipToken);

router.put("/:id/cancel", protect, cancelToken);
router.get("/admin/analytics", protect, adminOnly, getAnalytics);
router.get("/admin/advanced-analytics", protect, adminOnly, getAdvancedAnalytics);

export default router;