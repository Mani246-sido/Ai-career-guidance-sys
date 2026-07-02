const SkillGapAnalysis = require("../models/SkillGapAnalysis");
const Profile = require("../models/Profile");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { analyzeSkillGap } = require("../services/ai/skill.ai");
const { createNotification } = require("../services/notification.service");

const analyzeGap = asyncHandler(async (req, res) => {
  const { targetRole } = req.body;

  const profile = await Profile.findOne({ user: req.user._id });
  const role = targetRole || profile?.targetRole;

  if (!role) {
    throw new ApiError(400, "targetRole is required (or set it in your profile first)");
  }

  const currentSkills = profile?.skills || [];

  const result = await analyzeSkillGap(currentSkills, role);

  const analysis = await SkillGapAnalysis.create({
    user: req.user._id,
    targetRole: role,
    currentSkills,
    requiredSkills: result.requiredSkills,
    missingSkills: result.missingSkills,
    matchPercentage: result.matchPercentage,
    recommendations: result.recommendations,
  });

  await createNotification(
    req.user._id,
    "Skill Gap Analysis Ready",
    `You match ${result.matchPercentage}% of skills required for ${role}.`,
    "info"
  );

  res.status(201).json(new ApiResponse(201, analysis, "Skill gap analysis completed"));
});

const getGapHistory = asyncHandler(async (req, res) => {
  const history = await SkillGapAnalysis.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, history, "Skill gap analysis history fetched"));
});

module.exports = { analyzeGap, getGapHistory };
