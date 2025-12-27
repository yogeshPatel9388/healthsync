// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const { protect } = require("../middleware/authMiddleware");
// const { getDoctors } = require("../controllers/userController");

// //private route to get all doctors
// // // @route   GET /api/users/doctors
// // // @desc    Get all doctors
// // router.get("/doctors", protect, async (req, res) => {
// //   try {
// //     const doctors = await User.find({ role: "Doctor" }).select("-password");
// //     res.json(doctors);
// //   } catch (error) {
// //     res.status(500).json({ message: "Server Error" });
// //   }
// // });

// //public route to get all doctors
// router.get("/doctors", getDoctors);

// module.exports = router;



const express = require("express");
const router = express.Router();
const { getDoctors } = require("../controllers/userController");

// Public route for landing page
router.get("/doctors", getDoctors);

module.exports = router;
