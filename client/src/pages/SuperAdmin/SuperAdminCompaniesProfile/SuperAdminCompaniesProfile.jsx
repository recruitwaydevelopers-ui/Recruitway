import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useTemporaryLoading from '../../../hooks/useTemporaryLoading';
import { useSuperAdminContext } from '../../../context/superadmin-context';

const SuperAdminCompaniesProfile = () => {
    const location = useLocation();
    const { companyProfile } = location.state;
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('about');
    const { loading, triggerLoading } = useTemporaryLoading();
    const { getAllJobOfSingleCompany, companyJobs: jobs } = useSuperAdminContext()

    const company = companyProfile

    useEffect(() => {
        triggerLoading();
    }, []);

    useEffect(() => {
        getAllJobOfSingleCompany(company?.userId);
    }, [company?.userId]);

    const handleViewJobs = (companyId) => {
        navigate(`/superadmin/companiesJobs/${companyId}`);
    };

    if (loading) {
        return (
            <>
                <div className="container-fluid">
                    <div className="container py-5">
                        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                            <div className="text-center">
                                <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3 text-muted">Loading company profile...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!company) {
        return (
            <>
                <div className="container-fluid">
                    <div className="container py-5">
                        <div className="container py-5 text-center">
                            <div className="bg-white rounded-3 p-5 shadow-sm">
                                <i className="bi bi-building-x display-1 text-muted mb-4"></i>
                                <h3 className="mb-3">Company not found</h3>
                                <p className="text-muted mb-4">The company you're looking for doesn't exist or may have been removed</p>
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={() => navigate('/companies')}
                                >
                                    Browse Companies
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="bg-light min-vh-100">
                        <div className="w-100 bg-dark text-white py-4">
                            <div className="container">
                                <div>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => navigate(-1)}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>Back To Companies
                                    </button>
                                </div>
                                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-4 gap-md-5">
                                    {/* Company Logo */}
                                    <div className="position-relative">
                                        <img
                                            src={company.profilePicture || '/default-company.png'}
                                            alt={`${company.fullname} logo`}
                                            className="rounded-circle border border-4 border-white shadow-lg"
                                            style={{
                                                width: 'clamp(80px, 20vw, 120px)',
                                                height: 'clamp(80px, 20vw, 120px)',
                                                minWidth: '80px',
                                                minHeight: '80px',
                                                objectFit: 'cover'
                                            }}
                                            loading="lazy"
                                            aria-hidden={!company.profilePicture}
                                        />
                                        {!company.profilePicture && (
                                            <span className="visually-hidden">Company logo placeholder</span>
                                        )}
                                    </div>

                                    {/* Company Info */}
                                    <div className="text-center text-md-start flex-grow-1">
                                        {/* Company Name */}
                                        <h1 className="display-5 text-white fw-bold mb-1">
                                            {company.fullname}
                                        </h1>

                                        {/* Meta Information */}
                                        <div className="d-flex justify-content-center justify-content-md-start align-items-center flex-wrap gap-2 gap-md-3 mb-3">
                                            {/* Location */}
                                            <span className="d-flex align-items-center text-white-80">
                                                <i className="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>
                                                <span>{company.headquarters || 'Not specified'}</span>
                                            </span>

                                            {/* Industry */}
                                            <span className="d-flex align-items-center text-white-80">
                                                <i className="bi bi-building me-1" aria-hidden="true"></i>
                                                <span>{company.industry || 'Not specified'}</span>
                                            </span>

                                            {/* Company Size */}
                                            <span className="d-flex align-items-center text-white-80">
                                                <i className="bi bi-people-fill me-1" aria-hidden="true"></i>
                                                <span>{company.companySize || 'Not specified'}</span>
                                            </span>

                                            {/* Website Link */}
                                            {company.website && (
                                                <a
                                                    href={company.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white text-decoration-none d-flex align-items-center hover-opacity"
                                                    aria-label="Company website"
                                                >
                                                    <i className="bi bi-globe me-1" aria-hidden="true"></i>
                                                    <span className="d-none d-sm-inline">Website</span>
                                                </a>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-md-start gap-2">
                                            {/* View Jobs Button */}
                                            <button
                                                className="btn btn-sm btn-primary rounded-pill d-flex align-items-center justify-content-center"
                                                onClick={() => handleViewJobs(company?.userId)}
                                                aria-label={`View ${jobs.length} available jobs`}
                                            >
                                                <i className="bi bi-briefcase-fill me-1 me-sm-2" aria-hidden="true"></i>
                                                <span>
                                                    View {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'}
                                                </span>
                                            </button>

                                            {/* Contact Button */}
                                            <button
                                                className="btn btn-sm btn-outline-light rounded-pill d-flex align-items-center justify-content-center"
                                                aria-label="Contact company"
                                            >
                                                <i className="bi bi-envelope-fill me-1 me-sm-2" aria-hidden="true"></i>
                                                <span>Contact</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Section */}
                        <main className="container py-5">
                            <div className="row">
                                {/* Sidebar - Company Details */}
                                <aside className="col-lg-4 mb-4 mb-lg-0">
                                    <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                                        <div className="card-body">
                                            <h2 className="h5 card-title mb-4">Company Details</h2>
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                                    <span className="text-muted">Industry</span>
                                                    <span>{company.industry}</span>
                                                </li>
                                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                                    <span className="text-muted">Headquarters</span>
                                                    <span>{company.headquarters || 'Not specified'}</span>
                                                </li>
                                                {company.ceo?.ceoName && (
                                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                                        <span className="text-muted">CEO</span>
                                                        <span>{company.ceo.ceoName}</span>
                                                    </li>
                                                )}
                                                {company.founder?.founderName && (
                                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                                        <span className="text-muted">Founder</span>
                                                        <span>{company.founder.founderName}</span>
                                                    </li>
                                                )}
                                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                                    <span className="text-muted">Company Size</span>
                                                    <span>{company.companySize || 'Not specified'}</span>
                                                </li>
                                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                                    <span className="text-muted">Contact Phone</span>
                                                    <span><a href={`tel:${company.contactPhone}`}>{company.contactPhone}</a></span>
                                                </li>
                                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                                    <span className="text-muted">Contact Email</span>
                                                    <span><a href={`mailto:${company.contactEmail}`}>{company.contactEmail}</a></span>
                                                </li>
                                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                                    <span className="text-muted">Member Since</span>
                                                    <span>{new Date(company.createdAt).toLocaleDateString()}</span>
                                                </li>
                                            </ul>

                                            {/* Social Media Links */}
                                            {company.socialMedia && (
                                                <div className="mt-4">
                                                    <h3 className="h6 mb-3">Connect With Us</h3>
                                                    <div className="d-flex gap-2">
                                                        {company.socialMedia.linkedin && (
                                                            <a href={company.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                                                                <i className="bi bi-linkedin"></i>
                                                            </a>
                                                        )}
                                                        {company.socialMedia.twitter && (
                                                            <a href={company.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info btn-sm">
                                                                <i className="bi bi-twitter"></i>
                                                            </a>
                                                        )}
                                                        {company.socialMedia.facebook && (
                                                            <a href={company.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                                                                <i className="bi bi-facebook"></i>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </aside>

                                {/* Main Content Area */}
                                <div className="col-lg-8">
                                    {/* Tab Navigation */}
                                    <div className="card shadow-sm mb-4">
                                        <div className="card-header bg-white">
                                            <ul className="nav nav-tabs card-header-tabs">
                                                <li className="nav-item">
                                                    <button
                                                        className={`btn btn-sm ${activeTab === 'about' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                                                        // className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                                                        onClick={() => setActiveTab('about')}
                                                    >
                                                        About
                                                    </button>
                                                </li>
                                                <li className="nav-item">
                                                    <button
                                                        className={`btn btn-sm ${activeTab === 'locations' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                                                        onClick={() => setActiveTab('locations')}
                                                    >
                                                        Locations
                                                    </button>
                                                </li>
                                                <li className="nav-item">
                                                    <button
                                                        className={`btn btn-sm ${activeTab === 'keyDetails' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                                                        onClick={() => setActiveTab('keyDetails')}
                                                    >
                                                        Key Details
                                                    </button>
                                                </li>
                                                <li className="nav-item">
                                                    <button
                                                        className={`btn btn-sm ${activeTab === 'jobs' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                                                        onClick={() => setActiveTab('jobs')}
                                                    >
                                                        Jobs ({jobs.length})
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Tab Content */}
                                        <div className="card-body">
                                            {/* About Tab */}
                                            {activeTab === 'about' && (
                                                <section>
                                                    <h2 className="h5 mb-3">About {company.fullname}</h2>
                                                    <p className="text-muted">{company.about || 'No description provided.'}</p>

                                                    {company.tagline && (
                                                        <blockquote className="blockquote text-center my-4 py-2 px-3 bg-light rounded">
                                                            <p className="mb-0 fst-italic">"{company.tagline}"</p>
                                                        </blockquote>
                                                    )}

                                                    {company.history?.length > 0 && (
                                                        <div className="mt-4">
                                                            <h3 className="h5 mb-3">Company History</h3>
                                                            <ul className="list-unstyled">
                                                                {company.history.map((item, index) => (
                                                                    <li key={index} className="mb-2">
                                                                        <strong>{item.key}:</strong> {item.value}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </section>
                                            )}

                                            {/* Locations Tab */}
                                            {activeTab === 'locations' && (
                                                <section>
                                                    <h2 className="h5 mb-3">Our Locations</h2>
                                                    {company.locations?.length > 0 ? (
                                                        <div className="row">
                                                            {company.locations.map((location, index) => (
                                                                <div key={index} className="col-md-6 mb-3">
                                                                    <div className="card h-100 border-0 shadow-sm">
                                                                        <div className="card-body">
                                                                            <h3 className="h6 card-title">
                                                                                <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                                                                                {location.city}
                                                                            </h3>
                                                                            <p className="card-text text-muted mb-0">{location.country}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-muted">No location information available.</p>
                                                    )}
                                                </section>
                                            )}

                                            {/* Key Details Tab */}
                                            {activeTab === 'keyDetails' && (
                                                <section>
                                                    <h2 className="h5 mb-3">Key Details</h2>
                                                    {company.keyDetails?.length > 0 ? (
                                                        <div className="row">
                                                            {company.keyDetails.map((detail, index) => (
                                                                <div key={index} className="col-md-6 mb-3">
                                                                    <div className="card h-100 border-0 shadow-sm">
                                                                        <div className="card-body">
                                                                            <h3 className="h6 card-title text-primary">{detail.key}</h3>
                                                                            <p className="card-text">{detail.value}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-muted">No key details available.</p>
                                                    )}

                                                    {company.departments?.length > 0 && (
                                                        <div className="mt-4">
                                                            <h3 className="h5 mb-3">Departments</h3>
                                                            <div className="d-flex flex-wrap gap-2">
                                                                {company.departments.map((dept, index) => (
                                                                    <span key={index} className="badge bg-light text-dark">
                                                                        {dept.key}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </section>
                                            )}

                                            {/* Jobs Tab */}
                                            {activeTab === 'jobs' && (
                                                <section>
                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <h2 className="h5 mb-0">Open Positions at {company.fullname}</h2>
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => handleViewJobs(company?.userId)}
                                                        >
                                                            View All Jobs
                                                        </button>
                                                    </div>

                                                    {jobs.length > 0 ? (
                                                        <div className="list-group list-group-flush">
                                                            {jobs.slice(0, 5).map(job => (
                                                                <div key={job._id} className="list-group-item py-3">
                                                                    <div className="d-flex justify-content-between">
                                                                        <div>
                                                                            <h3 className="h6 mb-1">{job.title}</h3>
                                                                            <div className="d-flex flex-wrap gap-3 text-muted small mb-2">
                                                                                <span>
                                                                                    <i className="bi bi-briefcase me-1"></i>
                                                                                    {job.type}
                                                                                </span>
                                                                                <span>
                                                                                    <i className="bi bi-geo-alt me-1"></i>
                                                                                    {job.location}
                                                                                </span>
                                                                                <span>
                                                                                    <i className="bi bi-cash-stack me-1"></i>
                                                                                    {job.salary}
                                                                                </span>
                                                                            </div>
                                                                            <p className="small text-muted mb-0">{job.description.substring(0, 100)}...</p>
                                                                        </div>
                                                                        <button
                                                                            className="btn btn-sm btn-outline-primary align-self-center"
                                                                            // onClick={() => navigate(`/jobs/${job._id}`)}
                                                                            onClick={() => navigate(`/superadmin/companies-job-details/${job._id}`, { state: { job: job } })}
                                                                        >
                                                                            View Job
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="alert alert-info">
                                                            No current job openings. Check back later!
                                                        </div>
                                                    )}
                                                </section>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    )

};


export default SuperAdminCompaniesProfile;