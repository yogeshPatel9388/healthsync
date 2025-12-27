import React from "react";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, User, Trash2 } from "lucide-react";

const AppointmentCard = ({ app, userRole, onCancel }) => {
  // Safe date parsing
  const formattedDate = app.date
    ? format(parseISO(app.date), "PPP")
    : "Date TBD";

  return (
    // UPDATED: Added dark:bg-slate-900, dark:border-slate-800, and dark:shadow-none
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 hover:shadow-md dark:hover:border-slate-700 transition-all relative overflow-hidden">
      {/* Role Indicator Strip */}
      <div
        className={`absolute top-0 left-0 w-1 h-full ${
          userRole === "Doctor" ? "bg-green-500" : "bg-blue-500"
        }`}
      />

      <div className="space-y-4">
        {/* Date Section */}
        <div className="flex items-center text-gray-700 dark:text-slate-200">
          <Calendar className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
          <span className="font-semibold">{formattedDate}</span>
        </div>

        {/* Time Section */}
        <div className="flex items-center text-gray-600 dark:text-slate-400">
          <Clock className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
          <span>{app.timeSlot}</span>
        </div>

        {/* User Section */}
        <div className="flex items-center text-gray-600 dark:text-slate-400">
          <User className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
          <span>
            {userRole === "Patient"
              ? `${app.doctor?.name}`
              : `Patient: ${app.patient?.name}`}
          </span>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-50 dark:border-slate-800 flex justify-between items-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              app.status === "Cancelled"
                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            }`}
          >
            {app.status || "Scheduled"}
          </span>

          <button
            onClick={() => onCancel(app._id)}
            className="flex items-center text-sm font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
