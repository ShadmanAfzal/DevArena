import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import AuthService from "../service/auth.js";

const authService = new AuthService(new PrismaClient());

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await authService.getUserById(req.userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.log("Error occurred while fetching user details", error);
    res.status(500).json({
      error: "Error occured while fetching user details",
    });
  }
};
