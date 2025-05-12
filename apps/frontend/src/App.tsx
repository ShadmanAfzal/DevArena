import { BrowserRouter, Route, Routes } from "react-router";
import Homepage from "./ui/homepage";
import Problem from "./ui/problem";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { useUserStore } from "./store/userStore";
import { fetchUserInfo } from "./api/user";

function App() {
  const { isLoggedIn, setUser } = useUserStore((state) => state);

  useEffect(() => {
    const init = async () => {
      const user = await fetchUserInfo();

      if (user) setUser(user);
    };

    init();
  }, [isLoggedIn, setUser]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/problem/:slug" element={<Problem />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
