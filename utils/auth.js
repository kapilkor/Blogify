const JWT = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET

function generateToken(user) {
    const payload = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
    };
    const token = JWT.sign(
        payload,
        SECRET_KEY,
        { expiresIn: "1d" }
    );
    return token;
}


function validateUserToken(token) {
    const payload = JWT.verify(token, SECRET_KEY);
    return payload;
}
module.exports = { generateToken, validateUserToken };