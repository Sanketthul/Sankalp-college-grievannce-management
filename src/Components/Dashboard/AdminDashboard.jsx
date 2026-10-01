import React, { useState } from "react";
import AdminTable from "./AdminTable";
import SideDash from "./SideDash";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    assigned: 0,
  });

  const currUsername = sessionStorage.getItem("username");

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Navbar
        style={{
          padding: "10px",
          backgroundColor: "#8338ec",
        }}
        collapseOnSelect
        expand="lg"
        variant="dark"
        className="shadow-sm"
      >
        <Container>
          <Navbar.Brand>SANKALP</Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse>
            <Nav className="me-auto" />

            <Nav className="items-center">
              <Nav.Link href="/">Home</Nav.Link>

              <button onClick={logout} className="text-white px-3 py-2">
                Logout
              </button>

              <p className="mt-2 ml-2 text-white">
                Welcome, <span className="font-bold">Admin</span>
              </p>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="w-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-4/5">
          <AdminTable stats={stats} setStats={setStats} />
        </div>

        <SideDash stats={stats} />
      </div>
    </>
  );
}

export default AdminDashboard;
