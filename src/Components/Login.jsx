import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(e) {
    e.preventDefault();

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uname: username,
        pass: pass,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (res.status === 200) {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("username", data.user.username);
          sessionStorage.setItem("role", data.user.role);
          sessionStorage.setItem("uid", data.user.uid);

          if (data.user.role === "Admin") {
            alert("Welcome Admin");
            navigate("/admin");
          } else if (data.user.role === "Resolver") {
            alert("Welcome Resolver");
            navigate("/resolver");
          } else if (data.user.role === "Student") {
            alert("Welcome student !!");
            navigate("/student");
          } else {
            alert("Invalid user role.");
          }
        } else {
          alert(data.message || "Invalid Username or password");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        alert("Unable to connect to server.");
      });
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* LEFT BRAND PANEL */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-logo">S</div>

            <p className="auth-brand-label">SANKALP</p>

            <h1>
              Resolve.
              <br />
              Connect.
              <br />
              Improve.
            </h1>

            <p className="auth-brand-description">
              A digital grievance management platform designed to connect
              students, faculty and administrators.
            </p>

            <div className="auth-highlight">
              <span>✦</span>
              <p>
                A platform to <strong>resolve</strong> your queries.
              </p>
            </div>
          </div>

          <div className="auth-decoration auth-decoration-one" />
          <div className="auth-decoration auth-decoration-two" />
          <div className="auth-decoration auth-decoration-three" />
        </div>

        {/* RIGHT LOGIN PANEL */}
        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            <div className="auth-mobile-logo">
              <div className="auth-logo">S</div>

              <span>SANKALP</span>
            </div>

            <div className="auth-heading">
              <p className="auth-eyebrow">WELCOME BACK</p>

              <h2>Sign in to your account</h2>

              <p>Enter your credentials to continue.</p>
            </div>

            <form onSubmit={onSubmit}>
              {/* USERNAME */}
              <div className="ui-field">
                <label htmlFor="username">Username</label>

                <div className="ui-input-wrapper">
                  <svg
                    className="ui-input-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 20.25a7.5 7.5 0 0115 0"
                    />
                  </svg>

                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="ui-field">
                <label htmlFor="password">Password</label>

                <div className="ui-input-wrapper">
                  <svg
                    className="ui-input-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="4" y="10" width="16" height="11" rx="2" />

                    <path strokeLinecap="round" d="M8 10V7a4 4 0 018 0v3" />
                  </svg>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button type="submit" className="auth-submit-button">
                <span>Login</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 6l6 6-6 6"
                  />
                </svg>
              </button>
            </form>

            <div className="auth-register">
              <span>Don't have an account?</span>

              <Link to="/register">Create an account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
