import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../../../context/auth-context';

const JobDetailsWithCVs = () => {

    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { server, token } = useAuthContext();

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`${server}/api/v1/superadmin/cvforinterview/${jobId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setJob(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    const getPreviewUrl = (url) => {
        const isDocx = url.endsWith('.docx');
        return isDocx
            ? `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
            : url;
    };

    const handleScheduleInterview = (cvId) => {
        navigate(`/superadmin/schedule-interview-with-cv/${jobId}/${encodeURIComponent(cvId)}`);
    };

    if (loading) return (
        <div className="container-fluid py-5">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="container-fluid py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div className="alert alert-danger shadow-sm rounded-lg">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-exclamation-octagon-fill me-3 fs-4"></i>
                            <div>
                                <h5 className="alert-heading mb-1">Error Loading Data</h5>
                                <p className="mb-0">{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!job) return (
        <div className="container-fluid py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div className="alert alert-info shadow-sm rounded-lg">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-info-circle-fill me-3 fs-4"></i>
                            <div>
                                <h5 className="alert-heading mb-1">Job Not Found</h5>
                                <p className="mb-0">The requested job could not be found.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                    <div className="mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-outline-primary btn-sm"
                        >
                            <i className="bi bi-arrow-left me-2"></i> Back to Job List
                        </button>
                    </div>

                    {/* Job Details Card */}
                    <div className="card border-0 shadow-sm rounded-lg mb-4 overflow-hidden">
                        <div className="card-header bg-primary text-white py-3">
                            <h3 className="h5 mb-0">
                                <i className="bi bi-briefcase-fill me-2"></i> Job Details
                            </h3>
                        </div>
                        <div className="card-body">
                            <div className="mb-4">
                                <h2 className="h4 mb-2">{job.title}</h2>
                                <h3 className="h5 text-muted mb-3">
                                    <i className="bi bi-building me-1"></i> {job.company}
                                    <span className="mx-2">•</span>
                                    <i className="bi bi-geo-alt me-1"></i> {job.location}
                                </h3>

                                <div className="row g-3 mb-3">
                                    <div className="col-12 col-md-4">
                                        <div className="p-3 bg-light rounded">
                                            <h6 className="text-muted small mb-1">Salary</h6>
                                            <p className="mb-0 fw-semibold">{job.salary || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <div className="p-3 bg-light rounded">
                                            <h6 className="text-muted small mb-1">Type</h6>
                                            <p className="mb-0 fw-semibold">{job.type || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <div className="p-3 bg-light rounded">
                                            <h6 className="text-muted small mb-1">Experience</h6>
                                            <p className="mb-0 fw-semibold">{job.experience || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h5 className="h6 text-primary mb-2">
                                        <i className="bi bi-card-text me-2"></i> Description
                                    </h5>
                                    <div className="p-3 bg-light rounded">
                                        <p className="mb-0">{job.description}</p>
                                    </div>
                                </div>

                                {job.requirements && job.requirements.length > 0 && (
                                    <div className="mb-4">
                                        <h5 className="h6 text-primary mb-2">
                                            <i className="bi bi-list-check me-2"></i> Requirements
                                        </h5>
                                        <div className="p-3 bg-light rounded">
                                            <ul className="mb-0">
                                                {job.requirements.map((req, index) => (
                                                    <li key={index}>{req}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {job.skills && job.skills.length > 0 && (
                                    <div className="mb-4">
                                        <h5 className="h6 text-primary mb-2">
                                            <i className="bi bi-tools me-2"></i> Skills
                                        </h5>
                                        <div className="p-3 bg-light rounded">
                                            <div className="d-flex flex-wrap gap-2">
                                                {job.skills.map((skill, index) => (
                                                    <span key={index} className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {job.notes && (
                                    <div className="mb-2">
                                        <h5 className="h6 text-primary mb-2">
                                            <i className="bi bi-pencil-square me-2"></i> Notes
                                        </h5>
                                        <div className="p-3 bg-light rounded">
                                            <p className="mb-0">{job.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CVs Card */}
                    <div className="card border-0 shadow-sm rounded-lg overflow-hidden">
                        <div className="card-header bg-primary text-white py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h3 className="h5 mb-0">
                                    <i className="bi bi-file-earmark-person-fill me-2"></i> Received CVs
                                </h3>
                                <span className="badge bg-white text-primary rounded-pill">
                                    {job.CvFile ? job.CvFile.length : 0}
                                </span>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {(!job.CvFile || job.CvFile.length === 0) ? (
                                <div className="text-center py-5">
                                    <i className="bi bi-file-earmark-excel text-muted fs-1"></i>
                                    <h4 className="h5 mt-3 mb-2">No CVs Received</h4>
                                    <p className="text-muted">There are no CVs submitted for this job yet.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="py-3 px-3">CV Name</th>
                                                <th className="py-3 px-3 d-none d-sm-table-cell">Size</th>
                                                <th className="py-3 px-3 d-none d-sm-table-cell">Status</th>
                                                <th className="py-3 px-3 text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {job.CvFile.map((cv, index) => (
                                                <tr key={index} className="align-middle">
                                                    <td className="py-3 px-3">
                                                        <div className="d-flex align-items-center">
                                                            {(() => {
                                                                const ext = cv.originalName?.split('.').pop()?.toLowerCase();
                                                                if (ext === 'pdf') {
                                                                    return <i className="bi bi-file-earmark-pdf-fill text-danger fs-5 me-2"></i>;
                                                                } else if (ext === 'doc' || ext === 'docx') {
                                                                    return <i className="bi bi-file-earmark-word-fill text-primary fs-5 me-2"></i>;
                                                                } else {
                                                                    return <i className={`bi bi-filetype-${ext || 'txt'} text-secondary fs-5 me-2`}></i>;
                                                                }
                                                            })()}

                                                            <span className="text-truncate" style={{ maxWidth: '200px' }} title={cv.originalName}>
                                                                {cv.originalName || 'Unnamed file'}
                                                            </span>
                                                        </div>

                                                    </td>
                                                    <td className="py-3 px-3 d-none d-sm-table-cell">
                                                        {(cv.size / 1024).toFixed(2)} KB
                                                    </td>
                                                    <td className="text-truncate" style={{ maxWidth: '200px' }} >
                                                        {cv.status || 'Unnamed file'}
                                                    </td>
                                                    <td className="py-3 px-3 text-end">
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <a
                                                                href={getPreviewUrl(cv.secure_url)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-sm btn-outline-primary rounded-pill"
                                                            >
                                                                <i className="bi bi-eye-fill me-1"></i> View
                                                            </a>
                                                            <button
                                                                onClick={() => handleScheduleInterview(cv._id)}
                                                                className="btn btn-sm btn-primary rounded-pill"
                                                            >
                                                                <i className="bi bi-calendar-plus-fill me-1"></i> Schedule
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        {job.CvFile && job.CvFile.length > 0 && (
                            <div className="card-footer bg-light py-2">
                                <small className="text-muted">
                                    Showing {job.CvFile.length} CV{job.CvFile.length !== 1 ? 's' : ''}
                                </small>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsWithCVs;





