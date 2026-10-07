import React, { useEffect, useState } from "react";
import "./AdminTable.css";

function AdminTable({ setStats }) {
  const [complaints, setComplaints] = useState([]);
  const [resolvers, setResolvers] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [selectedResolver, setSelectedResolver] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const token = sessionStorage.getItem("token");

  //fetch complaints

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const params = new URLSearchParams();

      if (statusFilter !== "All") {
        params.append("status", statusFilter);
      }

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await fetch(
        `/api/admin/complaints?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch complaints.");
      }

      const complaintList = Array.isArray(data.complaints)
        ? data.complaints
        : Array.isArray(data)
          ? data
          : [];

      setComplaints(complaintList);

      if (data.stats && typeof data.stats === "object") {
        setStats({
          total: Number(data.stats.total) || 0,
          pending: Number(data.stats.pending) || 0,
          inProgress: Number(data.stats.inProgress) || 0,
          resolved: Number(data.stats.resolved) || 0,
          rejected: Number(data.stats.rejected) || 0,
          assigned: Number(data.stats.assigned) || 0,
        });
      } else {
        setStats({
          total: 0,
          pending: 0,
          inProgress: 0,
          resolved: 0,
          rejected: 0,
          assigned: 0,
        });
      }
    } catch (error) {
      console.error("Fetch complaints error:", error);

      setComplaints([]);

      alert(error.message || "Unable to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  //fetch resolver

  const fetchResolvers = async () => {
    try {
      if (!token) {
        setResolvers([]);
        return;
      }

      const response = await fetch("/api/admin/resolvers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch resolvers.");
      }

      let resolverList = [];

      if (Array.isArray(data)) {
        resolverList = data;
      } else if (data && Array.isArray(data.resolvers)) {
        resolverList = data.resolvers;
      } else if (data && Array.isArray(data.data)) {
        resolverList = data.data;
      }

      setResolvers(resolverList);
    } catch (error) {
      console.error("Fetch resolvers error:", error);

      setResolvers([]);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchResolvers();
  }, [statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComplaints();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  //update complaint

  const updateComplaint = async (complaintId, changes) => {
    try {
      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await fetch(`/api/admin/complaints/${complaintId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(changes),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update complaint.");
      }

      setSelectedComplaint(null);

      await fetchComplaints();

      alert("Complaint updated successfully.");
    } catch (error) {
      console.error("Update complaint error:", error);

      alert(error.message || "Unable to update complaint.");
    }
  };

  const openDetails = (complaint) => {
    setSelectedComplaint(complaint);

    setSelectedResolver(complaint.assignedResolver || "");

    setSelectedStatus(complaint.status || "Pending");
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
        return "admin-status admin-status-resolved";

      case "Rejected":
        return "admin-status admin-status-rejected";

      case "In Progress":
        return "admin-status admin-status-progress";

      default:
        return "admin-status admin-status-pending";
    }
  };

  return (
    <div className="admin-table-container">
      {/* PAGE HEADER */}

      <div className="admin-table-heading">
        <div>
          <span className="admin-table-eyebrow">GRIEVANCE MANAGEMENT</span>

          <h1>Complaint Details</h1>

          <p>Search, review and manage student complaints.</p>
        </div>
      </div>

      {/* SEARCH + FILTER */}

      <div className="admin-filter-card">
        <div className="admin-search-wrapper">
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
              d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.04 6.04a7.5 7.5 0 0 0 10.61 10.61Z"
            />
          </svg>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username, UID, complaint, branch or resolver..."
          />
        </div>

        <div className="admin-filter-wrapper">
          <label>Status</label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Complaints</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* TABLE */}

      <div className="admin-table-card">
        <div className="admin-table-topbar">
          <div>
            <h2>All Complaints</h2>

            <p>
              {loading
                ? "Loading complaints..."
                : `${complaints.length} complaint${
                    complaints.length !== 1 ? "s" : ""
                  } found`}
            </p>
          </div>
        </div>

        <div className="admin-table-scroll">
          {loading ? (
            <div className="admin-table-state">
              <div className="admin-spinner"></div>

              <p>Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="admin-table-state">
              <div className="admin-empty-icon">📋</div>

              <h3>No complaints found</h3>

              <p>Try changing your search or status filter.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Complaint ID</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Resolver</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint, index) => (
                  <tr key={complaint._id || index}>
                    <td>
                      <span className="admin-row-number">{index + 1}</span>
                    </td>

                    <td>
                      <div className="admin-student-info">
                        <strong>{complaint.username || "Unknown"}</strong>

                        <span>UID: {complaint.uid || "N/A"}</span>
                      </div>
                    </td>

                    <td>
                      <span className="admin-complaint-id">
                        {complaint._id}
                      </span>
                    </td>

                    <td>
                      <span className="admin-branch">
                        {complaint.branch || "N/A"}
                      </span>
                    </td>

                    <td>
                      <span className={getStatusClass(complaint.status)}>
                        {complaint.status || "Pending"}
                      </span>
                    </td>

                    <td>
                      {complaint.assignedResolver ? (
                        <span className="admin-resolver">
                          {complaint.assignedResolver}
                        </span>
                      ) : (
                        <span className="admin-not-assigned">Not assigned</span>
                      )}
                    </td>

                    <td>
                      <button
                        onClick={() => openDetails(complaint)}
                        className="admin-manage-button"
                      >
                        View / Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* DETAILS MODAL */}

      {selectedComplaint && (
        <div className="admin-modal-overlay">
          <div className="admin-details-modal">
            {/* MODAL HEADER */}

            <div className="admin-modal-header">
              <div>
                <span className="admin-modal-eyebrow">
                  COMPLAINT MANAGEMENT
                </span>

                <h2>Complaint Details</h2>

                <p>Review the complaint and update its assignment or status.</p>
              </div>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="admin-modal-close"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* COMPLAINT INFORMATION */}

            <div className="admin-details-section">
              <div className="admin-details-grid">
                <div className="admin-detail-item">
                  <span>Username</span>
                  <strong>{selectedComplaint.username || "N/A"}</strong>
                </div>

                <div className="admin-detail-item">
                  <span>UID</span>
                  <strong>{selectedComplaint.uid || "N/A"}</strong>
                </div>

                <div className="admin-detail-item">
                  <span>Branch</span>
                  <strong>{selectedComplaint.branch || "N/A"}</strong>
                </div>

                <div className="admin-detail-item">
                  <span>Incharge</span>
                  <strong>{selectedComplaint.incharge_name || "N/A"}</strong>
                </div>

                <div className="admin-detail-item">
                  <span>Date</span>
                  <strong>{selectedComplaint.date || "N/A"}</strong>
                </div>

                <div className="admin-detail-item">
                  <span>Time</span>
                  <strong>{selectedComplaint.time || "N/A"}</strong>
                </div>
              </div>
            </div>

            {/* COMPLAINT */}

            <div className="admin-detail-block">
              <span>Complaint</span>

              <div className="admin-detail-content">
                {selectedComplaint.complaint || "No complaint details."}
              </div>
            </div>

            {/* COMMENTS */}

            <div className="admin-detail-block">
              <span>Resolver Comments</span>

              <div className="admin-detail-content">
                {selectedComplaint.comments || "No comments yet."}
              </div>
            </div>

            {/* MANAGEMENT */}

            <div className="admin-management-section">
              {/* RESOLVER */}

              <div className="admin-form-group">
                <label>Assign Resolver</label>

                <select
                  value={selectedResolver}
                  onChange={(e) => setSelectedResolver(e.target.value)}
                >
                  <option value="">Unassigned</option>

                  {Array.isArray(resolvers) &&
                    resolvers.map((resolver) => (
                      <option
                        key={resolver._id || resolver.username}
                        value={resolver.username}
                      >
                        {resolver.name || resolver.username} (
                        {resolver.username})
                      </option>
                    ))}
                </select>

                {Array.isArray(resolvers) && resolvers.length === 0 && (
                  <p className="admin-form-warning">
                    No Resolver accounts are currently registered.
                  </p>
                )}
              </div>

              {/* STATUS */}

              <div className="admin-form-group">
                <label>Complaint Status</label>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>

                  <option value="In Progress">In Progress</option>

                  <option value="Resolved">Resolved</option>

                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* BUTTONS */}

            <div className="admin-modal-footer">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="admin-cancel-button"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  updateComplaint(selectedComplaint._id, {
                    assignedResolver: selectedResolver,
                    status: selectedStatus,
                  })
                }
                className="admin-save-button"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTable;
