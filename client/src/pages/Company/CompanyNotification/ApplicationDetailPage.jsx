import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ApplicationDetailPage = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/applications/${applicationId}`);
                setApplication(response.data);
            } catch (err) {
                setError(err.message);
                toast.error('Failed to load application details');
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [applicationId]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">{error}</div>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">Application not found</div>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Application Details</h2>
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>

            <div className="card mb-4">
                <div className="card-header bg-light">
                    <h5 className="mb-0">Basic Information</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>ID:</strong> {application._id}</p>
                            <p><strong>Status:</strong> <span className={`badge bg-${getStatusBadgeColor(application.status)}`}>{application.status}</span></p>
                            <p><strong>Submitted:</strong> {new Date(application.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Applicant Name:</strong> {application.applicantName}</p>
                            <p><strong>Email:</strong> {application.email}</p>
                            <p><strong>Phone:</strong> {application.phone}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header bg-light">
                    <h5 className="mb-0">Application Content</h5>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <h6>Cover Letter</h6>
                        <div className="p-3 bg-light rounded">
                            {application.coverLetter || 'No cover letter provided'}
                        </div>
                    </div>

                    {application.documents && application.documents.length > 0 && (
                        <div>
                            <h6 className="mb-3">Documents</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {application.documents.map((doc, index) => (
                                    <button
                                        key={index}
                                        className="btn btn-outline-primary"
                                        onClick={() => window.open(doc.url, '_blank')}
                                    >
                                        <i className="ti ti-file-text me-2"></i>
                                        {doc.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex gap-2">
                <button className="btn btn-primary">Take Action</button>
                <button className="btn btn-outline-secondary">Message Applicant</button>
            </div>
        </div>
    );
};

// Helper function for status badge colors
function getStatusBadgeColor(status) {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'approved':
            return 'success';
        case 'rejected':
            return 'danger';
        case 'under_review':
            return 'info';
        default:
            return 'secondary';
    }
}

export default ApplicationDetailPage;
