import React from "react";

function SideDash(props) {
  return (
    <div className="my-5 mx-2">
      <div className="h-full main-container w-72  flex flex-col  items-center justify-start">
        <div className="bg-white w-full shadow-sm border rounded-lg ">
          <h2 className="text-purple-600 text-center py-2  ">{props.head}</h2>
        </div>
        {/* BOX 01 */}
        <div className="bg-white w-full shadow-sm border rounded-lg mt-6 flex flex-col justify-center items-center ">
          <p className="w-full bg-pink-100 text-pink-800 text-center py-3 shadow-sm border rounded-lg  ">
            Total number of complaints
          </p>
          <span className=" text-pink-600 font-bold text-[50px] ">
            {props.numOfComplaints}
          </span>
        </div>
        {/* BOX 02 */}

        <div className="bg-white w-full shadow-sm border rounded-lg mt-6 flex flex-col justify-center items-center ">
          <p className="w-full bg-green-100 text-green-800 text-center py-3 shadow-sm border rounded-lg ">
            complaints Forwarded
          </p>
          <span className="font-bold text-green-600 text-[50px] ">
            {props.complaintsFwded}
          </span>
        </div>
        {/* BOX 03 */}

        <div className="bg-white w-full shadow-sm border rounded-lg mt-6 flex flex-col justify-center items-center ">
          <p className="w-full bg-blue-100 text-blue-800 text-center py-3 shadow-sm border rounded-lg ">
            Pending Complaints
          </p>
          <span className=" text-blue-600 text-[50px] font-bold ">0</span>
        </div>
        {/* <button
          onClick={() => alert(props.data)}
          className="bg-red-200 px-3 rounded-full mt-2"
        >
          Sort By Time
        </button> */}
      </div>
    </div>
  );
}

export default SideDash;
