
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const ReportForm = ({ isVisible, onClose, roomId, token, server, reportFormData }) => {
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
        codeTask: [],
        codeEvaluation: [{ type: 'positive', points: [''] }],
        interviewerSummary: ''
    });

    const [generatedReport, setGeneratedReport] = useState(null);
    const [activeTab, setActiveTab] = useState('form');
    const formRef = useRef(null);
    const drawerRef = useRef(null);

    useEffect(() => {
        if (reportFormData) {
            setFormData(prev => ({
                ...prev,
                codeTask: reportFormData
            }));
        }
    }, [reportFormData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isVisible, onClose]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        try {
            const res = await axios.post(`${server}/api/v1/interviews/updateStatusandSubmitReport/${roomId}`,
                { reportData: formData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.dismiss();
            toast.success(res.data.message);
        } catch (err) {
            console.error('❌ Error submitting report on leave:', err);
            toast.dismiss();
            toast.error("Failed to submit the report. Please try again. You are not disconnected.");
            return;
        } finally {
            onClose();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSkillChange = (index, field, value) => {
        const updatedSkills = [...formData.skills];
        updatedSkills[index][field] = value;

        if (field === 'score') {
            const scoreNum = parseInt(value) || 0;
            updatedSkills[index].percentage = Math.min(scoreNum * 10, 100);
        }

        setFormData({
            ...formData,
            skills: updatedSkills
        });
    };

    const addSkill = (e) => {
        e.preventDefault();
        setFormData({
            ...formData,
            skills: [...formData.skills, { name: '', score: '', percentage: '' }]
        });
    };

    const removeSkill = (index, e) => {
        e.preventDefault();
        const updatedSkills = [...formData.skills];
        updatedSkills.splice(index, 1);
        setFormData({
            ...formData,
            skills: updatedSkills
        });
    };

    const handlePointChange = (evalIndex, pointIndex, value) => {
        const updatedEval = [...formData.codeEvaluation];
        updatedEval[evalIndex].points[pointIndex] = value;
        setFormData({
            ...formData,
            codeEvaluation: updatedEval
        });
    };

    const addPoint = (evalIndex, e) => {
        e.preventDefault();
        const updatedEval = [...formData.codeEvaluation];
        updatedEval[evalIndex].points.push('');
        setFormData({
            ...formData,
            codeEvaluation: updatedEval
        });
    };

    const removePoint = (evalIndex, pointIndex, e) => {
        e.preventDefault();
        const updatedEval = [...formData.codeEvaluation];
        updatedEval[evalIndex].points.splice(pointIndex, 1);
        setFormData({
            ...formData,
            codeEvaluation: updatedEval
        });
    };

    const addEvaluation = (type, e) => {
        e.preventDefault();
        setFormData({
            ...formData,
            codeEvaluation: [...formData.codeEvaluation, { type, points: [''] }]
        });
    };

    const removeEvaluation = (index, e) => {
        e.preventDefault();
        const updatedEval = [...formData.codeEvaluation];
        updatedEval.splice(index, 1);
        setFormData({
            ...formData,
            codeEvaluation: updatedEval
        });
    };

    const generateReport = (e) => {
        e.preventDefault();
        setGeneratedReport({ ...formData });
        setActiveTab('report');
    };

    const printReport = () => {
        window.print();
    };

    const resetForm = (e) => {
        e.preventDefault();
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
        setActiveTab('form');
    };

    if (!isVisible) return null;

    return (
        <div className="report-form-container">
            <div className="overlay-backdrop" onClick={onClose} />

            <div className="report-drawer">
                <div className="drawer-content">
                    <div className="drawer-header">
                        <h1 className="drawer-title">
                            {activeTab === 'form' ? 'Interview Report' : 'Evaluation Report'}
                        </h1>
                        <button className="close-button" onClick={onClose}>
                            <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="drawer-body">
                        {activeTab === 'form' ? (
                            <form ref={formRef} onSubmit={handleFormSubmit} className="report-form">
                                {/* Form sections remain the same as in your original code */}
                                <div className="form-section">
                                    <h2 className="section-title">
                                        Candidate Information
                                    </h2>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <label className="form-label">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="candidateName"
                                                value={formData.candidateName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="candidateEmail"
                                                value={formData.candidateEmail}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Position Details */}
                                <div className="form-section">
                                    <h2 className="section-title">
                                        Position Details
                                    </h2>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <label className="form-label">
                                                Position Title
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="positionTitle"
                                                value={formData.positionTitle}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">
                                                Interview Date
                                            </label>
                                            <input
                                                type="datetime-local"
                                                className="form-control"
                                                name="interviewDate"
                                                value={formData.interviewDate}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Interview Metrics */}
                                <div className="form-section">
                                    <h2 className="section-title">
                                        Interview Metrics
                                    </h2>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Overall Score (1-10)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="10"
                                                className="form-control"
                                                name="overallScore"
                                                value={formData.overallScore}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Duration (min)
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Questions Answered
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="questionsAnswered"
                                                value={formData.questionsAnswered}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Total Questions
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="totalQuestions"
                                                value={formData.totalQuestions}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Skill Assessments */}
                                <div className="form-section">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h2 className="section-title">
                                            Skill Assessments
                                        </h2>
                                        <button
                                            onClick={addSkill}
                                            className="btn btn-link text-primary"
                                        >
                                            <i className="bi bi-plus-circle me-1"></i>
                                            Add Skill
                                        </button>
                                    </div>
                                    <div className="skills-container">
                                        {formData.skills.map((skill, index) => (
                                            <div key={index} className="skill-card">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div className="flex-grow-1 me-2">
                                                        <label className="form-label">
                                                            Skill Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={skill.name}
                                                            onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="score-input">
                                                        <label className="form-label">
                                                            Score
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="10"
                                                            className="form-control"
                                                            value={skill.score}
                                                            onChange={(e) => handleSkillChange(index, 'score', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    {formData.skills.length > 1 && (
                                                        <button
                                                            onClick={(e) => removeSkill(index, e)}
                                                            className="btn btn-link text-danger ms-2"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="form-label">
                                                        Percentage
                                                    </label>
                                                    <div className="input-group">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            className="form-control"
                                                            value={skill.percentage}
                                                            onChange={(e) => handleSkillChange(index, 'percentage', e.target.value)}
                                                            required
                                                        />
                                                        <span className="input-group-text">
                                                            %
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Code Assessment */}
                                <div className="form-section">
                                    <h2 className="section-title">
                                        Code Assessment
                                    </h2>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Task Description
                                        </label>
                                        <textarea
                                            className="form-control"
                                            name="codeTask"
                                            value={formData.codeTask.language}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="code-evaluation-container">
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <button
                                                onClick={(e) => addEvaluation('positive', e)}
                                                className="btn btn-link text-success"
                                            >
                                                <i className="bi bi-plus-circle me-1"></i>
                                                Add Strength
                                            </button>
                                            <button
                                                onClick={(e) => addEvaluation('improvement', e)}
                                                className="btn btn-link text-warning"
                                            >
                                                <i className="bi bi-plus-circle me-1"></i>
                                                Add Improvement
                                            </button>
                                        </div>

                                        {formData.codeEvaluation.map((evaluation, evalIndex) => (
                                            <div key={evalIndex} className={`evaluation-card ${evaluation.type === 'positive' ? 'positive-card' : 'improvement-card'}`}>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className={`evaluation-type ${evaluation.type === 'positive' ? 'text-success' : 'text-warning'}`}>
                                                        {evaluation.type === 'positive' ? 'Strengths' : 'Improvements'}
                                                    </span>
                                                    {formData.codeEvaluation.length > 1 && (
                                                        <button
                                                            onClick={(e) => removeEvaluation(evalIndex, e)}
                                                            className="btn btn-link text-danger"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="points-container">
                                                    {evaluation.points.map((point, pointIndex) => (
                                                        <div key={pointIndex} className="d-flex align-items-center mb-2">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={point}
                                                                onChange={(e) => handlePointChange(evalIndex, pointIndex, e.target.value)}
                                                                required
                                                            />
                                                            {evaluation.points.length > 1 && (
                                                                <button
                                                                    onClick={(e) => removePoint(evalIndex, pointIndex, e)}
                                                                    className="btn btn-link text-danger ms-2"
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={(e) => addPoint(evalIndex, e)}
                                                        className="btn btn-link text-primary"
                                                    >
                                                        <i className="bi bi-plus-circle me-1"></i>
                                                        Add Point
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Interviewer Summary */}
                                <div className="form-section">
                                    <h2 className="section-title">
                                        Interviewer Summary
                                    </h2>
                                    <textarea
                                        className="form-control"
                                        name="interviewerSummary"
                                        value={formData.interviewerSummary}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" onClick={(e) => generateReport(e)} className="preview-button">
                                        Preview Report
                                    </button>
                                    <button type="submit" className="submit-button">
                                        Submit Report
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="report-view">
                                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
                                    <div>
                                        <h1 className="report-title">Evaluation Report</h1>
                                        <p className="">{new Date().toLocaleDateString()}</p>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            onClick={() => setActiveTab('form')}
                                            className="btn btn-outline-secondary btn-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={printReport}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Export PDF
                                        </button>
                                    </div>
                                </div>

                                {/* Candidate Info */}
                                <div className="row mb-4 gap-4">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <h2 className="card-title">Candidate Information</h2>
                                                <div className="card-text">
                                                    <p>
                                                        <span className="text-muted">Name:</span> {generatedReport.candidateName}
                                                    </p>
                                                    <p>
                                                        <span className="text-muted">Email:</span> {generatedReport.candidateEmail}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <h2 className="card-title">Position Details</h2>
                                                <div className="card-text">
                                                    <p>
                                                        <span className="text-muted">Position:</span> {generatedReport.positionTitle}
                                                    </p>
                                                    <p>
                                                        <span className="text-muted">Date:</span> {new Date(generatedReport.interviewDate).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Interview Metrics */}
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h2 className="card-title">Interview Metrics</h2>
                                        <div className="row gap-3">
                                            <div className="col-12">
                                                <p className="text-muted mb-1">Overall Score</p>
                                                <p className="metric-value">
                                                    {generatedReport.overallScore}/10
                                                </p>
                                            </div>
                                            <div className="col-12">
                                                <p className="text-muted mb-1">Questions</p>
                                                <p className="metric-value">
                                                    {generatedReport.questionsAnswered}/{generatedReport.totalQuestions}
                                                </p>
                                            </div>
                                            <div className="col-12">
                                                <p className="text-muted mb-1">Duration</p>
                                                <p className="metric-value">
                                                    {generatedReport.duration} min
                                                </p>
                                            </div>
                                            <div className="col-12">
                                                <p className="text-muted mb-1">Completion</p>
                                                <p className="metric-value">
                                                    {Math.round((generatedReport.questionsAnswered / generatedReport.totalQuestions) * 100)}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills Assessment */}
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h2 className="card-title">Skill Assessments</h2>
                                        <div className="skills-list">
                                            {generatedReport.skills.map((skill, index) => (
                                                <div key={index} className="skill-item mb-3">
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span className="skill-name">{skill.name}</span>
                                                        <span className="skill-score">{skill.score}/10</span>
                                                    </div>
                                                    <div className="progress">
                                                        <div
                                                            className="progress-bar"
                                                            role="progressbar"
                                                            style={{ width: `${skill.percentage}%` }}
                                                            aria-valuenow={skill.percentage}
                                                            aria-valuemin="0"
                                                            aria-valuemax="100"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Code Assessment */}
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h2 className="card-title">Code Assessment</h2>
                                        <div className="mb-4">
                                            <p className="text-muted mb-1">Task Description</p>
                                            <p>{generatedReport.codeTask}</p>
                                        </div>
                                        <div className="evaluation-list">
                                            {generatedReport.codeEvaluation.map((evaluation, index) => (
                                                <div key={index} className={`evaluation-item ${evaluation.type === 'positive' ? 'positive-item' : 'improvement-item'}`}>
                                                    <h3 className={`evaluation-item-title ${evaluation.type === 'positive' ? 'text-success' : 'text-warning'}`}>
                                                        {evaluation.type === 'positive' ? 'Strengths' : 'Improvements'}
                                                    </h3>
                                                    <ul className="evaluation-points">
                                                        {evaluation.points.map((point, i) => (
                                                            <li key={i}>{point}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Interviewer Summary */}
                                <div className="card">
                                    <div className="card-body">
                                        <h2 className="card-title">Interviewer Summary</h2>
                                        <p className="whitespace-pre-line">{generatedReport.interviewerSummary}</p>
                                    </div>
                                </div>

                                <div className="report-actions">
                                    <button onClick={() => setActiveTab('form')} className="edit-button">
                                        Edit Report
                                    </button>
                                    <button onClick={onClose} className="close-report-button">
                                        Close Report
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .report-form-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1000;
                    display: ${isVisible ? 'block' : 'none'};
                }

                .overlay-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(2px);
                }

                .report-drawer {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    max-width: 36rem;
                    background-color: #fff;
                    box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
                    transform: ${isVisible ? 'translateX(0)' : 'translateX(100%)'};
                    transition: transform 0.3s ease-in-out;
                    overflow-y: auto;
                }

                .drawer-content {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .drawer-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                }

                .drawer-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0;
                    color: #1a202c;
                }

                .close-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                }

                .close-button:hover {
                    background-color: #edf2f7;
                }

                .close-icon {
                    width: 1.5rem;
                    height: 1.5rem;
                    color: #4a5568;
                }

                .drawer-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.5rem;
                }

                .form-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #e2e8f0;
                }

                .preview-button {
                    background-color: #4299e1;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }

                .preview-button:hover {
                    background-color: #3182ce;
                }

                .submit-button {
                    background-color: #48bb78;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }

                .submit-button:hover {
                    background-color: #38a169;
                }

                .report-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #e2e8f0;
                }

                .edit-button {
                    background-color: #ed8936;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }

                .edit-button:hover {
                    background-color: #dd6b20;
                }

                .close-report-button {
                    background-color: #e53e3e;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }

                .close-report-button:hover {
                    background-color: #c53030;
                }

                @media (max-width: 640px) {
                    .report-drawer {
                        width: 100%;
                        max-width: none;
                    }

                    .form-actions, .report-actions {
                        flex-direction: column;
                        gap: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ReportForm;
