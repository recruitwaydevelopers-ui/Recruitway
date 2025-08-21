import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../../../context/auth-context';
import { Link, useNavigate } from 'react-router-dom';

const notifications = [
    { id: 1, img: '/images/profile/user-1.jpg', name: 'Roman Joined', message: '1 min ago' },
    { id: 2, img: '/images/profile/user-2.jpg', name: 'New message received', message: '5 min ago' },
    { id: 3, img: '/images/profile/user-3.jpg', name: 'New payment received', message: '23 min ago' },
    { id: 4, img: '/images/profile/user-4.jpg', name: 'Jolly completed tasks', message: '1 hour ago' },
    { id: 5, img: '/images/profile/user-5.jpg', name: 'Roman Joined', message: '1 day ago' },
];

const SuperAdminNavbar = () => {

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
                            <NotificationsDropdown notifications={notifications} />
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

const NotificationsDropdown = ({ notifications = [] }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

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

        // Add both mouse and touch events for better mobile support
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
                className="nav-link nav-icon-hover bg-transparent border-0 p-0"
                onClick={handleClick}
                aria-expanded={showDropdown}
                aria-haspopup="true"
                aria-label="Notifications"
            >
                <i className="ti ti-bell-ringing"></i>
                {notifications.length > 0 && (
                    <div className="notification bg-primary rounded-circle"></div>
                )}
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
                        overflow: 'hidden',
                        transform: 'translateY(0)'
                    }}
                    aria-labelledby="notificationsDropdown"
                >
                    <div className="d-flex align-items-center justify-content-between py-3 px-3 px-md-4">
                        <h5 className="mb-0 fs-5 fw-semibold">Notifications</h5>
                        {notifications.length > 0 && (
                            <span className="badge bg-primary rounded-4 px-3 py-1 lh-sm">
                                {notifications.length} new
                            </span>
                        )}
                    </div>
                    <div className="message-body" data-simplebar style={{ maxHeight: 'calc(100vh - 12rem)' }}>
                        {notifications.length > 0 ? (
                            notifications.map((item) => (
                                <button
                                    key={item.id}
                                    className="w-100 py-3 px-3 px-md-4 d-flex align-items-center dropdown-item bg-transparent border-0"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowDropdown(false);
                                        // Handle notification click here if needed
                                    }}
                                >
                                    <span className="me-3 flex-shrink-0">
                                        <img
                                            src={item.img}
                                            alt={item.name || 'Notification'}
                                            className="rounded-circle"
                                            width="40"
                                            height="40"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNMTIgMkM2LjQ3NyAyIDIgNi40NzcgMiAxMnM0LjQ3NyAxMCAxMCAxMCAxMC00LjQ3NyAxMC0xMFMxNy41MjMgMiAxMiAyem0wIDJhOCA4IDAgMTExLjY5NyAxNS4xMDhMMTIgMTMuNWwtMS42OTcgMS42MDhBOCA4IDAgMDExMiA0eiIvPjwvc3ZnPg==';
                                            }}
                                        />
                                    </span>
                                    <div className="text-start flex-grow-1 overflow-hidden">
                                        <h6 className="mb-1 fw-semibold text-truncate">{item.name}</h6>
                                        <p className="mb-0 small text-truncate">{item.message}</p>
                                        {item.time && (
                                            <small className="text-muted">{item.time}</small>
                                        )}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="py-4 px-3 px-md-4 text-center">
                                <p className="mb-0 text-muted">No new notifications</p>
                            </div>
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <div className="py-3 px-3 px-md-4 mb-1">
                            <button
                                className="btn btn-outline-primary w-100 py-2"
                                onClick={() => setShowDropdown(false)}
                            >
                                See All Notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </li>
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
                                {user?.role || 'Super Admin'} Profile
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
                                    {user?.fullname || "RecruitWay"}
                                </h5>
                                <span className="mb-1 d-block text-dark text-capitalize text-truncate">
                                    {user?.role || "Super Admin"}
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
                            to="/superadmin/profile"
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
                            <Link
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
                            </Link>
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

export default SuperAdminNavbar;