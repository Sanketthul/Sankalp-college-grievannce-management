import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const token = sessionStorage.getItem("token");

  const role = sessionStorage.getItem("role");

  const username = sessionStorage.getItem("username");

  const handleLogout = () => {
    sessionStorage.clear();

    navigate("/login");
  };

  const getDashboardPath = () => {
    if (role === "Admin") {
      return "/admin";
    }

    if (role === "Resolver") {
      return "/resolver";
    }

    if (role === "Student") {
      return "/student";
    }

    return "/";
  };

  return (
    <nav className="sankalp-navbar">
      <div className="navbar-container">
        {/* BRAND */}

        <Link to={getDashboardPath()} className="navbar-brand">
          <span className="brand-mark">S</span>

          <span className="brand-name">SANKALP</span>
        </Link>

        {/* DESKTOP NAV */}

        <div className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}>
          {!token && (
            <>
              <Link to="/" className="navbar-link">
                Home
              </Link>

              <Link to="/login" className="navbar-link">
                Login
              </Link>

              <Link to="/register" className="navbar-register">
                Register
              </Link>
            </>
          )}

          {token && role === "Student" && (
            <>
              <Link to="/student" className="navbar-link">
                Dashboard
              </Link>
            </>
          )}

          {token && role === "Resolver" && (
            <>
              <Link to="/resolver" className="navbar-link">
                Dashboard
              </Link>
            </>
          )}

          {token && role === "Admin" && (
            <>
              <Link to="/admin" className="navbar-link">
                Dashboard
              </Link>
            </>
          )}

          {token && (
            <div className="navbar-user-area">
              <div className="navbar-user">
                <div className="navbar-avatar">
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </div>

                <span>{username || "User"}</span>
              </div>

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}

        <button
          type="button"
          className="navbar-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
