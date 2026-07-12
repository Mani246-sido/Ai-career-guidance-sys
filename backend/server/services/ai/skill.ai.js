const openai = require("./openai.client");

const analyzeSkillGap = async (currentSkills, targetRole) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are a career advisor. Return ONLY valid JSON, no markdown, no code fences: { \"requiredSkills\": string[], \"missingSkills\": string[], \"matchPercentage\": number 0-100, \"recommendations\": string[] }.",
        },
        {
          role: "user",
          content: `Target role: ${targetRole}. Current skills: ${JSON.stringify(currentSkills)}`,
        },
      ],
    });

    const raw = completion.choices[0].message.content;
    return openai.parseAIJSON(raw);
  } catch (error) {
    console.error("Error analyzing skill gap:", error.message);
    return {
      requiredSkills: ["JavaScript", "React", "Node.js", "MongoDB", "Git", "REST APIs"],
      missingSkills: ["Docker", "AWS", "CI/CD"],
      matchPercentage: 72,
      recommendations: [
        "Learn Docker fundamentals",
        "Build one full-stack deployment project",
        "Practice AWS basics",
      ],
    };
  }
};

module.exports = { analyzeSkillGap };
