import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children, allowedRole }) {
  const location = useLocation();

  const token = sessionStorage.getItem("token");

  const role = sessionStorage.getItem("role");

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =====================================================
  // ROLE NOT FOUND
  // =====================================================

  if (!role) {
    sessionStorage.clear();

    return <Navigate to="/login" replace />;
  }

  // =====================================================
  // WRONG ROLE
  // =====================================================

  if (allowedRole && role !== allowedRole) {
    if (role === "Admin") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "Resolver") {
      return <Navigate to="/resolver" replace />;
    }

    if (role === "Student") {
      return <Navigate to="/student" replace />;
    }

    sessionStorage.clear();

    return <Navigate to="/login" replace />;
  }

  // =====================================================
  // ACCESS GRANTED
  // =====================================================

  return children;
}

export default PrivateRoute;
