import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useTemporaryLoading from '../../../hooks/useTemporaryLoading';
import { useSuperAdminContext } from '../../../context/superadmin-context';

const SuperAdminCompaniesJobs = () => {
    const { companyId } = useParams()
    const { getAllJobOfSingleCompany, companyJobs: jobs } = useSuperAdminContext()
    const [currentPage, setCurrentPage] = useState(1);
    const jobListPerPage = 10;

    useEffect(() => {
        getAllJobOfSingleCompany(companyId)
    }, [companyId])

    const navigate = useNavigate();
    const { loading, triggerLoading } = useTemporaryLoading();
    const [filters, setFilters] = useState({
        search: '',
        type: 'All',
        location: 'All'
    });

    useEffect(() => {
        triggerLoading();
    }, []);

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            job.description.toLowerCase().includes(filters.search.toLowerCase());
        const matchesType = filters.type === 'All' || job.type === filters.type;
        const matchesLocation = filters.location === 'All' || job.location === filters.location;
        return matchesSearch && matchesType && matchesLocation;
    });

    const indexOfLastJobList = currentPage * jobListPerPage;
    const indexOfFirstJobList = indexOfLastJobList - jobListPerPage;
    const currentJobList = filteredJobs?.slice(indexOfFirstJobList, indexOfLastJobList);
    const totalPages = Math.ceil(filteredJobs?.length / jobListPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                                <p className="mt-3 text-muted">Loading jobs...</p>
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
                        {/* Header */}
                        <header className="w-100 bg-dark py-4">
                            <div className="container">
                                <div className="d-flex align-items-center justify-content-between">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => navigate(-1)}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>Back To Companies
                                    </button>
                                    <h1 className="h4 mb-0 text-center text-white flex-grow-1">Job Openings</h1>
                                    <div style={{ width: '100px' }}></div> {/* Spacer for balance */}
                                </div>
                            </div>
                        </header>

                        {/* Main Content */}
                        <main className="container py-4">
                            <div className="row">
                                {/* Filters Sidebar */}
                                <aside className="col-lg-4 mb-4 mb-lg-0">
                                    <div className="card shadow-sm sticky-top" style={{ top: '100px', zIndex: "2" }}>
                                        <div className="card-body">
                                            <h2 className="h5 mb-4">Filter Jobs</h2>

                                            {/* Search Filter */}
                                            <div className="mb-4">
                                                <label htmlFor="search" className="form-label small text-muted">Search</label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-white">
                                                        <i className="bi bi-search text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        id="search"
                                                        className="form-control"
                                                        placeholder="Job title, keywords..."
                                                        value={filters.search}
                                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            {/* Job Type Filter */}
                                            <div className="mb-4">
                                                <label htmlFor="jobType" className="form-label small text-muted">Job Type</label>
                                                <select
                                                    id="jobType"
                                                    className="form-select"
                                                    value={filters.type}
                                                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                                >
                                                    <option value="All">All Types</option>
                                                    <option value="Full-time">Full-time</option>
                                                    <option value="Part-time">Part-time</option>
                                                    <option value="Contract">Contract</option>
                                                    <option value="Internship">Internship</option>
                                                </select>
                                            </div>

                                            {/* Location Filter */}
                                            <div className="mb-4">
                                                <label htmlFor="location" className="form-label small text-muted">Location</label>
                                                <select
                                                    id="location"
                                                    className="form-select"
                                                    value={filters.location}
                                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                                >
                                                    <option value="All">All Locations</option>
                                                    <option value="Remote">Remote</option>
                                                    {[...new Set(jobs.map(job => job.location))].map((loc, i) => (
                                                        <option key={i} value={loc}>{loc}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Status Filter */}
                                            <div className="mb-4">
                                                <label htmlFor="status" className="form-label small text-muted">Job Status</label>
                                                <select
                                                    id="status"
                                                    className="form-select"
                                                    value={filters.status}
                                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                                >
                                                    <option value="All">All Statuses</option>
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                    <option value="Draft">Draft</option>
                                                </select>
                                            </div>

                                            {/* Reset Filters */}
                                            <button
                                                className="btn btn-outline-secondary w-100"
                                                onClick={() => setFilters({
                                                    search: '',
                                                    type: 'All',
                                                    location: 'All',
                                                    status: 'All'
                                                })}
                                            >
                                                Reset Filters
                                            </button>

                                            {/* Job Count */}
                                            <div className="mt-4 pt-3 border-top text-center">
                                                <p className="mb-1 small text-muted">Showing {filteredJobs.length} of {jobs.length} jobs</p>
                                                <h3 className="h4 mb-0">{filteredJobs.length} Positions Available</h3>
                                            </div>
                                        </div>
                                    </div>
                                </aside>

                                {/* Jobs List */}
                                <div className="col-lg-8">
                                    {currentJobList.length > 0 ? (
                                        currentJobList.map(job => (
                                            <article key={job._id} className="card shadow-sm mb-4 hover-shadow transition-all">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div className="flex-grow-1">
                                                            <h2 className="h5 mb-1">{job.title}</h2>
                                                            <p className="text-muted small mb-2">{job.company}</p>

                                                            <div className="d-flex flex-wrap gap-2 mb-3">
                                                                <span className="badge bg-primary bg-opacity-10 text-primary">
                                                                    <i className="bi bi-briefcase me-1"></i>
                                                                    {job.type}
                                                                </span>
                                                                <span className="badge bg-secondary bg-opacity-10 text-secondary">
                                                                    <i className="bi bi-geo-alt me-1"></i>
                                                                    {job.location}
                                                                </span>
                                                                <span className="badge bg-success bg-opacity-10 text-success">
                                                                    <i className="bi bi-cash-stack me-1"></i>
                                                                    {job.salary}
                                                                </span>
                                                                {job.status === 'Active' && (
                                                                    <span className="badge bg-success bg-opacity-10 text-success">
                                                                        <i className="bi bi-check-circle me-1"></i>
                                                                        Active
                                                                    </span>
                                                                )}
                                                                {job.status === 'Inactive' && (
                                                                    <span className="badge bg-warning bg-opacity-10 text-warning">
                                                                        <i className="bi bi-pause-circle me-1"></i>
                                                                        Inactive
                                                                    </span>
                                                                )}
                                                                {job.status === 'Draft' && (
                                                                    <span className="badge bg-info bg-opacity-10 text-info">
                                                                        <i className="bi bi-pencil me-1"></i>
                                                                        Draft
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="text-muted mb-3">{job.description.substring(0, 150)}...</p>

                                                            {job.skills?.length > 0 && (
                                                                <div className="mb-3">
                                                                    <h6 className="small fw-bold mb-2">Key Skills:</h6>
                                                                    <div className="d-flex flex-wrap gap-2">
                                                                        {job.skills.slice(0, 5).map((skill, i) => (
                                                                            <span key={i} className="badge bg-light text-dark small">
                                                                                {skill}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="d-flex flex-column align-items-end">
                                                            <span className="text-muted small mb-2">
                                                                <i className="bi bi-clock me-1"></i>
                                                                {new Date(job.posted).toLocaleDateString()}
                                                            </span>
                                                            <button
                                                                className="btn btn-primary btn-sm mt-2"
                                                                onClick={() => navigate(`/superadmin/companies-job-details/${job._id}`)}
                                                            >
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        ))
                                    ) : (
                                        <div className="card shadow-sm">
                                            <div className="card-body text-center py-5">
                                                <i className="bi bi-search display-4 text-muted mb-3"></i>
                                                <h3 className="h4 mb-3">No jobs match your filters</h3>
                                                <p className="text-muted mb-4">Try adjusting your search criteria</p>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => setFilters({
                                                        search: '',
                                                        type: 'All',
                                                        location: 'All',
                                                        status: 'All'
                                                    })}
                                                >
                                                    Reset Filters
                                                </button>
                                            </div>
                                        </div>
                                    )}

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
                        </main>
                    </div>

                </div>
            </div>
        </>
    )

};

export default SuperAdminCompaniesJobs;