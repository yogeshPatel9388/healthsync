import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext.js";
import API from "../api/axios.js";
import AppointmentCard from "../components/AppointmentCard";
import DoctorList from "../components/DoctorList";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Memoized fetch function so it can be passed to children without causing re-renders
  const fetchAppointments = useCallback(async () => {
    try {
      // FIX: Removed "/api" because your axios instance handles the baseURL
      const res = await API.get("/api/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Initial fetch on component mount
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // 3. Handle cancellation with instant UI update
  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        // FIX: Removed "/api" and manual headers
        await API.delete(`/api/appointments/${id}`);
        setAppointments((prev) => prev.filter((app) => app._id !== id));
      } catch (err) {
        alert("Failed to cancel appointment");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">
            Manage your health schedule and appointments.
          </p>
        </header>

        {/* Section 1: Actions (Only for Patients) */}
        {user?.role === "Patient" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6 flex items-center">
              <span className="mr-3 text-3xl">🔍</span> Find a Doctor
            </h2>
            {/* CRITICAL FIX: Pass fetchAppointments to DoctorList 
               so it can trigger a refresh after booking.
            */}
            <DoctorList onBookingSuccess={fetchAppointments} />
          </section>
        )}

        {/* Section 2: Appointments List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 flex items-center">
              <span className="mr-3 text-3xl">📅</span> Your Appointments
            </h2>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-1 rounded-full text-sm font-bold">
              {appointments.length} Total
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map((app) => (
                <AppointmentCard
                  key={app._id}
                  app={app}
                  userRole={user?.role}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-16 rounded-[2rem] text-center border-2 border-dashed border-gray-200 dark:border-slate-800 shadow-sm transition-all">
              <div className="text-6xl mb-4">☁️</div>
              <p className="text-gray-400 dark:text-slate-500 font-medium text-lg">
                No appointments scheduled yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
