const openai = require("./openai.client");

const analyzeSkillGap = async (currentSkills, targetRole) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'You are a career skills advisor. Given the target role and current skills, return strict JSON: { "requiredSkills": string[], "missingSkills": string[], "matchPercentage": number 0-100, "recommendations": string[] }. requiredSkills should be 6-10 key skills for the role. No extra text.',
        },
        {
          role: "user",
          content: `Target role: ${targetRole}. Current skills: ${JSON.stringify(currentSkills)}`,
        },
      ],
    });

    const raw = completion.choices[0].message.content.trim();
    return JSON.parse(raw);
  } catch (error) {
    return {
      requiredSkills: [],
      missingSkills: [],
      matchPercentage: 50,
      recommendations: [
        "Could not run full AI analysis right now, please retry in a moment.",
      ],
    };
  }
};

module.exports = { analyzeSkillGap };
