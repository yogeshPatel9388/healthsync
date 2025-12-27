const User = require("../models/User");

// @desc    Get all doctors for public/private viewing
// @route   GET /api/users/doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" }).select("-password");

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found." });
    }

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
