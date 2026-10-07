import React, { useState } from "react";
import { createPortal } from "react-dom";
import "./ComplaintHistory.css";

function ComplaintHistory() {
  const [HistoryModal, openHistoryModal] = useState(false);
  const [recordModal, openRecordModal] = useState(false);
  const [History, setHistory] = useState([]);

  const [complaintID, setComplaintID] = useState("");
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState("");
  const [feedback, openfeedback] = useState(false);

  const fetchFun = async () => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        alert("Your session has expired. Please login again.");
        return;
      }

      const response = await fetch("/api/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to fetch complaint history.");
      }

      let historyData = [];

      if (Array.isArray(result)) {
        historyData = result;
      } else if (result && Array.isArray(result.data)) {
        historyData = result.data;
      } else if (result && Array.isArray(result.complaints)) {
        historyData = result.complaints;
      }

      setHistory([...historyData].reverse());
    } catch (error) {
      console.error("History error:", error);

      setHistory([]);

      alert(error.message || "Unable to load complaint history.");
    }
  };

  const sendData = async () => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        alert("Your session has expired. Please login again.");
        return;
      }

      if (!complaintID.trim()) {
        alert("Please enter the complaint ID.");
        return;
      }

      const newUserData = {
        complaintID: complaintID.trim(),
        studentSatisfaction: status,
        studentFeedback: comments.trim(),
      };

      const response = await fetch("/api/studentFeedback", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(newUserData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to add feedback.");
      }

      alert("Feedback added successfully.");

      openfeedback(false);
      openRecordModal(true);

      setComplaintID("");
      setStatus("");
      setComments("");

      await fetchFun();
    } catch (error) {
      console.error("Feedback error:", error);

      alert(error.message || "Unable to add feedback.");
    }
  };

  const getStatusClass = (statusValue) => {
    if (!statusValue) {
      return "history-status history-status-pending";
    }

    const normalized = statusValue.toLowerCase();

    if (
      normalized.includes("resolved") ||
      normalized.includes("complete") ||
      normalized.includes("approved")
    ) {
      return "history-status history-status-success";
    }

    if (
      normalized.includes("reject") ||
      normalized.includes("invalid") ||
      normalized.includes("cancel")
    ) {
      return "history-status history-status-danger";
    }

    return "history-status history-status-progress";
  };

  const historyModal = HistoryModal
    ? createPortal(
        <div className="history-modal-overlay">
          <div className="history-modal history-large-modal">
            <div className="history-modal-header">
              <div>
                <span className="history-modal-label">COMPLAINT RECORDS</span>

                <h2>Track History</h2>

                <p>Complete record of complaints submitted by you.</p>
              </div>

              <button
                onClick={() => openHistoryModal(false)}
                className="history-close-icon"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Student</th>
                    <th>Date</th>
                    <th>Token Number</th>
                    <th>Incharge</th>
                    <th>Branch</th>
                  </tr>
                </thead>

                <tbody>
                  {History.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        <div className="history-empty">
                          <div className="history-empty-icon">📋</div>

                          <strong>No complaint history found</strong>

                          <span>
                            Your submitted complaints will appear here.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    History.map((itr, index) => (
                      <tr key={itr._id || index}>
                        <td>
                          <span className="history-number">{index + 1}</span>
                        </td>

                        <td>
                          <div className="history-student">
                            <strong>{itr.username}</strong>

                            <span>UID: {itr.uid}</span>
                          </div>
                        </td>

                        <td>
                          <span className="history-date">{itr.date}</span>
                        </td>

                        <td>
                          <span className="history-token">{itr._id}</span>
                        </td>

                        <td>
                          {itr.incharge_name || (
                            <span className="history-muted">Not assigned</span>
                          )}
                        </td>

                        <td>
                          <span className="history-branch">{itr.branch}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="history-modal-footer">
              <button
                onClick={() => openHistoryModal(false)}
                className="history-modal-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  const statusModal = recordModal
    ? createPortal(
        <div className="history-modal-overlay">
          <div className="history-modal history-large-modal">
            <div className="history-modal-header">
              <div>
                <span className="history-modal-label">COMPLAINT STATUS</span>

                <h2>Complaint Status</h2>

                <p>Check the current progress of your complaints.</p>
              </div>

              <button
                onClick={() => openRecordModal(false)}
                className="history-close-icon"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Student</th>
                    <th>Token Number</th>
                    <th>Status</th>
                    <th>Comments</th>
                    <th>Feedback</th>
                  </tr>
                </thead>

                <tbody>
                  {History.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        <div className="history-empty">
                          <div className="history-empty-icon">📋</div>

                          <strong>No complaints found</strong>

                          <span>Submit a complaint to start tracking it.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    History.map((itr, index) => (
                      <tr key={itr._id || index}>
                        <td>
                          <span className="history-number">{index + 1}</span>
                        </td>

                        <td>
                          <div className="history-student">
                            <strong>{itr.username}</strong>

                            <span>UID: {itr.uid}</span>
                          </div>
                        </td>

                        <td>
                          <span className="history-token">{itr._id}</span>
                        </td>

                        <td>
                          <span className={getStatusClass(itr.status)}>
                            {itr.status || "Waiting"}
                          </span>
                        </td>

                        <td className="history-comment-cell">
                          {itr.comments ? (
                            itr.comments
                          ) : (
                            <span className="history-muted">
                              Waiting for response
                            </span>
                          )}
                        </td>

                        <td>
                          <button
                            onClick={() => {
                              setComplaintID(itr._id);
                              openfeedback(true);
                              openRecordModal(false);
                            }}
                            className="history-feedback-button"
                            title="Give feedback"
                          >
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
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="history-modal-footer">
              <button
                onClick={() => openRecordModal(false)}
                className="history-modal-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  const feedbackModal = feedback
    ? createPortal(
        <div className="history-modal-overlay">
          <div className="history-modal history-feedback-modal">
            <div className="history-modal-header">
              <div>
                <span className="history-modal-label">STUDENT FEEDBACK</span>

                <h2>Give Your Feedback</h2>

                <p>Tell us about your experience with this complaint.</p>
              </div>

              <button
                onClick={() => {
                  openfeedback(false);
                  openRecordModal(true);
                }}
                className="history-close-icon"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="history-feedback-form">
              <div className="history-form-group">
                <label>Complaint ID</label>

                <input
                  value={complaintID}
                  onChange={(e) => setComplaintID(e.target.value)}
                  type="text"
                  placeholder="Enter complaint ID"
                />
              </div>

              <div className="history-form-group">
                <label>Satisfaction</label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Select satisfaction</option>

                  <option value="Satisfied">Satisfied</option>

                  <option value="Not Satisfied">Not Satisfied</option>
                </select>
              </div>

              <div className="history-form-group">
                <label>Feedback</label>

                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Write your feedback here..."
                  rows="5"
                />
              </div>
            </div>

            <div className="history-modal-footer">
              <button
                type="button"
                onClick={sendData}
                className="history-submit-button"
              >
                Submit Feedback
              </button>

              <button
                type="button"
                onClick={() => {
                  openfeedback(false);
                  openRecordModal(true);
                }}
                className="history-cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <div className="complaint-history">
        <div className="history-header">
          <div>
            <p className="history-eyebrow">STUDENT DASHBOARD</p>

            <h1 className="history-title">Complaint Overview</h1>

            <p className="history-subtitle">
              Track your complaints, review their progress and provide feedback.
            </p>
          </div>
        </div>

        <div className="history-cards">
          {/* STATUS */}

          <div className="history-card">
            <div className="history-card-content">
              <div className="history-card-icon status-icon">
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

              <div className="history-card-text">
                <span className="history-card-label">COMPLAINT STATUS</span>

                <h2>Check Status</h2>

                <p>View the latest status and comments for your complaints.</p>

                <button
                  onClick={async () => {
                    await fetchFun();
                    openRecordModal(true);
                  }}
                  className="history-primary-button"
                >
                  View Status
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* HISTORY */}

          <div className="history-card">
            <div className="history-card-content">
              <div className="history-card-icon track-icon">
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

              <div className="history-card-text">
                <span className="history-card-label">COMPLAINT RECORDS</span>

                <h2>Track History</h2>

                <p>View all complaints submitted through your account.</p>

                <button
                  onClick={async () => {
                    await fetchFun();
                    openHistoryModal(true);
                  }}
                  className="history-secondary-button"
                >
                  View History
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PORTAL MODALS */}

      {historyModal}
      {statusModal}
      {feedbackModal}
    </>
  );
}

export default ComplaintHistory;
