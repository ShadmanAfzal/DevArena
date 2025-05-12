import { Router } from "express";
import { getUserInfo } from "../controller/user";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/me", authMiddleware, getUserInfo);

export default router;
