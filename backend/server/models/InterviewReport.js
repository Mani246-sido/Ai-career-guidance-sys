const mongoose = require("mongoose");

const interviewReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mode: { type: String, enum: ["voice", "text"], default: "text" },
    role: { type: String, required: true },
    transcript: [
      {
        question: String,
        answer: String,
      },
    ],
    technicalScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 0 },
    feedback: { type: String, default: "" },
    improvementRoadmap: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewReport", interviewReportSchema);
