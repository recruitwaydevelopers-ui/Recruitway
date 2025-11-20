import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidateContext } from '../../../context/candidate-context';
import { useAuthContext } from '../../../context/auth-context';

const UserJobsApplied = () => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const jobListPerPage = 10;
    const navigate = useNavigate();
    const { getAppliedJobs, appliedJobs, isLoading, withdrawJobApplication } = useCandidateContext()
    const { user } = useAuthContext()

    useEffect(() => {
        if (user.userId) {
            getAppliedJobs()
        }
    }, [])

    const filteredApplications = appliedJobs.filter(app =>
        filterStatus === 'all' || app.status === filterStatus
    );

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Pending': {
                class: 'status-pending',
                icon: 'fas fa-clock'
            },
            'Reviewed': {
                class: 'status-reviewed',
                icon: 'fas fa-eye'
            },
            'Shortlisted': {
                class: 'status-shortlisted',
                icon: 'fas fa-star'
            },
            'Rejected': {
                class: 'status-rejected',
                icon: 'fas fa-times-circle'
            },
            'Accepted': {
                class: 'status-accepted',
                icon: 'fas fa-check-circle'
            }
        };

        const config = statusConfig[status] || statusConfig['Pending'];

        return (
            <div className={`status-badge ${config.class}`}>
                <i className={`${config.icon} me-1`}></i>
                {status}
            </div>
        );
    };

    function getInitials(name) {
        if (!name) return "";

        // Split name by spaces, remove empty entries
        const parts = name.trim().split(/\s+/);

        // Take first letter of each part and uppercase it
        const initials = parts.map(part => part.charAt(0).toUpperCase()).join("");

        return initials;
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleViewJob = (jobId) => {
        navigate(`/user/jobs-applied-details/${jobId}`);
    };

    const indexOfLastJobList = currentPage * jobListPerPage;
    const indexOfFirstJobList = indexOfLastJobList - jobListPerPage;
    const currentJobList = filteredApplications?.slice(indexOfFirstJobList, indexOfLastJobList);
    const totalPages = Math.ceil(filteredApplications?.length / jobListPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 mb-0 fs-5 text-secondary">
                    Loading your applications...
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="container-fluid">
                <div className="container mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Your Job Applications</h1>
                        <div className="d-flex align-items-center">
                            <span className="me-2">Filter:</span>
                            <select
                                className="form-select form-select-sm w-auto"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Applications</option>
                                <option value="Applied">Applied</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Rejected">Not Selected</option>
                            </select>
                        </div>
                    </div>

                    {currentJobList.length === 0 ? (
                        <div className="card">
                            <div className="card-body text-center py-5">
                                <i className="bi bi-briefcase display-4 text-muted mb-3"></i>
                                <h3 className="text-muted">
                                    {filterStatus === 'all'
                                        ? "You haven't applied to any jobs yet"
                                        : `No ${filterStatus.replace('-', ' ')} applications`}
                                </h3>
                                <p className="text-muted">
                                    {filterStatus === 'all'
                                        ? "Browse available jobs and apply to see them here."
                                        : "Your applications with this status will appear here."}
                                </p>
                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => navigate('/user/jobs')}
                                >
                                    Browse Jobs
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="applications-container">
                            {currentJobList.map((application) => (
                                <div key={application.appicationId} className="application-card">
                                    <div className="application-header">
                                        <div className="company-info">
                                            <div className="company-logo">
                                                {getInitials(application?.company)}
                                            </div>
                                            <div className="company-details">
                                                <h4 className="job-title">{application.title}</h4>
                                                <p className="company-name">
                                                    <i className="fas fa-building me-1"></i>
                                                    {application.company}
                                                </p>
                                                <p className="job-location">
                                                    <i className="fas fa-map-marker-alt me-1"></i>
                                                    {application.location}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="status-section">
                                            {getStatusBadge(application.status)}
                                            <div className="status-date">
                                                <i className="far fa-clock me-1"></i>
                                                Updated: {formatDate(application.statusDate)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="application-details">
                                        <div className="job-meta">
                                            <div className="meta-item">
                                                <i className="fas fa-briefcase me-1"></i>
                                                <span>{application.type}</span>
                                            </div>
                                            <div className="meta-item">
                                                <i className="fas fa-dollar-sign me-1"></i>
                                                <span>{application.salary}</span>
                                            </div>
                                            <div className="meta-item">
                                                <i className="far fa-calendar me-1"></i>
                                                <span>Applied: {formatDate(application.appliedAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="application-actions">
                                        <button
                                            className="btn-action btn-view"
                                            onClick={() => handleViewJob(application.jobId)}
                                        >
                                            <i className="fas fa-eye me-1"></i>
                                            View Job
                                        </button>
                                        <button
                                            className="btn-action btn-withdraw"
                                            onClick={() => withdrawJobApplication(application.jobId)}
                                        >
                                            <i className="fas fa-times-circle me-1"></i>
                                            Withdraw
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <nav aria-label="Page navigation" className="mt-4">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link btn "
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(pageNum)}>
                                            {pageNum}
                                        </button>
                                    </li>
                                );
                            })}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
                <style jsx>{`
        .applications-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .application-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            padding: 1.5rem;
            transition: all 0.3s ease;
            border: 1px solid #e9ecef;
        }

        .application-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .application-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
        }

        .company-info {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }

        .company-logo {
            width: 60px;
            height: 60px;
            border-radius: 10px;
            background-color: #f8f9fa;
            color: #0d6efd;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.2rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .company-details {
            flex: 1;
        }

        .job-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
            color: #212529;
        }

        .company-name {
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 0.25rem;
            color: #495057;
        }

        .job-location {
            font-size: 0.9rem;
            color: #6c757d;
            margin-bottom: 0;
        }

        .status-section {
            text-align: right;
        }

        .status-date {
            font-size: 0.8rem;
            color: #6c757d;
            margin-top: 0.5rem;
        }

        .application-details {
            padding: 1rem 0;
            border-top: 1px solid #e9ecef;
            border-bottom: 1px solid #e9ecef;
            margin-bottom: 1rem;
        }

        .job-meta {
            display: flex;
            gap: 1.5rem;
            flex-wrap: wrap;
        }

        .meta-item {
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            color: #495057;
        }

        .application-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
        }

        .btn-action {
            padding: 0.5rem 1.25rem;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            transition: all 0.2s ease;
            cursor: pointer;
            border: none;
        }

        .btn-view {
            background-color: #f8f9fa;
            color: #0d6efd;
            border: 1px solid #dee2e6;
        }

        .btn-view:hover {
            background-color: #e9ecef;
            color: #0b5ed7;
        }

        .btn-withdraw {
            background-color: #fff;
            color: #6c757d;
            border: 1px solid #dee2e6;
        }

        .btn-withdraw:hover {
            background-color: #f8f9fa;
            color: #dc3545;
            border-color: #dc3545;
        }

        .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.75rem;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 600;
}

.status-pending {
    background-color: #fff3cd;
    color: #856404;
}

.status-reviewed {
    background-color: #cfe2ff;
    color: #084298;
}

.status-shortlisted {
    background-color: #d1ecf1;
    color: #0c5460;
}

.status-rejected {
    background-color: #f8d7da;
    color: #721c24;
}

.status-accepted {
    background-color: #d4edda;
    color: #155724;
}

        @media (max-width: 768px) {
            .application-header {
                flex-direction: column;
                gap: 1rem;
            }
            
            .company-info {
                width: 100%;
            }
            
            .status-section {
                width: 100%;
                text-align: left;
            }
            
            .job-meta {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .application-actions {
                justify-content: center;
            }
        }
    `}</style>
            </div>
        </>
    );
};

export default UserJobsApplied;