import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { registerapi } from "../services/authservice.js";

function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const data = await registerapi({
        name,
        email,
        password,
      });

      console.log("Registration successful:", data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="bg-[url('/back.jpg')] min-h-screen w-full bg-cover bg-no-repeat flex justify-center items-center relative">
      <div className="inset-0 absolute bg-black/45"></div>

      <div className="relative z-10 w-100 bg-black/40 backdrop-blur-xl border-white/20 p-8 shadow-2xl rounded-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Sign Up</h1>

          <p className="mt-2 text-white/60">
            Register to continue to HotelSeatBooking
          </p>
        </div>

        <form onSubmit={handleRegister} className="mt-4 text-white">
          <label>Name</label>
          <br />

          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/10 w-full rounded-md p-1 mt-2 outline-0 focus:ring-1 focus:ring-amber-500"
            placeholder="Enter Name"
          />

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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="bg-white/10 w-full rounded-md p-1 mt-2 outline-0 focus:ring-1 focus:ring-amber-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1 text-white/60 hover:text-white"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="text-center w-full mt-6 bg-black/30 hover:bg-white/10 p-1 rounded-lg cursor-pointer"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#C89B5A] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
