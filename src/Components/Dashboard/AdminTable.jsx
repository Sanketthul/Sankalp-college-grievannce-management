import React, { useEffect, useState } from "react";

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

      const params = new URLSearchParams();

      if (statusFilter !== "All") {
        params.append("status", statusFilter);
      }

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await fetch(
        `http://localhost:8000/admin/complaints?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unable to fetch complaints.");
      }

      const data = await response.json();

      setComplaints(data.complaints || []);

      setStats(
        data.stats || {
          total: 0,
          pending: 0,
          inProgress: 0,
          resolved: 0,
          rejected: 0,
          assigned: 0,
        },
      );
    } catch (error) {
      console.error(error);
      alert("Unable to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  //fetch resolver

  const fetchResolvers = async () => {
    try {
      const response = await fetch("http://localhost:8000/admin/resolvers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to fetch resolvers.");
      }

      const data = await response.json();

      setResolvers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchResolvers();
  }, [statusFilter]);

  //search

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComplaints();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  //update complaint

  const updateComplaint = async (complaintId, changes) => {
    try {
      const response = await fetch(
        `http://localhost:8000/admin/complaints/${complaintId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(changes),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update complaint.");
      }

      setSelectedComplaint(null);

      await fetchComplaints();

      alert("Complaint updated successfully.");
    } catch (error) {
      console.error(error);

      alert(error.message);
    }
  };

  //open details

  const openDetails = (complaint) => {
    setSelectedComplaint(complaint);

    setSelectedResolver(complaint.assignedResolver || "");

    setSelectedStatus(complaint.status || "Pending");
  };

  return (
    <div className="w-full">
      <div className="bg-white shadow-sm border rounded-lg mx-2 mt-4 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username, UID, complaint, branch or resolver..."
            className="flex-1 border rounded-lg px-4 py-2 outline-none focus:border-purple-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none"
          >
            <option value="All">All Complaints</option>

            <option value="Pending">Pending</option>

            <option value="In Progress">In Progress</option>

            <option value="Resolved">Resolved</option>

            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-200 w-auto mt-4 mx-2 rounded-sm">
        <h4 className="text-sm py-2 px-4">Complaint Details</h4>
      </div>

      <div className="h-[75vh] overflow-auto rounded-lg border border-gray-300 shadow-sm m-2">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No complaints found.</p>
          </div>
        ) : (
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-4 font-medium text-gray-900">#</th>

                <th className="px-4 py-4 font-medium text-gray-900">Student</th>

                <th className="px-4 py-4 font-medium text-gray-900">
                  Complaint ID
                </th>

                <th className="px-4 py-4 font-medium text-gray-900">Branch</th>

                <th className="px-4 py-4 font-medium text-gray-900">Status</th>

                <th className="px-4 py-4 font-medium text-gray-900">
                  Resolver
                </th>

                <th className="px-4 py-4 font-medium text-gray-900">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {complaints.map((complaint, index) => (
                <tr key={complaint._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">{index + 1}</td>

                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-800">
                      {complaint.username}
                    </div>

                    <div className="text-xs text-gray-400">
                      UID: {complaint.uid}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-xs text-green-600">
                      {complaint._id}
                    </span>
                  </td>

                  <td className="px-4 py-4">{complaint.branch}</td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        complaint.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : complaint.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : complaint.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {complaint.status || "Pending"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    {complaint.assignedResolver || "Not assigned"}
                  </td>

                  <td className="px-4 py-4">
                    <button
                      onClick={() => openDetails(complaint)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs"
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

      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                  Complaint Details
                </h2>

                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-500 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Username</p>

                  <p className="font-semibold">{selectedComplaint.username}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">UID</p>

                  <p className="font-semibold">{selectedComplaint.uid}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Branch</p>

                  <p className="font-semibold">{selectedComplaint.branch}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Incharge</p>

                  <p className="font-semibold">
                    {selectedComplaint.incharge_name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Date</p>

                  <p className="font-semibold">
                    {selectedComplaint.date || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Time</p>

                  <p className="font-semibold">
                    {selectedComplaint.time || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs text-gray-500 mb-1">Complaint</p>

                <div className="bg-gray-50 border rounded-lg p-4">
                  {selectedComplaint.complaint}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs text-gray-500 mb-1">Resolver Comments</p>

                <div className="bg-gray-50 border rounded-lg p-4">
                  {selectedComplaint.comments || "No comments yet."}
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-semibold mb-2">
                  Assign Resolver
                </label>

                <select
                  value={selectedResolver}
                  onChange={(e) => setSelectedResolver(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Unassigned</option>

                  {resolvers.map((resolver) => (
                    <option key={resolver._id} value={resolver.username}>
                      {resolver.name || resolver.username} ({resolver.username})
                    </option>
                  ))}
                </select>

                {resolvers.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">
                    No Resolver accounts are currently registered.
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label className="block text-sm font-semibold mb-2">
                  Complaint Status
                </label>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="Pending">Pending</option>

                  <option value="In Progress">In Progress</option>

                  <option value="Resolved">Resolved</option>

                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-5 py-2 rounded-lg border"
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
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTable;
