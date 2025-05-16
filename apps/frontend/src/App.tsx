import { BrowserRouter, Route, Routes } from "react-router";
import Homepage from "./ui/homepage";
import Problem from "./ui/problem";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { useUserStore } from "./store/userStore";
import { fetchUserInfo } from "./api/user";
import { Header } from "./ui/homepage/components/Header";

function App() {
  const { setUser } = useUserStore((state) => state);

  const env = import.meta.env;

  useEffect(() => {
    const init = async () => {
      const user = await fetchUserInfo();

      if (user) setUser(user);
    };

    init();
  }, [setUser]);

  return (
    <div className="h-screen flex flex-col">
      <GoogleOAuthProvider clientId={env.VITE_CLIENT_ID}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/problem/:slug" element={<Problem />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
