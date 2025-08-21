import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ManageApplicantsPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    // Sample data - in real app you'd fetch this based on jobId
    const applicants = [
        {
            id: "app1",
            name: "John Doe",
            status: "Under Review",
            appliedDate: "2025-04-10",
            lastContact: "2025-04-12"
        },
        // More applicants...
    ];

    const [selectedApplicants, setSelectedApplicants] = useState([]);
    const [message, setMessage] = useState('');
    const [bulkAction, setBulkAction] = useState('');

    const handleSelectApplicant = (id) => {
        setSelectedApplicants(prev =>
            prev.includes(id)
                ? prev.filter(appId => appId !== id)
                : [...prev, id]
        );
    };

    const handleBulkAction = () => {
        console.log(`Performing ${bulkAction} on`, selectedApplicants);
        // API call would go here
    };

    const handleSendBulkMessage = () => {
        console.log(`Sending message to ${selectedApplicants.length} applicants:`, message);
        // API call would go here
    };

    return (
        <div className="container-fluid bg-light">
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-outline-secondary me-3"
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <h1 className="h3 mb-0 d-inline">Manage Applicants</h1>
                    </div>
                    <div>
                        <span className="me-3">{applicants.length} Applicants</span>
                        <button className="btn btn-outline-primary">
                            <i className="bi bi-download me-1"></i> Export
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-4 mb-2 mb-md-0">
                                <select
                                    className="form-select"
                                    value={bulkAction}
                                    onChange={(e) => setBulkAction(e.target.value)}
                                >
                                    <option value="">Bulk Actions</option>
                                    <option value="message">Send Message</option>
                                    <option value="interview">Schedule Interview</option>
                                    <option value="reject">Reject Selected</option>
                                    <option value="hire">Hire Selected</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-2 mb-md-0">
                                {bulkAction === 'message' ? (
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Type your message..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleSendBulkMessage}
                                            disabled={!message || selectedApplicants.length === 0}
                                        >
                                            Send
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleBulkAction}
                                        disabled={!bulkAction || selectedApplicants.length === 0}
                                    >
                                        Apply Action
                                    </button>
                                )}
                            </div>
                            <div className="col-md-2 text-end">
                                <span className="text-muted">
                                    {selectedApplicants.length} selected
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applicants Table */}
                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}>
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedApplicants(applicants.map(a => a.id));
                                                    } else {
                                                        setSelectedApplicants([]);
                                                    }
                                                }}
                                                checked={selectedApplicants.length === applicants.length}
                                            />
                                        </th>
                                        <th>Applicant</th>
                                        <th>Status</th>
                                        <th>Applied</th>
                                        <th>Last Contact</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.map(applicant => (
                                        <tr key={applicant.id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedApplicants.includes(applicant.id)}
                                                    onChange={() => handleSelectApplicant(applicant.id)}
                                                />
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                                                        <i className="bi bi-person fs-4"></i>
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-0">{applicant.name}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${applicant.status === 'New' ? 'bg-primary' :
                                                        applicant.status === 'Under Review' ? 'bg-info' :
                                                            applicant.status === 'Interview' ? 'bg-warning' :
                                                                applicant.status === 'Rejected' ? 'bg-danger' : 'bg-success'
                                                    }`}>
                                                    {applicant.status}
                                                </span>
                                            </td>
                                            <td>{applicant.appliedDate}</td>
                                            <td>{applicant.lastContact || 'Never'}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => navigate(`/admin/applicants/${applicant.id}`)}
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-success">
                                                        <i className="bi bi-envelope"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-secondary">
                                                        <i className="bi bi-calendar"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className="page-item disabled">
                            <a className="page-link" href="#" tabIndex="-1">Previous</a>
                        </li>
                        <li className="page-item active"><a className="page-link" href="#">1</a></li>
                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                        <li className="page-item">
                            <a className="page-link" href="#">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default ManageApplicantsPage;