const jwt = require('jsonwebtoken')
const userModel = require('../models/user-model');
require('dotenv').config();

module.exports = async (req, res, next) => {
    if (!req.cookies.token) {

        req.flash({ "error": 'You need to login first' })
        return res.status(401).redirect('/');
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let userDB = await userModel.findOne({ _id: decoded.id });
        req.user = userDB;
        next();
    }
    catch (err) {
        req.flash(err.message);
    }
}