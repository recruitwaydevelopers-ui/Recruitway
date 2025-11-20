import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdminContext } from '../../../context/superadmin-context';
import formatDateToRelative from '../../../Helper/dateFormatter';

const SuperAdminAllShortlistedCandidates = () => {
    const navigate = useNavigate()
    const { isLoading, getAllShortlistedCandidatesOfAllJobs, shortlisted: candidates } = useSuperAdminContext()

    useEffect(() => {
        getAllShortlistedCandidatesOfAllJobs();
    }, []);

    return (
        <>
            <div className="container-fluid">
                <div className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="mb-0">All Shortlisted Candidates</h2>
                        </div>
                        <div className="card-body">
                            {isLoading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2">Loading candidates...</p>
                                </div>
                            ) : candidates.length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    No shortlisted candidates found
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    {/* Desktop Table (hidden on mobile) */}
                                    <table className="table table-striped table-hover d-none d-lg-table">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ minWidth: '180px' }}>Candidate</th>
                                                <th style={{ minWidth: '150px' }}>Job Title</th>
                                                <th style={{ minWidth: '150px' }}>Company</th>
                                                <th style={{ minWidth: '150px' }}>Contact</th>
                                                <th style={{ minWidth: '120px' }}>Shortlisted On</th>
                                                <th style={{ minWidth: '150px' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidates.map(candidate => (
                                                <tr key={candidate._id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <img
                                                                src={candidate.profilePicture}
                                                                alt={candidate.candidateName}
                                                                className="rounded-circle me-2"
                                                                width="32"
                                                                height="32"
                                                            />
                                                            <div>
                                                                <div>{candidate.candidateName}</div>
                                                                <small className="text-muted">{candidate.candidateEmail}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{candidate.jobTitle}</td>
                                                    <td>{candidate.companyName}</td>
                                                    <td>
                                                        <div>{candidate.candidateEmail}</div>
                                                        <small className="text-muted">{candidate.candidatePhone || 'N/A'}</small>
                                                    </td>
                                                    <td>{formatDateToRelative(candidate.shortlistedAt)}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => navigate("/superadmin/scheduleInterview", {
                                                                state: {
                                                                    applicant: {
                                                                        _id: candidate.candidateId,
                                                                        fullname: candidate.candidateName,
                                                                        email: candidate.candidateEmail,
                                                                        phone: candidate.candidatePhone
                                                                    },
                                                                    job: {
                                                                        _id: candidate.jobId,
                                                                        title: candidate.jobTitle,
                                                                        company: candidate.companyName,
                                                                        companyId: candidate.companyId,
                                                                    }
                                                                }
                                                            })}
                                                        >
                                                            <i className="bi bi-calendar-check me-1"></i> Schedule
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Mobile Cards (hidden on desktop) */}
                                    <div className="d-lg-none">
                                        {candidates.map(candidate => (
                                            <div key={candidate._id} className="card mb-3">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <div className="d-flex align-items-center">
                                                            <img
                                                                src={candidate.profilePicture}
                                                                alt={candidate.candidateName}
                                                                className="rounded-circle me-2"
                                                                width="40"
                                                                height="40"
                                                            />
                                                            <div>
                                                                <h6 className="mb-0">{candidate.candidateName}</h6>
                                                                <small className="text-muted">{candidate.candidateEmail}</small>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mb-2">
                                                        <div className="d-flex align-items-center mb-1">
                                                            <i className="bi bi-briefcase me-2"></i>
                                                            <span>{candidate.jobTitle}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center mb-1">
                                                            <i className="bi bi-building me-2"></i>
                                                            <span>{candidate.companyName}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center mb-1">
                                                            <i className="bi bi-telephone me-2"></i>
                                                            <span>{candidate.candidatePhone || 'N/A'}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center mb-1">
                                                            <i className="bi bi-calendar me-2"></i>
                                                            <span>{formatDateToRelative(candidate.shortlistedAt)}</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        className="btn btn-primary w-100"
                                                        onClick={() => navigate("/superadmin/scheduleInterview", {
                                                            state: {
                                                                applicant: {
                                                                    _id: candidate.candidateId,
                                                                    fullname: candidate.candidateName,
                                                                    email: candidate.candidateEmail,
                                                                    phone: candidate.candidatePhone
                                                                },
                                                                job: {
                                                                    _id: candidate.jobId,
                                                                    title: candidate.jobTitle,
                                                                    company: candidate.companyName,
                                                                    companyId: candidate.companyId,
                                                                }
                                                            }
                                                        })}
                                                    >
                                                        <i className="bi bi-calendar-check me-1"></i> Schedule Interview
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SuperAdminAllShortlistedCandidates;