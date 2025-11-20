import { useEffect, useState } from 'react';
import axios from 'axios';
import SuperAdminInterviewerModal from './SuperAdminInterviewerModal';
import { useAuthContext } from '../../../context/auth-context';
import { useSuperAdminContext } from '../../../context/superadmin-context';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SuperAdminInterviewer = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('All'); // Renamed from positionFilter to be more accurate
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const interviewersPerPage = 10;
    const navigate = useNavigate();

    const { getAllInterviewers, interviewers } = useSuperAdminContext();
    const { server } = useAuthContext();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchInterviewers = async () => {
            try {
                setDataLoading(true);
                await getAllInterviewers();
            } catch (error) {
                toast.error("Failed to fetch interviewers");
                console.error("Error fetching interviewers:", error);
            } finally {
                setDataLoading(false);
            }
        };

        fetchInterviewers();
    }, []);

    // Reset to page 1 when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, locationFilter]);

    const handleSave = async (data) => {
        setLoading(true);
        try {
            const res = await axios.post(`${server}/api/v1/superadmin/createInterviewer`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const { message } = res.data;
            toast.success(message);
            await getAllInterviewers();
            setModalVisible(false); // Close modal after successful save
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong while saving interviewer");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!confirmDeleteId) return;

        setDeleteLoading(true);
        try {
            const res = await axios.delete(`${server}/api/v1/superadmin/deleteInterviewer/${confirmDeleteId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(res.data.message || 'Interviewer deleted successfully');
            setConfirmDeleteId(null);
            await getAllInterviewers();

            // If current page becomes empty after deletion and it's not the first page, go to previous page
            if (currentInterviewersList.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to delete interviewer'
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const filteredInterviewers = interviewers.filter(intv => {
        const { data } = intv;

        // Check for fullname and email match
        const matchesSearch =
            (data.fullname && data.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (data.email && data.email.toLowerCase().includes(searchTerm.toLowerCase()));

        // Check for location match
        const matchesLocation =
            locationFilter === 'All' ||
            (data.location && data.location.toLowerCase() === locationFilter.toLowerCase());

        return matchesSearch && matchesLocation;
    });

    const uniqueLocations = ['All', ...new Set(interviewers.map(i => i.data.location).filter(Boolean))];

    const indexOfLastInterviewers = currentPage * interviewersPerPage;
    const indexOfFirstInterviewers = indexOfLastInterviewers - interviewersPerPage;
    const currentInterviewersList = filteredInterviewers?.slice(indexOfFirstInterviewers, indexOfLastInterviewers);
    const totalPages = Math.ceil(filteredInterviewers?.length / interviewersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleViewInterviewer = (id) => {
        navigate(`/superadmin/interviewerProfile/${id}`);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setLocationFilter("All");
    };

    if (dataLoading || loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading Please Wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid interviewers-page">
            <div className="container mt-4">
                {/* Header Section */}
                <div className="page-header">
                    <div className="header-content">
                        <h2 className="page-title">Interviewers</h2>
                        <p className="page-subtitle">Manage your interview team and their profiles</p>
                    </div>
                    <button className="btn-add-interviewer" onClick={() => setModalVisible(true)}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Interviewer
                    </button>
                </div>

                {/* Search and Filter Section */}
                <div className="search-filter-section">
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <i className="bi bi-search search-icon"></i>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button className="clear-search" onClick={() => setSearchTerm('')}>
                                    <i className="bi bi-x-circle-fill"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="filter-container">
                        <select
                            className="filter-select"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        >
                            {uniqueLocations.map((loc, i) => (
                                <option key={i} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Counter */}
                <div className="results-counter">
                    <span>Showing {currentInterviewersList.length} of {filteredInterviewers.length} interviewers</span>
                </div>

                {/* Interviewers List */}
                <div className="interviewers-container">
                    {currentInterviewersList.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="desktop-view d-none d-md-block">
                                <div className="table-wrapper">
                                    <table className="interviewers-table">
                                        <thead>
                                            <tr>
                                                <th>Interviewer</th>
                                                <th>Email</th>
                                                <th>Headline</th>
                                                <th>Location</th>
                                                <th className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentInterviewersList.map((intv) => (
                                                <tr key={intv.data._id}>
                                                    <td>
                                                        <div className="interviewer-info">
                                                            <div className="interviewer-avatar">
                                                                {intv.data.profilePicture ? (
                                                                    <img
                                                                        src={intv.data.profilePicture}
                                                                        alt={intv.data.fullname}
                                                                        className="rounded-circle"
                                                                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                                                    />
                                                                ) : intv.data.fullname ? (
                                                                    <span className="avatar-placeholder">
                                                                        {intv.data.fullname.substring(0, 2).toUpperCase()}
                                                                    </span>
                                                                ) : (
                                                                    <span className="avatar-placeholder">
                                                                        <i className="bi bi-person-fill"></i>
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="interviewer-name">
                                                                {intv.data.fullname || "Profile Not Completed"}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{intv.data.email}</td>
                                                    <td>{intv.data.headline || "—"}</td>
                                                    <td>{intv.data.location || "—"}</td>
                                                    <td className="text-center">
                                                        <div className="action-buttons">
                                                            {intv.data.userId ? (
                                                                <button
                                                                    className="btn-view"
                                                                    onClick={() => handleViewInterviewer(intv.data._id)}
                                                                >
                                                                    <i className="bi bi-eye"></i>
                                                                    View
                                                                </button>
                                                            ) : (
                                                                <span className="action-placeholder"></span>
                                                            )}
                                                            <button
                                                                className="btn-delete"
                                                                onClick={() => setConfirmDeleteId(intv?.data?.userId || intv?.data?._id)}
                                                                disabled={deleteLoading}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="mobile-view d-md-none">
                                {currentInterviewersList.map((intv) => (
                                    <div key={intv.data._id} className="interviewer-card">
                                        <div className="card-header">
                                            <div className="interviewer-info">
                                                <div className="interviewer-avatar">
                                                    {intv.data.profilePicture ? (
                                                        <img
                                                            src={intv.data.profilePicture}
                                                            alt={intv.data.fullname}
                                                            className="rounded-circle"
                                                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                                        />
                                                    ) : intv.data.fullname ? (
                                                        <span className="avatar-placeholder">
                                                            {intv.data.fullname.substring(0, 2).toUpperCase()}
                                                        </span>
                                                    ) : (
                                                        <span className="avatar-placeholder">
                                                            <i className="bi bi-person-fill"></i>
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="interviewer-details">
                                                    <h5 className="interviewer-name">
                                                        {intv.data.fullname || 'Profile Not Completed'}
                                                    </h5>
                                                    <p className="interviewer-headline">
                                                        {intv.data.headline || 'No headline available'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="info-item">
                                                <i className="bi bi-envelope info-icon"></i>
                                                <span className="info-text">{intv.data.email}</span>
                                            </div>
                                            <div className="info-item">
                                                <i className="bi bi-geo-alt info-icon"></i>
                                                <span className="info-text">{intv.data.location || 'No location'}</span>
                                            </div>
                                            <div className="card-actions">
                                                {intv?.data?.userId ? (
                                                    <button
                                                        className="btn-view-mobile"
                                                        onClick={() => handleViewInterviewer(intv.data._id)}
                                                    >
                                                        <i className="bi bi-eye me-1"></i>
                                                        View Profile
                                                    </button>
                                                ) : (
                                                    <div className="action-placeholder-mobile"></div>
                                                )}
                                                <button
                                                    className="btn-delete-mobile"
                                                    onClick={() => setConfirmDeleteId(intv?.data?.userId || intv?.data?._id)}
                                                    disabled={deleteLoading}
                                                >
                                                    <i className="bi bi-trash me-1"></i>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="empty-state-container">
                            <div className="empty-state-card">
                                <div className="empty-state-icon">
                                    <i className="bi bi-briefcase"></i>
                                </div>
                                <h4 className="empty-state-title">
                                    {searchTerm || locationFilter !== "All" ? "No interviewers found" : "No interviewers available"}
                                </h4>
                                <p className="empty-state-description">
                                    {searchTerm || locationFilter !== "All" ?
                                        "Try adjusting your search or filters to browse interviewers" :
                                        "Check back later for new interviewers or add one using the button above"}
                                </p>
                                {(searchTerm || locationFilter !== "All") && (
                                    <button
                                        className="btn-clear-filters"
                                        onClick={handleClearFilters}
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Interviewer Modal */}
                <SuperAdminInterviewerModal
                    show={modalVisible}
                    onHide={() => setModalVisible(false)}
                    onSave={handleSave}
                />

                {/* Delete Confirmation Modal */}
                {confirmDeleteId && (
                    <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
                        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                            <div className="delete-modal">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Delete</h5>
                                    <button type="button" className="btn-close" onClick={() => setConfirmDeleteId(null)}>
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="delete-icon">
                                        <i className="bi bi-exclamation-triangle"></i>
                                    </div>
                                    <p className="delete-message">Are you sure you want to delete this interviewer?</p>
                                    <p className="delete-warning">This action cannot be undone.</p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn-cancel" onClick={() => setConfirmDeleteId(null)}>
                                        Cancel
                                    </button>
                                    <button
                                        className="btn-confirm-delete"
                                        onClick={handleConfirmDelete}
                                        disabled={deleteLoading}
                                    >
                                        {deleteLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination - Only show when there are results */}
                {currentInterviewersList.length > 0 && (
                    <nav aria-label="Page navigation" className="pagination-container">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link prev-btn"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <i className="bi bi-chevron-left"></i>
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
                                    className="page-link next-btn"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>

            <style>{`
                :root {
                    --primary-color: #4361ee;
                    --primary-dark: #3a0ca3;
                    --secondary-color: #f8f9fa;
                    --danger-color: #f72585;
                    --danger-dark: #b5179e;
                    --text-color: #212529;
                    --text-muted: #6c757d;
                    --border-color: #e9ecef;
                    --shadow-sm: 0 2px 4px rgba(0,0,0,0.05);
                    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
                    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
                    --transition: all 0.3s ease;
                }

                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    color: var(--text-color);
                }

                .interviewers-page {
                    padding-bottom: 2rem;
                }

                /* Header Section */
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid var(--border-color);
                }

                .header-content {
                    flex: 1;
                }

                .page-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-color);
                    margin-bottom: 0.5rem;
                }

                .page-subtitle {
                    font-size: 1rem;
                    color: var(--text-muted);
                    margin: 0;
                }

                .btn-add-interviewer {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1.5rem;
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 500;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: var(--transition);
                    box-shadow: var(--shadow-sm);
                }

                .btn-add-interviewer:hover {
                    background-color: var(--primary-dark);
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                /* Search and Filter Section */
                .search-filter-section {
                    display: flex;
                    flex-direction: row;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .search-container {
                    flex: 3;
                }

                .filter-container {
                    flex: 1;
                }

                .search-input-wrapper {
                    position: relative;
                }

                .search-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }

                .search-input {
                    width: 100%;
                    padding: 0.75rem 1rem 0.75rem 2.5rem;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    font-size: 0.95rem;
                    transition: var(--transition);
                }

                .search-input:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
                }

                .clear-search {
                    position: absolute;
                    right: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: var(--transition);
                    font-size: 1.1rem;
                }

                .clear-search:hover {
                    color: var(--danger-color);
                }

                .filter-select {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    font-size: 0.95rem;
                    background-color: white;
                    transition: var(--transition);
                }

                .filter-select:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
                }

                /* Results Counter */
                .results-counter {
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }

                /* Interviewers Container */
                .interviewers-container {
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                    overflow: hidden;
                    min-height: 300px;
                }

                /* Desktop Table View */
                .table-wrapper {
                    overflow-x: auto;
                }

                .interviewers-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .interviewers-table th {
                    background-color: var(--secondary-color);
                    padding: 1rem;
                    text-align: left;
                    font-weight: 600;
                    color: var(--text-color);
                    border-bottom: 1px solid var(--border-color);
                }

                .interviewers-table td {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border-color);
                    vertical-align: middle;
                }

                .interviewers-table tr:hover {
                    background-color: rgba(67, 97, 238, 0.05);
                }

                .interviewer-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .interviewer-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: var(--primary-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 0.9rem;
                    overflow: hidden;
                }

                .interviewer-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .avatar-placeholder {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                }

                .interviewer-name {
                    font-weight: 500;
                    color: var(--text-color);
                }

                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                    justify-content: center;
                }

                .btn-view {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.5rem 0.75rem;
                    background-color: rgba(67, 97, 238, 0.1);
                    color: var(--primary-color);
                    border: 1px solid rgba(67, 97, 238, 0.2);
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .btn-view:hover {
                    background-color: var(--primary-color);
                    color: white;
                }

                .btn-delete {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.5rem 0.75rem;
                    background-color: rgba(247, 37, 133, 0.1);
                    color: var(--danger-color);
                    border: 1px solid rgba(247, 37, 133, 0.2);
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .btn-delete:hover {
                    background-color: var(--danger-color);
                    color: white;
                }

                .action-placeholder {
                    width: 75px;
                }

                /* Mobile Card View */
                .interviewer-card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: var(--shadow-sm);
                    margin-bottom: 1rem;
                    overflow: hidden;
                    transition: var(--transition);
                }

                .interviewer-card:hover {
                    box-shadow: var(--shadow-md);
                    transform: translateY(-2px);
                }

                .card-header {
                    padding: 1rem;
                    background-color: var(--secondary-color);
                    border-bottom: 1px solid var(--border-color);
                }

                .card-body {
                    padding: 1rem;
                }

                .interviewer-details {
                    flex: 1;
                }

                .interviewer-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-color);
                    margin-bottom: 0.25rem;
                }

                .interviewer-headline {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    margin: 0;
                }

                .info-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }

                .info-icon {
                    margin-right: 0.75rem;
                    color: var(--primary-color);
                    width: 16px;
                }

                .info-text {
                    font-size: 0.9rem;
                    color: var(--text-color);
                    word-break: break-all;
                }

                .card-actions {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }

                .btn-view-mobile {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.5rem;
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .btn-view-mobile:hover {
                    background-color: var(--primary-dark);
                }

                .btn-delete-mobile {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.5rem;
                    background-color: white;
                    color: var(--danger-color);
                    border: 1px solid var(--danger-color);
                    border-radius: 6px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .btn-delete-mobile:hover {
                    background-color: var(--danger-color);
                    color: white;
                }

                .action-placeholder-mobile {
                    width: 75px;
                }

                /* Delete Modal */
                .modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1050;
                }

                .modal-dialog {
                    max-width: 500px;
                    width: 90%;
                }

                .delete-modal {
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: var(--shadow-lg);
                    overflow: hidden;
                    animation: modalSlideIn 0.3s ease;
                }

                @keyframes modalSlideIn {
                    from {
                        transform: translateY(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0;
                }

                .btn-close {
                    background: none;
                    border: none;
                    font-size: 1.25rem;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: var(--transition);
                }

                .btn-close:hover {
                    color: var(--text-color);
                }

                .modal-body {
                    padding: 2rem 1.5rem;
                    text-align: center;
                }

                .delete-icon {
                    width: 60px;
                    height: 60px;
                    margin: 0 auto 1.5rem;
                    background-color: rgba(247, 37, 133, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--danger-color);
                    font-size: 1.5rem;
                }

                .delete-message {
                    font-size: 1.1rem;
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                }

                .delete-warning {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    margin: 0;
                }

                .modal-footer {
                    padding: 1.5rem;
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                }

                .btn-cancel {
                    padding: 0.5rem 1rem;
                    background-color: white;
                    color: var(--text-color);
                    border: 1px solid var(--border-color);
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .btn-cancel:hover {
                    background-color: var(--secondary-color);
                }

                .btn-confirm-delete {
                    padding: 0.5rem 1rem;
                    background-color: var(--danger-color);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                    display: flex;
                    align-items: center;
                }

                .btn-confirm-delete:hover {
                    background-color: var(--danger-dark);
                }

                /* Pagination */
                .pagination-container {
                    margin-top: 2rem;
                    display: flex;
                    justify-content: center;
                }

                .pagination {
                    display: flex;
                    gap: 0.25rem;
                }

                .page-item {
                    margin: 0;
                }

                .page-link {
                    display: flex;
                    align-items: center;
                    padding: 0.5rem 0.75rem;
                    background-color: white;
                    color: var(--text-color);
                    border: 1px solid var(--border-color);
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .page-link:hover {
                    background-color: var(--secondary-color);
                    border-color: var(--primary-color);
                    color: var(--primary-color);
                }

                .page-item.active .page-link {
                    background-color: var(--primary-color);
                    border-color: var(--primary-color);
                    color: white;
                }

                .page-item.disabled .page-link {
                    color: var(--text-muted);
                    pointer-events: none;
                }

                .prev-btn, .next-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .empty-state-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 400px;
                    padding: 2rem;
                }

                .empty-state-card {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    padding: 3rem;
                    text-align: center;
                    max-width: 500px;
                    border: 1px solid #f0f0f0;
                }

                .empty-state-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 1.5rem;
                    background-color: #f8f9fa;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6c757d;
                    font-size: 2rem;
                }

                .empty-state-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    color: #212529;
                }

                .empty-state-description {
                    font-size: 1rem;
                    color: #6c757d;
                    margin-bottom: 1.5rem;
                    line-height: 1.5;
                }

                .btn-clear-filters {
                    padding: 0.5rem 1.5rem;
                    background-color: #0d6efd;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-clear-filters:hover {
                    background-color: #0b5ed7;
                    transform: translateY(-2px);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: stretch;
                    }

                    .btn-add-interviewer {
                        width: 100%;
                        justify-content: center;
                    }

                    .search-filter-section {
                        flex-direction: column;
                    }

                    .empty-state-container {
                        min-height: 300px;
                        padding: 1rem;
                    }

                    .empty-state-card {
                        padding: 2rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default SuperAdminInterviewer;

