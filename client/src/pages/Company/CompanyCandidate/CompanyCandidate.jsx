import React, { useEffect, useState } from 'react';
import { useCompanyContext } from '../../../context/company-context';
import { useNavigate } from 'react-router-dom';

const CandidateCard = ({ isOpen, candidate, onClose, candidateId, applicationId }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('skills');

    const { rejectShortlist } = useCompanyContext()

    if (!isOpen || !candidate) return null;

    const { fullname, gender, phone, email, headline, skills, experience, education, certifications, languages, profilePicture, status, lastActive } = candidate?.candidateProfile;

    // console.log(fullname, gender, phone, email, headline, skills, experience, education, certifications, languages, profilePicture, status, lastActive);

    const handleViewFullProfile = () => {
        navigate('/company/candidate-profile', { state: { candidate: candidate?.candidateProfile } });
    };

    return (
        <>
            <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header px-4 py-3 bg-primary">
                            <h5 className="modal-title fs-5 fw-semibold text-white">Candidate Application</h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onClose}
                                aria-label="Close"
                            ></button>
                        </div>

                        <div className="modal-body p-0">
                            <div className="d-flex flex-column flex-md-row">
                                {/* Left Sidebar */}
                                <div className="col-md-4 p-4 bg-light">
                                    <div className="text-center mb-4">
                                        <img
                                            src={profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(fullname) + '&background=random'}
                                            alt={fullname}
                                            className="rounded-circle border shadow-sm"
                                            style={{
                                                width: '120px',
                                                height: '120px',
                                                objectFit: 'cover',
                                                border: '3px solid white'
                                            }}
                                        />
                                        <h4 className="mt-3 mb-1 fw-bold">{fullname}</h4>
                                        <p className="text-muted mb-3">{headline || 'No headline available'}</p>

                                    </div>

                                    <div className="border-top pt-3">
                                        <h6 className="fw-semibold mb-3">Contact Information</h6>
                                        <ul className="list-unstyled">
                                            <li className="mb-2 d-flex align-items-center">
                                                <i className="ti ti-mail me-2 text-primary"></i>
                                                <small>{email || 'Not provided'}</small>
                                            </li>
                                            <li className="mb-2 d-flex align-items-center">
                                                <i className="ti ti-phone me-2 text-primary"></i>
                                                <small>{phone || 'Not provided'}</small>
                                            </li>
                                            <li className="d-flex align-items-center">
                                                <i className="ti ti-gender-demiboy me-2 text-primary"></i>
                                                <small>{gender || 'Not specified'}</small>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="col-md-8 p-4">
                                    <ul className="nav nav-pills gap-2 mb-4">
                                        <li className="nav-item">
                                            <button
                                                className={`btn btn-sm ${activeTab === 'skills' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => setActiveTab('skills')}
                                            >
                                                Skills
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`btn btn-sm ${activeTab === 'experience' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => setActiveTab('experience')}
                                            >
                                                Experience
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`btn btn-sm ${activeTab === 'education' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => setActiveTab('education')}
                                            >
                                                Education
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`btn btn-sm ${activeTab === 'job-description' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => setActiveTab('job-description')}
                                            >
                                                Job Description
                                            </button>
                                        </li>
                                    </ul>

                                    {activeTab === 'skills' && (
                                        <div>
                                            <h6 className="fw-semibold mb-3">Technical Skills</h6>
                                            <div className="d-flex flex-wrap gap-2 mb-4">
                                                {skills?.length ? skills.map((skill, idx) => (
                                                    <span key={idx} className="badge bg-primary bg-opacity-10 text-primary fw-normal py-2 px-3">
                                                        {skill.skills}
                                                    </span>
                                                )) : (
                                                    <span className="text-muted">No skills listed</span>
                                                )}
                                            </div>

                                            <h6 className="fw-semibold mb-3">Languages</h6>
                                            <div className="d-flex flex-wrap gap-2">
                                                {languages?.length ? languages.map((lang, idx) => (
                                                    <span key={idx} className="badge bg-secondary bg-opacity-10 text-secondary fw-normal py-2 px-3">
                                                        {lang.languages}
                                                    </span>
                                                )) : (
                                                    <span className="text-muted">No languages listed</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'experience' && (
                                        <div>
                                            {experience?.length > 0 ? (
                                                <ul className="list-unstyled">
                                                    {experience.map((job, idx) => (
                                                        <li key={idx} className="mb-4 pb-3 border-bottom">
                                                            <div className="d-flex justify-content-between">
                                                                <div>
                                                                    <h6 className="fw-semibold mb-1">{job.title}</h6>
                                                                    <p className="mb-1">{job.company}</p>
                                                                    <small className="text-muted d-block mb-1">
                                                                        {job.startDate} - {job.endDate || 'Present'} • {job.duration}
                                                                    </small>
                                                                    <small className="text-muted">{job.location}</small>
                                                                </div>
                                                                {job.current && (
                                                                    <span className="badge bg-success bg-opacity-10 text-success h-25">Current</span>
                                                                )}
                                                            </div>
                                                            {job.description && (
                                                                <p className="mt-2 text-muted small">{job.description}</p>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <i className="ti ti-briefcase-off fs-1 text-muted mb-3"></i>
                                                    <p className="text-muted">No work experience added yet</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'education' && (
                                        <div>
                                            {education?.length > 0 ? (
                                                <ul className="list-unstyled">
                                                    {education.map((edu, idx) => (
                                                        <li key={idx} className="mb-4 pb-3 border-bottom">
                                                            <h6 className="fw-semibold mb-1">{edu.degree}</h6>
                                                            <p className="mb-1">{edu.institution}</p>
                                                            <small className="text-muted d-block mb-1">
                                                                {edu.startYear} - {edu.endYear || 'Present'}
                                                            </small>
                                                            {edu.fieldOfStudy && (
                                                                <small className="text-muted">Field: {edu.fieldOfStudy}</small>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <i className="ti ti-school fs-1 text-muted mb-3"></i>
                                                    <p className="text-muted">No education information added yet</p>
                                                </div>
                                            )}

                                            {certifications?.length > 0 && (
                                                <>
                                                    <h6 className="fw-semibold mb-3 mt-4">Certifications</h6>
                                                    <ul className="list-unstyled">
                                                        {certifications.map((cert, idx) => (
                                                            <li key={idx} className="mb-3">
                                                                <h6 className="fw-semibold mb-1">{cert.certificates}</h6>
                                                                <p className="mb-1 small">{cert.issuer}</p>
                                                                <p className="mb-1 small">{cert.year}</p>
                                                                <small className="text-muted">{cert.issueDate} - {cert.expirationDate || 'No expiration'}</small>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "job-description" && candidate?.jobDetails && (
                                        <div className="p-4 bg-light rounded">
                                            <h4 className="fw-bold mb-3">Job Information</h4>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <strong>Title:</strong> {candidate.jobDetails.title || 'N/A'}
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>Company:</strong> {candidate.jobDetails.company || 'N/A'}
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>Location:</strong> {candidate.jobDetails.location || 'N/A'}
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>Salary:</strong> {candidate.jobDetails.salary || 'N/A'}
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>Type:</strong> {candidate.jobDetails.type || 'N/A'}
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>Experience:</strong> {candidate.jobDetails.experience || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light d-flex flex-column flex-md-row justify-content-between align-items-center p-4 border-top">
                            <button
                                className="btn btn-sm btn-outline-secondary mb-2 mb-md-0"
                                onClick={onClose}
                            >
                                Close
                            </button>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={handleViewFullProfile}
                                >
                                    <i className="ti ti-user me-2"></i>
                                    View Full Profile
                                </button>
                                <button className="btn btn-sm btn-success" onClick={() => { rejectShortlist("Shortlisted", candidateId, applicationId); onClose(); }}>
                                    <i className="ti ti-check me-2"></i>
                                    Shortlist
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => { rejectShortlist("Rejected", candidateId, applicationId); onClose(); }}>
                                    <i className="ti ti-x me-2"></i>
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


const CompanyCandidate = () => {
    const [isCandidateApplicationOpen, setIsCandidateApplicationOpen] = useState(false)
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [candidateId, setCandidateId] = useState(null);
    const [applicationId, setApplicationId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { getAllApplicantsOnAllJob, isLoading, allAppliedCandidates } = useCompanyContext()


    const handleViewCandidate = (candidate, applicationId) => {
        setIsCandidateApplicationOpen(true);
        setSelectedCandidate(candidate);
        setCandidateId(candidate?.candidateProfile?.userId);
        setApplicationId(applicationId)
    };

    const handleModalClose = () => {
        setIsCandidateApplicationOpen(false);
        setSelectedCandidate(null);
        setCandidateId(null)
        setApplicationId(null)
    };


    useEffect(() => {
        getAllApplicantsOnAllJob()
    }, [selectedCandidate])

    const [statusFilter, setStatusFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('All');
    const [experienceFilter, setExperienceFilter] = useState('All');

    const filteredCandidates = allAppliedCandidates.filter(candidate => {
        const matchesSearch =
            candidate?.jobDetails?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate?.jobDetails?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate?.jobDetails?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate?.jobDetails?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate?.jobDetails?.experience?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate?.candidateProfile?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate?.candidateProfile?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate?.candidateProfile?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate?.candidateProfile?.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate?.candidateProfile?.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate?.candidateProfile?.skills?.some(skillObj =>
                skillObj.skills?.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            candidate?.candidateProfile?.languages?.some(langObj =>
                langObj.languages?.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            candidate?.candidateProfile?.certifications?.some(certObj =>
                certObj.certificates?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certObj.issuer?.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            candidate?.candidateProfile?.projects?.some(projectObj =>
                projectObj.projects?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                projectObj.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const matchesStatus = statusFilter === 'All' || candidate.status === statusFilter;
        const matchesLocation = locationFilter === 'All' || candidate?.candidateProfile?.location === locationFilter;
        const matchesExperience = experienceFilter === 'All' || candidate?.jobDetails?.experience === experienceFilter;

        return matchesSearch && matchesStatus && matchesLocation && matchesExperience;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const candidateListPerPage = 10;

    // Pagination logic
    const indexOfLastCandidateList = currentPage * candidateListPerPage;
    const indexOfFirstCandidateList = indexOfLastCandidateList - candidateListPerPage;
    const currentCandidateList = filteredCandidates.slice(indexOfFirstCandidateList, indexOfLastCandidateList);
    const totalPages = Math.ceil(filteredCandidates.length / candidateListPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const uniqueStatuses = ['All', ...new Set(allAppliedCandidates.map(c => c.status).filter(Boolean))];
    const uniqueLocations = ['All', ...new Set(allAppliedCandidates.map(c => c?.candidateProfile?.location).filter(Boolean))];
    const uniqueExperiences = ['All', ...new Set(allAppliedCandidates.map(c => c?.jobDetails?.experience).filter(Boolean))];



    return (
        <>
            <div className="container-fluid">
                <div className="container py-3 py-md-4">
                    {/* Header */}
                    <div className="d-flex flex-column justify-content-between align-items-stretch mb-4 gap-3">
                        <div className="mb-3 mb-md-0">
                            <h2 className="fw-bold mb-1">Candidate Profiles</h2>
                            <p className="text-muted mb-0">Find and manage your candidates</p>
                        </div>

                        <div className="d-flex flex-column flex-md-row gap-3 w-100 w-md-auto flex-wrap">
                            {/* Search Input */}
                            <div className="position-relative flex-grow-1">
                                <input
                                    type="text"
                                    className="form-control form-control-sm ps-5"
                                    placeholder="Search candidates..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <i className="ti ti-search position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
                            </div>

                            {/* Status Filter */}
                            <select
                                className="form-select form-select-sm w-auto"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                {uniqueStatuses.map((status, index) => (
                                    <option key={index} value={status}>{status}</option>
                                ))}
                            </select>

                            {/* Location Filter */}
                            <select
                                className="form-select form-select-sm w-auto"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            >
                                {uniqueLocations.map((location, index) => (
                                    <option key={index} value={location}>{location}</option>
                                ))}
                            </select>

                            {/* Experience Filter */}
                            <select
                                className="form-select form-select-sm w-auto"
                                value={experienceFilter}
                                onChange={(e) => setExperienceFilter(e.target.value)}
                            >
                                {uniqueExperiences.map((exp, index) => (
                                    <option key={index} value={exp}>{exp}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="row">
                        <div className="col-12">
                            <div className="table-responsive">
                                {/* Desktop Table (hidden on mobile) */}
                                <table className="table table-striped table-hover d-none d-lg-table">
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ minWidth: '150px' }}>Candidate</th>
                                            <th style={{ minWidth: '150px' }}>Applied For</th>
                                            <th style={{ minWidth: '120px' }}>Location</th>
                                            <th style={{ minWidth: '120px' }}>Phone</th>
                                            <th style={{ width: '120px' }}>Status</th>
                                            <th style={{ minWidth: '120px' }}>Resume</th>
                                            <th style={{ minWidth: '100px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-4">
                                                    <div className="d-flex justify-content-center align-items-center gap-2">
                                                        <div className="spinner-border spinner-border-sm" role="status"></div>
                                                        <span>Loading candidates...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : currentCandidateList.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-4 text-muted">
                                                    No candidates found.
                                                </td>
                                            </tr>
                                        ) : (
                                            currentCandidateList.map((candidate) => (
                                                <tr key={candidate?.applicationId}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div>
                                                                <div>{candidate.candidateProfile?.fullname}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{candidate?.jobDetails?.title || <span className="text-muted">N/A</span>}</td>
                                                    <td>{candidate?.candidateProfile?.location || <span className="text-muted">N/A</span>}</td>
                                                    <td>{candidate?.candidateProfile?.phone || <span className="text-muted">N/A</span>}</td>
                                                    <td>
                                                        <span style={{ width: '120px' }} className={`badge ${candidate?.status === 'Shortlisted' ? 'bg-success' :
                                                            candidate?.status === 'Rejected' ? 'bg-danger' :
                                                                candidate?.status === 'Applied' ? 'bg-info' : 'bg-secondary'
                                                            }`}>
                                                            {candidate?.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {candidate?.candidateProfile?.resume ? (
                                                            <a href={candidate?.candidateProfile?.resume} target="_blank" rel="noopener noreferrer" className="text-nowrap">
                                                                View Resume
                                                            </a>
                                                        ) : (
                                                            <span className="text-muted">No resume</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewCandidate(candidate, candidate.applicationJobId)}>
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>

                                {/* Mobile Cards (hidden on desktop) */}
                                <div className="d-lg-none">
                                    {isLoading ? (
                                        <div className="text-center py-4">
                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                <div className="spinner-border spinner-border-sm" role="status"></div>
                                                <span>Loading candidates...</span>
                                            </div>
                                        </div>
                                    ) : currentCandidateList.length === 0 ? (
                                        <div className="text-center py-4 text-muted">
                                            No candidates found.
                                        </div>
                                    ) : (
                                        currentCandidateList.map((candidate) => (
                                            <div key={candidate?.applicationId} className="card mb-3">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <div>
                                                            <h6 className="mb-0">{candidate.candidateProfile?.fullname}</h6>
                                                            <small className="text-muted">{candidate?.jobDetails?.title || 'N/A'}</small>
                                                        </div>
                                                        <span className={`badge ${candidate?.status === 'hired' ? 'bg-success' :
                                                            candidate?.status === 'rejected' ? 'bg-danger' :
                                                                candidate?.status === 'shortlisted' ? 'bg-info' : 'bg-secondary'
                                                            }`}>
                                                            {candidate?.status}
                                                        </span>
                                                    </div>

                                                    <div className="mb-2">
                                                        <div className="d-flex align-items-center mb-1">
                                                            <i className="bi bi-geo-alt me-2"></i>
                                                            <span>{candidate?.candidateProfile?.location || 'N/A'}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center mb-1">
                                                            <i className="bi bi-telephone me-2"></i>
                                                            <span>{candidate?.candidateProfile?.phone || 'N/A'}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center mb-1">
                                                            <i className="bi bi-file-earmark-text me-2"></i>
                                                            {candidate?.candidateProfile?.resume ? (
                                                                <a href={candidate?.candidateProfile?.resume} target="_blank" rel="noopener noreferrer">
                                                                    View Resume
                                                                </a>
                                                            ) : (
                                                                <span className="text-muted">No resume</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary flex-grow-1"
                                                            onClick={() => handleViewCandidate(candidate, candidate.applicationJobId)}
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expanded View */}
                    {isCandidateApplicationOpen && selectedCandidate && (
                        <CandidateCard
                            isOpen={isCandidateApplicationOpen}
                            candidate={selectedCandidate}
                            onClose={handleModalClose}
                            candidateId={candidateId}
                            applicationId={applicationId}
                        />
                    )}

                    {/* Pagination */}
                    <nav aria-label="Page navigation" className="mt-4">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
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

export default CompanyCandidate;
