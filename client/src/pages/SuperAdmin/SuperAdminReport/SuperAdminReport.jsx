import { useSuperAdminContext } from '../../../context/superadmin-context';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaUser, FaBuilding, FaChalkboardTeacher, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import axios from "axios";
import { useAuthContext } from '../../../context/auth-context';
import toast from 'react-hot-toast';

const SuperAdminReport = () => {
    const { isLoading, getReportOfInterview, report: reportData } = useSuperAdminContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { server, token, createNotification } = useAuthContext()

    // Get ID from location state or URL parameters
    const { id } = location.state || {};
    const interviewId = id || new URLSearchParams(location.search).get('id');

    // console.log("Interview ID:", interviewId);
    // console.log("Report:", reportData);

    useEffect(() => {
        if (interviewId) {
            const fetchReport = async () => {
                try {
                    await getReportOfInterview(interviewId);
                } catch (err) {
                    setError("Failed to fetch report. Please try again.");
                    console.error("Error fetching report:", err);
                }
            };

            fetchReport();
        } else {
            setError("No interview ID provided. Please go back and select a valid interview.");
        }
    }, [interviewId]);

    const handleBackToList = () => {
        navigate(-1); // Go back to previous page
    };

    // Handle loading state
    if (isLoading) {
        return (
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="d-flex justify-content-center align-items-center vh-100">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                    <button onClick={handleBackToList} className="btn btn-sm btn-outline-primary">
                        ← Back to List
                    </button>
                </div>
            </div>
        );
    }

    // Handle missing report data
    if (!reportData || Object.keys(reportData).length === 0) {
        return (
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="alert alert-warning">
                        No report data available. This might be because:
                        <ul className="mt-2">
                            <li>The interview hasn't been completed yet</li>
                            <li>The report is still being generated</li>
                            <li>There was an issue retrieving the report</li>
                        </ul>
                    </div>
                    <button onClick={handleBackToList} className="btn btn-sm btn-outline-primary">
                        ← Back to List
                    </button>
                </div>
            </div>
        );
    }

    // Get recommendation badge color
    const getRecommendationBadge = (recommendation) => {
        if (recommendation.includes('Recommended')) {
            return 'success';
        } else if (recommendation.includes('Not Recommended')) {
            return 'danger';
        } else {
            return 'warning';
        }
    };

    // Get rating badge color
    const getRatingBadge = (rating) => {
        if (rating >= 4) return 'success';
        if (rating >= 3) return 'warning';
        return 'danger';
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "No date provided";
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleVideo = () => {
        if (reportData?.url?.key) {
            navigate(`/superadmin/recording-video/${encodeURIComponent(reportData.url.key)}`);
        } else {
            console.error("Video key not found in reportData");
        }
    };

    const handleExport = () => {
        const element = document.getElementById('print-area'); // the report container
        const options = {
            margin: 10,
            filename: `${reportData?.candidateName || 'report'}-${reportData?.interviewId || 'id'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 }, // improves resolution
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(options).from(element).save();
    };

    const handleSend = async () => {
        setLoading(true)
        try {
            const res = await axios.post(`${server}/api/v1/interviews/sendReport`,
                { interviewId: reportData?.interviewId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data?.message) {
                toast.success(res.data.message);
            } else {
                toast.success("Report sent to company successfully.");
            }

            createNotification(reportData?.companyId, "REPORT_RECEIVED", `The assessment report for ${reportData?.candidateName} has been received.`)

        } catch (error) {
            // console.error("Error sending report:", error);

            // backend error message if available
            const errorMsg =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to send report. Please try again.";

            toast.error(errorMsg);
        }
        finally {
            setLoading(false)
        }
    };

    return (
        <div className="container-fluid">
            <div className="container">
                {/* Header Section */}
                <div className="d-flex justify-content-between flex-md-row gap-4 gap-md-0 flex-column align-items-center mb-4">
                    <div>
                        <h1 className="h3 mb-0 text-gray-800">Interview Detailed Report</h1>
                        <p className="mb-0 text-muted">Comprehensive analysis of interview performance</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-primary btn-sm" onClick={handleExport}>
                            <i className="bi bi-download me-1 me-md-2"></i>
                            <span className="d-none d-sm-inline">Export </span>Report
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={handleSend} disabled={loading}>
                            <i className="bi bi-send me-1 me-md-2"></i>
                            <span className="d-none d-sm-inline">Send </span>Report
                        </button>
                        <button className="btn btn-outline-secondary btn-sm" onClick={handleVideo}>
                            <i className="bi bi-camera-video me-1 me-md-2"></i><span className="d-none d-sm-inline">Watch </span>Recording
                        </button>
                    </div>
                </div>

                <div id="print-area" className="main">

                    {/* Interview Overview Card */}
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Interview Overview</h5>
                            <span className={`badge bg-${getRecommendationBadge(reportData.overallRecommendation)} fs-6`}>
                                {reportData.overallRecommendation}
                            </span>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <table className="table table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <td className="text-muted fw-bold">Interview ID</td>
                                                <td>{reportData.interviewId}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted fw-bold">Candidate</td>
                                                <td>{reportData.candidateName} ({reportData.candidateEmail})</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted fw-bold">Position</td>
                                                <td>{reportData.positionTitle}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted fw-bold">Interview Type</td>
                                                <td className="text-capitalize">{reportData.interviewType}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-6">
                                    <table className="table table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <td className="text-muted fw-bold">Date & Time</td>
                                                <td>{formatDate(reportData.interviewDate)}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted fw-bold">Duration</td>
                                                <td>{reportData.duration} minutes</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted fw-bold">Questions</td>
                                                <td>{reportData.questionsAnswered}/{reportData.totalQuestions} answered</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted fw-bold">Overall Score</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="progress me-2" style={{ width: '100px' }}>
                                                            <div
                                                                className="progress-bar"
                                                                role="progressbar"
                                                                style={{ width: `${reportData.overallScore * 10}%` }}
                                                                aria-valuenow={reportData.overallScore * 10}
                                                                aria-valuemin="0"
                                                                aria-valuemax="100"
                                                            ></div>
                                                        </div>
                                                        <span>{reportData.overallScore}/10</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        {/* Company Information */}
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-header bg-info text-white">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <FaBuilding className="me-2" /> Company Information
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <img
                                            src={reportData?.companyProfile?.profilePicture}
                                            alt="Company Logo"
                                            className="rounded me-3"
                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <h6 className="mb-0">{reportData?.companyProfile?.fullname}</h6>
                                            <small className="text-muted">{reportData?.companyProfile?.industry}</small>
                                        </div>
                                    </div>
                                    <ul className="list-group list-group-flush small">
                                        <li className="list-group-item px-0">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Size:</span>
                                                <span>{reportData?.companyProfile?.companySize}</span>
                                            </div>
                                        </li>
                                        <li className="list-group-item px-0">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Headquarters:</span>
                                                <span>{reportData?.companyProfile?.headquarters}</span>
                                            </div>
                                        </li>
                                        <li className="list-group-item px-0">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Website:</span>
                                                <a href={reportData?.companyProfile?.website} target="_blank" rel="noopener noreferrer">
                                                    {reportData?.companyProfile?.website}
                                                </a>
                                            </div>
                                        </li>
                                        <li className="list-group-item px-0">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Contact:</span>
                                                <span>{reportData?.companyProfile?.contactEmail}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Interviewer Information */}
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-header bg-warning text-dark">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <FaChalkboardTeacher className="me-2" /> Interviewer Information
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <img
                                            src={reportData?.interviewerProfile?.profilePicture}
                                            alt="Interviewer"
                                            className="rounded-circle me-3"
                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <h6 className="mb-0">{reportData?.interviewerProfile?.fullname}</h6>
                                            <small className="text-muted">{reportData?.interviewerProfile?.headline}</small>
                                        </div>
                                    </div>
                                    <ul className="list-group list-group-flush small">
                                        <li className="list-group-item px-0">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Experience:</span>
                                                <span>{reportData?.interviewerProfile?.yearsOfExperience} years</span>
                                            </div>
                                        </li>
                                        <li className="list-group-item px-0">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Location:</span>
                                                <span>{reportData?.interviewerProfile?.location}</span>
                                            </div>
                                        </li>
                                        <li className="list-group-item px-0">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Email:</span>
                                                <span>{reportData?.interviewerProfile?.email}</span>
                                            </div>
                                        </li>
                                        <li className="list-group-item px-0">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Phone:</span>
                                                <span>{reportData?.interviewerProfile?.phone}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Candidate Information */}
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-header bg-success text-white">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <FaUser className="me-2" /> Candidate Information
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                                            style={{ width: '60px', height: '60px' }}>
                                            <FaUser className="text-secondary fs-4" />
                                        </div>
                                        <div>
                                            <h6 className="mb-0">{reportData?.candidateName}</h6>
                                            <small className="text-muted">{reportData?.candidateEmail}</small>
                                        </div>
                                    </div>
                                    <ul className="list-group list-group-flush small">
                                        <li className="list-group-item px-0">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Position:</span>
                                                <span>{reportData?.positionTitle}</span>
                                            </div>
                                        </li>
                                        <li className="list-group-item px-0">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Interview Date:</span>
                                                <span>{formatDate(reportData?.interviewDate).split(',')[0]}</span>
                                            </div>
                                        </li>
                                        <li className="list-group-item px-0">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Interview Type:</span>
                                                <span className="text-capitalize">{reportData?.interviewType}</span>
                                            </div>
                                        </li>
                                        <li className="list-group-item px-0">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Overall Score:</span>
                                                <span className={`badge bg-${getRatingBadge(reportData?.overallScore)} fs-6`}>
                                                    {reportData?.overallScore}/10
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skills Assessment */}
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Skills Assessment</h5>
                        </div>
                        <div className="card-body">
                            {reportData?.skills?.map((skill, index) => (
                                <div key={index} className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="fw-bold">{skill?.name}</span>
                                        <span>{skill?.score}/10 ({skill?.percentage}%)</span>
                                    </div>
                                    <div className="progress">
                                        <div
                                            className="progress-bar bg-success"
                                            role="progressbar"
                                            style={{ width: `${skill?.percentage}%` }}
                                            aria-valuenow={skill?.percentage}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Code Tasks */}
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0 small">Code Tasks</h5>
                        </div>
                        <div className="card-body">
                            {reportData?.codeTask?.map((task, index) => (
                                <div key={index} className="mb-4 border rounded p-3">
                                    <h6 className="text-primary mb-2 small">Question {index + 1}: {task.question}</h6>
                                    <div className="mb-2">
                                        <span className="text-muted small me-2">Language:</span>
                                        <span className="badge bg-secondary small">{task.language}</span>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-muted small me-2">Code:</span>
                                        <pre className="bg-light p-2 rounded small">{task.code}</pre>
                                    </div>
                                    <div>
                                        <span className="text-muted small me-2">Result:</span>
                                        <span className={task.result.includes("Error") ? "text-danger small" : "text-success small"}>
                                            {task.result}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Code Evaluation */}
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Code Evaluation</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="text-success mb-3">Positive Points</h6>
                                    {reportData?.codeEvaluation?.filter(item => item.type === 'positive')
                                        .map((item, index) => (
                                            <div key={index} className="mb-2 ps-3 border-start border-success border-3">
                                                {item.points.map((point, i) => (
                                                    <div key={i} className="mb-1">
                                                        <FaCheckCircle className="text-success me-2" />
                                                        {point}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                </div>
                                <div className="col-md-6">
                                    <h6 className="text-warning mb-3">Areas for Improvement</h6>
                                    {reportData?.codeEvaluation?.filter(item => item.type === 'improvement')
                                        .map((item, index) => (
                                            <div key={index} className="mb-2 ps-3 border-start border-warning border-3">
                                                {item.points.map((point, i) => (
                                                    <div key={i} className="mb-1">
                                                        <FaExclamationTriangle className="text-warning me-2" />
                                                        {point}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Feedback */}
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Detailed Feedback</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="mb-3">Technical Skills</h6>
                                    <ul className="list-group list-group-flush small">
                                        {reportData?.feedback?.technicalSkills?.map((skill, index) => (
                                            <li key={index} className="list-group-item px-0">
                                                {skill?.includes('Lacks') || skill.includes('Weak') ? (
                                                    <><FaTimesCircle className="text-danger me-2" />{skill}</>
                                                ) : (
                                                    <><FaCheckCircle className="text-success me-2" />{skill}</>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    <h6 className="mb-3 mt-4">Communication Skills</h6>
                                    <ul className="list-group list-group-flush small">
                                        {reportData?.feedback?.communicationSkills?.map((skill, index) => (
                                            <li key={index} className="list-group-item px-0">
                                                {skill.includes('Lacks') || skill?.includes('Hesitant') ? (
                                                    <><FaTimesCircle className="text-danger me-2" />{skill}</>
                                                ) : (
                                                    <><FaCheckCircle className="text-success me-2" />{skill}</>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-2">
                                        <span className="fw-bold me-2">Rating:</span>
                                        <span className={`badge bg-${getRatingBadge(reportData?.feedback?.communicationRating)}`}>
                                            {reportData?.feedback?.communicationRating}/5
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="mb-3">Behavioral Skills</h6>
                                    <ul className="list-group list-group-flush small">
                                        {reportData?.feedback?.behavioralSkills?.map((skill, index) => (
                                            <li key={index} className="list-group-item px-0">
                                                {skill?.includes('Lacks') || skill.includes('Lacked') ? (
                                                    <><FaTimesCircle className="text-danger me-2" />{skill}</>
                                                ) : (
                                                    <><FaCheckCircle className="text-success me-2" />{skill}</>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-2">
                                        <span className="fw-bold me-2">Rating:</span>
                                        <span className={`badge bg-${getRatingBadge(reportData?.feedback?.behavioralRating)}`}>
                                            {reportData?.feedback?.behavioralRating}/5
                                        </span>
                                    </div>
                                    <h6 className="mb-3 mt-4">Job Specific Competencies</h6>
                                    <ul className="list-group list-group-flush small">
                                        {reportData?.feedback?.jobSpecificCompetencies?.map((skill, index) => (
                                            <li key={index} className="list-group-item px-0">
                                                {skill?.includes('Lacks') ? (
                                                    <><FaTimesCircle className="text-danger me-2" />{skill}</>
                                                ) : (
                                                    <><FaCheckCircle className="text-success me-2" />{skill}</>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interviewer Summary */}
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Interviewer Summary</h5>
                        </div>
                        <div className="card-body">
                            <p>{reportData?.interviewerSummary}</p>
                        </div>
                    </div>

                    {/* Video Link */}
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0 small">Recording Link</h5>
                        </div>
                        <div className="card-body">
                            <a href={`/superadmin/recording-video/${encodeURIComponent(reportData.url.key)}`} className="small">{reportData.url.key}</a>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="text-center text-muted small py-3">
                        <p className="mb-0">Report generated on {formatDate(new Date())}</p>
                        <p className="mb-0">Interview ID: {reportData?.interviewId} | Submitted: {formatDate(reportData?.submittedAt)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminReport;