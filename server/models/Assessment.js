const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [
      {
        question: String,
        answer: String,
      },
    ],
    aiSummary: { type: String, default: "" },
    suggestedRoles: [{ type: String }],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", assessmentSchema);
