import React, { useEffect } from 'react'
import formatDateToRelative from '../../../Helper/dateFormatter';
import { useNavigate, useParams } from 'react-router-dom';
import { useCandidateContext } from '../../../context/candidate-context';

const UserJobDetails = () => {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const { getSelectedJobDetails, selectedJobDetails, withdrawJobApplication } = useCandidateContext()

    useEffect(() => {
        getSelectedJobDetails(jobId)
    }, [])

    return (
        <>
            <div className="container-fluid">
                <div className="container py-5">
                    <button
                        className="btn btn-sm btn-outline-primary mb-4 px-4 d-flex align-items-center"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left me-2"></i> Back to Applied Jobs
                    </button>

                    <div className="card border-0 shadow-lg overflow-hidden">
                        <div className="card-header bg-primary bg-gradient py-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h1 className="h2 text-white mb-2">{selectedJobDetails.title}</h1>
                                    <h2 className="h5 text-white-80 mb-0">
                                        <i className="bi bi-building me-2"></i>
                                        {selectedJobDetails.company}
                                    </h2>
                                </div>
                                <span className={`badge rounded-pill bg-${selectedJobDetails.status === 'Active' ? 'success' : 'secondary'}-subtle text-${selectedJobDetails.status === 'Active' ? 'success' : 'secondary'} py-2 px-3`}>
                                    {selectedJobDetails.status}
                                </span>
                            </div>
                        </div>

                        <div className="card-body p-4 p-lg-5">
                            <div className="row g-4 mb-4">
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-geo-alt text-primary fs-5 me-3"></i>
                                        <div>
                                            <h6 className="text-muted mb-0">Location</h6>
                                            <p className="mb-0 fw-medium">{selectedJobDetails.location || 'Remote'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-cash-coin text-primary fs-5 me-3"></i>
                                        <div>
                                            <h6 className="text-muted mb-0">Salary</h6>
                                            <p className="mb-0 fw-medium">{selectedJobDetails.salary || 'Competitive'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-clock text-primary fs-5 me-3"></i>
                                        <div>
                                            <h6 className="text-muted mb-0">Job Type</h6>
                                            <p className="mb-0 fw-medium">{selectedJobDetails.type}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5">
                                <h4 className="h5 text-primary mb-3 d-flex align-items-center">
                                    <i className="bi bi-file-text me-2"></i> Job Description
                                </h4>
                                <div className="ps-4 border-start border-3 border-primary">
                                    <p className="mb-0">{selectedJobDetails.description}</p>
                                </div>
                            </div>

                            {selectedJobDetails.requirements?.length > 0 && (
                                <div className="mb-5">
                                    <h4 className="h5 text-primary mb-3 d-flex align-items-center">
                                        <i className="bi bi-list-check me-2"></i> Requirements
                                    </h4>
                                    <ul className="list-unstyled ps-4">
                                        {selectedJobDetails.requirements.map((req, index) => (
                                            <li key={index} className="mb-2 d-flex">
                                                <i className="bi bi-check-circle text-success me-2 mt-1"></i>
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {selectedJobDetails.skills?.length > 0 && (
                                <div className="mb-5">
                                    <h4 className="h5 text-primary mb-3 d-flex align-items-center">
                                        <i className="bi bi-tools me-2"></i> Skills Required
                                    </h4>
                                    <div className="d-flex flex-wrap gap-2">
                                        {selectedJobDetails.skills.map((skill, index) => (
                                            <span key={index} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 py-2 px-3">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-top pt-4 mt-3">
                                <div className="mb-3 mb-md-0">
                                    <small className="text-muted d-flex align-items-center">
                                        <i className="bi bi-calendar me-2"></i>
                                        Posted {formatDateToRelative(selectedJobDetails.posted)} • {selectedJobDetails.applicants || 0} applicants
                                    </small>
                                </div>
                                <button
                                    className="btn btn-sm btn-primary btn-lg px-4 py-2 d-flex align-items-center"
                                    onClick={() => { withdrawJobApplication(jobId); navigate(-1) }}
                                >
                                    Withdraw <i className="bi bi-box-arrow-left ms-2"></i>
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserJobDetails