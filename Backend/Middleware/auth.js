const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Make sure JWT secret exists
if (!JWT_SECRET) {
  console.error("ERROR: JWT_SECRET is missing from environment variables.");
}

//authenticate token

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required.",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format.",
      });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};

//admin

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};

//resolver

const requireResolver = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "Resolver") {
    return res.status(403).json({
      success: false,
      message: "Resolver access required.",
    });
  }

  next();
};

//student

const requireStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "Student") {
    return res.status(403).json({
      success: false,
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
