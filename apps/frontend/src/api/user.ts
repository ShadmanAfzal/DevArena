import { User } from "../store/userStore";

const env = import.meta.env;

export const fetchUserInfo = async (): Promise<User | null> => {
  const response = await fetch(`${env.VITE_BACKEND_API_ENDPOINT}/user/me`, {
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
