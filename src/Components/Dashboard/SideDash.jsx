import React from "react";

function StatCard({ title, value, className }) {
  return (
    <div
      className={`bg-white w-full shadow-sm border rounded-lg mt-4 ${className}`}
    >
      <p className="w-full bg-gray-50 text-gray-700 text-center py-3 shadow-sm border rounded-lg">
        {title}
      </p>

      <span className="block text-gray-700 font-bold text-[42px] text-center py-2">
        {value}
      </span>
    </div>
  );
}

function SideDash({ stats }) {
  return (
    <div className="my-5 mx-2 w-full lg:w-72">
      <div className="w-full flex flex-col items-center">
        <div className="bg-white w-full shadow-sm border rounded-lg">
          <h2 className="text-purple-600 text-center py-3 font-bold">
            Complaint Statistics
          </h2>
        </div>

        <StatCard title="Total Complaints" value={stats.total} />

        <StatCard title="Pending" value={stats.pending} />

        <StatCard title="In Progress" value={stats.inProgress} />

        <StatCard title="Resolved" value={stats.resolved} />

        <StatCard title="Rejected" value={stats.rejected} />

        <StatCard title="Assigned to Resolver" value={stats.assigned} />
      </div>
    </div>
  );
}

export default SideDash;
