import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeOff, Eye } from "lucide-react";
import { loginapi } from "../services/authservice.js";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginapi({
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      navigate("/dashboard");
      console.log("Login successful:", data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="bg-[url('/back.jpg')] min-h-screen w-full bg-cover bg-no-repeat flex justify-center items-center relative">
      <div className="inset-0 absolute bg-black/45"></div>

      <div className="relative z-10 w-100 bg-black/40 backdrop-blur-xl border-white/20 p-8 shadow-2xl rounded-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>

          <p className="mt-2 text-white/60">
            Login to continue to HotelSeatBooking
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-4 text-white">
          <label>Email</label>
          <br />

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            className="bg-white/10 w-full rounded-md p-1 mt-2 outline-0 focus:ring-1 focus:ring-amber-500"
          />

          <label>Password</label>
          <br />

          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full rounded-md bg-white/10 p-2 pr-10 outline-none focus:ring-1 focus:ring-[#C89B5A]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="text-center w-full mt-6 bg-black/30 hover:bg-white/10 p-1 rounded-lg cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#C89B5A] hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
