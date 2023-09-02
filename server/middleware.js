const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const secret = require('./secret');

const jwtMiddleware = expressJwt.expressjwt({
    secret: secret,
    algorithms: ['HS256'],
    getToken: function fromHeaderOrCookie(req) {
      if (req.cookies && req.cookies.accessToken) {
        return req.cookies.accessToken;
      }
      return null; // return null if no token found
    }
  });

const verifyTokenAndAddUserInfo = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    try {
        const userInfo = jwt.verify(token, secret);
        req.userInfo = userInfo; // Add userInfo to the request object
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            console.error('Token verification failed:', error);
            return res.status(403).json({ message: "Token is not valid!", error: error.message });
        }
        console.error('Error during token verification:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
  };

  module.exports = {
    jwtMiddleware,
    verifyTokenAndAddUserInfo,
  };