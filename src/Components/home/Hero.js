import React  from 'react';
import Container from "react-bootstrap/Container";
import hero from "../../Assets/images/hero-img.png";
import About from "./About";

import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import Footer from './Footer';

function Hero() {
  return (
    <div>
      <Navbar></Navbar>
      

      <Container className="main_container">
        <section className="text-gray-600 body-font">
          <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
              <img
                className="object-cover object-center rounded "
                alt="hero"
                src="https://cdn3d.iconscout.com/3d/premium/thumb/online-technical-service-7666467-6220943.png?f=webp"
              />
            </div>
            <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-left">
              <h1 className="title-font font-bold  text-[2.2rem]  mb-4  text-gray-900">
                GRIEVANCE Resolver
              </h1>
              <p className="mb-8 leading-relaxed">
               A <span className='font-bold'>token based</span> online platform to receive and act on
                complaints reported by students of Universities, enabling prompt
                actions on any issue raised by them.
              </p>
              <div className="flex flex-col justify-center  lg:flex-row">
                <Link to="register">
                  <button className=" inline-flex text-white bg-[#8338ec] border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                    Register
                  </button>
                </Link>
                <Link to="login">
                  <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
                    LOGIN
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Container>
      <About></About>
      <Footer></Footer>
    </div>
  );
}

export default Hero;
