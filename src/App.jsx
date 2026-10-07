import React from "react";
import Navbar from "./Components/Navbar/Navbar";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

import { Routes, Route } from "react-router-dom";

import Hero from "./Components/home/Hero";

import Login from "./Components/Login";

import Register from "./Components/Register";

import Dashboard from "./Components/Dashboard/Dashboard";

import AdminDashboard from "./Components/Dashboard/AdminDashboard";

import ResolverDashboard from "./Components/Dashboard/ResolverDashboard";

import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/student"
          element={
            <PrivateRoute allowedRole="Student">
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRole="Admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/resolver"
          element={
            <PrivateRoute allowedRole="Resolver">
              <ResolverDashboard />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NavigateToHome />} />
      </Routes>
    </div>
  );
}

function NavigateToHome() {
  const token = sessionStorage.getItem("token");

  const role = sessionStorage.getItem("role");

  if (token && role === "Admin") {
    window.location.replace("/admin");

    return null;
  }

  if (token && role === "Resolver") {
    window.location.replace("/resolver");

    return null;
  }

  if (token && role === "Student") {
    window.location.replace("/student");

    return null;
  }

  window.location.replace("/");

  return null;
}

export default App;
