const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware");
const validate = require("../middleware/validate.middleware");
const { authLimiter } = require("../middleware/rateLimiter.middleware");

const { register, login, logout, refreshAccessToken } = require("../controllers/auth.controller");
const { getProfile, updateProfile, uploadResume } = require("../controllers/profile.controller");
const { submitAssessment, getAssessmentHistory } = require("../controllers/assessment.controller");
const { predict, getHistory } = require("../controllers/career.controller");
const { startInternship, getTasks, submitTask } = require("../controllers/internship.controller");
const { analyze, getReports } = require("../controllers/resume.controller");
const { startInterview, submitFeedback } = require("../controllers/interview.controller");
const { generateRoadmap, getRoadmap, updateMilestoneStatus } = require("../controllers/roadmap.controller");
const { getDashboard } = require("../controllers/dashboard.controller");
const { getNotifications, markAsRead, markAllAsRead } = require("../controllers/notification.controller");
const { analyzeGap, getGapHistory } = require("../controllers/skill.controller");
const {
  getAllUsers,
  getUserDetail,
  updateUserRole,
  deleteUser,
  getPlatformStats,
} = require("../controllers/admin.controller");

const { registerValidator, loginValidator } = require("../validators/auth.validator");
const { updateProfileValidator } = require("../validators/profile.validator");
const { predictValidator } = require("../validators/career.validator");
const { startInternshipValidator, submitTaskValidator } = require("../validators/internship.validator");
const { startInterviewValidator, submitFeedbackValidator } = require("../validators/interview.validator");

router.post("/auth/register", authLimiter, registerValidator, validate, register);
router.post("/auth/login", authLimiter, loginValidator, validate, login);
router.post("/auth/logout", protect, logout);
router.post("/auth/refresh", refreshAccessToken);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfileValidator, validate, updateProfile);
router.post("/profile/resume", protect, upload.single("resume"), uploadResume);

router.post("/assessment", protect, submitAssessment);
router.get("/assessment/history", protect, getAssessmentHistory);

router.post("/career/predict", protect, predictValidator, validate, predict);
router.get("/career/history", protect, getHistory);

router.post("/internship/start", protect, startInternshipValidator, validate, startInternship);
router.get("/internship/tasks", protect, getTasks);
router.post("/internship/submit", protect, submitTaskValidator, validate, submitTask);

router.post("/resume/analyze", protect, analyze);
router.get("/resume/reports", protect, getReports);

router.post("/interview/start", protect, startInterviewValidator, validate, startInterview);
router.post("/interview/feedback", protect, submitFeedbackValidator, validate, submitFeedback);

router.post("/roadmap/generate", protect, generateRoadmap);
router.get("/roadmap", protect, getRoadmap);
router.patch("/roadmap/:roadmapId/milestone/:milestoneIndex", protect, updateMilestoneStatus);

router.get("/dashboard", protect, getDashboard);

router.get("/notifications", protect, getNotifications);
router.patch("/notifications/:notificationId/read", protect, markAsRead);
router.patch("/notifications/read-all", protect, markAllAsRead);

router.post("/skills/gap-analysis", protect, analyzeGap);
router.get("/skills/gap-analysis/history", protect, getGapHistory);

router.get("/admin/users", protect, isAdmin, getAllUsers);
router.get("/admin/users/:userId", protect, isAdmin, getUserDetail);
router.patch("/admin/users/:userId/role", protect, isAdmin, updateUserRole);
router.delete("/admin/users/:userId", protect, isAdmin, deleteUser);
router.get("/admin/stats", protect, isAdmin, getPlatformStats);

module.exports = router;
