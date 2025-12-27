const Appointment = require("../models/Appointment");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

/**
 * BOOK APPOINTMENT
 * Optimized for Render: Response is sent immediately, 
 * and emails are processed in a separate background execution context.
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

    /** * SUCCESS RESPONSE: Sent immediately to the frontend.
     * This closes the modal and stops the "Confirming..." spinner.
     */
    res.status(201).json(newAppointment);

    /**
     * 3. BACKGROUND EMAIL PROCESS
     * We capture necessary data in variables before starting the async block
     * to ensure the data remains available even after the main request finishes.
     */
    const patientEmail = req.user.email;
    const patientName = req.user.name;

    (async () => {
      try {
        const doctor = await User.findById(doctorId);
        if (!doctor || !doctor.email) {
            throw new Error("Doctor email not found for notification.");
        }

        const formattedDate = new Date(date).toLocaleDateString();

        // --- EMAIL TO PATIENT ---
        const patientSubject = "Appointment Confirmed - HealthSync";
        const patientText = `Hello ${patientName}, Your appointment with ${doctor.name} has been successfully scheduled. Details: Date: ${formattedDate}, Time: ${timeSlot}.`;

        await sendEmail(patientEmail, patientSubject, patientText);

        // --- EMAIL TO DOCTOR ---
        const doctorSubject = "New Appointment Scheduled - HealthSync";
        const doctorText = `Hello ${doctor.name}, A new appointment has been scheduled with you. Patient Name: ${patientName}, Date: ${formattedDate}, Time: ${timeSlot}.`;

        await sendEmail(doctor.email, doctorSubject, doctorText);

        console.log(`✅ Dual Emails successfully triggered in background for: ${newAppointment._id}`);
      } catch (emailErr) {
        // Logs specifically to Render console for debugging
        console.error("❌ Background Email System Error:", emailErr.message);
      }
    })();

  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  }
};

/**
 * GET MY APPOINTMENTS
 * Populates doctor and patient names for the UI.
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
 */
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: "Not found" });

    if (
      appointment.patient.toString() !== req.user.id &&
      appointment.doctor.toString() !== req.user.id
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await appointment.deleteOne();
    res.json({ message: "Appointment successfully cancelled." });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};