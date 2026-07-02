const { body } = require("express-validator");

const predictValidator = [
  body("studyHours").optional().isNumeric().withMessage("studyHours must be a number"),
  body("projects").optional().isNumeric().withMessage("projects must be a number"),
  body("internships").optional().isNumeric().withMessage("internships must be a number"),
  body("dsaScore").optional().isNumeric().withMessage("dsaScore must be a number"),
  body("certifications").optional().isNumeric().withMessage("certifications must be a number"),
];

module.exports = { predictValidator };
