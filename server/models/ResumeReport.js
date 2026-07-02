const mongoose = require("mongoose");

const resumeReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: { type: String, required: true },
    atsScore: { type: Number, default: 0 },
    missingSkills: [{ type: String }],
    suggestions: [{ type: String }],
    rawAiResponse: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeReport", resumeReportSchema);
