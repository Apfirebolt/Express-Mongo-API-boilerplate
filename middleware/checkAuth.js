const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Protect routes
exports.protect = (async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
        // Set token from cookie
    }

    if (!token) {
        return res.status(401).json({msg: "Token not found"})
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return res.status(401).json({msg: "Auth Failed"})
    }
});
