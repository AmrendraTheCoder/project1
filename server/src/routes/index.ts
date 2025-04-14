import { Router } from "express";
import authRoutes from "./authRoutes.js";
import VerifyRoutes from "./verifyRoutes.js";
import PasswordRoutes from "./passwordRoutes.js";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/auth", PasswordRoutes);
router.use("/", VerifyRoutes);

export default router;
