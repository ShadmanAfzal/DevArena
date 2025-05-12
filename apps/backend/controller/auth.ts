import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import authService from "../service/auth";

const prisma = new PrismaClient();

export const loginUser = async (req: Request, res: Response) => {
  try {
    const userInfo = await authService.handleGoogleAuthCode(req.body.code);

    if (!userInfo) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const user = await prisma.user.upsert({
      create: {
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        profilePicture: userInfo.profilePicture,
      },
      where: {
        email: userInfo.email,
      },
      update: {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        profilePicture: userInfo.profilePicture,
        lastActive: new Date(),
      },
    });

    const token = await authService.createToken(user.userId);

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

export const refreshToken = async (req: Request, res: Response) => {
  const tokens = await authService.getRefreshToken(req.body.refreshToken);

  res.json({ tokens });
};
