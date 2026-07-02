const Assessment = require("../models/Assessment");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const openai = require("../services/ai/openai.client");

const submitAssessment = asyncHandler(async (req, res) => {
  const { answers } = req.body;

  if (!answers || !answers.length) {
    throw new ApiError(400, "Assessment answers are required");
  }

  let aiSummary = "";
  let suggestedRoles = [];
  let strengths = [];
  let weaknesses = [];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'Analyze the assessment answers. Return strict JSON: { "aiSummary": string, "suggestedRoles": string[], "strengths": string[], "weaknesses": string[] }. No extra text.',
        },
        { role: "user", content: JSON.stringify(answers) },
      ],
    });

    const parsed = JSON.parse(completion.choices[0].message.content.trim());
    aiSummary = parsed.aiSummary;
    suggestedRoles = parsed.suggestedRoles;
    strengths = parsed.strengths;
    weaknesses = parsed.weaknesses;
  } catch (error) {
    aiSummary = "Assessment recorded. Detailed AI analysis unavailable right now.";
    suggestedRoles = ["Software Engineer", "Data Analyst"];
    strengths = ["Consistent effort"];
    weaknesses = ["Needs more data to evaluate"];
  }

  const assessment = await Assessment.create({
    user: req.user._id,
    answers,
    aiSummary,
    suggestedRoles,
    strengths,
    weaknesses,
  });

  res.status(201).json(new ApiResponse(201, assessment, "Assessment submitted successfully"));
});

const getAssessmentHistory = asyncHandler(async (req, res) => {
  const assessments = await Assessment.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, assessments, "Assessment history fetched"));
});

module.exports = { submitAssessment, getAssessmentHistory };
