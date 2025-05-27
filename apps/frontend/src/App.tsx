import { BrowserRouter, Route, Routes } from "react-router";
import { Tooltip } from "react-tooltip";
import Homepage from "./ui/homepage";
import Problem from "./ui/problem";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { useUserStore } from "./store/userStore";
import { fetchUserInfo } from "./api/user";
import { Header } from "./ui/homepage/components/Header";
import AdminDashboard from "./ui/admin-dashboard";

function App() {
  const { setUser, setLoading } = useUserStore((state) => state);

  const env = import.meta.env;

  useEffect(() => {
    const init = async () => {
      const user = await fetchUserInfo();

      if (user) return setUser(user);

      return setLoading(false);
    };

    init();
  }, [setUser, setLoading]);

  return (
    <div className="h-screen flex flex-col custom-scrollbar">
      <GoogleOAuthProvider clientId={env.VITE_CLIENT_ID}>
        <BrowserRouter>
          <Header />
          <Tooltip id="main" place="top" className="customTooltip" noArrow />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/problem/:slug" element={<Problem />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
