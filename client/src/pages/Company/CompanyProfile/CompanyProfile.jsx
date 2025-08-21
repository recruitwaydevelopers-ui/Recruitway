import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../../context/auth-context';
import PasswordCheck from '../../../components/PasswordCheck';

const CompanyProfile = () => {

    const { server, token, fetchUserData } = useAuthContext();
    // const token = localStorage.getItem("token");
    const [openAddField, setOpenAddField] = useState(false);
    const [fieldName, setFieldName] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [company, setCompany] = useState({
        profilePicture: null,
        fullname: "",
        tagline: "",
        industry: "",
        companySize: "",
        headquarters: "",
        keyDetails: [],
        ceo: {
            ceoName: "",
            since: ""
        },
        founder: {
            founderName: "",
            currentRole: ""
        },
        website: "",
        contactEmail: "",
        contactPhone: "",
        about: "",
        history: [],
        des: [],
        departments: [],
        locations: [],
        socialMedia: {
            linkedin: "",
            twitter: "",
            facebook: ""
        }
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    const getCompanyProfile = async () => {
        try {
            const response = await axios.get(`${server}/api/v1/company/getprofile`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

            const data = response.data.data || {};
            setCompany({
                profilePicture: data.profilePicture || "",
                fullname: data.fullname || "",
                tagline: data.tagline || "",
                industry: data.industry || "",
                companySize: data.companySize || "",
                headquarters: data.headquarters || "",
                keyDetails: data.keyDetails || [],
                ceo: data.ceo || { ceoName: "", since: "" },
                founder: data.founder || { founderName: "", currentRole: "" },
                website: data.website || "",
                contactEmail: data.contactEmail || "",
                contactPhone: data.contactPhone || "",
                about: data.about || "",
                history: data.history || [],
                des: data.des || [],
                departments: data.departments || [],
                locations: data.locations || [],
                socialMedia: data.socialMedia || { linkedin: "", twitter: "", facebook: "" }
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch profile')
        }
    }

    useEffect(() => {
        getCompanyProfile()
    }, [token])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompany(prev => ({ ...prev, [name]: value }));
    };

    const handleObjectChange = (objectName, field, value) => {
        setCompany(prev => ({
            ...prev,
            [objectName]: { ...prev[objectName], [field]: value }
        }));
    };

    const handleArrayChange = (arrayName, index, field, value) => {
        setCompany(prev => {
            const updatedArray = [...prev[arrayName]];
            updatedArray[index] = { ...updatedArray[index], [field]: value };
            return { ...prev, [arrayName]: updatedArray };
        });
    };

    const addNewItem = (arrayName, template) => {
        setCompany(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], template]
        }));
    };

    const removeItem = (arrayName, index) => {
        setCompany(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((_, i) => i !== index)
        }));
    };

    const handleAddField = () => {
        if (!fieldName.trim()) {
            toast.error("Field name cannot be empty");
            return;
        }
        addNewItem('des', { key: fieldName, value: "" });
        setFieldName("");
        setOpenAddField(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: "", type: "" })

        try {
            const formData = new FormData();
            Object.entries(company).forEach(([key, value]) => {
                if (key !== 'profilePicture' && value !== null && value !== undefined) {
                    formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
                }
            });

            if (selectedFile) {
                formData.append('profilePicture', selectedFile);
            }

            const response = await axios.post(`${server}/api/v1/company/createprofile`, formData, {
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

    const wordLimit = 1000;
    const [wordCount, setWordCount] = useState(company?.about?.length);
    const [summaryError, setSummaryError] = useState('');

    const handleSummaryChange = (e) => {
        const { value } = e.target;
        const words = value
        const count = words.length;

        if (count <= wordLimit) {
            setCompany(prev => ({ ...prev, about: value }));
            setWordCount(count);
            setSummaryError('');
        } else {
            setSummaryError(`Maximum ${wordLimit} words allowed.`);
        }
    };

    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const handleEditClick = () => {
        setShowPasswordModal(true);
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
                setMessage({ text: "", type: "" });
                setEditMode(true);
            } else {
                toast.error(response.data.message || "Password verification failed.");
            }
        } catch (error) {
            console.error("Password verification error:", error);
            toast.error(error.response?.data?.message || "Something went wrong during password verification.");
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

                            <div className="col-12">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex flex-column flex-md-row align-items-start gap-4">
                                            <div className="d-flex flex-column align-items-start text-center mb-4">
                                                <div className="position-relative mb-3">
                                                    <img
                                                        src={preview || company?.profilePicture || '/images/profilePictures/user-pic.png'}
                                                        alt="Company Logo"
                                                        className="img-fluid rounded-circle border border-4 border-light"
                                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                                    />
                                                    {
                                                        editMode && (
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
                                                        )
                                                    }
                                                </div>
                                                {
                                                    editMode && (
                                                        <p className="text-muted small">Click on the camera icon to change your company Logo</p>
                                                    )
                                                }
                                            </div>
                                            <div className="d-flex flex-column flex-lg-row align-items-start gap-4">
                                                <div className="flex-grow-1 text-start">
                                                    {editMode ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                name="fullname"
                                                                value={company?.fullname}
                                                                onChange={handleInputChange}
                                                                className="form-control form-control-lg mb-2"
                                                                placeholder="Company Name"
                                                                required
                                                            />
                                                            <input
                                                                type="text"
                                                                name="tagline"
                                                                value={company?.tagline}
                                                                onChange={handleInputChange}
                                                                className="form-control mb-2"
                                                                placeholder="Tagline"
                                                                required
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <h1 className="mb-2">{company?.fullname || "Company Name"}</h1>
                                                            <h2 className="h4 text-muted mb-3">{company?.tagline || "Company Tagline"}</h2>
                                                        </>
                                                    )}
                                                    <div className="d-flex flex-wrap justify-content-start gap-3">
                                                        {editMode ? (
                                                            <>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <i className="ti ti-building-community me-2"></i>
                                                                    <input
                                                                        type="text"
                                                                        name="industry"
                                                                        value={company?.industry}
                                                                        onChange={handleInputChange}
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Industry"
                                                                        style={{ width: '120px' }}
                                                                    />
                                                                </div>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <i className="ti ti-users me-2"></i>
                                                                    <input
                                                                        type="text"
                                                                        name="companySize"
                                                                        value={company?.companySize}
                                                                        onChange={handleInputChange}
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Company Size"
                                                                        style={{ width: '120px' }}
                                                                    />
                                                                </div>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <i className="ti ti-map-pin me-2"></i>
                                                                    <input
                                                                        type="text"
                                                                        name="headquarters"
                                                                        value={company?.headquarters}
                                                                        onChange={handleInputChange}
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Headquarters"
                                                                        style={{ width: '150px' }}
                                                                        required
                                                                    />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="d-flex align-items-center">
                                                                    <i className="ti ti-building-community me-2"></i>
                                                                    {company?.industry || "Industry"}
                                                                </span>
                                                                <span className="d-flex align-items-center">
                                                                    <i className="ti ti-users me-2"></i>
                                                                    {company?.companySize || "Company Size"}
                                                                </span>
                                                                <span className="d-flex align-items-center">
                                                                    <i className="ti ti-map-pin me-2"></i>
                                                                    {company?.headquarters || "Headquarters"}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-3 mt-md-0 d-flex flex-column flex-sm-row gap-2">
                                                    <button
                                                        type={editMode ? "submit" : "button"}
                                                        className={`btn btn-sm ${editMode ? 'btn-success' : 'btn-primary'}`}
                                                        style={{
                                                            backgroundColor: !editMode && '#5D87FF',
                                                            borderColor: !editMode && '#5D87FF'
                                                        }}
                                                        // onClick={!editMode ? (e) => {
                                                        //     e.preventDefault();
                                                        //     setEditMode(true);
                                                        //     setMessage({ text: "", type: "" });
                                                        // } : undefined}
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
                                                            onClick={() => {
                                                                setEditMode(false);
                                                                setMessage({ type: '', text: '' });;
                                                            }}
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
                            </div>
                        </div>

                        <div className="row">
                            {/* Sidebar */}
                            <div className="col-lg-4 mb-4 mb-lg-0">
                                {/* Key Details */}
                                <div className="card shadow-sm mb-4">
                                    <div className="card-body">
                                        <h3 className="h5 card-title border-bottom pb-3 mb-3">Key Details</h3>
                                        <ul className="list-unstyled mb-0">
                                            {(company?.keyDetails || []).map((detail, index) => (
                                                <li key={index} className="mb-3">
                                                    {editMode ? (
                                                        <div className="d-flex gap-2 align-items-center">
                                                            <input
                                                                type="text"
                                                                value={detail.key}
                                                                onChange={(e) => handleArrayChange('keyDetails', index, 'key', e.target.value)}
                                                                className="form-control form-control-sm"
                                                                placeholder="Key"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={detail.value}
                                                                onChange={(e) => handleArrayChange('keyDetails', index, 'value', e.target.value)}
                                                                className="form-control form-control-sm"
                                                                placeholder="Value"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => removeItem('keyDetails', index)}
                                                            >
                                                                <i className="ti ti-x"></i>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex align-items-center">
                                                            <div>
                                                                <small className="text-muted">{detail?.key || 'Key'}</small>
                                                                <div className="fw-medium">{detail?.value || 'Value'}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                            {editMode && (
                                                <li>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary w-100"
                                                        onClick={() => addNewItem('keyDetails', { key: '', value: '' })}
                                                    >
                                                        <i className="ti ti-plus me-1"></i> Add Detail
                                                    </button>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* Leadership */}
                                <div className="card shadow-sm mb-4">
                                    <div className="card-body">
                                        <h3 className="h5 card-title border-bottom pb-3 mb-3">Leadership</h3>
                                        <div className="mb-4">
                                            <h6 className="fw-bold mb-3">CEO</h6>
                                            {editMode ? (
                                                <div className="mb-3">
                                                    <label className="form-label">Name</label>
                                                    <input
                                                        type="text"
                                                        value={company?.ceo?.ceoName}
                                                        onChange={(e) => handleObjectChange('ceo', 'ceoName', e.target.value)}
                                                        className="form-control mb-2"
                                                        placeholder="CEO Name"
                                                        required
                                                    />
                                                    <label className="form-label">Since</label>
                                                    <input
                                                        type="text"
                                                        value={company?.ceo?.since}
                                                        onChange={(e) => handleObjectChange('ceo', 'since', e.target.value)}
                                                        className="form-control"
                                                        placeholder="Year"
                                                        required
                                                    />
                                                </div>
                                            ) : (
                                                <div className="d-flex align-items-center">
                                                    <i className="ti ti-crown me-3 text-warning" style={{ fontSize: '1.5rem' }}></i>
                                                    <div>
                                                        <div className="fw-medium">{company?.ceo.ceoName || "CEO Name"}</div>
                                                        <small className="text-muted">CEO since {company?.ceo.since || "Year"}</small>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-3">Founder</h6>
                                            {editMode ? (
                                                <div>
                                                    <label className="form-label">Name</label>
                                                    <input
                                                        type="text"
                                                        value={company?.founder?.founderName}
                                                        onChange={(e) => handleObjectChange('founder', 'founderName', e.target.value)}
                                                        className="form-control mb-2"
                                                        placeholder="Founder Name"
                                                        required
                                                    />
                                                    <label className="form-label">Current Role</label>
                                                    <input
                                                        type="text"
                                                        value={company?.founder?.currentRole}
                                                        onChange={(e) => handleObjectChange('founder', 'currentRole', e.target.value)}
                                                        className="form-control"
                                                        placeholder="Current Role"
                                                        required
                                                    />
                                                </div>
                                            ) : (
                                                <div className="d-flex align-items-center">
                                                    <i className="ti ti-sparkles me-3 text-primary" style={{ fontSize: '1.5rem' }}></i>
                                                    <div>
                                                        <div className="fw-medium">{company?.founder?.founderName || "Founder Name"}</div>
                                                        <small className="text-muted">{company?.founder?.currentRole || "Current Role"}</small>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h3 className="h5 card-title border-bottom pb-3 mb-3">Contact Information</h3>
                                        {editMode ? (
                                            <>
                                                <div className="mb-3">
                                                    <label className="form-label">Website</label>
                                                    <input
                                                        type="text"
                                                        name="website"
                                                        value={company?.website}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        placeholder="Website URL"
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Email</label>
                                                    <input
                                                        type="email"
                                                        name="contactEmail"
                                                        value={company?.contactEmail}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        placeholder="Contact Email"
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Phone</label>
                                                    <input
                                                        type="tel"
                                                        name="contactPhone"
                                                        value={company?.contactPhone}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        placeholder="Contact Phone"
                                                        required
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="d-flex align-items-center mb-3">
                                                    <i className="ti ti-world me-2 text-muted"></i>
                                                    {company?.website ? (
                                                        <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer">
                                                            {company?.website}
                                                        </a>
                                                    ) : (
                                                        "No website provided"
                                                    )}
                                                </p>
                                                <p className="d-flex align-items-center mb-3">
                                                    <i className="ti ti-mail me-2 text-muted"></i>
                                                    {company?.contactEmail ? (
                                                        <a href={`mailto:${company.contactEmail}`}>{company.contactEmail}</a>
                                                    ) : (
                                                        "No email provided"
                                                    )}
                                                </p>

                                                <p className="d-flex align-items-center mb-0">
                                                    <i className="ti ti-phone me-2 text-muted"></i>
                                                    {company?.contactPhone ? (
                                                        <a href={`tel:${company.contactPhone}`}>{company.contactPhone}</a>
                                                    ) : (
                                                        "No phone provided"
                                                    )}
                                                </p>

                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="col-lg-8">
                                {/* Navigation */}
                                <div className="card shadow-sm mb-4">
                                    <div className="card-body p-2">
                                        <ul className="nav nav-pills gap-2">
                                            <li className="nav-item">
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm ${activeSection === 'overview' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                                                    onClick={() => setActiveSection('overview')}
                                                >
                                                    Overview
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm ${activeSection === 'departments' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                                                    onClick={() => setActiveSection('departments')}
                                                >
                                                    Departments
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm ${activeSection === 'locations' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                                                    onClick={() => setActiveSection('locations')}
                                                >
                                                    Locations
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm ${activeSection === 'social' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                                                    onClick={() => setActiveSection('social')}
                                                >
                                                    Social
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Active Section Content */}
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        {/* Overview Section */}
                                        {activeSection === 'overview' && (
                                            <div>
                                                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                                                    <h3 className="h5 mb-0">About Company</h3>
                                                    {editMode && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => setOpenAddField(true)}
                                                        >
                                                            <i className="ti ti-plus me-1"></i> Add Field
                                                        </button>
                                                    )}
                                                </div>
                                                {editMode ? (
                                                    // <textarea
                                                    //     name="about"
                                                    //     value={company?.about}
                                                    //     onChange={handleInputChange}
                                                    //     rows="6"
                                                    //     className="form-control mb-4"
                                                    //     placeholder="About the company"
                                                    //     required
                                                    // />
                                                    <>
                                                        <textarea
                                                            name="about"
                                                            value={company?.about}
                                                            onChange={handleSummaryChange}
                                                            rows="10"
                                                            className={`overflow-y-auto form-control ${summaryError ? 'is-invalid' : ''}`}
                                                            style={{ resize: "none" }}
                                                            required
                                                        />
                                                        <div className="invalid-feedback">{summaryError}</div>
                                                        <small className="text-muted">{wordCount}/{wordLimit} words</small>

                                                    </>
                                                ) : (
                                                    <p className="mb-4">{company?.about || "No description available"}</p>
                                                )}

                                                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                                                    <h3 className="h5 mb-0">Company History</h3>
                                                    {editMode && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => addNewItem('history', { key: '', value: '' })}
                                                        >
                                                            <i className="ti ti-plus me-1"></i> Add History
                                                        </button>
                                                    )}
                                                </div>

                                                {company?.history?.length > 0 ? (
                                                    company?.history?.map((item, index) => (
                                                        <div key={index} className="mb-3">
                                                            {editMode ? (
                                                                <div className="d-flex gap-2 mb-2">
                                                                    <input
                                                                        type="text"
                                                                        value={item.key}
                                                                        onChange={(e) => handleArrayChange('history', index, 'key', e.target.value)}
                                                                        className="form-control"
                                                                        placeholder="Event"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={item.value}
                                                                        onChange={(e) => handleArrayChange('history', index, 'value', e.target.value)}
                                                                        className="form-control"
                                                                        placeholder="Description"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={() => removeItem('history', index)}
                                                                    >
                                                                        <i className="ti ti-trash"></i>
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="mb-3">
                                                                    <h6 className="fw-bold">{item.key || 'Event'}</h6>
                                                                    <p>{item.value || 'Description'}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-muted">No history available</p>
                                                )}

                                                {openAddField && (
                                                    <div className="add-field-popup p-3 bg-light rounded mb-3">
                                                        <div className="d-flex gap-2 align-items-center">
                                                            <input
                                                                type="text"
                                                                placeholder="Enter field name"
                                                                value={fieldName}
                                                                onChange={(e) => setFieldName(e.target.value)}
                                                                className="form-control form-control-sm"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-success"
                                                                onClick={handleAddField}
                                                            >
                                                                Add
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={() => setOpenAddField(false)}
                                                            >
                                                                <i className="ti ti-x"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3 mt-4">
                                                    <h3 className="h5 mb-0">Additional Details</h3>
                                                </div>
                                                {company?.des?.length > 0 ? (
                                                    company?.des?.map((item, index) => (
                                                        <div key={index} className="mb-3">
                                                            {editMode ? (
                                                                <div className="d-flex gap-2 mb-2">
                                                                    <input
                                                                        type="text"
                                                                        value={item.key}
                                                                        onChange={(e) => handleArrayChange('des', index, 'key', e.target.value)}
                                                                        className="form-control"
                                                                        placeholder="Field Name"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={item.value}
                                                                        onChange={(e) => handleArrayChange('des', index, 'value', e.target.value)}
                                                                        className="form-control"
                                                                        placeholder="Value"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={() => removeItem('des', index)}
                                                                    >
                                                                        <i className="ti ti-trash"></i>
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="mb-3">
                                                                    <h6 className="fw-bold">{item?.key || 'Field'}</h6>
                                                                    <p>{item?.value || 'Value'}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-muted">No additional details available</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Departments Section */}
                                        {activeSection === 'departments' && (
                                            <div>
                                                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                                                    <h3 className="h5 mb-0">Departments</h3>
                                                    {editMode && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => addNewItem('departments', { key: '', value: '' })}
                                                        >
                                                            <i className="ti ti-plus me-1"></i> Add Department
                                                        </button>
                                                    )}
                                                </div>
                                                {company?.departments?.length > 0 ? (
                                                    <div className="row">
                                                        {company?.departments?.map((dept, index) => (
                                                            <div key={index} className="col-md-6 mb-3">
                                                                {editMode ? (
                                                                    <div className="d-flex gap-2">
                                                                        <input
                                                                            type="text"
                                                                            value={dept.key}
                                                                            onChange={(e) => handleArrayChange('departments', index, 'key', e.target.value)}
                                                                            className="form-control"
                                                                            placeholder="Department Name"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={dept.value}
                                                                            onChange={(e) => handleArrayChange('departments', index, 'value', e.target.value)}
                                                                            className="form-control"
                                                                            placeholder="Description"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-danger"
                                                                            onClick={() => removeItem('departments', index)}
                                                                        >
                                                                            <i className="ti ti-x"></i>
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="d-flex align-items-center">
                                                                        <i className="ti ti-building me-2 text-muted"></i>
                                                                        <div>
                                                                            <div className="fw-medium">{dept?.key || 'Department'}</div>
                                                                            {dept?.value && <small className="text-muted">{dept?.value}</small>}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-muted">No departments listed</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Locations Section */}
                                        {activeSection === 'locations' && (
                                            <div>
                                                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                                                    <h3 className="h5 mb-0">Office Locations</h3>
                                                    {editMode && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => addNewItem('locations', { city: '', country: '' })}
                                                        >
                                                            <i className="ti ti-plus me-1"></i> Add Location
                                                        </button>
                                                    )}
                                                </div>
                                                {company?.locations?.length > 0 ? (
                                                    company?.locations?.map((location, index) => (
                                                        <div key={index} className="mb-4 pb-3 border-bottom">
                                                            {editMode ? (
                                                                <div className="bg-light p-3 rounded mb-3">
                                                                    <div className="row g-3 mb-3">
                                                                        <div className="col-md-4">
                                                                            <label className="form-label">City</label>
                                                                            <input
                                                                                type="text"
                                                                                value={location?.city}
                                                                                onChange={(e) => handleArrayChange('locations', index, 'city', e.target.value)}
                                                                                className="form-control"
                                                                                placeholder="City"
                                                                            />
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <label className="form-label">Country</label>
                                                                            <input
                                                                                type="text"
                                                                                value={location?.country}
                                                                                onChange={(e) => handleArrayChange('locations', index, 'country', e.target.value)}
                                                                                className="form-control"
                                                                                placeholder="Country"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={() => removeItem('locations', index)}
                                                                    >
                                                                        <i className="ti ti-trash me-1"></i> Remove
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="d-flex">
                                                                    <i className="ti ti-map-pin me-3 text-danger" style={{ fontSize: '1.5rem' }}></i>
                                                                    <div>
                                                                        <h4 className="h5 mb-1">
                                                                            {location?.city || 'City'}
                                                                        </h4>
                                                                        <p className="text-muted mb-0">{location?.country || 'Country'}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-muted">No locations listed</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Social Media Section */}
                                        {activeSection === 'social' && (
                                            <div>
                                                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                                                    <h3 className="h5 mb-0">Social Media</h3>
                                                </div>
                                                {editMode ? (
                                                    <div className="row g-3">
                                                        <div className="col-md-4">
                                                            <label className="form-label">LinkedIn</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text">linkedin.com/company/</span>
                                                                <input
                                                                    type="text"
                                                                    value={company?.socialMedia?.linkedin}
                                                                    onChange={(e) => handleObjectChange('socialMedia', 'linkedin', e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="username"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="form-label">Twitter</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text">twitter.com/</span>
                                                                <input
                                                                    type="text"
                                                                    value={company?.socialMedia?.twitter}
                                                                    onChange={(e) => handleObjectChange('socialMedia', 'twitter', e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="username"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="form-label">Facebook</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text">facebook.com/</span>
                                                                <input
                                                                    type="text"
                                                                    value={company?.socialMedia?.facebook}
                                                                    onChange={(e) => handleObjectChange('socialMedia', 'facebook', e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="username"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="row">
                                                        <div className="col-md-4 mb-3">
                                                            {company?.socialMedia?.linkedin ? (
                                                                <a
                                                                    href={`https://linkedin.com/company/${company.socialMedia.linkedin}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-flex align-items-center text-decoration-none"
                                                                >
                                                                    <i className="ti ti-brand-linkedin me-2 text-primary" style={{ fontSize: '1.5rem' }}></i>
                                                                    <span>LinkedIn</span>
                                                                </a>
                                                            ) : (
                                                                <div className="d-flex align-items-center text-muted">
                                                                    <i className="ti ti-brand-linkedin me-2" style={{ fontSize: '1.5rem' }}></i>
                                                                    <span>Not provided</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-4 mb-3">
                                                            {company?.socialMedia?.twitter ? (
                                                                <a
                                                                    href={`https://twitter.com/${company.socialMedia.twitter}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-flex align-items-center text-decoration-none"
                                                                >
                                                                    <i className="ti ti-brand-twitter me-2 text-info" style={{ fontSize: '1.5rem' }}></i>
                                                                    <span>Twitter</span>
                                                                </a>
                                                            ) : (
                                                                <div className="d-flex align-items-center text-muted">
                                                                    <i className="ti ti-brand-twitter me-2" style={{ fontSize: '1.5rem' }}></i>
                                                                    <span>Not provided</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-4 mb-3">
                                                            {company?.socialMedia?.facebook ? (
                                                                <a
                                                                    href={`https://facebook.com/${company.socialMedia.facebook}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-flex align-items-center text-decoration-none"
                                                                >
                                                                    <i className="ti ti-brand-facebook me-2 text-primary" style={{ fontSize: '1.5rem' }}></i>
                                                                    <span>Facebook</span>
                                                                </a>
                                                            ) : (
                                                                <div className="d-flex align-items-center text-muted">
                                                                    <i className="ti ti-brand-facebook me-2" style={{ fontSize: '1.5rem' }}></i>
                                                                    <span>Not provided</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form >
                </div >
            </div >

            <PasswordCheck
                show={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onVerify={handlePasswordVerify}
            />
        </>
    );
};

export default CompanyProfile;