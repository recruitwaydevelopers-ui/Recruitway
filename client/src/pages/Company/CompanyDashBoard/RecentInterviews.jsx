import { useMemo } from "react";
import { format } from "date-fns";

const RecentInterviews = ({ interviewsList }) => {
    const interviews = useMemo(() => {
        return interviewsList
            .filter((intv) => intv.status === "completed")
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);
    }, [interviewsList]);

    const formatDate = (dateString) => {
        return format(new Date(dateString), "MMM dd, yyyy hh:mm a");
    };

    const calculateDuration = (start, end) => {
        return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60));
    };

    return (
        <div className="card shadow h-100">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-primary text-white">
                <h6 className="m-0 font-weight-bold text-light">Recent Interviews</h6>
                <span className="badge bg-white text-primary rounded-pill">
                    {interviews.length} {interviews.length === 1 ? 'Interview' : 'Interviews'}
                </span>
            </div>

            <div className="card-body p-0">
                {interviews.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-calendar-times fa-2x text-gray-300 mb-3"></i>
                        <p className="text-muted">No recent interviews found</p>
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
                                        <span className="badge bg-light text-dark">
                                            {calculateDuration(interview.start, interview.end)} mins
                                        </span>
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
                                        <div>
                                            <span className="fw-medium text-muted">When: </span>
                                            <span>{formatDate(interview.start)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="card-footer bg-white text-muted small">
                Showing last {interviews.length} completed interviews. Updated: {format(new Date(), "MMM dd, yyyy hh:mm a")}
            </div>
        </div>
    );
};

export default RecentInterviews;