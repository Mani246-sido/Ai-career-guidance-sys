const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["locked", "pending", "submitted", "reviewed"], default: "pending" },
    submissionContent: { type: String, default: "" },
    submissionFileUrl: { type: String, default: "" },
    aiReview: {
      qualityScore: { type: Number, default: 0 },
      securityScore: { type: Number, default: 0 },
      performanceScore: { type: Number, default: 0 },
      documentationScore: { type: Number, default: 0 },
      feedback: { type: String, default: "" },
    },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
