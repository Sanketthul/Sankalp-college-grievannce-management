import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

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

  // =====================================================
  // INPUT HANDLER
  // =====================================================

  const changeEventHandler = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,

      [name]: value,
    }));
  };

  // =====================================================
  // ROLE CHANGE
  // =====================================================

  const roleChangeHandler = (event) => {
    const role = event.target.value;

    setFormData((prevData) => ({
      ...prevData,

      role,

      // Clear secret keys
      // when role changes.

      adminSecretKey: "",

      resolverSecretKey: "",
    }));
  };

  // =====================================================
  // REGISTER
  // =====================================================

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

      const response = await fetch("http://localhost:8000/register", {
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
    <div>
      <div className="h-screen md:flex">
        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center hidden">
          <div>
            <h1 className="text-white font-bold text-4xl font-sans">
              SANKALP - Register
            </h1>

            <p className="text-white mt-1">
              A platform to RESOLVE your queries
            </p>

            <Link to="/login">
              <button
                type="button"
                className="block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2"
              >
                Login
              </button>
            </Link>
          </div>

          <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />

          <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />

          <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />

          <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="flex md:w-1/2 justify-center py-10 items-center bg-white overflow-y-auto">
          <form onSubmit={sendData} className="bg-white w-96">
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
              Please Register to Continue...
            </h1>

            <p className="text-sm font-normal text-gray-600 mb-7">
              Welcome to SANKALP
            </p>

            {/* =================================================
                ROLE
            ================================================= */}

            <div className="flex items-center border-2 my-4 rounded-2xl">
              <select
                value={formData.role}
                onChange={roleChangeHandler}
                className="form-select py-2 px-3 rounded-2xl w-full outline-none"
                name="role"
                required
              >
                <option value="">Select your Role</option>

                <option value="Student">Student</option>

                <option value="Resolver">Resolver</option>

                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* =================================================
                ADMIN SECRET KEY
            ================================================= */}

            {formData.role === "Admin" && (
              <div className="mb-4">
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                  <input
                    onChange={changeEventHandler}
                    className="pl-2 outline-none border-none w-full"
                    type="password"
                    name="adminSecretKey"
                    value={formData.adminSecretKey}
                    placeholder="Admin Secret Key"
                    required
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2 ml-2">
                  Secret key required for Admin registration.
                </p>
              </div>
            )}

            {/* =================================================
                RESOLVER SECRET KEY
            ================================================= */}

            {formData.role === "Resolver" && (
              <div className="mb-4">
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                  <input
                    onChange={changeEventHandler}
                    className="pl-2 outline-none border-none w-full"
                    type="password"
                    name="resolverSecretKey"
                    value={formData.resolverSecretKey}
                    placeholder="Resolver Secret Key"
                    required
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2 ml-2">
                  Secret key required for Resolver registration.
                </p>
              </div>
            )}

            {/* =================================================
                NAME
            ================================================= */}

            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <input
                onChange={changeEventHandler}
                value={formData.name}
                className="pl-2 outline-none border-none w-full"
                type="text"
                name="name"
                placeholder="Full name"
                required
              />
            </div>

            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <input
                onChange={changeEventHandler}
                value={formData.email}
                className="pl-2 outline-none border-none w-full"
                type="email"
                name="email"
                placeholder="Email Address"
                required
              />
            </div>

            {/* =================================================
                UID
            ================================================= */}

            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <input
                onChange={changeEventHandler}
                value={formData.uid}
                className="pl-2 outline-none border-none w-full"
                type="text"
                name="uid"
                placeholder="Enter your UID"
                required
              />
            </div>

            {/* =================================================
                USERNAME
            ================================================= */}

            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <input
                onChange={changeEventHandler}
                value={formData.username}
                className="pl-2 outline-none border-none w-full"
                type="text"
                name="username"
                placeholder="Username"
                required
              />
            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <input
                onChange={changeEventHandler}
                value={formData.pass}
                className="pl-2 outline-none border-none w-full"
                type="password"
                name="pass"
                placeholder="Password"
                required
              />
            </div>

            {/* =================================================
                REGISTER BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className={`block w-full mt-4 py-2 rounded-2xl text-white font-semibold mb-2 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <Link to="/login">
              <span className="text-sm ml-2 hover:text-blue-500 cursor-pointer">
                Already registered? Click here to login
              </span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
