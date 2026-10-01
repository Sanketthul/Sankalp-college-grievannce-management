import React, { useState } from "react";

function AddcomplaintsModal() {
  const current = new Date().toLocaleString();
  const date_time_arr = current.split(", ");

  const username = sessionStorage.getItem("username") || "";

  const uid = sessionStorage.getItem("uid") || "";

  const [data, setData] = useState({
    p_incharge: "",
    branch: "",
    complaint: "",
    date: date_time_arr[0],
    time: date_time_arr[1],
  });

  const [loading, setLoading] = useState(false);

  const addData = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function sendData(e) {
    e.preventDefault();

    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Your session has expired. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8000/complaints", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Complaint created successfully! 🎫");

        // Clear complaint-specific fields
        setData({
          p_incharge: "",
          branch: "",
          complaint: "",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        });
      } else if (response.status === 401) {
        alert("Your session has expired. Please login again.");
      } else if (response.status === 403) {
        alert(
          result.message || "You do not have permission to create a complaint.",
        );
      } else if (result.errors && Array.isArray(result.errors)) {
        const messages = result.errors.map((error) => error.message).join("\n");

        alert(messages);
      } else {
        alert(result.message || "Unable to create complaint.");
      }
    } catch (error) {
      console.error("Create complaint error:", error);

      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full mx-16">
      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <form
          onSubmit={sendData}
          id="contact-me"
          className="w-screen lg:w-full mx-auto max-w-3xl bg-white shadow p-8 text-gray-700"
        >
          <h6 className="w-full my-3 text-md font-bold leading-tight">
            Fill Details to create complaint
            <span className="px-2 ml-2 bg-gray-700 text-white rounded-xl">
              token 🎫
            </span>
          </h6>

          {/* STUDENT NAME */}

          <div className="flex flex-wrap mb-4">
            <div className="relative w-full">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Student Name
              </label>

              <input
                value={username}
                readOnly
                className="text-sm tracking-wide py-2 px-4 leading-relaxed block w-full bg-gray-100 border border-gray-200 rounded cursor-not-allowed text-gray-600"
                type="text"
              />
            </div>
          </div>

          {/* UID */}

          <div className="flex flex-wrap mb-6">
            <div className="relative w-full">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                UID
              </label>

              <input
                value={uid}
                readOnly
                className="text-sm tracking-wide py-2 px-4 leading-relaxed block w-full bg-gray-100 border border-gray-200 rounded cursor-not-allowed text-gray-600"
                type="text"
              />
            </div>
          </div>

          {/* PERSON INCHARGE */}

          <div className="flex flex-wrap mb-6">
            <div className="relative w-full">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Person Incharge
              </label>

              <input
                className="text-sm tracking-wide py-2 px-4 leading-relaxed block w-full bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                name="p_incharge"
                type="text"
                placeholder="Name of the Person Incharge"
                value={data.p_incharge}
                onChange={addData}
                required
              />
            </div>
          </div>

          {/* BRANCH */}

          <div className="inline-block relative w-full">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Complaint Branch
            </label>

            <select
              className="block mb-6 appearance-none w-full bg-gray-50 border border-gray-400 hover:border-gray-500 px-4 py-3 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
              name="branch"
              value={data.branch}
              onChange={addData}
              required
            >
              <option value="">Select complaint branch</option>

              <option value="Academic">Academic</option>

              <option value="Library">Library</option>

              <option value="Canteen">Canteen</option>

              <option value="Other">Other</option>
            </select>
          </div>

          {/* COMPLAINT */}

          <div className="flex flex-wrap mb-6">
            <div className="relative w-full">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Complaint
              </label>

              <textarea
                className="text-sm tracking-wide py-2 px-4 mb-3 leading-relaxed block w-full bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                name="complaint"
                placeholder="Write your complaint here..."
                value={data.complaint}
                onChange={addData}
                rows="5"
                required
              />
            </div>
          </div>

          {/* BUTTON */}

          <div>
            <button
              className="w-full shadow bg-violet-400 hover:bg-violet-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating token..." : "Create token"}
            </button>
          </div>
        </form>

        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"></div>
      </div>
    </div>
  );
}

export default AddcomplaintsModal;
