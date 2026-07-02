const Profile = require("../models/Profile");
const CareerPrediction = require("../models/CareerPrediction");
const ResumeReport = require("../models/ResumeReport");
const Internship = require("../models/Internship");
const InterviewReport = require("../models/InterviewReport");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [profile, latestPrediction, latestResume, internships, latestInterview, notifications] =
    await Promise.all([
      Profile.findOne({ user: userId }),
      CareerPrediction.findOne({ user: userId }).sort({ createdAt: -1 }),
      ResumeReport.findOne({ user: userId }).sort({ createdAt: -1 }),
      Internship.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
      InterviewReport.findOne({ user: userId }).sort({ createdAt: -1 }),
      Notification.find({ user: userId, isRead: false }).sort({ createdAt: -1 }).limit(10),
    ]);

  const dashboardData = {
    profile,
    careerReadiness: latestPrediction?.results?.readinessScore || 0,
    placementProbability: latestPrediction?.results?.placementProbability || 0,
    salaryRange: {
      min: latestPrediction?.results?.salaryRangeMin || 0,
      max: latestPrediction?.results?.salaryRangeMax || 0,
    },
    resumeScore: latestResume?.atsScore || 0,
    activeInternships: internships,
    latestInterviewScore: latestInterview
      ? {
          technical: latestInterview.technicalScore,
          communication: latestInterview.communicationScore,
          confidence: latestInterview.confidenceScore,
        }
      : null,
    aiInsights: latestPrediction?.aiInsights || [],
    notifications,
  };

  res.status(200).json(new ApiResponse(200, dashboardData, "Dashboard data fetched"));
});

module.exports = { getDashboard };
