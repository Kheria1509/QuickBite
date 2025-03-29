import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import PropTypes from "prop-types";

const Navbar = ({ toggleMenu }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    toggleMenu(); // Call the parent toggle function
  };
  
  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <img src={assets.logo} alt="QuickBite Logo" />
          <h1>QuickBite Admin</h1>
        </div>
        
        <div className="hamburger" onClick={handleMenuToggle}>
          <div className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></div>
        </div>
      </div>
      
      <div className="navbar-right">
        <div className="profile">
          <img src={assets.admin_profile} alt="Admin Profile" />
          <p>Admin</p>
        </div>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  toggleMenu: PropTypes.func.isRequired
};

export default Navbar;
