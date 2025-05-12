import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

type JwtPayload = {
  sub?: string;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["auth-token"];

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.userId = decodedToken.sub;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
