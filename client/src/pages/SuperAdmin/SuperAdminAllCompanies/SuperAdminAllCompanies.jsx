import React, { useEffect, useState } from 'react';
import { useSuperAdminContext } from '../../../context/superadmin-context';
import formatDateToRelative from '../../../Helper/dateFormatter';

const SuperAdminAllCompanies = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [industryFilter, setIndustryFilter] = useState('');
    const { isLoading, getAllCompaniesWithVerificationStatus, companies, handleCompanyMakeVerified, handleCompanyMakeUnVerified } = useSuperAdminContext()
    const [currentPage, setCurrentPage] = useState(1);
    const companiesPerPage = 10;

    useEffect(() => {
        getAllCompaniesWithVerificationStatus()
    }, [])

    const filteredCompanies = companies.filter(company => {
        const matchesTab =
            activeTab === 'all' ||
            (activeTab === 'verified' && company.isVerified === true) ||
            (activeTab === 'unverified' && company.isVerified === false);

        const matchesSearch =
            company.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.industry.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesIndustry =
            !industryFilter || company.industry === industryFilter;

        return matchesTab && matchesSearch && matchesIndustry;
    });

    const verifiedCount = companies.filter(c => c.isVerified === true).length;
    const unverifiedCount = companies.filter(c => c.isVerified === false).length;

    // Extract unique industries and locations from company and job data
    const industryOptions = [
        ...Array.from(
            new Set(
                companies
                    .map(c => c.industry)
                    .filter(Boolean)
            )
        )
    ];

    const indexOfLastcompanies = currentPage * companiesPerPage;
    const indexOfFirstCompanies = indexOfLastcompanies - companiesPerPage;
    const currentCompaniesList = filteredCompanies?.slice(indexOfFirstCompanies, indexOfLastcompanies);
    const totalPages = Math.ceil(filteredCompanies?.length / companiesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    if (isLoading) {
        return (
            <>
                <div className="container-fluid">
                    <div className="container py-5">
                        <div className="d-flex justify-content-center align-items-center vh-100">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="container-fluid">
            <div className="container">
                <h1 className="mb-4">Company Management</h1>

                {/* Tabs Navigation */}
                <div className="d-flex gap-2">
                    <button
                        className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-secondary'} d-flex align-items-center`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                        <span className="badge bg-secondary ms-2">{companies.length}</span>
                    </button>
                    <button
                        className={`btn btn-sm ${activeTab === 'verified' ? 'btn-success' : 'btn-outline-success'} d-flex align-items-center`}
                        onClick={() => setActiveTab('verified')}
                    >
                        Verified
                        <span className="badge bg-success ms-2">{verifiedCount}</span>
                    </button>
                    <button
                        className={`btn btn-sm ${activeTab === 'unverified' ? 'btn-danger' : 'btn-outline-danger'} d-flex align-items-center`}
                        onClick={() => setActiveTab('unverified')}
                    >
                        Unverified
                        <span className="badge bg-danger ms-2">{unverifiedCount}</span>
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="bg-light p-3 rounded mb-3 mt-3">
                    <div className="row g-3">
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={`Search ${activeTab} companies...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={industryFilter}
                                onChange={(e) => setIndustryFilter(e.target.value)}
                            >
                                <option value="">Filter by industry</option>
                                {industryOptions.map((industry, index) => (
                                    <option key={index} value={industry}>{industry}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Companies Table */}
                <div className="table-responsive">
                    {/* Desktop Table (hidden on mobile) */}
                    <table className="table table-striped table-hover d-none d-md-table">
                        <thead className="table-light">
                            <tr>
                                {activeTab === 'all' && <th>Status</th>}
                                <th>Logo</th>
                                <th>Company Name</th>
                                <th>Industry</th>
                                <th>Location</th>
                                <th>Last Active</th>
                                {activeTab === 'verified' && <th>Action</th>}
                                {activeTab === 'unverified' && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {currentCompaniesList.length > 0 ? (
                                currentCompaniesList.map((company) => (
                                    <tr key={company._id}>
                                        {activeTab === 'all' && (
                                            <td>
                                                <span className={`badge ${company.isVerified ? 'bg-success' : 'bg-danger'}`}>
                                                    {company.isVerified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </td>
                                        )}
                                        <td>
                                            <img
                                                src={company.profilePicture || company.logo}
                                                alt={company.fullname}
                                                className="rounded-circle"
                                                width="40"
                                                height="40"
                                            />
                                        </td>
                                        <td>{company.fullname}</td>
                                        <td>{company.industry}</td>
                                        <td>
                                            {company.locations?.[0]?.city && (
                                                `${company.locations[0].city}, ${company.locations[0].country}`
                                            )}
                                        </td>
                                        <td>{formatDateToRelative(company.lastActive)}</td>
                                        {activeTab === 'verified' && (
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleCompanyMakeUnVerified(company.userId)}
                                                >
                                                    Revoke
                                                </button>
                                            </td>
                                        )}
                                        {activeTab === 'unverified' && (
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={() => handleCompanyMakeVerified(company.userId)}
                                                >
                                                    Verify
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={activeTab === 'all' ? 6 : 5} className="text-center py-4">
                                        No companies found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Mobile Cards (hidden on desktop) */}
                    <div className="d-md-none">
                        {currentCompaniesList.length > 0 ? (
                            currentCompaniesList.map((company) => (
                                <div key={company._id} className="card mb-3">
                                    <div className="card-body">
                                        <div className="d-flex align-items-start mb-2">
                                            <img
                                                src={company.profilePicture || company.logo}
                                                alt={company.fullname}
                                                className="rounded-circle me-3"
                                                width="50"
                                                height="50"
                                            />
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between">
                                                    <h5 className="mb-1">{company.fullname}</h5>
                                                </div>
                                                <p className="mb-1 text-muted">{company.industry}</p>
                                                {company.locations?.[0]?.city && (
                                                    <small className="text-muted">
                                                        <i className="bi bi-geo-alt me-1"></i>
                                                        {`${company.locations[0].city}, ${company.locations[0].country}`}
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="text-muted">
                                                Last active: {formatDateToRelative(company.lastActive)}
                                            </small>
                                            {activeTab === 'all' && (
                                                <span className={`badge ${company.isVerified ? 'bg-success' : 'bg-danger'}`}>
                                                    {company.isVerified ? 'Verified' : 'Unverified'}
                                                </span>
                                            )}
                                            {activeTab === 'verified' && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleCompanyMakeUnVerified(company.userId)}
                                                >
                                                    Revoke
                                                </button>
                                            )}
                                            {activeTab === 'unverified' && (
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={() => handleCompanyMakeVerified(company.userId)}
                                                >
                                                    Verify
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                No companies found matching your criteria
                            </div>
                        )}
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

export default SuperAdminAllCompanies;