import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="QuickBite Logo" className="footer-logo" />
          <p className="footer-description">
            QuickBite is a trusted food delivery brand, bringing your favorite meals right to your doorstep. 
            Experience fast, reliable, and delicious service with every order!
          </p>
          <div className="footer-social-icons">
            <a href="#"><img src={assets.facebook_icon} alt="Facebook" /></a>
            <a href="#"><img src={assets.twitter_icon} alt="Twitter" /></a>
            <a href="#"><img src={assets.linkedin_icon} alt="LinkedIn" /></a>
           
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
            
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li><i className="fas fa-phone"></i> +91 1234567890</li>
            <li><i className="fas fa-envelope"></i> contact@quickbite.com</li>
            <li><i className="fas fa-map-marker-alt"></i> 123 Food Street, Mumbai, India</li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="footer-bottom">
        <p>Made with <span className="heart">❤</span> by Aman Kheria</p>
        <p className="footer-copyright">Copyright 2024 © Quickbite.com - All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;