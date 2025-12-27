const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Doctor", "Patient"], // Ensure these match your frontend values exactly
      required: true,
    },
    specialization: {
      type: String,
      required: function () {
        return this.role === "Doctor";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
