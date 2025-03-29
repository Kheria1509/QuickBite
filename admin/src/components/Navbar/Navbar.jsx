import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import PropTypes from "prop-types";

const Navbar = ({ toggleMenu }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    toggleMenu(); // Call the parent toggle function
  };
  
  const navItems = [
    {
      id: 1,
      name: "Add Items",
      icon: assets.add_icon,
      path: "/add",
    },
    {
      id: 2,
      name: "List Items",
      icon: assets.order_icon,
      path: "/list",
    },
    {
      id: 3,
      name: "Orders",
      icon: assets.order_icon,
      path: "/orders",
    },
  ];
  
  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <img src={assets.logo} alt="QuickBite Logo" />
          <h1>QuickBite Admin</h1>
        </Link>
      </div>
      
      <div className="navbar-right">
        <div className="profile">
          <img src={assets.profile_image} alt="Admin Profile" />
          <p>Admin</p>
        </div>
        
        <div className="hamburger" onClick={handleMenuToggle}>
          <div className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <Link 
            to={item.path} 
            key={item.id}
            className={`mobile-nav-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src={item.icon} alt={item.name} />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

Navbar.propTypes = {
  toggleMenu: PropTypes.func.isRequired
};

export default Navbar;
