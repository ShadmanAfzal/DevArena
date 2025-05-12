import { User } from "@prisma/client";
import { OAuth2Client, UserRefreshClient } from "google-auth-library";
import jwt from "jsonwebtoken";

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);

const handleGoogleAuthCode = async (
  code: string
): Promise<Omit<User, "userId" | "lastActive">> => {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  const ticket = await oAuth2Client.verifyIdToken({
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
};

const getRefreshToken = async (refreshToken: string) => {
  const user = new UserRefreshClient(
    process.env.CLIENT_ID,
    process.env.CLIENT_ID,
    refreshToken
  );
  const { credentials } = await user.refreshAccessToken();

  return credentials;
};

const fetchUserInfo = async (
  accessToken: string
): Promise<Omit<User, "userId" | "lastActive"> | undefined> => {
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
};

const createToken = async (userId: string) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
};

export default {
  fetchUserInfo,
  handleGoogleAuthCode,
  getRefreshToken,
  createToken,
};
