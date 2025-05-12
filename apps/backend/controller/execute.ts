import { Request, Response } from "express";
import executeCode from "../service/executeCode";
import { ErrorType } from "../types/errorType";

export const executeExpression = async (req: Request, res: Response) => {
  try {
    const expressionBase64: string = req.body.expression;

    const expression = Buffer.from(expressionBase64, "base64").toString(
      "utf-8"
    );

    const result = await executeCode(expression);

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
