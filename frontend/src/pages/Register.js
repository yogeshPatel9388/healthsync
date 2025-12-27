import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access state passed via Link
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Patient",
    specialization: "",
  });

  // NEW: Effect to catch "defaultRole" from the Landing Page
  useEffect(() => {
    if (location.state?.defaultRole) {
      setFormData((prev) => ({
        ...prev,
        role: location.state.defaultRole,
      }));
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Safety check: Don't send specialization if user is a Patient
    const dataToSubmit = {
      ...formData,
      specialization:
        formData.role === "Doctor" ? formData.specialization : undefined,
    };

    try {
      const res = await API.post("/api/auth/register", dataToSubmit);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration Error:", err.response?.data);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <input
          type="text"
          placeholder="Full Name"
          required
          className="w-full p-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email Address"
          required
          className="w-full p-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {/* Role Selector */}
        <div className="flex gap-4 py-2">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="radio"
              name="role"
              value="Patient"
              className="accent-blue-600"
              checked={formData.role === "Patient"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value,
                  specialization: "",
                })
              }
            />
            <span className="text-gray-700 dark:text-slate-300 group-hover:text-blue-500 transition-colors font-medium">
              Patient
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="radio"
              name="role"
              value="Doctor"
              className="accent-blue-600"
              checked={formData.role === "Doctor"}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />
            <span className="text-gray-700 dark:text-slate-300 group-hover:text-blue-500 transition-colors font-medium">
              Doctor
            </span>
          </label>
        </div>

        {/* Specialization Input (Conditional) */}
        {formData.role === "Doctor" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 ml-1 uppercase">
              Medical Specialty
            </label>
            <input
              type="text"
              placeholder="e.g., Cardiologist, Surgeon"
              required
              className="w-full p-3 border border-blue-300 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.specialization}
              onChange={(e) =>
                setFormData({ ...formData, specialization: e.target.value })
              }
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 dark:hover:bg-blue-500 transition shadow-lg active:transform active:scale-95"
        >
          Create My Account
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
