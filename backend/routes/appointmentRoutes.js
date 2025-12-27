const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");

// All appointment routes are protected (require login)
router.use(protect);

// @route   POST /api/appointments
// @desc    Book a new appointment
router.post("/", bookAppointment);

// @route   GET /api/appointments
// @desc    Get appointments for the logged-in user (Doctor or Patient)
router.get("/", getMyAppointments);

// @route   DELETE /api/appointments/:id
// @desc    Cancel an appointment
router.delete("/:id", cancelAppointment);

module.exports = router;
