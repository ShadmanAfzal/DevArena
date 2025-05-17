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
      req.userId = null;
      return next();
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.userId = decodedToken.sub ?? null;
  } catch (error) {
    req.userId = null;
  }

  next();
};
