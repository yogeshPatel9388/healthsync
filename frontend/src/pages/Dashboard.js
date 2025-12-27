import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.js";
import API from "../api/axios.js";
import AppointmentCard from "../components/AppointmentCard";
import DoctorList from "../components/DoctorList";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/api/appointments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await API.delete(`/api/appointments/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAppointments(appointments.filter((app) => app._id !== id));
      } catch (err) {
        alert("Failed to cancel appointment");
      }
    }
  };

  return (
    // UPDATED: Added dark:bg-slate-950
    <div className="p-8 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Manage your health schedule and appointments.
          </p>
        </header>

        {/* Section 1: Actions (Only for Patients) */}
        {user?.role === "Patient" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6 flex items-center">
              <span className="mr-2">🔍</span> Find a Doctor
            </h2>
            <DoctorList />
          </section>
        )}

        {/* Section 2: Appointments List */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6 flex items-center">
            <span className="mr-2">📅</span> Your Appointments
          </h2>

          {appointments.length > 0 ? (
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
            // UPDATED: Empty state box for dark mode
            <div className="bg-white dark:bg-slate-900 p-10 rounded-xl text-center border-2 border-dashed border-gray-200 dark:border-slate-800">
              <p className="text-gray-400 dark:text-slate-500">
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
