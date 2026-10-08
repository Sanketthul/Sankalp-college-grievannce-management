import React, { useState } from "react";
import SideNav from "./SideNav";
import AddcomplaintsModal from "./AddcomplaintsModal";
import ComplaintHistory from "./ComplaintHistory";
import "./Dashboard.css";

function Dahboard() {
  const [userDetail] = useState(false);

  const currUsername = sessionStorage.getItem("username") || "Student";

  return (
    <div className="student-dashboard">
      {/* Profile / Side Navigation */}
      {userDetail && (
        <div className="student-profile-panel">
          <SideNav uname={currUsername} />
        </div>
      )}

      {/* Main Content */}
      <main className="student-main">
        {/* Welcome Section */}

        {/* Dashboard Content */}
        <section className="student-content-grid">
          {/* Create Complaint */}
          <div className="student-card complaint-create-card">
            <div className="student-card-heading">
              <div className="student-card-icon create-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.7}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>

              <div>
                <h2>Create a Complaint</h2>
                <p>Submit a new grievance to the administration.</p>
              </div>
            </div>

            <div className="student-card-body">
              <AddcomplaintsModal />
            </div>
          </div>

          {/* Complaint History */}
          <div className="student-card history-card">
            <div className="student-card-heading">
              <div className="student-card-icon history-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.7}
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
                <h2>My Complaints</h2>
                <p>View and track your submitted grievances.</p>
              </div>
            </div>

            <div className="student-card-body">
              <ComplaintHistory />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dahboard;
