import { PrismaClient, User } from "@prisma/client";
import {
  Credentials,
  OAuth2Client,
  UserRefreshClient,
} from "google-auth-library";
import jwt from "jsonwebtoken";

class AuthService {
  private prisma: PrismaClient;
  private authClient: OAuth2Client;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.authClient = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "postmessage"
    );
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { userId },
    });
  }

  async handleGoogleAuthCode(
    code: string
  ): Promise<Omit<User, "userId" | "lastActive">> {
    const { tokens } = await this.authClient.getToken(code);
    this.authClient.setCredentials(tokens);

    const ticket = await this.authClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) throw new Error("Payload is undefined");

    return {
      email: payload.email!,
      firstName: payload.given_name!,
      lastName: payload.family_name!,
      profilePicture: payload.picture!,
    };
  }

  async getRefreshToken(refreshToken: string): Promise<Credentials> {
    const user = new UserRefreshClient(
      process.env.CLIENT_ID,
      process.env.CLIENT_ID,
      refreshToken
    );
    const { credentials } = await user.refreshAccessToken();

    return credentials;
  }

  async fetchUserInfo(
    accessToken: string
  ): Promise<Omit<User, "userId" | "lastActive"> | undefined> {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const responseBody = await response.json();

      return {
        email: responseBody.email,
        firstName: responseBody.given_name,
        lastName: responseBody.family_name,
        profilePicture: responseBody.picture,
      };
    } catch (error) {
      console.log("Error occured while fetching user details", error);
    }
  }

  async createOrUpdateUser(
    userInfo: Omit<User, "userId" | "lastActive">
  ): Promise<User> {
    return this.prisma.user.upsert({
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
  }

  generateJWT(userId: string) {
    return jwt.sign({ sub: userId }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
  }
}

export default AuthService;
