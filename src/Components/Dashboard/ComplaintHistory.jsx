import React, { useState, useEffect } from "react";

function ComplaintHistory() {
  
  const [HistoryModal, openHistoryModal] = useState(false);
  const [recordModal, openRecordModal] = useState(false);
  const [History, setHistory] = useState([]);

  const [complaintID, setComplaintID] = useState();
  const [status, setStatus] = useState();
  const [comments, setComments] = useState();
  const [feedback, openfeedback] = useState(false);

  var newUserData = {
    complaintID: complaintID,
    studentSatisfaction: status,
    studentFeedback: comments,
  };

  var sendData = (e) => {


    fetch("http://localhost:8000/studentFeedback", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData),
    }).then((res) => {
      console.log(res);
    });

    alert("Feedback Added");
  };

  function fetchFun() {

    fetch("http://localhost:8000/history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.reverse());
      });
  }


  return (
    <div>
      <>
        {/* component */}
        <section className="text-gray-600 body-font  h-screen  ">
          {/* History component */}
          {HistoryModal && (
            <div className="z-10 bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
              <div className="bg-white py-4 w-4/5  rounded-md text-center">
                {/* TABLE */}
                <div className="h-[60vh]  overflow-scroll rounded-lg border border-gray-600 shadow-sm m-5">
                  <table className="w-full  border-collapse bg-white text-left text-sm text-gray-500">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900"
                        >
                          SrNo
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900"
                        >
                          Name
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900"
                        >
                          DOA
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900"
                        >
                          Token Number
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900"
                        >
                          Incharge name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900"
                        >
                          Branch of Complaint
                        </th>
                       
                        
                      </tr>
                    </thead>
                    {History.map((itr, index) => {
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 border px-2 py-1 text-xs font-semibold text-gray-800">
                              {index + 1}
                            </span>
                          </td>
                          <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                            <div className="text-sm">
                              <div className="font-medium text-gray-700">
                                {itr.username}
                              </div>
                              <div className="text-gray-400">
                                UID : {itr.uid}{" "}
                              </div>
                            </div>
                          </th>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600">
                                {itr.date}
                              </span>
                            </div>
                          </td>
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
                         
                        </tr>
                      );
                    })}

                    <tbody className="divide-y divide-gray-100 border-t border-gray-100"></tbody>
                  </table>
                </div>

                <button
                  onClick={() => {
                    fetchFun();
                    openHistoryModal(false);
                  }}
                  className="bg-pink-400 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {feedback && (
            <div className="z-100 bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
              <div className="bg-white py-4 w-2/4  rounded-md text-center flex flex-col justify-center items-center">
                <div className="mb-4">Give your Feedback</div>

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
                      name="studentSatisfaction"
                      type="text"
                      placeholder="Enter Satisfied OR Not"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap px-4 py-1 w-full">
                  <div className="relative w-42 appearance-none label-floating w-full">
                    <textarea
                      onChange={(e) => {
                        setComments(e.target.value);
                      }}
                      className="tracking-wide py-2 px-4 mb-3 leading-relaxed appearance-none block w-full bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                      name="studentFeedback"
                      type="text"
                      placeholder="Enter Your Feedback"
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
                      openfeedback(false);
                
                      openRecordModal(true);
                    }}
                    className="bg-red-400 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {recordModal && (
            <div className="z-10 bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
              <div className="bg-white py-4 w-4/5  rounded-md text-center">
                {/* TABLE */}
                <div className="h-[60vh]  overflow-scroll rounded-lg border border-gray-600 shadow-sm m-5">
                  <table className="w-full  border-collapse bg-white text-left text-sm text-gray-500">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900"
                        >
                          SrNo
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900"
                        >
                          Token Number
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900"
                        >
                          Comments
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900"
                        >
                          Feedback
                        </th>
                      </tr>
                    </thead>
                    {History.map((itr, index) => {
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 border px-2 py-1 text-xs font-semibold text-gray-800">
                              {index + 1}
                            </span>
                          </td>
                          <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                            <div className="text-sm">
                              <div className="font-medium text-gray-700">
                                {itr.username}
                              </div>
                              <div className="text-gray-400">
                                UID : {itr.uid}{" "}
                              </div>
                            </div>
                          </th>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                              {itr._id}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {itr.status ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                                  {itr.status}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-600">
                                  Waiting..
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-[250px]">
                            {itr.comments ? (
                              itr.comments
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-600">
                                Waiting..
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 max-w-[250px]">
                            <button
                              onClick={() => {
                                openfeedback(true);
                                openRecordModal(false);
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
                          </td>
                        </tr>
                      );
                    })}

                    <tbody className="divide-y divide-gray-100 border-t border-gray-100"></tbody>
                  </table>
                </div>

                <button
                  onClick={() => {
                    openRecordModal(false);
                  }}
                  className="bg-violet-400 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="container  p-4 mx-auto">
            <div className="flex flex-wrap justify-start  text-center  h-screen">
              <div className="p-4 sm:w-1/2 lg:w-1/3 w-full hover:scale-105 duration-500"></div>
              <div className="p-2 sm:w-1/2 lg:w-3/4 w-full hover:scale-105 duration-500 ">
                
                {/* card 1 */}
                <div className=" w-3/4 flex items-center  justify-between p-4 h-54 rounded-lg bg-white shadow-indigo-50 shadow-md border-2 border-gray-200">
                  <div>
                    <h2 className="text-gray-900 text-lg font-bold">Status</h2>
                    {/* <h3 className="mt-2 text-xl font-bold text-violet-500 text-left">
                      No Record
                    </h3> */}

                    <button
                      onClick={() => {
                        fetchFun();
                        openRecordModal(true);
                      }}
                      className="text-sm mt-6 px-4 py-2 bg-violet-400  text-white rounded-lg  tracking-wider hover:bg-violet-500 outline-none"
                    >
                      View Last
                    </button>
                  </div>
                  <div className=" w-24 lg:w-32 h-24 lg:h-32  rounded-full shadow-2xl shadow-violet-400 border-white  border-dashed border-2  flex justify-center items-center ">
                    <div>
                    <img className="rounded-full" src="https://static.vecteezy.com/system/resources/previews/010/871/629/original/3d-clock-icon-png.png"></img>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 sm:w-1/2 lg:w-3/4 w-full hover:scale-105 duration-500">
                {/* card 2 */}
                <div className=" w-3/4 flex items-center  justify-between p-4  rounded-lg bg-white shadow-indigo-50 shadow-md border-2 border-gray-200">
                  <div>
                    <h2 className="text-gray-900 text-lg font-bold">
                      Track History
                    </h2>
                    {/* <h3 className="mt-2 text-xl font-bold text-pink-500 text-centre">
                      No History
                    </h3> */}

                    <button
                      onClick={() => {
                        fetchFun();
                        openHistoryModal(true);
                      }}
                      className="text-sm mt-6 px-4 py-2 bg-pink-400  text-white rounded-lg  tracking-wider hover:bg-pink-500 outline-none"
                    >
                      View Last
                    </button>
                  </div>
                  <div className=" w-24 lg:w-32 h-24 lg:h-32  rounded-full shadow-2xl shadow-violet-400 border-white  border-dashed border-2  flex justify-center items-center ">
                    <div>
                      <img className="rounded-full" src="https://assets.materialup.com/uploads/71b2296a-899a-4585-baba-cfe3578bf76c/preview.png"></img>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 sm:w-1/2 lg:w-3/4 w-full hover:scale-105 duration-500"></div>
            </div>
          </div>
        </section>
      </>
    </div>
  );
}

export default ComplaintHistory;
