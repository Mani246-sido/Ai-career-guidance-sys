const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    college: { type: String, default: "" },
    degree: { type: String, default: "" },
    branch: { type: String, default: "" },
    graduationYear: { type: Number },
    skills: [{ type: String }],
    interests: [{ type: String }],
    bio: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    resumeText: { type: String, default: "" },
    targetRole: { type: String, default: "" },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
