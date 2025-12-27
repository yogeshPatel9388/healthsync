import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeToggle from "./themeToggle";
import {
  Menu,
  X,
  Hospital,
  LogOut,
  LayoutDashboard,
  UserPlus,
  LogIn,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* 1. NAVIGATION BAR */}
      <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm fixed top-0 left-0 right-0 z-[60] transition-colors duration-300 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-2 text-blue-600 dark:text-blue-400"
              >
                <Hospital className="w-8 h-8" />
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  HealthSync
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-2"></div>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 font-semibold text-sm transition-colors"
                  >
                    Dashboard
                  </Link>
                  <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full uppercase tracking-widest">
                    {user.role}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-bold text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 font-bold text-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggles */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={toggleMenu}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. MOBILE OVERLAY & MENU */}
      {/* Background Blur Overlay: Only shows when menu is open */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[50] transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Floating Menu Card */}
      <div
        className={`
        fixed left-4 right-4 z-[55] md:hidden
        bg-white dark:bg-slate-900 
        rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-slate-800
        transition-all duration-300 ease-out
        ${
          isOpen
            ? "top-20 opacity-100 scale-100"
            : "top-[-100%] opacity-0 scale-95"
        }
      `}
      >
        <div className="space-y-6">
          {user ? (
            <>
              <div className="flex items-center p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100/50 dark:border-blue-900/20">
                <div className="bg-blue-600 p-3.5 rounded-2xl mr-4 text-white shadow-lg shadow-blue-600/20">
                  <LayoutDashboard size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    {user.name}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-black tracking-widest">
                    {user.role}
                  </p>
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block w-full p-5 text-lg font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-2xl transition-all"
              >
                Go to Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left p-5 text-lg font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all flex items-center gap-3"
              >
                <LogOut size={22} /> Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-4">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center p-5 text-xl font-bold text-gray-700 dark:text-slate-200 bg-gray-50 dark:bg-slate-800 rounded-2xl"
              >
                <LogIn className="mr-3 text-blue-600" /> Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center p-5 text-xl font-bold bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/30"
              >
                <UserPlus className="mr-3" /> Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
