const { validateUserToken } = require("../utils/auth");

function checkForAuthentication(cookieName) {
    return (req, res, next) => {
        const token = req.cookies[cookieName];

        if (!token) {
            req.user = null;
            return next();
        }

        try {
            const payload = validateUserToken(token);
            req.user = payload;
        } catch (err) {
            req.user = null;
        }

        next();
    };
}

module.exports = { checkForAuthentication };
