import React from "react";
import { useState } from "react";

function AddcomplaintsModal(props) {

  const current = new Date().toLocaleString();
  const date_time_arr = current.split(", ");
 
  // console.log(date_time_arr);
  const [data, setData] = useState({
    username: "",
    uid: "",
    p_incharge: "",
    branch: "",
    complaint: "",
    date:date_time_arr[0],
    time:date_time_arr[1]
  });

  const addData = (e) => {
    setData(() => ({
      ...data,
      [e.target.name]: e.target.value,
      [e.target.name]: e.target.value,
      [e.target.name]: e.target.value,
      [e.target.name]: e.target.value,
      [e.target.name]: e.target.value,
    }));
  };

  function sendData(e) {
    e.preventDefault();
    // console.log(formData);

    fetch("http://localhost:8000/complaints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      console.log(res);
      console.log(data);
    });

    alert("Token create sucessfully!");
  }

  return (
    <div className="w-full mx-16">
      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <form
          onSubmit={sendData}
          id="contact-me"
          className="w-screen lg:w-full mx-auto max-w-3xl bg-white shadow p-8 text-gray-700 "
        >
          <h6 className="w-full my-3 text-md font-bold leading-tight ">
            Fill Details to create complaint   <span className="  px-2 bg-gray-700 text-white rounded-xl ">  token 🎫 </span>  
          </h6>
          {/* name field */}
          <div className="flex flex-wrap mb-2">
            <div className="relative w-full appearance-none label-floating">
              <input
                className=" text-sm tracking-wide py-2 px-4 mb-3 leading-relaxed appearance-none block w-full bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                name="username"
                type="text"
                placeholder="Your username"
                onChange={addData}
                required
              />
            </div>
          </div>
          {/* UID field */}
          <div className="flex flex-wrap mb-6">
            <div className="relative w-full appearance-none label-floating">
              <input
                className=" text-sm tracking-wide py-2 px-4 mb-1 leading-relaxed appearance-none block w-full bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                name="uid"
                type="text"
                placeholder="UID Number"
                onChange={addData}
                required
              />
            </div>
          </div>
          {/* Person Incharge */}
          <div className="flex flex-wrap mb-6">
            <div className="relative w-full appearance-none label-floating">
              <input
                className="   text-sm tracking-wide py-2 px-4 mb-1 leading-relaxed appearance-none block w-full bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                name="p_incharge"
                type="text"
                placeholder="Name of the Person Incharge"
                onChange={addData}
                required
              />
            </div>
          </div>
          {/* select */}
          <div className="  inline-block relative w-full">
            <select
              className="block mb-6 appearance-none w-full bg-gray-50 border border-gray-400 hover:border-gray-500 px-4 py-3 pr-8 rounded  leading-tight focus:outline-none focus:shadow-outline "
              name="branch"
              onChange={addData}
              required
            >
              <option className=" text-sm text-gray-700"> <span className="text-sm">Select complaint Branch </span> </option>
              <option className="text-sm">Academic</option>
              <option className="text-sm">Library</option>
              <option className="text-sm">Canteen</option>
              <option className="text-sm">Other</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {/* complaint field */}
          <div className="flex flex-wrap mb-6">
            <div className="relative w-full appearance-none label-floating">
              <textarea
                className="autoexpand  text-sm tracking-wide py-2 px-4 mb-3 leading-relaxed appearance-none block w-full bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                name="complaint"
                type="text"
                placeholder="Write your complaint here..."
                onChange={addData}
                required
              />
            </div>
          </div>
          <div className="">
            <button
              className="w-full shadow bg-violet-400 hover:bg-violet-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Create token
            </button>
          </div>
        </form>

        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"></div>
      </div>
    </div>
  );
}

export default AddcomplaintsModal;
