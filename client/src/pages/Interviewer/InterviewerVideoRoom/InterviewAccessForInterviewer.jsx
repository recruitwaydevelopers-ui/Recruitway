import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/auth-context";
import toast from "react-hot-toast";

const InterviewAccessForInterviewer = () => {
    const { server, token } = useAuthContext()
    const location = useLocation();
    const { id } = location.state || {};

    console.log(id);


    const [interviewId, setInterviewId] = useState("")
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

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
                screen: "interviewer"
            }

            if (response.valid) {
                navigate(`/videoroom/${interviewId}`, { state: { response } });
            } else {
                throw new Error(response.message || 'Invalid details');
            }
        } catch (err) {
            // setError(err.message || 'Failed to verify access');
        } finally {
            setInterviewId('');
            setIsSubmitting(false);
        }
    };

    const verifyAccessDetails = async (interviewId) => {
        try {
            const response = await axios.post(`${server}/api/v1/interviews/verify-access-for-interviewer`,
                { interviewId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            // console.error('Error verifying access details:', error?.response?.data.message);
            toast.error(error?.response?.data.message)
        }
    };

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
                                • Case-sensitive Interview ID to your email
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

export default InterviewAccessForInterviewer;





