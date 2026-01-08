import React from 'react';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from 'react-router-dom';

function CollapsibleExample() {
  return (
    <Navbar
      style={{ padding: "20px", backgroundColor: "#8338ec" }}
      collapseOnSelect
      expand="lg"
      variant="dark"
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand href="/" className='font-bold border-bottm border-white'>SANKALP</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
          <Link to="/">
            <button className='text-white font-bold mx-2' >Home</button>
          </Link>
          <Link to="register">
            <button className='text-white  mx-2' >Register</button>
          </Link>
          <Link to="login">
            <button className='text-white  mx-2' >Login</button>
          </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;
