import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { deleteNotification, deleteOneparticular, getNotification } from "../controllers/notification.controller.js";
const router = express.Router();

router.get("/",protectRoute,getNotification);
router.delete("/",protectRoute,deleteNotification);
router.delete("/:id",protectRoute,deleteOneparticular);

export default router;