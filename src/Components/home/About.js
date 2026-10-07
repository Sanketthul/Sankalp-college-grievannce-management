import React from "react";

function About() {
  return (
    <section className="features-section">
      <div className="features-container">
        {/* Section Heading */}
        <div className="features-heading">
          <span className="features-eyebrow">OUR FEATURES</span>

          <h2 className="features-title">
            Online Grievance Resolver for Colleges as per AICTE
          </h2>

          <p className="features-description">
            A simple and organized platform to receive, manage, track and
            resolve college grievances.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="features-grid">
          {/* FEATURE 01 */}
          <div className="feature-card">
            <span className="feature-number">FEATURE 01</span>

            <h3 className="feature-title">Helping hand</h3>

            <p className="feature-text">
              This module provides helping hand to students and staff by
              acknowledging and solving their problems. It maintains the healthy
              environment for stakeholders of the institute.
            </p>
          </div>

          {/* FEATURE 02 */}
          <div className="feature-card">
            <span className="feature-number">FEATURE 02</span>

            <h3 className="feature-title">Receiving complaints</h3>

            <p className="feature-text">
              Admin can always receive verbal complaints but such complaints can
              be forgotten. We help receive and log complaints in written form
              and work on them.
            </p>
          </div>

          {/* FEATURE 03 */}
          <div className="feature-card">
            <span className="feature-number">FEATURE 03</span>

            <h3 className="feature-title">Maintaining complaints</h3>

            <p className="feature-text">
              Dealing with too many complaints without delay can be a
              challenging task. Our module allows complaints to be organized and
              managed effortlessly.
            </p>
          </div>

          {/* FEATURE 04 */}
          <div className="feature-card">
            <span className="feature-number">FEATURE 04</span>

            <h3 className="feature-title">Solving complaints</h3>

            <p className="feature-text">
              Assigned personnel can keep track of complaint status. Complaints
              judged to be invalid or not warranting further action can be
              marked as rejected.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
