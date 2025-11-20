import { useLocation } from 'react-router-dom';

const CompanyCandidateProfile = () => {
    const { state } = useLocation();
    const profile = state?.candidate;

    if (!profile) {
        return <div className="container py-5 text-center">
            <div className="alert alert-warning">No candidate data available</div>
        </div>;
    }

    // Destructure profile data
    const {
        profilePicture,
        fullname,
        email,
        gender,
        dob,
        age,
        headline,
        location,
        phone,
        summary,
        experience,
        education,
        skills,
        certifications,
        languages,
        projects,
        socialMedia,
        resume
    } = profile;

    return (
        <>
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="row">
                        {/* Left Sidebar */}
                        <div className="col-lg-4">
                            <div className="card shadow-sm mb-4">
                                <div className="card-body text-center">
                                    <img
                                        src={profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname)}&background=random`}
                                        alt={fullname}
                                        className="rounded-circle border shadow-sm mb-3"
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            objectFit: 'cover',
                                            border: '4px solid white'
                                        }}
                                    />
                                    <h3 className="mb-1">{fullname || 'No Name Provided'}</h3>
                                    <p className="text-muted mb-3">{headline || 'No headline provided'}</p>

                                    <div className="d-flex justify-content-center gap-2 mb-4">
                                        <span className="badge bg-primary">
                                            {gender || 'Gender not specified'}
                                        </span>
                                        {age?.years && (
                                            <span className="badge bg-secondary">
                                                {age.years} years
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="card shadow-sm mb-4 border-0">
                                <div className="card-body p-4">
                                    <h5 className="card-title d-flex align-items-center mb-4">
                                        <i className="bi bi-person-lines-fill text-primary me-2"></i>
                                        Contact Information
                                    </h5>

                                    <ul className="list-unstyled">
                                        <li className="mb-3 pb-2 border-bottom">
                                            <div className="d-flex align-items-start">
                                                <i className="bi bi-envelope text-muted me-3 mt-1"></i>
                                                <div>
                                                    <h6 className="small text-muted mb-1">Email</h6>
                                                    <p className="mb-0">
                                                        {email || <span className="text-muted">Not provided</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>

                                        <li className="mb-3 pb-2 border-bottom">
                                            <div className="d-flex align-items-start">
                                                <i className="bi bi-geo-alt text-muted me-3 mt-1"></i>
                                                <div>
                                                    <h6 className="small text-muted mb-1">Location</h6>
                                                    <p className="mb-0">
                                                        {location || <span className="text-muted">Not provided</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>

                                        <li className="mb-3 pb-2 border-bottom">
                                            <div className="d-flex align-items-start">
                                                <i className="bi bi-telephone text-muted me-3 mt-1"></i>
                                                <div>
                                                    <h6 className="small text-muted mb-1">Phone</h6>
                                                    <p className="mb-0">
                                                        {phone || <span className="text-muted">Not provided</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>

                                        <li className="mb-3 pb-2 border-bottom">
                                            <div className="d-flex align-items-start">
                                                <i className="bi bi-calendar3 text-muted me-3 mt-1"></i>
                                                <div>
                                                    <h6 className="small text-muted mb-1">Date of Birth</h6>
                                                    <p className="mb-0">
                                                        {dob || <span className="text-muted">Not specified</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>

                                        {socialMedia && (
                                            <>
                                                <li className="mb-3 pb-2 border-bottom">
                                                    <div className="d-flex align-items-start">
                                                        <i className="bi bi-linkedin text-muted me-3 mt-1"></i>
                                                        <div>
                                                            <h6 className="small text-muted mb-1">LinkedIn</h6>
                                                            <p className="mb-0">
                                                                {socialMedia.linkedin ? (
                                                                    <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                                                        <span className="d-flex align-items-center">
                                                                            View Profile <i className="bi bi-box-arrow-up-right ms-2 small"></i>
                                                                        </span>
                                                                    </a>
                                                                ) : <span className="text-muted">Not provided</span>}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>

                                                <li className="mb-3">
                                                    <div className="d-flex align-items-start">
                                                        <i className="bi bi-twitter text-muted me-3 mt-1"></i>
                                                        <div>
                                                            <h6 className="small text-muted mb-1">Twitter</h6>
                                                            <p className="mb-0">
                                                                {socialMedia.twitter ? (
                                                                    <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                                                        <span className="d-flex align-items-center">
                                                                            @{socialMedia.twitter.split('/').pop()} <i className="bi bi-box-arrow-up-right ms-2 small"></i>
                                                                        </span>
                                                                    </a>
                                                                ) : <span className="text-muted">Not provided</span>}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div className="card shadow-sm mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">Skills</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {skills?.length ? (
                                            skills.map((skill, idx) => (
                                                skill.skills && (
                                                    <span key={idx} className="badge bg-primary">
                                                        {skill.skills}
                                                    </span>
                                                )
                                            ))
                                        ) : (
                                            <span className="text-muted">No skills listed</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Languages</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {languages?.length ? (
                                            languages.map((lang, idx) => (
                                                lang.languages && (
                                                    <span key={idx} className="badge bg-secondary">
                                                        {lang.languages}
                                                    </span>
                                                )
                                            ))
                                        ) : (
                                            <span className="text-muted">No languages listed</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {resume && (
                                <div className="card shadow-sm mt-4">
                                    <div className="card-body text-center">
                                        <h4 className="card-title mb-3">Resume</h4>
                                        <a
                                            href={resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-primary"
                                        >
                                            <i className="ti ti-download me-2"></i>
                                            Download Resume
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Main Content */}
                        <div className="col-lg-8">
                            {summary && (
                                <div className="card shadow-sm mb-4">
                                    <div className="card-body">
                                        <h4 className="card-title mb-4">Professional Summary</h4>
                                        <p className="card-text">{summary}</p>
                                    </div>
                                </div>
                            )}

                            <div className="card shadow-sm mb-4">
                                <div className="card-body">
                                    <h4 className="card-title mb-4">Work Experience</h4>
                                    {experience?.length > 0 ? (
                                        experience.map((job, idx) => (
                                            (job.title || job.company) && (
                                                <div key={idx} className="mb-4 pb-3 border-bottom">
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            {job.title && <h5 className="mb-1">{job.title}</h5>}
                                                            {job.company && <p className="mb-1">{job.company}</p>}
                                                            {(job.startDate || job.endDate) && (
                                                                <small className="text-muted d-block mb-1">
                                                                    {job.startDate} - {job.endDate || 'Present'}
                                                                </small>
                                                            )}
                                                            {job.location && <small className="text-muted">{job.location}</small>}
                                                        </div>
                                                        {!job.endDate && (
                                                            <span className="badge bg-success">Current</span>
                                                        )}
                                                    </div>
                                                    {job.description && (
                                                        <p className="mt-3">{job.description}</p>
                                                    )}
                                                </div>
                                            )
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <i className="ti ti-briefcase-off fs-1 text-muted mb-3"></i>
                                            <p className="text-muted">No work experience added yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="card shadow-sm mb-4">
                                <div className="card-body">
                                    <h4 className="card-title mb-4">Education</h4>
                                    {education?.length > 0 ? (
                                        education.map((edu, idx) => (
                                            (edu.degree || edu.institution) && (
                                                <div key={idx} className="mb-4 pb-3 border-bottom">
                                                    {edu.degree && <h5 className="mb-1">{edu.degree}</h5>}
                                                    {edu.institution && <p className="mb-1">{edu.institution}</p>}
                                                    {edu.year && <small className="text-muted">{edu.year}</small>}
                                                </div>
                                            )
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <i className="ti ti-school fs-1 text-muted mb-3"></i>
                                            <p className="text-muted">No education information added yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {projects?.length > 0 && (
                                <div className="card shadow-sm mb-4">
                                    <div className="card-body">
                                        <h4 className="card-title mb-4">Projects</h4>
                                        {projects.map((project, idx) => (
                                            (project.projects || project.description) && (
                                                <div key={idx} className="mb-4 pb-3 border-bottom">
                                                    {project.projects && <h5 className="card-title">{project.projects}</h5>}
                                                    {project.year && <h6 className="card-subtitle mb-2 text-muted">{project.year}</h6>}
                                                    {project.description && <p className="card-text small">{project.description}</p>}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}

                            {certifications?.length > 0 && (
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h4 className="card-title mb-4">Certifications</h4>
                                        <div className="row">
                                            {certifications.map((cert, idx) => (
                                                (cert.certificates || cert.issuer) && (
                                                    <div key={idx} className="col-md-6 mb-3">
                                                        <div className="card border">
                                                            <div className="card-body">
                                                                {cert.certificates && <h5 className="card-title">{cert.certificates}</h5>}
                                                                {cert.issuer && <h6 className="card-subtitle mb-2 text-muted">{cert.issuer}</h6>}
                                                                {cert.year && <p className="card-text small text-muted">{cert.year}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            ))}
                                        </div>
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

export default CompanyCandidateProfile;