import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#171717] text-white">
      <div className="flex flex-row px-4 py-4">
        <p className="font-display">Hotel Seat Booking System</p>
        <div className="flex ml-auto gap-3">
          <button
            className="font-ui cursor-pointer hover:text-yellow-600"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="font-ui cursor-pointer hover:text-yellow-600"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
