import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSuperAdminContext } from '../../../context/superadmin-context';

const ViewApplicantPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { getApplicantsProfile, applicantProfile, applicants: { job } } = useSuperAdminContext()

    useEffect(() => {
        getApplicantsProfile(id)
    }, [])

    const handleChangeStatus = (newStatus) => {
        console.log(`Changing status to ${newStatus}`);
        // API call would go here
    };

    const handleSendMessage = (message) => {
        console.log(`Sending message: ${message}`);
        // API call would go here
    };

    return (
        <>
            <div className="container-fluid bg-light">
                <div className="container py-5">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-sm btn-outline-secondary mb-4"
                    >
                        <i className="bi bi-arrow-left me-2"></i> Back to Applicants
                    </button>

                    {/* Applicant Header */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={applicantProfile.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(applicantProfile.fullname)}&background=random`}
                                        alt={applicantProfile.fullname}
                                        className="rounded-circle object-fit-cover me-3"
                                        style={{ width: "80px", height: "80px" }}
                                    />
                                    <div>
                                        <h1 className="h3 mb-1">{applicantProfile.fullname}</h1>
                                        <p className="text-muted mb-2">{applicantProfile.headline}</p>
                                        <p className="text-muted mb-2"><i className="bi bi-geo-alt me-1"></i>{applicantProfile.location}</p>
                                        <span className="badge bg-primary">
                                            Active {new Date(applicantProfile.lastActive).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Main Applicant Info */}
                        <div className="col-lg-8">
                            <div className="card shadow-sm mb-4">
                                <div className="card-body">
                                    <h2 className="h5 mb-4">Candidate Details</h2>

                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <h3 className="h6">Contact Information</h3>
                                            <ul className="list-unstyled">
                                                <li className="mb-2"><a href={`mailto:${applicantProfile.email}`}><i className="bi bi-envelope me-2"></i>{applicantProfile.email}</a></li>
                                                <li className="mb-2"><a href={`tel:${applicantProfile.phone}`}><i className="bi bi-phone me-2"></i>{applicantProfile.phone}</a></li>
                                                <li className="mb-2"><i className="bi bi-calendar me-2"></i>DOB: {new Date(applicantProfile.dob).toLocaleDateString()}</li>
                                                <li className="mb-2"><i className="bi bi-gender-ambiguous me-2"></i>{applicantProfile.gender}</li>
                                                <li className="d-flex gap-2 mt-3">
                                                    {applicantProfile?.socialMedia?.linkedin && (
                                                        <a href={applicantProfile.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                                                            <i className="bi bi-linkedin fs-5"></i>
                                                        </a>
                                                    )}
                                                    {applicantProfile?.socialMedia?.twitter && (
                                                        <a href={applicantProfile.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                                                            <i className="bi bi-twitter fs-5"></i>
                                                        </a>
                                                    )}
                                                    {applicantProfile?.socialMedia?.facebook && (
                                                        <a href={applicantProfile.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                                                            <i className="bi bi-facebook fs-5"></i>
                                                        </a>
                                                    )}
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <h3 className="h6">Documents</h3>
                                            <div className="d-flex flex-column gap-2">
                                                <a href={applicantProfile.resume} className="btn btn-outline-primary btn-sm" target="_blank" rel="noopener noreferrer">
                                                    <i className="bi bi-file-earmark-pdf me-1"></i> View Resume
                                                </a>
                                                <button className="btn btn-outline-secondary btn-sm">
                                                    <i className="bi bi-download me-1"></i> Download Resume
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className="mb-4">
                                        <h3 className="h5 mb-3">Professional Summary</h3>
                                        <p>{applicantProfile?.summary || "No summary provided"}</p>
                                    </div>

                                    {/* Experience */}
                                    <div className="mb-4">
                                        <h3 className="h5 mb-3">Professional Experience</h3>
                                        {applicantProfile?.experience?.length > 0 ? (
                                            <div className="list-group">
                                                {applicantProfile?.experience?.map((exp, i) => (
                                                    <div key={i} className="list-group-item border-0 p-0 mb-3">
                                                        <h4 className="h6 mb-1">{exp.title}</h4>
                                                        <p className="mb-1 fw-medium">{exp.company} • {exp.location}</p>
                                                        <p className="text-muted small mb-1">
                                                            {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                                                        </p>
                                                        <p className="mb-0">{exp.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted">No experience listed</p>
                                        )}
                                    </div>

                                    {/* Education */}
                                    <div className="mb-4">
                                        <h3 className="h5 mb-3">Education</h3>
                                        {applicantProfile?.education?.length > 0 ? (
                                            <div className="list-group">
                                                {applicantProfile?.education?.map((edu, i) => (
                                                    <div key={i} className="list-group-item border-0 p-0 mb-2">
                                                        <h4 className="h6 mb-1">{edu.degree}</h4>
                                                        <p className="mb-1">{edu.institution}</p>
                                                        <p className="text-muted small mb-0">Completed: {edu.year}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted">No education listed</p>
                                        )}
                                    </div>

                                    {/* Skills */}
                                    <div className="mb-4">
                                        <h3 className="h5 mb-3">Skills</h3>
                                        <div className="d-flex flex-wrap gap-2">
                                            {applicantProfile?.skills?.map((skillObj, i) => (
                                                <span key={i} className="badge bg-primary bg-opacity-10 text-primary">
                                                    {skillObj?.skills}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Certifications */}
                                    <div className="mb-4">
                                        <h3 className="h5 mb-3">Certifications</h3>
                                        {applicantProfile?.certifications?.length > 0 ? (
                                            <div className="list-group">
                                                {applicantProfile?.certifications?.map((cert, i) => (
                                                    <div key={i} className="list-group-item border-0 p-0 mb-2">
                                                        <h4 className="h6 mb-1">{cert.certificates}</h4>
                                                        <p className="mb-1">{cert.issuer}</p>
                                                        <p className="text-muted small mb-0">Year: {cert.year}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted">No certifications listed</p>
                                        )}
                                    </div>

                                    {/* Projects */}
                                    <div className="mb-4">
                                        <h3 className="h5 mb-3">Projects</h3>
                                        {applicantProfile?.projects?.length > 0 ? (
                                            <div className="list-group">
                                                {applicantProfile?.projects?.map((project, i) => (
                                                    <div key={i} className="list-group-item border-0 p-0 mb-2">
                                                        <h4 className="h6 mb-1">{project.projects}</h4>
                                                        <p className="mb-1">{project.description}</p>
                                                        <p className="text-muted small mb-0">Year: {project.year}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted">No projects listed</p>
                                        )}
                                    </div>

                                    {/* Languages */}
                                    <div>
                                        <h3 className="h5 mb-3">Languages</h3>
                                        <div className="d-flex flex-wrap gap-2">
                                            {applicantProfile?.languages?.map((lang, i) => (
                                                <span key={i} className="badge bg-secondary bg-opacity-10 text-secondary">
                                                    {lang?.languages}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="col-lg-4">
                            <div className="card shadow-sm sticky-top" style={{ top: '100px', zIndex: "2" }}>
                                <div className="card-body">
                                    <h3 className="h5 mb-4">Admin Actions</h3>

                                    {/* <button className="btn btn-primary w-100 mb-2" onClick={() => navigate(`/superadmin/scheduleInterview?applicantId=${applicantProfile.userId}&jobId=${job._id}`)}>
                                        <i className="bi bi-calendar-check me-1"></i> Schedule Interview
                                    </button> */}
                                    <button
                                        className="btn btn-primary w-100 mb-2"
                                        onClick={() => navigate("/superadmin/scheduleInterview", {
                                            state: {
                                                applicant: {
                                                    _id: applicantProfile.userId,
                                                    fullname: applicantProfile.fullname,
                                                    email: applicantProfile.email,
                                                    phone: applicantProfile.phone
                                                },
                                                job: {
                                                    _id: job._id,
                                                    title: job.title,
                                                    company: job.company,
                                                    companyId: job.userId,
                                                }
                                            }
                                        })}
                                    >
                                        <i className="bi bi-calendar-check me-1"></i> Schedule Interview
                                    </button>



                                    <button className="btn btn-success w-100 mb-2" onClick={() => handleChangeStatus('Hired')}>
                                        <i className="bi bi-check-circle me-1"></i> Mark as Hired
                                    </button>
                                    <button className="btn btn-danger w-100 mb-2" onClick={() => handleChangeStatus('Rejected')}>
                                        <i className="bi bi-x-circle me-1"></i> Reject Application
                                    </button>
                                    <a href={applicantProfile.resume} download className="btn btn-outline-secondary w-100 mb-2">
                                        <i className="bi bi-download me-1"></i> Download Resume
                                    </a>

                                    <hr className="my-4" />

                                    <h4 className="h6 mb-3">Quick Notes</h4>
                                    <textarea className="form-control mb-2" rows="3" placeholder="Add private notes..."></textarea>
                                    <button className="btn btn-sm btn-outline-primary w-100">Save Notes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default ViewApplicantPage;