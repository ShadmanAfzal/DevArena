import { User } from "../store/userStore";

const BASE_URL = "http://localhost:3000/api";

export const loginUser = async (code: string): Promise<User> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ code }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();

  return result.user;
};
