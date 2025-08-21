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
    const [positionFilter, setPositionFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false)
    const interviewersPerPage = 10;
    const navigate = useNavigate()

    const { getAllInterviewers, interviewers } = useSuperAdminContext();
    const { server } = useAuthContext();
    const token = localStorage.getItem("token");

    useEffect(() => {
        getAllInterviewers();
    }, []);

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
            const { message } = res.data
            toast.success(message)
            await getAllInterviewers();
        } catch (error) {
            // console.error("Failed to save interviewer:", error);
            toast.error(error.response.data.message || "Something went wrong while saving interviewer");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!confirmDeleteId) return;

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
            getAllInterviewers();
        } catch (error) {
            console.error('Delete error:', error);

            toast.error(
                error?.response?.data?.message || 'Failed to delete interviewer'
            );
        }
    };

    const filteredInterviewers = interviewers.filter(intv => {
        const { data } = intv;

        // Check for fullname and email match
        const matchesSearch =
            (data.fullname && data.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (data.email && data.email.toLowerCase().includes(searchTerm.toLowerCase()));

        // Check for location match (positionFilter)
        const matchesPosition =
            positionFilter === 'All' ||
            (data.location && data.location.toLowerCase().includes(positionFilter.toLowerCase()));

        return matchesSearch && matchesPosition;
    });

    const uniquePositions = ['All', ...new Set(interviewers.map(i => i.data.location))];

    const indexOfLastInterviewers = currentPage * interviewersPerPage;
    const indexOfFirstInterviewers = indexOfLastInterviewers - interviewersPerPage;
    const currentInterviewersList = filteredInterviewers?.slice(indexOfFirstInterviewers, indexOfLastInterviewers);
    const totalPages = Math.ceil(filteredInterviewers?.length / interviewersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleViewInterviewer = (id) => {
        navigate(`/superadmin/interviewerProfile/${id}`)
    }

    if (loading) {
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
        <>
            <div className="container-fluid px-3">
                <div className="container mt-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                        <h2 className="mb-2 mb-md-0">Interviewers</h2>
                        <button className="btn btn-primary" onClick={() => {
                            setModalVisible(true);
                        }}>Add Interviewer</button>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-8 mb-2 mb-md-0">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name or email..."
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
                                {uniquePositions.map((pos, i) => (
                                    <option key={i} value={pos}>{pos}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive">
                        {/* Desktop Table (hidden on mobile) */}
                        <table className="table table-bordered table-striped align-middle d-none d-md-table">
                            <thead className="table-light">
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>HeadLine</th>
                                    <th>Location</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentInterviewersList.map((intv) => (
                                    <tr key={intv.data._id}>
                                        <td>{!intv.data.fullname ? "Profile Not Completed" : intv.data.fullname.length > 20 ? intv.data.fullname.slice(0, 20) + '...' : intv.data.fullname}</td>
                                        <td>{intv.data.email}</td>
                                        <td>{!intv.data.headline ? "" : intv.data.headline}</td>
                                        <td>{!intv.data.location ? "" : intv.data.location}</td>
                                        <td className="text-center">
                                            <div className="d-flex align-items-center gap-2">
                                                {intv.data.userId ? (
                                                    <button style={{ width: '75px' }}
                                                        className="btn btn-outline-primary btn-sm"
                                                        onClick={() => handleViewInterviewer(intv.data._id)}
                                                    >
                                                        View
                                                    </button>
                                                ) : (
                                                    <span style={{ width: '75px' }}></span>
                                                )}

                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => setConfirmDeleteId(intv?.data?.userId || intv?.data?._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Cards (hidden on desktop) */}
                        <div className="d-md-none">
                            {currentInterviewersList.map((intv) => (
                                <div key={intv.data._id} className="card mb-3">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div className="flex-grow-1">
                                                <h5 className="card-title mb-1 text-truncate">
                                                    {intv.data.fullname || 'Profile Not Completed'}
                                                </h5>
                                                <p className="card-text text-muted mb-1">
                                                    {intv.data.headline || 'No headline available'}
                                                </p>
                                                <p className="card-text text-muted mb-1">
                                                    {intv.data.location || 'No location'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center mb-3">
                                            <i className="bi bi-envelope me-2"></i>
                                            <small className="text-truncate">{intv.data.email}</small>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center gap-2">
                                            {intv?.data?.userId ? (
                                                <button
                                                    className="btn btn-primary flex-grow-1"
                                                    onClick={() => handleViewInterviewer(intv.data._id)}
                                                >
                                                    View Profile
                                                </button>
                                            ) : (
                                                <div style={{ width: '75px' }}></div>
                                            )}
                                            <button
                                                className="btn btn-outline-danger ms-auto"
                                                onClick={() => setConfirmDeleteId(intv?.data?.userId || intv?.data?._id)}
                                                aria-label="Delete interviewer"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <SuperAdminInterviewerModal
                        show={modalVisible}
                        onHide={() => setModalVisible(false)}
                        onSave={handleSave}
                    />

                    {/* Delete Confirmation Modal */}
                    {confirmDeleteId && (
                        <div className="modal fade show d-block" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Confirm Delete</h5>
                                        <button type="button" className="btn-close" onClick={() => setConfirmDeleteId(null)}></button>
                                    </div>
                                    <div className="modal-body">
                                        Are you sure you want to delete this interviewer?
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                                        <button className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
                                    </div>
                                </div>
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
        </>
    );
};

export default SuperAdminInterviewer;

