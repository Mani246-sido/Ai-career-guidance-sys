const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    company: { type: String, default: "VirtualCo" },
    status: { type: String, enum: ["active", "completed", "abandoned"], default: "active" },
    progress: { type: Number, default: 0 },
    certificateUrl: { type: String, default: "" },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Internship", internshipSchema);
