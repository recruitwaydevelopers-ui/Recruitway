import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/auth-context";

const IntervieweeWrapper = ({ children }) => {
    const { user, logout } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [showAccessModal, setShowAccessModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setShowAccessModal(true);
        }

        if (user && (!token || user.role !== "interviewee")) {
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
            <main className="d-flex align-items-center justify-content-center"
                style={{
                    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    minHeight: '100vh',
                    backgroundColor: '#f8f9fa'
                }}
            >
                <div className="container my-3 my-md-5 py-3 py-md-5">
                    <div className="row justify-content-center">
                        <div className="col-11 col-sm-10 col-md-8 col-lg-6 text-center">
                            {/* Professional Error Illustration */}
                            <div className="mb-4 mb-md-5">
                                <div className="error-illustration">
                                    <svg
                                        width="100"
                                        height="100"
                                        viewBox="0 0 120 120"
                                        className="mx-auto"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    >
                                        <circle cx="60" cy="60" r="55" fill="#f8f9fa" stroke="#dee2e6" strokeWidth="2" />
                                        <path d="M60 35 L60 65 M60 75 L60 80" stroke="#6c757d" strokeWidth="4" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>

                            <h1 className="display-6 display-md-5 fw-bold mb-3 mb-md-4" style={{ color: "#343a40", letterSpacing: "-0.5px" }}>
                                Access Restricted
                            </h1>
                            <p className="lead mb-4 mb-md-5" style={{ color: "#6c757d", lineHeight: "1.6", fontSize: "1rem" }}>
                                We're unable to process your request at this time. Please try again later or contact support if the problem persists.
                            </p>

                            <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3 mt-4 mt-md-5">
                                <button
                                    className="btn btn-primary px-4 py-2 flex-fill flex-md-grow-0"
                                    style={{
                                        borderRadius: "8px",
                                        fontWeight: "500",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                        minWidth: "120px"
                                    }}
                                    onClick={() => navigate(-1)}
                                >
                                    <i className="bi bi-arrow-left-circle me-1 me-md-2"></i>
                                    <span className="d-none d-md-inline">Go Back</span>
                                    <span className="d-md-none">Back</span>
                                </button>
                                <button
                                    className="btn btn-outline-primary px-4 py-2 flex-fill flex-md-grow-0"
                                    style={{
                                        borderRadius: "8px",
                                        fontWeight: "500",
                                        borderWidth: "1.5px",
                                        minWidth: "120px"
                                    }}
                                    onClick={() => navigate("/")}
                                >
                                    <i className="bi bi-house-door me-1 me-md-2"></i>
                                    <span className="d-none d-md-inline">Home</span>
                                    <span className="d-md-none">Home</span>
                                </button>
                                <button
                                    className="btn btn-outline-secondary px-4 py-2 flex-fill flex-md-grow-0"
                                    style={{
                                        borderRadius: "8px",
                                        fontWeight: "500",
                                        borderWidth: "1.5px",
                                        minWidth: "120px"
                                    }}
                                    onClick={() => window.location.reload()}
                                >
                                    <i className="bi bi-arrow-clockwise me-1 me-md-2"></i>
                                    <span className="d-none d-md-inline">Refresh</span>
                                    <span className="d-md-none">Reload</span>
                                </button>
                            </div>

                            <div className="mt-4 mt-md-5 pt-3 pt-md-4 border-top border-light">
                                <p className="text-muted small mb-0">
                                    Need help? <a href="#" className="text-decoration-none fw-medium">Contact Support</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                .error-illustration {
                    position: relative;
                    display: inline-block;
                }

                .error-illustration svg {
                    animation: pulse 2s infinite ease-in-out;
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.9; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .btn-primary {
                    background-color: #4361ee;
                    border-color: #4361ee;
                    transition: all 0.3s ease;
                }

                .btn-primary:hover {
                    background-color: #3a56d4;
                    border-color: #3a56d4;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(67, 97, 238, 0.3) !important;
                }

                .btn-outline-primary {
                    color: #4361ee;
                    border-color: #4361ee;
                    transition: all 0.3s ease;
                }

                .btn-outline-primary:hover {
                    background-color: #4361ee;
                    color: white;
                    transform: translateY(-2px);
                }

                .btn-outline-secondary {
                    transition: all 0.3s ease;
                }

                .btn-outline-secondary:hover {
                    transform: translateY(-2px);
                }

                /* Mobile-specific adjustments */
                @media (max-width: 576px) {
                    .display-6 {
                        font-size: 1.5rem;
                    }
                    .lead {
                        font-size: 0.95rem;
                    }
                    .btn {
                        padding: 0.5rem 1rem;
                        font-size: 0.875rem;
                    }
                    .container {
                        padding-left: 1rem;
                        padding-right: 1rem;
                    }
                }

                /* Medium devices (tablets) */
                @media (min-width: 577px) and (max-width: 768px) {
                    .display-6 {
                        font-size: 1.75rem;
                    }
                    .lead {
                        font-size: 1.1rem;
                    }
                }

                /* Large devices (desktops) */
                @media (min-width: 769px) {
                    .display-5 {
                        font-size: 2.5rem;
                    }
                    .lead {
                        font-size: 1.25rem;
                    }
                }
            `}</style>
            </main>
        )
    }

    return <>{children}</>;
};

export default IntervieweeWrapper;


