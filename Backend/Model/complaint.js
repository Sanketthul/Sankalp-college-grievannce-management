const mongoose = require("mongoose");

const userComplaint = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    uid: {
      type: String,
      required: true,
    },

    incharge_name: {
      type: String,
    },

    branch: {
      type: String,
    },

    complaint: {
      type: String,
      required: true,
    },

    date: {
      type: String,
    },

    time: {
      type: String,
    },

    // Complaint workflow status
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },

    // Resolver assigned by Admin
    assignedResolver: {
      type: String,
      default: null,
    },

    assignedResolverUid: {
      type: String,
      default: null,
    },

    // Resolver's comments
    comments: {
      type: String,
      default: "",
    },

    studentSatisfaction: {
      type: String,
      default: "",
    },

    studentFeedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Complaint = mongoose.model("complaints", userComplaint);

module.exports = Complaint;
