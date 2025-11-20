import { useState, useEffect } from 'react';
import axios from "axios";
import { useAuthContext } from '../../../context/auth-context';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSuperAdminContext } from '../../../context/superadmin-context';

const SuperAdminMockRequests = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { server, token } = useAuthContext();
    const { markAsCancelledForMock } = useSuperAdminContext()
    const navigate = useNavigate();

    // Search, filter, and sort states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortOption, setSortOption] = useState('newest');

    // UI states
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [rescheduleDate, setRescheduleDate] = useState('');
    const [rescheduleTime, setRescheduleTime] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const { data } = await axios.get(`${server}/api/v1/mockRequest/getMockRequests`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Add status field if not present
                const interviewsWithStatus = (data.data || []).map(interview => ({
                    ...interview,
                    status: interview.status || 'pending' // Default to pending if not set
                }));
                setInterviews(interviewsWithStatus);
            } catch (err) {
                setError(
                    err.response?.data?.message || err.message || "Failed to fetch interviews"
                );
            } finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, [server, token]);

    console.log(interviews);



    // Navigate to schedule page
    const navigateToSchedulePage = (interviewId) => {
        navigate("/superadmin/schedule-mock-interview", { state: { interviewId } });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getExperienceBadgeClass = (level) => {
        switch (level.toLowerCase()) {
            case 'senior': return 'bg-success';
            case 'mid': return 'bg-warning text-dark';
            case 'junior': return 'bg-info';
            default: return 'bg-secondary';
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'scheduled': return 'bg-success';
            case 'pending': return 'bg-warning text-dark';
            case 'declined': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    // Update interview status
    const updateInterviewStatus = async (interviewId, newStatus) => {
        setActionLoading(true);

        // Store old status before optimistic update
        const oldStatus = interviews.find(i => (i._id || i.id) === interviewId)?.status;

        try {
            // Optimistic UI update
            setInterviews(prevInterviews =>
                prevInterviews.map(interview =>
                    (interview._id || interview.id) === interviewId
                        ? { ...interview, status: newStatus }
                        : interview
                )
            );

            // Await backend update
            const res = await markAsCancelledForMock(interviewId, newStatus);

            toast.dismiss();
            toast.success(res.message || "Status updated successfully");

        } catch (err) {
            console.error("Error updating status:", err);

            // Rollback to old status
            setInterviews(prevInterviews =>
                prevInterviews.map(interview =>
                    (interview._id || interview.id) === interviewId
                        ? { ...interview, status: oldStatus }
                        : interview
                )
            );

            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "Failed to update interview status";

            setError(errorMessage);
            toast.dismiss();
            toast.error(errorMessage);

        } finally {
            setActionLoading(false);
        }
    };

    // Handle reschedule
    const handleReschedule = async () => {
        if (!selectedInterview || !rescheduleDate || !rescheduleTime) return;
        setActionLoading(true);
        try {
            // Update locally first
            setInterviews(prevInterviews =>
                prevInterviews.map(interview =>
                    (interview._id || interview.id) === selectedInterview._id
                        ? {
                            ...interview,
                            interviewDate: rescheduleDate,
                            interviewTime: rescheduleTime,
                            status: 'scheduled'
                        }
                        : interview
                )
            );
            // Then update on server
            await axios.put(`${server}/api/v1/mockInterview/reschedule/${selectedInterview._id}`, {
                interviewDate: rescheduleDate,
                interviewTime: rescheduleTime
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Reset and close modal
            setRescheduleDate('');
            setRescheduleTime('');
            setShowRescheduleModal(false);
            setSelectedInterview(null);
        } catch (err) {
            setError(
                err.response?.data?.message || err.message || "Failed to reschedule"
            );
        } finally {
            setActionLoading(false);
        }
    };

    // Filter and sort interviews
    const filteredInterviews = interviews
        .filter(interview => {
            // Apply search filter
            const matchesSearch = searchTerm === '' ||
                interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                interview.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                interview.candidatePhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                interview.profile.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (interview.interviewerChoice && interview.interviewerChoice.toLowerCase().includes(searchTerm.toLowerCase()));
            // Apply status filter
            const matchesStatus = filterStatus === 'all' || interview.status === filterStatus;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            // Apply sorting
            switch (sortOption) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'date-asc':
                    return new Date(a.interviewDate) - new Date(b.interviewDate);
                case 'date-desc':
                    return new Date(b.interviewDate) - new Date(a.interviewDate);
                default:
                    return 0;
            }
        });

    const formatTimezone = (timezone) => {
        if (!timezone) return '';

        return timezone
            .replace(/_/g, ' ')
            .replace(/\//g, ' / ');
    };

    if (loading) {
        return (
            <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="fs-5 fw-medium">Loading interview requests...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
                <div className="card shadow-lg border-0" style={{ maxWidth: '500px' }}>
                    <div className="card-body text-center p-5">
                        <div className="text-danger mb-4">
                            <i className="bi bi-exclamation-triangle-fill fs-7"></i>
                        </div>
                        <h4 className="card-title mb-3">Error Loading Interview Requests</h4>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            className="btn btn-danger px-4"
                            onClick={() => window.location.reload()}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i> Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* Header Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                        <div className="mb-3 mb-md-0">
                            <h1 className="h2 fw-bold mb-1">Mock Interview Requests</h1>
                            <p className="text-muted mb-0">Manage and respond to interview scheduling requests</p>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="badge bg-primary fs-3 me-3">
                                {filteredInterviews.length} {filteredInterviews.length === 1 ? 'Request' : 'Requests'}
                            </span>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterStatus('all');
                                    setSortOption('newest');
                                }}
                            >
                                <i className="bi bi-arrow-counterclockwise me-1"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="card shadow-sm mb-4 border-0">
                <div className="card-body p-4">
                    <div className="row g-3">
                        <div className="col-md-5">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-0"
                                    placeholder="Search by name, email, phone, profile..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        className="btn btn-outline-secondary border-start-0"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="declined">Declined</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name-asc">Name (A-Z)</option>
                                <option value="name-desc">Name (Z-A)</option>
                                <option value="date-asc">Interview Date (Earliest)</option>
                                <option value="date-desc">Interview Date (Latest)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interview Requests */}
            <div className="row">
                {filteredInterviews.length > 0 ? (
                    filteredInterviews.map((interview) => (
                        <div key={interview._id || interview.id} className="col-12 mb-4">
                            <div className="card shadow-sm h-100 border-0 overflow-hidden">
                                <div className="card-header bg-white py-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center border-bottom">
                                    <div className="d-flex align-items-center mb-3 mb-md-0">
                                        <div className="avatar-circle me-3">
                                            {interview.candidateName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h5 className="mb-0 fw-semibold">{interview.candidateName}</h5>
                                            <div className="small text-muted">
                                                <i className="bi bi-envelope me-1"></i> {interview.candidateEmail}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column align-items-start align-items-md-end">
                                        <div className="d-flex justify-content-center justify-content-md-end mb-1">
                                            <span className={`badge ${getExperienceBadgeClass(interview.experienceLevel)} me-2 px-3 py-1`}>
                                                {interview.experienceLevel}
                                            </span>
                                            <span className={`badge ${getStatusBadgeClass(interview.status)} px-3 py-1`}>
                                                {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                                            </span>
                                        </div>
                                        <span className="badge bg-light text-dark px-3 py-1">
                                            <i className="bi bi-calendar-event me-1"></i> {formatDate(interview.interviewDate)} at {interview.interviewTime}
                                        </span>
                                    </div>
                                </div>
                                <div className="card-body p-4">
                                    <div className="row mb-3">
                                        <div className="col-md-4 mb-3 mb-md-0">
                                            <h6 className="text-muted small mb-2 fw-medium">Contact Information</h6>
                                            <div className="mb-2">
                                                <i className="bi bi-telephone me-2 text-primary"></i>
                                                <a href={`tel:${interview.candidatePhone}`} className="text-decoration-none text-dark">
                                                    {interview.candidatePhone}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3 mb-md-0">
                                            <h6 className="text-muted small mb-2 fw-medium">Interview Details</h6>
                                            <div className="mb-2">
                                                <i className="bi bi-person-badge me-2 text-primary"></i>
                                                {interview.profile}
                                            </div>
                                            <div className="mb-2">
                                                <i className="bi bi-globe me-2 text-primary"></i>
                                                {formatTimezone(interview.timezone)}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <h6 className="text-muted small mb-2 fw-medium">Interviewer's Choice</h6>
                                            <div className="mb-2">
                                                <i className="bi bi-person-check me-2 text-primary"></i>
                                                {interview.interviewerChoice}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-white py-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                                    <div className="mb-3 mb-md-0">
                                        <small className="text-muted d-block">
                                            <i className="bi bi-clock-history me-1"></i> Requested: {new Date(interview.createdAt).toLocaleString()}
                                        </small>
                                        <div className="text-muted small">
                                            ID: {interview._id || interview.id}
                                        </div>
                                    </div>
                                    <div className="d-flex flex-wrap">
                                        {interview.status === 'pending' && (
                                            <>
                                                <button
                                                    className="btn btn-sm btn-success me-2 mb-2 mb-md-0 px-3"
                                                    onClick={() => navigateToSchedulePage(interview?._id)}
                                                    disabled={actionLoading}
                                                >
                                                    <i className="bi bi-check-circle me-1"></i> Schedule
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-outline-danger me-2 mb-2 mb-md-0 px-3"
                                                    onClick={() => updateInterviewStatus(interview._id, 'declined')}
                                                    disabled={actionLoading}
                                                >
                                                    <i className="bi bi-x-circle me-1"></i> Cancel
                                                </button>
                                            </>
                                        )}
                                        {interview.status === 'scheduled' && (
                                            <>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary me-2 mb-2 mb-md-0 px-3"
                                                    onClick={() => navigateToSchedulePage(interview?._id)}
                                                    disabled={actionLoading}
                                                >
                                                    <i className="bi bi-clock me-1"></i> Reschedule
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-outline-danger me-2 mb-2 mb-md-0 px-3"
                                                    onClick={() => updateInterviewStatus(interview._id, 'declined')}
                                                    disabled={actionLoading}
                                                >
                                                    <i className="bi bi-x-circle me-1"></i> Cancel
                                                </button>
                                            </>
                                        )}
                                        {interview.status === 'declined' && (
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2 mb-2 mb-md-0 px-3"
                                                onClick={() => updateInterviewStatus(interview._id, 'pending')}
                                                disabled={actionLoading}
                                            >
                                                <i className="bi bi-arrow-clockwise me-1"></i> Reconsider
                                            </button>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="card shadow-sm border-0">
                            <div className="card-body text-center py-5">
                                <div className="mb-4 text-muted">
                                    <i className="bi bi-calendar-x fs-1"></i>
                                </div>
                                <h4 className="mb-3">No Mock Interview Requests</h4>
                                <p className="text-muted mb-4">
                                    {searchTerm || filterStatus !== 'all'
                                        ? "No requests match your search criteria."
                                        : "No interview requests have been submitted yet."}
                                </p>
                                {(searchTerm || filterStatus !== 'all') && (
                                    <button
                                        className="btn btn-primary px-4"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterStatus('all');
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Reschedule Modal */}
            {
                showRescheduleModal && selectedInterview && (
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content border-0 shadow-lg">
                                <div className="modal-header bg-primary text-white border-0">
                                    <h5 className="modal-title">Reschedule Interview for {selectedInterview.candidateName}</h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => {
                                            setShowRescheduleModal(false);
                                            setSelectedInterview(null);
                                        }}
                                    ></button>
                                </div>
                                <div className="modal-body p-4">
                                    <div className="mb-4">
                                        <label className="form-label fw-medium">Current Schedule:</label>
                                        <div className="bg-light p-3 rounded-3">
                                            <i className="bi bi-calendar-event me-2"></i> {formatDate(selectedInterview.interviewDate)} at {selectedInterview.interviewTime}
                                            <div className="mt-2">
                                                <i className="bi bi-globe me-2"></i> {formatTimezone(selectedInterview.timezone)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="rescheduleDate" className="form-label fw-medium">New Date:</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="rescheduleDate"
                                            value={rescheduleDate}
                                            onChange={(e) => setRescheduleDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="rescheduleTime" className="form-label fw-medium">New Time:</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            id="rescheduleTime"
                                            value={rescheduleTime}
                                            onChange={(e) => setRescheduleTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer bg-light border-0">
                                    <button
                                        type="button"
                                        className="btn btn-secondary px-4"
                                        onClick={() => {
                                            setShowRescheduleModal(false);
                                            setSelectedInterview(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary px-4"
                                        onClick={handleReschedule}
                                        disabled={actionLoading || !rescheduleDate || !rescheduleTime}
                                    >
                                        {actionLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i> Confirm Reschedule
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Modal backdrop */}
            {
                showRescheduleModal && (
                    <div className="modal-backdrop fade show"></div>
                )
            }

            <style>{`
            .avatar-circle {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1.2rem;
                flex-shrink: 0;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .modal.show {
                background-color: rgba(0,0,0,0.5);
            }

            .card {
                transition: all 0.3s ease;
            }

            .card:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
            }

            .btn {
                transition: all 0.2s ease;
            }

            .btn:hover {
                transform: translateY(-1px);
            }

            .badge {
                font-weight: 500;
            }

            .form-control, .form-select {
                transition: all 0.2s ease;
            }

            .form-control:focus, .form-select:focus {
                box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
                border-color: #667eea;
            }

            .input-group-text {
                transition: all 0.2s ease;
            }

            @media (max-width: 768px) {
                .card-header, .card-footer {
                    padding: 0.75rem 1rem;
                }

                .card-body {
                    padding: 1rem;
                }

                .modal-dialog {
                    margin: 1rem;
                    max-width: calc(100% - 2rem);
                }

                h1.h2 {
                    font-size: 1.75rem;
                }

                .btn-sm {
                    padding: 0.375rem 0.75rem;
                    font-size: 0.875rem;
                }

                .badge {
                    font-size: 0.75rem;
                }

                .avatar-circle {
                    width: 40px;
                    height: 40px;
                    font-size: 1rem;
                }
            }

            /* Custom animations */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .card {
                animation: fadeIn 0.5s ease forwards;
            }

            /* Custom scrollbar */
            ::-webkit-scrollbar {
                width: 8px;
            }

            ::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            ::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        `}</style>
        </div >
    );
};

export default SuperAdminMockRequests;











