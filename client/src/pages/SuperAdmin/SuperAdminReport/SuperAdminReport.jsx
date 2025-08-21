// import { useSuperAdminContext } from '../../../context/superadmin-context';
// import { useLocation } from 'react-router-dom';
// import { useEffect } from 'react';

// const SuperAdminReport = () => {

//     const { isLoading, getReportOfInterview, report } = useSuperAdminContext();
//     const location = useLocation();
//     const { id } = location.state || {};

//     useEffect(() => {
//         getReportOfInterview(id)
//     }, [id])

//     console.log(id);
//     console.log(report);

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         });
//     };

//     const handleBackToList = () => {
//         setSelectedSummary(null);
//     };

//     if (isLoading) {
//         return (
//             <div className="container-fluid">
//                 <div className="container py-5">
//                     <div className="d-flex justify-content-center align-items-center vh-100">
//                         <div className="spinner-border text-primary" role="status">
//                             <span className="visually-hidden">Loading...</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container-fluid">
//             <div className="container py-3 py-md-4">
//                 <button onClick={handleBackToList} className="btn btn-sm btn-outline-primary mb-4">
//                     ← Back to List
//                 </button>

//                 <div className="row mb-4">
//                     <div className="col-12">
//                         <h1 className="fw-bold mb-3">Interview Summary</h1>
//                         <div className="card shadow-sm">
//                             <div className="card-body">
//                                 <div className="row">
//                                     <div className="col-md-6 mb-3 mb-md-0">
//                                         <h5 className="fw-bold">Candidate</h5>
//                                         <p className="mb-1"><strong>Name:</strong> {report?.interview.candidate.name}</p>
//                                         <p className="mb-0"><strong>Email:</strong> {report?.interview.candidate.email}</p>
//                                     </div>
//                                     <div className="col-md-6">
//                                         <h5 className="fw-bold">Position</h5>
//                                         <p className="mb-1"><strong>Title:</strong> {report?.interview.position.title}</p>
//                                         <p className="mb-0"><strong>Date:</strong> {formatDate(report?.interview.date)}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Overall Metrics */}
//                 <div className="row mb-4">
//                     <div className="col-md-4 mb-3 mb-md-0">
//                         <div className="card h-100 shadow-sm">
//                             <div className="card-body text-center">
//                                 <h3 className="fw-bold text-primary">{report?.overallScore}</h3>
//                                 <p className="mb-0">Overall Score</p>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-md-4 mb-3 mb-md-0">
//                         <div className="card h-100 shadow-sm">
//                             <div className="card-body text-center">
//                                 <h3 className="fw-bold text-primary">{report?.questionsAnswered}/{report?.totalQuestions}</h3>
//                                 <p className="mb-0">Questions Answered</p>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-md-4">
//                         <div className="card h-100 shadow-sm">
//                             <div className="card-body text-center">
//                                 <h3 className="fw-bold text-primary">{report?.duration} min</h3>
//                                 <p className="mb-0">Interview Duration</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Skills Assessment */}
//                 <div className="row mb-4">
//                     <div className="col-12">
//                         <div className="card shadow-sm">
//                             <div className="card-body">
//                                 <h4 className="fw-bold mb-3">Skills Assessment</h4>
//                                 <div className="row">
//                                     {report?.skillAssessmentsParsed.map((skill, index) => (
//                                         <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-3">
//                                             <div className="card h-100">
//                                                 <div className="card-body">
//                                                     <h6 className="fw-bold">{skill.name}</h6>
//                                                     <div className="progress mb-2" style={{ height: '10px' }}>
//                                                         <div
//                                                             className={`progress-bar ${skill.percentage >= 80 ? 'bg-success' : skill.percentage >= 60 ? 'bg-warning' : 'bg-danger'}`}
//                                                             role="progressbar"
//                                                             style={{ width: `${skill.percentage}%` }}
//                                                             aria-valuenow={skill.percentage}
//                                                             aria-valuemin="0"
//                                                             aria-valuemax="100"
//                                                         ></div>
//                                                     </div>
//                                                     <p className="mb-0">{skill.score} ({skill.percentage}%)</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Code Assessment */}
//                 <div className="row mb-4">
//                     <div className="col-12">
//                         <div className="card shadow-sm">
//                             <div className="card-body">
//                                 <h4 className="fw-bold mb-3">Code Assessment</h4>
//                                 <h5 className="mb-2">Task:</h5>
//                                 <p className="mb-4">{report?.codeAssessmentParsed.task}</p>

//                                 <h5 className="mb-2">Solution:</h5>
//                                 <pre className="bg-light p-3 rounded mb-4" style={{ whiteSpace: 'pre-wrap' }}>
//                                     <code>{report?.codeAssessmentParsed.code}</code>
//                                 </pre>

//                                 <h5 className="mb-2">Evaluation:</h5>
//                                 <div className="row">
//                                     {report?.codeAssessmentParsed.evaluation.map((item, index) => (
//                                         <div key={index} className="col-md-4 mb-3">
//                                             <div className={`card h-100 border-${item.type === 'positive' ? 'success' : 'warning'}`}>
//                                                 <div className="card-body">
//                                                     <h6 className={`text-${item.type === 'positive' ? 'success' : 'warning'}`}>
//                                                         {item.type === 'positive' ? '✅ Strengths' : '⚠️ Areas for Improvement'}
//                                                     </h6>
//                                                     <ul className="mb-0">
//                                                         {item.points.map((point, i) => (
//                                                             <li key={i}>{point}</li>
//                                                         ))}
//                                                     </ul>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Interviewer Summary */}
//                 <div className="row">
//                     <div className="col-12">
//                         <div className="card shadow-sm">
//                             <div className="card-body">
//                                 <h4 className="fw-bold mb-3">AI Summary</h4>
//                                 <div className="p-3 bg-light rounded">
//                                     {report?.interviewerSummary.split('\n').map((paragraph, index) => (
//                                         <p key={index} className="mb-2">{paragraph}</p>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SuperAdminReport;




import { useSuperAdminContext } from '../../../context/superadmin-context';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const SuperAdminReport = () => {
    const { isLoading, getReportOfInterview, report } = useSuperAdminContext();
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = location.state || {};

    console.log(id);
    console.log(report);


    useEffect(() => {
        if (id) {
            getReportOfInterview(id);
        }
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleBackToList = () => {
        navigate(-1); // Go back to previous page
    };

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

    if (!report) {
        return (
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="alert alert-danger">
                        No report data available. Please try again.
                    </div>
                    <button onClick={handleBackToList} className="btn btn-sm btn-outline-primary">
                        ← Back to List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="container py-3 py-md-4">
                <button onClick={handleBackToList} className="btn btn-sm btn-outline-primary mb-4">
                    ← Back to List
                </button>

                <div className="row mb-4">
                    <div className="col-12">
                        <h1 className="fw-bold mb-3">Interview Summary</h1>
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <h5 className="fw-bold">Candidate</h5>
                                        <p className="mb-1"><strong>Name:</strong> {report?.candidateName || 'N/A'}</p>
                                        <p className="mb-0"><strong>Email:</strong> {report?.candidateEmail || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h5 className="fw-bold">Position</h5>
                                        <p className="mb-1"><strong>Title:</strong> {report?.positionTitle || 'N/A'}</p>
                                        <p className="mb-0"><strong>Date:</strong> {formatDate(report?.interviewDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overall Metrics */}
                <div className="row mb-4">
                    <div className="col-md-4 mb-3 mb-md-0">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <h3 className="fw-bold text-primary">{report.overallScore || 'N/A'}</h3>
                                <p className="mb-0">Overall Score</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <h3 className="fw-bold text-primary">
                                    {report.questionsAnswered || 0}/{report.totalQuestions || 0}
                                </h3>
                                <p className="mb-0">Questions Answered</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <h3 className="fw-bold text-primary">{report.duration || 'N/A'} min</h3>
                                <p className="mb-0">Interview Duration</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills Assessment */}
                {report.skills?.length > 0 && (
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h4 className="fw-bold mb-3">Skills Assessment</h4>
                                    <div className="row">
                                        {report.skills.map((skill, index) => (
                                            <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-3">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <h6 className="fw-bold">{skill.name}</h6>
                                                        <div className="progress mb-2" style={{ height: '10px' }}>
                                                            <div
                                                                className={`progress-bar ${skill.percentage >= 80 ? 'bg-success' : skill.percentage >= 60 ? 'bg-warning' : 'bg-danger'}`}
                                                                role="progressbar"
                                                                style={{ width: `${skill.percentage}%` }}
                                                                aria-valuenow={skill.percentage}
                                                                aria-valuemin="0"
                                                                aria-valuemax="100"
                                                            ></div>
                                                        </div>
                                                        <p className="mb-0">{skill.score} ({skill.percentage}%)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Code Assessment */}
                {/* {report.codeTasks && (
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h4 className="fw-bold mb-3">Code Assessment</h4>
                                    <h5 className="mb-2">Task:</h5>
                                    <p className="mb-4">{report.codeTasks.task || 'N/A'}</p>

                                    <h5 className="mb-2">Solution:</h5>
                                    <pre className="bg-light p-3 rounded mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                                        <code>{report.codeTasks.code || 'No code provided'}</code>
                                    </pre>

                                    {report.codeTasks.evaluation?.length > 0 && (
                                        <>
                                            <h5 className="mb-2">Evaluation:</h5>
                                            <div className="row">
                                                {report.codeTasks.evaluation.map((item, index) => (
                                                    <div key={index} className="col-md-4 mb-3">
                                                        <div className={`card h-100 border-${item.type === 'positive' ? 'success' : 'warning'}`}>
                                                            <div className="card-body">
                                                                <h6 className={`text-${item.type === 'positive' ? 'success' : 'warning'}`}>
                                                                    {item.type === 'positive' ? '✅ Strengths' : '⚠️ Areas for Improvement'}
                                                                </h6>
                                                                <ul className="mb-0">
                                                                    {item.points?.map((point, i) => (
                                                                        <li key={i}>{point}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )} */}

                {report.codeTasks?.map((codeTask, taskIndex) => (
                    <div key={taskIndex} className="row mb-4">
                        <div className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="mb-2">Task {taskIndex + 1}:</h5>
                                    <p className="mb-4">{codeTask.task || 'N/A'}</p>

                                    <h5 className="mb-2">Solution:</h5>
                                    <pre className="bg-light p-3 rounded mb-4">
                                        <code>{codeTask.code || 'No code provided'}</code>
                                    </pre>

                                    {codeTask.evaluation?.length > 0 && (
                                        <>
                                            <h5 className="mb-2">Evaluation:</h5>
                                            <div className="row">
                                                {codeTask.evaluation.map((item, evalIndex) => (
                                                    <div key={evalIndex} className="col-md-4 mb-3">
                                                        {/* Evaluation rendering */}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Interviewer Summary */}
                {report.interviewerSummary && (
                    <div className="row">
                        <div className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h4 className="fw-bold mb-3">AI Summary</h4>
                                    <div className="p-3 bg-light rounded">
                                        {report.interviewerSummary.split('\n').map((paragraph, index) => (
                                            <p key={index} className="mb-2">{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminReport;