import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../../context/auth-context';
import { useNavigate } from 'react-router-dom';

const CvUploaded = () => {
    // State management
    const [cvRequests, setCvRequests] = useState([]);
    const [selectedCv, setSelectedCv] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editedJob, setEditedJob] = useState(null);
    const [newCvFile, setNewCvFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { server, token } = useAuthContext();
    const navigate = useNavigate();

    // Fetch CV requests on component mount
    useEffect(() => {
        const fetchCvRequests = async () => {
            try {
                const response = await axios.get(`${server}/api/v1/company/getAll-Cv`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                setCvRequests(response.data.data || []);
            } catch (err) {
                setError('Failed to fetch CV requests. Please try again later.');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCvRequests();
    }, [server, token, selectedCv]);

    // Initialize edited job when selectedCv changes
    useEffect(() => {
        if (selectedCv) {
            setEditedJob({
                ...selectedCv,
                requirements: [...(selectedCv.requirements || [])],
                skills: [...(selectedCv.skills || [])]
            });
        }
    }, [selectedCv]);

    // Filter CV requests based on search term
    const filteredRequests = cvRequests.filter(request => {
        if (!request) return false;
        const search = searchTerm.toLowerCase();
        return (
            (request.title?.toLowerCase().includes(search) || false) ||
            (request.company?.toLowerCase().includes(search) || false) ||
            (request.candidateName?.toLowerCase().includes(search) || false)
        );
    });

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch (e) {
            console.error('Invalid date format:', dateString);
            return 'Invalid date';
        }
    };

    // Close details view
    const handleCloseDetails = () => {
        setSelectedCv(null);
        setEditMode(false);
    };

    // Handle edit mode toggle
    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    // Handle field changes
    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setEditedJob(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle requirement changes
    const handleRequirementChange = (index, value) => {
        const newRequirements = [...(editedJob.requirements || [])];
        newRequirements[index] = value;
        setEditedJob(prev => ({
            ...prev,
            requirements: newRequirements
        }));
    };

    // Add new requirement
    const addRequirement = () => {
        setEditedJob(prev => ({
            ...prev,
            requirements: [...(prev.requirements || []), '']
        }));
    };

    // Remove requirement
    const removeRequirement = (index) => {
        const newRequirements = [...(editedJob.requirements || [])];
        newRequirements.splice(index, 1);
        setEditedJob(prev => ({
            ...prev,
            requirements: newRequirements
        }));
    };

    // Handle skill changes
    const handleSkillChange = (index, value) => {
        const newSkills = [...(editedJob.skills || [])];
        newSkills[index] = value;
        setEditedJob(prev => ({
            ...prev,
            skills: newSkills
        }));
    };

    // Add new skill
    const addSkill = () => {
        setEditedJob(prev => ({
            ...prev,
            skills: [...(prev.skills || []), '']
        }));
    };

    // Remove skill
    const removeSkill = (index) => {
        const newSkills = [...(editedJob.skills || [])];
        newSkills.splice(index, 1);
        setEditedJob(prev => ({
            ...prev,
            skills: newSkills
        }));
    };

    // Handle CV file selection
    const handleCvFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewCvFile(e.target.files[0]);
        }
    };

    // Save edited job
    const saveEditedJob = async () => {
        if (!editedJob || !selectedCv?._id) return;

        setLoading(true);
        try {
            const response = await axios.patch(`${server}/api/v1/company/edit-CV-Application/${selectedCv._id}`,
                editedJob,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSelectedCv(response.data.data);
            setCvRequests(prev => prev.map(job =>
                job._id === selectedCv._id ? response.data.data : job
            ));
            setEditMode(false);
        } catch (error) {
            setError('Failed to update job posting. Please try again.');
            console.error('Update error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Delete CV application
    const deleteCVApplication = async (id) => {
        if (!id || !window.confirm('Are you sure you want to delete this job posting?')) {
            return;
        }

        setLoading(true);
        try {
            await axios.delete(`${server}/api/v1/company/delete-CV-Application/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Update the local state
            setCvRequests(prev => prev.filter(job => job._id !== id));
            setSelectedCv(null);
        } catch (error) {
            setError('Failed to delete job posting. Please try again.');
            console.error('Delete error:', error);
        } finally {
            setLoading(false);
        }
    };

    const jobTypes = [
        'Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship',
        'Freelance', 'Seasonal', 'Volunteer', 'Apprenticeship',
        'Remote', 'Hybrid', 'On-site', 'Consultant'
    ];

    const experienceLevels = [
        'Entry Level', '1-2 years', '2-3 years', '3-5 years',
        '5+ years', '8+ years', '10+ years', 'Executive'
    ];

    const deleteCvFile = async (publicId) => {
        if (!publicId) return;

        setLoading(true);
        try {
            // Remove from backend
            await axios.delete(`${server}/api/v1/company/deleteSingleCvFilewhileEdit/${encodeURIComponent(publicId)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Update the local state
            setSelectedCv(prev => ({
                ...prev,
                CvFile: prev.CvFile.filter(file => file.public_id !== publicId)
            }));

        } catch (error) {
            setError('Failed to delete CV file. Please try again.');
            console.error('Delete CV error:', error);
        } finally {
            setLoading(false);
        }
    };

    const uploadCvFile = async () => {
        if (!newCvFile || !selectedCv?._id) return;

        setLoading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('cvFile', newCvFile);

        try {
            const response = await axios.post(`${server}/api/v1/company/uploadSingleCvFilewhileEdit/${selectedCv._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    }
                }
            );

            // Update the local state with the new file
            setSelectedCv(prev => ({
                ...prev,
                CvFile: [...(prev.CvFile || []), response.data.data]
            }));

            setNewCvFile(null);
            setUploadProgress(0);

        } catch (error) {
            setError('Failed to upload CV file. Please try again.');
            console.error('Upload CV error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPreviewUrl = (url) => {
        const isDocx = url.endsWith('.docx');
        return isDocx
            ? `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
            : url;
    };

    if (error) {
        return (
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="alert alert-danger">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                        <button
                            className="btn btn-sm btn-outline-danger ms-3"
                            onClick={() => setError('')}
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-0">
            <div className="container">
                {selectedCv ? (
                    editMode ? (
                        // Edit Mode View
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                                <h2 className="h5 mb-0">
                                    <i className="bi bi-pencil-square me-2"></i>
                                    Edit Job Posting
                                </h2>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={toggleEditMode}
                                >
                                    <i className="bi bi-x me-1"></i>
                                    Cancel
                                </button>
                            </div>

                            <div className="card-body p-3">
                                <div className="mb-4">
                                    <h3 className="h5 text-primary border-bottom pb-2 mb-3">Job Information</h3>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Job Title*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="title"
                                                value={editedJob.title || ''}
                                                onChange={handleFieldChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Company*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="company"
                                                value={editedJob.company || ''}
                                                onChange={handleFieldChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Location*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="location"
                                                value={editedJob.location || ''}
                                                onChange={handleFieldChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Salary</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="salary"
                                                value={editedJob.salary || ''}
                                                onChange={handleFieldChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Job Type*</label>
                                            <select
                                                className="form-select"
                                                name="type"
                                                value={editedJob.type || ''}
                                                onChange={handleFieldChange}
                                                required
                                            >
                                                {jobTypes.map((type) => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Experience Level*</label>
                                            <select
                                                className="form-select"
                                                name="experience"
                                                value={editedJob.experience || ''}
                                                onChange={handleFieldChange}
                                                required
                                            >
                                                <option value="">Select experience level</option>
                                                {experienceLevels.map((level) => (
                                                    <option key={level} value={level}>{level}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Job Description*</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        name="description"
                                        value={editedJob.description || ''}
                                        onChange={handleFieldChange}
                                        required
                                    ></textarea>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Additional Notes</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="notes"
                                        value={editedJob.notes || ''}
                                        onChange={handleFieldChange}
                                    ></textarea>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <label className="form-label fw-bold">Requirements*</label>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={addRequirement}
                                        >
                                            <i className="bi bi-plus me-1"></i>Add Requirement
                                        </button>
                                    </div>
                                    {(editedJob.requirements || []).map((req, index) => (
                                        <div key={index} className="input-group mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={req}
                                                onChange={(e) => handleRequirementChange(index, e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => removeRequirement(index)}
                                                disabled={(editedJob.requirements || []).length <= 1}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <label className="form-label fw-bold">Required Skills*</label>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={addSkill}
                                        >
                                            <i className="bi bi-plus me-1"></i>Add Skill
                                        </button>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {(editedJob.skills || []).map((skill, index) => (
                                            <div key={index} className="d-flex align-items-center bg-light rounded p-2">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm border-0 bg-transparent"
                                                    value={skill}
                                                    onChange={(e) => handleSkillChange(index, e.target.value)}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link text-danger p-0 ms-1"
                                                    onClick={() => removeSkill(index)}
                                                    disabled={(editedJob.skills || []).length <= 1}
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={toggleEditMode}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        onClick={saveEditedJob}
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // View Mode
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                                <h2 className="h5 mb-0">
                                    <i className="bi bi-file-earmark-person me-2"></i>
                                    <span className="d-none d-md-inline">Job Posting with CV Applications</span>
                                    <span className="d-md-none">Job Details</span>
                                </h2>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={handleCloseDetails}
                                >
                                    <i className="bi bi-arrow-left me-1 d-none d-md-inline"></i>
                                    <span className="d-md-none"><i className="bi bi-arrow-left"></i></span>
                                    <span className="d-none d-md-inline">Back to list</span>
                                </button>
                            </div>

                            <div className="card-body p-3">
                                <div className="row mb-4">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <h3 className="h5 text-primary border-bottom pb-2 mb-3">Job Information</h3>
                                        <div className="mb-3">
                                            <p className="fw-bold mb-1">Posted by:</p>
                                            <p className="text-break">{selectedCv.company || 'N/A'}</p>
                                        </div>
                                        <div className="mb-3">
                                            <p className="fw-bold mb-1">Posted on:</p>
                                            <p>{formatDate(selectedCv.posted)}</p>
                                        </div>
                                        <div className="mb-3">
                                            <p className="fw-bold mb-1">Last updated:</p>
                                            <p>{formatDate(selectedCv.updatedAt)}</p>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <h3 className="h5 text-primary border-bottom pb-2 mb-3">Job Details</h3>
                                        <div className="mb-3">
                                            <p className="fw-bold mb-1">Total CVs Received:</p>
                                            <span className="badge bg-success">
                                                {(selectedCv.CvFile?.length || 0)} applications
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="h5 text-primary border-bottom pb-2 mb-3">Position Details</h3>
                                    <div className="row">
                                        <div className="col-md-6 mb-3 mb-md-0">
                                            <div className="mb-3">
                                                <p className="fw-bold mb-1">Job Title:</p>
                                                <p>{selectedCv.title || 'N/A'}</p>
                                            </div>
                                            <div className="mb-3">
                                                <p className="fw-bold mb-1">Company:</p>
                                                <p>{selectedCv.company || 'N/A'}</p>
                                            </div>
                                            <div className="mb-3">
                                                <p className="fw-bold mb-1">Location:</p>
                                                <p>{selectedCv.location || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <p className="fw-bold mb-1">Salary:</p>
                                                <p>{selectedCv.salary || 'N/A'}</p>
                                            </div>
                                            <div className="mb-3">
                                                <p className="fw-bold mb-1">Job Type:</p>
                                                <p>{selectedCv.type || 'N/A'}</p>
                                            </div>
                                            <div className="mb-3">
                                                <p className="fw-bold mb-1">Experience:</p>
                                                <p>{selectedCv.experience || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="h5 text-primary border-bottom pb-2 mb-3">Job Description</h3>
                                    <div className="bg-light p-3 rounded">
                                        {selectedCv.description || 'No description provided'}
                                    </div>
                                </div>

                                {selectedCv.notes && (
                                    <div className="mb-4">
                                        <h3 className="h5 text-primary border-bottom pb-2 mb-3">Additional Notes</h3>
                                        <div className="bg-light p-3 rounded">
                                            {selectedCv.notes}
                                        </div>
                                    </div>
                                )}

                                <div className="row">
                                    <div className="col-md-6 mb-4 mb-md-0">
                                        <div className="mb-4">
                                            <h3 className="h5 text-primary border-bottom pb-2 mb-3">Requirements</h3>
                                            <ul className="list-group">
                                                {(selectedCv.requirements || []).length > 0 ? (
                                                    selectedCv.requirements.map((req, index) => (
                                                        <li key={index} className="list-group-item">
                                                            <i className="bi bi-check-circle text-primary me-2"></i>
                                                            {req}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="list-group-item">No requirements specified</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <h3 className="h5 text-primary border-bottom pb-2 mb-3">Required Skills</h3>
                                            <div className="d-flex flex-wrap gap-2">
                                                {(selectedCv.skills || []).length > 0 ? (
                                                    selectedCv.skills.map((skill, index) => (
                                                        <span key={index} className="badge bg-primary bg-opacity-10 text-primary">
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-muted">No skills specified</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CV Management Section in Edit Mode */}
                                <div className="mb-4">
                                    <h3 className="h5 text-primary border-bottom pb-2 mb-3">Manage CVs</h3>

                                    {/* Upload New CV */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Upload New CV</label>
                                        <div className="input-group">
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleCvFileChange}
                                                disabled={selectedCv?.cvFile?.some(cv => cv.status !== 'submitted')}
                                            />
                                            {newCvFile && (
                                                <button
                                                    className="btn btn-primary"
                                                    type="button"
                                                    onClick={uploadCvFile}
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Uploading...' : 'Upload'}
                                                </button>
                                            )}
                                        </div>
                                        {uploadProgress > 0 && uploadProgress < 100 && (
                                            <div className="progress mt-2" style={{ height: '5px' }}>
                                                <div
                                                    className="progress-bar progress-bar-striped progress-bar-animated"
                                                    role="progressbar"
                                                    style={{ width: `${uploadProgress}%` }}
                                                    aria-valuenow={uploadProgress}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                            </div>
                                        )}
                                        <small className="text-muted">Accepted formats: PDF, DOC, DOCX</small>
                                    </div>

                                </div>

                                <div className="mb-4">
                                    <h3 className="h5 text-primary border-bottom pb-2 mb-3">Received CVs</h3>
                                    {selectedCv.CvFile?.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th scope="col">File Name</th>
                                                        <th scope="col" className="d-none d-sm-table-cell">Type</th>
                                                        <th scope="col" className="d-none d-md-table-cell">Size</th>
                                                        <th scope="col" className="d-none d-md-table-cell">Status</th>
                                                        <th scope="col">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedCv.CvFile.map((file, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    {(() => {
                                                                        const ext = file.originalName?.split('.').pop()?.toLowerCase();
                                                                        if (ext === 'pdf') {
                                                                            return <i className="bi bi-file-earmark-pdf-fill text-danger fs-4 me-2"></i>;
                                                                        } else if (ext === 'doc' || ext === 'docx') {
                                                                            return <i className="bi bi-file-earmark-word-fill text-primary fs-4 me-2"></i>;
                                                                        } else {
                                                                            return <i className={`bi bi-filetype-${ext || 'txt'} text-secondary fs-4 me-2`}></i>;
                                                                        }
                                                                    })()}

                                                                    <span
                                                                        className="text-truncate d-inline-block"
                                                                        style={{ maxWidth: '150px' }}
                                                                        title={file.originalName}
                                                                    >
                                                                        {file.originalName || 'Unnamed file'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="text-uppercase d-none d-sm-table-cell">
                                                                {file.originalName?.split('.').pop() || 'N/A'}
                                                            </td>
                                                            <td className="d-none d-md-table-cell">
                                                                {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'N/A'}
                                                            </td>
                                                            <td className="d-none d-sm-table-cell">
                                                                <span className="badge bg-success">
                                                                    {file.status || 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex flex-wrap gap-1">
                                                                    <a
                                                                        href={getPreviewUrl(file.secure_url)}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="btn btn-sm btn-outline-primary"
                                                                    >
                                                                        <i className="bi bi-eye-fill me-1"></i>
                                                                        <span className="d-none d-sm-inline ms-1">View</span>
                                                                    </a>
                                                                    <a
                                                                        href={`${server}/api/v1/company/download-cv?url=${encodeURIComponent(file.secure_url)}&name=${encodeURIComponent(file.originalName)}`}
                                                                        className="btn btn-sm btn-outline-success"
                                                                    >
                                                                        <i className="bi bi-download"></i>
                                                                        <span className="d-none d-sm-inline ms-1">Download</span>
                                                                    </a>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => deleteCvFile(file.public_id)}
                                                                        disabled={loading || selectedCv.status === !"Submitted"}
                                                                    >
                                                                        <i className="bi bi-trash"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="alert alert-info">
                                            <i className="bi bi-info-circle me-2"></i>
                                            No CVs have been submitted for this job posting yet.
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={toggleEditMode}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-pencil me-1"></i>
                                        Edit Posting
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => deleteCVApplication(selectedCv._id)}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-trash me-1"></i>
                                        Delete Posting
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    // CV Requests List View - Mobile Responsive
                    <div className="card shadow-sm">
                        <div className="d-flex justify-content-end my-3 px-3">
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                type="button"
                                onClick={() => navigate('/company/upload-cv')}
                            >
                                Add CV Application
                            </button>
                        </div>
                        <div className="card-header bg-primary text-white py-3 rounded">
                            <div className="d-flex justify-content-between align-items-center">
                                <h2 className="h5 mb-0">
                                    <i className="bi bi-file-earmark-person me-2"></i>
                                    <span className="d-none d-md-inline">Job Postings with CV Applications</span>
                                    <span className="d-md-none">Job Postings</span>
                                </h2>
                                <span className="badge bg-light text-primary">
                                    {cvRequests.length}
                                </span>
                            </div>
                        </div>

                        <div className="card-body p-3">
                            <div className="mb-4">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search jobs..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => setSearchTerm('')}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {filteredRequests.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="bi bi-folder-x text-muted fs-1"></i>
                                    <h3 className="h5 mt-3">No job postings found</h3>
                                    <p className="text-muted">
                                        {searchTerm ? 'Try a different search term' : 'No job postings have been created yet'}
                                    </p>
                                    <button
                                        className="btn btn-primary mt-3"
                                        onClick={() => navigate('/company/upload-cv')}
                                    >
                                        Create New Job Posting
                                    </button>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col">Job Title</th>
                                                <th scope="col" className="d-none d-md-table-cell">Company</th>
                                                <th scope="col" className="d-none d-sm-table-cell">Location</th>
                                                <th scope="col" className="d-none d-lg-table-cell">Posted</th>
                                                <th scope="col">CVs</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredRequests.map((request) => (
                                                <tr
                                                    key={request._id}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setSelectedCv(request)}
                                                >
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2 me-md-3">
                                                                <i className="bi bi-briefcase-fill text-primary"></i>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 fw-semibold">{request.title || 'Untitled'}</p>
                                                                <small className="text-muted d-block d-md-none">{request.company || 'No company'}</small>
                                                                <small className="text-muted">
                                                                    {request.type || 'N/A'} • {request.experience || 'N/A'}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="d-none d-md-table-cell">{request.company || 'N/A'}</td>
                                                    <td className="d-none d-sm-table-cell">{request.location || 'N/A'}</td>
                                                    <td className="d-none d-lg-table-cell">{formatDate(request.posted)}</td>
                                                    <td>
                                                        <span className="badge bg-primary bg-opacity-10 text-primary">
                                                            {request.CvFile?.length || 0}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedCv(request);
                                                            }}
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                            <span className="d-none d-sm-inline ms-1">View</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="card-footer bg-light text-muted small py-2">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                                <span className="mb-1 mb-md-0">
                                    Showing {filteredRequests.length} of {cvRequests.length} job postings
                                </span>
                                <span>
                                    <i className="bi bi-info-circle me-1"></i>
                                    <span className="d-none d-md-inline">Click on any row to view details</span>
                                    <span className="d-md-none">Tap to view details</span>
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CvUploaded;