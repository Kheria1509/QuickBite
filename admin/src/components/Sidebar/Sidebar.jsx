import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { assets } from "../../assets/assets";

const Sidebar = () => {
  const location = useLocation();
  
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
    <div className="sidebar">
      <div className="sidebar-options">
        {navItems.map((item) => (
          <Link 
            to={item.path} 
            key={item.id}
            className={`sidebar-option ${location.pathname === item.path ? "active" : ""}`}
          >
            <img src={item.icon} alt={item.name} />
            <p>{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
