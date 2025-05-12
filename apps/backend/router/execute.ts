import { Router } from "express";
import { executeExpression } from "../controller/execute";

const router = Router();

router.post("/", executeExpression);

export default router;
