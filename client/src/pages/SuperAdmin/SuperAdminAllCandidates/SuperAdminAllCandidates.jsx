import React, { useEffect, useState } from 'react';
import { useSuperAdminContext } from '../../../context/superadmin-context';
import formatDateToRelative from '../../../Helper/dateFormatter';

const SuperAdminAllCandidates = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [positionFilter, setPositionFilter] = useState('');
    const { isLoading, getAllCandidatesWithVerificationStatus, candidates, handleCandidateMakeVerified, handleCandidateMakeUnVerified } = useSuperAdminContext()
    const [currentPage, setCurrentPage] = useState(1);
    const candidatesPerPage = 10;

    useEffect(() => {
        getAllCandidatesWithVerificationStatus()
    }, [])

    // Filter candidates based on active tab, search term, and position filter
    const filteredCandidates = candidates.filter(candidate => {
        const matchesTab =
            activeTab === 'all' ||
            (activeTab === 'verified' && candidate.isVerified === true) ||
            (activeTab === 'unverified' && candidate.isVerified === false);

        const matchesSearch =
            candidate.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.headline.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPosition =
            !positionFilter || candidate.headline === positionFilter;

        return matchesTab && matchesSearch && matchesPosition;
    });

    const verifiedCount = candidates.filter(c => c.isVerified === true).length;
    const unverifiedCount = candidates.filter(c => c.isVerified === false).length;

    // Extract unique industries and locations from company and job data
    const positionOptions = [
        ...Array.from(
            new Set(
                candidates
                    .map(c => c.headline)
                    .filter(Boolean)
            )
        )
    ];

    const indexOfLastcandidates = currentPage * candidatesPerPage;
    const indexOfFirstCandidates = indexOfLastcandidates - candidatesPerPage;
    const currentCandidatesList = filteredCandidates?.slice(indexOfFirstCandidates, indexOfLastcandidates);
    const totalPages = Math.ceil(filteredCandidates?.length / candidatesPerPage);

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
        <>
            <div className="container-fluid">
                <div className="container">
                    <h1 className="mb-4">Candidate Management</h1>

                    {/* Tabs Navigation */}
                    <div className="d-flex gap-2">
                        <button
                            className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-secondary'} d-flex align-items-center`}
                            onClick={() => setActiveTab('all')}
                        >
                            All
                            <span className="badge bg-secondary ms-2">{candidates.length}</span>
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
                                    placeholder={`Search ${activeTab} candidates...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <select
                                    className="form-select"
                                    value={positionFilter}
                                    onChange={(e) => setPositionFilter(e.target.value)}
                                >
                                    <option value="">Filter by position</option>
                                    {positionOptions.map((position, index) => (
                                        <option key={index} value={position}>{position}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Candidates Table */}
                    <div className="table-responsive">
                        {/* Desktop Table (hidden on mobile) */}
                        <table className="table table-striped table-hover d-none d-md-table">
                            <thead className="table-light">
                                <tr>
                                    <th>Image</th>
                                    {activeTab === 'all' && <th>Status</th>}
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Headline</th>
                                    <th>Location</th>
                                    <th>Last Active</th>
                                    {activeTab === 'verified' && <th>Action</th>}
                                    {activeTab === 'unverified' && <th>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {currentCandidatesList.length > 0 ? (
                                    currentCandidatesList.map((candidate) => (
                                        <tr key={candidate._id}>
                                            <td>
                                                <img
                                                    src={candidate.profilePicture}
                                                    alt={candidate.fullname}
                                                    className="rounded-circle"
                                                    width="40"
                                                    height="40"
                                                />
                                            </td>
                                            {activeTab === 'all' && (
                                                <td>
                                                    <span className={`badge ${candidate.isVerified ? 'bg-success' : 'bg-danger'}`}>
                                                        {candidate.isVerified ? 'Verified' : 'Unverified'}
                                                    </span>
                                                </td>
                                            )}
                                            <td>{candidate.fullname}</td>
                                            <td>{candidate.email}</td>
                                            <td>{candidate.headline}</td>
                                            <td>{candidate.location}</td>
                                            <td>{formatDateToRelative(candidate.lastActive)}</td>
                                            {activeTab === 'verified' && (
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleCandidateMakeUnVerified(candidate.userId)}
                                                    >
                                                        Revoke
                                                    </button>
                                                </td>
                                            )}
                                            {activeTab === 'unverified' && (
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() => handleCandidateMakeVerified(candidate.userId)}
                                                    >
                                                        Verify
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={activeTab === 'all' ? 8 : 7} className="text-center py-4">
                                            No candidates found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Mobile Cards (hidden on desktop) */}
                        <div className="d-md-none">
                            {currentCandidatesList.length > 0 ? (
                                currentCandidatesList.map((candidate) => (
                                    <div key={candidate._id} className="card mb-3">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center mb-2">
                                                <img
                                                    src={candidate.profilePicture}
                                                    alt={candidate.fullname}
                                                    className="rounded-circle me-3"
                                                    width="50"
                                                    height="50"
                                                />
                                                <div>
                                                    <h5 className="mb-0">{candidate.fullname}</h5>
                                                    <small className="text-muted">{candidate.headline}</small>
                                                </div>
                                                {activeTab === 'all' && (
                                                    <span className={`badge ms-auto ${candidate.isVerified ? 'bg-success' : 'bg-danger'}`}>
                                                        {candidate.isVerified ? 'Verified' : 'Unverified'}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mb-2">
                                                <small className="text-muted d-block">Email:</small>
                                                <span>{candidate.email}</span>
                                            </div>

                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <small className="text-muted d-block">Last Active:</small>
                                                    <span>{new Date(candidate.lastActive).toLocaleDateString()}</span>
                                                </div>
                                                <div className="align-self-end">
                                                    <button className="btn btn-sm btn-outline-primary">View</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    No candidates found
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
        </>

    );
};

export default SuperAdminAllCandidates;