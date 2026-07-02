const mongoose = require("mongoose");

const skillGapAnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetRole: { type: String, required: true },
    currentSkills: [{ type: String }],
    requiredSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    matchPercentage: { type: Number, default: 0 },
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkillGapAnalysis", skillGapAnalysisSchema);
