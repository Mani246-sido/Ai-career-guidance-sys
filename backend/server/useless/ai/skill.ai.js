const openai = require("./openai.client");

const analyzeSkillGap = async (currentSkills, targetRole) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",//"gpt-4o-mini",
      messages: [
        {
  role: "system",
  content:
    `You are a career advisor.

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT wrap the response in \`\`\`json.

Return only the JSON object.`
},
        {
          role: "user",
          content: `Target role: ${targetRole}. Current skills: ${JSON.stringify(currentSkills)}`,
        },
      ],
    });

    //const raw = completion.choices[0].message.content.trim();
    //return JSON.parse(raw);
    let raw = completion.choices[0].message.content.trim();

raw = raw
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(raw);
  } catch (error) {
    console.error("Error analyzing skill gap:", error);
    return {

  requiredSkills: [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "Git",
    "REST APIs"
  ],
  missingSkills: [
    "Docker",
    "AWS",
    "CI/CD"
  ],
  matchPercentage: 72,
  recommendations: [
    "Learn Docker fundamentals",
    "Build one full-stack deployment project",
    "Practice AWS basics"
  ]
};
  }
};

module.exports = { analyzeSkillGap };
