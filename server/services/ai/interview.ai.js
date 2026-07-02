const openai = require("./openai.client");

const generateQuestions = async (role) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'Generate 5 interview questions for the given role, mixing technical and behavioral. Return strict JSON array of strings. No extra text.',
        },
        {
          role: "user",
          content: `Role: ${role}`,
        },
      ],
    });

    const raw = completion.choices[0].message.content.trim();
    return JSON.parse(raw);
  } catch (error) {
    return [
      "Tell me about a challenging project you worked on.",
      "Explain a core concept relevant to this role.",
      "How do you approach debugging a complex issue?",
      "Describe a time you worked under pressure.",
      "Where do you see yourself improving professionally?",
    ];
  }
};

const generateFeedback = async (role, transcript) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'You are an interview coach. Return strict JSON: { "technicalScore": number 0-100, "communicationScore": number 0-100, "confidenceScore": number 0-100, "feedback": string, "improvementRoadmap": string[] }. No extra text.',
        },
        {
          role: "user",
          content: `Role: ${role}. Transcript: ${JSON.stringify(transcript)}`,
        },
      ],
    });

    const raw = completion.choices[0].message.content.trim();
    return JSON.parse(raw);
  } catch (error) {
    return {
      technicalScore: 60,
      communicationScore: 60,
      confidenceScore: 60,
      feedback: "Good attempt overall. Automated detailed feedback unavailable right now.",
      improvementRoadmap: ["Practice more mock interviews", "Review core concepts for the role"],
    };
  }
};

module.exports = { generateQuestions, generateFeedback };
