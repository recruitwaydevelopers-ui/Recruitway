import { useEffect, useState } from 'react';
import { useCompanyContext } from '../../../context/company-context';
import { useNavigate } from 'react-router-dom';

const CandidateCard = ({ isOpen, candidate, onClose, candidateId, applicationId }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('skills');

    const { rejectShortlist } = useCompanyContext()

    if (!isOpen || !candidate) return null;

    const { fullname, gender, phone, email, headline, skills, experience, education, certifications, languages, profilePicture, status, lastActive } = candidate?.candidateProfile;

    const handleViewFullProfile = () => {
        navigate('/company/candidate-profile', { state: { candidate: candidate?.candidateProfile } });
    };

    return (
        <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-gradient-primary text-white border-0">
                        <div className="d-flex align-items-center">
                            <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                                <i className="ti ti-user fs-4"></i>
                            </div>
                            <div>
                                <h5 className="modal-title fw-bold mb-0">Candidate Application</h5>
                                <small className="opacity-75">Application #{candidate?.applicationId}</small>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body p-0">
                        <div className="row g-0">
                            {/* Left Sidebar */}
                            <div className="col-lg-4 bg-light p-4">
                                <div className="text-center mb-4">
                                    <div className="position-relative d-inline-block">
                                        <img
                                            src={profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(fullname) + '&background=random'}
                                            alt={fullname}
                                            className="rounded-circle border-4 border-white shadow"
                                            style={{
                                                width: '140px',
                                                height: '140px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <div className={`position-absolute bottom-0 end-0 badge rounded-circle p-2 ${status === 'Shortlisted' ? 'bg-success' :
                                            status === 'Rejected' ? 'bg-danger' :
                                                status === 'Applied' ? 'bg-info' : 'bg-secondary'
                                            }`}>
                                            <i className="ti ti-circle-filled fs-6"></i>
                                        </div>
                                    </div>
                                    <h4 className="mt-3 mb-1 fw-bold">{fullname}</h4>
                                    <p className="text-muted mb-3">{headline || 'No headline available'}</p>
                                    <span className={`badge rounded-pill px-3 py-2 ${status === 'Shortlisted' ? 'bg-success bg-opacity-10 text-success' :
                                        status === 'Rejected' ? 'bg-danger bg-opacity-10 text-danger' :
                                            status === 'Applied' ? 'bg-info bg-opacity-10 text-info' : 'bg-secondary bg-opacity-10 text-secondary'
                                        }`}>
                                        {status}
                                    </span>
                                </div>

                                <div className="border-top pt-4">
                                    <h6 className="fw-semibold mb-3 d-flex align-items-center">
                                        <i className="ti ti-phone me-2 text-primary"></i>
                                        Contact Information
                                    </h6>
                                    <ul className="list-unstyled">
                                        <li className="mb-3 d-flex align-items-start">
                                            <i className="ti ti-mail me-3 text-primary mt-1"></i>
                                            <div>
                                                <small className="text-muted d-block">Email</small>
                                                <span>{email || 'Not provided'}</span>
                                            </div>
                                        </li>
                                        <li className="mb-3 d-flex align-items-start">
                                            <i className="ti ti-phone me-3 text-primary mt-1"></i>
                                            <div>
                                                <small className="text-muted d-block">Phone</small>
                                                <span>{phone || 'Not provided'}</span>
                                            </div>
                                        </li>
                                        <li className="d-flex align-items-start">
                                            <i className="ti ti-gender-demiboy me-3 text-primary mt-1"></i>
                                            <div>
                                                <small className="text-muted d-block">Gender</small>
                                                <span>{gender || 'Not specified'}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="col-lg-8 p-4">
                                <ul className="nav nav-pills gap-2 mb-4 flex-wrap">
                                    <li className="nav-item">
                                        <button
                                            className={`btn ${activeTab === 'skills' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setActiveTab('skills')}
                                        >
                                            <i className="ti ti-tools me-2"></i>
                                            Skills
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`btn ${activeTab === 'experience' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setActiveTab('experience')}
                                        >
                                            <i className="ti ti-briefcase me-2"></i>
                                            Experience
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`btn ${activeTab === 'education' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setActiveTab('education')}
                                        >
                                            <i className="ti ti-school me-2"></i>
                                            Education
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`btn ${activeTab === 'job-description' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setActiveTab('job-description')}
                                        >
                                            <i className="ti ti-file-description me-2"></i>
                                            Job Details
                                        </button>
                                    </li>
                                </ul>

                                {activeTab === 'skills' && (
                                    <div>
                                        <div className="card border-0 shadow-sm mb-4">
                                            <div className="card-body">
                                                <h6 className="fw-semibold mb-3 d-flex align-items-center">
                                                    <i className="ti ti-tools me-2 text-primary"></i>
                                                    Technical Skills
                                                </h6>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {skills?.length ? skills.map((skill, idx) => (
                                                        <span key={idx} className="badge bg-primary bg-opacity-10 text-primary fw-normal py-2 px-3">
                                                            {skill.skills}
                                                        </span>
                                                    )) : (
                                                        <span className="text-muted">No skills listed</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card border-0 shadow-sm">
                                            <div className="card-body">
                                                <h6 className="fw-semibold mb-3 d-flex align-items-center">
                                                    <i className="ti ti-language me-2 text-primary"></i>
                                                    Languages
                                                </h6>
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
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'experience' && (
                                    <div>
                                        {experience?.length > 0 ? (
                                            <div className="timeline">
                                                {experience.map((job, idx) => (
                                                    <div key={idx} className="timeline-item">
                                                        <div className="timeline-dot bg-primary"></div>
                                                        <div className="timeline-content">
                                                            <div className="card border-0 shadow-sm">
                                                                <div className="card-body">
                                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                                        <div>
                                                                            <h6 className="fw-semibold mb-1">{job.title}</h6>
                                                                            <p className="mb-1 text-primary">{job.company}</p>
                                                                            <small className="text-muted d-block mb-1">
                                                                                <i className="ti ti-calendar me-1"></i>
                                                                                {job.startDate} - {job.endDate || 'Present'}
                                                                            </small>
                                                                            <small className="text-muted d-block">
                                                                                <i className="ti ti-map-pin me-1"></i>
                                                                                {job.location}
                                                                            </small>
                                                                        </div>
                                                                        {job.current && (
                                                                            <span className="badge bg-success bg-opacity-10 text-success">Current</span>
                                                                        )}
                                                                    </div>
                                                                    {job.description && (
                                                                        <p className="mt-3 text-muted">{job.description}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-5">
                                                <div className="bg-light rounded-circle p-3 d-inline-block mb-3">
                                                    <i className="ti ti-briefcase-off fs-1 text-muted"></i>
                                                </div>
                                                <h5 className="text-muted">No work experience added yet</h5>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'education' && (
                                    <div>
                                        {education?.length > 0 ? (
                                            <div className="timeline">
                                                {education.map((edu, idx) => (
                                                    <div key={idx} className="timeline-item">
                                                        <div className="timeline-dot bg-success"></div>
                                                        <div className="timeline-content">
                                                            <div className="card border-0 shadow-sm">
                                                                <div className="card-body">
                                                                    <h6 className="fw-semibold mb-1">{edu.degree}</h6>
                                                                    <p className="mb-1 text-primary">{edu.institution}</p>
                                                                    <small className="text-muted d-block mb-1">
                                                                        <i className="ti ti-calendar me-1"></i>
                                                                        {edu.startYear} - {edu.endYear || 'Present'}
                                                                    </small>
                                                                    {edu.fieldOfStudy && (
                                                                        <small className="text-muted">
                                                                            <i className="ti ti-book me-1"></i>
                                                                            Field: {edu.fieldOfStudy}
                                                                        </small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-5">
                                                <div className="bg-light rounded-circle p-3 d-inline-block mb-3">
                                                    <i className="ti ti-school fs-1 text-muted"></i>
                                                </div>
                                                <h5 className="text-muted">No education information added yet</h5>
                                            </div>
                                        )}

                                        {certifications?.length > 0 && (
                                            <div className="mt-4">
                                                <h6 className="fw-semibold mb-3 d-flex align-items-center">
                                                    <i className="ti ti-certificate me-2 text-primary"></i>
                                                    Certifications
                                                </h6>
                                                <div className="row g-3">
                                                    {certifications.map((cert, idx) => (
                                                        <div key={idx} className="col-md-6">
                                                            <div className="card border-0 shadow-sm h-100">
                                                                <div className="card-body">
                                                                    <h6 className="fw-semibold mb-1">{cert.certificates}</h6>
                                                                    <p className="mb-1 small text-primary">{cert.issuer}</p>
                                                                    <small className="text-muted">
                                                                        <i className="ti ti-calendar me-1"></i>
                                                                        {cert.year}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "job-description" && candidate?.jobDetails && (
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <h6 className="fw-semibold mb-3 d-flex align-items-center">
                                                <i className="ti ti-file-description me-2 text-primary"></i>
                                                Job Information
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <div className="d-flex align-items-start">
                                                        <i className="ti ti-briefcase me-2 text-muted mt-1"></i>
                                                        <div>
                                                            <small className="text-muted d-block">Title</small>
                                                            <span>{candidate.jobDetails.title || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="d-flex align-items-start">
                                                        <i className="ti ti-building me-2 text-muted mt-1"></i>
                                                        <div>
                                                            <small className="text-muted d-block">Company</small>
                                                            <span>{candidate.jobDetails.company || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="d-flex align-items-start">
                                                        <i className="ti ti-map-pin me-2 text-muted mt-1"></i>
                                                        <div>
                                                            <small className="text-muted d-block">Location</small>
                                                            <span>{candidate.jobDetails.location || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="d-flex align-items-start">
                                                        <i className="ti ti-currency-dollar me-2 text-muted mt-1"></i>
                                                        <div>
                                                            <small className="text-muted d-block">Salary</small>
                                                            <span>{candidate.jobDetails.salary || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="d-flex align-items-start">
                                                        <i className="ti ti-clock me-2 text-muted mt-1"></i>
                                                        <div>
                                                            <small className="text-muted d-block">Type</small>
                                                            <span>{candidate.jobDetails.type || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="d-flex align-items-start">
                                                        <i className="ti ti-chart-bar me-2 text-muted mt-1"></i>
                                                        <div>
                                                            <small className="text-muted d-block">Experience</small>
                                                            <span>{candidate.jobDetails.experience || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer bg-light d-flex flex-column flex-md-row justify-content-between align-items-center p-4 border-top">
                        <button
                            className="btn btn-outline-secondary mb-2 mb-md-0"
                            onClick={onClose}
                        >
                            <i className="ti ti-x me-2"></i>
                            Close
                        </button>
                        <div className="d-flex gap-2 flex-wrap">
                            <button
                                className="btn btn-primary"
                                onClick={handleViewFullProfile}
                            >
                                <i className="ti ti-user me-2"></i>
                                View Full Profile
                            </button>
                            <button className="btn btn-success" onClick={() => { rejectShortlist("Shortlisted", candidateId, applicationId); onClose(); }} disabled={candidate.status === "Interview Scheduled"}>
                                <i className="ti ti-check me-2"></i>
                                Shortlist
                            </button>
                            <button className="btn btn-outline-danger" onClick={() => { rejectShortlist("Rejected", candidateId, applicationId); onClose(); }} disabled={candidate.status === "Interview Scheduled"}>
                                <i className="ti ti-x me-2"></i>
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
        <div className="container-fluid">
            <div className="container">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                                <div>
                                    <h2 className="fw-bold mb-1">Candidate Profiles</h2>
                                    <p className="text-muted mb-0">Find and manage your candidates</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="position-relative">
                                        <input
                                            type="text"
                                            className="form-control ps-5"
                                            placeholder="Search candidates..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <i className="ti ti-search position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <select
                                        className="form-select"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        {uniqueStatuses.map((status, index) => (
                                            <option key={index} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <select
                                        className="form-select"
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                    >
                                        {uniqueLocations.map((location, index) => (
                                            <option key={index} value={location}>{location}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <select
                                        className="form-select"
                                        value={experienceFilter}
                                        onChange={(e) => setExperienceFilter(e.target.value)}
                                    >
                                        {uniqueExperiences.map((exp, index) => (
                                            <option key={index} value={exp}>{exp}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <button className="btn btn-outline-secondary w-100" onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter("All");
                                        setLocationFilter("All");
                                        setExperienceFilter("All");
                                    }}>
                                        <i className="ti ti-refresh me-2"></i>
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="row">
                    <div className="col-12">
                        <div className="bg-white rounded-3 shadow-sm">
                            {isLoading ? (
                                <div className="p-5 text-center">
                                    <div className="spinner-border text-primary mb-3" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="text-muted">Loading candidates...</p>
                                </div>
                            ) : currentCandidateList.length === 0 ? (
                                <div className="p-5 text-center">
                                    <div className="bg-light rounded-circle p-3 d-inline-block mb-3">
                                        <i className="ti ti-users fs-1 text-muted"></i>
                                    </div>
                                    <h5 className="text-muted">No candidates found</h5>
                                    <p className="text-muted">Try adjusting your search filters</p>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop View */}
                                    <div className="table-responsive d-none d-lg-block">
                                        <table className="table table-hover mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="fw-semibold text-muted py-3">Candidate</th>
                                                    <th className="fw-semibold text-muted py-3">Position</th>
                                                    <th className="fw-semibold text-muted py-3">Contact</th>
                                                    <th className="fw-semibold text-muted py-3">Status</th>
                                                    <th className="fw-semibold text-muted py-3 text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentCandidateList.map((candidate) => (
                                                    <tr key={candidate?.applicationId} className="border-bottom candidate-row">
                                                        <td className="px-4 py-4">
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-shrink-0">
                                                                    <div className="candidate-avatar">
                                                                        {candidate.candidateProfile?.fullname?.charAt(0).toUpperCase()}
                                                                    </div>
                                                                </div>
                                                                <div className="ms-3">
                                                                    <h6 className="mb-1 fw-semibold">{candidate.candidateProfile?.fullname}</h6>
                                                                    <small className="text-muted">Application #{candidate?.applicationId}</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3">
                                                            <div>
                                                                <div className="fw-medium">{candidate?.jobDetails?.title || 'N/A'}</div>
                                                                <small className="text-muted">
                                                                    <i className="ti ti-map-pin me-1"></i>
                                                                    {candidate?.candidateProfile?.location || 'N/A'}
                                                                </small>
                                                            </div>
                                                        </td>
                                                        <td className="py-3">
                                                            <div className="contact-info">
                                                                <div className="mb-1">
                                                                    <i className="ti ti-phone me-2 text-muted"></i>
                                                                    <span>{candidate?.candidateProfile?.phone || 'N/A'}</span>
                                                                </div>
                                                                {candidate?.candidateProfile?.resume && (
                                                                    <div>
                                                                        <a href={candidate?.candidateProfile?.resume} target="_blank" rel="noopener noreferrer"
                                                                            className="text-primary text-decoration-none small">
                                                                            <i className="ti ti-file-text me-1"></i>
                                                                            Resume
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className={`status-badge ${candidate?.status?.toLowerCase()}`}>
                                                                {candidate?.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-center">
                                                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewCandidate(candidate, candidate.applicationJobId)} title="View Details">
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile View */}
                                    <div className="d-lg-none p-3">
                                        {currentCandidateList.map((candidate) => (
                                            <div key={candidate?.applicationId} className="mobile-candidate-card mb-3">
                                                <div className="p-3">
                                                    {/* Header */}
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="mobile-avatar me-3">
                                                                {candidate.candidateProfile?.fullname?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <h6 className="mb-0 fw-semibold">{candidate.candidateProfile?.fullname}</h6>
                                                            </div>
                                                        </div>
                                                        <span className={`status-badge ${candidate?.status?.toLowerCase()}`}>
                                                            {candidate?.status}
                                                        </span>
                                                    </div>

                                                    {/* Position */}
                                                    <div className="mb-3">
                                                        <div className="fw-medium mb-1">{candidate?.jobDetails?.title || 'N/A'}</div>
                                                        <small className="text-muted">
                                                            <i className="ti ti-map-pin me-1"></i>
                                                            {candidate?.candidateProfile?.location || 'N/A'}
                                                        </small>
                                                    </div>

                                                    {/* Contact */}
                                                    <div className="mb-3">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <i className="ti ti-phone text-muted me-2"></i>
                                                            <span>{candidate?.candidateProfile?.phone || 'N/A'}</span>
                                                        </div>
                                                        {candidate?.candidateProfile?.resume && (
                                                            <a href={candidate?.candidateProfile?.resume} target="_blank" rel="noopener noreferrer"
                                                                className="text-primary text-decoration-none small">
                                                                <i className="ti ti-file-text me-1"></i>
                                                                View Resume
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* Action */}
                                                    <div className="d-grid">
                                                        <button className="btn btn-primary"
                                                            onClick={() => handleViewCandidate(candidate, candidate.applicationJobId)}>
                                                            <i className="ti ti-eye me-2"></i>
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="bg-white rounded-3 shadow-sm p-3">
                            <nav aria-label="Page navigation">
                                <ul className="pagination justify-content-center mb-0">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <i className="ti ti-chevron-left"></i>
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
                                            <i className="ti ti-chevron-right"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
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

            <style jsx>{`
                .candidate-avatar {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                .mobile-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 1rem;
                }

                .candidate-row {
                    transition: all 0.2s ease;
                }

                .candidate-row:hover {
                    background-color: #f8f9ff;
                }

                .candidate-row:hover .candidate-avatar {
                    transform: scale(1.05);
                }

                .status-badge {
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .status-badge.applied {
                    background-color: #e3f2fd;
                    color: #1976d2;
                }

                .status-badge.shortlisted {
                    background-color: #e8f5e8;
                    color: #2e7d32;
                }

                .status-badge.rejected {
                    background-color: #ffebee;
                    color: #c62828;
                }

                .status-badge.hired {
                    background-color: #e8f5e8;
                    color: #2e7d32;
                }

                .mobile-candidate-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    border: 1px solid #f0f0f0;
                }

                .mobile-candidate-card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
                    transform: translateY(-2px);
                }

                .contact-info {
                    font-size: 0.9rem;
                }

                .timeline {
                    position: relative;
                    padding-left: 30px;
                }

                .timeline::before {
                    content: '';
                    position: absolute;
                    left: 10px;
                    top: 0;
                    height: 100%;
                    width: 2px;
                    background: #e9ecef;
                }

                .timeline-item {
                    position: relative;
                    margin-bottom: 30px;
                }

                .timeline-dot {
                    position: absolute;
                    left: -25px;
                    top: 5px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: 2px solid white;
                }

                .timeline-content {
                    width: 100%;
                }

                .bg-gradient-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                @media (max-width: 576px) {
                    .mobile-candidate-card {
                        margin-bottom: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default CompanyCandidate;
