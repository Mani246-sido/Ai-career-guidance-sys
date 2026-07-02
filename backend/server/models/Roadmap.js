const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetRole: { type: String, required: true },
    milestones: [
      {
        title: String,
        description: String,
        durationWeeks: Number,
        completed: { type: Boolean, default: false },
        resources: [
          {
            title: String,
            type: { type: String, enum: ["course", "video", "article", "documentation", "practice"] },
            url: String,
          },
        ],
      },
    ],
    generatedByAI: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);
