import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompanyContext } from '../../../context/company-context';
import formatDateToRelative from '../../../Helper/dateFormatter';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';

const JobPostCard = ({ isOpen, job, onClose, setJobPostOpen }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedJob, setEditedJob] = useState({ ...job });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const { handleJobEdit, handleConfirmDeleteJob } = useCompanyContext();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedJob(prev => ({ ...prev, [name]: value }));
    };

    const handleRequirementsChange = (e, index) => {
        const newRequirements = [...editedJob.requirements];
        newRequirements[index] = e.target.value;
        setEditedJob(prev => ({ ...prev, requirements: newRequirements }));
    };

    const handleSkillsChange = (e, index) => {
        const newSkills = [...editedJob.skills];
        newSkills[index] = e.target.value;
        setEditedJob(prev => ({ ...prev, skills: newSkills }));
    };

    const addRequirement = () => {
        setEditedJob(prev => ({
            ...prev,
            requirements: [...prev.requirements, ""]
        }));
    };

    const deleteRequirement = (index) => {
        const newRequirements = [...editedJob.requirements];
        newRequirements.splice(index, 1);
        setEditedJob(prev => ({
            ...prev,
            requirements: newRequirements
        }));
    };

    const addSkill = () => {
        setEditedJob(prev => ({
            ...prev,
            skills: [...prev.skills, ""]
        }));
    };

    const deleteSkill = (index) => {
        const newSkills = [...editedJob.skills];
        newSkills.splice(index, 1);
        setEditedJob(prev => ({
            ...prev,
            skills: newSkills
        }));
    };

    const handleEdit = async () => {
        setIsSaving(true);
        setError(null);
        try {
            await handleJobEdit(editedJob._id, editedJob);
            setJobPostOpen(false)
            setEditMode(false);
        } catch (err) {
            setError("Failed to save changes. Please try again.");
            console.error("Failed to edit job:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedJob({ ...job });
        setEditMode(false);
        setError(null);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);

    const handleDeleteJobModal = (jobId) => {
        setJobToDelete(jobId);
        setIsModalOpen(true);
    };

    const handleDeleteJob = async () => {
        setIsDeleting(true);
        try {
            await handleConfirmDeleteJob(jobToDelete);
            setIsModalOpen(false);
            setJobPostOpen(false);
        } catch (error) {
            setError("Failed to delete job. Please try again.");
            console.error("Failed to delete job:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setJobToDelete(null);
    };

    // Fixed destructuring to use the correct data source
    const { title, company, location, salary, type, experience, posted, description, requirements, skills, applicants, status } =
        editMode ? editedJob : job;

    if (!isOpen) return null;

    return (
        <>
            <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header bg-primary text-white border-0">
                            <div className="d-flex align-items-center">
                                <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                                    <i className="ti ti-briefcase text-dark fs-4"></i>
                                </div>
                                <div>
                                    <h5 className="modal-title fw-bold mb-0 text-light">Job Post Details</h5>
                                    <small className="opacity-75">ID: {job._id}</small>
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
                            {error && (
                                <div className="alert alert-danger m-3" role="alert">
                                    {error}
                                </div>
                            )}

                            <div className="row g-0">
                                {/* Left Sidebar */}
                                <div className="col-lg-4 bg-light p-4">
                                    <div className="text-center mb-4">
                                        <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                                            <i className="ti ti-briefcase fs-1 text-primary"></i>
                                        </div>
                                        {editMode ? (
                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={title}
                                                    onChange={handleInputChange}
                                                    className="form-control text-center fw-bold fs-4"
                                                    placeholder="Enter job title"
                                                />
                                                <input
                                                    type="text"
                                                    name="company"
                                                    value={company}
                                                    onChange={handleInputChange}
                                                    className="form-control text-center mt-2"
                                                    placeholder="Enter company name"
                                                />
                                                <select
                                                    name="status"
                                                    value={status}
                                                    onChange={handleInputChange}
                                                    className="form-select mt-2"
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                    <option value="Draft">Draft</option>
                                                    <option value="Closed">Closed</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <>
                                                <h4 className="mb-1 fw-bold">{title}</h4>
                                                <p className="text-muted mb-0">{company}</p>
                                                <span className={`badge rounded-pill px-3 py-2 ${status === 'Active' ? 'bg-success bg-opacity-10 text-success' :
                                                    status === 'Inactive' ? 'bg-danger bg-opacity-10 text-danger' :
                                                        status === 'Draft' ? 'bg-secondary bg-opacity-10 text-secondary' : 'bg-warning bg-opacity-10 text-warning'
                                                    }`}>
                                                    {status}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div className="border-top pt-4">
                                        <h6 className="fw-semibold mb-3">Job Information</h6>
                                        <ul className="list-unstyled">
                                            <li className="mb-3 d-flex align-items-start">
                                                <i className="ti ti-map-pin me-2 text-primary mt-1"></i>
                                                <div className="w-100">
                                                    <small className="text-muted d-block">Location</small>
                                                    {editMode ? (
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            value={location}
                                                            onChange={handleInputChange}
                                                            className="form-control form-control-sm"
                                                            placeholder="Enter location"
                                                        />
                                                    ) : (
                                                        <span>{location}</span>
                                                    )}
                                                </div>
                                            </li>
                                            <li className="mb-3 d-flex align-items-start">
                                                <i className="ti ti-currency-dollar me-2 text-primary mt-1"></i>
                                                <div className="w-100">
                                                    <small className="text-muted d-block">Salary</small>
                                                    {editMode ? (
                                                        <input
                                                            type="text"
                                                            name="salary"
                                                            value={salary}
                                                            onChange={handleInputChange}
                                                            className="form-control form-control-sm"
                                                            placeholder="Enter salary range"
                                                        />
                                                    ) : (
                                                        <span>{salary}</span>
                                                    )}
                                                </div>
                                            </li>
                                            <li className="mb-3 d-flex align-items-start">
                                                <i className="ti ti-briefcase me-2 text-primary mt-1"></i>
                                                <div className="w-100">
                                                    <small className="text-muted d-block">Type</small>
                                                    {editMode ? (
                                                        <select
                                                            name="type"
                                                            value={type}
                                                            onChange={handleInputChange}
                                                            className="form-select form-select-sm"
                                                        >
                                                            <option value="Full-time">Full-time</option>
                                                            <option value="Part-time">Part-time</option>
                                                            <option value="Contract">Contract</option>
                                                            <option value="Internship">Internship</option>
                                                            <option value="Remote">Remote</option>
                                                        </select>
                                                    ) : (
                                                        <span>{type}</span>
                                                    )}
                                                </div>
                                            </li>
                                            <li className="mb-3 d-flex align-items-start">
                                                <i className="ti ti-user me-2 text-primary mt-1"></i>
                                                <div className="w-100">
                                                    <small className="text-muted d-block">Experience</small>
                                                    {editMode ? (
                                                        <select
                                                            name="experience"
                                                            value={experience}
                                                            onChange={handleInputChange}
                                                            className="form-select form-select-sm"
                                                        >
                                                            <option value="Entry Level">Entry Level</option>
                                                            <option value="Mid Level">Mid Level</option>
                                                            <option value="Senior Level">Senior Level</option>
                                                            <option value="Director">Director</option>
                                                            <option value="Executive">Executive</option>
                                                        </select>
                                                    ) : (
                                                        <span>{experience}</span>
                                                    )}
                                                </div>
                                            </li>
                                            <li className="d-flex align-items-start">
                                                <i className="ti ti-calendar me-2 text-primary mt-1"></i>
                                                <div className="w-100">
                                                    <small className="text-muted d-block">Posted</small>
                                                    {editMode ? (
                                                        <input
                                                            type="date"
                                                            name="posted"
                                                            value={new Date(posted).toISOString().split('T')[0]}
                                                            onChange={handleInputChange}
                                                            className="form-control form-control-sm"
                                                        />
                                                    ) : (
                                                        <span>{formatDateToRelative(posted)}</span>
                                                    )}
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="col-lg-8 p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <ul className="nav nav-pills gap-2">
                                            <li className="nav-item">
                                                <button
                                                    className={`btn btn-sm ${editMode ? 'btn-primary' : 'btn-outline-primary'}`}
                                                    onClick={() => setEditMode(!editMode)}
                                                >
                                                    <i className={`ti ti-${editMode ? 'eye' : 'edit'} me-2`}></i>
                                                    {editMode ? 'View Mode' : 'Edit Mode'}
                                                </button>
                                            </li>
                                        </ul>

                                        {!editMode && (
                                            <div className="d-flex gap-2">
                                                {/* <button className="btn btn-sm btn-outline-primary">
                                                    <i className="ti ti-users me-2"></i> View Applicants
                                                </button> */}
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteJobModal(job._id)}
                                                    disabled={isDeleting}
                                                >
                                                    <i className="ti ti-trash me-2"></i>
                                                    {isDeleting ? 'Deleting...' : 'Delete Post'}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {editMode ? (
                                        <div className="tab-content">
                                            {/* Job Title - Hidden in edit mode since it's in the sidebar */}
                                            <div className="mb-4 d-none">
                                                <label className="form-label fw-semibold">Job Title</label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={title}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    placeholder="Enter job title"
                                                />
                                            </div>

                                            {/* Job Description */}
                                            <div className="mb-4">
                                                <label className="form-label fw-semibold">Job Description</label>
                                                <textarea
                                                    name="description"
                                                    value={description}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    rows="4"
                                                    placeholder="Enter job description"
                                                />
                                            </div>

                                            {/* Requirements */}
                                            <div className="mb-4">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h6 className="fw-semibold">Requirements</h6>
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={addRequirement}
                                                    >
                                                        <i className="ti ti-plus me-1"></i> Add
                                                    </button>
                                                </div>
                                                <div className="mt-3">
                                                    {requirements.map((req, idx) => (
                                                        <div key={idx} className="d-flex align-items-center gap-2 mb-2">
                                                            <span className="badge bg-primary bg-opacity-10 text-primary">•</span>
                                                            <input
                                                                type="text"
                                                                value={req}
                                                                onChange={(e) => handleRequirementsChange(e, idx)}
                                                                className="form-control form-control-sm"
                                                                placeholder="Enter requirement"
                                                            />
                                                            <button
                                                                className="btn btn-sm btn-link text-danger"
                                                                onClick={() => deleteRequirement(idx)}
                                                            >
                                                                <i className="ti ti-x"></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Skills */}
                                            <div className="mb-4">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h6 className="fw-semibold">Skills</h6>
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={addSkill}
                                                    >
                                                        <i className="ti ti-plus me-1"></i> Add
                                                    </button>
                                                </div>
                                                <div className="mt-3">
                                                    {skills.map((skill, idx) => (
                                                        <div key={idx} className="d-flex align-items-center gap-2 mb-2">
                                                            <input
                                                                type="text"
                                                                value={skill}
                                                                onChange={(e) => handleSkillsChange(e, idx)}
                                                                className="form-control form-control-sm"
                                                                placeholder="Enter skill"
                                                            />
                                                            <button
                                                                className="btn btn-sm btn-link text-danger"
                                                                onClick={() => deleteSkill(idx)}
                                                            >
                                                                <i className="ti ti-x"></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="tab-content">
                                            {/* Description */}
                                            <div className="card border-0 shadow-sm mb-4">
                                                <div className="card-body">
                                                    <h5 className="fw-semibold mb-3">Description</h5>
                                                    <p className="mb-0">{description}</p>
                                                </div>
                                            </div>

                                            {/* Requirements */}
                                            <div className="card border-0 shadow-sm mb-4">
                                                <div className="card-body">
                                                    <h5 className="fw-semibold mb-3">Requirements</h5>
                                                    <ul className="list-unstyled mb-0">
                                                        {requirements.map((req, idx) => (
                                                            <li key={idx} className="mb-2 d-flex align-items-start">
                                                                <span className="badge bg-primary bg-opacity-10 text-primary me-2">•</span>
                                                                <span>{req}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Skills */}
                                            <div className="card border-0 shadow-sm">
                                                <div className="card-body">
                                                    <h5 className="fw-semibold mb-3">Skills</h5>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {skills.map((skill, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="badge bg-primary bg-opacity-10 text-primary"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light border-0">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={onClose}
                            >
                                <i className="ti ti-x me-2"></i>
                                Close
                            </button>
                            {editMode && (
                                <div className="d-flex gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={handleEdit}
                                        disabled={isSaving}
                                    >
                                        <i className="ti ti-check me-2"></i>
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={handleCancel}
                                    >
                                        <i className="ti ti-x me-2"></i> Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleDeleteJob}
                isDeleting={isDeleting}
            />
        </>
    );
};

const CompanyJobPosts = () => {
    const [jobPostOpen, setJobPostOpen] = useState(false)
    const [selectedJobPost, setSelectedJobPost] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectOption, setSelectOption] = useState('');
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const jobListPerPage = 10;
    const { getAllJobs, isLoading, jobList } = useCompanyContext()

    useEffect(() => {
        getAllJobs()
    }, [])

    const handleViewJobPost = (jobpost) => {
        setJobPostOpen(true);
        setSelectedJobPost(jobpost);
    };

    const handleModalClose = () => {
        setJobPostOpen(false);
        setSelectedJobPost(null);
    };

    const filterJob = () => {
        let filteredJobs;
        if (searchTerm) {
            filteredJobs = jobList.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        } else if (selectOption) {
            filteredJobs = jobList.filter(job => job.status === selectOption);
        } else {
            filteredJobs = jobList;
        }

        setFilteredJobs(filteredJobs);
    };

    useEffect(() => {
        filterJob();
    }, [searchTerm, selectOption, jobList]);

    const indexOfLastJobList = currentPage * jobListPerPage;
    const indexOfFirstJobList = indexOfLastJobList - jobListPerPage;
    const currentJobList = filteredJobs?.slice(indexOfFirstJobList, indexOfLastJobList);
    const totalPages = Math.ceil(filteredJobs?.length / jobListPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container-fluid">
            <div className="container">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                                <div className="mb-3 mb-md-0">
                                    <h2 className="fw-bold mb-1">Job Posts</h2>
                                    <p className="text-muted mb-0">Manage your current job openings</p>
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
                                            placeholder="Search jobs..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                filterJob();
                                            }}
                                        />
                                        <i className="ti ti-search position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <select
                                        className="form-select"
                                        value={selectOption}
                                        onChange={(e) => {
                                            setSelectOption(e.target.value);
                                            filterJob();
                                        }}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="Active">Active</option>
                                        <option value="Draft">Draft</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="col-md-5">
                                    <Link to="/company/create-job-post" className="btn btn-primary w-100">
                                        <i className="ti ti-plus me-2"></i>
                                        Create New Job
                                    </Link>
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
                                    <p className="text-muted">Loading jobs...</p>
                                </div>
                            ) : currentJobList?.length === 0 ? (
                                <div className="p-5 text-center">
                                    <div className="bg-light rounded-circle p-3 d-inline-block mb-3">
                                        <i className="ti ti-briefcase fs-7 text-muted"></i>
                                    </div>
                                    <h5 className="text-muted">No jobs found</h5>
                                    <p className="text-muted">Create your first job posting</p>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop View */}
                                    <div className="table-responsive d-none d-lg-block">
                                        <table className="table table-hover mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="fw-semibold text-muted py-3">Job Title</th>
                                                    <th className="fw-semibold text-muted py-3">Location</th>
                                                    <th className="fw-semibold text-muted py-3">Experience</th>
                                                    <th className="fw-semibold text-muted py-3">Posted</th>
                                                    <th className="fw-semibold text-muted py-3">Status</th>
                                                    <th className="fw-semibold text-muted py-3 text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentJobList?.map((job) => (
                                                    <tr key={job._id} className="border-bottom">
                                                        <td className="py-3">
                                                            <div className="fw-medium">{job.title || <span className="text-muted">N/A</span>}</div>
                                                        </td>
                                                        <td className="py-3">
                                                            <div className="d-flex align-items-center">
                                                                <i className="ti ti-map-pin text-muted me-2"></i>
                                                                <span>{job.location}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3">
                                                            <div className="d-flex align-items-center">
                                                                <i className="ti ti-user text-muted me-2"></i>
                                                                <span>{job.experience}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3">
                                                            <div className="d-flex align-items-center">
                                                                <i className="ti ti-calendar text-muted me-2"></i>
                                                                <span>{formatDateToRelative(job.posted)}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className={`status-badge ${job.status.toLowerCase()}`}>
                                                                {job.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-center">
                                                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewJobPost(job)} title="View Details">
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
                                        {currentJobList?.map((job) => (
                                            <div key={job._id} className="mobile-job-card mb-3">
                                                <div className="p-3">
                                                    {/* Header */}
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                                                <i className="ti ti-briefcase text-primary"></i>
                                                            </div>
                                                            <div>
                                                                <h6 className="mb-0 fw-semibold">{job.title || 'N/A'}</h6>
                                                                <small className="text-muted">{job.location}</small>
                                                            </div>
                                                        </div>
                                                        <span className={`status-badge ${job.status.toLowerCase()}`}>
                                                            {job.status}
                                                        </span>
                                                    </div>

                                                    {/* Job Details */}
                                                    <div className="mb-3">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <i className="ti ti-briefcase text-muted me-2"></i>
                                                            <span className="text-muted small me-2">Type:</span>
                                                            <span className="text-dark small">{job.type}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center mb-2">
                                                            <i className="ti ti-user text-muted me-2"></i>
                                                            <span className="text-muted small me-2">Exp:</span>
                                                            <span className="text-dark small">{job.experience}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <i className="ti ti-calendar text-muted me-2"></i>
                                                            <span className="text-muted small me-2">Posted:</span>
                                                            <span className="text-dark small">{formatDateToRelative(job.posted)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Action */}
                                                    <div className="d-grid">
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => handleViewJobPost(job)}
                                                        >
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

                {/* Expanded View */}
                {jobPostOpen && selectedJobPost && (
                    <JobPostCard
                        isOpen={jobPostOpen}
                        job={selectedJobPost}
                        onClose={handleModalClose}
                        setJobPostOpen={setJobPostOpen}
                    />
                )}

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

            <style jsx>{`
                .status-badge {
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .status-badge.active {
                    background-color: #e8f5e8;
                    color: #2e7d32;
                }

                .status-badge.draft {
                    background-color: #f8f9fa;
                    color: #6c757d;
                }

                .status-badge.inactive {
                    background-color: #ffebee;
                    color: #dc3545;
                }

                .mobile-job-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    border: 1px solid #f0f0f0;
                }

                .mobile-job-card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
};

export default CompanyJobPosts;