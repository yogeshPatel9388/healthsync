const Appointment = require("../models/Appointment");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

/**
 * BOOK APPOINTMENT
 * Handles concurrency and database saving immediately.
 * Emails are moved to the background to prevent frontend timeouts.
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

    /** * OPTIMIZATION: Send response to frontend IMMEDIATELY.
     * This prevents the "Confirming..." button from getting stuck while waiting for email servers.
     */
    res.status(201).json(newAppointment);

    // 3. Trigger Dual Email Confirmations in the Background
    // We do NOT 'await' this block so the response above can finish instantly.
    (async () => {
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

Best regards,
HealthSync System Notification`;

        await sendEmail(doctor.email, doctorSubject, doctorText);

        console.log(
          `✅ Background emails sent for booking: ${newAppointment._id}`
        );
      } catch (emailErr) {
        console.error("Background email delivery failed:", emailErr.message);
      }
    })();
  } catch (err) {
    // Only send error if the success response hasn't been sent yet
    if (!res.headersSent) {
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  }
};

/**
 * GET MY APPOINTMENTS
 */
exports.getMyAppointments = async (req, res) => {
  try {
    const filter =
      req.user.role === "Doctor"
        ? { doctor: req.user.id }
        : { patient: req.user.id };

    const appointments = await Appointment.find(filter)
      .populate("doctor patient", "name specialization email")
      .sort({ date: 1, timeSlot: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * CANCEL APPOINTMENT
 * Includes ownership check to ensure only the right patient/doctor can delete.
 */
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    // Authorization: Ensure the requester is part of this appointment
    if (
      appointment.patient.toString() !== req.user.id &&
      appointment.doctor.toString() !== req.user.id
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized to cancel this appointment" });
    }

    await appointment.deleteOne();
    res.json({ message: "Appointment successfully cancelled." });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
