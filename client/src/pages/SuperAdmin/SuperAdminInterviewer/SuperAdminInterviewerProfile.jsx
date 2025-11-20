import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../../../context/auth-context';
import axios from 'axios';
import { useState, useEffect } from 'react';

const SuperAdminInterviewerProfile = () => {
    const { id } = useParams();
    const { server } = useAuthContext()
    const token = localStorage.getItem("token")
    const [interviewer, setInterviewer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchInterviewer = async () => {
            try {
                const response = await axios.get(`${server}/api/v1/superadmin/getInterviewersProfile/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setInterviewer(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch interviewer');
            } finally {
                setLoading(false);
            }
        };

        fetchInterviewer();
    }, [id]);

    if (loading) {
        return (
            <div className="container-fluid">
                <div className="container py-4">
                    <div className="d-flex justify-content-center align-items-center vh-100">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid">
                <div className="container py-4">
                    <div className="alert alert-danger m-3">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!interviewer) {
        return (
            <div className="container-fluid">
                <div className="container py-4">
                    <div className="alert alert-warning m-3">
                        Interviewer not found
                    </div>
                </div>
            </div >
        );
    }

    return (
        <>
            <div className="container-fluid">
                <div className="container py-4">
                    <div className="row">
                        {/* Left Column */}
                        <div className="col-lg-4 mb-4">
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => navigate(-1)}
                            >
                                <i className="bi bi-arrow-left me-2"></i>Back To Interviewer's List
                            </button>
                            <div className="card shadow-sm">
                                <div className="card-body text-center">
                                    <img
                                        src={interviewer.profilePicture || 'https://via.placeholder.com/150'}
                                        alt="Profile"
                                        className="rounded-circle mb-3"
                                        width="150"
                                        height="150"
                                    />
                                    <h2 className="h4">{interviewer.fullname}</h2>
                                    <p className="text-muted mb-3">{interviewer.headline}</p>

                                    <div className="d-flex justify-content-center gap-2 mb-3">
                                        {interviewer.socialMedia?.linkedin && (
                                            <a href={interviewer.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                                                <i className="bi bi-linkedin"></i>
                                            </a>
                                        )}
                                        {interviewer.socialMedia?.github && (
                                            <a href={interviewer.socialMedia.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-sm">
                                                <i className="bi bi-github"></i>
                                            </a>
                                        )}
                                        {interviewer.socialMedia?.twitter && (
                                            <a href={interviewer.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info btn-sm">
                                                <i className="bi bi-twitter"></i>
                                            </a>
                                        )}
                                    </div>

                                    <div className="text-start">
                                        <h5 className="h6 border-bottom pb-2">Contact Info</h5>
                                        <p className="mb-1">
                                            <i className="bi bi-envelope me-2"></i> {interviewer.email}
                                        </p>
                                        <p className="mb-1">
                                            <i className="bi bi-telephone me-2"></i> {interviewer.phone || 'Not provided'}
                                        </p>
                                        <p className="mb-1">
                                            <i className="bi bi-geo-alt me-2"></i> {interviewer.location || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="card shadow-sm mt-4">
                                <div className="card-body">
                                    <h5 className="h6 border-bottom pb-2">Skills</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {interviewer.skills?.map((skill, index) => (
                                            <span key={index} className="badge bg-primary bg-opacity-10 text-primary">
                                                {skill.skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Languages */}
                            <div className="card shadow-sm mt-4">
                                <div className="card-body">
                                    <h5 className="h6 border-bottom pb-2">Languages</h5>
                                    <ul className="list-unstyled mb-0">
                                        {interviewer.languages?.map((lang, index) => (
                                            <li key={index} className="mb-1">
                                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                {lang.language}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-lg-8">
                            {/* About */}
                            <div className="card shadow-sm mb-4">
                                <div className="card-body">
                                    <h5 className="h6 border-bottom pb-2">About</h5>
                                    <p>{interviewer.summary || 'No summary provided'}</p>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <p className="mb-1">
                                                <strong>Experience:</strong> {interviewer.yearsOfExperience || '0'} years
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="mb-1 text-capitalize">
                                                <strong>Gender:</strong> {interviewer.gender || 'Not specified'}
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="mb-1">
                                                <strong>Age:</strong> {interviewer.age?.years || 'Not specified'} years
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Experience */}
                            <div className="card shadow-sm mb-4">
                                <div className="card-body">
                                    <h5 className="h6 border-bottom pb-2">Experience</h5>
                                    {interviewer.experience?.length > 0 ? (
                                        interviewer.experience.map((exp, index) => (
                                            <div key={index} className="mb-3">
                                                <h6 className="mb-1">{exp.title}</h6>
                                                <p className="mb-1 text-muted">
                                                    {exp.company} • {exp.location}
                                                </p>
                                                <p className="mb-1 text-muted">
                                                    {exp.startDate} - {exp.endDate}
                                                </p>
                                                <p className="mb-0">{exp.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No experience information provided</p>
                                    )}
                                </div>
                            </div>

                            {/* Education */}
                            <div className="card shadow-sm mb-4">
                                <div className="card-body">
                                    <h5 className="h6 border-bottom pb-2">Education</h5>
                                    {interviewer.education?.length > 0 ? (
                                        interviewer.education.map((edu, index) => (
                                            <div key={index} className="mb-3">
                                                <h6 className="mb-1">{edu.degree}</h6>
                                                <p className="mb-1 text-muted">
                                                    {edu.institution} • {edu.year}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No education information provided</p>
                                    )}
                                </div>
                            </div>

                            {/* Certifications */}
                            <div className="card shadow-sm mb-4">
                                <div className="card-body">
                                    <h5 className="h6 border-bottom pb-2">Certifications</h5>
                                    {interviewer.certifications?.length > 0 ? (
                                        interviewer.certifications.map((cert, index) => (
                                            <div key={index} className="mb-3">
                                                <h6 className="mb-1">{cert.name}</h6>
                                                <p className="mb-1 text-muted">
                                                    {cert.issuer} • {cert.year}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No certifications provided</p>
                                    )}
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="h6 border-bottom pb-2">Availability</h5>
                                    {interviewer.availability?.length > 0 ? (
                                        <div className="row">
                                            {interviewer.availability.map((avail, index) => (
                                                <div key={index} className="col-md-6 mb-2">
                                                    <div className="card bg-light">
                                                        <div className="card-body p-3">
                                                            <p className="mb-1 fw-bold">{avail.day}</p>
                                                            <p className="mb-1">{avail.time}</p>
                                                            <p className="mb-0 text-muted small">{avail.timezone}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No availability information provided</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SuperAdminInterviewerProfile;