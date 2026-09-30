const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET is not configured.");
}

// Verify that the user is logged in
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication token is required.",
      });
    }

    // Expected:
    // Authorization: Bearer <token>

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Invalid authorization format.",
      });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    // Make logged-in user available to following routes
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
};

// Admin-only middleware
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({
      message: "Admin access required.",
    });
  }

  next();
};

// Resolver-only middleware
const requireResolver = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "Resolver") {
    return res.status(403).json({
      message: "Resolver access required.",
    });
  }

  next();
};

// Student-only middleware
const requireStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "Student") {
    return res.status(403).json({
      message: "Student access required.",
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireResolver,
  requireStudent,
};
