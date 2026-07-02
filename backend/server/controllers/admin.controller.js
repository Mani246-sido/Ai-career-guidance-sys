const User = require("../models/User");
const Profile = require("../models/Profile");
const Assessment = require("../models/Assessment");
const CareerPrediction = require("../models/CareerPrediction");
const Internship = require("../models/Internship");
const ResumeReport = require("../models/ResumeReport");
const InterviewReport = require("../models/InterviewReport");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().select("-password -refreshToken").skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      { users, total, page, totalPages: Math.ceil(total / limit) },
      "Users fetched successfully"
    )
  );
});

const getUserDetail = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const profile = await Profile.findOne({ user: userId });

  res.status(200).json(new ApiResponse(200, { user, profile }, "User detail fetched"));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!["student", "admin"].includes(role)) {
    throw new ApiError(400, "role must be either 'student' or 'admin'");
  }

  const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, user, "User role updated"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await Profile.findOneAndDelete({ user: userId });

  res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});

const getPlatformStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalAssessments,
    totalPredictions,
    activeInternships,
    completedInternships,
    totalResumeReports,
    totalInterviewReports,
  ] = await Promise.all([
    User.countDocuments(),
    Assessment.countDocuments(),
    CareerPrediction.countDocuments(),
    Internship.countDocuments({ status: "active" }),
    Internship.countDocuments({ status: "completed" }),
    ResumeReport.countDocuments(),
    InterviewReport.countDocuments(),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        totalAssessments,
        totalPredictions,
        activeInternships,
        completedInternships,
        totalResumeReports,
        totalInterviewReports,
      },
      "Platform stats fetched"
    )
  );
});

module.exports = { getAllUsers, getUserDetail, updateUserRole, deleteUser, getPlatformStats };
