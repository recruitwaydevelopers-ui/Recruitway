import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PasswordCheck from '../../../components/PasswordCheck';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../../context/auth-context';

const SuperAdminProfile = () => {
    const [superAdmin, setSuperAdmin] = useState({
        profilePicture: null,
        fullName: "",
        phoneNumber: "",
        address: ""
    });
    const [editMode, setEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const token = localStorage.getItem('token');
    const { server, fetchUserData } = useAuthContext()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSuperAdmin(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getSuperAdminProfile = async () => {
        try {
            const response = await axios.get(`${server}/api/v1/superadmin/getprofile`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

            const data = response.data.data || {};
            setSuperAdmin({
                profilePicture: data.profilePicture || "",
                fullName: data.fullname || "",
                phoneNumber: data.phone || "",
                address: data.address || "",
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch profile')
        }
    }

    useEffect(() => {
        getSuperAdminProfile()
    }, [token])

    useEffect(() => {
        if (!selectedFile) {
            setPreview('');
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const handleFileChange = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(null);
            return;
        }

        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            setMessage({ text: 'Only JPG, JPEG, and PNG formats are allowed.', type: 'error' });
            setSelectedFile(null);
            return;
        }

        // Validate file size
        if (file.size > maxSizeInBytes) {
            setMessage({ text: 'File size should be less than 5MB.', type: 'error' });
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        setMessage({ text: '', type: '' });
    };

    const handleEditClick = () => {
        setOriginalData({ ...superAdmin });
        setShowPasswordModal(true);
    };

    const handleCancelEdit = () => {
        setSuperAdmin({ ...originalData });
        setPreview(null);
        setEditMode(false);
    };

    const handlePasswordVerify = async (password) => {
        try {
            if (!password) {
                return toast.error("Please enter your password.");
            }

            const response = await axios.post(`${server}/api/v1/auth/checkPassword`,
                { password },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                toast.success("Password verified successfully!");
                setEditMode(true);
                setShowPasswordModal(false);
            } else {
                toast.error(response.data.message || "Password verification failed.");
            }
        } catch (error) {
            console.error("Password verification error:", error);
            toast.error(error.response?.data?.message || "Something went wrong during password verification.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: "", type: "" })

        try {
            const formData = new FormData();
            Object.entries(superAdmin).forEach(([key, value]) => {
                if (key !== 'profilePicture' && value !== null && value !== undefined) {
                    formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
                }
            });

            if (selectedFile) {
                formData.append('profilePicture', selectedFile);
            }

            const response = await axios.post(`${server}/api/v1/superadmin/createprofile`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });

            toast.success('Company profile updated successfully!');
            setEditMode(false);
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({
                text: error.response?.data?.message || 'Failed to update profile',
                type: 'error'
            });
            toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            fetchUserData(token)
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="container-fluid">
                <div className="container py-4">
                    {/* Company Header */}
                    <form onSubmit={editMode ? handleSubmit : (e) => e.preventDefault()}>
                        <div className="row mb-4">
                            {message?.text && (
                                <div className={`mb-4 p-3 rounded ${message?.type === 'success' ? 'alert alert-success' : 'alert alert-danger'}`}>
                                    {message.text}
                                </div>
                            )}
                        </div>
                        <div className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex flex-column flex-md-row align-items-start gap-4">
                                        {/* Profile Picture Section */}
                                        <div className="d-flex flex-column align-items-start text-center mb-4">
                                            <div className="position-relative mb-3">
                                                <img
                                                    src={preview || superAdmin.profilePicture || '/images/profilePictures/user-pic.png'}
                                                    alt="Profile"
                                                    className="img-fluid rounded-circle border border-4 border-light"
                                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                                />
                                                {editMode && (
                                                    <label
                                                        htmlFor="profilePicture"
                                                        className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle cursor-pointer hover-bg-primary"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="bi bi-camera"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                                                            <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                                                        </svg>
                                                        <input
                                                            id="profilePicture"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                            className="visually-hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                            {editMode && (
                                                <p className="text-muted small">Click on the camera icon to change your profile picture</p>
                                            )}
                                        </div>

                                        {/* Profile Details Section */}
                                        <div className="d-flex flex-column flex-lg-row align-items-start gap-4 w-100">
                                            <div className="flex-grow-1 text-start">
                                                {editMode ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            name="fullName"
                                                            value={superAdmin.fullName}
                                                            onChange={handleInputChange}
                                                            className="form-control form-control-lg mb-2"
                                                            placeholder="Full Name"
                                                            required
                                                        />
                                                        <input
                                                            type="tel"
                                                            name="phoneNumber"
                                                            value={superAdmin.phoneNumber}
                                                            onChange={handleInputChange}
                                                            className="form-control mb-3"
                                                            placeholder="Phone Number"
                                                            required
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <h1 className="mb-2">{superAdmin.fullName || "Full Name"}</h1>
                                                        <h2 className="h4 text-muted mb-3">
                                                            <i className="ti ti-phone me-2"></i>
                                                            {superAdmin.phoneNumber || "Phone Number"}
                                                        </h2>
                                                    </>
                                                )}

                                                <div className="mb-3">
                                                    {editMode ? (
                                                        <textarea
                                                            name="address"
                                                            value={superAdmin.address}
                                                            onChange={handleInputChange}
                                                            className="form-control"
                                                            rows="3"
                                                            placeholder="Address"
                                                            required
                                                        />
                                                    ) : (
                                                        <div className="d-flex align-items-start">
                                                            <i className="ti ti-map-pin me-2 mt-1"></i>
                                                            <div>
                                                                <h3 className="h6 mb-1">Address</h3>
                                                                <p className="text-muted">
                                                                    {superAdmin.address || "No address provided"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-3 mt-md-0 d-flex flex-column flex-sm-row gap-2">
                                                <button
                                                    type={editMode ? "submit" : "button"}
                                                    className={`btn btn-sm ${editMode ? 'btn-success' : 'btn-primary'}`}
                                                    style={{
                                                        backgroundColor: !editMode && '#5D87FF',
                                                        borderColor: !editMode && '#5D87FF'
                                                    }}
                                                    onClick={!editMode ? handleEditClick : undefined}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="ti ti-user-edit me-2"></i>
                                                            {editMode ? 'Save Profile' : 'Edit Profile'}
                                                        </>
                                                    )}
                                                </button>

                                                {editMode && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={handleCancelEdit}
                                                        disabled={isSubmitting}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Password Verification Modal */}
                            <PasswordCheck
                                show={showPasswordModal}
                                onClose={() => setShowPasswordModal(false)}
                                onVerify={handlePasswordVerify}
                            />
                        </div>
                    </form >
                </div >
            </div >
        </>
    );
};

export default SuperAdminProfile;