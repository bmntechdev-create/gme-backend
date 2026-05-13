const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes and verify JWT token
 */
const protect = async (req, res, next) => {
    let token;

    // 1. Check for token in cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } 
    // 2. Check for token in headers (Fallback for Postman/Development)
    else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        console.warn(`[Auth] No token found for ${req.method} ${req.originalUrl}`);
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.error('[Auth] JWT_SECRET is not defined in environment variables');
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user object to request
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' && error.message === 'invalid signature') {
            console.warn(`[Auth] Invalid signature from ${req.ip}. The token was likely signed with a different secret or is from another environment.`);
        } else {
            console.error('Auth Middleware Error:', error.message);
        }
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { protect };
