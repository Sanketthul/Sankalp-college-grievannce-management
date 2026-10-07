import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    uid: "",
    username: "",
    pass: "",
    adminSecretKey: "",
    resolverSecretKey: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [showResolverKey, setShowResolverKey] = useState(false);

  const changeEventHandler = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const roleChangeHandler = (event) => {
    const role = event.target.value;

    setFormData((prevData) => ({
      ...prevData,
      role,
      adminSecretKey: "",
      resolverSecretKey: "",
    }));
  };

  const sendData = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      alert("Please select your role.");
      return;
    }

    if (formData.role === "Admin" && !formData.adminSecretKey.trim()) {
      alert("Admin secret key is required.");
      return;
    }

    if (formData.role === "Resolver" && !formData.resolverSecretKey.trim()) {
      alert("Resolver secret key is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "User registered successfully!");
        navigate("/login");
        return;
      }

      if (data.errors && Array.isArray(data.errors)) {
        const messages = data.errors.map((error) => error.message).join("\n");

        alert(messages);
        return;
      }

      if (response.status === 403) {
        alert(data.message || "Invalid secret key.");
        return;
      }

      if (response.status === 409) {
        alert(data.message || "Username, email or UID already exists.");
        return;
      }

      alert(data.message || data.msg || "Registration failed.");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* LEFT PANEL */}
        <div className="register-brand-panel">
          <div className="register-brand-content">
            <div className="register-logo">S</div>

            <p className="register-brand-label">SANKALP</p>

            <h1>
              Join.
              <br />
              Connect.
              <br />
              Resolve.
            </h1>

            <p className="register-brand-description">
              Create your account and become part of a better grievance
              management experience.
            </p>

            <div className="register-login-box">
              <p>Already have an account?</p>

              <Link to="/login">Login to your account</Link>
            </div>
          </div>

          <div className="register-decoration register-decoration-one" />
          <div className="register-decoration register-decoration-two" />
          <div className="register-decoration register-decoration-three" />
        </div>

        {/* RIGHT PANEL */}
        <div className="register-form-panel">
          <div className="register-form-wrapper">
            {/* MOBILE LOGO */}
            <div className="register-mobile-logo">
              <div className="register-logo">S</div>

              <span>SANKALP</span>
            </div>

            {/* HEADING */}
            <div className="register-heading">
              <p className="register-eyebrow">GET STARTED</p>

              <h2>Create your account</h2>

              <p>
                Fill in your details to register with SANKALP.
                <br />
                Admin secret key - SankalpAdmin
                <br />
                Resolver secret key - SankalpResolver
              </p>
            </div>

            <form onSubmit={sendData}>
              {/* ROLE */}
              <div className="register-field">
                <label htmlFor="role">Account type</label>

                <div className="register-input-wrapper">
                  <svg
                    className="register-input-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19a6 6 0 00-12 0"
                    />

                    <circle cx="9" cy="7" r="4" />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 11a4 4 0 100-8"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 13a5 5 0 015 5"
                    />
                  </svg>

                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={roleChangeHandler}
                    required
                  >
                    <option value="">Select your role</option>

                    <option value="Student">Student</option>

                    <option value="Resolver">Resolver</option>

                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* ADMIN SECRET KEY */}
              {formData.role === "Admin" && (
                <div className="register-field">
                  <label htmlFor="adminSecretKey">Admin secret key</label>

                  <div className="register-input-wrapper">
                    <svg
                      className="register-input-icon"
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
                      id="adminSecretKey"
                      type={showAdminKey ? "text" : "password"}
                      name="adminSecretKey"
                      value={formData.adminSecretKey}
                      onChange={changeEventHandler}
                      placeholder="Enter admin secret key"
                      required
                    />

                    <button
                      type="button"
                      className="register-password-toggle"
                      onClick={() => setShowAdminKey(!showAdminKey)}
                    >
                      {showAdminKey ? "Hide" : "Show"}
                    </button>
                  </div>

                  <p className="register-helper-text">
                    Secret key required for Admin registration.
                  </p>
                </div>
              )}

              {/* RESOLVER SECRET KEY */}
              {formData.role === "Resolver" && (
                <div className="register-field">
                  <label htmlFor="resolverSecretKey">Resolver secret key</label>

                  <div className="register-input-wrapper">
                    <svg
                      className="register-input-icon"
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
                      id="resolverSecretKey"
                      type={showResolverKey ? "text" : "password"}
                      name="resolverSecretKey"
                      value={formData.resolverSecretKey}
                      onChange={changeEventHandler}
                      placeholder="Enter resolver secret key"
                      required
                    />

                    <button
                      type="button"
                      className="register-password-toggle"
                      onClick={() => setShowResolverKey(!showResolverKey)}
                    >
                      {showResolverKey ? "Hide" : "Show"}
                    </button>
                  </div>

                  <p className="register-helper-text">
                    Secret key required for Resolver registration.
                  </p>
                </div>
              )}

              {/* NAME + EMAIL */}
              <div className="register-two-column">
                <div className="register-field">
                  <label htmlFor="name">Full name</label>

                  <div className="register-input-wrapper">
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={changeEventHandler}
                      placeholder="Full name"
                      required
                    />
                  </div>
                </div>

                <div className="register-field">
                  <label htmlFor="email">Email</label>

                  <div className="register-input-wrapper">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={changeEventHandler}
                      placeholder="Email address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* UID */}
              <div className="register-field">
                <label htmlFor="uid">UID</label>

                <div className="register-input-wrapper">
                  <svg
                    className="register-input-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />

                    <path
                      strokeLinecap="round"
                      d="M7 9h.01M11 9h6M7 13h10M7 17h5"
                    />
                  </svg>

                  <input
                    id="uid"
                    type="text"
                    name="uid"
                    value={formData.uid}
                    onChange={changeEventHandler}
                    placeholder="Enter your UID"
                    required
                  />
                </div>
              </div>

              {/* USERNAME */}
              <div className="register-field">
                <label htmlFor="username">Username</label>

                <div className="register-input-wrapper">
                  <svg
                    className="register-input-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="8" r="4" />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 20a8 8 0 0116 0"
                    />
                  </svg>

                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={changeEventHandler}
                    placeholder="Choose a username"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="register-field">
                <label htmlFor="password">Password</label>

                <div className="register-input-wrapper">
                  <svg
                    className="register-input-icon"
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
                    name="pass"
                    value={formData.pass}
                    onChange={changeEventHandler}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* REGISTER BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="register-submit-button"
              >
                <span>
                  {loading ? "Creating account..." : "Create account"}
                </span>

                {!loading && (
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
                )}
              </button>
            </form>

            {/* MOBILE LOGIN */}
            <div className="register-mobile-login">
              <span>Already have an account?</span>

              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
