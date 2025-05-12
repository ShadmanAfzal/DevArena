import { User } from "../store/userStore";

const BASE_URL = "http://localhost:3000/api";

export const fetchUserInfo = async (): Promise<User | null> => {
  const response = await fetch(`${BASE_URL}/user/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) return null;

  const result = await response.json();

  return result.user;
};
