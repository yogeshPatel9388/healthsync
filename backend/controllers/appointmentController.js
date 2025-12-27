const Appointment = require("../models/Appointment");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

/**
 * BOOK APPOINTMENT
 * Handles concurrency, database saving, and dual email notifications.
 */
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;

    // 1. Concurrency Check: Ensure the slot isn't already taken
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot: timeSlot,
      status: "Scheduled",
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This doctor is already booked for the selected time slot.",
      });
    }

    // 2. Save Appointment to Database
    const newAppointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      date,
      timeSlot,
    });

    await newAppointment.save();

    // 3. Trigger Dual Email Confirmations
    try {
      const doctor = await User.findById(doctorId);
      const patientEmail = req.user.email;
      const patientName = req.user.name;
      const formattedDate = new Date(date).toLocaleDateString();

      // --- EMAIL TO PATIENT ---
      const patientSubject = "Appointment Confirmed - HealthSync";
      const patientText = `Hello ${patientName},

Your appointment with ${doctor.name} has been successfully scheduled.

Details:
Date: ${formattedDate}
Time: ${timeSlot}

Please log in to your dashboard if you need to manage or cancel your appointment.

Best regards,
HealthSync Hospital Team`;

      await sendEmail(patientEmail, patientSubject, patientText);

      // --- EMAIL TO DOCTOR ---
      const doctorSubject = "New Appointment Scheduled - HealthSync";
      const doctorText = `Hello ${doctor.name},

A new appointment has been scheduled with you.

Patient Name: ${patientName}
Date: ${formattedDate}
Time: ${timeSlot}

Please check your doctor dashboard for your updated schedule.

Best regards,
HealthSync System Notification`;

      await sendEmail(doctor.email, doctorSubject, doctorText);

      console.log(`✅ Dual Emails sent to: ${patientEmail} & ${doctor.email}`);
    } catch (emailErr) {
      // We don't return 500 here because the booking itself was successful in the DB
      console.error("Email delivery failed, but booking was saved:", emailErr);
    }

    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * GET MY APPOINTMENTS
 * Fetches appointments based on role and populates doctor/patient info.
 */
exports.getMyAppointments = async (req, res) => {
  try {
    const filter =
      req.user.role === "Doctor"
        ? { doctor: req.user.id }
        : { patient: req.user.id };

    const appointments = await Appointment.find(filter)
      .populate("doctor patient", "name specialization email")
      .sort({ date: 1, timeSlot: 1 }); // Sort by upcoming dates

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * CANCEL APPOINTMENT
 * Removes the record from the database.
 */
exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Optional: You could fetch the appointment details first to send a cancellation email
    await Appointment.findByIdAndDelete(appointmentId);

    res.json({ message: "Appointment successfully cancelled." });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
