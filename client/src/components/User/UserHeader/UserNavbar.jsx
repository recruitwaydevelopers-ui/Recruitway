import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../../../context/auth-context';
import { Link, useNavigate } from 'react-router-dom';
import Notification from '../../Notification';

const UserNavbar = () => {

    const { user, logout } = useAuthContext();
    const [showModal, setShowModal] = useState(false);

    return (
        <header className="app-header bg-white">
            <nav className="navbar navbar-expand-lg navbar-light px-1 px-md-1 px-lg-5">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <button className="nav-link sidebartoggler nav-icon-hover ms-n3 bg-white border-0" id="headerCollapse" >
                            <i className="ti ti-menu-2"></i>
                        </button>
                    </li>
                    <li className="nav-item d-none d-lg-block">
                        <a
                            className="nav-link nav-icon-hover"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowModal(true);
                            }}
                        >
                            <i className="ti ti-search"></i>
                        </a>
                    </li>
                </ul>
                <div className="d-block d-lg-none">
                    <img src="/images/logos/logo.png" className="light-logo" width="160" alt="" />
                </div>
                <button className="navbar-toggler p-0 border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="p-2">
                        <i className="ti ti-dots fs-7"></i>
                    </span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <div className="d-flex align-items-center justify-content-between">
                        <a
                            className="nav-link nav-icon-hover d-lg-none"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowModal(true);
                            }}
                        >
                            <i className="ti ti-search fs-7"></i>
                        </a>

                        <ul className="navbar-nav flex-row ms-auto align-items-center gap-4 justify-content-center">
                            <Notification />
                            <ProfileDropdown user={user} logout={logout} />
                        </ul>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div
                        className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" >
                        <div className="modal-dialog modal-md">
                            <div className="modal-content rounded-3 shadow-lg">
                                <div className="modal-header border-0 px-3 pt-3">
                                    <h5 className="modal-title fw-semibold">Search</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body px-3 pb-3">
                                    <div className="input-group input-group-md">
                                        <input
                                            type="search"
                                            className="form-control rounded-start"
                                            placeholder="Type your query..."
                                            id="search"
                                        />
                                        <button className="btn btn-primary rounded-end px-4">
                                            <i className="bi bi-search me-2"></i>Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

const ProfileDropdown = ({ user, logout }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDropdown(!showDropdown);
    };

    // Close dropdown when clicking outside or on mobile when touching outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    // Close dropdown when scrolling on mobile
    useEffect(() => {
        const handleScroll = () => {
            if (showDropdown) {
                setShowDropdown(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [showDropdown]);

    return (
        <li className="nav-item dropdown position-relative" ref={dropdownRef}>
            <button
                ref={buttonRef}
                className="nav-link pe-0 bg-transparent border-0 p-0"
                onClick={handleClick}
                aria-expanded={showDropdown}
                aria-haspopup="true"
                aria-label="Profile menu"
            >
                <div className="d-flex align-items-center">
                    <div className="user-profile-img">
                        <img
                            src={user?.profilePicture || "/images/profile/user-1.jpg"}
                            className="rounded-circle"
                            width="35"
                            height="35"
                            alt="Profile"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNMTIgMkM2LjQ3NyAyIDIgNi40NzcgMiAxMnM0LjQ3NyAxMCAxMCAxMCAxMC00LjQ3NyAxMC0xMFMxNy41MjMgMiAxMiAyem0wIDJhOCA4IDAgMTExLjY5NyAxNS4xMDhMMTIgMTMuNWwtMS42OTcgMS42MDhBOCA4IDAgMDExMiA0eiIvPjwvc3ZnPg==';
                            }}
                        />
                    </div>
                </div>
            </button>

            {showDropdown && (
                <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up show bg-light-primary"
                    style={{
                        position: 'fixed',
                        right: '1rem',
                        top: '4.5rem',
                        zIndex: 1050,
                        minWidth: '280px',
                        maxWidth: 'calc(100vw - 2rem)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                        maxHeight: 'calc(100vh - 6rem)',
                        overflow: 'hidden'
                    }}
                    aria-labelledby="profileDropdown"
                >
                    <div className="profile-dropdown position-relative" data-simplebar style={{ maxHeight: 'calc(100vh - 8rem)' }}>
                        <div className="py-3 px-3 px-md-4 pb-0">
                            <h5 className="mb-0 fs-5 fw-semibold text-capitalize text-truncate">
                                {user?.role || 'Candidate'} Profile
                            </h5>
                        </div>
                        <div className="d-flex align-items-center py-4 px-3 px-md-4 border-bottom">
                            <img
                                src={user?.profilePicture || "/images/profile/user-1.jpg"}
                                className="rounded-circle flex-shrink-0"
                                width="60"
                                height="60"
                                alt="Profile"
                                loading="lazy"
                                style={{ objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNMTIgMkM2LjQ3NyAyIDIgNi40NzcgMiAxMnM0LjQ3NyAxMCAxMCAxMCAxMC00LjQ3NyAxMC0xMFMxNy41MjMgMiAxMiAyem0wIDJhOCA4IDAgMTExLjY5NyAxNS4xMDhMMTIgMTMuNWwtMS42OTcgMS42MDhBOCA4IDAgMDExMiA0eiIvPjwvc3ZnPg==';
                                }}
                            />
                            <div className="ms-3 flex-grow-1" style={{ minWidth: 0 }}>
                                <h5 className="mb-1 fs-5 text-capitalize text-truncate">
                                    {user?.fullname || "Candidate Name"}
                                </h5>
                                <span className="mb-1 d-block text-dark text-capitalize text-truncate">
                                    {user?.role || "Candidate"}
                                </span>
                                <p className="mb-0 d-flex text-dark align-items-center gap-1 text-truncate">
                                    <i className="ti ti-mail fs-4 flex-shrink-0"></i>
                                    <span className="text-truncate">
                                        {user?.email || "Please Complete Your Profile"}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="message-body">
                            <Link
                                to="/user/profile"
                                className="py-3 px-3 px-md-4 d-flex align-items-center dropdown-item"
                                onClick={() => setShowDropdown(false)}
                            >
                                <span className="d-flex align-items-center justify-content-center bg-white rounded-1 p-2 flex-shrink-0">
                                    <img
                                        src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/svgs/icon-account.svg"
                                        alt="Profile"
                                        width="20"
                                        height="20"
                                        loading="lazy"
                                    />
                                </span>
                                <div className="ms-3" style={{ minWidth: 0 }}>
                                    <h6 className="mb-0 fw-semibold text-truncate">My Profile</h6>
                                    <small className="d-block text-muted text-truncate">Account Settings</small>
                                </div>
                            </Link>
                            {/* <Link
                                to={user?.role === 'company' ? '/company/inbox' :
                                    user?.role === 'interviewer' ? '/interviewer/inbox' :
                                        '/superadmin/inbox'}
                                className="py-3 px-3 px-md-4 d-flex align-items-center dropdown-item"
                                onClick={() => setShowDropdown(false)}
                            >
                                <span className="d-flex align-items-center justify-content-center bg-white rounded-1 p-2 flex-shrink-0">
                                    <img
                                        src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/svgs/icon-inbox.svg"
                                        alt="Inbox"
                                        width="20"
                                        height="20"
                                        loading="lazy"
                                    />
                                </span>
                                <div className="ms-3" style={{ minWidth: 0 }}>
                                    <h6 className="mb-0 fw-semibold text-truncate">My Inbox</h6>
                                    <small className="d-block text-muted text-truncate">Messages & Emails</small>
                                </div>
                            </Link> */}
                        </div>
                        <div className="d-grid py-3 px-3 px-md-4 pt-4">
                            <button
                                onClick={() => {
                                    logout();
                                    setShowDropdown(false);
                                    navigate("/login");
                                }}
                                className="btn btn-outline-primary w-100 py-2"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
};

export default UserNavbar;