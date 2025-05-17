import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import AuthService from "../service/auth.js";

const authService = new AuthService(new PrismaClient());

export const loginUser = async (req: Request, res: Response) => {
  try {
    const userInfo = await authService.handleGoogleAuthCode(req.body.code);

    if (!userInfo) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const user = await authService.createOrUpdateUser(userInfo);

    const token = authService.generateJWT(user.userId);

    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user });
  } catch (error) {
    console.log("Error occured while login user", error);
    res.status(500).json({ error: "Error occured while login user" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("auth-token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error occured while logout user", error);
    res.status(500).json({ error: "Error occured while logout user" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const tokens = await authService.getRefreshToken(req.body.refreshToken);

  res.json({ tokens });
};
