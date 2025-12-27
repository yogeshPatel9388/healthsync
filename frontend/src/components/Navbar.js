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
    // FIX: Changed z-50 to z-40 so it stays below the Booking Modal (z-50)
    // FIX: Ensure 'fixed' is used instead of 'sticky' for absolute consistency during scroll
    <nav className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm fixed top-0 left-0 right-0 z-40 transition-colors duration-300 h-16">
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

          {/* Mobile Right Section */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-slate-900 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="px-6 py-8 space-y-4">
            {user ? (
              <>
                <div className="flex items-center p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl mb-6">
                  <div className="bg-blue-600 p-3 rounded-xl mr-4 text-white">
                    <LayoutDashboard size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-blue-600 uppercase font-black tracking-tighter">
                      {user.role}
                    </p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block w-full p-4 text-lg font-bold text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-2xl transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left p-4 text-lg font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all flex items-center gap-3"
                >
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center p-5 text-xl font-bold text-gray-700 dark:text-slate-200 bg-gray-50 dark:bg-slate-800 rounded-2xl"
                >
                  <LogIn className="mr-4 text-blue-600" /> Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center p-5 text-xl font-bold bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20"
                >
                  <UserPlus className="mr-4" /> Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
