import { useNavigate } from "react-router";
import { useUserStore } from "../../store/userStore";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isLoading, user } = useUserStore((state) => state);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    function checkAuthorization() {
      if (isLoading) return;

      if (!user || !user.isAdmin) {
        console.error("Unauthorized access to admin dashboard");
        return navigate("/", { replace: true });
      }

      setIsCheckingAuth(false);
    }

    checkAuthorization();
  }, [user, navigate, isLoading]);

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoaderCircle className="animate-spin" size={24} />
        <p className="text-lg mt-4">Checking authorization...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg">This is the admin dashboard.</p>
    </div>
  );
};

export default AdminDashboard;
