import { User } from "../store/userStore";

const env = import.meta.env;

export const loginUser = async (code: string): Promise<User> => {
  const response = await fetch(`${env.VITE_BACKEND_API_ENDPOINT}/auth/login`, {
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
