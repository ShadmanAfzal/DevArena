import { Router } from "express";
import { getUserInfo } from "../controller/user.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/me", authMiddleware, getUserInfo);

export default router;
