import { Link } from "react-router";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { useUserStore } from "../../../store/userStore";
import { loginUser } from "../../../api/auth";
import ProfileAvatar from "./ProfileAvatar";

export const Header = () => {
  const { isLoggedIn, setUser } = useUserStore((state) => state);

  const handleSuccessfulLogin = async (response: CodeResponse) => {
    const user = await loginUser(response.code);

    if (user) setUser(user);
  };

  const login = useGoogleLogin({
    flow: "auth-code",
    scope: "openid email profile",
    onSuccess: handleSuccessfulLogin,
  });

  return (
    <div className="flex flex-row gap-4 justify-between py-4 mx-4">
      <div className="text-xl">
        <Link to="/">🚀 DevArena</Link>
      </div>
      {!isLoggedIn ? (
        <div
          className="cursor-pointer hover:bg-card transition-all duration-200 ease-in-out px-3 py-1.5 rounded-lg"
          onClick={() => login()}
        >
          Login
        </div>
      ) : (
        <ProfileAvatar />
      )}
    </div>
  );
};
