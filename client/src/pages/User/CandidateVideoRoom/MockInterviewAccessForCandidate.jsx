import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/auth-context";
import toast from "react-hot-toast";

const MockInterviewAccessForCandidate = () => {
    const { server } = useAuthContext();
    const [interviewId, setInterviewId] = useState("");
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
    const navigate = useNavigate();

    // Check screen size on mount and when resizing
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobileOrTablet(window.innerWidth < 1024); // Tablets and mobiles
        };

        // Initial check
        checkScreenSize();

        // Add resize listener
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            if (!interviewId.trim()) {
                throw new Error('Interview ID is required');
            }
            const res = await verifyAccessDetails(interviewId);
            const response = {
                ...res,
                screen: "random-candidate"
            }
            if (response.valid) {
                navigate(`/mockinterviewvideoroom/${interviewId}`, { state: { response } });
            } else {
                throw new Error(response.message || 'Invalid details');
            }
        } catch (err) {
            setError(err.message || 'Failed to verify access');
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyAccessDetails = async (interviewId) => {
        try {
            const response = await axios.post(`${server}/api/v1/interviews/verify-access-0f-candidate-for-mock-interviewer`,
                { interviewId }
            );
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data.message || "Access verification failed");
            throw error;
        }
    };

    if (isMobileOrTablet) {
        return (
            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center px-3 py-4">
                <div className="card shadow-sm p-4 p-md-5 w-100 text-center" style={{ maxWidth: '600px' }}>
                    <div className="card-body">
                        <div className="mb-4">
                            <i className="bi bi-laptop text-primary" style={{ fontSize: '4rem' }}></i>
                        </div>
                        <h4 className="fw-bold mb-3">Please Use a Laptop or Desktop</h4>
                        <p className="text-muted mb-4">
                            Our video interview platform requires a larger screen for the best experience.
                            Please switch to a laptop or desktop computer to access your interview.
                        </p>
                        <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            <strong>Why?</strong> Our platform needs screen space for video feeds,
                            code editors, and shared documents that aren't optimized for mobile devices.
                        </div>
                        <div className="mt-4 text-muted small">
                            <p className="mb-2">Already on a computer? Try maximizing your browser window.</p>
                            <a href="mailto:support@interviewportal.com" className="text-decoration-none">
                                <i className="bi bi-envelope me-1"></i> Contact support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center px-3 py-4">
            <div className="card shadow-sm p-3 p-md-4 w-100" style={{ maxWidth: '500px' }}>
                <div className="card-body">
                    <div className="text-center mb-4">
                        <img
                            src="/images/logos/logo.png"
                            alt="Secure Access"
                            className="img-fluid mb-3"
                            style={{ maxHeight: '60px', height: 'auto' }}
                        />
                        <h4 className="fw-bold mb-1">Secure Interview Portal</h4>
                        <p className="text-muted small mb-0">Enter your details to continue</p>
                    </div>
                    <form onSubmit={handleSubmit} className="px-0 px-sm-2">
                        <div className="form-floating mb-2">
                            <input
                                type="text"
                                name="interviewId"
                                value={interviewId}
                                onChange={(e) => setInterviewId(e.target.value)}
                                className={`form-control ${error ? 'is-invalid' : ''}`}
                                placeholder="Enter access code"
                                autoComplete="off"
                                id="interviewIdInput"
                            />
                            <label htmlFor="interviewIdInput">Interview ID</label>
                        </div>
                        <div className="text-start mb-3">
                            <small className="text-muted">
                                • Case-sensitive Interview ID sent to your email
                            </small>
                        </div>
                        {error && (
                            <div className="alert alert-danger text-start p-2 small mb-3">
                                <i className="bi bi-exclamation-circle me-2"></i>
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2"
                            disabled={isSubmitting || !interviewId.trim()}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-lock-fill me-2"></i>
                                    Access Interview
                                </>
                            )}
                        </button>
                    </form>
                    <div className="mt-4 text-center text-muted small">
                        <p className="mb-1">Need help with your access code?</p>
                        <a href="mailto:support@interviewportal.com" className="text-decoration-none">
                            <i className="bi bi-envelope me-1"></i> Contact support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockInterviewAccessForCandidate;









