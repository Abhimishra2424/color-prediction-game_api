const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        console.log('req.headers', req.headers)
        const token = req.headers.authorization?.split(" ")[1];
        console.log('token', token)
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('decoded', decoded)
        req.user = decoded; // Now req.user contains id, email, and role

        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};

// ✅ Middleware to restrict access to admin-only routes
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
