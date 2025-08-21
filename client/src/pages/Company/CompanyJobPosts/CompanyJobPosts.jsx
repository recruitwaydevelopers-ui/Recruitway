import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompanyContext } from '../../../context/company-context';
import formatDateToRelative from '../../../Helper/dateFormatter';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';

const JobPostCard = ({ isOpen, job, onClose, setJobPostOpen, jobList, setJobList }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedJob, setEditedJob] = useState({ ...job });

    const { handleJobEdit, handleConfirmDeleteJob } = useCompanyContext()

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
        await handleJobEdit(editedJob._id, editedJob)
        setEditMode(false);
    }

    const handleCancel = () => {
        setEditedJob({ ...job });
        setEditMode(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);

    const handleDeleteJobModal = (jobId) => {
        setJobToDelete(jobId);
        setIsModalOpen(true);
    };

    const handleDeleteJob = async () => {
        try {
            await handleConfirmDeleteJob(jobToDelete);
            setIsModalOpen(false);
            setJobPostOpen(false);
        } catch (error) {
            console.error("Failed to delete job:", error);
        }
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setJobToDelete(null);
    };

    const { title, company, location, salary, type, experience, posted, description, requirements, skills, applicants, status } =
        editMode ? editedJob : editedJob;

    if (!isOpen) return null;

    return (
        <>
            <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Header */}
                        <div className="modal-header px-3 py-4">
                            <h5 className="modal-title">Full Job Post</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body px-3 px-md-4">
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-3 p-md-4">
                                    {/* Header Section */}
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div className="w-100 pe-3">
                                            <h4 className="card-title mb-2 fw-bold text-dark">
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        value={title}
                                                        onChange={handleInputChange}
                                                        className="form-control form-control-lg fw-bold border-2 py-2 px-3"
                                                        placeholder="Job Title"
                                                    />
                                                ) : (
                                                    title
                                                )}
                                            </h4>
                                            <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                                                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 d-flex align-items-center">
                                                    <i className="ti ti-building me-1"></i>
                                                    {company}
                                                </span>
                                                <span
                                                    className={`badge rounded-pill px-3 py-2 d-flex align-items-center ${status === 'Active' ? 'bg-success' : (status === 'Inactive' ? 'bg-danger' : 'bg-warning')} bg-opacity-10 text-${status === 'Active' ? 'success' : (status === 'Inactive' ? 'danger' : 'warning')}`}
                                                >
                                                    {editMode ? (
                                                        <select
                                                            name="status"
                                                            value={status}
                                                            onChange={handleInputChange}
                                                            className="form-select form-select-sm bg-transparent border-0"
                                                        >
                                                            <option value="Active">Active</option>
                                                            <option value="Inactive">Inactive</option>
                                                            <option value="Draft">Draft</option>
                                                        </select>
                                                    ) : (
                                                        <>
                                                            <i
                                                                className={`ti ti-${status === 'Active' ? 'circle-check' : (status === 'Inactive' ? 'circle-x' : 'circle-dash')}`}
                                                                style={{ fontSize: '1.2em' }}  // Adjust icon size if needed
                                                            ></i>
                                                            {status}
                                                        </>
                                                    )}
                                                </span>

                                            </div>
                                        </div>
                                        {!editMode && (
                                            <div className="dropdown">
                                                <button
                                                    className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center"
                                                    type="button"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    <i className="ti ti-dots-vertical me-1"></i> Actions
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                                                    <li>
                                                        <button className="dropdown-item d-flex align-items-center" onClick={() => setEditMode(true)}>
                                                            <i className="ti ti-edit me-2"></i> Edit Post
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button className="dropdown-item d-flex align-items-center">
                                                            <i className="ti ti-users me-2"></i> View Applicants
                                                        </button>
                                                    </li>
                                                    <li><hr className="dropdown-divider my-2" /></li>
                                                    <li>
                                                        <button className="dropdown-item d-flex align-items-center text-danger">
                                                            <i className="ti ti-lock me-2"></i> Close Post
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button className="dropdown-item d-flex align-items-center text-danger" onClick={() => handleDeleteJobModal(job._id)}>
                                                            <i className="ti ti-trash me-2"></i> Delete Post
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Job Meta Information */}
                                    <div className="row mb-4 g-3">
                                        <div className="col-12 col-md-6">
                                            <div className="d-flex align-items-center text-muted mb-3">
                                                <i className="ti ti-building me-2 fs-5 text-primary"></i>
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        name="location"
                                                        value={location}
                                                        onChange={handleInputChange}
                                                        className="form-control form-control-sm border-0 border-bottom rounded-0 px-1 py-2"
                                                        placeholder="Location"
                                                    />
                                                ) : (
                                                    <span className="text-dark">{location}</span>
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center text-muted mb-3">
                                                <i className="ti ti-currency-dollar me-2 fs-5 text-primary"></i>
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        name="salary"
                                                        value={salary}
                                                        onChange={handleInputChange}
                                                        className="form-control form-control-sm border-0 border-bottom rounded-0 px-1 py-2"
                                                        placeholder="Salary Range"
                                                    />
                                                ) : (
                                                    <span className="text-dark">{salary}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="d-flex align-items-center text-muted mb-3">
                                                <i className="ti ti-briefcase me-2 fs-5 text-primary"></i>
                                                {editMode ? (
                                                    <select
                                                        name="type"
                                                        value={type}
                                                        onChange={handleInputChange}
                                                        className="form-select form-select-sm bg-transparent"
                                                    >
                                                        <option value="Full-time">Full-time</option>
                                                        <option value="Part-time">Part-time</option>
                                                        <option value="Contract">Contract</option>
                                                        <option value="Temporary">Temporary</option>
                                                        <option value="Internship">Internship</option>
                                                        <option value="Freelance">Freelance</option>
                                                        <option value="Seasonal">Seasonal</option>
                                                        <option value="Volunteer">Volunteer</option>
                                                        <option value="Apprenticeship">Apprenticeship</option>
                                                        <option value="Remote">Remote</option>
                                                        <option value="Hybrid">Hybrid</option>
                                                        <option value="On-site">On-site</option>
                                                        <option value="Consultant">Consultant</option>
                                                        <option value="Per Diem">Per Diem</option>
                                                        <option value="Commission">Commission-based</option>
                                                        <option value="Shift Work">Shift Work</option>
                                                        <option value="Flexible">Flexible Schedule</option>
                                                    </select>
                                                ) : (
                                                    <span className="text-dark">{type}</span>
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center text-muted mb-3">
                                                <i className="ti ti-user me-2 fs-5 text-primary"></i>
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        name="experience"
                                                        value={experience}
                                                        onChange={handleInputChange}
                                                        className="form-control form-control-sm border-0 border-bottom rounded-0 px-1 py-2"
                                                        placeholder="Experience Required"
                                                    />
                                                ) : (
                                                    <span className="text-dark">{experience} experience</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Posted Date and Applicants */}
                                    <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                                        <div className="d-flex align-items-center text-muted">
                                            <i className="ti ti-calendar-event me-2 fs-5 text-primary"></i>
                                            <span className="text-dark">Posted: {formatDateToRelative(posted)}</span>
                                        </div>
                                        {!editMode && (
                                            <div className="d-flex align-items-center text-muted">
                                                <i className="ti ti-users me-2 fs-5 text-primary"></i>
                                                <span className="text-dark">{applicants} applicants</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Job Description */}
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3 text-dark d-flex align-items-center">
                                            <i className="ti ti-notes me-2"></i> Job Description
                                        </h6>
                                        {editMode ? (
                                            <textarea
                                                name="description"
                                                value={description}
                                                onChange={handleInputChange}
                                                className="form-control border-2"
                                                rows="5"
                                                placeholder="Enter detailed job description..."
                                            />
                                        ) : (
                                            <p className="text-muted mb-0 ps-4">{description}</p>
                                        )}
                                    </div>

                                    {/* Requirements Section */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-bold text-dark d-flex align-items-center">
                                                <i className="ti ti-list-check me-2"></i> Requirements
                                            </h6>
                                            {editMode && (
                                                <button
                                                    className="btn btn-sm btn-primary d-flex align-items-center"
                                                    onClick={addRequirement}
                                                >
                                                    <i className="ti ti-plus me-1"></i> Add Requirement
                                                </button>
                                            )}
                                        </div>
                                        {editMode ? (
                                            <div className="ps-4">
                                                {requirements.map((req, idx) => (
                                                    <div key={idx} className="d-flex align-items-center gap-2 mb-2">
                                                        <span className="bullet-point text-primary">•</span>
                                                        <input
                                                            type="text"
                                                            value={req}
                                                            onChange={(e) => handleRequirementsChange(e, idx)}
                                                            className="form-control border-0 border-bottom rounded-0 px-1 py-2"
                                                            placeholder="Enter requirement"
                                                        />
                                                        <button
                                                            className="btn btn-sm btn-link text-danger"
                                                            onClick={() => deleteRequirement(idx)}
                                                        >
                                                            <i className="ti ti-trash"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <ul className="text-muted mb-0 ps-4">
                                                {requirements.map((req, idx) => (
                                                    <li key={idx} className="mb-2">{req}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Skills Section */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-bold text-dark d-flex align-items-center">
                                                <i className="ti ti-tools me-2"></i> Skills
                                            </h6>
                                            {editMode && (
                                                <button
                                                    className="btn btn-sm btn-primary d-flex align-items-center"
                                                    onClick={addSkill}
                                                >
                                                    <i className="ti ti-plus me-1"></i> Add Skill
                                                </button>
                                            )}
                                        </div>
                                        {editMode ? (
                                            <div className="d-flex flex-wrap gap-2 ps-4">
                                                {skills.map((skill, idx) => (
                                                    <div key={idx} className="d-flex align-items-center gap-1">
                                                        <span className="badge bg-primary bg-opacity-20 text-primary fw-normal py-2 px-3 d-flex align-items-center">
                                                            <input
                                                                type="text"
                                                                value={skill}
                                                                onChange={(e) => handleSkillsChange(e, idx)}
                                                                className="form-control form-control-sm border-0 bg-transparent p-0 text-white"
                                                            />
                                                        </span>
                                                        <button
                                                            className="btn btn-sm btn-link text-danger p-0"
                                                            onClick={() => deleteSkill(idx)}
                                                        >
                                                            <i className="ti ti-trash"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="d-flex flex-wrap gap-2 ps-4">
                                                {skills?.map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="badge bg-primary bg-opacity-10 text-primary fw-normal py-2 px-3"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="card-footer bg-transparent border-top-0 px-0 pt-4 pb-0">
                                        {editMode ? (
                                            <div className="d-flex gap-3">
                                                <button
                                                    className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
                                                    onClick={handleEdit}
                                                >
                                                    <i className="ti ti-check me-2"></i> Save Changes
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
                                                    onClick={handleCancel}
                                                >
                                                    <i className="ti ti-x me-2"></i> Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="d-flex gap-3">
                                                <button className="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center">
                                                    <i className="ti ti-users me-2"></i> View Applicants
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
                                                    onClick={() => setEditMode(true)}
                                                >
                                                    <i className="ti ti-edit me-2"></i> Edit Post
                                                </button>
                                                <button className="btn btn-outline-danger btn-sm flex-grow-1 d-flex align-items-center justify-content-center" onClick={() => handleDeleteJobModal(job._id)}>
                                                    <i className="ti ti-trash me-2"></i> Delete Post
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleDeleteJob}
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
            <div className="container py-3 py-md-4">
                {/* Header */}
                <div className="d-flex flex-column justify-content-between align-items-stretch mb-4 gap-3">
                    <div className="mb-3 mb-md-0">
                        <h2 className="fw-bold mb-1">Job Posts</h2>
                        <p className="text-muted mb-0">Manage your current job openings</p>
                    </div>
                    <div className="d-flex flex-column flex-md-row gap-3 w-100 w-md-auto">
                        <div className="position-relative flex-grow-1">
                            <input
                                type="text"
                                className="form-control form-control-sm ps-5"
                                placeholder="Search jobs..."
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    filterJob();
                                }}
                            />
                            <i className="ti ti-search position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
                        </div>

                        <select
                            className="form-select form-select-sm w-auto"
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

                        <Link to="/company/create-job-post" className="btn btn-sm btn-primary">
                            Create New Job
                        </Link>
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
                                        <th style={{ minWidth: '200px' }}>Job Title</th>
                                        <th style={{ minWidth: '150px' }}>Location</th>
                                        <th style={{ minWidth: '120px' }}>Experience</th>
                                        <th style={{ minWidth: '120px' }}>Posted</th>
                                        <th style={{ minWidth: '100px' }}>Status</th>
                                        <th style={{ minWidth: '100px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">
                                                <div className="d-flex justify-content-center align-items-center gap-2">
                                                    <div className="spinner-border spinner-border-sm" role="status"></div>
                                                    <span>Loading Jobs...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : currentJobList?.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-muted">
                                                No Jobs found. Add your first Job.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentJobList?.map((job) => (
                                            <tr key={job._id}>
                                                <td>
                                                    <div className="fw-bold">{job.title || <span className="text-muted">N/A</span>}</div>
                                                </td>
                                                <td>{job.location}</td>
                                                <td>{job.experience}</td>
                                                <td>{formatDateToRelative(job.posted)}</td>
                                                <td>
                                                    <span className={`badge ${job.status === "Active" ? 'bg-success' :
                                                        job.status === "Draft" ? 'bg-secondary' :
                                                            job.status === "Inactive" ? 'bg-danger' : 'bg-warning text-dark'
                                                        }`}>
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleViewJobPost(job)}
                                                    >
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
                                            <span>Loading Jobs...</span>
                                        </div>
                                    </div>
                                ) : currentJobList?.length === 0 ? (
                                    <div className="text-center py-4 text-muted">
                                        No Jobs found. Add your first Job.
                                    </div>
                                ) : (
                                    currentJobList?.map((job) => (
                                        <div key={job._id} className="card mb-3">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <h6 className="mb-0 fw-bold">{job.title || 'N/A'}</h6>
                                                        <small className="text-muted">{job.location}</small>
                                                    </div>
                                                    <span className={`badge ${job.status === "Active" ? 'bg-success' :
                                                        job.status === "Draft" ? 'bg-secondary' :
                                                            job.status === "Inactive" ? 'bg-danger' : 'bg-warning text-dark'
                                                        }`}>
                                                        {job.status}
                                                    </span>
                                                </div>

                                                <div className="mb-2">
                                                    <div className="d-flex align-items-center mb-1">
                                                        <i className="bi bi-person-workspace me-2"></i>
                                                        <span>{job.experience}</span>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-1">
                                                        <i className="bi bi-calendar me-2"></i>
                                                        <span>{formatDateToRelative(job.posted)}</span>
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary flex-grow-1"
                                                        onClick={() => handleViewJobPost(job)}
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
                {jobPostOpen && selectedJobPost && (
                    <JobPostCard
                        isOpen={jobPostOpen}
                        job={selectedJobPost}
                        onClose={handleModalClose}
                        setJobPostOpen={setJobPostOpen}
                        jobList={jobList}
                    />
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
    );
};

export default CompanyJobPosts;