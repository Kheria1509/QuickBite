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
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
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
            <li>+91 1234567890</li>
            <li>amankheria09@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p>Made by Aman Kheria @</p>
      <p className="footer-copyright">Copyright 2024 © Quickbite.com - All Rights Reserved.</p>
    </div>
  );
};

export default Footer;
