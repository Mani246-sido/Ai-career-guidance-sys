const InterviewReport = require("../models/InterviewReport");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { generateQuestions, generateFeedback } = require("../services/ai/interview.ai");

const startInterview = asyncHandler(async (req, res) => {
  const { role, mode } = req.body;

  if (!role) {
    throw new ApiError(400, "role is required");
  }

  const questions = await generateQuestions(role);

  res
    .status(200)
    .json(new ApiResponse(200, { role, mode: mode || "text", questions }, "Interview started"));
});

const submitFeedback = asyncHandler(async (req, res) => {
  const { role, mode, transcript } = req.body;

  if (!role || !transcript || !transcript.length) {
    throw new ApiError(400, "role and transcript are required");
  }

  const result = await generateFeedback(role, transcript);

  const report = await InterviewReport.create({
    user: req.user._id,
    mode: mode || "text",
    role,
    transcript,
    technicalScore: result.technicalScore,
    communicationScore: result.communicationScore,
    confidenceScore: result.confidenceScore,
    feedback: result.feedback,
    improvementRoadmap: result.improvementRoadmap,
  });

  res.status(201).json(new ApiResponse(201, report, "Interview feedback generated"));
});

module.exports = { startInterview, submitFeedback };
