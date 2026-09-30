const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const user_registration = require("../Model/register");

router.post("/register", async (req, res) => {
  try {
    const { role, name, username, email, pass, uid, adminSecretKey } = req.body;

    // BASIC VALIDATION

    if (!role || !name || !username || !email || !pass || !uid) {
      return res.status(400).json({
        msg: "All required fields must be filled.",
      });
    }

    // VALIDATE ROLE

    if (role !== "Student" && role !== "Admin") {
      return res.status(400).json({
        msg: "Invalid role.",
      });
    }

    // ADMIN SECRET KEY

    if (role === "Admin") {
      const adminKey = process.env.ADMIN_SECRET_KEY;

      if (!adminKey) {
        console.error("ADMIN_SECRET_KEY is not configured.");

        return res.status(500).json({
          msg: "Admin registration is not configured.",
        });
      }

      if (adminSecretKey !== adminKey) {
        return res.status(401).json({
          msg: "Invalid Admin Secret Key.",
        });
      }
    }

    // CHECK EXISTING USER

    const existingUser = await user_registration.findOne({
      $or: [{ email: email }, { username: username }, { uid: uid }],
    });

    if (existingUser) {
      return res.status(409).json({
        msg: "Username, email or UID already exists.",
      });
    }

    // HASH PASSWORD

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(pass, saltRounds);

    // CREATE USER

    await user_registration.create({
      role: role,
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
      uid: uid,
    });

    return res.status(200).json({
      msg: "User created successfully.",
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      msg: "Server error while registering user.",
    });
  }
});

module.exports = router;
