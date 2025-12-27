import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { X, Calendar, Clock, CheckCircle } from "lucide-react";

const BookingForm = ({ doctor, onClose }) => {
  const [formData, setFormData] = useState({ date: "", timeSlot: "" });
  const [loading, setLoading] = useState(false);

  // UNIFORMITY FIX: Prevents the background dashboard from scrolling while booking
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // No need to manually get token, API instance handles it
      const appointmentData = {
        doctorId: doctor._id,
        date: new Date(formData.date).toISOString(),
        timeSlot: formData.timeSlot,
      };

      // Changed path from "/api/appointments" to just "/appointments"
      await API.post("api/appointments", appointmentData);

      alert("✅ Appointment Confirmed!");
      
      // Close the modal first
      onClose(); 
      
      // Instead of reload, ideally you'd call a refresh function passed from props
      // window.location.reload(); 
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Slot already taken or error occurred"
      );
    } finally {
      // This is the most important part to fix the "stuck" button
      setLoading(false); 
    }
  };

  return (
    /* VISUAL FIX: 
      1. z-[100] ensures this sits ABOVE the Navbar (z-40).
      2. inset-0 ensures the blur/overlay covers the very top of the screen.
    */
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 flex items-center justify-center p-4 z-[30] backdrop-blur-md transition-all animate-in fade-in duration-300">
      {/* Modal Container: rounded-[2.5rem] matches your premium USP cards */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-slate-800 transition-all relative overflow-hidden">
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          <X size={24} />
        </button>

        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
            Book with {doctor.name}
          </h2>
          <p className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-xs mt-2">
            {doctor.specialization}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Picker */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 ml-1">
              <Calendar size={16} className="text-blue-600" /> Select Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              required
              className="block w-full border border-gray-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          {/* Time Slot Selector */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 ml-1">
              <Clock size={16} className="text-blue-600" /> Select Time Slot
            </label>
            <div className="relative">
              <select
                required
                className="block w-full border border-gray-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                onChange={(e) =>
                  setFormData({ ...formData, timeSlot: e.target.value })
                }
              >
                <option value="">Choose a slot</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
              {/* Custom Chevron for select */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border border-gray-200 dark:border-slate-800 rounded-2xl text-gray-600 dark:text-slate-400 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900/50 font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Confirming...</span>
              ) : (
                <>
                  <CheckCircle size={20} /> Confirm
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
