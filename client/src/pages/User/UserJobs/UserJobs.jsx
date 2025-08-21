import React, { useEffect, useState } from 'react';
import { useCandidateContext } from '../../../context/candidate-context';
import formatDateToRelative from '../../../Helper/dateFormatter';

const UserJobs = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const jobListPerPage = 10;

    const { getAppliedJobs, appliedJobs, isLoading, allJobs: jobs, getAllJobs, appllyJobs } = useCandidateContext()

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        getAllJobs()
        getAppliedJobs()
    }, [])

    // Check if user has already applied to a job
    const hasAppliedToJob = (jobId) => {
        return appliedJobs.some(job => job.jobId === jobId);
    };

    const handleViewJob = (job) => {
        setSelectedJob(job);
    };

    const handleApply = async (jobId, companyId) => {
        try {
            appllyJobs(jobId, companyId)
        } catch (error) {
            console.log(error.message);

        }
    }

    const indexOfLastJobList = currentPage * jobListPerPage;
    const indexOfFirstJobList = indexOfLastJobList - jobListPerPage;
    const currentJobList = filteredJobs?.slice(indexOfFirstJobList, indexOfLastJobList);
    const totalPages = Math.ceil(filteredJobs?.length / jobListPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (selectedJob) {

        const alreadyApplied = hasAppliedToJob(selectedJob._id);

        return (
            <>
                <div className="container-fluid">
                    <div className="container py-5">
                        <button
                            className="btn btn-sm btn-outline-primary mb-4 px-4 d-flex align-items-center"
                            onClick={() => setSelectedJob(null)}
                        >
                            <i className="bi bi-arrow-left me-2"></i> Back to Jobs
                        </button>

                        <div className="card border-0 shadow-lg overflow-hidden">
                            <div className="card-header bg-primary bg-gradient py-4">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h1 className="h2 text-white mb-2">{selectedJob.title}</h1>
                                        <h2 className="h5 text-white-80 mb-0">
                                            <i className="bi bi-building me-2"></i>
                                            {selectedJob.company}
                                        </h2>
                                    </div>
                                    <span className={`badge rounded-pill bg-${selectedJob.status === 'Active' ? 'success' : 'secondary'}-subtle text-${selectedJob.status === 'Active' ? 'success' : 'secondary'} py-2 px-3`}>
                                        {selectedJob.status}
                                    </span>
                                </div>
                            </div>

                            <div className="card-body p-4 p-lg-5">
                                <div className="row g-4 mb-4">
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-geo-alt text-primary fs-5 me-3"></i>
                                            <div>
                                                <h6 className="text-muted mb-0">Location</h6>
                                                <p className="mb-0 fw-medium">{selectedJob.location || 'Remote'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-cash-coin text-primary fs-5 me-3"></i>
                                            <div>
                                                <h6 className="text-muted mb-0">Salary</h6>
                                                <p className="mb-0 fw-medium">{selectedJob.salary || 'Competitive'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-clock text-primary fs-5 me-3"></i>
                                            <div>
                                                <h6 className="text-muted mb-0">Job Type</h6>
                                                <p className="mb-0 fw-medium">{selectedJob.type}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <h4 className="h5 text-primary mb-3 d-flex align-items-center">
                                        <i className="bi bi-file-text me-2"></i> Job Description
                                    </h4>
                                    <div className="ps-4 border-start border-3 border-primary">
                                        <p className="mb-0">{selectedJob.description}</p>
                                    </div>
                                </div>

                                {selectedJob.requirements?.length > 0 && (
                                    <div className="mb-5">
                                        <h4 className="h5 text-primary mb-3 d-flex align-items-center">
                                            <i className="bi bi-list-check me-2"></i> Requirements
                                        </h4>
                                        <ul className="list-unstyled ps-4">
                                            {selectedJob.requirements.map((req, index) => (
                                                <li key={index} className="mb-2 d-flex">
                                                    <i className="bi bi-check-circle text-success me-2 mt-1"></i>
                                                    <span>{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {selectedJob.skills?.length > 0 && (
                                    <div className="mb-5">
                                        <h4 className="h5 text-primary mb-3 d-flex align-items-center">
                                            <i className="bi bi-tools me-2"></i> Skills Required
                                        </h4>
                                        <div className="d-flex flex-wrap gap-2">
                                            {selectedJob.skills.map((skill, index) => (
                                                <span key={index} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 py-2 px-3">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-top pt-4 mt-3">
                                    <div className="mb-3 mb-md-0">
                                        <small className="text-muted d-flex align-items-center">
                                            <i className="bi bi-calendar me-2"></i>
                                            Posted {formatDateToRelative(selectedJob.posted)} • {selectedJob.applicants || 0} applicants
                                        </small>
                                    </div>

                                    {
                                        !alreadyApplied ? (
                                            <button
                                                className="btn btn-sm btn-primary btn-lg px-4 py-2 d-flex align-items-center"
                                                onClick={() => handleApply(selectedJob._id, selectedJob.userId)}
                                            >

                                                Apply Now <i className="bi bi-send ms-2"></i>
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-success btn-lg px-4 py-2 d-flex align-items-center"
                                                disabled
                                            >
                                                Applied <i className="bi bi-check-circle ms-2"></i>
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

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
                    <h1 className="mb-4">Available Jobs</h1>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Search jobs by title, company, location or skills..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Jobs List */}

                    <div className="row g-4">
                        {currentJobList.length > 0 ? (
                            currentJobList.map(job => (
                                <div key={job._id} className="col-lg-6">
                                    <div className="card h-100 border-0 shadow-sm hover-effect">
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div>
                                                    <h3 className="h5 fw-bold mb-1 text-primary">{job.title}</h3>
                                                    <h4 className="h6 mb-2 text-muted">
                                                        <i className="bi bi-building me-2"></i>
                                                        {job.company}
                                                    </h4>
                                                </div>
                                                <span className={`badge rounded-pill bg-${job.status === 'Active' ? 'success' : 'secondary'}-subtle text-${job.status === 'Active' ? 'success' : 'secondary'} py-2 px-3`}>
                                                    {job.status}
                                                </span>
                                            </div>

                                            <div className="d-flex flex-wrap gap-3 mb-3">
                                                <div className="d-flex align-items-center text-muted">
                                                    <i className="bi bi-geo-alt me-2"></i>
                                                    <small>{job.location || 'Remote'}</small>
                                                </div>
                                                <div className="d-flex align-items-center text-muted">
                                                    <i className="bi bi-cash-coin me-2"></i>
                                                    <small>{job.salary || 'Competitive'}</small>
                                                </div>
                                                <div className="d-flex align-items-center text-muted">
                                                    <i className="bi bi-clock me-2"></i>
                                                    <small>{job.type || 'Full-time'}</small>
                                                </div>
                                                <div className="d-flex align-items-center text-muted">
                                                    <i className="bi bi-person-workspace me-2"></i>
                                                    <small>{job.experience || 'Experience not specified'}</small>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <p className="card-text text-muted mb-0 text-truncate text-wrap" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {job.description || 'No job description provided'}
                                                </p>
                                            </div>

                                            <div className="mb-4">
                                                <div className="d-flex flex-wrap gap-2">
                                                    {job.skills?.slice(0, 5).map((skill, index) => (
                                                        <span key={index} className="badge bg-light text-dark border border-1 py-2 px-3">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {job.skills?.length > 5 && (
                                                        <span className="badge bg-light text-muted border border-1 py-2 px-3">
                                                            +{job.skills.length - 5} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <small className="text-muted">
                                                    <i className="bi bi-calendar me-2"></i>
                                                    Posted {formatDateToRelative(job.posted)}
                                                </small>
                                                <button
                                                    className="btn btn-outline-primary btn-sm px-3 d-flex align-items-center"
                                                    onClick={() => handleViewJob(job)}
                                                >
                                                    View Details <i className="bi bi-chevron-right ms-2"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body text-center py-5">
                                        <i className="bi bi-briefcase text-muted mb-3" style={{ fontSize: '2.5rem' }}></i>
                                        <h4 className="h5 text-muted mb-2">No matching jobs found</h4>
                                        <p className="text-muted mb-0">
                                            {searchTerm ?
                                                "Try adjusting your search criteria" :
                                                "Check back later for new opportunities"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

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

export default UserJobs;