const Profile = require("../models/Profile");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const cloudinary = require("../config/cloudinary");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).populate(
    "user",
    "name email avatar"
  );

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  res.status(200).json(new ApiResponse(200, profile, "Profile fetched successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { college, degree, branch, graduationYear, skills, interests, bio, targetRole } = req.body;

  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    {
      college,
      degree,
      branch,
      graduationYear,
      skills,
      interests,
      bio,
      targetRole,
      onboardingComplete: true,
    },
    { new: true, runValidators: true }
  );

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  res.status(200).json(new ApiResponse(200, profile, "Profile updated successfully"));
});

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "raw",
    folder: "career-os/resumes",
  });

  let extractedText = "";

  if (req.file.mimetype === "application/pdf") {
    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      const parsed = await pdfParse(fileBuffer);
      extractedText = parsed.text.trim();
    } catch (error) {
      extractedText = "";
    }
  }

  fs.unlinkSync(req.file.path);

  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    { resumeUrl: result.secure_url, resumeText: extractedText },
    { new: true }
  );

  res.status(200).json(
    new ApiResponse(
      200,
      profile,
      extractedText
        ? "Resume uploaded and text extracted successfully"
        : "Resume uploaded. Text extraction unavailable for this file type, you can paste resume text manually for analysis"
    )
  );
});

module.exports = { getProfile, updateProfile, uploadResume };
