import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import formatDateToRelative from "../Helper/dateFormatter";
import axios from "axios";

const Notification = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const [notifications, setNotifications] = useState([]);

    const { socket, user, server, token } = useAuthContext();
    const navigate = useNavigate();

    // Compute unread count dynamically
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const newShow = !showDropdown;
        setShowDropdown(newShow);

        if (newShow && unreadCount > 0) {
            await markAllAsRead();
        }
    };

    // Mark all as read (both UI + API)
    const markAllAsRead = async () => {
        try {
            // Update UI immediately
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

            // Send request to backend to mark all as read
            await axios.patch(`${server}/api/v1/notifications/mark-read`,
                { receiverId: user.userId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (err) {
            console.error("Error marking notifications as read:", err);
        }
    };

    const handleViewAll = () => {
        // navigate("/company/notifications");
        navigate(`/${user?.role}/notifications`);
        setShowDropdown(false);
    };

    // Receive new notifications in real time
    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (notification) => {
            if (notification.receiverId === user?.userId) {
                setNotifications((prev) => [notification, ...prev]);
            }
        };

        socket.on("newNotification", handleNewNotification);
        return () => socket.off("newNotification", handleNewNotification);
    }, [socket, user?.userId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    // Close dropdown when scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (showDropdown) setShowDropdown(false);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [showDropdown]);

    return (
        <li className="nav-item dropdown position-relative" ref={dropdownRef}>
            <button
                ref={buttonRef}
                type="button"
                className="nav-link nav-icon-hover bg-transparent border-0 p-0 position-relative"
                onClick={handleClick}
                aria-expanded={showDropdown}
                aria-haspopup="true"
                aria-label="Notifications"
            >
                <i className="ti ti-bell-ringing fs-7"></i>
                {unreadCount > 0 && (
                    <span className="position-absolute start-100 translate-middle badge rounded-pill bg-primary">
                        {unreadCount > 9 ? "9+" : unreadCount}
                        <span className="visually-hidden">unread notifications</span>
                    </span>
                )}
            </button>

            {showDropdown && (
                <div
                    className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up show bg-light-primary"
                    style={{
                        position: "fixed",
                        right: "1rem",
                        top: "4.5rem",
                        zIndex: 1050,
                        minWidth: "280px",
                        maxWidth: "calc(100vw - 2rem)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                        maxHeight: "calc(100vh - 6rem)",
                        overflow: "hidden",
                        transform: "translateY(0)",
                    }}
                    aria-labelledby="notificationsDropdown"
                >
                    <div className="d-flex align-items-center justify-content-between py-3 px-3 px-md-4">
                        <h5 className="mb-0 fs-5 fw-semibold">Notifications</h5>
                        {unreadCount > 0 && (
                            <span className="badge bg-primary rounded-4 px-3 py-1 lh-sm">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    <div
                        className="message-body"
                        data-simplebar
                        style={{ maxHeight: "calc(100vh - 12rem)", overflowY: "auto" }}
                    >
                        {notifications.length > 0 ? (
                            notifications.map((item) => (
                                <div
                                    key={item._id}
                                    role="button"
                                    tabIndex={0}
                                    className={`dropdown-item p-3 d-flex align-items-start gap-3 ${!item.isRead ? "bg-light-primary" : ""
                                        }`}
                                >
                                    <div
                                        className={`flex-shrink-0 rounded-circle p-2 ${item.isRead ? "bg-light" : "bg-primary bg-opacity-10"
                                            }`}
                                    >
                                        <i
                                            className={`ti ti-bell fs-5 ${item.isRead ? "text-muted" : "text-primary"
                                                }`}
                                        ></i>
                                    </div>

                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start mb-1 gap-2">
                                            <h6
                                                className={`mb-0 fw-semibold ${item.isRead ? "text-muted" : "text-dark"
                                                    } text-truncate`}
                                            >
                                                {item.type === "JOB_APPLY" ? "Job Application" : "Notification"}
                                            </h6>
                                            <small className="text-muted text-nowrap">
                                                {formatDateToRelative(new Date(item.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </small>
                                        </div>
                                        <p
                                            className={`mb-0 ${item.isRead ? "text-muted" : ""} text-wrap`}
                                        >
                                            {item.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-5 px-4">
                                <div className="bg-light rounded-circle p-4 d-inline-flex mb-3">
                                    <i className="ti ti-bell-off fs-4 text-muted"></i>
                                </div>
                                <h6 className="text-muted mb-1">No notifications</h6>
                                <p className="small text-muted mb-0">You're all caught up</p>
                            </div>
                        )}
                    </div>

                    {/* {notifications.length > 0 && ( */}
                    <div className="py-3 px-3 px-md-4 mb-1">
                        <button
                            className="btn btn-outline-primary w-100 py-2"
                            onClick={handleViewAll}
                        >
                            See All Notifications
                        </button>
                    </div>
                    {/* )} */}
                </div>
            )}
        </li>
    );
};

export default Notification
