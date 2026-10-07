import React, { useEffect, useState } from "react";
import "./ResolverDashboard.css";

function ResolverDashboard() {
  const token = sessionStorage.getItem("token");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusModal, setStatusModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Authentication token is missing. Please login again.");
        setComplaints([]);
        return;
      }

      const response = await fetch("/api/resolver", {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Resolver API response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch assigned complaints.");
      }

      if (Array.isArray(data.complaints)) {
        setComplaints(data.complaints);
      } else if (Array.isArray(data.data)) {
        setComplaints(data.data);
      } else if (Array.isArray(data)) {
        setComplaints(data);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      console.error("Fetch resolver complaints error:", err);

      setError(err.message || "Unable to fetch complaints.");

      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openStatusModal = (complaint) => {
    setSelectedComplaint(complaint);

    setStatus(complaint.status || "Pending");

    setComments(complaint.comments || "");

    setStatusModal(true);
  };

  const closeStatusModal = () => {
    if (updating) {
      return;
    }

    setStatusModal(false);

    setSelectedComplaint(null);

    setStatus("");

    setComments("");
  };

  //update complaint

  const updateComplaint = async (e) => {
    e.preventDefault();

    try {
      if (!token) {
        alert("Authentication token is missing. Please login again.");
        return;
      }

      if (!selectedComplaint) {
        alert("No complaint selected.");
        return;
      }

      const complaintId =
        selectedComplaint._id || selectedComplaint.complaintID;

      if (!complaintId) {
        alert("Complaint ID is missing.");
        return;
      }

      if (!status) {
        alert("Please select a complaint status.");
        return;
      }

      setUpdating(true);

      const response = await fetch("/api/complaints", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          complaintID: complaintId,
          status: status,
          comments: comments,
        }),
      });

      const data = await response.json();

      console.log("Update complaint response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Unable to update complaint.");
      }

      alert(data.message || "Complaint updated successfully.");

      closeStatusModal();

      await fetchComplaints();
    } catch (err) {
      console.error("Update complaint error:", err);

      alert(err.message || "Unable to update complaint.");
    } finally {
      setUpdating(false);
    }
  };

  //status class

  const getStatusClass = (complaintStatus) => {
    const normalizedStatus = String(complaintStatus || "").toLowerCase();

    switch (normalizedStatus) {
      case "resolved":
        return "resolver-status resolver-status-resolved";

      case "rejected":
        return "resolver-status resolver-status-rejected";

      case "in progress":
        return "resolver-status resolver-status-progress";

      case "pending":
      default:
        return "resolver-status resolver-status-pending";
    }
  };

  //logout

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("uid");
    sessionStorage.removeItem("name");

    window.location.href = "/login";
  };

  //stats

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) =>
      String(complaint.status || "Pending").toLowerCase() === "pending",
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) =>
      String(complaint.status || "").toLowerCase() === "in progress",
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => String(complaint.status || "").toLowerCase() === "resolved",
  ).length;

  return (
    <div className="resolver-dashboard">
      <main className="resolver-main">
        <div className="resolver-page-header">
          <div>
            <span className="resolver-eyebrow">RESOLVER DASHBOARD</span>

            <h2>Assigned Complaints</h2>

            <p>
              Review and manage complaints assigned to you by the administrator.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchComplaints}
            disabled={loading}
            className="resolver-refresh-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12a7.5 7.5 0 0112.75-5.303L19.5 9m0-6v6h-6M19.5 12a7.5 7.5 0 01-12.75 5.303L4.5 15m0 6v-6h6"
              />
            </svg>

            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="resolver-summary">
          <div className="resolver-summary-card">
            <div className="resolver-summary-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            <div>
              <span>TOTAL ASSIGNED</span>

              <strong>{totalComplaints}</strong>
            </div>
          </div>

          <div className="resolver-summary-card">
            <div className="resolver-summary-icon progress-summary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                />
              </svg>
            </div>

            <div>
              <span>IN PROGRESS</span>

              <strong>{inProgressComplaints}</strong>
            </div>
          </div>

          <div className="resolver-summary-card">
            <div className="resolver-summary-icon resolved-summary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75l2.25 2.25L15 11.25m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div>
              <span>RESOLVED</span>

              <strong>{resolvedComplaints}</strong>
            </div>
          </div>
        </div>

        {error && (
          <div className="resolver-error">
            <strong>Unable to load complaints</strong>

            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="resolver-state-card">
            <div className="resolver-loader"></div>

            <h3>Loading assigned complaints</h3>

            <p>Please wait while your complaints are loaded.</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="resolver-state-card">
            <div className="resolver-empty-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.7"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            <h3>No complaints assigned</h3>

            <p>
              Complaints assigned to you by the administrator will appear here.
            </p>
          </div>
        ) : (
          <div className="resolver-table-card">
            <div className="resolver-table-header">
              <div>
                <span>WORK QUEUE</span>

                <h3>Assigned Complaints</h3>
              </div>

              <span className="resolver-count">
                {totalComplaints}{" "}
                {totalComplaints === 1 ? "Complaint" : "Complaints"}
              </span>
            </div>

            <div className="resolver-table-wrapper">
              <table className="resolver-table">
                <thead>
                  <tr>
                    <th>#</th>

                    <th>Complaint</th>

                    <th>Student</th>

                    <th>UID</th>

                    <th>Status</th>

                    <th>Date</th>

                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {Array.isArray(complaints) &&
                    complaints.map((complaint, index) => (
                      <tr key={complaint._id || index}>
                        <td>
                          <span className="resolver-number">{index + 1}</span>
                        </td>

                        <td>
                          <div className="resolver-complaint">
                            <strong>
                              {complaint.subject ||
                                complaint.title ||
                                "Complaint"}
                            </strong>

                            <p>
                              {complaint.complaint ||
                                complaint.description ||
                                "No description available."}
                            </p>
                          </div>
                        </td>

                        <td>
                          <span className="resolver-student">
                            {complaint.name ||
                              complaint.studentName ||
                              complaint.username ||
                              "N/A"}
                          </span>
                        </td>

                        <td>
                          <span className="resolver-uid">
                            {complaint.uid || complaint.studentUid || "N/A"}
                          </span>
                        </td>

                        <td>
                          <span className={getStatusClass(complaint.status)}>
                            {complaint.status || "Pending"}
                          </span>
                        </td>

                        <td>
                          <span className="resolver-date">
                            {complaint.createdAt
                              ? new Date(
                                  complaint.createdAt,
                                ).toLocaleDateString()
                              : complaint.date || "N/A"}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            onClick={() => openStatusModal(complaint)}
                            className="resolver-update-button"
                          >
                            Update
                            <span>→</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {statusModal && selectedComplaint && (
        <div className="resolver-modal-overlay">
          <div className="resolver-modal">
            <div className="resolver-modal-header">
              <div>
                <span>COMPLAINT MANAGEMENT</span>

                <h3>Update Complaint</h3>

                <p>Update the status and add resolution details.</p>
              </div>

              <button
                type="button"
                onClick={closeStatusModal}
                disabled={updating}
                className="resolver-modal-close"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={updateComplaint} className="resolver-modal-form">
              <div className="resolver-form-group">
                <label>Complaint ID</label>

                <input
                  type="text"
                  value={
                    selectedComplaint._id || selectedComplaint.complaintID || ""
                  }
                  readOnly
                />
              </div>

              <div className="resolver-complaint-preview">
                <span>COMPLAINT</span>

                <p>
                  {selectedComplaint.complaint ||
                    selectedComplaint.description ||
                    "No complaint description available."}
                </p>
              </div>

              <div className="resolver-form-group">
                <label>Complaint Status</label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="">Select Status</option>

                  <option value="Pending">Pending</option>

                  <option value="In Progress">In Progress</option>

                  <option value="Resolved">Resolved</option>

                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="resolver-form-group">
                <label>Comments / Resolution Details</label>

                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows="5"
                  placeholder="Enter your comments or resolution details..."
                />
              </div>

              <div className="resolver-modal-actions">
                <button
                  type="button"
                  onClick={closeStatusModal}
                  disabled={updating}
                  className="resolver-cancel-button"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="resolver-save-button"
                >
                  {updating ? "Updating..." : "Update Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResolverDashboard;
