import React from "react";
import "./SideDash.css";

function StatCard({ title, value, type }) {
  return (
    <div className={`admin-stat-card ${type || ""}`}>
      <div className="admin-stat-card-header">
        <span>{title}</span>
      </div>

      <div className="admin-stat-card-value">{value}</div>
    </div>
  );
}

function SideDash({ stats }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-statistics-header">
        <div className="admin-statistics-icon">
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
              d="M3 13.125l6-6 4.5 4.5L21 4.125M21 4.125V10m0-5.875h-5.875"
            />
          </svg>
        </div>

        <div>
          <span className="admin-statistics-label">OVERVIEW</span>

          <h2>Complaint Statistics</h2>

          <p>Current grievance summary</p>
        </div>
      </div>

      <div className="admin-statistics-list">
        <StatCard
          title="Total Complaints"
          value={stats?.total || 0}
          type="stat-total"
        />

        <StatCard
          title="Pending"
          value={stats?.pending || 0}
          type="stat-pending"
        />

        <StatCard
          title="In Progress"
          value={stats?.inProgress || 0}
          type="stat-progress"
        />

        <StatCard
          title="Resolved"
          value={stats?.resolved || 0}
          type="stat-resolved"
        />

        <StatCard
          title="Rejected"
          value={stats?.rejected || 0}
          type="stat-rejected"
        />

        <StatCard
          title="Assigned to Resolver"
          value={stats?.assigned || 0}
          type="stat-assigned"
        />
      </div>
    </aside>
  );
}

export default SideDash;
