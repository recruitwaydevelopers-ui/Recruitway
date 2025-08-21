import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../../context/auth-context';
import { useNavigate } from 'react-router-dom';

const CompanyCVForInterview = () => {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isUploading, setIsUploading] = useState(false);
    const [duplicateFile, setDuplicateFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [totalSize, setTotalSize] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const navigate = useNavigate()

    const { server, token } = useAuthContext()

    const [jobData, setJobData] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        type: 'Full-time',
        experience: '',
        description: '',
        requirements: [''],
        skills: [''],
        notes: '',
    });

    // Constants
    const SUPPORTED_FORMATS = ['.pdf', '.docx'];
    const MAX_FILE_SIZE_MB = 5;
    const MAX_TOTAL_SIZE_MB = 20;

    const jobTypes = [
        'Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship',
        'Freelance', 'Seasonal', 'Volunteer', 'Apprenticeship',
        'Remote', 'Hybrid', 'On-site', 'Consultant'
    ];

    const experienceLevels = [
        'Entry Level', '1-2 years', '2-3 years', '3-5 years',
        '5+ years', '8+ years', '10+ years', 'Executive'
    ];

    // Helper functions
    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        const value = bytes / Math.pow(1024, i);
        return `${value.toFixed(2)} ${sizes[i]}`;
    };


    const showMessage = (text, type = 'danger') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    // File handling functions
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        // Check for unsupported formats
        const unsupported = selectedFiles.filter(file =>
            !SUPPORTED_FORMATS.some(format => file.name.toLowerCase().endsWith(format))
        );

        if (unsupported.length > 0) {
            showMessage(`Unsupported file format: ${unsupported[0].name}. Only PDF and DOCX are allowed.`);
            setFileInputKey(Date.now());
            return;
        }

        // Check file size limits
        const oversized = selectedFiles.find(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
        if (oversized) {
            showMessage(`"${oversized.name}" exceeds the ${MAX_FILE_SIZE_MB}MB individual file limit.`);
            setFileInputKey(Date.now());
            return;
        }

        // Check for duplicates
        const duplicates = selectedFiles.filter(file =>
            files.some(f => f.name === file.name) ||
            uploadedFiles.some(f => f.name === file.name)
        );

        if (duplicates.length > 0) {
            setDuplicateFile(duplicates[0].name);
            setShowModal(true);
            setFileInputKey(Date.now());
            return;
        }

        // Check total size limit
        const newTotal = selectedFiles.reduce((acc, f) => acc + f.size, totalSize);
        if (newTotal > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
            showMessage(`Total file size exceeds ${MAX_TOTAL_SIZE_MB}MB limit. Please remove some files.`);
            setFileInputKey(Date.now());
            return;
        }

        // Update state
        setFiles(prev => [...prev, ...selectedFiles]);
        setTotalSize(newTotal);
        setFileInputKey(Date.now());
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFileChange({ target: { files: droppedFiles } });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDelete = (indexToRemove) => {
        const updatedFiles = files.filter((_, index) => index !== indexToRemove);
        const newTotalSize = updatedFiles.reduce((acc, f) => acc + f.size, 0);
        setFiles(updatedFiles);
        setTotalSize(newTotalSize);
    };

    // Job data handling
    const handleJobChange = (e) => {
        const { name, value } = e.target;
        setJobData(prev => ({ ...prev, [name]: value }));
    };

    const handleRequirementChange = (index, value) => {
        const newRequirements = [...jobData.requirements];
        newRequirements[index] = value;
        setJobData(prev => ({ ...prev, requirements: newRequirements }));
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...jobData.skills];
        newSkills[index] = value;
        setJobData(prev => ({ ...prev, skills: newSkills }));
    };

    const addRequirement = () => {
        setJobData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }));
    };

    const removeRequirement = (index) => {
        const newRequirements = jobData.requirements.filter((_, i) => i !== index);
        setJobData(prev => ({ ...prev, requirements: newRequirements }));
    };

    const addSkill = () => {
        setJobData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
    };

    const removeSkill = (index) => {
        const newSkills = jobData.skills.filter((_, i) => i !== index);
        setJobData(prev => ({ ...prev, skills: newSkills }));
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            showMessage('Please select at least one file to upload!');
            return;
        }

        // Validate required job fields
        if (!jobData.title || !jobData.company || !jobData.location || !jobData.salary || !jobData.description) {
            showMessage('Please fill all required job information fields!');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        files.forEach(file => formData.append('cvs', file));

        Object.entries(jobData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => formData.append(`${key}[]`, v));
            } else {
                formData.append(key, value);
            }
        });

        try {
            const res = await axios.post(`${server}/api/v1/company/upload-cv`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percent);
                    }
                }
            );

            console.log(res.data);


            setUploadedFiles(prev => [...prev, ...files]);
            setFiles([]);
            setTotalSize(0);
            showMessage('Files and job data uploaded successfully!', 'success');
        } catch (err) {
            console.error('Upload error:', err);
            showMessage(`Upload failed: ${err.response?.data?.error || err.message}`);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            navigate('/company/uploaded-cv')
        }
    };

    return (
        <div className="container-fluid">
            <div className="container py-4">
                {/* Duplicate File Modal */}
                {showModal && (
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title">Duplicate File Detected</h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowModal(false)}
                                        aria-label="Close"
                                    />
                                </div>
                                <div className="modal-body">
                                    <p>The file <strong className="text-primary">{duplicateFile}</strong> has already been selected or uploaded.</p>
                                    <p>Please upload a different file or rename this file before uploading.</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <i className="bi bi-check-circle me-2"></i>Understood
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="card shadow-lg border-0">
                    <div className="card-header bg-primary d-flex justify-content-between align-items-center text-white py-3">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-cloud-arrow-up fs-3 me-3"></i>
                            <div>
                                <h1 className="h4 mb-0">CV Upload Portal</h1>
                                <small className="opacity-75">Upload candidate resumes and job details</small>
                            </div>
                        </div>
                        <button
                            className="btn btn-sm btn-light"
                            onClick={() => navigate(-1)}
                        >
                            <i className="bi bi-arrow-left me-1 d-none d-md-inline"></i>
                            <span className="d-md-none"><i className="bi bi-arrow-left"></i></span>
                            <span className="d-none d-md-inline">Back to list</span>
                        </button>
                    </div>

                    <div className="card-body p-4">
                        {/* Status Message */}
                        {message.text && (
                            <div className={`alert alert-${message.type} alert-dismissible fade show mb-4`}>
                                <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                                {message.text}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setMessage({ text: '', type: '' })}
                                />
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Job Information Section */}
                            <div className="mb-5">
                                <h2 className="h5 mb-4 text-primary border-bottom pb-2">
                                    <i className="bi bi-briefcase me-2"></i>
                                    Job Information
                                </h2>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Job Title*</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={jobData.title}
                                            onChange={handleJobChange}
                                            className="form-control"
                                            placeholder="e.g. Senior Frontend Developer"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Company Name*</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={jobData.company}
                                            onChange={handleJobChange}
                                            className="form-control"
                                            placeholder="Your company name"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Location*</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={jobData.location}
                                            onChange={handleJobChange}
                                            className="form-control"
                                            placeholder="e.g. San Francisco, CA or Remote"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Salary Range*</label>
                                        <input
                                            type="text"
                                            name="salary"
                                            value={jobData.salary}
                                            onChange={handleJobChange}
                                            className="form-control"
                                            placeholder="e.g. $120,000 - $150,000"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Job Type*</label>
                                        <select
                                            name="type"
                                            value={jobData.type}
                                            onChange={handleJobChange}
                                            className="form-select"
                                            required
                                        >
                                            {jobTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Experience Level*</label>
                                        <select
                                            name="experience"
                                            value={jobData.experience}
                                            onChange={handleJobChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="">Select experience level</option>
                                            {experienceLevels.map(level => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Job Description*</label>
                                    <textarea
                                        name="description"
                                        value={jobData.description}
                                        onChange={handleJobChange}
                                        className="form-control"
                                        rows={5}
                                        placeholder="Describe the role, responsibilities, and what makes your company great to work for..."
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <label className="form-label fw-semibold">Requirements*</label>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={addRequirement}
                                        >
                                            <i className="bi bi-plus me-1"></i>Add
                                        </button>
                                    </div>
                                    {jobData.requirements.map((req, index) => (
                                        <div key={index} className="input-group mb-2">
                                            <input
                                                type="text"
                                                value={req}
                                                onChange={(e) => handleRequirementChange(index, e.target.value)}
                                                className="form-control"
                                                placeholder={`Requirement #${index + 1}`}
                                                required
                                            />
                                            {jobData.requirements.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={() => removeRequirement(index)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <label className="form-label fw-semibold">Required Skills*</label>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={addSkill}
                                        >
                                            <i className="bi bi-plus me-1"></i>Add
                                        </button>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {jobData.skills.map((skill, index) => (
                                            <div key={index} className="d-flex align-items-center bg-light rounded p-2">
                                                <input
                                                    type="text"
                                                    value={skill}
                                                    onChange={(e) => handleSkillChange(index, e.target.value)}
                                                    className="form-control form-control-sm border-0 bg-transparent"
                                                    placeholder="Skill"
                                                    required
                                                />
                                                {jobData.skills.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-link text-danger p-0 ms-1"
                                                        onClick={() => removeSkill(index)}
                                                    >
                                                        <i className="bi bi-x-lg"></i>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Additional Notes</label>
                                    <textarea
                                        name="notes"
                                        value={jobData.notes}
                                        onChange={handleJobChange}
                                        className="form-control"
                                        rows={3}
                                        placeholder="Enter any additional notes for the recruitment team..."
                                    />
                                </div>
                            </div>

                            {/* File Upload Section */}
                            <div className="mb-5">
                                <h2 className="h5 mb-4 text-primary border-bottom pb-2">
                                    <i className="bi bi-upload me-2"></i>
                                    Upload Resumes
                                </h2>

                                <div
                                    className="border-2 border-dashed rounded-3 p-5 text-center bg-light mb-4"
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => document.getElementById('fileInput').click()}
                                    style={{ cursor: 'pointer', borderColor: 'var(--bs-primary)' }}
                                >
                                    <div className="mb-3">
                                        <i className="bi bi-cloud-arrow-up fs-7 text-primary"></i>
                                    </div>
                                    <h5 className="mb-2">Drag & Drop files here</h5>
                                    <p className="text-muted mb-3">or click to browse files</p>
                                    <small className="d-block text-muted">
                                        Supported formats: {SUPPORTED_FORMATS.join(', ')} (Max {MAX_FILE_SIZE_MB}MB per file, {MAX_TOTAL_SIZE_MB}MB total)
                                    </small>
                                    <input
                                        key={fileInputKey}
                                        id="fileInput"
                                        type="file"
                                        className="d-none"
                                        multiple
                                        accept={SUPPORTED_FORMATS.join(',')}
                                        onChange={handleFileChange}
                                    />
                                </div>

                                {/* Selected Files Table */}
                                {files.length > 0 && (
                                    <div className="mt-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="mb-0 fw-semibold">
                                                <i className="bi bi-files me-2"></i>
                                                Selected Files ({files.length})
                                            </h5>
                                            <span className="badge bg-primary rounded-pill">
                                                Total: {formatBytes(totalSize)}
                                            </span>
                                        </div>

                                        {isUploading && (
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <small>Upload Progress</small>
                                                    <small>{uploadProgress}%</small>
                                                </div>
                                                <div className="progress">
                                                    <div
                                                        className="progress-bar progress-bar-striped progress-bar-animated"
                                                        role="progressbar"
                                                        style={{ width: `${uploadProgress}%` }}
                                                        aria-valuenow={uploadProgress}
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th scope="col">File Name</th>
                                                        <th scope="col">Size</th>
                                                        <th scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {files.map((file, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <i className={`bi bi-filetype-${file.name.split('.').pop()} text-primary fs-4 me-3`}></i>
                                                                    <span
                                                                        className="text-truncate"
                                                                        style={{ maxWidth: '200px' }}
                                                                        title={file.name}
                                                                    >
                                                                        {file.name}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">{formatBytes(file.size)}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDelete(index)}
                                                                    disabled={isUploading}
                                                                >
                                                                    <i className="bi bi-trash me-1"></i> Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="d-flex justify-content-between align-items-center border-top pt-4">
                                <div>
                                    {files.length > 0 && (
                                        <span className="text-muted small">
                                            Ready to upload {files.length} file{files.length !== 1 ? 's' : ''} ({formatBytes(totalSize)})
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary px-4 py-2"
                                    disabled={files.length === 0 || isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-upload me-2"></i>
                                            Submit Application
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Uploaded Files Section */}
                        {uploadedFiles.length > 0 && (
                            <div className="mt-5">
                                <h3 className="h5 mb-3 text-primary border-bottom pb-2">
                                    <i className="bi bi-cloud-check me-2"></i>
                                    Previously Uploaded Files
                                </h3>
                                <div className="list-group">
                                    {uploadedFiles.map((file, index) => (
                                        <div key={`uploaded-${index}`} className="list-group-item list-group-item-action">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <i className={`bi bi-filetype-${file.name.split('.').pop()} text-primary fs-4 me-3`}></i>
                                                    <div>
                                                        <div className="fw-semibold">{file.name}</div>
                                                        <small className="text-muted">{formatBytes(file.size)}</small>
                                                    </div>
                                                </div>
                                                <span className="badge bg-success bg-opacity-10 text-success">
                                                    <i className="bi bi-check-circle-fill me-1"></i>
                                                    Uploaded
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card-footer bg-light text-muted small">
                        <div className="d-flex justify-content-between align-items-center">
                            <span>
                                <i className="bi bi-info-circle me-1"></i>
                                Maximum {MAX_TOTAL_SIZE_MB}MB total • {MAX_FILE_SIZE_MB}MB per file
                            </span>
                            <span className="text-end">
                                <i className="bi bi-shield-lock me-1"></i>
                                All files are securely transmitted
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyCVForInterview;
