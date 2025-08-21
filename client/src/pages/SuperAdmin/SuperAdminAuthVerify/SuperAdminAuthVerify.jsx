import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../../context/auth-context';

const SuperAdminAuthVerify = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [activeRoleTab, setActiveRoleTab] = useState('allRoles');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { server } = useAuthContext();
    const token = localStorage.getItem("token");
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get(`${server}/api/v1/superadmin/getAllAuth`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data.auth || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (userId) => {
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await axios.put(`${server}/api/v1/superadmin/verifyUser/${userId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setSuccess('User verified successfully');
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to verify user');
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (userId) => {
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await axios.put(`${server}/api/v1/superadmin/revokeVerification/${userId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setSuccess('Verification revoked successfully');
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to revoke verification');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        console.log(userId);
        console.log(newRole);
        
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await axios.put(`${server}/api/v1/superadmin/changeUserRole/${userId}`,
                { role: newRole },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setSuccess('User role updated successfully');
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user role');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = () => {
        // First filter by verification status
        let filtered = users;
        if (activeTab === 'verified') {
            filtered = users.filter(user => user.isVerified);
        } else if (activeTab === 'unverified') {
            filtered = users.filter(user => !user.isVerified);
        }

        // Then filter by role if not 'allRoles'
        if (activeRoleTab !== 'allRoles') {
            filtered = filtered.filter(user => user.role === activeRoleTab);
        }

        // Finally filter by search query
        if (searchQuery) {
            filtered = filtered.filter(user =>
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const getTabBadgeCount = (tab) => {
        let filtered = users;
        if (tab === 'verified') {
            filtered = users.filter(user => user.isVerified);
        } else if (tab === 'unverified') {
            filtered = users.filter(user => !user.isVerified);
        }
        return filtered.length;
    };

    const getRoleTabBadgeCount = (role) => {
        let filtered = users;
        if (activeTab === 'verified') {
            filtered = users.filter(user => user.isVerified);
        } else if (activeTab === 'unverified') {
            filtered = users.filter(user => !user.isVerified);
        }

        if (role === 'allRoles') return filtered.length;
        return filtered.filter(user => user.role === role).length;
    };

    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        role: 'user'
    });
    const [addUserLoading, setAddUserLoading] = useState(false);
    const [addUserError, setAddUserError] = useState('');

    const handleAddUser = async (e) => {
        e.preventDefault();
        setAddUserLoading(true);
        setAddUserError('');
        try {
            const response = await axios.post(`${server}/api/v1/superadmin/addUser`,
                newUser,
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const { message } = response.data
            setSuccess(message);
            setShowAddUserModal(false);
            setNewUser({
                email: '',
                password: '',
                role: 'user'
            });
            fetchUsers();
        } catch (err) {
            setAddUserError(err.response?.data?.message || 'Failed to add user');
        } finally {
            setAddUserLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading || addUserLoading) {
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

    const RoleSelect = ({ userId, currentRole }) => {
        const [selectedRole, setSelectedRole] = useState(currentRole);
        const [isChanging, setIsChanging] = useState(false);

        const handleChange = (e) => {
            const newRole = e.target.value;
            setSelectedRole(newRole);
            setIsChanging(true);
            handleRoleChange(userId, newRole).finally(() => setIsChanging(false));
        };

        return (
            <div className="role-select-container">
                <select
                    className={`form-select form-select-sm ${isChanging ? 'changing' : ''}`}
                    value={selectedRole}
                    onChange={handleChange}
                    disabled={isChanging}
                >
                    <option value="user">User</option>
                    <option value="company">Company</option>
                    <option value="interviewer">Interviewer</option>
                    <option value="superadmin">Super Admin</option>
                </select> 
                {isChanging && (
                    <span className="role-change-spinner spinner-border spinner-border-sm ms-2"></span>
                )}
                <style jsx>{`
                    .role-select-container {
                        display: flex;
                        align-items: center;
                    }
                    .role-select-container select {
                        min-width: 120px;
                        transition: all 0.3s ease;
                    }
                    .role-select-container select.changing {
                        border-color: #0d6efd;
                        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                    }
                `}</style>
            </div>
        );
    };

    return (
        <div className="container-fluid">
            <div className="container">
                <div className="card">
                    <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <h2 className="mb-0 text-start w-md-auto">
                            User Verification Management
                        </h2>

                        <div className="d-flex flex-column flex-sm-row gap-2">
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={fetchUsers}
                                disabled={loading}
                            >
                                {loading ? 'Refreshing...' : 'Refresh Data'}
                            </button>
                            <button className="btn btn-sm btn-primary" disabled={loading} onClick={() => setShowAddUserModal(true)}>
                                Add User
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {error}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setError('')}
                                ></button>
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                {success}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSuccess('')}
                                ></button>
                            </div>
                        )}

                        {/* Search Bar */}
                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Main Tabs Navigation */}
                        <div className="d-flex gap-2 mb-3">
                            <button
                                className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-secondary'} d-flex align-items-center`}
                                onClick={() => {
                                    setActiveTab('all');
                                    setActiveRoleTab('allRoles');
                                }}
                            >
                                All
                                <span className="badge bg-secondary ms-2">{getTabBadgeCount("all")}</span>
                            </button>
                            <button
                                className={`btn btn-sm ${activeTab === 'verified' ? 'btn-success' : 'btn-outline-success'} d-flex align-items-center`}
                                onClick={() => {
                                    setActiveTab('verified');
                                    setActiveRoleTab('allRoles');
                                }}
                            >
                                Verified
                                <span className="badge bg-success ms-2">{getTabBadgeCount("verified")}</span>
                            </button>
                            <button
                                className={`btn btn-sm ${activeTab === 'unverified' ? 'btn-danger' : 'btn-outline-danger'} d-flex align-items-center`}
                                onClick={() => {
                                    setActiveTab('unverified');
                                    setActiveRoleTab('allRoles');
                                }}
                            >
                                Unverified
                                <span className="badge bg-danger ms-2">{getTabBadgeCount("unverified")}</span>
                            </button>
                        </div>

                        {/* Role Tabs Navigation */}
                        <div className="mb-3">
                            {/* Desktop - Horizontal Tabs */}
                            <div className="d-none d-md-flex gap-2">
                                <button
                                    className={`btn btn-sm ${activeRoleTab === 'allRoles' ? 'btn-info' : 'btn-outline-info'} d-flex align-items-center`}
                                    onClick={() => setActiveRoleTab('allRoles')}
                                >
                                    All Roles
                                    <span className="badge bg-info ms-2">{getRoleTabBadgeCount('allRoles')}</span>
                                </button>
                                <button
                                    className={`btn btn-sm ${activeRoleTab === 'company' ? 'btn-warning' : 'btn-outline-warning'} d-flex align-items-center`}
                                    onClick={() => setActiveRoleTab('company')}
                                >
                                    Companies
                                    <span className="badge bg-warning ms-2">{getRoleTabBadgeCount('company')}</span>
                                </button>
                                <button
                                    className={`btn btn-sm ${activeRoleTab === 'user' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
                                    onClick={() => setActiveRoleTab('user')}
                                >
                                    Users
                                    <span className="badge bg-primary ms-2">{getRoleTabBadgeCount('user')}</span>
                                </button>
                                <button
                                    className={`btn btn-sm ${activeRoleTab === 'interviewer' ? 'btn-secondary' : 'btn-outline-secondary'} d-flex align-items-center`}
                                    onClick={() => setActiveRoleTab('interviewer')}
                                >
                                    Interviewers
                                    <span className="badge bg-secondary ms-2">{getRoleTabBadgeCount('interviewer')}</span>
                                </button>
                                <button
                                    className={`btn btn-sm ${activeRoleTab === 'superadmin' ? 'btn-dark' : 'btn-outline-dark'} d-flex align-items-center`}
                                    onClick={() => setActiveRoleTab('superadmin')}
                                >
                                    Super Admins
                                    <span className="badge bg-dark ms-2">{getRoleTabBadgeCount('superadmin')}</span>
                                </button>
                            </div>

                            {/* Mobile - Dropdown Selector */}
                            <div className="d-md-none">
                                <div className="dropdown">
                                    <button
                                        className="btn btn-outline-secondary dropdown-toggle w-100 d-flex justify-content-between align-items-center"
                                        type="button"
                                        id="roleDropdown"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span>
                                            <span>
                                                {activeRoleTab === 'allRoles' && 'All Roles'}
                                                {activeRoleTab === 'company' && 'Companies'}
                                                {activeRoleTab === 'user' && 'Users'}
                                                {activeRoleTab === 'interviewer' && 'Interviewers'}
                                                {activeRoleTab === 'superadmin' && 'Super Admins'}
                                            </span>
                                            <span className="badge bg-primary ms-2">
                                                {getRoleTabBadgeCount(activeRoleTab)}
                                            </span>
                                        </span>
                                    </button>
                                    <ul className="dropdown-menu w-100" aria-labelledby="roleDropdown">
                                        <li>
                                            <button
                                                className={`dropdown-item d-flex justify-content-between ${activeRoleTab === 'allRoles' ? 'active' : ''}`}
                                                onClick={() => setActiveRoleTab('allRoles')}
                                            >
                                                All Roles
                                                <span className="badge bg-info">{getRoleTabBadgeCount('allRoles')}</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`dropdown-item d-flex justify-content-between ${activeRoleTab === 'company' ? 'active' : ''}`}
                                                onClick={() => setActiveRoleTab('company')}
                                            >
                                                Companies
                                                <span className="badge bg-warning">{getRoleTabBadgeCount('company')}</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`dropdown-item d-flex justify-content-between ${activeRoleTab === 'user' ? 'active' : ''}`}
                                                onClick={() => setActiveRoleTab('user')}
                                            >
                                                Users
                                                <span className="badge bg-primary">{getRoleTabBadgeCount('user')}</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`dropdown-item d-flex justify-content-between ${activeRoleTab === 'interviewer' ? 'active' : ''}`}
                                                onClick={() => setActiveRoleTab('interviewer')}
                                            >
                                                Interviewers
                                                <span className="badge bg-secondary">{getRoleTabBadgeCount('interviewer')}</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`dropdown-item d-flex justify-content-between ${activeRoleTab === 'superadmin' ? 'active' : ''}`}
                                                onClick={() => setActiveRoleTab('superadmin')}
                                            >
                                                Super Admins
                                                <span className="badge bg-dark">{getRoleTabBadgeCount('superadmin')}</span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center vh-100">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : filteredUsers().length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                No {activeTab === 'all' ? '' : activeTab} {activeRoleTab === 'allRoles' ? 'users' : activeRoleTab + 's'} found
                                {searchQuery && ` matching "${searchQuery}"`}
                            </div>
                        ) : (
                            <div className="table-responsive">
                                {/* Desktop Table */}
                                <table className="table table-striped table-hover d-none d-md-table">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Email</th>
                                            <th>Current Role</th>
                                            <th>Change Role</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers().map(user => (
                                            <tr key={user._id}>
                                                <td>{user.email}</td>
                                                <td className='text-capitalize'>{user.role}</td>
                                                <td>
                                                    <RoleSelect userId={user._id} currentRole={user.role} />
                                                </td>
                                                <td>
                                                    <span className={`badge ${user.isVerified ? 'bg-success' : 'bg-danger text-dark'}`}>
                                                        {user.isVerified ? 'Verified' : 'Unverified'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {user.isVerified ? (
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleRevoke(user._id)}
                                                            disabled={loading}
                                                        >
                                                            Revoke
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() => handleVerify(user._id)}
                                                            disabled={loading}
                                                        >
                                                            Verify
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Mobile Cards */}
                                <div className="d-md-none">
                                    {filteredUsers().map(user => (
                                        <div key={user._id} className="card mb-3">
                                            <div className="card-body">
                                                <div className="mb-3">
                                                    <h6 className="mb-1">{user.email}</h6>
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <small className="text-muted text-capitalize">Role: {user.role}</small>
                                                        <span className={`badge ${user.isVerified ? 'bg-success' : 'bg-danger text-dark'}`}>
                                                            {user.isVerified ? 'Verified' : 'Unverified'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label">Change Role</label>
                                                    <RoleSelect userId={user._id} currentRole={user.role} />
                                                </div>

                                                <div className="d-flex justify-content-end gap-2">
                                                    {user.isVerified ? (
                                                        <button
                                                            className="btn btn-sm btn-outline-danger w-100"
                                                            onClick={() => handleRevoke(user._id)}
                                                            disabled={loading}
                                                        >
                                                            Revoke Verification
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-sm btn-outline-success w-100"
                                                            onClick={() => handleVerify(user._id)}
                                                            disabled={loading}
                                                        >
                                                            Verify User
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add User Modal */}
                <div className={`modal fade ${showAddUserModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showAddUserModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New User</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowAddUserModal(false);
                                        setAddUserError('');
                                    }}
                                    disabled={addUserLoading}
                                ></button>
                            </div>
                            <form onSubmit={handleAddUser}>
                                <div className="modal-body">
                                    {addUserError && (
                                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                            {addUserError}
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={() => setAddUserError('')}
                                            ></button>
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={newUser.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={newUser.password}
                                            onChange={handleInputChange}
                                            minLength="6"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="role" className="form-label">Role</label>
                                        <select
                                            className="form-select"
                                            id="role"
                                            name="role"
                                            value={newUser.role}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="user">User</option>
                                            <option value="company">Company</option>
                                            <option value="interviewer">Interviewer</option>
                                            <option value="superadmin">Super Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowAddUserModal(false);
                                            setAddUserError('');
                                        }}
                                        disabled={addUserLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={addUserLoading}
                                    >
                                        {addUserLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                Adding...
                                            </>
                                        ) : 'Add User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminAuthVerify;