import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/auth/login", { email, password });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    // UPDATED: Added dark:bg-slate-900, dark:border-slate-800, and transition
    <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email Address"
          required
          // UPDATED: Added dark:bg-slate-800, dark:border-slate-700, dark:text-white
          className="w-full p-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          required
          // UPDATED: Added dark:bg-slate-800, dark:border-slate-700, dark:text-white
          className="w-full p-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 dark:hover:bg-blue-500 transition shadow-lg active:transform active:scale-95"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-slate-400">
        New to HealthSync?{" "}
        <Link
          to="/register"
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
