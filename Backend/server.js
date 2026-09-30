const express = require("express");
require("dotenv").config();

const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  authenticateToken,
  requireAdmin,
  requireResolver,
  requireStudent,
} = require("./Middleware/auth");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  }),
);

const mongourl = process.env.DBURL;

mongoose
  .connect(mongourl)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

const user_registration = require("./Routes/registration");
const user_model = require("./Model/register");
app.use("/", user_registration);

app.post("/update", (req, res) => {
  var data = req.body;

  User.findOneAndUpdate(
    { username: data.oldUsername },
    { username: data.newUsername, password: data.newpassword },
    { new: true },
  )
    .then((res) => {
      if (res == null) {
        res.send({ message: null });
      }
    })
    .catch((err) => console.log(err));
});

var uid;

//login
app.post("/login", async (req, res) => {
  try {
    const { uname, pass } = req.body;

    if (!uname || !pass) {
      return res.status(400).json({
        message: "Username and password are required.",
      });
    }

    const doc = await user_model.findOne({
      username: uname,
    });

    if (!doc) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(pass, doc.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    // CREATE JWT

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

    console.log("Login successful:", {
      username: doc.username,
      role: doc.role,
    });

    return res.status(200).json({
      message: "Login successful.",
      token: token,
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
      message: "Server error during login.",
    });
  }
});

var complaintsData;

const Complaint_model = require("./Model/complaint");
const Complaint = require("./Routes/complaints");
app.use("/", Complaint);

// Admin complaint delete ROUTE

app.get("/delete", (req, res) => {
  User.deleteMany({ "": "" }).then((data) => res.send(data));
});

app.post("/delete/:id", (req, res) => {
  const userid = req.params.id;

  Complaint_model.deleteOne({ _id: userid }).then((data) => {
    console.log(data);
  });
});

// admin route

app.get("/admin", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const data = await Complaint_model.find();

    res.json(data);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to fetch complaints.",
    });
  }
});

// resolver

var userId = new Array();

app.post("/resolver/:id", (req, res) => {
  const userid = req.params.id;
  Complaint_model.findOne({ _id: userid }).then((data) => {
    userId.push(data);
  });
});

//remove user

app.put("/removeUser", (req, res) => {
  var username = req.body.username;
  console.log(username);
  User.deleteOne({ username: username })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
});

//student feedback
app.put("/studentFeedback", (req, res) => {
  var complaintID = req.body.complaintID;
  var studentSatisfaction = req.body.studentSatisfaction;
  var studentFeedback = req.body.studentFeedback;

  var data;
  Complaint_model.findOneAndUpdate(
    { _id: complaintID },
    {
      studentSatisfaction: studentSatisfaction,
      studentFeedback: studentFeedback,
    },
    { new: true },
  )
    .then((result) => {
      data = result;
      userId.push(data);
    })
    .catch((err) => console.log(err));
});

app.get("/resolver", (req, res) => {
  res.send(userId);
});

//history

app.get("/history", authenticateToken, requireStudent, async (req, res) => {
  try {
    const data = await Complaint_model.find({
      uid: req.user.uid,
    });

    res.json(data);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to fetch complaint history.",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
});
