import React, { useEffect, useState } from "react";
import AdminTable from "./AdminTable";
import SideDash from "./SideDash";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import SideNav from "./SideNav";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [numOfComplaints, setNoOfComplaints] = useState(0);
  const [complaintsFwded, setComplaintsFwded] = useState(0);
  const [statusModal, openStatusModal] = useState(false);
  const [complaintID, setComplaintID] = useState();
  const [status, setStatus] = useState();
  const [comments, setComments] = useState();

  const [userdetail, setUserdetail] = useState(false);


  const currUsername = sessionStorage.getItem("username");

  var newUserData = {
    username: complaintID,
    comments: comments,
  };

  var sendData = (e) => {
    // e.preventDefault();
    // console.log(formData);

    fetch("http://localhost:8000/removeUser", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData),
    }).then((res) => {
      console.log(res);
    });

    alert("User Removed");
  };

  return (
    <>
      {" "}
      <Navbar
        style={{ padding: "10px", backgroundColor: "#8338ec" }}
        collapseOnSelect
        expand="lg"
        variant="dark"
        className="shadow-sm"
      >
        <Container>
          <Navbar.Brand href="#home">SANKALP</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <button
                onClick={() => {
                  openStatusModal(true);
                }}
                className="text-black p-2 bg-white rounded-lg mr-4"
              >
                Remove User
              </button>
              <Nav.Link href="/">Home</Nav.Link>

              <Nav.Link href="/">Logout</Nav.Link>

              <p className="mt-2 ml-2 text-white">
                Welcome, <span className="font-bold">Admin</span>
              </p>

              <button
                onClick={() => {
                  setUserdetail(!userdetail);
                }}
                className="text-white ml-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {userdetail && (
        <div className="absolute w-full">
          ({" "}
          <div className="absolute right-0 bg-violet-600 shadow-lg shadow-violet-50 m-2 p-6 w-1/6 rounded-md border border-gray-100">
            <p className="text-white">
              {" "}
              Username: <span className="font-bold">{currUsername}</span>
            </p>

            <Link to="/">
              <button className="bg-white px-3 py-1 mt-2 rounded-full text-red-500 font-bold text-sm">
                logout
              </button>
            </Link>
          </div>
          )
        </div>
      )}
      <div className="w-full flex ">
        {statusModal && (
          <div className="z-10 bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            <div className="bg-white py-4 w-[500px]  rounded-md text-center flex flex-col justify-center items-center">
              <form onSubmit={() => sendData()}>
                <div className="mb-4">Remove A user</div>

                <div className="flex flex-wrap px-4 py-1 w-full">
                  <div className="relative w-full appearance-none label-floating">
                    <input
                      onChange={(e) => {
                        setComplaintID(e.target.value);
                      }}
                      className="tracking-wide py-2 px-4 mb-3 leading-relaxed appearance-none block w-full bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                      name="username"
                      type="text"
                      required
                      placeholder="Enter Username"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap px-4 py-1 w-full">
                  <div className="relative w-42 appearance-none label-floating w-full">
                    <input
                      onChange={(e) => {
                        setComments(e.target.value);
                      }}
                      className="tracking-wide py-2 px-4 mb-3 leading-relaxed appearance-none block w-full bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                      name="comments"
                      type="text"
                      placeholder="Enter Comments if Any"
                    />
                  </div>
                </div>

                <div className="flex justify-center items-center ">
                  <button
                    type="submit"
                    className="bg-green-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
                  >
                    Remove
                  </button>

                  <button
                    onClick={() => {
                      openStatusModal(false);
                    }}
                    className="bg-red-400 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
                  >
                    cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="w-4/5">
          <AdminTable
            numOfComplaints={numOfComplaints}
            setNoOfComplaints={setNoOfComplaints}
            complaintsFwded={complaintsFwded}
            setComplaintsFwded={setComplaintsFwded}
          ></AdminTable>
        </div>
        <SideDash
          head="Statists"
          numOfComplaints={numOfComplaints}
          complaintsFwded={complaintsFwded}
        ></SideDash>
      </div>
    </>
  );
}

export default AdminDashboard;
