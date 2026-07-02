const openai = require("./openai.client");

const generateTasks = async (role) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'Generate 5 progressive internship tasks for the given role. Return strict JSON array: [{ "title": string, "description": string, "order": number }]. No extra text.',
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
      { title: "Setup & Planning", description: "Set up your environment and plan the project structure.", order: 1 },
      { title: "Core Implementation", description: "Implement the core feature for this role.", order: 2 },
      { title: "Testing", description: "Write tests for your implementation.", order: 3 },
      { title: "Documentation", description: "Document your work clearly.", order: 4 },
      { title: "Final Review", description: "Polish and submit your final deliverable.", order: 5 },
    ];
  }
};

const reviewSubmission = async (taskDescription, submissionContent) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'You are a senior engineer reviewing an intern submission. Return strict JSON: { "qualityScore": number 0-100, "securityScore": number 0-100, "performanceScore": number 0-100, "documentationScore": number 0-100, "feedback": string }. No extra text.',
        },
        {
          role: "user",
          content: `Task: ${taskDescription}. Submission: ${submissionContent}`,
        },
      ],
    });

    const raw = completion.choices[0].message.content.trim();
    return JSON.parse(raw);
  } catch (error) {
    return {
      qualityScore: 65,
      securityScore: 65,
      performanceScore: 65,
      documentationScore: 65,
      feedback: "Submission received. Automated review unavailable, manual review pending.",
    };
  }
};

module.exports = { generateTasks, reviewSubmission };
