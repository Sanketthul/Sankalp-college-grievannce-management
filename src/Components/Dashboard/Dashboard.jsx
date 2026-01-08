import React, { useEffect, useState } from "react";
import SideNav from "./SideNav";
import AddcomplaintsModal from "./AddcomplaintsModal";
import ComplaintHistory from "./ComplaintHistory";

function Dahboard() {
  const [username, setUserName] = useState();
  const [passwd, setPasswd] = useState();
  const [userDetail, setUserDetail] = useState(false);

  const currUsername = sessionStorage.getItem("username");

  useEffect(() => {
    fetch("http://localhost:8000/register", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        // setUserName(data.uname);
        // setPasswd(data.pass);
        console.log(data);
      });
  }, []);

  // console.log(username);
  // console.log(passwd);

  return (
  <>
    <div className=" flex justify-end w-full bg-gray-200 h-12">
     
      <p className=" text-sm mx-2 mt-3 font-bold">Welcome, Student</p>
      <button onClick={()=>{setUserDetail(!userDetail)}} className="mr-4 my-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      </button>

    </div>

    {userDetail && (<SideNav uname={currUsername}></SideNav>)}

    


    <div className="flex flex-col lg:flex-row justify-start  ">
    
      <div className="w-screen lg:w-2/4 h-full flex justify-center  ">
        <AddcomplaintsModal></AddcomplaintsModal>
      </div>

      <div className="w-full lg:w-2/4">
        <ComplaintHistory></ComplaintHistory>
      </div>
    </div>
  </>
  );
}

export default Dahboard;
