import React from "react";
import { Link } from "react-router-dom";

import About from "./About";
import Footer from "./Footer";

import hero from "../../Assets/images/hero-img.png";

function Hero() {
  return (
    <>
      <main className="hero-page">
        <section className="hero-section">
          <div className="hero-container">
            {/* LEFT CONTENT */}

            <div className="hero-content">
              <div className="hero-eyebrow">COLLEGE GRIEVANCE MANAGEMENT</div>

              <h1 className="hero-title">
                Your concern.
                <br />
                <span>Your voice.</span>
              </h1>

              <p className="hero-description">
                A simple and transparent platform for students to submit, track
                and resolve their grievances efficiently.
              </p>

              <div className="hero-actions">
                <Link to="/register" className="hero-primary-button">
                  Register
                </Link>

                <Link to="/login" className="hero-secondary-button">
                  Login
                </Link>
              </div>

              <div className="hero-info">
                <div className="hero-info-item">
                  <span className="hero-info-icon">✓</span>

                  <span>Easy complaint submission</span>
                </div>

                <div className="hero-info-item">
                  <span className="hero-info-icon">✓</span>

                  <span>Track complaint status</span>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}

            <div className="hero-image-wrapper">
              <div className="hero-image-background" />

              <img
                src={hero}
                alt="Sankalp grievance management"
                className="hero-image"
              />
            </div>
          </div>
        </section>

        <About />

        <Footer />
      </main>
    </>
  );
}

export default Hero;
