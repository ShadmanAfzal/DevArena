import { Router } from "express";
import { executeExpression } from "../controller/execute.js";

const router = Router();

router.post("/", executeExpression);

export default router;
