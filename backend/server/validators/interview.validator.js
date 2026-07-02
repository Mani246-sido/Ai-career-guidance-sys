const { body } = require("express-validator");

const startInterviewValidator = [
  body("role").trim().notEmpty().withMessage("role is required"),
];

const submitFeedbackValidator = [
  body("role").trim().notEmpty().withMessage("role is required"),
  body("transcript").isArray({ min: 1 }).withMessage("transcript must be a non-empty array"),
];

module.exports = { startInterviewValidator, submitFeedbackValidator };
