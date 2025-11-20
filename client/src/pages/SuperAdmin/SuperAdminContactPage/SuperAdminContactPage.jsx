import { useState, useEffect } from 'react';
import axios from "axios";
import { useAuthContext } from '../../../context/auth-context';
import toast from "react-hot-toast";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-danger text-white border-0">
                        <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="text-center mb-3">
                            <i className="bi bi-exclamation-triangle-fill text-danger fs-7"></i>
                        </div>
                        <p className="text-center mb-0">Are you sure you want to delete this contact message? This action cannot be undone.</p>
                    </div>
                    <div className="modal-footer border-0">
                        <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn btn-danger rounded-pill px-4" onClick={onConfirm}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SuperAdminContactPage = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { server, token } = useAuthContext();

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortOption, setSortOption] = useState('newest');

    // UI states
    const [selectedContact, setSelectedContact] = useState(null);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [replyLoading, setReplyLoading] = useState(false);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const { data } = await axios.get(`${server}/api/v1/contact/getContact`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setContacts(data.data || []);
            } catch (err) {
                setError(
                    err.response?.data?.message || err.message || "Failed to fetch contacts"
                );
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, [server, token]);

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.$date && timestamp.$date.$numberLong) {
            return new Date(parseInt(timestamp.$date.$numberLong)).toLocaleString();
        }
        return new Date(timestamp).toLocaleString();
    };

    const handleReply = async () => {
        if (!selectedContact || !replyMessage.trim()) return;
        setReplyLoading(true);
        try {
            const res = await axios.post(`${server}/api/v1/contact/reply`, {
                contactId: selectedContact._id || selectedContact.id,
                newMessage: replyMessage
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setContacts((prevContacts) =>
                prevContacts.map((c) =>
                    c._id === selectedContact._id ? { ...c, status: "replied" } : c
                )
            );

            toast.dismiss();
            toast.success(res.data.message)

            setReplyMessage('');
            setShowReplyModal(false);
            setSelectedContact(null);
        } catch (err) {
            setError(
                err.response?.data?.message || err.message || "Failed to send reply"
            );
        } finally {
            setReplyLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedContact) return;

        try {
            const contactId = selectedContact._id || selectedContact.id;
            const res = await axios.delete(`${server}/api/v1/contact/deleteContact/${contactId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setContacts(contacts.filter(contact =>
                (contact._id || contact.id) !== contactId
            ));

            toast.dismiss();
            toast.success(res.data.message);
            setShowDeleteModal(false);
            setSelectedContact(null);
        } catch (err) {
            setError(
                err.response?.data?.message || err.message || "Failed to delete contact"
            );
        }
    };

    const openDeleteModal = (contact) => {
        setSelectedContact(contact);
        setShowDeleteModal(true);
    };

    const filteredContacts = contacts
        .filter(contact => {
            const matchesSearch = searchTerm === '' ||
                contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.message.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'replied' && contact.status === 'replied') ||
                (filterStatus === 'pending' && (!contact.status || contact.status !== 'replied'));

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortOption) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });

    if (loading) {
        return (
            <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="fs-5 fw-medium">Loading contacts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
                <div className="card shadow-lg border-0" style={{ maxWidth: '500px' }}>
                    <div className="card-body text-center p-5">
                        <div className="text-danger mb-4">
                            <i className="bi bi-exclamation-triangle-fill fs-1"></i>
                        </div>
                        <h4 className="card-title mb-3">Error Loading Contacts</h4>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            className="btn btn-danger px-4"
                            onClick={() => window.location.reload()}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i> Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* Header Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                        <div className="mb-3 mb-md-0">
                            <h1 className="h2 fw-bold mb-1">Contact Messages</h1>
                            <p className="text-muted mb-0">Manage and respond to customer inquiries</p>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="badge bg-primary fs-3 me-3">
                                {filteredContacts.length} {filteredContacts.length === 1 ? 'Message' : 'Messages'}
                            </span>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterStatus('all');
                                    setSortOption('newest');
                                }}
                            >
                                <i className="bi bi-arrow-counterclockwise me-1"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="card shadow-sm mb-4 border-0">
                <div className="card-body p-4">
                    <div className="row g-3">
                        <div className="col-md-5">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-0"
                                    placeholder="Search by name, email, or message..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        className="btn btn-outline-secondary border-start-0"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Messages</option>
                                <option value="pending">Pending Reply</option>
                                <option value="replied">Replied</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name-asc">Name (A-Z)</option>
                                <option value="name-desc">Name (Z-A)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Messages */}
            <div className="row">
                {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                        <div key={contact._id || contact.id} className="col-12 mb-4">
                            <div className="card shadow-sm h-100 border-0 overflow-hidden">
                                <div className="card-header bg-white py-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center border-bottom">
                                    <div className="d-flex align-items-center mb-2 mb-md-0">
                                        <div className="avatar-circle me-3">
                                            {contact.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h5 className="mb-0 fw-semibold">{contact.name}</h5>
                                            <div className="small text-muted">
                                                <i className="bi bi-envelope me-1"></i> {contact.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column align-items-start align-items-md-end">
                                        <span className="badge bg-light text-dark mb-1 px-3 py-1">
                                            <i className="bi bi-clock me-1"></i> {formatDate(contact.createdAt)}
                                        </span>
                                        {contact.status === 'replied' ? (
                                            <span className="badge bg-success px-3 py-1">
                                                <i className="bi bi-check-circle me-1"></i> Replied
                                            </span>
                                        ) : (
                                            <span className="badge bg-warning text-dark px-3 py-1">
                                                <i className="bi bi-hourglass-split me-1"></i> Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="card-body p-4">
                                    <div className="mb-3">
                                        <h6 className="text-muted small mb-2 fw-medium">Message:</h6>
                                        <div className="bg-light p-3 rounded-3">
                                            {contact.message}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-white py-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                                    <small className="text-muted mb-2 mb-md-0">
                                        ID: {contact._id || contact.id}
                                    </small>
                                    <div className="d-flex flex-wrap mb-2">
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => {
                                                setSelectedContact(contact);
                                                setShowReplyModal(true);
                                            }}
                                        >
                                            <i className="bi bi-reply me-1"></i> Reply
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger me-2"
                                            onClick={() => openDeleteModal(contact)}
                                        >
                                            <i className="bi bi-trash me-1"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="card shadow-sm border-0">
                            <div className="card-body text-center py-5">
                                <div className="mb-4 text-muted">
                                    <i className="bi bi-inbox fs-1"></i>
                                </div>
                                <h4 className="mb-3">No Contact Messages</h4>
                                <p className="text-muted mb-4">
                                    {searchTerm || filterStatus !== 'all'
                                        ? "No messages match your search criteria."
                                        : "No contacts have been submitted yet."}
                                </p>
                                {(searchTerm || filterStatus !== 'all') && (
                                    <button
                                        className="btn btn-primary px-4"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterStatus('all');
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Reply Modal */}
            {showReplyModal && selectedContact && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-primary text-white border-0">
                                <h5 className="modal-title">Reply to {selectedContact.name}</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        setShowReplyModal(false);
                                        setReplyMessage('');
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="mb-4">
                                    <label className="form-label fw-medium">Original Message:</label>
                                    <div className="bg-light p-3 rounded-3">
                                        {selectedContact.message}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="replyMessage" className="form-label fw-medium">Your Reply:</label>
                                    <textarea
                                        className="form-control"
                                        id="replyMessage"
                                        rows="4"
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder="Type your reply here..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer bg-light border-0">
                                <button
                                    type="button"
                                    className="btn btn-secondary px-4"
                                    onClick={() => {
                                        setShowReplyModal(false);
                                        setReplyMessage('');
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary px-4"
                                    onClick={handleReply}
                                    disabled={replyLoading || !replyMessage.trim()}
                                >
                                    {replyLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-send me-2"></i> Send Reply
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedContact(null);
                }}
                onConfirm={handleDelete}
            />

            {/* Modal backdrops */}
            {(showReplyModal || showDeleteModal) && (
                <div className="modal-backdrop fade show"></div>
            )}

            <style>{`
                .avatar-circle {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 1.2rem;
                    flex-shrink: 0;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                
                .modal.show {
                    background-color: rgba(0,0,0,0.5);
                }
                
                .card {
                    transition: all 0.3s ease;
                }
                
                .card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
                }
                
                .btn {
                    transition: all 0.2s ease;
                }
                
                .btn:hover {
                    transform: translateY(-1px);
                }
                
                .badge {
                    font-weight: 500;
                }
                
                .form-control, .form-select {
                    transition: all 0.2s ease;
                }
                
                .form-control:focus, .form-select:focus {
                    box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
                    border-color: #667eea;
                }
                
                .input-group-text {
                    transition: all 0.2s ease;
                }
                
                @media (max-width: 768px) {
                    .card-header, .card-footer {
                        padding: 0.75rem 1rem;
                    }
                    
                    .card-body {
                        padding: 1rem;
                    }
                    
                    .modal-dialog {
                        margin: 1rem;
                        max-width: calc(100% - 2rem);
                    }
                    
                    h1.h2 {
                        font-size: 1.75rem;
                    }
                    
                    .btn-sm {
                        padding: 0.375rem 0.75rem;
                        font-size: 0.875rem;
                    }
                    
                    .badge {
                        font-size: 0.75rem;
                    }
                    
                    .avatar-circle {
                        width: 40px;
                        height: 40px;
                        font-size: 1rem;
                    }
                }
                
                /* Custom animations */
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .card {
                    animation: fadeIn 0.5s ease forwards;
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
};

export default SuperAdminContactPage;