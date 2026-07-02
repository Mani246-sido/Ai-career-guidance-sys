const openai = require("./openai.client");

const analyzeResume = async (resumeText, targetRole) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'You are an ATS resume analyzer. Return strict JSON: { "atsScore": number 0-100, "missingSkills": string[], "suggestions": string[] }. No extra text.',
        },
        {
          role: "user",
          content: `Target role: ${targetRole}. Resume content: ${resumeText}`,
        },
      ],
    });

    const raw = completion.choices[0].message.content.trim();
    return JSON.parse(raw);
  } catch (error) {
    return {
      atsScore: 60,
      missingSkills: ["Could not analyze fully, please retry."],
      suggestions: ["Ensure resume content is plain text and well structured."],
    };
  }
};

module.exports = { analyzeResume };
