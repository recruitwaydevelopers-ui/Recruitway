import React from "react";

const InterviewHeader = () => {
    return (
        <header className="bg-white border-bottom shadow-sm">
            <div className="container-fluid px-4 py-2 d-flex justify-content-between align-items-center">
                {/* Left: Logo / Brand */}
                <h1 className="h5 mb-0 text-primary">AI Interview Platform</h1>

                {/* Right: Notification and User Dropdown */}
                <div className="d-flex align-items-center gap-3">
                    {/* Notification Bell */}
                    <div className="position-relative">
                        <button className="btn btn-link position-relative p-0 border-0">
                            <span className="visually-hidden">Notifications</span>
                            <i className="bi bi-bell fs-5 text-dark"></i>
                            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                <span className="visually-hidden">New alerts</span>
                            </span>
                        </button>
                    </div>

                    {/* User Dropdown */}
                    <div className="dropdown">
                        <button
                            className="btn d-flex align-items-center"
                            type="button"
                            id="userDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img
                                src="https://i.pravatar.cc/150?img=10"
                                alt="User profile"
                                className="rounded-circle me-2"
                                width="32"
                                height="32"
                            />
                            <span className="me-1">Recruiter</span>
                            <i className="bi bi-caret-down-fill"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li><button className="dropdown-item">Profile</button></li>
                            <li><button className="dropdown-item">Settings</button></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item">Logout</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default InterviewHeader;
