const { body, param } = require('express-validator');

const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/)
    .withMessage('Please provide a valid phone number'),
  body('linkedIn')
    .optional()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),
  body('github')
    .optional()
    .isURL()
    .withMessage('Please provide a valid GitHub URL'),
  body('portfolio')
    .optional()
    .isURL()
    .withMessage('Please provide a valid portfolio URL'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('skills.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each skill must be between 1 and 50 characters')
];

const addExperienceValidator = [
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required'),
  body('startDate')
    .isISO8601()
    .withMessage('Please provide a valid start date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid end date'),
  body('isCurrent')
    .optional()
    .isBoolean()
    .withMessage('isCurrent must be a boolean value')
];

const addEducationValidator = [
  body('institution')
    .trim()
    .notEmpty()
    .withMessage('Institution name is required'),
  body('degree')
    .trim()
    .notEmpty()
    .withMessage('Degree is required'),
  body('field')
    .trim()
    .notEmpty()
    .withMessage('Field of study is required'),
  body('startDate')
    .isISO8601()
    .withMessage('Please provide a valid start date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid end date')
];

const addCourseValidator = [
  body('courseName')
    .trim()
    .notEmpty()
    .withMessage('Course name is required'),
  body('institution')
    .trim()
    .notEmpty()
    .withMessage('Institution name is required'),
  body('completionDate')
    .isISO8601()
    .withMessage('Please provide a valid completion date')
];

const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must be different from current password')
];

module.exports = {
  updateProfileValidator,
  addExperienceValidator,
  addEducationValidator,
  addCourseValidator,
  changePasswordValidator
};