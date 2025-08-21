import React, { useState, useEffect } from 'react';
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
        const statusMap = {
            'Applied': { class: 'bg-info', text: 'Applied' },
            'Reviewed': { class: 'bg-primary', text: 'Reviewed' },
            'Rejected': { class: 'bg-danger', text: 'Not Selected' },
            'Shortlisted': { class: 'bg-success', text: 'Shortlisted' }
        };
        return (
            <span className={`badge ${statusMap[status]?.class || 'bg-secondary'}`}>
                {statusMap[status]?.text || status}
            </span>
        );
    };

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
            <>
                <div className="container-fluid">
                    <div className="container mt-5 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading your applications...</p>
                    </div>
                </div>
            </>
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
                        <div className="list-group">
                            {currentJobList.map((application) => (
                                <div key={application.appicationId} className="list-group-item list-group-item-action">
                                    <div className="d-flex w-100 justify-content-between">
                                        <div className="mb-2">
                                            <h5 className="mb-1">{application.title}</h5>
                                            <p className="mb-1">
                                                <strong>{application.company}</strong> • {application.location}
                                            </p>
                                            <small className="text-muted">
                                                Applied on {formatDate(application.appliedAt)} •
                                                {application.type} • {application.salary}
                                            </small>
                                        </div>
                                        <div className="text-end">
                                            {getStatusBadge(application.status)}
                                            <div className="mt-2">
                                                <small className="text-muted">
                                                    Updated: {formatDate(application.statusDate)}
                                                </small>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 d-flex justify-content-end align-items-center">
                                        <div>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleViewJob(application.jobId)}
                                            >
                                                View Job
                                            </button>
                                            <button className="btn btn-sm btn-outline-secondary" onClick={() => withdrawJobApplication(application.jobId)}>
                                                Withdraw
                                            </button>
                                        </div>
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
            </div>
        </>
    );
};

export default UserJobsApplied;