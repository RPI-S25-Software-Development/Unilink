//Middleware to authenticate JWT tokens and check authorization for protected routes
require('dotenv').config();
//authenticates JWT tokens
const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"
        if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use a strong secret key in production
        req.user = decoded; // Attach user data to request object

        next(); // Proceed to the protected route
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

//checks authorization for protected routes
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role_type !== role) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};