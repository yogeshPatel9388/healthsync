import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import BookingForm from "./BookingForm";
import { AuthContext } from "../context/AuthContext";
import { Search, Stethoscope, Lock, ArrowRight, Plus } from "lucide-react";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // NEW: State to control how many doctors are visible
  const [visibleCount, setVisibleCount] = useState(6);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const res = await API.get("/api/users/doctors", config);
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors.");
      }
    };
    fetchDoctors();
  }, []);

  const handleBookingClick = (doc) => {
    if (!user) {
      navigate("/login");
    } else {
      setSelectedDoctor(doc);
    }
  };

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // NEW: Function to show more doctors
  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  return (
    <div className="space-y-12">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative w-full max-w-lg group">
          <Search
            className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name, specialty, or hospital..."
            className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all shadow-sm"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(6); // Reset count when searching
            }}
          />
        </div>
      </div>

      {/* Doctor Grid (Sliced based on visibleCount) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.slice(0, visibleCount).map((doc) => (
            <div
              key={doc._id}
              className="group bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Stethoscope size={32} />
                </div>
                {!user && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                    <Lock size={10} /> Member Only
                  </span>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {doc.name}
                </h3>
                <span className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-widest">
                  {doc.specialization}
                </span>
              </div>

              <button
                onClick={() => handleBookingClick(doc)}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg ${
                  user
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 shadow-none"
                }`}
              >
                <span>{user ? "Book Appointment" : "Login to Book"}</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50/50 dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-800">
            <p className="text-gray-400 dark:text-slate-500 text-lg">
              We couldn't find any specialists matching your search.
            </p>
          </div>
        )}
      </div>

      {/* NEW: Load More Button */}
      {filteredDoctors.length > visibleCount && (
        <div className="flex justify-center pt-8">
          <button
            onClick={handleShowMore}
            className="flex items-center gap-2 px-12 py-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-md active:scale-95 group"
          >
            <Plus
              size={20}
              className="text-blue-600 group-hover:rotate-90 transition-transform"
            />
            View More Specialists
          </button>
        </div>
      )}

      {selectedDoctor && user && (
        <BookingForm
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
};

export default DoctorList;
