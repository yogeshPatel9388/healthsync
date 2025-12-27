import React, { useRef } from "react";
import { Link } from "react-router-dom";
import DoctorList from "../components/DoctorList";
import {
  ShieldCheck,
  Clock,
  Video,
  FileText,
  Zap,
  Users,
  Calendar,
  CheckCircle,
} from "lucide-react";

const LandingPage = () => {
  const doctorSectionRef = useRef(null);

  const scrollToDoctors = () => {
    doctorSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: ShieldCheck,
      title: "Secure Data",
      desc: "Your medical history and personal data are protected with industry-standard encryption.",
    },
    {
      icon: Video,
      title: "Telehealth Ready",
      desc: "Consult with your doctors via high-quality video calls without leaving your home.",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      desc: "Forget long queues. Book your preferred slot in under 60 seconds with instant confirmation.",
    },
    {
      icon: FileText,
      title: "Digital Records",
      desc: "Access your prescriptions, lab reports, and appointment history from one dashboard.",
    },
    {
      icon: Users,
      title: "Family Profiles",
      desc: "Manage appointments for your children or elderly parents from a single account.",
    },
    {
      icon: Clock,
      title: "Smart Reminders",
      desc: "Never miss an appointment with automated notifications 24 hours before your visit.",
    },
  ];

  return (
    <div className="flex flex-col items-center transition-colors duration-500 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full -z-10"></div>

        {/* Reduced from text-8xl to text-6xl for PC comfort */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-5 tracking-tight leading-tight">
          Healthcare <br />
          <span className="text-blue-600 dark:text-blue-500">
            Without the Wait.
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400 max-w-xl mb-10 leading-relaxed">
          The all-in-one platform for secure medical appointments, digital
          health records, and expert consultations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={scrollToDoctors}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-2"
          >
            <Calendar size={18} />
            Find a Doctor
          </button>
          <Link
            to="/register"
            className="bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border border-blue-600/20 dark:border-blue-500/30 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* 2. USP / FEATURES GRID */}
      <section className="w-full bg-white dark:bg-slate-950 py-24 border-y border-gray-100 dark:border-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
            <div className="text-center md:text-left">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">
                Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
                Why HealthSync?
              </h2>
            </div>
            <p className="text-gray-500 dark:text-slate-400 max-w-xs text-base text-center md:text-right">
              Modern technology put at the center of the patient experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <div
                key={index}
                className="group p-8 rounded-[2rem] bg-gray-50 dark:bg-slate-900 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
              >
                {/* Side-aligned icons as discussed for better readability */}
                <div className="mb-5 p-3.5 bg-blue-600 dark:bg-slate-800 w-14 h-14 flex items-center justify-center rounded-xl shadow-md group-hover:scale-105 transition-all">
                  <item.icon
                    className="text-white dark:text-blue-400"
                    size={24}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="w-full py-24 bg-slate-900 relative overflow-hidden text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            Your Journey to Wellness
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-xl font-bold mb-3">Discover</h3>
              <p className="text-sm text-slate-400">
                Search for specialists based on symptoms or department.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-xl font-bold mb-3">Schedule</h3>
              <p className="text-sm text-slate-400">
                Choose your preferred slot from real-time availability.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-xl font-bold mb-3">Consult</h3>
              <p className="text-sm text-slate-400">
                Join your session securely and receive a digital diagnosis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DOCTOR LIST SECTION */}
      <section
        ref={doctorSectionRef}
        className="w-full max-w-7xl mx-auto py-24 px-6"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Available Specialists
          </h2>
          <p className="text-base text-gray-500 dark:text-slate-400 max-w-xl mx-auto">
            Browse our list of certified specialists and book in seconds.
          </p>
        </div>

        <DoctorList />
      </section>

      {/* 5. FINAL CTA STRIP */}
      <section className="w-full py-16 px-6">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-blue-600/30">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 relative z-10">
            Are you a medical professional?
          </h2>
          <p className="text-white/80 text-base mb-8 max-w-md mx-auto relative z-10">
            Join our network and streamline your patient management today.
          </p>
          <Link
            to="/register"
            state={{ defaultRole: "Doctor" }}
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-base hover:bg-gray-100 transition-all relative z-10 active:scale-95"
          >
            Partner with Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
