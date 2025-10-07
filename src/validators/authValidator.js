const { body, param } = require('express-validator');

const loginValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

const registerAlumniValidator = [
  param('token')
    .notEmpty()
    .withMessage('Invitation token is required'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('batch')
    .notEmpty()
    .withMessage('Batch is required')
    .matches(/^\d{4}(-\d{4})?$/)
    .withMessage('Batch must be in format YYYY or YYYY-YYYY'),
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required'),
  body('occupation')
    .trim()
    .notEmpty()
    .withMessage('Current occupation is required')
];

module.exports = {
  loginValidator,
  registerAlumniValidator
};