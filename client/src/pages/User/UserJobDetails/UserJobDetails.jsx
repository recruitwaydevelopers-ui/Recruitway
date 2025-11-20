import { useEffect } from 'react'
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
            <div className="container-fluid job-details-container">
                <div className="container py-5">
                    <button
                        className="btn-back mb-4"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left me-2"></i> Back to Applied Jobs
                    </button>

                    <div className="job-details-card">
                        <div className="job-header">
                            <div className="job-header-content">
                                <div className="company-info">
                                    <div className="company-logo">
                                        {selectedJobDetails.company?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="job-title-section">
                                        <h1 className="job-title">{selectedJobDetails.title}</h1>
                                        <h2 className="company-name">
                                            <i className="bi bi-building me-2"></i>
                                            {selectedJobDetails.company}
                                        </h2>
                                    </div>
                                </div>
                                <div className="status-badge-container">
                                    <span className={`status-badge ${selectedJobDetails.status === 'Active' ? 'active' : 'inactive'}`}>
                                        <i className={`bi ${selectedJobDetails.status === 'Active' ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                                        {selectedJobDetails.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="job-body">
                            <div className="job-meta">
                                <div className="meta-item">
                                    <div className="meta-icon location">
                                        <i className="bi bi-geo-alt"></i>
                                    </div>
                                    <div className="meta-content">
                                        <h6>Location</h6>
                                        <p>{selectedJobDetails.location || 'Remote'}</p>
                                    </div>
                                </div>
                                <div className="meta-item">
                                    <div className="meta-icon salary">
                                        <i className="bi bi-cash-coin"></i>
                                    </div>
                                    <div className="meta-content">
                                        <h6>Salary</h6>
                                        <p>{selectedJobDetails.salary || 'Competitive'}</p>
                                    </div>
                                </div>
                                <div className="meta-item">
                                    <div className="meta-icon type">
                                        <i className="bi bi-clock"></i>
                                    </div>
                                    <div className="meta-content">
                                        <h6>Job Type</h6>
                                        <p>{selectedJobDetails.type}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="job-section">
                                <div className="section-header">
                                    <i className="bi bi-file-text"></i>
                                    <h4>Job Description</h4>
                                </div>
                                <div className="section-content">
                                    <p>{selectedJobDetails.description}</p>
                                </div>
                            </div>

                            {selectedJobDetails.requirements?.length > 0 && (
                                <div className="job-section">
                                    <div className="section-header">
                                        <i className="bi bi-list-check"></i>
                                        <h4>Requirements</h4>
                                    </div>
                                    <div className="section-content">
                                        <ul className="requirements-list">
                                            {selectedJobDetails.requirements.map((req, index) => (
                                                <li key={index}>
                                                    <i className="bi bi-check-circle-fill"></i>
                                                    <span>{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {selectedJobDetails.skills?.length > 0 && (
                                <div className="job-section">
                                    <div className="section-header">
                                        <i className="bi bi-tools"></i>
                                        <h4>Skills Required</h4>
                                    </div>
                                    <div className="section-content">
                                        <div className="skills-container">
                                            {selectedJobDetails.skills.map((skill, index) => (
                                                <div key={index} className="skill-tag">
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="job-footer">
                                <div className="job-meta-info">
                                    <div className="meta-info-item">
                                        <i className="bi bi-calendar"></i>
                                        <span>Posted {formatDateToRelative(selectedJobDetails.posted)}</span>
                                    </div>
                                    <div className="meta-info-item">
                                        <i className="bi bi-people"></i>
                                        <span>{selectedJobDetails.applicants || 0} applicants</span>
                                    </div>
                                </div>
                                <button
                                    className="btn-withdraw"
                                    onClick={() => { withdrawJobApplication(jobId); navigate(-1) }}
                                >
                                    <i className="bi bi-box-arrow-left me-2"></i>
                                    Withdraw Application
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
        .job-details-container {
            background-color: #f8f9fa;
            min-height: 100vh;
        }

        .btn-back {
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem;
            background-color: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            color: #6c757d;
            font-weight: 500;
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .btn-back:hover {
            background-color: #f8f9fa;
            color: #0d6efd;
            transform: translateX(-3px);
        }

        .job-details-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .job-header {
            background: linear-gradient(135deg, #0d6efd, #0b5ed7);
            padding: 2rem;
            position: relative;
            overflow: hidden;
        }

        .job-header::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            transform: translate(100px, -150px);
        }

        .job-header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            position: relative;
            z-index: 1;
        }

        .company-info {
            display: flex;
            align-items: flex-start;
            gap: 1.5rem;
        }

        .company-logo {
            width: 80px;
            height: 80px;
            border-radius: 16px;
            background-color: rgba(255, 255, 255, 0.2);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .job-title-section {
            flex: 1;
        }

        .job-title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: white;
        }

        .company-name {
            font-size: 1.2rem;
            font-weight: 500;
            margin-bottom: 0;
            color: rgba(255, 255, 255, 0.9);
        }

        .status-badge-container {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        .status-badge {
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem;
            border-radius: 50px;
            font-weight: 600;
            font-size: 0.9rem;
        }

        .status-badge.active {
            background-color: rgba(14, 231, 61, 0.83);
            color: #198754;
        }

        .status-badge.inactive {
            background-color: rgba(165, 47, 47, 1);
            color: #ffffff;
        }

        .job-body {
            padding: 2.5rem;
        }

        .job-meta {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 2.5rem;
            flex-wrap: wrap;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem;
            background-color: #f8f9fa;
            border-radius: 12px;
            flex: 1;
            min-width: 200px;
            transition: all 0.2s ease;
        }

        .meta-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .meta-icon {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
        }

        .meta-icon.location {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
        }

        .meta-icon.salary {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
        }

        .meta-icon.type {
            background: linear-gradient(135deg, #3498db, #2980b9);
        }

        .meta-content h6 {
            font-size: 0.85rem;
            color: #6c757d;
            margin-bottom: 0.25rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .meta-content p {
            font-size: 1rem;
            margin-bottom: 0;
            font-weight: 500;
            color: #212529;
        }

        .job-section {
            margin-bottom: 2.5rem;
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid #e9ecef;
        }

        .section-header i {
            font-size: 1.5rem;
            color: #0d6efd;
        }

        .section-header h4 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #212529;
            margin: 0;
        }

        .section-content {
            padding-left: 2.25rem;
        }

        .section-content p {
            line-height: 1.7;
            color: #495057;
        }

        .requirements-list {
            list-style: none;
            padding: 0;
        }

        .requirements-list li {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            margin-bottom: 1rem;
            line-height: 1.6;
        }

        .requirements-list i {
            color: #28a745;
            font-size: 1.1rem;
            margin-top: 0.1rem;
        }

        .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
        }

        .skill-tag {
            padding: 0.5rem 1rem;
            background-color: rgba(13, 110, 253, 0.1);
            color: #0d6efd;
            border-radius: 50px;
            font-weight: 500;
            font-size: 0.9rem;
            border: 1px solid rgba(13, 110, 253, 0.2);
            transition: all 0.2s ease;
        }

        .skill-tag:hover {
            background-color: rgba(13, 110, 253, 0.2);
            transform: translateY(-2px);
        }

        .job-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 2rem;
            margin-top: 2rem;
            border-top: 1px solid #e9ecef;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .job-meta-info {
            display: flex;
            gap: 1.5rem;
        }

        .meta-info-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #6c757d;
            font-size: 0.9rem;
        }

        .meta-info-item i {
            color: #0d6efd;
        }

        .btn-withdraw {
            display: flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .btn-withdraw:hover {
            background-color: #c82333;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
        }

        @media (max-width: 768px) {
            .job-header-content {
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .company-info {
                width: 100%;
            }
            
            .status-badge-container {
                width: 100%;
                align-items: flex-start;
            }
            
            .job-meta {
                flex-direction: column;
            }
            
            .job-footer {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .job-body {
                padding: 1.5rem;
            }
        }
    `}</style>
            </div>
        </>
    )
}

export default UserJobDetails