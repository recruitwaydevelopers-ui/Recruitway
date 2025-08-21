import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../../context/auth-context';

const getProgressColor = (percentage) => {
    if (percentage < 30) return '#ff4d4f';  // Red
    if (percentage < 60) return '#faad14';  // Yellow
    if (percentage < 90) return '#1890ff';  // Blue
    return '#52c41a';  // Green
};

const getSmoothProgressColor = (percentage) => {
    const hue = (percentage / 100) * 120;
    return `hsl(${hue}, 100%, 50%)`;
};

const InterviewerProfileCompletion = () => {
    const { server, token } = useAuthContext();
    const [completion, setCompletion] = useState({
        percentage: 0,
        details: {},
        missingFields: [],
        loading: true
    });

    useEffect(() => {
        const fetchCompletion = async () => {
            try {
                const response = await axios.get(`${server}/api/v1/interviewerDashboard/interviewer-profile/completion`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCompletion({
                    percentage: response.data.completionPercentage || 0,
                    details: response.data.breakdown || {},
                    missingFields: response.data.missingFields || [],
                    loading: false
                });
            } catch (error) {
                toast.error('Failed to load profile completion');
                setCompletion(prev => ({
                    ...prev,
                    details: {},
                    missingFields: [],
                    loading: false
                }));
            }
        };

        fetchCompletion();
    }, []);

    const getCompletionMessage = (percentage) => {
        if (percentage < 30) return "Your profile is just getting started. Complete more sections to improve your visibility.";
        if (percentage < 70) return "Good progress! Keep going to make your profile stand out to recruiters.";
        if (percentage < 90) return "Almost there! Just a few more details needed for a complete profile.";
        return "Excellent! Your profile is complete and looking great to employers.";
    };

    const getFieldStatus = (value) => {
        if (value === 0) return { icon: 'times', class: 'text-danger' };
        if (value < 5) return { icon: 'check', class: 'text-warning' };
        return { icon: 'check', class: 'text-success' };
    };

    if (completion.loading) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading profile completion...</p>
            </div>
        );
    }

    // Safely get entries from details object
    const detailEntries = completion.details ? Object.entries(completion.details) : [];


    console.log(detailEntries);
    

    return (
        <div className="card shadow-sm mb-4 border-0" style={{ borderRadius: '12px', border: '1px solid #e0e0e0' }}>
            <div className="card-body p-4">
                <div className="row align-items-center">
                    <div className="col-md-4 text-center mb-4 mb-md-0">
                        <div style={{ width: 140, height: 140, margin: '0 auto' }}>
                            <CircularProgressbar
                                value={completion.percentage}
                                text={`${completion.percentage}%`}
                                styles={buildStyles({
                                    textColor: '#2e3a59',
                                    trailColor: '#f8f9fa',
                                    textSize: '20px',
                                    pathTransitionDuration: 1,
                                    pathColor: getSmoothProgressColor(completion.percentage),
                                    // pathColor: getProgressColor(completion.percentage),
                                })}
                            />
                        </div>
                        <div className="mt-3">
                            <span className={`badge ${completion.percentage === 100 ? 'bg-success' : 'bg-primary'} py-2 px-3`}>
                                {completion.percentage === 100 ? 'Profile Complete' : 'Completion In Progress'}
                            </span>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <h4 className="card-title fw-semibold text-dark mb-3">Profile Completion Status</h4>
                        <p className="text-muted mb-3">
                            {getCompletionMessage(completion.percentage)}
                        </p>

                        <div className="progress mb-4" style={{ height: '8px', borderRadius: '4px' }}>
                            <div
                                className={`progress-bar ${completion.percentage === 100 ? 'bg-success' : 'bg-gradient-primary'}`}
                                role="progressbar"
                                style={{ width: `${completion.percentage}%`, borderRadius: '4px' }}
                                aria-valuenow={completion.percentage}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>

                        {detailEntries.length > 0 ? (
                            <div className="row g-3">
                                {detailEntries.map(([field, value]) => {
                                    const status = getFieldStatus(value);
                                    return (
                                        <div key={field} className="col-md-6">
                                            <div className="d-flex align-items-center">
                                                <i className={`fas fa-${status.icon} me-2 ${status.class}`}></i>
                                                <span className="text-dark small">{field}</span>
                                                <span className="ms-auto fw-semibold" style={{ color: '#4e73df' }}>
                                                    {value} pts
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="alert alert-info mb-4">
                                <i className="fas fa-info-circle me-2"></i>
                                No profile completion details available.
                            </div>
                        )}

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-4">
                            <a
                                href="/profile/edit"
                                className="btn btn-primary px-4 py-2 mb-3 mb-md-0"
                                style={{ borderRadius: '6px' }}
                            >
                                <i className="fas fa-user-edit me-2"></i>
                                Complete Your Profile
                            </a>

                            {completion.missingFields && completion.missingFields.length > 0 && (
                                <div className="text-md-end">
                                    <small className="text-muted d-block mb-1">Recommended sections to complete:</small>
                                    <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                                        {completion.missingFields.map((section, index) => (
                                            <span
                                                key={index}
                                                className="badge bg-light text-dark border px-3 py-1"
                                                style={{ borderRadius: '12px', fontSize: '0.75rem' }}
                                            >
                                                {section}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewerProfileCompletion;
