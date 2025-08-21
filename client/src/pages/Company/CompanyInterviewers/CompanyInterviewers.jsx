import React, { useState } from 'react';

const interviewerList = [
    {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        phone: '+1 555-123-7890',
        designation: 'Senior Technical Architect',
        department: 'Engineering',
        experience: '12 years',
        skills: ['System Design', 'Cloud Architecture', 'Microservices', 'AWS', 'Kubernetes'],
        interviewsConducted: 145,
        rating: 4.8,
        availability: 'Mon-Wed, Fri',
        education: ['MS in Computer Science - Stanford University', 'MS in Computer Science - Stanford University'],
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        phone: '+1 555-456-1234',
        designation: 'Principal UX Designer',
        department: 'Product Design',
        experience: '8 years',
        skills: ['User Research', 'Figma', 'Prototyping', 'Design Systems', 'Accessibility'],
        interviewsConducted: 92,
        rating: 4.6,
        availability: 'Tue-Thu',
        education: ['BFA in Interaction Design - RISD'],
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    {
        id: 3,
        name: 'David Rodriguez',
        email: 'david.rodriguez@company.com',
        phone: '+1 555-789-4567',
        designation: 'Engineering Manager',
        department: 'Platform Engineering',
        experience: '15 years',
        skills: ['Team Leadership', 'Agile Methodologies', 'Performance Management', 'Technical Roadmapping'],
        interviewsConducted: 210,
        rating: 4.9,
        availability: 'Flexible',
        education: ['MBA - Harvard Business School'],
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
    }
];

const InterviewerCard = ({ interviewer }) => {
    const {
        name,
        email,
        phone,
        designation,
        department,
        experience,
        skills,
        interviewsConducted,
        rating,
        availability,
        education,
        avatar
    } = interviewer;

    // Render star ratings
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<i className="ti ti-star me-2 text-warning" key={i}></i>);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<i className="ti ti-star me-2 text-warning" style={{ opacity: 0.6 }} key={i}></i>);
            } else {
                stars.push(<i className="ti ti-star me-2 text-secondary" style={{ opacity: 0.3 }} key={i}></i>);
            }
        }
        return stars;
    };

    return (
        <div className="card mb-4 border-0 shadow-sm hover-shadow transition-all">
            <div className="card-body p-3 p-md-4">
                <div className="d-flex flex-column flex-md-row align-items-start">
                    {/* Avatar */}
                    <div className="mb-3 mb-md-0 me-md-4 text-center text-md-start">
                        <img
                            src={avatar}
                            alt={name}
                            className="rounded-circle border"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-grow-1 w-100">
                        {/* Header with name and actions */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
                            <div className="mb-2 mb-md-0">
                                <h4 className="card-title mb-1 fw-bold">{name}</h4>
                                <div className="d-flex flex-wrap gap-2">
                                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                                        {designation}
                                    </span>
                                    <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill">
                                        {department}
                                    </span>
                                </div>
                            </div>
                            <div className="dropdown">
                                <button
                                    className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Actions
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><button className="dropdown-item">View Full Profile</button></li>
                                    <li><button className="dropdown-item">Schedule Interview</button></li>
                                    <li><button className="dropdown-item">View Calendar</button></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item">Edit Profile</button></li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact and Experience Info */}
                        <div className="row mb-3">
                            <div className="col-12 col-md-6 mb-2 mb-md-0">
                                <div className="d-flex align-items-center text-muted mb-2">
                                    <i className="ti ti-mail me-2 flex-shrink-0"></i>
                                    <small className="text-truncate">{email}</small>
                                </div>
                                <div className="d-flex align-items-center text-muted">
                                    <i className="ti ti-phone me-2 flex-shrink-0"></i>
                                    <small>{phone}</small>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="d-flex align-items-center text-muted mb-2">
                                    <i className="ti ti-user me-2 flex-shrink-0"></i>
                                    <small>{experience} experience</small>
                                </div>
                                <div className="d-flex align-items-center text-muted">
                                    <i className="ti ti-calendar-event me-2 flex-shrink-0"></i>
                                    <small>Available: {availability}</small>
                                </div>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="mb-3">
                            <h6 className="d-flex align-items-center mb-2">
                                <i className="ti ti-star me-2 text-warning"></i>
                                <span className="fw-bold">Interviewer Rating</span>
                            </h6>
                            <div className="d-flex flex-wrap align-items-center">
                                <div className="me-2 d-flex align-items-center">
                                    <span className="fw-bold me-1">{rating}</span>/5.0
                                </div>
                                <div className="me-2 d-flex">
                                    {renderStars()}
                                </div>
                                <small className="text-muted">({interviewsConducted} interviews conducted)</small>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-3 mb-md-4">
                            <h6 className="d-flex align-items-center mb-2">
                                <i className="ti ti-briefcase me-2 text-primary"></i>
                                <span className="fw-bold">Expertise Areas</span>
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                                {skills?.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="badge bg-primary bg-opacity-10 text-primary fw-normal py-2 px-3"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Education */}
                        <div>
                            <h6 className="d-flex align-items-center mb-2">
                                <i className="ti ti-school me-2 text-primary"></i>
                                <span className="fw-bold">Education</span>
                            </h6>
                            {
                                education?.map((edu, index) => (
                                    <p key={index} className="text-muted mb-0">{edu}</p>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="card-footer bg-transparent border-top-0 d-flex flex-column flex-md-row justify-content-between align-items-center p-3">
                <button className="btn btn-sm btn-outline-primary mb-2 mb-md-0 w-100 w-md-auto">
                    View Full Profile
                </button>
                <div className="d-flex gap-2 w-100 w-md-auto">
                    <button className="btn btn-sm btn-success flex-grow-1 flex-md-grow-0">
                        <i className="ti ti-calendar-event me-1"></i>
                        Schedule
                    </button>
                    <button className="btn btn-sm btn-secondary flex-grow-1 flex-md-grow-0">
                        View Calendar
                    </button>
                </div>
            </div>
        </div>
    );
};

const CompanyInterviewers = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const interviewerListPerPage = 10;


    // Pagination logic
    const indexOfLastInterviewerList = currentPage * interviewerListPerPage;
    const indexOfFirstInterviewerList = indexOfLastInterviewerList - interviewerListPerPage;
    const currentInterviewerList = interviewerList.slice(indexOfFirstInterviewerList, indexOfLastInterviewerList);
    const totalPages = Math.ceil(interviewerList.length / interviewerListPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container-fluid">
            <div className="container py-4">
                {/* Header with search and filter */}
                <div className="d-flex flex-column justify-content-between align-items-stretch mb-4 gap-3">
                    <div className="mb-3 mb-lg-0">
                        <h2 className="fw-bold mb-1">Interviewer Team</h2>
                        <p className="text-muted mb-0">Our experienced interview panel</p>
                    </div>
                    <div className="d-flex flex-column flex-md-row gap-3 w-100 w-lg-auto">
                        <div className="position-relative flex-grow-1">
                            <input
                                type="text"
                                className="form-control form-control-sm ps-5"
                                placeholder="Search interviewers..."
                            />
                            <i className="ti ti-search position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
                        </div>
                        <select className="form-select form-select-sm w-auto">
                            <option>All Departments</option>
                            <option>Engineering</option>
                            <option>Product Design</option>
                            <option>Data Science</option>
                            <option>Product Management</option>
                        </select>
                        <button className="btn btn-sm btn-primary">
                            Add Interviewer
                        </button>
                    </div>
                </div>

                {/* Interviewer Cards */}
                <div className="row">
                    <div className="col-12 col-lg-10 mx-auto">
                        {currentInterviewerList.map((interviewer) => (
                            <InterviewerCard key={interviewer.id} interviewer={interviewer} />
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                <nav aria-label="Page navigation" className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </li>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(pageNum)}>
                                        {pageNum}
                                    </button>
                                </li>
                            );
                        })}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default CompanyInterviewers;