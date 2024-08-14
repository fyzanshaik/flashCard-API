"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    if (!authHeader) {
        req.token = 'No token';
        return next();
    }
    const token = authHeader;
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        // console.log('decoded: ', decoded);
        const userObj = {
            userId: decoded.userId,
            iat: decoded.iat,
            exp: decoded.exp,
        };
        req.user = userObj;
        req.token = token;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Token is not valid' });
    }
};
exports.authMiddleware = authMiddleware;
