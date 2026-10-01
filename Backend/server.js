require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

if (!process.env.DBURL) {
  throw new Error("DBURL is missing from environment variables.");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment variables.");
}

if (!process.env.ADMIN_SECRET_KEY) {
  throw new Error("ADMIN_SECRET_KEY is missing from environment variables.");
}

const PORT = process.env.PORT || 8000;

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

//middleware

app.use(
  cors({
    origin: CLIENT_URL,

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

//database

mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

//models

const user_model = require("./Model/register");

const Complaint_model = require("./Model/complaint");

const {
  authenticateToken,
  requireAdmin,
  requireResolver,
  requireStudent,
} = require("./Middleware/auth");

//complaint

const ComplaintRoutes = require("./Routes/complaints");

app.use("/", ComplaintRoutes);

//register

app.post("/register", async (req, res) => {
  try {
    const { username, password, role, name, email, uid, adminSecret } =
      req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Username, password and role are required.",
      });
    }

    if (role === "Admin") {
      if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin secret key.",
        });
      }
    }

    const existingUser = await user_model.findOne({
      username: username,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new user_model({
      username: username,

      password: hashedPassword,

      role: role,

      name: name || "",

      email: email || "",

      uid: uid || "",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful.",
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to register user.",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { uname, pass } = req.body;

    if (!uname || !pass) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const doc = await user_model.findOne({
      username: uname,
    });

    if (!doc) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(pass, doc.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

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

    res.status(200).json({
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

    res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
});

app.get(
  "/history",

  authenticateToken,

  requireStudent,

  async (req, res) => {
    try {
      const data = await Complaint_model.find({
        uid: req.user.uid,
      });

      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.error("History error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to fetch complaint history.",
      });
    }
  },
);

const errorHandler = require("./Middleware/errorHandler");

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
