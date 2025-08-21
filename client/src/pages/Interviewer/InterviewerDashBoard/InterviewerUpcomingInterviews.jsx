import { useMemo } from "react";
import { format } from "date-fns";

const InterviewerUpcomingInterviews = ({ interviewsList }) => {
    const interviews = useMemo(() => {
        const now = new Date();
        return interviewsList
            .filter((intv) => {
                const startTime = new Date(intv.start);
                const isFuture = startTime > now;
                const hasValidStatus = intv.status === "scheduled" || intv.status === "inProcess";

                return isFuture && hasValidStatus;
            })
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 10);
    }, [interviewsList]);

    const calculateDuration = (start, end) => {
        return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60));
    };

    const formatDate = (dateString) => {
        return format(new Date(dateString), "MMM dd, yyyy hh:mm a");
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            scheduled: "bg-primary",
            completed: "bg-success",
            cancelled: "bg-danger",
            inProcess: "bg-warning text-dark"
        };
        return (
            <span className={`badge rounded-pill ${statusClasses[status] || 'bg-secondary'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="card shadow h-100">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-primary text-white">
                <div>
                    <h6 className="m-0 font-weight-bold text-light">Upcoming Interviews</h6>
                    <small className="text-light opacity-75">Scheduled and in-progress interviews</small>
                </div>
                <span className="badge bg-white text-primary rounded-pill">
                    {interviews.length} {interviews.length === 1 ? 'Interview' : 'Interviews'}
                </span>
            </div>

            <div className="card-body p-0">
                {interviews.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-calendar-check fa-2x text-gray-300 mb-3"></i>
                        <div className="alert alert-info mx-3">
                            No upcoming interviews scheduled
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="table-responsive d-none d-md-block">
                            <table className="table table-hover mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4">Candidate</th>
                                        <th>Position</th>
                                        <th>Interviewer</th>
                                        <th>Date & Time</th>
                                        <th>Duration</th>
                                        <th className="pe-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {interviews.map((interview) => (
                                        <tr key={interview._id}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar avatar-sm me-3 bg-light-primary rounded-circle d-flex align-items-center justify-content-center">
                                                        <span className="text-primary fw-medium">
                                                            {interview.candidateName.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-0">{interview.candidateName}</h6>
                                                        <small className="text-muted">{interview.companyName}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="fw-medium">{interview.jobTitle}</span>
                                            </td>
                                            <td>
                                                <span>{interview.interviewerName}</span>
                                            </td>
                                            <td>
                                                <span className="text-nowrap">{formatDate(interview.start)}</span>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark">
                                                    {calculateDuration(interview.start, interview.end)} mins
                                                </span>
                                            </td>
                                            <td className="pe-4">
                                                <div className="d-flex align-items-center gap-1">
                                                    {getStatusBadge(interview.status)}
                                                    {interview.isLinkSent && (
                                                        <span className="badge bg-info rounded-pill">Link Sent</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="d-md-none">
                            {interviews.map((interview) => (
                                <div key={interview._id} className="border-bottom p-3">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div className="d-flex align-items-center">
                                            <div className="avatar avatar-sm me-3 bg-light-primary rounded-circle d-flex align-items-center justify-content-center">
                                                <span className="text-primary fw-medium">
                                                    {interview.candidateName.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h6 className="mb-0">{interview.candidateName}</h6>
                                                <small className="text-muted">{interview.companyName}</small>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-1">
                                            {getStatusBadge(interview.status)}
                                            {interview.isLinkSent && (
                                                <span className="badge bg-info rounded-pill">Link Sent</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="ms-4 ps-3">
                                        <div className="mb-2">
                                            <span className="fw-medium text-muted">Position: </span>
                                            <span>{interview.jobTitle}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="fw-medium text-muted">Interviewer: </span>
                                            <span>{interview.interviewerName}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="fw-medium text-muted">When: </span>
                                            <span>{formatDate(interview.start)}</span>
                                        </div>
                                        <div>
                                            <span className="fw-medium text-muted">Duration: </span>
                                            <span>
                                                {calculateDuration(interview.start, interview.end)} minutes
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="card-footer bg-white text-muted small">
                <div className="d-flex justify-content-between align-items-center">
                    <span>Showing next {interviews.length} upcoming interviews</span>
                    <span>Updated: {format(new Date(), "MMM dd, yyyy hh:mm a")}</span>
                </div>
            </div>
        </div>
    );
};

export default InterviewerUpcomingInterviews;