const { body } = require("express-validator");

const startInternshipValidator = [
  body("role").trim().notEmpty().withMessage("role is required"),
];

const submitTaskValidator = [
  body("taskId").trim().notEmpty().withMessage("taskId is required"),
  body("submissionContent").trim().notEmpty().withMessage("submissionContent is required"),
];

module.exports = { startInternshipValidator, submitTaskValidator };
