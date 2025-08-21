import { useNavigate } from 'react-router-dom';
import { useCompanyContext } from '../../../context/company-context';
import formatDateToRelative from '../../../Helper/dateFormatter';
import { useAuthContext } from '../../../context/auth-context';

const NotificationsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext()
    const { isLoading, notifications, unreadCount, markAsRead } = useCompanyContext();

    if (isLoading && notifications.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center gap-2">
                <div className="spinner-border spinner-border-sm" role="status"></div>
                <span>Loading candidates...</span>
            </div>
        );
    }

    return (
        <>
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Notifications</h2>
                        <div className="d-flex gap-2">
                            {unreadCount > 0 && (
                                <button className='btn btn-primary btn-sm' onClick={() => markAsRead(user?.userId)}>
                                    Mark All as Read
                                </button>
                            )}
                            <button className='btn btn-outline-primary btn-sm' onClick={() => navigate(-1)}>
                                Back
                            </button>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header bg-light">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Your Notifications</h5>
                                {unreadCount > 0 && (
                                    <span className="badge bg-primary">
                                        {unreadCount} unread
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {notifications.length > 0 ? (
                                <>
                                    <div className="list-group list-group-flush">
                                        {notifications.map((notification) => (
                                            <button
                                                key={notification._id}
                                                type="button"
                                                className={`list-group-item list-group-item-action py-3 ${!notification.read ? 'bg-light bg-opacity-50' : ''}`}
                                            >
                                                <div className="d-flex gap-3">
                                                    <div className={`flex-shrink-0 rounded-circle p-2 ${notification.read ? 'bg-light' : 'bg-primary bg-opacity-10'}`}>
                                                        {notification.metadata?.applicantPhoto ? (
                                                            <img
                                                                src={notification.metadata.applicantPhoto}
                                                                alt={notification.metadata.applicantName}
                                                                className="rounded-circle"
                                                                width="40"
                                                                height="40"
                                                            />
                                                        ) : (
                                                            <i className={`bi bi-${notification.icon || 'bell'} fs-5 ${notification.read ? 'text-muted' : 'text-primary'}`}></i>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex justify-content-between align-items-start mb-1 gap-2">
                                                            <h6 className={`mb-0 fw-semibold ${notification.read ? 'text-muted' : 'text-dark'}`}>
                                                                {notification.title}
                                                            </h6>
                                                            <small className="text-muted">
                                                                {formatDateToRelative(notification.timestamp)}
                                                            </small>
                                                        </div>
                                                        <p className={`mb-0 ${notification.read ? 'text-muted' : ''}`}>
                                                            {notification.message}
                                                        </p>
                                                        {notification.metadata?.applicationId && (
                                                            <small className="text-primary mt-1 d-block">
                                                                Click to view application
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-5 px-4">
                                    <div className="bg-light rounded-circle p-4 d-inline-flex mb-3">
                                        <i className="bi bi-bell-slash fs-4 text-muted"></i>
                                    </div>
                                    <h6 className="text-muted mb-1">No notifications</h6>
                                    <p className="small text-muted mb-0">You're all caught up</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotificationsPage;