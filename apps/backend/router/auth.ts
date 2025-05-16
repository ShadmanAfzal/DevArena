import { Router } from "express";
import { loginUser, logoutUser, refreshToken } from "../controller/auth.js";

const router = Router();

router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/refresh-token", refreshToken);

export default router;
