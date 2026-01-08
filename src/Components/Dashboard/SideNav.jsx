import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SideNav(props) {
  const navigate = useNavigate();
  const [toggle, changetoggle] = useState(true);
  const [profileModal, openProfileModal] = useState(false);
  const [oldUsername, setOldUserName] = useState();
  const [newUserName, setNewUserName] = useState();
  const [newPass, setNewPass] = useState();


  var newUserData = {
    oldUsername: oldUsername,
    newUsername: newUserName,
    newpassword: newPass,
  };

  var sendData = (e) => {
    e.preventDefault();
    // console.log(formData);

    fetch("http://localhost:8000/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData),
    }).then((res) => {
      // console.log(res);
    });

    alert("Profile Updated");

    navigate("/login");
  };

  return (
    <>
      {profileModal && (
        <div className="z-10 bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
          <div className="bg-white py-4 w-96  rounded-md text-center flex flex-col justify-center items-center">
            <div className="mb-4">Update Your Profile</div>

            <div className="flex flex-wrap px-4 py-1">
              <div className="relative w-42 appearance-none label-floating">
                <input
                  onChange={(e) => {
                    setOldUserName(e.target.value);
                  }}
                  className="tracking-wide py-2 px-4 mb-3 leading-relaxed appearance-none block w-full bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                  name="username"
                  type="text"
                  placeholder="Enter Old username"
                />
              </div>
            </div>
            <div className="flex flex-wrap px-4 py-1">
              <div className="relative w-42 appearance-none label-floating">
                <input
                  onChange={(e) => {
                    setNewUserName(e.target.value);
                  }}
                  className="tracking-wide py-2 px-4 mb-3 leading-relaxed appearance-none block w-full bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                  name="username"
                  type="text"
                  placeholder="Enter New username"
                />
              </div>
            </div>

            <div className="flex flex-wrap px-4 py-1">
              <div className="relative w-42 appearance-none label-floating">
                <input
                  onChange={(e) => {
                    setNewPass(e.target.value);
                  }}
                  className="tracking-wide py-2 px-4 mb-3 leading-relaxed appearance-none block w-full bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                  name="username"
                  type="text"
                  placeholder="New Password"
                />
              </div>
            </div>

            <div className="flex justify-center items-center ">
              <button
                type="submit"
                onClick={sendData}
                className="bg-purple-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
              >
                Update
              </button>

              <button
                onClick={() => {
                  openProfileModal(false);
                }}
                className="bg-red-400 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute right-0 bg-violet-600 shadow-lg shadow-violet-50 m-2 p-6 w-1/6 rounded-md border border-gray-100">
        <p className="text-white"> Username: <span className="font-bold">{props.uname}</span></p>
        <span className="text-white">Update Userdetail</span>
        <button
          onClick={() => openProfileModal(true)}
          className=" p-2 bg-gray-50 border ml-2 rounded-full hover:border-purple-500 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-3 h-3 text-red-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </button>
        <Link to="/">
        <button className="bg-white px-3 py-1 mt-2 rounded-full text-red-500 font-bold text-sm" >
          logout
        </button>
        </Link> 
      </div>
    </>
  );
}

export default SideNav;
