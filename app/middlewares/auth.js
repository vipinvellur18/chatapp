// jwt middleware

const jwt = require('jsonwebtoken');

const config = require('../config/auth.config');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.AUTHSECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    message: "User authentication failed."
                  });
            }
            // console.log(user);
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({
            message: "You are not authorized to perform this action."
          });
        res.sendStatus(401);
    }
};


module.exports = {
    authenticateJWT
};