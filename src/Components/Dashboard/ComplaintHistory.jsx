import React, { useState } from "react";

function ComplaintHistory() {
  const [HistoryModal, openHistoryModal] = useState(false);

  const [recordModal, openRecordModal] = useState(false);

  const [History, setHistory] = useState([]);

  const [complaintID, setComplaintID] = useState("");

  const [status, setStatus] = useState("");

  const [comments, setComments] = useState("");

  const [feedback, openfeedback] = useState(false);

  // =====================================================
  // FETCH STUDENT HISTORY
  // =====================================================

  const fetchFun = async () => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        alert("Your session has expired. Please login again.");

        return;
      }

      const response = await fetch("http://localhost:8000/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to fetch complaint history.");
      }

      // ------------------------------------------------
      // Backend currently returns:
      //
      // {
      //   success: true,
      //   data: [...]
      // }
      //
      // Also support a direct array just in case.
      // ------------------------------------------------

      let historyData = [];

      if (Array.isArray(result)) {
        historyData = result;
      } else if (result && Array.isArray(result.data)) {
        historyData = result.data;
      } else if (result && Array.isArray(result.complaints)) {
        historyData = result.complaints;
      }

      // Don't mutate the original API array.
      setHistory([...historyData].reverse());
    } catch (error) {
      console.error("History error:", error);

      setHistory([]);

      alert(error.message || "Unable to load complaint history.");
    }
  };

  // =====================================================
  // FEEDBACK
  // =====================================================

  const sendData = async () => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        alert("Your session has expired. Please login again.");

        return;
      }

      if (!complaintID.trim()) {
        alert("Please enter the complaint ID.");

        return;
      }

      const newUserData = {
        complaintID: complaintID.trim(),

        studentSatisfaction: status,

        studentFeedback: comments.trim(),
      };

      const response = await fetch("http://localhost:8000/studentFeedback", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(newUserData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to add feedback.");
      }

      alert("Feedback added successfully.");

      openfeedback(false);

      openRecordModal(true);

      setComplaintID("");

      setStatus("");

      setComments("");

      // Refresh history
      await fetchFun();
    } catch (error) {
      console.error("Feedback error:", error);

      alert(error.message || "Unable to add feedback.");
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>
      <section className="text-gray-600 body-font h-screen">
        {/* =================================================
            TRACK HISTORY MODAL
        ================================================= */}

        {HistoryModal && (
          <div className="z-10 bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            <div className="bg-white py-4 w-4/5 rounded-md text-center">
              <div className="h-[60vh] overflow-scroll rounded-lg border border-gray-600 shadow-sm m-5">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        SrNo
                      </th>

                      <th className="px-6 py-4 font-medium text-gray-900">
                        Name
                      </th>

                      <th className="px-6 py-4 font-medium text-gray-900">
                        DOA
                      </th>

                      <th className="px-6 py-4 font-medium text-gray-900">
                        Token Number
                      </th>

                      <th className="px-6 py-4 font-medium text-gray-900">
                        Incharge name
                      </th>

                      <th className="px-6 py-4 font-medium text-gray-900">
                        Branch of Complaint
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {History.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-10 text-gray-500"
                        >
                          No complaint history found.
                        </td>
                      </tr>
                    ) : (
                      History.map((itr, index) => (
                        <tr key={itr._id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 border px-2 py-1 text-xs font-semibold text-gray-800">
                              {index + 1}
                            </span>
                          </td>

                          <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                            <div className="text-sm">
                              <div className="font-medium text-gray-700">
                                {itr.username}
                              </div>

                              <div className="text-gray-400">
                                UID : {itr.uid}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600">
                              {itr.date}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                              {itr._id}
                            </span>
                          </td>

                          <td className="px-6 py-4">{itr.incharge_name}</td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                              {itr.branch}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => openHistoryModal(false)}
                className="bg-pink-400 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            FEEDBACK MODAL
        ================================================= */}

        {feedback && (
          <div className="z-100 bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            <div className="bg-white py-4 w-2/4 rounded-md text-center flex flex-col justify-center items-center">
              <div className="mb-4">Give your Feedback</div>

              <div className="flex flex-wrap px-4 py-1 w-full">
                <input
                  value={complaintID}
                  onChange={(e) => setComplaintID(e.target.value)}
                  className="tracking-wide py-2 px-4 mb-3 leading-relaxed block w-full bg-gray-50 border border-gray-200 rounded"
                  type="text"
                  placeholder="Enter complaint ID"
                />
              </div>

              <div className="flex flex-wrap px-4 py-1 w-full">
                <input
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="tracking-wide py-2 px-4 mb-3 leading-relaxed block w-full bg-gray-50 border border-gray-200 rounded"
                  type="text"
                  placeholder="Enter Satisfied OR Not"
                />
              </div>

              <div className="flex flex-wrap px-4 py-1 w-full">
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="tracking-wide py-2 px-4 mb-3 leading-relaxed block w-full bg-gray-50 border border-gray-200 rounded"
                  placeholder="Enter Your Feedback"
                />
              </div>

              <div className="flex justify-center items-center">
                <button
                  type="button"
                  onClick={sendData}
                  className="bg-green-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
                >
                  Submit
                </button>

                <button
                  type="button"
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

        {/* =================================================
            STATUS / LAST RECORD MODAL
        ================================================= */}

        {recordModal && (
          <div className="z-10 bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            <div className="bg-white py-4 w-4/5 rounded-md text-center">
              <div className="h-[60vh] overflow-scroll rounded-lg border border-gray-600 shadow-sm m-5">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        SrNo
                      </th>

                      <th className="px-6 py-4 font-medium text-gray-900">
                        Name
                      </th>

                      <th className="px-6 py-4 font-medium text-gray-900">
                        Token Number
                      </th>

                      <th className="px-6 py-4 font-medium text-gray-900">
                        Status
                      </th>

                      <th className="px-6 py-4 font-medium text-gray-900">
                        Comments
                      </th>

                      <th className="px-6 py-4 font-medium text-gray-900">
                        Feedback
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {History.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-10 text-gray-500"
                        >
                          No complaints found.
                        </td>
                      </tr>
                    ) : (
                      History.map((itr, index) => (
                        <tr key={itr._id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 border px-2 py-1 text-xs font-semibold text-gray-800">
                              {index + 1}
                            </span>
                          </td>

                          <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                            <div className="text-sm">
                              <div className="font-medium text-gray-700">
                                {itr.username}
                              </div>

                              <div className="text-gray-400">
                                UID : {itr.uid}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                              {itr._id}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            {itr.status ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                                {itr.status}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-600">
                                Waiting..
                              </span>
                            )}
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
                                setComplaintID(itr._id);

                                openfeedback(true);

                                openRecordModal(false);
                              }}
                              className="Forward"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 text-blue-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => openRecordModal(false)}
                className="bg-violet-400 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            DASHBOARD CARDS
        ================================================= */}

        <div className="container p-4 mx-auto">
          <div className="flex flex-wrap justify-start text-center h-screen">
            {/* STATUS */}

            <div className="p-2 sm:w-1/2 lg:w-3/4 w-full">
              <div className="w-3/4 flex items-center justify-between p-4 h-54 rounded-lg bg-white shadow-md border-2 border-gray-200">
                <div>
                  <h2 className="text-gray-900 text-lg font-bold">Status</h2>

                  <button
                    onClick={async () => {
                      await fetchFun();

                      openRecordModal(true);
                    }}
                    className="text-sm mt-6 px-4 py-2 bg-violet-400 text-white rounded-lg tracking-wider hover:bg-violet-500 outline-none"
                  >
                    View Last
                  </button>
                </div>

                <div className="w-24 lg:w-32 h-24 lg:h-32 rounded-full shadow-2xl border-white border-dashed border-2 flex justify-center items-center">
                  <div>
                    <img
                      className="rounded-full"
                      src="https://static.vecteezy.com/system/resources/previews/010/871/629/original/3d-clock-icon-png.png"
                      alt="Status"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* TRACK HISTORY */}

            <div className="p-2 sm:w-1/2 lg:w-3/4 w-full">
              <div className="w-3/4 flex items-center justify-between p-4 rounded-lg bg-white shadow-md border-2 border-gray-200">
                <div>
                  <h2 className="text-gray-900 text-lg font-bold">
                    Track History
                  </h2>

                  <button
                    onClick={async () => {
                      await fetchFun();

                      openHistoryModal(true);
                    }}
                    className="text-sm mt-6 px-4 py-2 bg-pink-400 text-white rounded-lg tracking-wider hover:bg-pink-500 outline-none"
                  >
                    View Last
                  </button>
                </div>

                <div className="w-24 lg:w-32 h-24 lg:h-32 rounded-full shadow-2xl border-white border-dashed border-2 flex justify-center items-center">
                  <div>
                    <img
                      className="rounded-full"
                      src="https://assets.materialup.com/uploads/71b2296a-899a-4585-baba-cfe3578bf76c/preview.png"
                      alt="History"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ComplaintHistory;
