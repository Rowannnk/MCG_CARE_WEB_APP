import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://backend-zeta-pied-49.vercel.app/api/auth/user/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success("Registration Successfull!");
        navigate("/login");
      } else {
        toast.error(data.message || "Registration Failed");
      }
      console.log("Register with:", { name, email, password });
    } catch (error) {
      console.error("Register Error", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-red-100/30 blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-60 h-60 rounded-full bg-red-200/20 blur-xl"></div>

      {/* Registration Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20 relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">AirCon Service</h2>
          <p className="text-gray-600 mt-2">Create Your Account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-red-600 hover:text-red-800 font-medium hover:underline"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
