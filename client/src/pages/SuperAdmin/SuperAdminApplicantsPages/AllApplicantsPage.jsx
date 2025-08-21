import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSuperAdminContext } from '../../../context/superadmin-context';

const AllApplicantsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const applicantListPerPage = 10;

    const { handleApplicants, applicants: { applicant, job } } = useSuperAdminContext()

    useEffect(() => {
        handleApplicants(id)
    }, [])

    const [filters, setFilters] = useState({
        search: '',
        status: 'All',
        job: 'All'
    });

    console.log(applicant);


    const filteredApplicants = applicant.filter(applicant => {
        const { candidateProfile, item } = applicant;

        return (
            (filters.search === '' ||
                candidateProfile.fullname.toLowerCase().includes(filters.search.toLowerCase()) ||
                candidateProfile.email.toLowerCase().includes(filters.search.toLowerCase()))
        );
    });


    const indexOfLastApplicantList = currentPage * applicantListPerPage;
    const indexOfFirstJobList = indexOfLastApplicantList - applicantListPerPage;
    const currentApplicantList = filteredApplicants?.slice(indexOfFirstJobList, indexOfLastApplicantList);
    const totalPages = Math.ceil(filteredApplicants?.length / applicantListPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return (
        <div className="container-fluid">
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">All Applicants</h1>
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-secondary">
                            <i className="bi bi-download me-1"></i> Export
                        </button>
                    </div>
                </div>

                {/* Jobs Details */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row">
                            {/* Job Title & Company */}
                            <div className="col-md-8">
                                <h2 className="h4 fw-bold mb-2">{job.title}</h2>
                                <h3 className="h5 text-muted mb-4">{job.company}</h3>
                            </div>

                            {/* Posted Date */}
                            <div className="col-md-4 text-md-end">
                                <p className="text-muted small mb-1">
                                    Posted: {new Date(job.posted).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                                <p className="text-muted small">
                                    Last Updated: {new Date(job.updatedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Key Details Row */}
                        <div className="row g-3 mb-4">
                            <div className="col-6 col-md-3">
                                <div className="border rounded p-3 h-100">
                                    <h4 className="h6 text-muted mb-2">Location</h4>
                                    <p className="mb-0 fw-medium">
                                        <i className="bi bi-geo-alt text-primary me-2"></i>
                                        {job.location}
                                    </p>
                                </div>
                            </div>

                            <div className="col-6 col-md-3">
                                <div className="border rounded p-3 h-100">
                                    <h4 className="h6 text-muted mb-2">Salary</h4>
                                    <p className="mb-0 fw-medium">
                                        <i className="bi bi-cash-stack text-success me-2"></i>
                                        {job.salary}
                                    </p>
                                </div>
                            </div>

                            <div className="col-6 col-md-3">
                                <div className="border rounded p-3 h-100">
                                    <h4 className="h6 text-muted mb-2">Type</h4>
                                    <p className="mb-0 fw-medium">
                                        <i className="bi bi-briefcase text-info me-2"></i>
                                        {job.type}
                                    </p>
                                </div>
                            </div>

                            <div className="col-6 col-md-3">
                                <div className="border rounded p-3 h-100">
                                    <h4 className="h6 text-muted mb-2">Experience</h4>
                                    <p className="mb-0 fw-medium">
                                        <i className="bi bi-person-badge text-warning me-2"></i>
                                        {job.experience}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status & Applicants */}
                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                            <div>
                                <span className={`badge ${job.status === 'Active' ? 'bg-success' : 'bg-secondary'} me-2`}>
                                    {job.status}
                                </span>
                                <span className="text-muted">
                                    <i className="bi bi-people me-1"></i>
                                    {job.applicants} {job.applicants === 1 ? 'Applicant' : 'Applicants'}
                                </span>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="mb-4">
                            <h4 className="h5 mb-3">Job Description</h4>
                            <p className="text-muted">{job.description}</p>
                        </div>

                        {/* Requirements & Skills */}
                        <div className="row">
                            <div className="col-md-6 mb-3 mb-md-0">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <h4 className="h5 mb-3">Requirements</h4>
                                        <ul className="list-unstyled">
                                            {job?.requirements?.map((req, i) => (
                                                <li key={i} className="mb-2 d-flex">
                                                    <i className="bi bi-check-circle text-primary mt-1 me-2"></i>
                                                    <span>{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <h4 className="h5 mb-3">Skills</h4>
                                        <div className="d-flex flex-wrap gap-2">
                                            {job?.skills?.map((skill, i) => (
                                                <span key={i} className="badge bg-light text-dark">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Filters */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12">
                                <div className="input-group">
                                    <span className="input-group-text bg-white">
                                        <i className="bi bi-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search applicants..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applicants Table */}
                <div className="card shadow-sm border-0">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '30%' }}>Candidate</th>
                                        <th>Status</th>
                                        <th>Applied Date</th>
                                        <th>Experience</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentApplicantList?.map(({ candidateProfile, item }) => (
                                        <tr key={candidateProfile?._id}>
                                            {/* Candidate Column */}
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="me-3">
                                                        <img
                                                            src={candidateProfile?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateProfile?.fullname)}&background=random`}
                                                            alt={candidateProfile?.fullname}
                                                            className="rounded-circle object-fit-cover"
                                                            style={{ width: "40px", height: "40px" }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-0 fw-semibold">{candidateProfile?.fullname}</h6>
                                                        <small className="text-muted d-block">{candidateProfile?.headline}</small>
                                                        <small className="text-muted">{candidateProfile?.email}</small>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status Column */}
                                            <td>
                                                <span className={`badge rounded-pill ${item?.status === 'Applied' ? 'bg-primary bg-opacity-10 text-primary' :
                                                    item?.status === 'Interview' ? 'bg-warning bg-opacity-10 text-warning' :
                                                        item?.status === 'Rejected' ? 'bg-danger bg-opacity-10 text-danger' :
                                                            'bg-success bg-opacity-10 text-success'}`}>
                                                    {item?.status}
                                                </span>
                                            </td>

                                            {/* Applied Date Column */}
                                            <td>
                                                {new Date(item?.createdAt)?.toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </td>

                                            {/* Experience Column */}
                                            <td>
                                                {candidateProfile?.experience?.length > 0 ? (
                                                    <div>
                                                        <div className="fw-semibold">{candidateProfile?.experience[0]?.title}</div>
                                                        <small className="text-muted">{candidateProfile?.experience[0]?.company}</small>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">No experience</span>
                                                )}
                                            </td>

                                            {/* Actions Column */}
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                                        onClick={() => navigate(`/superadmin/jobs/${candidateProfile?.userId}/applicants`)}
                                                    >
                                                        <i className="bi bi-eye me-1"></i> View
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-success d-flex align-items-center"
                                                        onClick={() => handleMessage(candidateProfile?.userId)}
                                                    >
                                                        <i className="bi bi-envelope me-1"></i> Message
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
                <nav aria-label="Page navigation" className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link btn "
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

export default AllApplicantsPage;