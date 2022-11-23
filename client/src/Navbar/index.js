import { useNavigate, useLocation } from "react-router-dom";
import React from "react"

import "./Navbar.css";

const Navbar = () => {

    const currentUrl = useLocation();
    currentUrl.pathname === "/" ? console.log("Home") : console.log("Edit");
    const navigate = useNavigate();

    return (
        <div id = "Navbar">
            <div className={`${currentUrl.pathname === "/" ? "activePage" : ""}`} onClick={() => navigate("/")}><img src="home.png" alt="Home"></img></div>
            <div className={`${currentUrl.pathname.startsWith("/edit") ? "activePage" : ""}`} onClick={() => navigate("/edit")}><img src="edit.png" alt="Edit"></img></div>
            <div></div>
        </div>
    );
}

export default Navbar;