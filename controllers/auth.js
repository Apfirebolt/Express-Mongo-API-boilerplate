const User = require('../models/user');
const { check, validationResult } = require('express-validator/check');

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = (async (req, res, next) => {
    const { username, firstName, lastName, email, password, role } = req.body;

    // Create user
    const user = await User.create({
        username,
        firstName,
        lastName,
        email,
        password,
        role,
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = (async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if password matches
        const isMatch = await user.matchPassword(password);
    
        sendTokenResponse(user, 200, res); 
    } catch (err) {
        console.log('Error is ', err);
    }
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
exports.logout = (async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {},
    });
});

// @desc      Get Profile Details of logged in user
// @route     GET /api/v1/auth/profile
// @access    Admin
exports.getProfile = (async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email }).select('-password');

    res.status(200).json({
        success: true,
        data: {
            user
        },
    });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};
