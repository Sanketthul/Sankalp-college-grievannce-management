import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ResolverDashboard() {
  // =====================================================
  // AUTHENTICATION
  // =====================================================

  const token = sessionStorage.getItem("token");

  const username = sessionStorage.getItem("username") || "";

  // =====================================================
  // STATE
  // =====================================================

  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [statusModal, setStatusModal] = useState(false);

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [status, setStatus] = useState("");

  const [comments, setComments] = useState("");

  const [updating, setUpdating] = useState(false);

  // =====================================================
  // FETCH ASSIGNED COMPLAINTS
  // =====================================================

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Authentication token is missing. Please login again.");

        setComplaints([]);

        return;
      }

      const response = await fetch("http://localhost:8000/resolver", {
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

      /*
        Expected backend response:

        {
          success: true,
          complaints: [...]
        }
      */

      if (Array.isArray(data.complaints)) {
        setComplaints(data.complaints);
      } else if (Array.isArray(data.data)) {
        // Fallback in case your backend returns data[]
        setComplaints(data.data);
      } else if (Array.isArray(data)) {
        // Fallback if backend directly returns an array
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

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchComplaints();
  }, []);

  // =====================================================
  // OPEN STATUS MODAL
  // =====================================================

  const openStatusModal = (complaint) => {
    setSelectedComplaint(complaint);

    setStatus(complaint.status || "Pending");

    setComments(complaint.comments || "");

    setStatusModal(true);
  };

  // =====================================================
  // CLOSE STATUS MODAL
  // =====================================================

  const closeStatusModal = () => {
    if (updating) {
      return;
    }

    setStatusModal(false);

    setSelectedComplaint(null);

    setStatus("");

    setComments("");
  };

  // =====================================================
  // UPDATE COMPLAINT
  // =====================================================

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

      const response = await fetch("http://localhost:8000/complaints", {
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

      // Refresh dashboard
      // immediately after update.
      await fetchComplaints();
    } catch (err) {
      console.error("Update complaint error:", err);

      alert(err.message || "Unable to update complaint.");
    } finally {
      setUpdating(false);
    }
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusClass = (complaintStatus) => {
    switch (String(complaintStatus || "").toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "in progress":
        return "bg-blue-100 text-blue-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    sessionStorage.removeItem("token");

    sessionStorage.removeItem("username");

    sessionStorage.removeItem("role");

    sessionStorage.removeItem("uid");

    sessionStorage.removeItem("name");

    window.location.href = "/login";
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100">
      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="bg-indigo-700 text-white px-6 py-4 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">SANKALP</h1>

            <p className="text-sm text-indigo-200">Resolver Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {username}</span>

            <button
              onClick={logout}
              className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* HEADER */}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Assigned Complaints
            </h2>

            <p className="text-gray-500 mt-1">
              Complaints assigned to you by the administrator.
            </p>
          </div>

          <button
            onClick={fetchComplaints}
            disabled={loading}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-500">Loading assigned complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          /* =================================================
             NO COMPLAINTS
          ================================================= */

          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              No complaints assigned
            </h3>

            <p className="text-gray-500 mt-2">
              Complaints assigned to you by the admin will appear here.
            </p>
          </div>
        ) : (
          /* =================================================
             COMPLAINT TABLE
          ================================================= */

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      #
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Complaint
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Student
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      UID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Date
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {Array.isArray(complaints) &&
                    complaints.map((complaint, index) => (
                      <tr
                        key={complaint._id || index}
                        className="hover:bg-gray-50"
                      >
                        {/* NUMBER */}

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {index + 1}
                        </td>

                        {/* COMPLAINT */}

                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="font-semibold text-gray-800">
                              {complaint.subject ||
                                complaint.title ||
                                "Complaint"}
                            </p>

                            <p className="text-sm text-gray-500 truncate">
                              {complaint.complaint ||
                                complaint.description ||
                                "No description"}
                            </p>
                          </div>
                        </td>

                        {/* STUDENT */}

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {complaint.name || complaint.studentName || "N/A"}
                        </td>

                        {/* UID */}

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {complaint.uid || complaint.studentUid || "N/A"}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                              complaint.status,
                            )}`}
                          >
                            {complaint.status || "Pending"}
                          </span>
                        </td>

                        {/* DATE */}

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {complaint.createdAt
                            ? new Date(complaint.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openStatusModal(complaint)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
                          >
                            Update
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

      {/* =================================================
          STATUS MODAL
      ================================================= */}

      {statusModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            {/* MODAL HEADER */}

            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                Update Complaint
              </h3>

              <button
                onClick={closeStatusModal}
                disabled={updating}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
            </div>

            {/* MODAL BODY */}

            <form onSubmit={updateComplaint} className="p-6">
              {/* COMPLAINT ID */}

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Complaint ID
                </label>

                <input
                  type="text"
                  value={
                    selectedComplaint._id || selectedComplaint.complaintID || ""
                  }
                  readOnly
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
                />
              </div>

              {/* STATUS */}

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Complaint Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 outline-none"
                  required
                >
                  <option value="">Select Status</option>

                  <option value="Pending">Pending</option>

                  <option value="In Progress">In Progress</option>

                  <option value="Resolved">Resolved</option>

                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* COMMENTS */}

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comments / Resolution Details
                </label>

                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows="5"
                  placeholder="Enter your comments or resolution details..."
                  className="w-full border rounded-lg px-3 py-2 outline-none resize-none"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeStatusModal}
                  disabled={updating}
                  className="px-5 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
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
