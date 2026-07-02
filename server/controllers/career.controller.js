const CareerPrediction = require("../models/CareerPrediction");
const Profile = require("../models/Profile");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { predictCareer } = require("../services/ai/career.ai");
const { createNotification } = require("../services/notification.service");

const predict = asyncHandler(async (req, res) => {
  const { studyHours, projects, internships, dsaScore, certifications, assessmentId } = req.body;

  const inputs = {
    studyHours: Number(studyHours) || 0,
    projects: Number(projects) || 0,
    internships: Number(internships) || 0,
    dsaScore: Number(dsaScore) || 0,
    certifications: Number(certifications) || 0,
  };

  const profile = await Profile.findOne({ user: req.user._id });

  const { results, aiInsights } = await predictCareer(inputs, profile);

  const prediction = await CareerPrediction.create({
    user: req.user._id,
    assessment: assessmentId || undefined,
    inputs,
    results,
    aiInsights,
  });

  await createNotification(
    req.user._id,
    "Career Prediction Ready",
    `Your readiness score is ${results.readinessScore}% with ${results.placementProbability}% placement probability.`,
    "success"
  );

  res.status(201).json(new ApiResponse(201, prediction, "Career prediction generated"));
});

const getHistory = asyncHandler(async (req, res) => {
  const history = await CareerPrediction.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, history, "Career prediction history fetched"));
});

module.exports = { predict, getHistory };
