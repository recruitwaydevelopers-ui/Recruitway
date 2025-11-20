import { useState } from 'react';

const InterviewReportGenerator = () => {
    // Form state
    const [formData, setFormData] = useState({
        candidateName: '',
        candidateEmail: '',
        positionTitle: '',
        interviewDate: '',
        overallScore: '',
        questionsAnswered: '',
        totalQuestions: '',
        duration: '',
        skills: [{ name: '', score: '', percentage: '' }],
        codeTask: '',
        codeEvaluation: [{ type: 'positive', points: [''] }],
        interviewerSummary: ''
    });

    const [generatedReport, setGeneratedReport] = useState(null);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle skill changes
    const handleSkillChange = (index, field, value) => {
        const updatedSkills = [...formData.skills];
        updatedSkills[index][field] = value;

        // Auto-calculate percentage if score changes
        if (field === 'score') {
            const scoreNum = parseInt(value) || 0;
            updatedSkills[index].percentage = Math.min(scoreNum * 10, 100);
        }

        setFormData({
            ...formData,
            skills: updatedSkills
        });
    };

    // Add new skill
    const addSkill = () => {
        setFormData({
            ...formData,
            skills: [...formData.skills, { name: '', score: '', percentage: '' }]
        });
    };

    // Remove skill
    const removeSkill = (index) => {
        const updatedSkills = [...formData.skills];
        updatedSkills.splice(index, 1);
        setFormData({
            ...formData,
            skills: updatedSkills
        });
    };

    // Handle code evaluation changes
    const handleCodeEvalChange = (index, field, value) => {
        const updatedEval = [...formData.codeEvaluation];
        updatedEval[index][field] = value;
        setFormData({
            ...formData,
            codeEvaluation: updatedEval
        });
    };

    // Handle point changes in code evaluation
    const handlePointChange = (evalIndex, pointIndex, value) => {
        const updatedEval = [...formData.codeEvaluation];
        updatedEval[evalIndex].points[pointIndex] = value;
        setFormData({
            ...formData,
            codeEvaluation: updatedEval
        });
    };

    // Add new point to evaluation
    const addPoint = (evalIndex) => {
        const updatedEval = [...formData.codeEvaluation];
        updatedEval[evalIndex].points.push('');
        setFormData({
            ...formData,
            codeEvaluation: updatedEval
        });
    };

    // Remove point from evaluation
    const removePoint = (evalIndex, pointIndex) => {
        const updatedEval = [...formData.codeEvaluation];
        updatedEval[evalIndex].points.splice(pointIndex, 1);
        setFormData({
            ...formData,
            codeEvaluation: updatedEval
        });
    };

    // Add new evaluation section
    const addEvaluation = (type) => {
        setFormData({
            ...formData,
            codeEvaluation: [...formData.codeEvaluation, { type, points: [''] }]
        });
    };

    // Remove evaluation section
    const removeEvaluation = (index) => {
        const updatedEval = [...formData.codeEvaluation];
        updatedEval.splice(index, 1);
        setFormData({
            ...formData,
            codeEvaluation: updatedEval
        });
    };

    // Change evaluation type (positive/improvement)
    const handleEvalTypeChange = (evalIndex, type) => {
        const updatedEval = [...formData.codeEvaluation];
        updatedEval[evalIndex].type = type;
        setFormData({
            ...formData,
            codeEvaluation: updatedEval
        });
    };

    // Generate the report
    const generateReport = () => {
        setGeneratedReport({ ...formData });
    };

    // Print the report
    const printReport = () => {
        window.print();
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            candidateName: '',
            candidateEmail: '',
            positionTitle: '',
            interviewDate: '',
            overallScore: '',
            questionsAnswered: '',
            totalQuestions: '',
            duration: '',
            skills: [{ name: '', score: '', percentage: '' }],
            codeTask: '',
            codeEvaluation: [{ type: 'positive', points: [''] }],
            interviewerSummary: ''
        });
        setGeneratedReport(null);
    };

    return (
        <>
            <div className="container-fluid">
                <div className="container py-4">

                    <div className="header d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                        <h1 className="text-primary">Interview Report Generator</h1>
                    </div>

                    {!generatedReport ? (
                        <div className="form-container bg-light p-4 rounded">
                            <h2 className="mb-4">Enter Interview Details</h2>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h3 className="mb-3">Candidate Information</h3>
                                    <div className="mb-3">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="candidateName"
                                            value={formData.candidateName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="candidateEmail"
                                            value={formData.candidateEmail}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <h3 className="mb-3">Position Details</h3>
                                    <div className="mb-3">
                                        <label className="form-label">Position Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="positionTitle"
                                            value={formData.positionTitle}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Interview Date</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            name="interviewDate"
                                            value={formData.interviewDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-4">
                                    <h3 className="mb-3">Interview Metrics</h3>
                                    <div className="mb-3">
                                        <label className="form-label">Overall Score (1-10)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            className="form-control"
                                            name="overallScore"
                                            value={formData.overallScore}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Questions Answered</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="questionsAnswered"
                                            value={formData.questionsAnswered}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Total Questions</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="totalQuestions"
                                            value={formData.totalQuestions}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Duration (minutes)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <h3 className="mb-3">Skill Assessments</h3>
                                    {formData.skills.map((skill, index) => (
                                        <div key={index} className="row mb-3 align-items-end">
                                            <div className="col-md-4">
                                                <label className="form-label">Skill Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={skill.name}
                                                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <label className="form-label">Score (1-10)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    className="form-control"
                                                    value={skill.score}
                                                    onChange={(e) => handleSkillChange(index, 'score', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Percentage</label>
                                                <div className="input-group">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="form-control"
                                                        value={skill.percentage}
                                                        onChange={(e) => handleSkillChange(index, 'percentage', e.target.value)}
                                                    />
                                                    <span className="input-group-text">%</span>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                {formData.skills.length > 1 && (
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => removeSkill(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button className="btn btn-secondary mt-2" onClick={addSkill}>
                                        Add Skill
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h3 className="mb-3">Code Assessment</h3>
                                <div className="mb-3">
                                    <label className="form-label">Task Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="codeTask"
                                        value={formData.codeTask}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>

                                <h4 className="mt-4 mb-3">Evaluation</h4>
                                {formData.codeEvaluation.map((evaluation, evalIndex) => (
                                    <div key={evalIndex} className="mb-4 p-3 bg-white rounded">
                                        <div className="d-flex justify-content-between mb-3">
                                            <div className="btn-group" role="group">
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm ${evaluation.type === 'positive' ? 'btn-success' : 'btn-outline-success'}`}
                                                    onClick={() => handleEvalTypeChange(evalIndex, 'positive')}
                                                >
                                                    Strengths
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm ${evaluation.type === 'improvement' ? 'btn-warning' : 'btn-outline-warning'}`}
                                                    onClick={() => handleEvalTypeChange(evalIndex, 'improvement')}
                                                >
                                                    Improvements
                                                </button>
                                            </div>
                                            {formData.codeEvaluation.length > 1 && (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeEvaluation(evalIndex)}
                                                >
                                                    Remove Section
                                                </button>
                                            )}
                                        </div>
                                        {evaluation.points.map((point, pointIndex) => (
                                            <div key={pointIndex} className="d-flex mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control me-2"
                                                    value={point}
                                                    onChange={(e) => handlePointChange(evalIndex, pointIndex, e.target.value)}
                                                />
                                                {evaluation.points.length > 1 && (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => removePoint(evalIndex, pointIndex)}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            className="btn btn-sm btn-outline-primary mt-2"
                                            onClick={() => addPoint(evalIndex)}
                                        >
                                            Add Point
                                        </button>
                                    </div>
                                ))}
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-success"
                                        onClick={() => addEvaluation('positive')}
                                    >
                                        Add Strengths
                                    </button>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => addEvaluation('improvement')}
                                    >
                                        Add Areas for Improvement
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h3 className="mb-3">Interviewer Summary</h3>
                                <textarea
                                    className="form-control"
                                    rows="5"
                                    name="interviewerSummary"
                                    value={formData.interviewerSummary}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <div className="d-flex justify-content-between">
                                <button className="btn btn-danger" onClick={resetForm}>
                                    Reset Form
                                </button>
                                <button className="btn btn-primary" onClick={generateReport}>
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="report-container">
                            <div className="d-flex justify-content-between mb-4">
                                <h1 className="text-primary">Interview Evaluation Report</h1>
                                <div>
                                    <button className="btn btn-secondary me-2" onClick={() => setGeneratedReport(null)}>
                                        Edit Report
                                    </button>
                                    <button className="btn btn-primary">
                                        Download Rerport in Pdf
                                    </button>
                                    {/* <button className="btn btn-primary" onClick={printReport}>
                                        Print Report
                                    </button> */}
                                </div>
                            </div>

                            <div className="candidate-info d-flex flex-wrap justify-content-between mb-4">
                                <div className="info-card p-3 bg-light rounded mb-3 flex-grow-1 me-3">
                                    <h3 className="h5 text-primary mb-3">Candidate Information</h3>
                                    <p><strong>Name:</strong> {generatedReport.candidateName}</p>
                                    <p><strong>Email:</strong> {generatedReport.candidateEmail}</p>
                                </div>

                                <div className="info-card p-3 bg-light rounded mb-3 flex-grow-1 me-3">
                                    <h3 className="h5 text-primary mb-3">Position Details</h3>
                                    <p><strong>Position:</strong> {generatedReport.positionTitle}</p>
                                    <p><strong>Interview Date:</strong> {new Date(generatedReport.interviewDate).toLocaleString()}</p>
                                </div>

                                <div className="info-card p-3 bg-light rounded mb-3 flex-grow-1">
                                    <h3 className="h5 text-primary mb-3">Interview Metrics</h3>
                                    <p><strong>Overall Score:</strong> {generatedReport.overallScore}</p>
                                    <p><strong>Questions Answered:</strong> {generatedReport.questionsAnswered}/{generatedReport.totalQuestions}</p>
                                    <p><strong>Duration:</strong> {generatedReport.duration} minutes</p>
                                </div>
                            </div>

                            <h2 className="mb-3">Skill Assessments</h2>
                            <div className="skills-container d-flex flex-wrap gap-3 mb-4">
                                {generatedReport.skills.map((skill, index) => (
                                    <div className="skill-card p-3 bg-white rounded shadow-sm flex-grow-1" key={index} style={{ minWidth: '150px' }}>
                                        <div className="skill-name fw-bold mb-1">{skill.name}</div>
                                        <div className="skill-score text-primary fs-5">{skill.score}</div>
                                        <div className="progress mt-2" style={{ height: '10px' }}>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${skill.percentage}%` }}
                                                aria-valuenow={skill.percentage}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="mb-3">Code Assessment</h2>
                            <div className="code-assessment p-4 bg-light rounded mb-4">
                                <p><strong>Task:</strong> {generatedReport.codeTask}</p>

                                <div className="code-evaluation mt-3">
                                    {generatedReport.codeEvaluation.map((evaluation, index) => (
                                        <div
                                            className={`p-3 rounded mb-3 ${evaluation.type === 'positive' ? 'bg-success bg-opacity-10 border-start border-success border-4' : 'bg-warning bg-opacity-10 border-start border-warning border-4'}`}
                                            key={index}
                                        >
                                            <strong>{evaluation.type === 'positive' ? 'Strengths:' : 'Areas for Improvement:'}</strong>
                                            <ul className="mb-0">
                                                {evaluation.points.map((point, i) => (
                                                    <li key={i}>{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <h2 className="mb-3">Interviewer Summary</h2>
                            <div className="ai-summary p-4 bg-info bg-opacity-10 rounded border-start border-info border-4">
                                <p className="mb-0">{generatedReport.interviewerSummary}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default InterviewReportGenerator;

