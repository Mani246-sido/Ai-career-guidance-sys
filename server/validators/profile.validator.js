const { body } = require("express-validator");

const updateProfileValidator = [
  body("graduationYear")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("graduationYear must be a valid year"),
  body("skills").optional().isArray().withMessage("skills must be an array"),
  body("interests").optional().isArray().withMessage("interests must be an array"),
];

module.exports = { updateProfileValidator };
