import { useState, useEffect } from "react";
import {
    FaLaptopCode,
    FaServer,
    FaLayerGroup,
    FaAndroid,
    FaApple,
    FaChartBar,
    FaCogs,
    FaPaintBrush,
    FaCheckSquare,
    FaClipboardList,
    FaSpinner,
    FaGlobeAmericas,
} from "react-icons/fa";
import axios from "axios";
import { useAuthContext } from "../../../context/auth-context";

const UserMockInterviewRequest = () => {
    const [selectedProfile, setSelectedProfile] = useState("Frontend");
    const [searchQuery, setSearchQuery] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [modalMessage, setModalMessage] = useState("");
    const [modalError, setModalError] = useState("");
    const [globalMessage, setGlobalMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTimezoneExpanded, setIsTimezoneExpanded] = useState(false);
    const [modalInstance, setModalInstance] = useState(null);

    const { server } = useAuthContext();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        profile: "Frontend",
        interviewDate: "",
        interviewTime: "",
        interviewerChoice: "",
        experienceLevel: "Mid-level",
        timezone: "",
        customInterviewer: "",
    });

    const commonTimezones = [
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "America/Toronto",
        "Europe/London",
        "Europe/Dublin",
        "Europe/Paris",
        "Europe/Berlin",
        "Asia/Tokyo",
        "Asia/Shanghai",
        "Asia/Kolkata",
        "Australia/Sydney",
        "Pacific/Auckland",
    ];

    useEffect(() => {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setFormData((prev) => ({ ...prev, timezone: userTimezone }));
    }, []);

    // Initialize modal instance
    useEffect(() => {
        const modalElement = document.getElementById('staticBackdrop');
        if (modalElement) {
            const instance = new bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });
            setModalInstance(instance);

            // Handle modal events
            const handleModalShow = () => {
                document.body.style.overflow = 'hidden';
                document.body.style.paddingRight = '0px';
            };

            const handleModalHide = () => {
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            };

            modalElement.addEventListener('show.bs.modal', handleModalShow);
            modalElement.addEventListener('hidden.bs.modal', handleModalHide);

            return () => {
                modalElement.removeEventListener('show.bs.modal', handleModalShow);
                modalElement.removeEventListener('hidden.bs.modal', handleModalHide);
                instance.dispose();
            };
        }
    }, []);

    const profiles = [
        { name: "Frontend", icon: <FaLaptopCode />, color: "text-primary" },
        { name: "Backend", icon: <FaServer />, color: "text-success" },
        { name: "Full Stack", icon: <FaLayerGroup />, color: "text-info" },
        { name: "Android", icon: <FaAndroid />, color: "text-success" },
        { name: "iOS", icon: <FaApple />, color: "text-secondary" },
        { name: "Data Science", icon: <FaChartBar />, color: "text-warning" },
        { name: "DevOps", icon: <FaCogs />, color: "text-danger" },
        { name: "UX/UI Design", icon: <FaPaintBrush />, color: "text-info" },
        { name: "QA Engineering", icon: <FaCheckSquare />, color: "text-warning" },
        { name: "Product Management", icon: <FaClipboardList />, color: "text-primary" },
    ];

    const timeSlots = [
        "9:00 AM - 11:00 AM",
        "11:00 AM - 1:00 PM",
        "1:00 PM - 3:00 PM",
        "3:00 PM - 5:00 PM",
        "5:00 PM - 7:00 PM",
    ];

    const experienceLevels = [
        "Entry-level",
        "Mid-level",
        "Senior",
        "Lead",
        "Principal",
    ];

    const interviewers = [
        "Google", "Microsoft", "Amazon", "Meta (Facebook)", "Apple",
        "Netflix", "Tesla", "IBM", "Intel", "Oracle", "Salesforce",
        "Adobe", "Spotify", "Airbnb", "Uber", "Lyft", "Stripe",
        "Shopify", "Twitter (X)", "Other",
    ];

    const filteredProfiles = profiles.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "name":
                if (!value.trim()) error = "Full name is required.";
                break;
            case "email":
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    error = "Invalid email format.";
                break;
            case "phone":
                if (!/^(\d{10}|\+\d{12})$/.test(value))
                    error = "Use 10 digits or + followed by 12 digits.";
                break;
            case "interviewDate":
                if (!value) error = "Interview date is required.";
                break;
            case "interviewTime":
                if (!value) error = "Please select a time slot.";
                break;
            case "interviewerChoice":
                if (!value) error = "Please select an interviewer.";
                break;
            case "customInterviewer":
                if (formData.interviewerChoice === "Other" && !value.trim())
                    error = "Please specify the interviewer.";
                break;
            case "timezone":
                if (!value) error = "Please select a timezone.";
                break;
            default:
                break;
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFieldErrors({ ...fieldErrors, [name]: validateField(name, value) });
    };

    const isFormValid = () => {
        const errors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) errors[key] = error;
        });
        return Object.keys(errors).length === 0;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setModalMessage("");
        setModalError("");
        setGlobalMessage("");
        setIsSubmitting(true);

        if (!isFormValid()) {
            setModalError("⚠️ Please fix the errors before submitting.");
            setIsSubmitting(false);
            return;
        }

        const submissionData = {
            ...formData,
            interviewer:
                formData.interviewerChoice === "Other"
                    ? formData.customInterviewer
                    : formData.interviewerChoice,
        };

        try {
            const response = await axios.post(`${server}/api/v1/mockRequest/createMockRequest`,
                submissionData
            );

            if (response.status === 201) {
                setGlobalMessage("✅ Interview scheduled successfully!");
                setModalMessage("✅ Interview scheduled successfully!");

                // Reset form data
                const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    profile: "Frontend",
                    interviewDate: "",
                    interviewTime: "",
                    interviewerChoice: "",
                    experienceLevel: "Mid-level",
                    timezone: userTimezone,
                    customInterviewer: "",
                });
                setFieldErrors({});

                if (modalInstance) {
                    modalInstance.hide();

                    // Wait for animation to finish, then clean up any leftover backdrop
                    setTimeout(() => {
                        const backdrops = document.querySelectorAll(".modal-backdrop");
                        backdrops.forEach((b) => b.remove());
                        document.body.classList.remove("modal-open");
                        document.body.style.removeProperty("padding-right");
                    }, 300); // Bootstrap default fade-out time
                }

                // Clear messages after delay
                setTimeout(() => {
                    setGlobalMessage("");
                    setModalMessage("");
                }, 3000);

            } else {
                setModalError(response.data.error || "⚠️ Something went wrong.");
            }
        } catch (error) {
            setModalError(
                error.response?.data?.error || "❌ Failed to submit. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTodayDate = () => new Date().toISOString().split("T")[0];
    const getMaxDate = () => {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek.toISOString().split("T")[0];
    };

    const formatTimezone = (tz) => {
        return tz.replace(/_/g, " ").replace(/\//g, " / ");
    };

    const openModal = () => {
        const modalElement = document.getElementById("staticBackdrop");
        const instance = bootstrap.Modal.getOrCreateInstance(modalElement);
        setModalInstance(instance);
        instance.show();
    };


    return (
        <div className="container-fluid bg-light min-vh-100">
            <div className="container py-4">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                                <div className="mb-3 mb-md-0">
                                    <h2 className="fw-bold mb-1">Schedule Mock Interview</h2>
                                    <p className="text-muted mb-0">Practice with industry experts from top tech companies</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {globalMessage && (
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                <div className="d-flex align-items-center">
                                    <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                                        <i className="ti ti-check text-success"></i>
                                    </div>
                                    <div>{globalMessage}</div>
                                </div>
                                <button type="button" className="btn-close" onClick={() => setGlobalMessage("")}></button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Section */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="row g-3">
                                <div className="col-md-8">
                                    <div className="position-relative">
                                        <input
                                            type="text"
                                            className="form-control ps-5"
                                            placeholder="Search for interview profiles..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <i className="ti ti-search position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
                                        {searchQuery && (
                                            <button
                                                className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted"
                                                onClick={() => setSearchQuery("")}
                                                style={{ textDecoration: "none" }}
                                            >
                                                <i className="ti ti-x"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        onClick={openModal}
                                    >
                                        <i className="ti ti-calendar-plus me-2"></i>
                                        Schedule Interview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Cards */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            {filteredProfiles.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="ti ti-search text-muted mb-3" style={{ fontSize: "3rem" }}></i>
                                    <h5 className="text-muted">No profiles found</h5>
                                    <p className="text-muted">Try adjusting your search criteria</p>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {filteredProfiles.map((p) => (
                                        <div key={p.name} className="col-6 col-md-4 col-lg-3">
                                            <div
                                                className={`card h-100 border-0 shadow-sm profile-card ${selectedProfile === p.name ? "active" : ""}`}
                                                onClick={() => {
                                                    setSelectedProfile(p.name);
                                                    setFormData({ ...formData, profile: p.name });
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <div className="card-body p-3 text-center">
                                                    <div className={`mb-2 ${p.color}`} style={{ fontSize: "2rem" }}>
                                                        {p.icon}
                                                    </div>
                                                    <h6 className="mb-0 fw-semibold">{p.name}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Selected Profile Info */}
                {selectedProfile && (<div className="row mb-4">
                    <div className="col-12">
                        <div className="bg-white rounded-3 shadow-sm p-4">
                            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                                <div className="d-flex align-items-center mb-3 mb-md-0">
                                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                        {profiles.find(p => p.name === selectedProfile)?.icon}
                                    </div>
                                    <div>
                                        <h5 className="mb-0 fw-semibold">{selectedProfile}</h5>
                                        <small className="text-muted">Selected Profile</small>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary w-md-auto"
                                    onClick={openModal}
                                >
                                    <i className="ti ti-calendar-plus me-2"></i>
                                    Schedule Interview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* Modal */}
                <div
                    className="modal fade"
                    id="staticBackdrop"
                    tabIndex="-1"
                    aria-hidden="true"
                    aria-labelledby="staticBackdropLabel"
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <form className="modal-content border-0 shadow-lg" onSubmit={handleFormSubmit}>
                            <div className="modal-header bg-primary text-white border-0">
                                <h5 className="modal-title fw-bold" id="staticBackdropLabel">
                                    Schedule Your Mock Interview
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    data-bs-dismiss="modal"
                                ></button>
                            </div>

                            <div className="modal-body p-4">
                                {modalMessage && (
                                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                                        <div className="d-flex align-items-center">
                                            <i className="ti ti-circle-check me-2"></i>
                                            {modalMessage}
                                        </div>
                                        <button type="button" className="btn-close" onClick={() => setModalMessage("")}></button>
                                    </div>
                                )}
                                {modalError && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        <div className="d-flex align-items-center">
                                            <i className="ti ti-alert-circle me-2"></i>
                                            {modalError}
                                        </div>
                                        <button type="button" className="btn-close" onClick={() => setModalError("")}></button>
                                    </div>
                                )}

                                {/* Timezone Section */}
                                <div className="card border-0 bg-light mb-4">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                                    <FaGlobeAmericas className="text-primary" />
                                                </div>
                                                <div>
                                                    <h6 className="mb-1 fw-bold">Your Timezone</h6>
                                                    <p className="mb-0 text-muted">{formatTimezone(formData.timezone)}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setIsTimezoneExpanded(!isTimezoneExpanded)}
                                            >
                                                {isTimezoneExpanded ? "Hide" : "Change"}
                                            </button>
                                        </div>

                                        {isTimezoneExpanded && (
                                            <div className="mt-3">
                                                <label htmlFor="timezone" className="form-label fw-semibold">
                                                    Select Timezone
                                                </label>
                                                <select
                                                    id="timezone"
                                                    name="timezone"
                                                    value={formData.timezone}
                                                    onChange={handleInputChange}
                                                    className={`form-select ${fieldErrors.timezone ? "is-invalid" : formData.timezone ? "is-valid" : ""}`}
                                                    required
                                                >
                                                    <option value="">Select timezone</option>
                                                    {commonTimezones.map(tz => (
                                                        <option key={tz} value={tz}>{formatTimezone(tz)}</option>
                                                    ))}
                                                </select>
                                                {fieldErrors.timezone && <div className="invalid-feedback">{fieldErrors.timezone}</div>}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`form-control ${fieldErrors.name ? "is-invalid" : formData.name ? "is-valid" : ""}`}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                        {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`form-control ${fieldErrors.email ? "is-invalid" : formData.email ? "is-valid" : ""}`}
                                            placeholder="your@email.com"
                                            required
                                        />
                                        {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`form-control ${fieldErrors.phone ? "is-invalid" : formData.phone ? "is-valid" : ""}`}
                                            placeholder="+1234567890"
                                            required
                                        />
                                        {fieldErrors.phone && <div className="invalid-feedback">{fieldErrors.phone}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Experience Level</label>
                                        <select
                                            name="experienceLevel"
                                            value={formData.experienceLevel}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        >
                                            {experienceLevels.map((level) => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Interview Profile</label>
                                        <select
                                            name="profile"
                                            value={formData.profile}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        >
                                            {profiles.map((profile) => (
                                                <option key={profile.name} value={profile.name}>{profile.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Select Interviewer</label>
                                        <select
                                            name="interviewerChoice"
                                            value={formData.interviewerChoice}
                                            onChange={handleInputChange}
                                            className={`form-control ${fieldErrors.interviewerChoice ? "is-invalid" : formData.interviewerChoice ? "is-valid" : ""}`}
                                            required
                                        >
                                            <option value="">Select interviewer</option>
                                            {interviewers.map((interviewer) => <option key={interviewer} value={interviewer}>{interviewer}</option>)}
                                        </select>
                                        {fieldErrors.interviewerChoice && <div className="invalid-feedback">{fieldErrors.interviewerChoice}</div>}
                                    </div>

                                    {formData.interviewerChoice === "Other" && (
                                        <div className="col-12">
                                            <label className="form-label fw-semibold">Specify Interviewer</label>
                                            <input
                                                type="text"
                                                name="customInterviewer"
                                                value={formData.customInterviewer}
                                                onChange={handleInputChange}
                                                className={`form-control ${fieldErrors.customInterviewer ? "is-invalid" : formData.customInterviewer ? "is-valid" : ""}`}
                                                placeholder="Enter interviewer name/company"
                                                required={formData.interviewerChoice === "Other"}
                                            />
                                            {fieldErrors.customInterviewer && <div className="invalid-feedback">{fieldErrors.customInterviewer}</div>}
                                        </div>
                                    )}

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Interview Date</label>
                                        <input
                                            type="date"
                                            name="interviewDate"
                                            value={formData.interviewDate}
                                            onChange={handleInputChange}
                                            min={getTodayDate()}
                                            max={getMaxDate()}
                                            className={`form-control ${fieldErrors.interviewDate ? "is-invalid" : formData.interviewDate ? "is-valid" : ""}`}
                                            required
                                        />
                                        {fieldErrors.interviewDate && <div className="invalid-feedback">{fieldErrors.interviewDate}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Interview Time</label>
                                        <select
                                            name="interviewTime"
                                            value={formData.interviewTime}
                                            onChange={handleInputChange}
                                            className={`form-control ${fieldErrors.interviewTime ? "is-invalid" : formData.interviewTime ? "is-valid" : ""}`}
                                            required
                                        >
                                            <option value="">Select a time slot</option>
                                            {timeSlots.map((time) => <option key={time} value={time}>{time}</option>)}
                                        </select>
                                        {fieldErrors.interviewTime && <div className="invalid-feedback">{fieldErrors.interviewTime}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer bg-light border-0">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!isFormValid() || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FaSpinner className="spinner-border spinner-border-sm me-2" />
                                            Scheduling...
                                        </>
                                    ) : (
                                        "Schedule Interview"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <style jsx>{`
          .profile-card {
            transition: all 0.2s ease;
            border-radius: 8px;
          }
          
          .profile-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
          }
          
          .profile-card.active {
            border: 2px solid #0d6efd;
            box-shadow: 0 4px 12px rgba(13, 110, 253, 0.15);
          }

          /* Prevent body scroll when modal is open */
          body.modal-open {
            overflow: hidden;
          }
        `}</style>
            </div>
        </div>
    );
};

export default UserMockInterviewRequest;

