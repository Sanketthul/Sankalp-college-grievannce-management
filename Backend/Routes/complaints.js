const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  requireStudent,
  requireResolver,
} = require("../Middleware/auth");

const Complaint = require("../Model/complaint");

router.post(
  "/complaints",
  authenticateToken,
  requireStudent,
  async (req, res) => {
    try {
      const complaint = await Complaint.create({
        username: req.user.username,
        uid: req.user.uid,
        incharge_name: req.body.p_incharge,
        branch: req.body.branch,
        complaint: req.body.complaint,
        date: req.body.date,
        time: req.body.time,
      });

      res.status(201).json(complaint);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Unable to create complaint.",
      });
    }
  },
);

router.put(
  "/complaints",
  authenticateToken,
  requireResolver,
  async (req, res) => {
    try {
      const { complaintID, comments, status } = req.body;

      const updatedComplaint = await Complaint.findOneAndUpdate(
        { _id: complaintID },
        {
          status: status,
          comments: comments,
        },
        { new: true },
      );

      if (!updatedComplaint) {
        return res.status(404).json({
          message: "Complaint not found.",
        });
      }

      res.json(updatedComplaint);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Unable to update complaint.",
      });
    }
  },
);

module.exports = router;
