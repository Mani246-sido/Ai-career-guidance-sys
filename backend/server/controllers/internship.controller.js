const Internship = require("../models/Internship");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { generateTasks, reviewSubmission } = require("../services/ai/internship.ai");
const { createNotification } = require("../services/notification.service");

const startInternship = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role) {
    throw new ApiError(400, "Role is required to start an internship");
  }

  const internship = await Internship.create({ user: req.user._id, role });

  const generatedTasks = await generateTasks(role);

  const tasks = await Task.insertMany(
    generatedTasks.map((t) => ({
      internship: internship._id,
      title: t.title,
      description: t.description,
      order: t.order,
      status: t.order === 1 ? "pending" : "locked",
    }))
  );

  res.status(201).json(new ApiResponse(201, { internship, tasks }, "Internship started"));
});

const getTasks = asyncHandler(async (req, res) => {
  const { internshipId } = req.query;

  if (!internshipId) {
    throw new ApiError(400, "internshipId is required");
  }

  const tasks = await Task.find({ internship: internshipId }).sort({ order: 1 });
  res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched"));
});

const submitTask = asyncHandler(async (req, res) => {
  const { taskId, submissionContent } = req.body;

  if (!taskId || !submissionContent) {
    throw new ApiError(400, "taskId and submissionContent are required");
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const aiReview = await reviewSubmission(task.description, submissionContent);

  task.submissionContent = submissionContent;
  task.aiReview = aiReview;
  task.status = "reviewed";
  task.submittedAt = new Date();
  await task.save();

  const nextTask = await Task.findOne({
    internship: task.internship,
    order: task.order + 1,
  });

  if (nextTask) {
    nextTask.status = "pending";
    await nextTask.save();
  }

  const totalTasks = await Task.countDocuments({ internship: task.internship });
  const completedTasks = await Task.countDocuments({
    internship: task.internship,
    status: "reviewed",
  });

  const progress = Math.round((completedTasks / totalTasks) * 100);

  const internship = await Internship.findById(task.internship);
  internship.progress = progress;

  if (progress === 100) {
    internship.status = "completed";
    internship.completedAt = new Date();
  }

  await internship.save();

  if (progress === 100) {
    await createNotification(
      req.user._id,
      "Internship Completed",
      `You have completed your ${internship.role} virtual internship. Certificate generation in progress.`,
      "success"
    );
  }

  res.status(200).json(new ApiResponse(200, { task, internship }, "Task submitted and reviewed"));
});

module.exports = { startInternship, getTasks, submitTask };
