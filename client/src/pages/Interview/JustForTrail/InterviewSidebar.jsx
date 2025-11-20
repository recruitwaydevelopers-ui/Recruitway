import React from "react";
import { Link, useLocation } from "react-router-dom";

const InterviewSidebar = () => {
  const {location} = useLocation();

  const isActive = (path) => location === path;

  const navItems = [
    { name: "Dashboard", path: "/", icon: "bi-house" },
    { name: "Upcoming Interviews", path: "/upcoming", icon: "bi-calendar-event" },
    { name: "Candidates", path: "/candidates", icon: "bi-people" },
    { name: "Reports", path: "/reports", icon: "bi-file-earmark-text" },
    { name: "Settings", path: "/settings", icon: "bi-gear" },
  ];

  return (
    <aside className="d-none d-lg-block bg-dark text-white vh-100" style={{ width: "250px" }}>
      <div className="p-3">
        <h4 className="text-white mb-4">Menu</h4>
        <ul className="nav nav-pills flex-column">
          {navItems.map((item) => (
            <li className="nav-item mb-1" key={item.path}>
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center ${
                  isActive(item.path) ? "active bg-primary" : "text-white"
                }`}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default InterviewSidebar;
