import { body, validationResult } from 'express-validator';

export function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

export const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 1, max: 50 }).withMessage('Name must be at most 50 characters'),
  body('username').trim().notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8, max: 64 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Za-z]/).withMessage('Password must contain a letter')
    .matches(/\d/).withMessage('Password must contain a number'),
  handleValidation,
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

// All fields optional, but validated when present.
export const profileUpdateValidation = [
  body('name').optional({ values: 'falsy' }).trim().isLength({ min: 1, max: 50 }).withMessage('Name must be at most 50 characters'),
  body('username').optional({ values: 'falsy' }).trim()
    .isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('bio').optional({ values: 'falsy' }).trim().isLength({ max: 300 }).withMessage('Bio must be at most 300 characters'),
  body('avatar').optional({ values: 'falsy' }).trim()
    .custom((value) => value === '' || /^https?:\/\/.+/.test(value))
    .withMessage('Avatar must be a valid image URL'),
  handleValidation,
];

export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8, max: 64 }).withMessage('New password must be at least 8 characters')
    .matches(/[A-Za-z]/).withMessage('New password must contain a letter')
    .matches(/\d/).withMessage('New password must contain a number'),
  handleValidation,
];
