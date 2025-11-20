import { useNavigate } from 'react-router-dom';
import formatDateToRelative from '../Helper/dateFormatter';
import { useAuthContext } from '../context/auth-context';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

const typeConfig = {
    JOB_APPLY: {
        title: 'Job Application Received',
        icon: 'file-earmark-person',
        color: 'primary',
        action: '/applications',
    },
    SHORTLIST: {
        title: 'Candidate Shortlisted',
        icon: 'check-circle',
        color: 'success',
        action: '/shortlisted',
    },
    INTERVIEW_SCHEDULED: {
        title: 'Interview Scheduled',
        icon: 'calendar-event',
        color: 'info',
        action: '/interviews',
    },
    REPORT_GENERATED: {
        title: 'Interview Report Generated',
        icon: 'file-earmark-text',
        color: 'warning',
        action: '/reports/generated',
    },
    REPORT_RECEIVED: {
        title: 'Report Received',
        icon: 'inbox',
        color: 'secondary',
        action: '/reports/received',
    },
    CV_RECEIVED: {
        title: 'CV Received',
        icon: 'person-lines-fill',
        color: 'dark',
        action: '/cv-received',
    },
    MOCK_REQUEST: {
        title: 'Mock Interview Request',
        icon: 'chat-dots',
        color: 'purple',
        action: '/mock-interviews',
    },
};

const NotificationsPage = () => {
    const navigate = useNavigate();
    const { user, server, token } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const getNotifications = async (id) => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await axios.get(
                `${server}/api/v1/notifications/getNotifications/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const { notifications } = response.data;
            setNotifications(notifications || []);
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    // const handleNotificationClick = (notification) => {
    //     const config = typeConfig[notification.type];
    //     if (config?.action) navigate(config.action);
    // };

    useEffect(() => {
        getNotifications(user?.userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (loading && notifications.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center gap-2 py-5">
                <div className="spinner-border spinner-border-sm" role="status"></div>
                <span>Loading notifications...</span>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Notifications</h2>
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                </div>

                <div className="card shadow-sm">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Your Notifications</h5>
                    </div>

                    <div className="card-body p-0">
                        {notifications.length > 0 ? (
                            <div className="list-group list-group-flush">
                                {notifications.map((notification) => {
                                    const config = typeConfig[notification.type] || {};
                                    return (
                                        <button
                                            key={notification._id}
                                            type="button"
                                            // onClick={() => handleNotificationClick(notification)}
                                            className={`list-group-item list-group-item-action py-3 ${!notification.isRead ? 'bg-light bg-opacity-50' : ''
                                                }`}
                                        >
                                            <div className="d-flex gap-3 align-items-start">
                                                <div
                                                    className={`flex-shrink-0 rounded-circle p-2 bg-${config.color || 'secondary'} bg-opacity-10`}
                                                >
                                                    <i
                                                        className={`bi bi-${config.icon || 'bell'} fs-5 text-${config.color || 'secondary'}`}
                                                    ></i>
                                                </div>

                                                <div className="flex-grow-1">
                                                    <div className="d-flex justify-content-between align-items-start mb-1 gap-2">
                                                        <h6
                                                            className={`mb-0 fw-semibold ${notification.isRead
                                                                ? 'text-muted'
                                                                : 'text-dark'
                                                                }`}
                                                        >
                                                            {config.title || 'Notification'}
                                                        </h6>
                                                        <small className="text-muted">
                                                            {formatDateToRelative(
                                                                notification.createdAt
                                                            )}
                                                        </small>
                                                    </div>

                                                    <p
                                                        className={`mb-0 ${notification.isRead ? 'text-muted' : ''
                                                            }`}
                                                    >
                                                        {notification.message}
                                                    </p>

                                                    {/* {config.action && (
                                                        <small className="text-primary mt-1 d-block">
                                                            Click to view details
                                                        </small>
                                                    )} */}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-5 px-4">
                                <div className="bg-light rounded-circle p-4 d-inline-flex mb-3">
                                    <i className="bi bi-bell-slash fs-4 text-muted"></i>
                                </div>
                                <h6 className="text-muted mb-1">No notifications</h6>
                                <p className="small text-muted mb-0">
                                    You're all caught up 🎉
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;

