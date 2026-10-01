const express = require("express");

const router = express.Router();

const {
  authenticateToken,
  requireStudent,
  requireResolver,
  requireAdmin,
} = require("../Middleware/auth");

const Complaint = require("../Model/complaint");

const User = require("../Model/register");

// =====================================================
// STUDENT - CREATE COMPLAINT
// =====================================================

router.post(
  "/complaints",

  authenticateToken,

  requireStudent,

  async (req, res) => {
    try {
      const complaint = await Complaint.create({
        // IMPORTANT:
        // These come from JWT, NOT from frontend.
        username: req.user.username,

        uid: req.user.uid,

        incharge_name: req.body.p_incharge,

        branch: req.body.branch,

        complaint: req.body.complaint,

        date: req.body.date,

        time: req.body.time,

        status: "Pending",
      });

      return res.status(201).json({
        success: true,

        message: "Complaint created successfully.",

        complaint,
      });
    } catch (err) {
      console.error("Create complaint error:", err);

      return res.status(500).json({
        success: false,

        message: "Unable to create complaint.",
      });
    }
  },
);

// =====================================================
// ADMIN - GET COMPLAINTS
// =====================================================

router.get(
  "/admin/complaints",

  authenticateToken,

  requireAdmin,

  async (req, res) => {
    try {
      const { status = "All", search = "" } = req.query;

      let query = {};

      if (status !== "All") {
        query.status = status;
      }

      if (search.trim()) {
        const searchRegex = {
          $regex: search.trim(),

          $options: "i",
        };

        query.$or = [
          {
            username: searchRegex,
          },

          {
            uid: searchRegex,
          },

          {
            complaint: searchRegex,
          },

          {
            branch: searchRegex,
          },

          {
            incharge_name: searchRegex,
          },

          {
            assignedResolver: searchRegex,
          },
        ];
      }

      const complaints = await Complaint.find(query).sort({
        createdAt: -1,
      });

      const total = await Complaint.countDocuments();

      const pending = await Complaint.countDocuments({
        status: "Pending",
      });

      const inProgress = await Complaint.countDocuments({
        status: "In Progress",
      });

      const resolved = await Complaint.countDocuments({
        status: "Resolved",
      });

      const rejected = await Complaint.countDocuments({
        status: "Rejected",
      });

      const assigned = await Complaint.countDocuments({
        assignedResolver: {
          $ne: null,
        },
      });

      return res.json({
        success: true,

        complaints,

        stats: {
          total,

          pending,

          inProgress,

          resolved,

          rejected,

          assigned,
        },
      });
    } catch (err) {
      console.error("Admin complaints error:", err);

      return res.status(500).json({
        success: false,

        message: "Unable to fetch complaints.",
      });
    }
  },
);

// =====================================================
// ADMIN - GET RESOLVERS
// =====================================================

router.get(
  "/admin/resolvers",

  authenticateToken,

  requireAdmin,

  async (req, res) => {
    try {
      const resolvers = await User.find(
        {
          role: "Resolver",
        },

        {
          name: 1,

          username: 1,

          uid: 1,

          email: 1,
        },
      ).sort({
        name: 1,
      });

      return res.json({
        success: true,

        resolvers,
      });
    } catch (err) {
      console.error("Get resolvers error:", err);

      return res.status(500).json({
        success: false,

        message: "Unable to fetch resolvers.",
      });
    }
  },
);

// =====================================================
// ADMIN - ASSIGN RESOLVER / CHANGE STATUS
// =====================================================

router.put(
  "/admin/complaints/:id",

  authenticateToken,

  requireAdmin,

  async (req, res) => {
    try {
      const { assignedResolver, status } = req.body;

      const updateData = {};

      // -------------------------------------------------
      // STATUS
      // -------------------------------------------------

      if (status !== undefined) {
        const allowedStatuses = [
          "Pending",

          "In Progress",

          "Resolved",

          "Rejected",
        ];

        if (!allowedStatuses.includes(status)) {
          return res.status(400).json({
            success: false,

            message: "Invalid complaint status.",
          });
        }

        updateData.status = status;
      }

      // -------------------------------------------------
      // RESOLVER
      // -------------------------------------------------

      if (assignedResolver !== undefined) {
        if (assignedResolver === "") {
          updateData.assignedResolver = null;

          updateData.assignedResolverUid = null;
        } else {
          const resolver = await User.findOne({
            username: assignedResolver,

            role: "Resolver",
          });

          if (!resolver) {
            return res.status(404).json({
              success: false,

              message: "Resolver not found.",
            });
          }

          updateData.assignedResolver = resolver.username;

          updateData.assignedResolverUid = resolver.uid;
        }
      }

      const updatedComplaint = await Complaint.findByIdAndUpdate(
        req.params.id,

        updateData,

        {
          new: true,

          runValidators: true,
        },
      );

      if (!updatedComplaint) {
        return res.status(404).json({
          success: false,

          message: "Complaint not found.",
        });
      }

      return res.json({
        success: true,

        message: "Complaint updated successfully.",

        complaint: updatedComplaint,
      });
    } catch (err) {
      console.error("Admin complaint update error:", err);

      return res.status(500).json({
        success: false,

        message: "Unable to update complaint.",
      });
    }
  },
);

// =====================================================
// RESOLVER - UPDATE COMPLAINT
// =====================================================

router.put(
  "/complaints",

  authenticateToken,

  requireResolver,

  async (req, res) => {
    try {
      const { complaintID, comments, status } = req.body;

      const complaint = await Complaint.findById(complaintID);

      if (!complaint) {
        return res.status(404).json({
          success: false,

          message: "Complaint not found.",
        });
      }

      // Resolver can only modify
      // complaints assigned to them.

      if (complaint.assignedResolver !== req.user.username) {
        return res.status(403).json({
          success: false,

          message: "You are not assigned to this complaint.",
        });
      }

      const allowedStatuses = [
        "Pending",

        "In Progress",

        "Resolved",

        "Rejected",
      ];

      if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,

          message: "Invalid complaint status.",
        });
      }

      if (status !== undefined) {
        complaint.status = status;
      }

      if (comments !== undefined) {
        complaint.comments = comments;
      }

      await complaint.save();

      return res.json({
        success: true,

        message: "Complaint updated successfully.",

        complaint,
      });
    } catch (err) {
      console.error("Resolver complaint update error:", err);

      return res.status(500).json({
        success: false,

        message: "Unable to update complaint.",
      });
    }
  },
);

module.exports = router;
