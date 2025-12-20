// import { useMemo } from "react";
// import { format } from "date-fns";

// const InterviewerRecentInterviews = ({ interviewsList }) => {
//     const interviews = useMemo(() => {
//         return interviewsList
//             .filter((intv) => intv.status === "completed")
//             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//             .slice(0, 10);
//     }, [interviewsList]);

//     const formatDate = (dateString) => {
//         return format(new Date(dateString), "MMM dd, yyyy hh:mm a");
//     };

//     const calculateDuration = (start, end) => {
//         return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60));
//     };

//     return (
//         <div className="card shadow h-100">
//             <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-primary text-white">
//                 <h6 className="m-0 font-weight-bold text-light">Recent Interviews</h6>
//                 <span className="badge bg-white text-primary rounded-pill">
//                     {interviews.length} {interviews.length === 1 ? 'Interview' : 'Interviews'}
//                 </span>
//             </div>

//             <div className="card-body p-0">
//                 {interviews.length === 0 ? (
//                     <div className="text-center py-5">
//                         <i className="fas fa-calendar-times fa-2x text-gray-300 mb-3"></i>
//                         <p className="text-muted">No recent interviews found</p>
//                     </div>
//                 ) : (
//                     <>
//                         {/* Desktop Table */}
//                         <div className="table-responsive d-none d-md-block">
//                             <table className="table table-hover mb-0">
//                                 <thead className="bg-light">
//                                     <tr>
//                                         <th className="ps-4">Candidate</th>
//                                         <th>Position</th>
//                                         <th>Interviewer</th>
//                                         <th>Date & Time</th>
//                                         <th>Duration</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {interviews.map((interview) => (
//                                         <tr key={interview._id}>
//                                             <td className="ps-4">
//                                                 <div className="d-flex align-items-center">
//                                                     <div className="avatar avatar-sm me-3 bg-light-primary rounded-circle d-flex align-items-center justify-content-center">
//                                                         <span className="text-primary fw-medium">
//                                                             {interview.candidateName.charAt(0)}
//                                                         </span>
//                                                     </div>
//                                                     <div>
//                                                         <h6 className="mb-0">{interview.candidateName}</h6>
//                                                         <small className="text-muted">{interview.companyName}</small>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <span className="fw-medium">{interview.jobTitle}</span>
//                                             </td>
//                                             <td>
//                                                 <span>{interview.interviewerName}</span>
//                                             </td>
//                                             <td>
//                                                 <span className="text-nowrap">{formatDate(interview.start)}</span>
//                                             </td>
//                                             <td>
//                                                 <span className="badge bg-light text-dark">
//                                                     {calculateDuration(interview.start, interview.end)} mins
//                                                 </span>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* Mobile Cards */}
//                         <div className="d-md-none">
//                             {interviews.map((interview) => (
//                                 <div key={interview._id} className="border-bottom p-3">
//                                     <div className="d-flex justify-content-between align-items-start mb-2">
//                                         <div className="d-flex align-items-center">
//                                             <div className="avatar avatar-sm me-3 bg-light-primary rounded-circle d-flex align-items-center justify-content-center">
//                                                 <span className="text-primary fw-medium">
//                                                     {interview.candidateName.charAt(0)}
//                                                 </span>
//                                             </div>
//                                             <div>
//                                                 <h6 className="mb-0">{interview.candidateName}</h6>
//                                                 <small className="text-muted">{interview.companyName}</small>
//                                             </div>
//                                         </div>
//                                         <span className="badge bg-light text-dark">
//                                             {calculateDuration(interview.start, interview.end)} mins
//                                         </span>
//                                     </div>

//                                     <div className="ms-4 ps-3">
//                                         <div className="mb-2">
//                                             <span className="fw-medium text-muted">Position: </span>
//                                             <span>{interview.jobTitle}</span>
//                                         </div>
//                                         <div className="mb-2">
//                                             <span className="fw-medium text-muted">Interviewer: </span>
//                                             <span>{interview.interviewerName}</span>
//                                         </div>
//                                         <div>
//                                             <span className="fw-medium text-muted">When: </span>
//                                             <span>{formatDate(interview.start)}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </>
//                 )}
//             </div>

//             <div className="card-footer bg-white text-muted small">
//                 Showing last {interviews.length} completed interviews. Updated: {format(new Date(), "MMM dd, yyyy hh:mm a")}
//             </div>
//         </div>
//     );
// };

// export default InterviewerRecentInterviews;





import { useMemo } from "react";
import { format, isValid } from "date-fns";

const THEME_START = "#4e73df";
const THEME_END = "#36b9cc";

const InterviewerRecentInterviews = ({ interviewsList = [] }) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return isValid(date)
            ? format(date, "MMM dd, yyyy hh:mm a")
            : "Invalid Date";
    };

    const calculateDuration = (start, end) => {
        const s = new Date(start);
        const e = new Date(end);
        return isValid(s) && isValid(e)
            ? Math.ceil((e - s) / (1000 * 60))
            : "—";
    };

    const interviews = useMemo(() => {
        return interviewsList
            .filter((intv) => intv.status === "completed")
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);
    }, [interviewsList]);

    return (
        <div className="col-12 mb-4 d-flex justify-content-center">
            <div
                className="card border-0 shadow-sm rounded-4 hover-card w-100"
                style={{ maxWidth: "1200px" }}
            >
                <div
                    className="card-header text-white rounded-top-4 d-flex align-items-center justify-content-between"
                    style={{
                        background: `linear-gradient(90deg, ${THEME_START}, ${THEME_END})`,
                    }}
                >
                    <div>
                        <h6 className="m-0 fw-semibold">
                            <i className="fas fa-history me-2"></i> Recent Interviews
                        </h6>
                        <small className="text-light opacity-75">
                            Completed interview sessions overview
                        </small>
                    </div>
                    <span className="badge bg-white text-primary rounded-pill px-3 py-1 fw-semibold">
                        {interviews.length}{" "}
                        {interviews.length === 1 ? "Interview" : "Interviews"}
                    </span>
                </div>

                <div className="card-body p-0">
                    {interviews.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fas fa-calendar-times fa-2x text-gray-400 mb-3"></i>
                            <div className="alert alert-info mx-3 shadow-sm">
                                No recent interviews found
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Desktop View */}
                            <div className="table-responsive d-none d-md-block">
                                <table className="table table-hover align-middle mb-0">
                                    <thead
                                        style={{
                                            background: "rgba(78,115,223,0.1)",
                                            color: "#374151",
                                        }}
                                    >
                                        <tr>
                                            <th className="ps-4">Candidate</th>
                                            <th>Position</th>
                                            <th>Interviewer</th>
                                            <th>Date & Time</th>
                                            <th>Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {interviews.map((interview) => {
                                            const name = interview.candidateName || "Unknown";
                                            const company = interview.companyName || "—";
                                            const job = interview.jobTitle || "N/A";
                                            const interviewer = interview.interviewerName || "N/A";

                                            return (
                                                <tr key={interview._id || Math.random()}>
                                                    <td className="ps-4">
                                                        <div className="d-flex align-items-center">
                                                            <div
                                                                className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                                                                style={{
                                                                    width: "42px",
                                                                    height: "42px",
                                                                    background:
                                                                        "linear-gradient(135deg, rgba(54,185,204,0.15), rgba(78,115,223,0.15))",
                                                                }}
                                                            >
                                                                <span
                                                                    className="fw-bold"
                                                                    style={{ color: THEME_START }}
                                                                >
                                                                    {name.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <h6 className="mb-0 fw-semibold text-dark">
                                                                    {name}
                                                                </h6>
                                                                <small className="text-muted">{company}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="fw-medium text-dark">{job}</td>
                                                    <td>{interviewer}</td>
                                                    <td className="text-nowrap">
                                                        {formatDate(interview.start)}
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-light text-dark fw-semibold">
                                                            {calculateDuration(interview.start, interview.end)}{" "}
                                                            mins
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="d-md-none">
                                {interviews.map((interview) => (
                                    <div
                                        key={interview._id || Math.random()}
                                        className="border-bottom p-3 hover-glow"
                                    >
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: "42px",
                                                        height: "42px",
                                                        background:
                                                            "linear-gradient(135deg, rgba(54,185,204,0.15), rgba(78,115,223,0.15))",
                                                    }}
                                                >
                                                    <span
                                                        className="fw-bold"
                                                        style={{ color: THEME_START }}
                                                    >
                                                        {(interview.candidateName || "U").charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 fw-semibold text-dark">
                                                        {interview.candidateName || "Unknown"}
                                                    </h6>
                                                    <small className="text-muted">
                                                        {interview.companyName || "—"}
                                                    </small>
                                                </div>
                                            </div>
                                            <span className="badge bg-light text-dark fw-semibold">
                                                {calculateDuration(interview.start, interview.end)} mins
                                            </span>
                                        </div>

                                        <div className="ms-4 ps-3 text-muted small">
                                            <div className="mb-1">
                                                <strong>Position:</strong> {interview.jobTitle || "N/A"}
                                            </div>
                                            <div className="mb-1">
                                                <strong>Interviewer:</strong>{" "}
                                                {interview.interviewerName || "N/A"}
                                            </div>
                                            <div>
                                                <strong>When:</strong> {formatDate(interview.start)}
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
                        <span>
                            Showing last {interviews.length} completed interviews
                        </span>
                        <span>Updated: {format(new Date(), "MMM dd, yyyy hh:mm a")}</span>
                    </div>
                </div>
            </div>

            <style>{`
        .hover-card {
          transition: all 0.25s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(78,115,223,0.15);
        }
        .hover-glow:hover {
          background: rgba(78,115,223,0.04);
          transition: background 0.2s ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default InterviewerRecentInterviews;