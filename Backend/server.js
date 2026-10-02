require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// =====================================================
// ENVIRONMENT VARIABLES
// =====================================================

if (!process.env.DBURL) {
  throw new Error("DBURL is missing from environment variables.");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment variables.");
}

if (!process.env.ADMIN_SECRET_KEY) {
  throw new Error("ADMIN_SECRET_KEY is missing from environment variables.");
}

if (!process.env.RESOLVER_SECRET_KEY) {
  throw new Error("RESOLVER_SECRET_KEY is missing from environment variables.");
}

const PORT = process.env.PORT || 8000;

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// =====================================================
// VALIDATION
// =====================================================

const {
  validate,
  registerValidation,
  loginValidation,
} = require("./Middleware/validation");

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: CLIENT_URL,

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// =====================================================
// DATABASE
// =====================================================

mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

// =====================================================
// MODELS
// =====================================================

const user_model = require("./Model/register");

const Complaint_model = require("./Model/complaint");

// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const {
  authenticateToken,
  requireAdmin,
  requireResolver,
  requireStudent,
} = require("./Middleware/auth");

// =====================================================
// COMPLAINT ROUTES
// =====================================================

const ComplaintRoutes = require("./Routes/complaints");

app.use("/", ComplaintRoutes);

// =====================================================
// REGISTRATION
// =====================================================

app.post(
  "/register",

  registerValidation,

  validate,

  async (req, res) => {
    try {
      const {
        username,
        password,
        role,
        name,
        email,
        uid,
        adminSecret,
        adminSecretKey,
        resolverSecret,
        resolverSecretKey,
        pass,
      } = req.body;

      const finalPassword = password || pass;

      // -------------------------------------------------
      // ADMIN SECRET
      // -------------------------------------------------

      if (role === "Admin") {
        const suppliedAdminSecret = adminSecretKey || adminSecret;

        if (suppliedAdminSecret !== process.env.ADMIN_SECRET_KEY) {
          return res.status(403).json({
            success: false,

            message: "Invalid Admin Secret Key.",
          });
        }
      }

      // -------------------------------------------------
      // RESOLVER SECRET
      // -------------------------------------------------

      if (role === "Resolver") {
        const suppliedResolverSecret = resolverSecretKey || resolverSecret;

        if (suppliedResolverSecret !== process.env.RESOLVER_SECRET_KEY) {
          return res.status(403).json({
            success: false,

            message: "Invalid Resolver Secret Key.",
          });
        }
      }

      // -------------------------------------------------
      // CHECK EXISTING USER
      // -------------------------------------------------

      const existingUser = await user_model.findOne({
        $or: [
          {
            username: username,
          },

          {
            email: email,
          },

          {
            uid: uid,
          },
        ],
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,

          message: "Username, email or UID already exists.",
        });
      }

      // -------------------------------------------------
      // HASH PASSWORD
      // -------------------------------------------------

      const hashedPassword = await bcrypt.hash(finalPassword, 10);

      // -------------------------------------------------
      // CREATE USER
      // -------------------------------------------------

      const newUser = new user_model({
        username: username.trim(),

        password: hashedPassword,

        role: role.trim(),

        name: name.trim(),

        email: email.trim().toLowerCase(),

        uid: uid.trim(),
      });

      await newUser.save();

      return res.status(200).json({
        success: true,

        message: "Registration successful.",
      });
    } catch (error) {
      console.error("Registration error:", error);

      return res.status(500).json({
        success: false,

        message: "Unable to register user.",
      });
    }
  },
);

// =====================================================
// LOGIN
// =====================================================

app.post(
  "/login",

  loginValidation,

  validate,

  async (req, res) => {
    try {
      const { uname, pass } = req.body;

      const username = uname.trim();

      const doc = await user_model.findOne({
        username: username,
      });

      if (!doc) {
        return res.status(401).json({
          success: false,

          message: "Invalid username or password.",
        });
      }

      // -------------------------------------------------
      // PASSWORD CHECK
      // -------------------------------------------------

      const passwordMatch = await bcrypt.compare(pass, doc.password);

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,

          message: "Invalid username or password.",
        });
      }

      // -------------------------------------------------
      // CREATE JWT
      // -------------------------------------------------

      const token = jwt.sign(
        {
          userId: doc._id.toString(),

          username: doc.username,

          uid: doc.uid,

          role: doc.role,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "2h",
        },
      );

      return res.status(200).json({
        success: true,

        message: "Login successful.",

        token,

        user: {
          username: doc.username,

          name: doc.name,

          uid: doc.uid,

          role: doc.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);

      return res.status(500).json({
        success: false,

        message: "Server error during login.",
      });
    }
  },
);

// =====================================================
// STUDENT HISTORY
// =====================================================

app.get(
  "/history",

  authenticateToken,

  requireStudent,

  async (req, res) => {
    try {
      const data = await Complaint_model.find({
        uid: req.user.uid,
      }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,

        data: data,
      });
    } catch (error) {
      console.error("History error:", error);

      return res.status(500).json({
        success: false,

        message: "Unable to fetch complaint history.",
      });
    }
  },
);

// =====================================================
// ERROR HANDLER
// =====================================================

const errorHandler = require("./Middleware/errorHandler");

app.use(errorHandler);

// =====================================================
// SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
