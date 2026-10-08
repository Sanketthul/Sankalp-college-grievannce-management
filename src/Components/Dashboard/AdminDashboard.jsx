import React, { useState } from "react";
import AdminTable from "./AdminTable";
import SideDash from "./SideDash";

import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    assigned: 0,
  });

  return (
    <div className="admin-dashboard">
      <main className="admin-main">
        {/* Page Heading */}

        <div className="admin-dashboard-layout">
          {/* Main Complaint Table */}

          <section className="admin-table-section">
            <div className="admin-table-container">
              <AdminTable stats={stats} setStats={setStats} />
            </div>
          </section>

          {/* Statistics Sidebar */}

          <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
              <span className="admin-section-label">OVERVIEW</span>

              <h3>Complaint Statistics</h3>
            </div>

            <SideDash stats={stats} />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
