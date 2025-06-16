import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/trlogo.png"; // Import logo if using src/assets

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
      <img
            src={logo} // If using src/assets
            alt="Logo"
            width="100"
            height="auto"
            className="d-inline-block align-top me-2"
          />
        <Navbar.Brand as={Link} to="/">  
        Beneficiary Management Ecosystem <br/>Govt. of Tripura</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
