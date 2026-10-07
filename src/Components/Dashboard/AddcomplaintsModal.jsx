import React, { useState } from "react";
import "./AddcomplaintsModal.css";

function AddcomplaintsModal() {
  const current = new Date().toLocaleString();
  const date_time_arr = current.split(", ");

  const username = sessionStorage.getItem("username") || "";
  const uid = sessionStorage.getItem("uid") || "";

  const [data, setData] = useState({
    p_incharge: "",
    branch: "",
    complaint: "",
    date: date_time_arr[0],
    time: date_time_arr[1],
  });

  const [loading, setLoading] = useState(false);

  const addData = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function sendData(e) {
    e.preventDefault();

    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Your session has expired. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/complaints", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Complaint created successfully! 🎫");

        setData({
          p_incharge: "",
          branch: "",
          complaint: "",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        });
      } else if (response.status === 401) {
        alert("Your session has expired. Please login again.");
      } else if (response.status === 403) {
        alert(
          result.message || "You do not have permission to create a complaint.",
        );
      } else if (result.errors && Array.isArray(result.errors)) {
        const messages = result.errors.map((error) => error.message).join("\n");

        alert(messages);
      } else {
        alert(result.message || "Unable to create complaint.");
      }
    } catch (error) {
      console.error("Create complaint error:", error);
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="complaint-form-wrapper">
      <form onSubmit={sendData} className="complaint-form">
        {/* Header */}
        <div className="complaint-form-header">
          <div>
            <p className="complaint-form-label">NEW GRIEVANCE</p>

            <h3>Submit a Complaint</h3>

            <p className="complaint-form-description">
              Provide the details below to register your grievance.
            </p>
          </div>

          <div className="complaint-token-icon">🎫</div>
        </div>

        {/* Student Information */}
        <div className="complaint-section">
          <div className="complaint-section-title">Student Information</div>

          <div className="complaint-two-column">
            <div className="complaint-field">
              <label>Student Name</label>

              <input type="text" value={username} readOnly />
            </div>

            <div className="complaint-field">
              <label>UID</label>

              <input type="text" value={uid} readOnly />
            </div>
          </div>
        </div>

        {/* Complaint Information */}
        <div className="complaint-section">
          <div className="complaint-section-title">Complaint Details</div>

          {/* Person Incharge */}
          <div className="complaint-field">
            <label htmlFor="p_incharge">Person Incharge</label>

            <input
              id="p_incharge"
              name="p_incharge"
              type="text"
              placeholder="Enter the person incharge name"
              value={data.p_incharge}
              onChange={addData}
              required
            />
          </div>

          {/* Branch */}
          <div className="complaint-field">
            <label htmlFor="branch">Complaint Branch</label>

            <select
              id="branch"
              name="branch"
              value={data.branch}
              onChange={addData}
              required
            >
              <option value="">Select complaint branch</option>

              <option value="Academic">Academic</option>

              <option value="Library">Library</option>

              <option value="Canteen">Canteen</option>

              <option value="Other">Other</option>
            </select>
          </div>

          {/* Complaint */}
          <div className="complaint-field">
            <div className="complaint-label-row">
              <label htmlFor="complaint">Complaint</label>

              <span>{data.complaint.length}/500</span>
            </div>

            <textarea
              id="complaint"
              name="complaint"
              placeholder="Describe your complaint clearly..."
              value={data.complaint}
              onChange={addData}
              rows="5"
              maxLength="500"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          className="complaint-submit-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="complaint-spinner"></span>
              Creating complaint...
            </>
          ) : (
            <>
              Create Complaint
              <span>→</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default AddcomplaintsModal;
