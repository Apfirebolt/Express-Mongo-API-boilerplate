const User = require('../models/user');

exports.getUsers = (async (req, res, next) => {
    const users = await User.find();

    return res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

exports.getUser = (async (req, res, next) => {
    const fetchedUser = await User.findById(req.params.id)

    res.status(200).json({
        success: true,
        data: { user: fetchedUser },
    });
});

