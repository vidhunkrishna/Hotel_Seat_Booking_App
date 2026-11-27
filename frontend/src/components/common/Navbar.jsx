import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationBell from "../ui/NotificationBell.jsx";
import { logout } from "@/utils/auth.js";
const getAuthInfo = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { isAuthenticated: false, role: null };
  }

  try {
    const payload = token.split(".")[1];

    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );

    if (!decoded.exp || decoded.exp * 1000 <= Date.now()) {
      throw new Error("Token expired");
    }

    return {
      isAuthenticated: true,
      role: decoded.role,
    };
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    return { isAuthenticated: false, role: null };
  }
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [auth, setAuth] = useState(getAuthInfo);

  useEffect(() => {
    setAuth(getAuthInfo());

    const interval = setInterval(() => {
      setAuth(getAuthInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();

      setAuth({
        isAuthenticated: false,
        role: null,
      });

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Unable to log out. Please try again.");
    }
  };

  const isAdmin = auth.role === "hotel_admin" || auth.role === "super_admin";

  return (
    <nav className="bg-[#171717] text-white w-full min-h-[54px] flex flex-row items-center flex-wrap">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="text-white m-4 font-display cursor-pointer"
      >
        Hotel Seat Booking System
      </button>

      <div className="flex flex-wrap items-center ml-auto mr-4 text-white font-ui">
        {auth.isAuthenticated ? (
          <>
            <button
              type="button"
              onClick={() => navigate("/hotels")}
              className="mr-4 cursor-pointer hover:text-[#C89B5A] transition-colors"
            >
              Hotels
            </button>

            <button
              type="button"
              onClick={() => navigate("/bookings")}
              className="mr-4 cursor-pointer hover:text-[#C89B5A] transition-colors"
            >
              My Bookings
            </button>

            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/scan-qr")}
                  className="mr-4 cursor-pointer hover:text-[#C89B5A] transition-colors"
                >
                  Scan QR
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/analytics")}
                  className="mr-4 cursor-pointer hover:text-[#C89B5A] transition-colors"
                >
                  Analytics
                </button>
              </>
            )}

            <NotificationBell />

            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer hover:text-yellow-600 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mr-4 cursor-pointer hover:text-yellow-600 transition-colors"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="cursor-pointer hover:text-yellow-600 transition-colors"
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
