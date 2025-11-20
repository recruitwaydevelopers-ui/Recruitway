import { useState, useEffect } from 'react';
import { useCandidateContext } from '../../../context/candidate-context';
import formatDateToRelative from '../../../Helper/dateFormatter';

const UserJobs = () => {
    const { getAppliedJobs, appliedJobs, isLoading, allJobs, getAllJobs, appllyJobs } = useCandidateContext()

    // State management
    const [selectedJob, setSelectedJob] = useState(null);
    const [appliedJobsSet, setAppliedJobsSet] = useState(new Set()); // Renamed from appliedJobs
    const [activeFilter, setActiveFilter] = useState("All Jobs");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // Added missing state
    const jobListPerPage = 10;

    useEffect(() => {
        getAllJobs()
        getAppliedJobs()
    }, [])

    // Check if user has already applied to a job
    const hasAppliedToJob = (jobId) => {
        return appliedJobs.some(job => job.jobId === jobId);
    };

    // Event handlers
    const openJobModal = (jobId) => {
        const job = allJobs.find(j => j._id === jobId);
        setSelectedJob(job);
    };

    const closeJobModal = () => {
        setSelectedJob(null);
    };

    const handleApply = async (jobId, userId) => {
        if (!selectedJob || appliedJobsSet.has(selectedJob._id)) return;
        try {
            setAppliedJobsSet(prev => new Set([...prev, selectedJob._id]));
            appllyJobs(jobId, userId)
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Get Bootstrap class for job type
    const getJobTypeClass = (type) => {
        const normalizedType = type.toLowerCase().replace('-', '');
        switch (normalizedType) {
            case 'fulltime': return 'bg-success';
            case 'parttime': return 'bg-warning';
            case 'contract': return 'bg-info';
            default: return 'bg-primary';
        }
    };

    // Check if job is remote based on location
    const isRemoteJob = (location) => {
        return location.toLowerCase().includes('remote') || location.toLowerCase().includes('anywhere');
    };

    // Filter jobs based on active filter
    const getFilteredJobs = () => {
        let filtered = allJobs;

        // Apply filter
        if (activeFilter !== "All Jobs") {
            if (activeFilter === "Remote") {
                filtered = filtered.filter(job => isRemoteJob(job.location));
            } else {
                filtered = filtered.filter(job =>
                    job.type.toLowerCase().replace('-', '') === activeFilter.toLowerCase().replace('-', '')
                );
            }
        }

        // Apply search
        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        return filtered;
    };

    const filteredJobs = getFilteredJobs();
    const indexOfLastJobList = currentPage * jobListPerPage;
    const indexOfFirstJobList = indexOfLastJobList - jobListPerPage;
    const currentJobList = filteredJobs?.slice(indexOfFirstJobList, indexOfLastJobList);
    const totalPages = Math.ceil(filteredJobs?.length / jobListPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    function getInitials(name) {
        if (!name) return "";

        // Split name by spaces, remove empty entries
        const parts = name.trim().split(/\s+/);

        // Take first letter of each part and uppercase it
        const initials = parts.map(part => part.charAt(0).toUpperCase()).join("");

        return initials;
    }

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 mb-0 fs-5 text-secondary">
                    Loading your dream jobs...
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="container-fluid">
                {/* Hero Section */}
                <div className="container">
                    <section className="hero-section">
                        <h1 className="display-5 fw-bold mb-3">Find Your Dream Job</h1>
                        <p className="lead mb-4">Discover opportunities that match your skills and aspirations from top companies worldwide</p>
                        <div className="d-flex flex-wrap justify-content-center">
                            {["All Jobs", "Remote", "Full-time", "Part-time", "Contract"].map(filter => (
                                <button
                                    key={filter}
                                    className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                                    onClick={() => handleFilterChange(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Search */}
                <div className="container">
                    <header className="bg-white shadow-sm">
                        <div className="row align-items-center py-3">
                            <div className="col-md-12">
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        <i className="fas fa-search text-secondary"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-start-0"
                                        placeholder="Search for jobs, companies, or keywords..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </header>
                </div>

                {/* Jobs Section */}
                <section className="py-5">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="fw-bold">Featured Opportunities</h2>
                            <span className="text-muted">Showing {currentJobList.length} of {filteredJobs.length} jobs</span>
                        </div>

                        <div className="jobs-container">
                            {currentJobList.length > 0 ? (
                                <div className="row g-4">
                                    {currentJobList.map(job => (
                                        <div key={job?._id} className="col-md-6 col-lg-4">
                                            <div className="job-card">
                                                <div className="job-card-header">
                                                    <div className="company-info">
                                                        <div className="company-logo">
                                                            {getInitials(job?.company)}
                                                        </div>
                                                        <div className="job-meta">
                                                            <h5 className="job-title">{job?.title}</h5>
                                                            <p className="company-name">{job?.company}</p>
                                                        </div>
                                                    </div>
                                                    <div className="job-status">
                                                        {isRemoteJob(job?.location) && (
                                                            <span className="remote-badge">
                                                                <i className="fas fa-home me-1"></i>
                                                                Remote
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="job-card-body">
                                                    <div className="location-info">
                                                        <i className="fas fa-map-marker-alt"></i>
                                                        <span>{job?.location}</span>
                                                    </div>

                                                    <div className="skills-container">
                                                        {job?.skills?.slice(0, 3).map((skill, index) => (
                                                            <span key={index} className="skill-tag">{skill}</span>
                                                        ))}
                                                        {job?.skills?.length > 3 && (
                                                            <span className="skill-tag more">+{job.skills.length - 3}</span>
                                                        )}
                                                    </div>

                                                    <div className="job-type-container">
                                                        <span className={`job-type-badge ${getJobTypeClass(job.type)}`}>
                                                            {job?.type}
                                                        </span>

                                                        <div className="mt-2 d-flex justify-content-between align-items-center">
                                                            <small className="text-muted">
                                                                <i className="bi bi-calendar me-2"></i>
                                                                Posted {formatDateToRelative(job.posted)}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="job-card-footer">
                                                    <div className="salary-info">
                                                        <i className="fas fa-dollar-sign"></i>
                                                        <span>{job?.salary}</span>
                                                    </div>
                                                    <button
                                                        className="view-details-btn"
                                                        onClick={() => openJobModal(job._id)}
                                                    >
                                                        View Details
                                                        <i className="fas fa-arrow-right ms-2"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state-container">
                                    <div className="empty-state-card">
                                        <div className="empty-state-icon">
                                            <i className="bi bi-briefcase"></i>
                                        </div>
                                        <h4 className="empty-state-title">
                                            {searchTerm ? "No matching jobs found" : "No jobs available"}
                                        </h4>
                                        <p className="empty-state-description">
                                            {searchTerm ?
                                                "Try adjusting your search criteria or browse all opportunities" :
                                                "Check back later for new opportunities or adjust your filters"}
                                        </p>
                                        {searchTerm && (
                                            <button
                                                className="btn-clear-search"
                                                onClick={() => setSearchTerm("")}
                                            >
                                                Clear Search
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <nav>
                                    <ul className="pagination">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        {[...Array(totalPages)].map((_, index) => (
                                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => paginate(index + 1)}
                                                >
                                                    {index + 1}
                                                </button>
                                            </li>
                                        ))}
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
                        )}
                    </div>
                </section>

                {/* Job Details Modal */}
                {selectedJob && (
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="btn-close" onClick={closeJobModal}></button>
                                </div>

                                <div className="modal-body">
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="modal-company-logo me-3">
                                            {getInitials(selectedJob?.company)}
                                        </div>
                                        <div>
                                            <h2 className="modal-title">{selectedJob?.title}</h2>
                                            <p className="text-muted mb-0">{selectedJob?.company}</p>
                                        </div>
                                    </div>

                                    <div className="meta">
                                        <div className="modal-job-meta">
                                            <div className="meta-item">
                                                <i className="fas fa-map-marker-alt"></i>
                                                <span>{selectedJob?.location}</span>
                                            </div>
                                            <div className="meta-item">
                                                <i className="fas fa-briefcase"></i>
                                                <span>{selectedJob?.type}</span>
                                            </div>
                                            <div className="meta-item">
                                                <i className="fas fa-clock"></i>
                                                <span>{selectedJob?.experience}</span>
                                            </div>
                                            <div className="meta-item">
                                                <i className="fas fa-users"></i>
                                                <span>{selectedJob?.applicants} applicants</span>
                                            </div>
                                        </div>
                                        <small className="text-muted">
                                            <i className="bi bi-calendar me-2"></i>
                                            Posted {formatDateToRelative(selectedJob.posted)}
                                        </small>
                                    </div>

                                    <div className="modal-section">
                                        <h3>Job Description</h3>
                                        <p>{selectedJob?.description}</p>
                                    </div>

                                    <div className="modal-section">
                                        <h3>Requirements</h3>
                                        <ul>
                                            {selectedJob?.requirements?.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="modal-section">
                                        <h3>Skills Required</h3>
                                        <div>
                                            {selectedJob?.skills?.map((skill, index) => (
                                                <span key={index} className="job-tag">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer d-flex justify-content-between">
                                    <div className="fs-5 fw-bold text-primary">{selectedJob?.salary}</div>
                                    {hasAppliedToJob(selectedJob._id) || appliedJobsSet.has(selectedJob._id) ? (
                                        <button className="btn btn-success" disabled>
                                            <i className="fas fa-check me-2"></i>
                                            Applied
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleApply(selectedJob._id, selectedJob.userId)}
                                        >
                                            <i className="fas fa-paper-plane me-2"></i>
                                            Apply Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
        :root {
          --primary-color: #0d6efd;
          --secondary-color: #6c757d;
          --success-color: #198754;
          --info-color: #0dcaf0;
          --warning-color: #ffc107;
          --danger-color: #dc3545;
          --light-color: #f8f9fa;
          --dark-color: #212529;
        }
        
        .hero-section {
          background: linear-gradient(135deg, #0d6efd, #0dcaf0);
          color: white;
          padding: 3rem 0;
          text-align: center;
        }
        
        .job-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
        }
        
        .job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .company-logo {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e9ecef;
          color: #0d6efd;
          font-weight: 700;
          font-size: 1.2rem;
        }
        
        .modal-company-logo {
          width: 70px;
          height: 70px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e9ecef;
          color: #0d6efd;
          font-weight: 700;
          font-size: 1.5rem;
        }
        
        .job-tag {
          padding: 0.25rem 0.75rem;
          background-color: #e9ecef;
          border-radius: 50px;
          font-size: 0.85rem;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
          display: inline-block;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .apply-btn.applied {
          background-color: #198754;
          pointer-events: none;
        }
        
        .filter-btn {
          padding: 0.5rem 1.5rem;
          background-color: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          margin: 0.25rem;
        }
        
        .filter-btn:hover, .filter-btn.active {
          background-color: white;
          color: #0d6efd;
        }

        .meta {
           display: flex;
           align-items: center; 
           justify-content: space-between;  
           flex-wrap: wrap;
           gap: 1.5rem;
           margin-bottom: 1.5rem;
           padding-bottom: 1.5rem;
           border-bottom: 1px solid #dee2e6;
        }
        
        .modal-job-meta {
          display: flex;
          align-items: center;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
        }
        
        .meta-item i {
          margin-right: 0.5rem;
          color: #0d6efd;
        }
        
        .modal-section {
          margin-bottom: 1.5rem;
        }
        
        .modal-section h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #212529;
        }
        
        .modal-section p, .modal-section ul {
          color: #495057;
          line-height: 1.7;
        }
        
        .modal-section ul {
          padding-left: 1.5rem;
        }
        
        .modal-section li {
          margin-bottom: 0.5rem;
        }
        
        .pagination-container {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }
        
        .page-item {
          margin: 0 0.25rem;
        }

        .jobs-container {
            width: 100%;
        }

        .job-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            height: 100%;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
            border: 1px solid #f0f0f0;
        }

        .job-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .job-card-header {
            padding: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 1px solid #f0f0f0;
        }

        .company-info {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }

        .company-logo {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            background: linear-gradient(135deg, #0d6efd, #0b5ed7);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.2rem;
            box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
        }

        .job-meta {
            flex: 1;
        }

        .job-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
            color: #212529;
            line-height: 1.3;
        }

        .company-name {
            font-size: 0.9rem;
            color: #6c757d;
            margin-bottom: 0;
        }

        .job-status {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        .remote-badge {
            display: flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            background-color: rgba(13, 110, 253, 0.1);
            color: #0d6efd;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .job-card-body {
            padding: 1.5rem;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .location-info {
            display: flex;
            align-items: center;
            color: #6c757d;
            font-size: 0.9rem;
        }

        .location-info i {
            margin-right: 0.5rem;
            color: #0d6efd;
        }

        .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .skill-tag {
            padding: 0.25rem 0.75rem;
            background-color: #f8f9fa;
            color: #495057;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .skill-tag:hover {
            background-color: #e9ecef;
            transform: translateY(-2px);
        }

        .skill-tag.more {
            background-color: #e9ecef;
            color: #6c757d;
        }

        .job-type-container {
            margin-top: auto;
        }

        .job-type-badge {
            padding: 0.35rem 0.75rem;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 600;
            display: inline-block;
        }

        .job-card-footer {
            padding: 1.5rem;
            background-color: #f8f9fa;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .salary-info {
            display: flex;
            align-items: center;
            font-weight: 600;
            color: #0d6efd;
        }

        .salary-info i {
            margin-right: 0.5rem;
        }

        .view-details-btn {
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem;
            background-color: #0d6efd;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .view-details-btn:hover {
            background-color: #0b5ed7;
            transform: translateY(-2px);
        }

        .empty-state-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400px;
        }

        .empty-state-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            padding: 3rem;
            text-align: center;
            max-width: 500px;
            border: 1px solid #f0f0f0;
        }

        .empty-state-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            background-color: #f8f9fa;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6c757d;
            font-size: 2rem;
        }

        .empty-state-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #212529;
        }

        .empty-state-description {
            font-size: 1rem;
            color: #6c757d;
            margin-bottom: 1.5rem;
            line-height: 1.5;
        }

        .btn-clear-search {
            padding: 0.5rem 1.5rem;
            background-color: #0d6efd;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .btn-clear-search:hover {
            background-color: #0b5ed7;
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .job-card-header {
                flex-direction: column;
                gap: 1rem;
            }
            
            .job-status {
                align-items: flex-start;
            }
            
            .job-card-footer {
                flex-direction: column;
                gap: 1rem;
                align-items: flex-start;
            }
            
            .view-details-btn {
                width: 100%;
                justify-content: center;
            }
        }
      `}</style>
            </div>
        </>
    );
};

export default UserJobs;