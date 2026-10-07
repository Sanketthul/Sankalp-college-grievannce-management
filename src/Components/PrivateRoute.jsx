import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children, allowedRole }) {
  const location = useLocation();

  const token = sessionStorage.getItem("token");

  const role = sessionStorage.getItem("role");

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

  if (!role) {
    sessionStorage.clear();

    return <Navigate to="/login" replace />;
  }

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

  return children;
}

export default PrivateRoute;
