import React, { useState } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinkClass = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="mb-3"
        expanded={expanded}
      >
        <Container>
          <Navbar.Brand as={Link} to="/dashboard">
            MERN Task Manager
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/dashboard"
                className={navLinkClass("/dashboard")}
                onClick={() => setExpanded(false)}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/agents"
                className={navLinkClass("/agents")}
                onClick={() => setExpanded(false)}
              >
                Agents
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/lists"
                className={navLinkClass("/lists")}
                onClick={() => setExpanded(false)}
              >
                Lists
              </Nav.Link>
            </Nav>
            <Nav>
              {userInfo.name && (
                <Navbar.Text className="me-3">
                  Signed in as:{" "}
                  <span className="text-white">{userInfo.name}</span>
                </Navbar.Text>
              )}
              <Button variant="outline-light" onClick={logoutHandler}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main>{children}</main>
    </>
  );
};

export default Layout;
