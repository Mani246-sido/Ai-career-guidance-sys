const ResumeReport = require("../models/ResumeReport");
const Profile = require("../models/Profile");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { analyzeResume } = require("../services/ai/resume.ai");

const analyze = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });

  const resumeText = req.body.resumeText || profile?.resumeText;

  if (!resumeText) {
    throw new ApiError(
      400,
      "No resume text found. Upload a PDF resume first or provide resumeText directly"
    );
  }

  const targetRole = profile?.targetRole || "Software Engineer";

  const analysis = await analyzeResume(resumeText, targetRole);

  const report = await ResumeReport.create({
    user: req.user._id,
    resumeUrl: profile?.resumeUrl || "",
    atsScore: analysis.atsScore,
    missingSkills: analysis.missingSkills,
    suggestions: analysis.suggestions,
    rawAiResponse: JSON.stringify(analysis),
  });

  res.status(201).json(new ApiResponse(201, report, "Resume analyzed successfully"));
});

const getReports = asyncHandler(async (req, res) => {
  const reports = await ResumeReport.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, reports, "Resume reports fetched"));
});

module.exports = { analyze, getReports };
