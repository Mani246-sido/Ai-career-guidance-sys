const Roadmap = require("../models/Roadmap");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const openai = require("../services/ai/openai.client");

const generateRoadmap = asyncHandler(async (req, res) => {
  const { targetRole } = req.body;

  if (!targetRole) {
    throw new ApiError(400, "targetRole is required");
  }

  let milestones = [];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'Generate a learning roadmap with 5-8 milestones for the given target role. For each milestone, include 1-3 learning resources (course, video, article, documentation, or practice platform). Return strict JSON array: [{ "title": string, "description": string, "durationWeeks": number, "resources": [{ "title": string, "type": "course"|"video"|"article"|"documentation"|"practice", "url": string }] }]. Use real, well known platforms (freeCodeCamp, MDN, official docs, YouTube, Coursera) for urls where possible. No extra text.',
        },
        { role: "user", content: `Target role: ${targetRole}` },
      ],
    });

    milestones = JSON.parse(completion.choices[0].message.content.trim());
  } catch (error) {
    milestones = [
      {
        title: "Foundations",
        description: "Build core fundamentals for the role.",
        durationWeeks: 4,
        resources: [{ title: "freeCodeCamp", type: "course", url: "https://www.freecodecamp.org" }],
      },
      {
        title: "Hands-on Projects",
        description: "Apply skills through real projects.",
        durationWeeks: 6,
        resources: [{ title: "Build a project from scratch", type: "practice", url: "" }],
      },
      {
        title: "Specialization",
        description: "Go deeper into the chosen specialization.",
        durationWeeks: 4,
        resources: [],
      },
      {
        title: "Interview Prep",
        description: "Prepare for technical and behavioral interviews.",
        durationWeeks: 3,
        resources: [],
      },
    ];
  }

  const roadmap = await Roadmap.create({
    user: req.user._id,
    targetRole,
    milestones,
  });

  res.status(201).json(new ApiResponse(201, roadmap, "Roadmap generated successfully"));
});

const getRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({ user: req.user._id }).sort({ createdAt: -1 });

  if (!roadmap) {
    throw new ApiError(404, "No roadmap found");
  }

  res.status(200).json(new ApiResponse(200, roadmap, "Roadmap fetched"));
});

const updateMilestoneStatus = asyncHandler(async (req, res) => {
  const { roadmapId, milestoneIndex } = req.params;
  const { completed } = req.body;

  const roadmap = await Roadmap.findOne({ _id: roadmapId, user: req.user._id });

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  if (!roadmap.milestones[milestoneIndex]) {
    throw new ApiError(404, "Milestone not found at given index");
  }

  roadmap.milestones[milestoneIndex].completed = completed;
  await roadmap.save();

  res.status(200).json(new ApiResponse(200, roadmap, "Milestone status updated"));
});

module.exports = { generateRoadmap, getRoadmap, updateMilestoneStatus };
