const {check, validationResult} = require('express-validator');
const User = require('../models/user');

exports.validateUser = [
  check('username')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('User name can not be empty!')
    .bail()
    .isLength({min: 3})
    .withMessage('Minimum 3 characters required!')
    .bail(),
  check('email')
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage('Invalid email address!')
    .bail()
    .custom(async (email) => {
        const existingUser = 
            await User.findOne({ email })
              
        if (existingUser) {
            throw new Error('Email already in use')
        }
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  },
];