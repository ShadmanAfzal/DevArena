import { Request, Response } from "express";
import executeCode from "../service/executeCode.js";
import { ErrorType } from "../types/errorType.js";
import { Language } from "@dev-arena/shared";

export const executeExpression = async (req: Request, res: Response) => {
  try {
    const expressionBase64 = req.body.expression;
    const language = req.body.language as Language;

    const expression = Buffer.from(expressionBase64, "base64").toString(
      "utf-8"
    );

    const result = await executeCode(expression, language);

    if (result.errorType) {
      res.status(500).json({
        error: result.message,
        errorType: result.errorType,
      });

      return;
    }

    res.json({ data: result.data });
  } catch (error) {
    console.error("Error executing expression:", error);
    res.status(500).json({
      error: "Invalid expression",
      errorType: ErrorType.EXECUTION_ERROR,
    });
  }
};
