// import { useEffect, useState } from 'react';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useAuthContext } from '../../../context/auth-context';
// import { Link } from 'react-router-dom';

// const getProgressColor = (percentage) => {
//     if (percentage < 30) return '#ff4d4f';  // Red
//     if (percentage < 60) return '#faad14';  // Yellow
//     if (percentage < 90) return '#1890ff';  // Blue
//     return '#52c41a';  // Green
// };

// const getSmoothProgressColor = (percentage) => {
//     const hue = (percentage / 100) * 120;
//     return `hsl(${hue}, 100%, 50%)`;
// };

// const UserProfileCompletion = () => {
//     const { server, token } = useAuthContext();
//     const [completion, setCompletion] = useState({
//         percentage: 0,
//         details: {},
//         missingFields: [],
//         loading: true
//     });

//     useEffect(() => {
//         const fetchCompletion = async () => {
//             try {
//                 const response = await axios.get(`${server}/api/v1/candidateDashboard/user-profile/completion`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setCompletion({
//                     percentage: response.data.completionPercentage || 0,
//                     details: response.data.breakdown || {},
//                     missingFields: response.data.missingFields || [],
//                     loading: false
//                 });
//             } catch (error) {
//                 toast.error('Failed to load profile completion');
//                 setCompletion(prev => ({
//                     ...prev,
//                     details: {},
//                     missingFields: [],
//                     loading: false
//                 }));
//             }
//         };

//         fetchCompletion();
//     }, []);

//     const getCompletionMessage = (percentage) => {
//         if (percentage < 30) return "Your profile is just getting started. Complete more sections to improve your visibility.";
//         if (percentage < 70) return "Good progress! Keep going to make your profile stand out to recruiters.";
//         if (percentage < 90) return "Almost there! Just a few more details needed for a complete profile.";
//         return "Excellent! Your profile is complete and looking great to employers.";
//     };

//     const getFieldStatus = (value) => {
//         if (value === 0) return { icon: 'times', class: 'text-danger' };
//         if (value < 5) return { icon: 'check', class: 'text-warning' };
//         return { icon: 'check', class: 'text-success' };
//     };

//     if (completion.loading) {
//         return (
//             <div className="text-center py-4">
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="mt-2 text-muted">Loading profile completion...</p>
//             </div>
//         );
//     }

//     // Safely get entries from details object
//     const detailEntries = completion.details ? Object.entries(completion.details) : [];

//     return (
//         <div className="card shadow-sm mb-4 border-0" style={{ borderRadius: '12px', border: '1px solid #e0e0e0' }}>
//             <div className="card-body p-4">
//                 <div className="row align-items-center">
//                     <div className="col-md-4 text-center mb-4 mb-md-0">
//                         <div style={{ width: 140, height: 140, margin: '0 auto' }}>
//                             <CircularProgressbar
//                                 value={completion.percentage}
//                                 text={`${completion.percentage}%`}
//                                 styles={buildStyles({
//                                     textColor: '#2e3a59',
//                                     trailColor: '#f8f9fa',
//                                     textSize: '20px',
//                                     pathTransitionDuration: 1,
//                                     pathColor: getSmoothProgressColor(completion.percentage),
//                                     // pathColor: getProgressColor(completion.percentage),
//                                 })}
//                             />
//                         </div>
//                         <div className="mt-3">
//                             <span className={`badge ${completion.percentage === 100 ? 'bg-success' : 'bg-primary'} py-2 px-3`}>
//                                 {completion.percentage === 100 ? 'Profile Complete' : 'Completion In Progress'}
//                             </span>
//                         </div>
//                     </div>
//                     <div className="col-md-8">
//                         <h4 className="card-title fw-semibold text-dark mb-3">Profile Completion Status</h4>
//                         <p className="text-muted mb-3">
//                             {getCompletionMessage(completion.percentage)}
//                         </p>

//                         <div className="progress mb-4" style={{ height: '8px', borderRadius: '4px' }}>
//                             <div
//                                 className={`progress-bar ${completion.percentage === 100 ? 'bg-success' : 'bg-gradient-primary'}`}
//                                 role="progressbar"
//                                 style={{ width: `${completion.percentage}%`, borderRadius: '4px' }}
//                                 aria-valuenow={completion.percentage}
//                                 aria-valuemin="0"
//                                 aria-valuemax="100"
//                             ></div>
//                         </div>

//                         {detailEntries.length > 0 ? (
//                             <div className="row g-3">
//                                 {detailEntries.map(([field, value]) => {
//                                     const status = getFieldStatus(value);
//                                     return (
//                                         <div key={field} className="col-md-6">
//                                             <div className="d-flex align-items-center">
//                                                 <i className={`fas fa-${status.icon} me-2 ${status.class}`}></i>
//                                                 <span className="text-dark small">{field}</span>
//                                                 <span className="ms-auto fw-semibold" style={{ color: '#4e73df' }}>
//                                                     {value} pts
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         ) : (
//                             <div className="alert alert-info mb-4">
//                                 <i className="fas fa-info-circle me-2"></i>
//                                 No profile completion details available.
//                             </div>
//                         )}

//                         <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-4">
//                             {completion.percentage !== 100 && (
//                                 <Link
//                                     to="/user/profile"
//                                     className="btn btn-primary px-4 py-2 mb-3 mb-md-0"
//                                     style={{ borderRadius: '6px' }}
//                                 >
//                                     <i className="fas fa-user-edit me-2"></i>
//                                     Complete Your Profile
//                                 </Link>
//                             )}

//                             {completion.missingFields && completion.missingFields.length > 0 && (
//                                 <div className="text-md-end">
//                                     <small className="text-muted d-block mb-1">Recommended sections to complete:</small>
//                                     <div className="d-flex flex-wrap gap-2 justify-content-md-end">
//                                         {completion.missingFields.map((section, index) => (
//                                             <span
//                                                 key={index}
//                                                 className="badge bg-light text-dark border px-3 py-1"
//                                                 style={{ borderRadius: '12px', fontSize: '0.75rem' }}
//                                             >
//                                                 {section}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserProfileCompletion;














import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/auth-context";
import { Link } from "react-router-dom";

// Smooth color gradient
const getSmoothProgressColor = (percentage) => {
    const hue = (percentage / 100) * 120;
    return `hsl(${hue}, 100%, 45%)`;
};

// Icons
const IconCheck = () => (
    <svg width="18" height="18" fill="green">
        <path d="M6.1 11.7L3 8.6l-1.4 1.4 4.5 4.5L17 3.6 15.6 2z" />
    </svg>
);

const IconCross = () => (
    <svg width="18" height="18" fill="red">
        <path d="M14 4.4L12.6 3 9 6.6 5.4 3 4 4.4 7.6 8 4 11.6 5.4 13 9 9.4l3.6 3.6 1.4-1.4L10.4 8z" />
    </svg>
);

const IconAlert = () => (
    <svg width="18" height="18" fill="orange">
        <circle cx="9" cy="9" r="8" stroke="orange" fill="none" />
        <rect x="8" y="4" width="2" height="6" fill="orange" />
        <rect x="8" y="11" width="2" height="2" fill="orange" />
    </svg>
);

const IconPlus = () => (
    <svg width="14" height="14" fill="gray">
        <path d="M6 0h2v6h6v2H8v6H6V8H0V6h6z" />
    </svg>
);

const UserProfileCompletion = () => {
    const { server, token } = useAuthContext();

    const [completion, setCompletion] = useState({
        percentage: 0,
        details: {},
        missingFields: [],
        loading: true,
    });

    useEffect(() => {
        const fetchCompletion = async () => {
            try {
                const response = await axios.get(`${server}/api/v1/candidateDashboard/user-profile/completion`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setCompletion({
                    percentage: response.data.completionPercentage || 0,
                    details: response.data.breakdown || {},
                    missingFields: response.data.missingFields || [],
                    loading: false,
                });
            } catch (error) {
                toast.error("Failed to load profile completion");
                setCompletion((prev) => ({
                    ...prev,
                    details: {},
                    missingFields: [],
                    loading: false,
                }));
            }
        };

        fetchCompletion();
    }, []);

    console.log(completion);


    const getCompletionMessage = (percentage) => {
        if (percentage < 30)
            return "Your profile is just getting started. Complete more sections.";
        if (percentage < 70) return "Good progress! Keep building your profile.";
        if (percentage < 90) return "Almost done! A few more details needed.";
        return "Excellent! Your profile is complete.";
    };

    const detailEntries = completion.details
        ? Object.entries(completion.details)
        : [];

    if (completion.loading) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Loading profile completion...</p>
            </div>
        );
    }

    return (
        <div className="card shadow-sm border-0 rounded-4">

            {/* Header */}
            <div className="card-header bg-primary text-white rounded-top-4 py-3 d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="mb-0 fw-bold">Profile Completion</h5>
                    <small className="opacity-75">Build your best profile</small>
                </div>

                <span className="badge bg-light text-primary fw-semibold rounded-pill px-3 py-2">
                    {completion.percentage}%
                </span>
            </div>

            {/* Body */}
            <div className="card-body">
                <div className="row g-4 align-items-center">

                    {/* Progress Chart */}
                    <div className="col-md-4 text-center">
                        <div className="mx-auto" style={{ width: "150px", height: "150px" }}>
                            <CircularProgressbar
                                value={completion.percentage}
                                text={`${completion.percentage}%`}
                                styles={buildStyles({
                                    textColor: "#000",
                                    trailColor: "#e9ecef",
                                    pathColor: getSmoothProgressColor(completion.percentage),
                                })}
                            />
                        </div>

                        <h6 className="fw-bold mt-3">
                            {completion.percentage === 100 ? "Complete!" : "In Progress"}
                        </h6>

                        <small className="text-muted">
                            {getCompletionMessage(completion.percentage)}
                        </small>
                    </div>

                    {/* Details Section */}
                    <div className="col-md-8">

                        {/* Score Bar */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between small fw-bold text-secondary mb-1">
                                <span>Overall Score</span>
                                <span>{completion.percentage}/100</span>
                            </div>

                            <div className="progress" style={{ height: "8px" }}>
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${completion.percentage}%`,
                                        backgroundColor: getSmoothProgressColor(completion.percentage),
                                        borderRadius: "10px",
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Field Cards */}
                        {/* <div className="row g-3 mb-4">
                            {detailEntries.map(([field, value]) => {
                                let border = "border-light";
                                let icon = <IconCheck />;
                                let textColor = "text-secondary";

                                if (value === 0) {
                                    border = "border-danger";
                                    icon = <IconCross />;
                                    textColor = "text-danger";
                                } else if (value < 5) {
                                    border = "border-warning";
                                    icon = <IconAlert />;
                                }

                                return (
                                    <div key={field} className="col-sm-6 col-lg-4">
                                        <div className={`d-flex align-items-center p-3 rounded-3 border ${border} bg-white shadow-sm`}>
                                            <div className="me-3">{icon}</div>
                                            <div>
                                                <div className="fw-bold text-dark small">{field}</div>
                                                <div className={`small ${textColor}`}>
                                                    {value === 0 ? "Incomplete" : `${value}/5 Points`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div> */}

                        {/* Field Status Cards */}
                        <div className="row g-3 mb-4">
                            {detailEntries.map(([fieldKey, value]) => {
                                const fieldMeta = {
                                    fullname: 3,
                                    email: 3,
                                    phone: 3,
                                    gender: 2,
                                    dob: 2,
                                    location: 1,
                                    headline: 1,
                                    profilePicture: 5,
                                    resume: 10,
                                    summary: 5,
                                    experience: 20,
                                    education: 15,
                                    skills: 10,
                                    certifications: 5,
                                    languages: 3,
                                    projects: 2,
                                    socialMedia: 10
                                };

                                const fieldLabels = {
                                    fullname: "Full Name",
                                    email: "Email",
                                    phone: "Phone",
                                    gender: "Gender",
                                    dob: "Date of Birth",
                                    location: "Location",
                                    headline: "Headline",
                                    profilePicture: "Profile Picture",
                                    resume: "Resume",
                                    summary: "Summary",
                                    experience: "Experience",
                                    education: "Education",
                                    skills: "Skills",
                                    certifications: "Certifications",
                                    languages: "Languages",
                                    projects: "Projects",
                                    socialMedia: "Social Media"
                                };

                                const totalWeight = fieldMeta[fieldKey] || 0;
                                const label = fieldLabels[fieldKey] || fieldKey;

                                let icon = <IconCheck />;
                                let border = "border-success";
                                let textColor = "text-success";

                                if (value === 0) {
                                    icon = <IconCross />;
                                    border = "border-danger";
                                    textColor = "text-danger";
                                } else if (value < totalWeight) {
                                    icon = <IconAlert />;
                                    border = "border-warning";
                                    textColor = "text-warning";
                                }

                                return (
                                    <div key={fieldKey} className="col-sm-6 col-lg-4">
                                        <div className={`d-flex align-items-center p-3 rounded-3 border ${border} bg-white shadow-sm`}>
                                            <div className="me-3">{icon}</div>
                                            <div>
                                                <div className="fw-bold text-dark small">{label}</div>
                                                <div className={`small ${textColor}`}>
                                                    {value === 0
                                                        ? "Incomplete"
                                                        : value < totalWeight
                                                            ? `Partial (${value}/${totalWeight} pts)`
                                                            : `Completed`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>


                        {/* Missing Fields */}
                        {completion.missingFields.length > 0 && (
                            <div className="p-3 bg-light border rounded-3 d-flex flex-column flex-sm-row align-items-start gap-2">
                                <span className="fw-semibold text-muted small text-uppercase">
                                    Recommended:
                                </span>

                                <div className="d-flex flex-wrap gap-2">
                                    {completion.missingFields.map((field, i) => (
                                        <Link to="/user/profile"
                                            key={i}
                                            className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1 px-3"
                                        >
                                            <IconPlus /> Add {field}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="card-footer bg-white text-muted small rounded-bottom-4">
                <div className="d-flex justify-content-between">
                    <span>Your profile score helps employers understand you better</span>
                    <span>Updated: {new Date().toLocaleDateString()}</span>
                </div>
            </div>

        </div>
    );
};

export default UserProfileCompletion;
