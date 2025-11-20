import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/auth-context";
import axios from "axios";

// Constants for user types to avoid magic strings
const USER_TYPES = {
    COMPANY: "company",
    CANDIDATE: "user",
    INTERVIEWER: "interviewer",
};

// Custom hook for form handling
const useForm = (initialValues) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    return {
        values,
        errors,
        handleChange,
        setErrors,
    };
};

const JoinUs = () => {
    // State management with descriptive names
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const { server, register, loading } = useAuthContext()
    const navigate = useNavigate()

    // Use custom form hook
    const { values, errors, handleChange, setErrors } = useForm({
        email: "",
        password: "",
    });

    // Check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 992);
        };

        // Initial check
        checkScreenSize();

        // Add event listener
        window.addEventListener('resize', checkScreenSize);

        // Clean up
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Handle user type selection
    const handleJoinNow = (type) => {
        setSelectedUserType(type);
        setShowSignupModal(true);
    };

    // Close modal and reset state
    const handleCloseModal = () => {
        setShowSignupModal(false);
        setSelectedUserType("");
        setIsSubmitting(false);
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!values.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!values.password) {
            newErrors.password = "Password is required";
        } else if (values.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (validateForm()) {

            const userInfo = {
                role: selectedUserType,
                ...values
            }

            try {
                const newpath = await register(userInfo);
                if (newpath) {
                    navigate(`/${newpath}`, { state: { email: userInfo.email } });
                }

            } catch (error) {
                console.error("Error during registration:", error.message);
            }
            finally {
                setIsSubmitting(false);
            }
        } else {
            setIsSubmitting(false);
        }
    };

    const handleLinkedinLogin = async () => {
        try {
            const { data } = await axios.get(`${server}/api/v1/auth/linkedin?role=${selectedUserType}`);
            if (data.authUrl) {
                window.location.href = data.authUrl; // Redirect to LinkedIn
            }
        } catch (err) {
            console.error("Linkedin login error:", err);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { data } = await axios.get(`${server}/api/v1/auth/google?role=${selectedUserType}`);
            if (data.authUrl) {
                window.location.href = data.authUrl; // Redirect to Google
            }
        } catch (err) {
            console.error("Google login error:", err);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading Please Wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 d-flex flex-column bg-gradient-primary">
            {/* Main Content */}
            <main className="container my-auto py-3 py-md-5">
                <div className="text-center mb-4 mb-md-5 px-2">
                    <h1 className="display-5 fw-bold text-dark mb-2 mb-md-3">Join RecruitWay</h1>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: "500px" }}>
                        Choose how you want to join our professional network
                    </p>
                </div>

                <div className="row g-3 g-md-4 justify-content-center px-2 px-md-0">
                    {/* Company Card */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden transition-all hover-transform">
                            <div className="card-body d-flex flex-column align-items-center text-center p-3 p-md-4">
                                <div className="icon-container bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: "70px", height: "70px" }}>
                                    <i className="bi bi-building fs-7 text-primary" aria-hidden="true"></i>
                                </div>
                                <h3 className="card-title h5 mb-2 mb-md-3">Join as Company</h3>
                                <p className="card-text text-muted flex-grow-1 small">
                                    Post jobs, attract talent, and connect with qualified
                                    candidates to find the perfect fit for your team.
                                </p>
                                <button
                                    className="btn btn-primary py-2 fw-medium"
                                    onClick={() => handleJoinNow(USER_TYPES.COMPANY)}
                                    aria-label="Join as Company"
                                >
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Candidate Card */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden transition-all hover-transform">
                            <div className="card-body d-flex flex-column align-items-center text-center p-3 p-md-4">
                                <div className="icon-container bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: "70px", height: "70px" }}>
                                    <i className="bi bi-person-workspace fs-7 text-primary" aria-hidden="true"></i>
                                </div>
                                <h3 className="card-title h5 mb-2 mb-md-3">Join as Candidate</h3>
                                <p className="card-text text-muted flex-grow-1 small">
                                    Create a professional profile, explore career opportunities,
                                    and connect with companies to start your next career chapter.
                                </p>
                                <button
                                    className="btn btn-primary py-2 fw-medium"
                                    onClick={() => handleJoinNow(USER_TYPES.CANDIDATE)}
                                    aria-label="Join as Candidate"
                                >
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Interviewer Card */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden transition-all hover-transform">
                            <div className="card-body d-flex flex-column align-items-center text-center p-3 p-md-4">
                                <div className="icon-container bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: "70px", height: "70px" }}>
                                    <i className="bi bi-person-check fs-7 text-primary" aria-hidden="true"></i>
                                </div>
                                <h3 className="card-title h5 mb-2 mb-md-3">Join as Interviewer</h3>
                                <p className="card-text text-muted flex-grow-1 small">
                                    Participate in the recruitment process, evaluate candidates, share expertise,
                                    and help companies make the best hiring decisions.
                                </p>
                                <button
                                    className="btn btn-primary py-2 fw-medium"
                                    onClick={() => handleJoinNow(USER_TYPES.INTERVIEWER)}
                                    aria-label="Join as Interviewer"
                                >
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center py-2 py-md-3">
                    <p className="text-center mb-0 small">
                        Already have an account?{" "}
                        <Link to="/login" className="text-decoration-none fw-medium">
                            Log In
                        </Link>
                    </p>
                </div>
            </main>

            {/* Signup Modal */}
            {showSignupModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} role="dialog" aria-modal="true">
                    <div className={`modal-dialog modal-dialog-centered`}>
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title text-white fs-6 fs-md-5" id="modal-title">
                                    Sign up as {selectedUserType === "user" ? "Candidate" : selectedUserType === "interviewer" ? "Interviewer" : "Company"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={handleCloseModal}
                                    aria-label="Close modal"
                                    disabled={isSubmitting}
                                ></button>
                            </div>

                            <div className="modal-body p-3 p-md-4">
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label fw-medium small">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={values.email}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            aria-invalid={!!errors.email}
                                            aria-describedby="email-error"
                                        />
                                        {errors.email && (
                                            <div id="email-error" className="invalid-feedback small">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label fw-medium small">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            name="password"
                                            placeholder="Create a secure password"
                                            value={values.password}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            aria-invalid={!!errors.password}
                                            aria-describedby="password-error"
                                        />
                                        {errors.password && (
                                            <div id="password-error" className="invalid-feedback small">
                                                {errors.password}
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-primary py-2 fw-medium"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Signing Up...
                                                </>
                                            ) : (
                                                "Create Account"
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <div className="text-center my-3 my-md-4">
                                    <span className="text-muted small">Or sign up with</span>
                                </div>

                                <div className="d-grid gap-2">
                                    <button onClick={() => handleGoogleLogin()}
                                        className="btn btn-outline-secondary d-flex align-items-center justify-content-center py-2"
                                        type="button"
                                        disabled={isSubmitting}
                                    >
                                        <i className="bi bi-google me-2" aria-hidden="true"></i>
                                        <span className="small">Continue with Google</span>
                                    </button>

                                    <button onClick={() => handleLinkedinLogin()}
                                        className="btn btn-outline-primary d-flex align-items-center justify-content-center py-2"
                                        type="button"
                                        disabled={isSubmitting}
                                    >
                                        <i className="bi bi-linkedin me-2" aria-hidden="true"></i>
                                        <span className="small">Continue with LinkedIn</span>
                                    </button>
                                </div>
                            </div>

                            <div className="modal-footer bg-light justify-content-center py-2 py-md-3">
                                <p className="text-center mb-0 small">
                                    Already have an account?{" "}
                                    <Link to="/login" className="text-decoration-none fw-medium">
                                        Log In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
        .hover-transform:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        @media (max-width: 767.98px) {
          .modal-dialog {
            margin: 0.5rem;
          }
          
          .card {
            margin-bottom: 1rem;
          }
        }
        
        @media (max-width: 575.98px) {
          .display-5 {
            font-size: 2rem;
          }
          
          .lead {
            font-size: 1rem;
          }
        }
      `}
            </style>
        </div>
    );
};

export default JoinUs;