const mongoose = require("mongoose");

const careerPredictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assessment: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment" },
    inputs: {
      studyHours: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      internships: { type: Number, default: 0 },
      dsaScore: { type: Number, default: 0 },
      certifications: { type: Number, default: 0 },
    },
    results: {
      placementProbability: { type: Number, default: 0 },
      salaryRangeMin: { type: Number, default: 0 },
      salaryRangeMax: { type: Number, default: 0 },
      readinessScore: { type: Number, default: 0 },
    },
    aiInsights: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerPrediction", careerPredictionSchema);
