import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationBell from "../ui/NotificationBell.jsx";

const getAuthInfo = () => {
  const token = localStorage.getItem("token");
  if (!token) return { isAuthenticated: false, role: null };

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.role) {
        return { isAuthenticated: true, role: parsedUser.role };
      }
    }

    const payloadBase64 = token.split(".")[1];
    if (payloadBase64) {
      const decoded = JSON.parse(atob(payloadBase64));
      return { isAuthenticated: true, role: decoded.role || null };
    }
  } catch {
    // Fallback if token payload cannot be decoded
  }

  return { isAuthenticated: true, role: localStorage.getItem("role") || null };
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [auth, setAuth] = useState(getAuthInfo);

  useEffect(() => {
    setAuth(getAuthInfo());
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setAuth({ isAuthenticated: false, role: null });
    navigate("/login");
  };

  const isAdmin = auth.role === "hotel_admin" || auth.role === "super_admin";

  return (
    <nav className="bg-[#171717] text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/hotels")}
          className="font-display text-lg sm:text-xl font-semibold tracking-wide text-left hover:text-[#C89B5A] transition-colors cursor-pointer"
        >
          Hotel Seat Booking System
        </button>

        <div className="flex items-center gap-3 sm:gap-5">
          {auth.isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => navigate("/hotels")}
                className="font-ui text-sm cursor-pointer hover:text-[#C89B5A] transition-colors"
              >
                Hotels
              </button>

              <button
                type="button"
                onClick={() => navigate("/hotels/myBookings")}
                className="font-ui text-sm cursor-pointer hover:text-[#C89B5A] transition-colors"
              >
                My Bookings
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => navigate("/scan-qr")}
                  className="font-ui text-sm cursor-pointer hover:text-[#C89B5A] transition-colors"
                >
                  Scan QR
                </button>
              )}

              <NotificationBell />

              <button
                type="button"
                onClick={handleLogout}
                className="font-ui text-sm border border-white/20 hover:border-[#C89B5A] hover:text-[#C89B5A] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="font-ui text-sm cursor-pointer hover:text-[#C89B5A] transition-colors"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                type="button"
                className="font-ui text-sm bg-[#C89B5A] hover:bg-[#B48748] text-white font-semibold px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
