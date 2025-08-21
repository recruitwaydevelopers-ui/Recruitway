import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SuperAdminJoinInterviewModal = ({
    setJoinModal,
}) => {
    const navigate = useNavigate();
    const [accessGranted, setAccessGranted] = useState(false);
    const location = useLocation();
    const { id } = location.state || {};

    const handleJoinConfirm = () => {
        setAccessGranted(true);
        setJoinModal(false);
    };

    const handleJoinCancel = () => {
        setJoinModal(false);
        setAccessGranted(false);
        navigate('/superadmin/allInterviews');
    };

    return (
        <>
            {/* Confirmation Modal - only shown when accessGranted is true */}
            {
                !accessGranted && (
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Join Interview Confirmation</h5>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to join this interview session?</p>
                                    <div className="alert alert-warning mb-0">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        Make sure your microphone and camera are ready.
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleJoinCancel}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleJoinConfirm}>
                                        Join Interview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {accessGranted && id && <InterviewRoom2 interviewId={id} />}
        </>

    );
}

export default SuperAdminJoinInterviewModal;