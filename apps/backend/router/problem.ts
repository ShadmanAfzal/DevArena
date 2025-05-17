import { Router } from "express";
import {
  getAllProblems,
  getProblemBySlug,
  runProblemTestCases,
} from "../controller/problem.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, getAllProblems);
router.get("/:slug", authMiddleware, getProblemBySlug);
router.post("/:id/run", authMiddleware, runProblemTestCases);

export default router;
