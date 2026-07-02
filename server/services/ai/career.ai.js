const openai = require("./openai.client");

const predictCareer = async (inputs, profile) => {
  const { studyHours, projects, internships, dsaScore, certifications } = inputs;

  const baseScore =
    studyHours * 1.5 +
    projects * 8 +
    internships * 12 +
    dsaScore * 0.6 +
    certifications * 4;

  const readinessScore = Math.min(100, Math.round(baseScore / 2.5));
  const placementProbability = Math.min(98, Math.round(readinessScore * 0.95));

  const salaryRangeMin = Math.round(3 + readinessScore * 0.08);
  const salaryRangeMax = Math.round(salaryRangeMin + readinessScore * 0.15);

  let aiInsights = [];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a career advisor AI. Given a student's metrics, return 3 short, specific, actionable insights as a JSON array of strings. No preamble, only JSON array.",
        },
        {
          role: "user",
          content: `Profile: ${JSON.stringify(profile)}. Metrics: ${JSON.stringify(
            inputs
          )}. ReadinessScore: ${readinessScore}.`,
        },
      ],
    });

    const raw = completion.choices[0].message.content.trim();
    aiInsights = JSON.parse(raw);
  } catch (error) {
    aiInsights = [
      "Increase weekly DSA practice to improve technical readiness.",
      "Complete at least one more real-world project to strengthen your portfolio.",
      "Consider an internship to gain practical industry exposure.",
    ];
  }

  return {
    results: {
      placementProbability,
      salaryRangeMin,
      salaryRangeMax,
      readinessScore,
    },
    aiInsights,
  };
};

module.exports = { predictCareer };
