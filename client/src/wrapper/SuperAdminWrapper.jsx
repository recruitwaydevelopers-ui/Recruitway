import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/auth-context";

const SuperAdminWrapper = ({ children }) => {
    const { user, logout } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [showAccessModal, setShowAccessModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setShowAccessModal(true);
        }

        if (user && (!token || user.role !== "superadmin")) {
            setShowAccessModal(true);
        }

        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, [user]);

    const handleLogin = () => {
        if (user) {
            logout();
            navigate("/login");
        } else {
            navigate("/login");
        }
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (showAccessModal) {
        return (
            <div className="modal show d-block bg-light-primary" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Access Restricted</h5>
                        </div>
                        <div className="modal-body">
                            <p>It looks like you're not logged in with a Super Admin account. Please switch accounts or log in to continue.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                                Go Back
                            </button>
                            <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
                                Retry
                            </button>
                            <button className="btn btn-primary" onClick={handleLogin}>
                                Login as Super Admin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default SuperAdminWrapper;




