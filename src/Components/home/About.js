import React from "react";
import helpinghand from "../helpinghand.jpg";
import Container from "react-bootstrap/esm/Container";

function About() {
  return (
    <div className="bg-gray-100 ">
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col flex-wrap w-full mb-20">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900 pr-10">
                Online Grievance Resolver for Colleges as per AICTE
              </h1>
              <div className="h-1 w-20 bg-purple-500 rounded" />
            </div>

           
           
          </div>
          <div className="flex flex-wrap -m-4">
            <div className="xl:w-1/4  md:w-1/2  p-4">
              <div className="bg-gray-50 shadow-md p-6 rounded-lg">
                <img
                  className="h-40 rounded w-full object-cover object-center mb-6"
                  // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Kmp8_WTSz17tyIP5D0BZPgZrE-82B_-d9g&usqp=CAU"
                  src={helpinghand}
                  alt="content"
                />
                <h3 className="tracking-widest text-purple-500 text-xs font-medium title-font">
                  FEATURE 01
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Helping hand
                </h2>
                <p className="leading-relaxed text-base h-50  ">
                  This module provides helping hand to students and staff by
                  acknowledging and solving their problems. It maintains the
                  healthy environment for stakeholders of the institute.
                </p>
              </div>
            </div>
            <div className="xl:w-1/4 md:w-1/2 p-4">
              <div className="bg-gray-50 shadow-md p-6 rounded-lg">
                <img
                  className="h-40 rounded w-full object-cover object-center mb-6"
                  src="https://gonzobanker.com/wp-content/uploads//5-Steps-to-Mastering-Customer-Complaints.jpeg"
                  alt="content"
                />
                <h3 className="tracking-widest text-purple-500 text-xs font-medium title-font">
                  FEATURE 02
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Receiving complaints
                </h2>
                <p className="leading-relaxed text-base">
                  Admin can always receive verbal complaints but such complaints
                  can be forgotten. We help receiving logging complaints in
                  written and work on them.
                </p>
              </div>
            </div>
            <div className="xl:w-1/4 md:w-1/2 p-4">
              <div className="bg-gray-50 shadow-md p-6 rounded-lg">
                <img
                  className="h-40 rounded w-full object-cover object-center mb-6"
                  src="https://static.vecteezy.com/system/resources/previews/002/326/484/original/thinking-idea-search-business-concept-young-man-or-boy-thought-choose-decide-dilemmas-solve-problems-finding-new-ideas-vector.jpg"
                  alt="content"
                />
                <h3 className="tracking-widest text-purple-500 text-xs font-medium title-font">
                  FEATURE 03
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Maintaining complaints
                </h2>
                <p className="leading-relaxed text-base">
                  Dealing with too many complaints without delay can be a
                  challenging task. we have made our module in a way
                  that complaints can be effortlessly managed.
                </p>
              </div>
            </div>
            <div className="xl:w-1/4 md:w-1/2 p-4">
              <div className="bg-gray-50 shadow-md p-6 rounded-lg">
                <img
                  className="h-40 rounded w-full object-cover object-center mb-6"
                  src="https://www.upwork.com/mc/documents/How-To-Handle-Customer-Service-Complaints.png"
                  alt="content"
                />
                <h3 className="tracking-widest text-purple-500 text-xs font-medium title-font">
                  FEATURE 04
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Solving complaints
                </h2>
                <p className="leading-relaxed text-base h-50">
                  Assigned person can keep track of status of complaints.
                  Complaints judged to be invalid or where
                  it is judged to not warrant further action, can be marked as
                  rejected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
