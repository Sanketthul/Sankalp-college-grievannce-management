import React, { useState, useEffect } from "react";
import SideDash from "./SideDash";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import SideNav from "./SideNav";
import { Link } from "react-router-dom";

function ResolverDashboard() {
  // Fetched Data
  const [userId, setUserId] = useState([]);
  // User ID
  const [userDataId, setUserDataId] = useState();
  // VIEW STATES
  const [viewModal, openViewModal] = useState(false);
  const [FeedbackViewModal, openFeedbackViewModal] = useState(false);
  const [userComplaint, setUserComplaint] = useState();
  const [studentFeedback, setStudentFeedback] = useState("");

  const [statusModal, openStatusModal] = useState(false);
  const [complaintID, setComplaintID] = useState();
  const [status, setStatus] = useState();
  const [comments, setComments] = useState();

  const [complaintarray, setcomplaintarray] = useState();
  const [userdetail, setUserdetail] = useState(false);

  const currUsername = sessionStorage.getItem("username");

  var newUserData = {
    complaintID: complaintID,
    status: status,
    comments: comments,
  };

  var sendData = (e) => {
    // e.preventDefault();
    // console.log(formData);

    fetch("http://localhost:8000/complaints", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData),
    }).then((res) => {
      console.log(res);
    });

    alert("Status Updated");
  };

  useEffect(() => {
    fetch("http://localhost:8000/resolver")
      .then((res) => res.json())
      .then((data) => {
        setcomplaintarray(data.length);
        console.log(data);

        var jsonObject = data.map(JSON.stringify);

        // console.log(jsonObject);

        var uniqueSet = new Set(jsonObject);
        var uniqueArray = Array.from(uniqueSet).map(JSON.parse);
        setUserId(uniqueArray.reverse());
      });
  }, [studentFeedback]);

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
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/">Logout</Nav.Link>
              <p className="mt-2 ml-2 text-white">Welcome, <span className="font-bold">Resolver</span></p>
              <button onClick={()=>{setUserdetail(!userdetail)}} className="text-white ml-2">
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
          (
          <div className="absolute right-0 bg-violet-600 shadow-lg shadow-violet-50 m-2 p-6 w-1/6 rounded-md border border-gray-100">
            <p className="text-white">
             
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
      <div className="flex w-full">
        {statusModal && (
          <div className="z-10 bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            <div className="bg-white py-4 w-2/4  rounded-md text-center flex flex-col justify-center items-center">
              <div className="mb-4">Give your Resolution</div>

              <div className="flex flex-wrap px-4 py-1 w-full">
                <div className="relative w-full appearance-none label-floating">
                  <input
                    onChange={(e) => {
                      setComplaintID(e.target.value);
                    }}
                    className="tracking-wide py-2 px-4 mb-3 leading-relaxed appearance-none block w-full bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                    name="complaintID"
                    type="text"
                    placeholder="Enter complaintID"
                  />
                </div>
              </div>
              <div className="flex flex-wrap px-4 py-1 w-full">
                <div className="relative w-42 appearance-none label-floating w-full">
                  <input
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                    className="tracking-wide py-2 px-4 mb-3 leading-relaxed appearance-none block w-full bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                    name="status"
                    type="text"
                    placeholder="Enter Status of Gravience"
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
                  onClick={() => sendData()}
                  className="bg-green-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
                >
                  Submit
                </button>

                <button
                  onClick={() => {
                    openStatusModal(false);
                  }}
                  className="bg-red-400 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {viewModal && (
          <div className="z-10 bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            <div className=" bg-white px-16 py-14 rounded-md text-center border w-[50vw] ">
              <h2 className="text-sm mb-4 font-bold text-slate-500">
                Below is the Complaint Added by user with ID
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                  {userDataId}
                </span>
              </h2>
              <div className="bg-green-50 p-2">
                <p className="test-sm text-gray-600 text-center ">
                  {userComplaint}
                </p>
              </div>

              <button
                onClick={() => openViewModal(false)}
                className="bg-indigo-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold mt-2"
              >
                Ok
              </button>
            </div>
          </div>
        )}
        {FeedbackViewModal && (
          <div className="z-10 bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            <div className=" bg-white px-16 py-14 rounded-md text-center border w-[50vw] ">
              <h2 className="text-sm mb-4 font-bold text-slate-500">
                Below is the Feedback Added by user with complaint ID
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                  {userDataId}
                </span>
              </h2>
              <div className="bg-red-50 p-2">
                <p className="test-sm text-gray-600 text-center ">
                  {studentFeedback}
                </p>
              </div>

              <button
                onClick={() => openFeedbackViewModal(false)}
                className="bg-red-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold mt-2"
              >
                Ok
              </button>
            </div>
          </div>
        )}
      
       {/* COMPLAINTS */}
        <div className="h-[90vh] md:w-full  overflow-scroll rounded-lg border border-gray-600 shadow-sm mx-4 mt-4">
        <div className=" bg-gray-200 w-auto mt-4 mx-2 rounded-sm "> <h4 className="text-sm  py-2 px-4">Complaint Details</h4></div>
          <table className="w-[75vw] h-24 border-collapse bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  SrNo
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Name
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Complaint ID
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Incharge name
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Branch of Complaint
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  View
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  comment
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  feedback
                </th>
              </tr>
            </thead>
            {userId.map((itr, index) => {
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 border px-2 py-1 text-xs font-semibold text-gray-800">
                      {index + 1}
                    </span>
                  </td>
                  <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">
                        {itr.username}
                      </div>
                      <div className="text-gray-400">UID : {itr.uid}</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                      {itr._id}
                    </span>
                  </td>
                  <td className="px-6 py-4">{itr.incharge_name}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                        {itr.branch}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => {
                          setUserDataId(itr._id);
                          setUserComplaint(itr.complaint);
                          openViewModal(true);
                        }}
                        className="View"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 text-green-500"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => {
                          openStatusModal(true);
                        }}
                        className="Forward"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6 text-blue-500"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => {
                          setUserDataId(itr._id);
                          setStudentFeedback(itr.studentFeedback);
                          openFeedbackViewModal(true);
                        }}
                        className="View"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6 text-red-500"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tbody className="divide-y divide-gray-100 border-t border-gray-100"></tbody>
          </table>
        </div>

        {/* SIDEBAR */}

        <div className="my-5 mx-2">
          <div className="h-full main-container w-72  flex flex-col  items-center justify-start">
            <div className="bg-white w-full shadow-sm border rounded-xl">
              <h2 className="text-purple-600 text-center p-2 ">Dashboard</h2>
            </div>
            {/* BOX 01 */}
            <div className="bg-white w-full shadow-sm border rounded-lg mt-6 flex flex-col justify-center items-center ">
              <p className=" w-full bg-pink-100 text-pink-800 text-center py-3 shadow-sm border rounded-lg ">
                Name Of Head
              </p>
              <span className="font-bold text-pink-600 text-[25px] mb-6 ">
                Mr Resolver
              </span>
            </div>
            {/* BOX 02 */}

            <div className="bg-white w-full shadow-sm border rounded-lg mt-6 flex flex-col justify-center items-center ">
              <p className=" w-full bg-green-100 text-green-800 text-center py-3 shadow-sm border rounded-lg">
                complaints FWD by Admin
              </p>
              <span className=" font-bold text-green-600 text-[50px] ">
                {complaintarray}
              </span>
            </div>
            {/* BOX 03 */}

            <div className="bg-white w-full shadow-sm border rounded-lg mt-6 flex flex-col justify-center items-center ">
              <p className=" w-full bg-blue-100 text-blue-800 text-center py-3 shadow-sm border rounded-lg ">
                Pending Complaints
              </p>
              <span className="font-bold text-blue-600 text-[50px] ">00</span>
            </div>
            {/* <button
          onClick={() => alert(props.data)}
          className="bg-red-200 px-3 rounded-full mt-2"
        >
          Sort By Time
        </button> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResolverDashboard;
