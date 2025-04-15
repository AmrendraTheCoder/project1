import { Router } from "express";
import authRoutes from "./authRoutes.js";
import VerifyRoutes from "./verifyRoutes.js";
import PasswordRoutes from "./passwordRoutes.js";
import RumoursRoutes from "./rumourRoutes.js"
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/auth", PasswordRoutes);
router.use("/", VerifyRoutes);
router.use("/api/rumours", authMiddleware, RumoursRoutes);

export default router;
