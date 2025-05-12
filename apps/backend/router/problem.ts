import { Router } from "express";
import { getAllProblems, getProblemBySlug } from "../controller/problem";

const router = Router();

router.get("/", getAllProblems);
router.get("/:slug", getProblemBySlug);

export default router;
