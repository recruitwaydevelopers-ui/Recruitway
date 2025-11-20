import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const NewReportForm = ({ isVisible, onClose, roomId, token, server, userCount, isInterviewer }) => {

    const getStorageKey = () => `reportForm_${roomId}`;
    const saveToLocalStorage = (data) => {
        localStorage.setItem(getStorageKey(), JSON.stringify(data));
    };
    const loadFromLocalStorage = () => {
        const savedData = localStorage.getItem(getStorageKey());
        return savedData ? JSON.parse(savedData) : null;
    };
    const clearLocalStorage = () => {
        localStorage.removeItem(getStorageKey());
    };

    const [interviewType, setInterviewType] = useState(""); // Technical / Non-Technical
    const [formData, setFormData] = useState({
        candidateName: '',
        candidateEmail: '',
        positionTitle: '',
        interviewDate: '',
        duration: '',
        questionsAnswered: '',
        totalQuestions: '',
        overallScore: '',
        skills: [{ name: '', score: '', percentage: '' }],
        codeTask: [{ question: '', code: '', result: '' }],
        codeEvaluation: [{ type: 'positive', points: [''] }],
        feedback: {
            technicalSkills: [],
            communicationSkills: [],
            behavioralSkills: [],
            jobSpecificCompetencies: [],
            communicationRating: 0,
            behavioralRating: 0
        },
        interviewerSummary: '',
        overallRecommendation: ""
    });
    const [generatedReport, setGeneratedReport] = useState(null);
    const [activeTab, setActiveTab] = useState('form');
    const formRef = useRef(null);
    const drawerRef = useRef(null);

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

    // Load saved data when component mounts
    useEffect(() => {
        const savedData = loadFromLocalStorage();
        if (savedData) {
            setFormData(savedData.formData);
            setInterviewType(savedData.interviewType);
            setActiveTab(savedData.activeTab || 'form');
            setGeneratedReport(savedData.generatedReport || null);
        }
    }, [roomId]);

    // Save data to localStorage whenever form state changes
    useEffect(() => {
        if (isVisible) {
            saveToLocalStorage({
                formData,
                interviewType,
                activeTab,
                generatedReport
            });
        }
    }, [formData, interviewType, activeTab, generatedReport, isVisible]);


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {

            if (userCount < 2) {
                return toast.error("Candidate Not Joined")
            }
            // Create a copy of formData to modify
            const reportData = JSON.parse(JSON.stringify(formData));

            // Process feedback arrays to ensure they contain only strings
            const processFeedbackArray = (array) => {
                if (!array || array.length === 0) return [];
                return array.map(item => {
                    // If item is an object with a point property, return the point
                    if (typeof item === 'object' && item !== null && item.point) {
                        return item.point;
                    }
                    // If item is already a string, return it
                    if (typeof item === 'string') {
                        return item;
                    }
                    // Otherwise return empty string
                    return '';
                }).filter(point => point !== ''); // Remove empty strings
            };

            // Process feedback data
            reportData.feedback = {
                technicalSkills: processFeedbackArray(reportData.feedback.technicalSkills),
                communicationSkills: processFeedbackArray(reportData.feedback.communicationSkills),
                behavioralSkills: processFeedbackArray(reportData.feedback.behavioralSkills),
                jobSpecificCompetencies: processFeedbackArray(reportData.feedback.jobSpecificCompetencies),
                communicationRating: reportData.feedback.communicationRating || 0,
                behavioralRating: reportData.feedback.behavioralRating || 0
            };

            // For non-technical interviews, remove code-related fields
            if (interviewType !== "technical") {
                delete reportData.codeTask;
                delete reportData.codeEvaluation;
            } else {
                // For technical interviews, filter out empty code tasks
                reportData.codeTask = reportData.codeTask.filter(task =>
                    task.question && task.code && task.result
                );

                // Filter out empty code evaluations
                reportData.codeEvaluation = reportData.codeEvaluation.filter(evaluation =>
                    evaluation.points && evaluation.points.length > 0 &&
                    evaluation.points.every(point => point && point.trim() !== '')
                );
            }

            const res = await axios.post(`${server}/api/v1/interviews/mock-updateStatusandSubmitReport/${roomId}`,
                { reportData: { ...reportData, interviewType } },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success(res.data.message);
            clearLocalStorage(); // Clear saved data after successful submission
        } catch (err) {
            console.error('❌ Error submitting report:', err);
            toast.error("Failed to submit the report. Please try again.");
        } finally {
            onClose();
        }
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSkillChange = (index, field, value) => {
        const updated = [...formData.skills];
        updated[index][field] = value;
        if (field === 'score') {
            const scoreNum = parseInt(value) || 0;
            updated[index].percentage = Math.min(scoreNum * 10, 100);
        }
        setFormData({ ...formData, skills: updated });
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
        const updated = [...formData.skills];
        updated.splice(index, 1);
        setFormData({ ...formData, skills: updated });
    };

    const handlePointChange = (evalIndex, pointIndex, value) => {
        const updatedEval = [...formData.codeEvaluation];
        updatedEval[evalIndex].points[pointIndex] = value;
        setFormData({ ...formData, codeEvaluation: updatedEval });
    };

    const addPoint = (evalIndex, e) => {
        e.preventDefault();
        const updatedEval = [...formData.codeEvaluation];
        updatedEval[evalIndex].points.push('');
        setFormData({ ...formData, codeEvaluation: updatedEval });
    };

    const removePoint = (evalIndex, pointIndex, e) => {
        e.preventDefault();
        const updatedEval = [...formData.codeEvaluation];
        updatedEval[evalIndex].points.splice(pointIndex, 1);
        setFormData({ ...formData, codeEvaluation: updatedEval });
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
        setFormData({ ...formData, codeEvaluation: updatedEval });
    };

    const addReaction = (category, point) => {
        setFormData((prev) => ({
            ...prev,
            feedback: {
                ...prev.feedback,
                [category]: [
                    ...prev.feedback[category],
                    point  // Store just the string instead of an object
                ]
            }
        }));
    };

    const setRating = (category, value) => {
        setFormData((prev) => ({
            ...prev,
            feedback: {
                ...prev.feedback,
                [category]: value
            }
        }));
    };

    const generateReport = (e) => {
        e.preventDefault();
        setGeneratedReport({ ...formData, interviewType });
        setActiveTab('report');
    };

    const printReport = () => {
        window.print();
    };

    // Update resetForm to clear localStorage
    const resetForm = (e) => {
        e.preventDefault();
        setFormData({
            candidateName: '',
            candidateEmail: '',
            positionTitle: '',
            interviewDate: '',
            duration: '',
            questionsAnswered: '',
            totalQuestions: '',
            overallScore: '',
            skills: [{ name: '', score: '', percentage: '' }],
            codeTask: [{ question: '', code: '', result: '' }],
            codeEvaluation: [{ type: 'positive', points: [''] }],
            feedback: {
                technicalSkills: [],
                communicationSkills: [],
                behavioralSkills: [],
                jobSpecificCompetencies: [],
                communicationRating: 0,
                behavioralRating: 0
            },
            interviewerSummary: '',
            overallRecommendation: ""
        });
        setInterviewType("");
        setGeneratedReport(null);
        setActiveTab('form');
        clearLocalStorage(); // Clear saved data when resetting form
    };

    const handleClose = () => {
        // Check if form has been modified
        const isFormEmpty = !formData.candidateName &&
            !formData.candidateEmail &&
            !formData.positionTitle &&
            !formData.interviewDate &&
            !formData.duration &&
            !formData.questionsAnswered &&
            !formData.totalQuestions &&
            !formData.overallScore &&
            !formData.interviewerSummary &&
            !formData.overallRecommendation &&
            formData.skills.length === 1 &&
            !formData.skills[0].name &&
            !formData.skills[0].score;

        if (!isFormEmpty) {
            if (window.confirm("Are you sure you want to close? Your unsaved changes will be preserved for next time.")) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="report-form-container">
            <div className="overlay-backdrop" onClick={onClose} />
            <div className="report-drawer" ref={drawerRef}>
                <div className="drawer-content">
                    <div className="drawer-header">
                        <h1 className="drawer-title">
                            {activeTab === 'form' ? 'Interview Report' : 'Evaluation Report'}
                        </h1>
                        {/* <button className="close-button" onClick={onClose}> */}
                        <button className="close-button" onClick={handleClose}>
                            <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="drawer-tabs">
                        <button
                            className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
                            onClick={() => setActiveTab('form')}
                        >
                            <i className="bi bi-pencil-square me-2"></i> Form
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'report' ? 'active' : ''}`}
                            onClick={() => setActiveTab('report')}
                            disabled={!generatedReport}
                        >
                            <i className="bi bi-file-earmark-text me-2"></i> Preview
                        </button>
                    </div>
                    <div className="drawer-body">
                        {activeTab === 'form' ? (
                            <form ref={formRef} onSubmit={handleFormSubmit} className="report-form">
                                {/* Interview Type Selection */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <i className="bi bi-filter section-icon"></i>
                                        <h2 className="section-title">Interview Type</h2>
                                    </div>
                                    <div className="form-group">
                                        <select
                                            className="form-select"
                                            value={interviewType}
                                            onChange={(e) => setInterviewType(e.target.value)}
                                        >
                                            <option value="">-- Select Interview Type --</option>
                                            <option value="technical">Technical Interview</option>
                                            <option value="non-technical">Non-Technical Interview</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Candidate Information */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <i className="bi bi-person-circle section-icon"></i>
                                        <h2 className="section-title">Candidate Information</h2>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label className="form-label">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.candidateName}
                                                onChange={(e) => handleInputChange("candidateName", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.candidateEmail}
                                                onChange={(e) => handleInputChange("candidateEmail", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Position Details */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <i className="bi bi-briefcase section-icon"></i>
                                        <h2 className="section-title">Position Details</h2>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label className="form-label">Position Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.positionTitle}
                                                onChange={(e) => handleInputChange("positionTitle", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Interview Date</label>
                                            <input
                                                type="datetime-local"
                                                className="form-control"
                                                value={formData.interviewDate}
                                                onChange={(e) => handleInputChange("interviewDate", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Interview Metrics */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <i className="bi bi-graph-up section-icon"></i>
                                        <h2 className="section-title">Interview Metrics</h2>
                                    </div>
                                    <div className="metrics-grid">
                                        <div className="metric-card">
                                            <label className="form-label">Overall Score</label>
                                            <div className="metric-input">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    className="form-control"
                                                    value={formData.overallScore}
                                                    onChange={(e) => handleInputChange("overallScore", e.target.value)}
                                                    required
                                                />
                                                <span className="metric-suffix">/10</span>
                                            </div>
                                        </div>
                                        <div className="metric-card">
                                            <label className="form-label">Duration</label>
                                            <div className="metric-input">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={formData.duration}
                                                    onChange={(e) => handleInputChange("duration", e.target.value)}
                                                    required
                                                />
                                                <span className="metric-suffix">min</span>
                                            </div>
                                        </div>
                                        <div className="metric-card">
                                            <label className="form-label">Questions Answered</label>
                                            <div className="metric-input">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={formData.questionsAnswered}
                                                    onChange={(e) => handleInputChange("questionsAnswered", e.target.value)}
                                                    required
                                                />
                                                <span className="metric-suffix">answered</span>
                                            </div>
                                        </div>
                                        <div className="metric-card">
                                            <label className="form-label">Total Questions</label>
                                            <div className="metric-input">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={formData.totalQuestions}
                                                    onChange={(e) => handleInputChange("totalQuestions", e.target.value)}
                                                    required
                                                />
                                                <span className="metric-suffix">total</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skill Assessments */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <i className="bi bi-code-slash section-icon"></i>
                                        <h2 className="section-title">Skill Assessments</h2>
                                        <button onClick={addSkill} className="btn-add">
                                            <i className="bi bi-plus-circle me-1"></i> Add Skill
                                        </button>
                                    </div>
                                    <div className="skills-container">
                                        {formData.skills.map((skill, index) => (
                                            <div key={index} className="skill-card">
                                                <div className="skill-header">
                                                    <div className="skill-inputs">
                                                        <div className="form-group">
                                                            <label className="form-label">Skill Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={skill.name}
                                                                onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Score</label>
                                                            <div className="metric-input">
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max="10"
                                                                    className="form-control"
                                                                    value={skill.score}
                                                                    onChange={(e) => handleSkillChange(index, "score", e.target.value)}
                                                                    required
                                                                />
                                                                <span className="metric-suffix">/10</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {formData.skills.length > 1 && (
                                                        <button onClick={(e) => removeSkill(index, e)} className="btn-remove">
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Percentage</label>
                                                    <div className="progress-input">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            className="form-control"
                                                            value={skill.percentage}
                                                            onChange={(e) => handleSkillChange(index, "percentage", e.target.value)}
                                                            required
                                                        />
                                                        <span className="metric-suffix">%</span>
                                                        <div className="progress-bar">
                                                            <div
                                                                className="progress-fill"
                                                                style={{ width: `${skill.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Technical-only fields */}
                                {interviewType === "technical" && (
                                    <>
                                        {/* Code Assessment */}
                                        <div className="form-section">
                                            <div className="section-header">
                                                <i className="bi bi-clipboard-check section-icon"></i>
                                                <h2 className="section-title">Code Assessment</h2>
                                            </div>
                                            <div className="evaluations-container">
                                                <div className="evaluations-header">
                                                    <h3>Evaluation Points</h3>
                                                    <div className="evaluations-actions">
                                                        <button
                                                            onClick={(e) => addEvaluation('positive', e)}
                                                            className="btn-eval positive"
                                                        >
                                                            <i className="bi bi-plus-circle me-1"></i> Add Strength
                                                        </button>
                                                        <button
                                                            onClick={(e) => addEvaluation('improvement', e)}
                                                            className="btn-eval improvement"
                                                        >
                                                            <i className="bi bi-plus-circle me-1"></i> Add Improvement
                                                        </button>
                                                    </div>
                                                </div>
                                                {formData.codeEvaluation.map((evaluation, evalIndex) => (
                                                    <div key={evalIndex} className={`evaluation-card ${evaluation.type}`}>
                                                        <div className="evaluation-header">
                                                            <span className="evaluation-type">
                                                                {evaluation.type === 'positive' ?
                                                                    <><i className="bi bi-check-circle me-1"></i> Strengths</> :
                                                                    <><i className="bi bi-exclamation-circle me-1"></i> Improvements</>
                                                                }
                                                            </span>
                                                            {formData.codeEvaluation.length > 1 && (
                                                                <button
                                                                    onClick={(e) => removeEvaluation(evalIndex, e)}
                                                                    className="btn-remove"
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="points-container">
                                                            {evaluation.points.map((point, pointIndex) => (
                                                                <div key={pointIndex} className="point-item">
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
                                                                            className="btn-remove"
                                                                        >
                                                                            <i className="bi bi-trash"></i>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <button
                                                                onClick={(e) => addPoint(evalIndex, e)}
                                                                className="btn-add-point"
                                                            >
                                                                <i className="bi bi-plus-circle me-1"></i> Add Point
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Feedback Section */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <i className="bi bi-chat-square-text section-icon"></i>
                                        <h2 className="section-title">Feedback</h2>
                                    </div>

                                    {/* Technical Skills */}
                                    <div className="mb-4">
                                        <h3>Technical Skills</h3>
                                        <div className="btn-group-container mb-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-success"
                                                onClick={() => addReaction("technicalSkills", "Strong technical knowledge")}
                                            >
                                                💻 Strong Tech
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-warning"
                                                onClick={() => addReaction("technicalSkills", "Lacks technical depth")}
                                            >
                                                ⚠️ Lacks Depth
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-info"
                                                onClick={() => addReaction("technicalSkills", "Good problem solving")}
                                            >
                                                🔧 Problem Solver
                                            </button>
                                        </div>
                                        <div className="feedback-points-list">
                                            {/* {formData.feedback.technicalSkills.map((item, index) => (
                                                <div key={index} className="feedback-point-item">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={item.point}
                                                        onChange={(e) => {
                                                            const updated = [...formData.feedback.technicalSkills];
                                                            updated[index] = { ...updated[index], point: e.target.value };
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    technicalSkills: updated
                                                                }
                                                            });
                                                        }}
                                                        placeholder="Enter a point"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-remove"
                                                        onClick={() => {
                                                            const updated = [...formData.feedback.technicalSkills];
                                                            updated.splice(index, 1);
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    technicalSkills: updated
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            ))} */}

                                            {/* For technical skills */}
                                            {formData.feedback.technicalSkills.map((item, index) => (
                                                <div key={index} className="feedback-point-item">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={item}  // Now item is just a string
                                                        onChange={(e) => {
                                                            const updated = [...formData.feedback.technicalSkills];
                                                            updated[index] = e.target.value;  // Update with string value
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    technicalSkills: updated
                                                                }
                                                            });
                                                        }}
                                                        placeholder="Enter a point"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-remove"
                                                        onClick={() => {
                                                            const updated = [...formData.feedback.technicalSkills];
                                                            updated.splice(index, 1);
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    technicalSkills: updated
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="btn-add-point"
                                                onClick={() => addReaction("technicalSkills", "")}
                                            >
                                                <i className="bi bi-plus-circle me-1"></i> Add Custom Point
                                            </button>
                                        </div>
                                    </div>

                                    {/* Communication Skills */}
                                    <div className="mb-4">
                                        <h3>Communication Skills</h3>
                                        <div className="btn-group-container mb-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-success"
                                                onClick={() => addReaction("communicationSkills", "Clear explanations")}
                                            >
                                                🎤 Clear
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-warning"
                                                onClick={() => addReaction("communicationSkills", "Hesitant communication")}
                                            >
                                                🤔 Hesitant
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-info"
                                                onClick={() => addReaction("communicationSkills", "Good listening skills")}
                                            >
                                                👂 Good Listener
                                            </button>
                                        </div>
                                        <div className="feedback-points-list">
                                            {/* {formData.feedback.communicationSkills.map((item, index) => (
                                                <div key={index} className="feedback-point-item">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={item.point}
                                                        onChange={(e) => {
                                                            const updated = [...formData.feedback.communicationSkills];
                                                            updated[index] = { ...updated[index], point: e.target.value };
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    communicationSkills: updated
                                                                }
                                                            });
                                                        }}
                                                        placeholder="Enter a point"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-remove"
                                                        onClick={() => {
                                                            const updated = [...formData.feedback.communicationSkills];
                                                            updated.splice(index, 1);
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    communicationSkills: updated
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            ))} */}

                                            {formData.feedback.communicationSkills.map((item, index) => (
                                                <div key={index} className="feedback-point-item">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={item}  // Now item is just a string
                                                        onChange={(e) => {
                                                            const updated = [...formData.feedback.communicationSkills];
                                                            updated[index] = e.target.value;  // Update with string value
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    communicationSkills: updated
                                                                }
                                                            });
                                                        }}
                                                        placeholder="Enter a point"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-remove"
                                                        onClick={() => {
                                                            const updated = [...formData.feedback.communicationSkills];
                                                            updated.splice(index, 1);
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    communicationSkills: updated
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="btn-add-point"
                                                onClick={() => addReaction("communicationSkills", "")}
                                            >
                                                <i className="bi bi-plus-circle me-1"></i> Add Custom Point
                                            </button>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Communication Rating</label>
                                            <select
                                                className="form-select"
                                                value={formData.feedback.communicationRating}
                                                onChange={(e) => setRating("communicationRating", Number(e.target.value))}
                                            >
                                                <option value={0}>Select Rating</option>
                                                <option value={1}>⭐ Poor</option>
                                                <option value={2}>⭐⭐ Fair</option>
                                                <option value={3}>⭐⭐⭐ Average</option>
                                                <option value={4}>⭐⭐⭐⭐ Good</option>
                                                <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Behavioral Skills */}
                                    <div className="mb-4">
                                        <h3>Behavioral Skills</h3>
                                        <div className="btn-group-container mb-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-success"
                                                onClick={() => addReaction("behavioralSkills", "Positive attitude")}
                                            >
                                                🤝 Positive
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => addReaction("behavioralSkills", "Lacked confidence")}
                                            >
                                                📉 Lacked confidence
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary"
                                                onClick={() => addReaction("behavioralSkills", "Good problem solving")}
                                            >
                                                💡 Problem Solver
                                            </button>
                                        </div>
                                        <div className="feedback-points-list">
                                            {/* {formData.feedback.behavioralSkills.map((item, index) => (
                                                <div key={index} className="feedback-point-item">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={item.point}
                                                        onChange={(e) => {
                                                            const updated = [...formData.feedback.behavioralSkills];
                                                            updated[index] = { ...updated[index], point: e.target.value };
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    behavioralSkills: updated
                                                                }
                                                            });
                                                        }}
                                                        placeholder="Enter a point"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-remove"
                                                        onClick={() => {
                                                            const updated = [...formData.feedback.behavioralSkills];
                                                            updated.splice(index, 1);
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    behavioralSkills: updated
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            ))} */}

                                            {formData.feedback.behavioralSkills.map((item, index) => (
                                                <div key={index} className="feedback-point-item">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={item}  // Now item is just a string
                                                        onChange={(e) => {
                                                            const updated = [...formData.feedback.behavioralSkills];
                                                            updated[index] = e.target.value;  // Update with string value
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    behavioralSkills: updated
                                                                }
                                                            });
                                                        }}
                                                        placeholder="Enter a point"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-remove"
                                                        onClick={() => {
                                                            const updated = [...formData.feedback.behavioralSkills];
                                                            updated.splice(index, 1);
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    behavioralSkills: updated
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="btn-add-point"
                                                onClick={() => addReaction("behavioralSkills", "")}
                                            >
                                                <i className="bi bi-plus-circle me-1"></i> Add Custom Point
                                            </button>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Behavioral Rating</label>
                                            <select
                                                className="form-select"
                                                value={formData.feedback.behavioralRating}
                                                onChange={(e) => setRating("behavioralRating", Number(e.target.value))}
                                            >
                                                <option value={0}>Select Rating</option>
                                                <option value={1}>⭐ Poor</option>
                                                <option value={2}>⭐⭐ Fair</option>
                                                <option value={3}>⭐⭐⭐ Average</option>
                                                <option value={4}>⭐⭐⭐⭐ Good</option>
                                                <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Job Specific Competencies */}
                                    <div className="mb-4">
                                        <h3>Job Specific Competencies</h3>
                                        <div className="btn-group-container mb-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-success"
                                                onClick={() => addReaction("jobSpecificCompetencies", "Relevant experience")}
                                            >
                                                🎯 Relevant Exp
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-warning"
                                                onClick={() => addReaction("jobSpecificCompetencies", "Lacks domain knowledge")}
                                            >
                                                🧩 Lacks Domain
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-info"
                                                onClick={() => addReaction("jobSpecificCompetencies", "Good cultural fit")}
                                            >
                                                🌟 Cultural Fit
                                            </button>
                                        </div>
                                        <div className="feedback-points-list">
                                            {/* {formData.feedback.jobSpecificCompetencies.map((item, index) => (
                                                <div key={index} className="feedback-point-item">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={item.point}
                                                        onChange={(e) => {
                                                            const updated = [...formData.feedback.jobSpecificCompetencies];
                                                            updated[index] = { ...updated[index], point: e.target.value };
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    jobSpecificCompetencies: updated
                                                                }
                                                            });
                                                        }}
                                                        placeholder="Enter a point"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-remove"
                                                        onClick={() => {
                                                            const updated = [...formData.feedback.jobSpecificCompetencies];
                                                            updated.splice(index, 1);
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    jobSpecificCompetencies: updated
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            ))} */}

                                            {formData.feedback.jobSpecificCompetencies.map((item, index) => (
                                                <div key={index} className="feedback-point-item">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={item}  // Now item is just a string
                                                        onChange={(e) => {
                                                            const updated = [...formData.feedback.jobSpecificCompetencies];
                                                            updated[index] = e.target.value;  // Update with string value
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    jobSpecificCompetencies: updated
                                                                }
                                                            });
                                                        }}
                                                        placeholder="Enter a point"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-remove"
                                                        onClick={() => {
                                                            const updated = [...formData.feedback.jobSpecificCompetencies];
                                                            updated.splice(index, 1);
                                                            setFormData({
                                                                ...formData,
                                                                feedback: {
                                                                    ...formData.feedback,
                                                                    jobSpecificCompetencies: updated
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="btn-add-point"
                                                onClick={() => addReaction("jobSpecificCompetencies", "")}
                                            >
                                                <i className="bi bi-plus-circle me-1"></i> Add Custom Point
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Interviewer Summary */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <i className="bi bi-chat-square-text section-icon"></i>
                                        <h2 className="section-title">Interviewer Summary</h2>
                                    </div>
                                    <div className="form-group">
                                        <textarea
                                            className="form-control"
                                            rows={5}
                                            value={formData.interviewerSummary}
                                            onChange={(e) => handleInputChange("interviewerSummary", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Overall Recommendation */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <i className="bi bi-award section-icon"></i>
                                        <h2 className="section-title">Overall Recommendation</h2>
                                    </div>
                                    <div className="form-group">
                                        <select
                                            className="form-select"
                                            value={formData.overallRecommendation}
                                            onChange={(e) => handleInputChange("overallRecommendation", e.target.value)}
                                            required
                                        >
                                            <option value="">Select Recommendation</option>
                                            <option value="Strongly Recommended">Strongly Recommended</option>
                                            <option value="Recommended">Recommended</option>
                                            <option value="Recommended with Reservations">Recommended with Reservations</option>
                                            <option value="Not Recommended">Not Recommended</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" onClick={resetForm} className="btn-reset">
                                        <i className="bi bi-arrow-clockwise me-1"></i> Reset Form
                                    </button>
                                    <div className="actions-right">
                                        <button type="button" onClick={generateReport} className="btn-preview">
                                            <i className="bi bi-eye me-1"></i> Preview Report
                                        </button>
                                        <button type="submit" className="btn-submit">
                                            <i className="bi bi-check-circle me-1"></i> Submit Report
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="report-view">
                                <div className="report-header">
                                    <div>
                                        <h1 className="report-title">Evaluation Report</h1>
                                        <p className="report-date">{new Date().toLocaleDateString()}</p>
                                    </div>
                                    <div className="report-actions">
                                        <button
                                            onClick={() => setActiveTab('form')}
                                            className="btn-edit"
                                        >
                                            <i className="bi bi-pencil-square me-1"></i> Edit
                                        </button>
                                        <button
                                            onClick={printReport}
                                            className="btn-export"
                                        >
                                            <i className="bi bi-download me-1"></i> Export PDF
                                        </button>
                                    </div>
                                </div>

                                {/* Candidate Info */}
                                <div className="report-section">
                                    <div className="section-title">
                                        <i className="bi bi-person-circle"></i> Candidate Information
                                    </div>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Name</span>
                                            <span className="info-value">{generatedReport.candidateName}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Email</span>
                                            <span className="info-value">{generatedReport.candidateEmail}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Position</span>
                                            <span className="info-value">{generatedReport.positionTitle}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Date</span>
                                            <span className="info-value">{new Date(generatedReport.interviewDate).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Interview Metrics */}
                                <div className="report-section">
                                    <div className="section-title">
                                        <i className="bi bi-graph-up"></i> Interview Metrics
                                    </div>
                                    <div className="metrics-grid">
                                        <div className="metric-card">
                                            <div className="metric-label">Overall Score</div>
                                            <div className="metric-value">{generatedReport.overallScore}/10</div>
                                        </div>
                                        <div className="metric-card">
                                            <div className="metric-label">Questions</div>
                                            <div className="metric-value">{generatedReport.questionsAnswered}/{generatedReport.totalQuestions}</div>
                                        </div>
                                        <div className="metric-card">
                                            <div className="metric-label">Duration</div>
                                            <div className="metric-value">{generatedReport.duration} min</div>
                                        </div>
                                        <div className="metric-card">
                                            <div className="metric-label">Completion</div>
                                            <div className="metric-value">
                                                {Math.round((generatedReport.questionsAnswered / generatedReport.totalQuestions) * 100)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills Assessment */}
                                <div className="report-section">
                                    <div className="section-title">
                                        <i className="bi bi-code-slash"></i> Skill Assessments
                                    </div>
                                    <div className="skills-list">
                                        {generatedReport.skills.map((skill, index) => (
                                            <div key={index} className="skill-item">
                                                <div className="skill-info">
                                                    <span className="skill-name">{skill.name}</span>
                                                    <span className="skill-score">{skill.score}/10</span>
                                                </div>
                                                <div className="skill-progress">
                                                    <div
                                                        className="skill-progress-bar"
                                                        style={{ width: `${skill.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Technical-only sections */}
                                {generatedReport.interviewType === "technical" && (
                                    <>
                                        {/* Code Tasks */}
                                        <div className="report-section">
                                            <div className="section-title">
                                                <i className="bi bi-terminal"></i> Code Tasks
                                            </div>
                                            <div className="code-tasks-list">
                                                {generatedReport.codeTask.map((task, index) => (
                                                    <div key={index} className="code-task-item">
                                                        <h3>Task #{index + 1}</h3>
                                                        <div className="task-question">
                                                            <div className="task-label">Question</div>
                                                            <div className="task-text">{task.question}</div>
                                                        </div>
                                                        <div className="task-code">
                                                            <div className="task-label">Candidate's Code</div>
                                                            <pre className="task-code-block">{task.code}</pre>
                                                        </div>
                                                        <div className="task-result">
                                                            <div className="task-label">Result</div>
                                                            <div className="task-text">{task.result}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Code Assessment */}
                                        <div className="report-section">
                                            <div className="section-title">
                                                <i className="bi bi-clipboard-check"></i> Code Assessment
                                            </div>
                                            <div className="evaluations-list">
                                                {generatedReport.codeEvaluation.map((evaluation, index) => (
                                                    <div key={index} className={`evaluation-item ${evaluation.type}`}>
                                                        <div className={`evaluation-title ${evaluation.type}`}>
                                                            {evaluation.type === 'positive' ?
                                                                <><i className="bi bi-check-circle me-1"></i> Strengths</> :
                                                                <><i className="bi bi-exclamation-circle me-1"></i> Improvements</>
                                                            }
                                                        </div>
                                                        <ul className="evaluation-points">
                                                            {evaluation.points.map((point, i) => (
                                                                <li key={i}>{point}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Feedback Section */}
                                <div className="report-section">
                                    <div className="section-title">
                                        <i className="bi bi-chat-square-text"></i> Feedback
                                    </div>
                                    <div className="reactions-container">
                                        {/* Technical Skills */}
                                        <div className="reaction-category">
                                            <h3>Technical Skills</h3>
                                            <ul className="reaction-points">
                                                {generatedReport.feedback.technicalSkills.map((item, i) => (
                                                    <li key={i}>{item.point}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Communication Skills */}
                                        <div className="reaction-category">
                                            <h3>Communication Skills</h3>
                                            <div className="reaction-rating">
                                                <div className="rating-stars">
                                                    {'★'.repeat(generatedReport.feedback.communicationRating)}
                                                    {'☆'.repeat(5 - generatedReport.feedback.communicationRating)}
                                                </div>
                                                <div className="rating-value">
                                                    {generatedReport.feedback.communicationRating}/5
                                                </div>
                                            </div>
                                            <ul className="reaction-points">
                                                {generatedReport.feedback.communicationSkills.map((point, i) => (
                                                    <li key={i}>{point}</li>  // Now point is just a string
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Behavioral Skills */}
                                        <div className="reaction-category">
                                            <h3>Behavioral Skills</h3>
                                            <div className="reaction-rating">
                                                <div className="rating-stars">
                                                    {'★'.repeat(generatedReport.feedback.behavioralRating)}
                                                    {'☆'.repeat(5 - generatedReport.feedback.behavioralRating)}
                                                </div>
                                                <div className="rating-value">
                                                    {generatedReport.feedback.behavioralRating}/5
                                                </div>
                                            </div>
                                            <ul className="reaction-points">
                                                {generatedReport.feedback.behavioralSkills.map((point, i) => (
                                                    <li key={i}>{point}</li>  // Now point is just a string
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Job Specific Competencies */}
                                        <div className="reaction-category">
                                            <h3>Job Specific Competencies</h3>
                                            <ul className="reaction-points">
                                                {generatedReport.feedback.jobSpecificCompetencies.map((point, i) => (
                                                    <li key={i}>{point}</li>  // Now point is just a string
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Interviewer Summary */}
                                <div className="report-section">
                                    <div className="section-title">
                                        <i className="bi bi-chat-square-text"></i> Interviewer Summary
                                    </div>
                                    <div className="summary-text">
                                        {generatedReport.interviewerSummary}
                                    </div>
                                </div>

                                {/* Overall Recommendation */}
                                <div className="report-section">
                                    <div className="section-title">
                                        <i className="bi bi-award"></i> Overall Recommendation
                                    </div>
                                    <div className="recommendation-container">
                                        <div className={`recommendation-badge ${generatedReport.overallRecommendation.includes('Strongly') ? 'strong' :
                                            generatedReport.overallRecommendation.includes('Recommended') ? 'recommended' :
                                                generatedReport.overallRecommendation.includes('Reservations') ? 'reservations' : 'not-recommended'
                                            }`}>
                                            {generatedReport.overallRecommendation}
                                        </div>
                                    </div>
                                </div>

                                <div className="report-footer-actions">
                                    <button onClick={() => setActiveTab('form')} className="btn-edit">
                                        <i className="bi bi-pencil-square me-1"></i> Edit Report
                                    </button>
                                    <button onClick={onClose} className="btn-close">
                                        <i className="bi bi-x-circle me-1"></i> Close Report
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
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
            background-color: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
        }
        .report-drawer {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            max-width: 42rem;
            background-color: #0d1117;
            box-shadow: -5px 0 20px rgba(0, 0, 0, 0.3);
            transform: ${isVisible ? 'translateX(0)' : 'translateX(100%)'};
            transition: transform 0.3s ease-in-out;
            overflow-y: auto;
            border-left: 1px solid #30363d;
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
            border-bottom: 1px solid #30363d;
            background-color: #161b22;
        }
        .drawer-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0;
            color: #f0f6fc;
        }
        .close-button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: background-color 0.2s;
            color: #8b949e;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .close-button:hover {
            background-color: #30363d;
        }
        .close-icon {
            width: 1.5rem;
            height: 1.5rem;
        }
        .drawer-tabs {
            display: flex;
            border-bottom: 1px solid #30363d;
            background-color: #161b22;
        }
        .tab-button {
            flex: 1;
            padding: 1rem;
            background: none;
            border: none;
            color: #8b949e;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border-bottom: 2px solid transparent;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .tab-button:hover {
            color: #f0f6fc;
            background-color: rgba(255, 255, 255, 0.05);
        }
        .tab-button.active {
            color: #58a6ff;
            border-bottom-color: #58a6ff;
        }
        .tab-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .drawer-body {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
            color: #c9d1d9;
        }
        .form-section {
            margin-bottom: 2rem;
        }
        .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 1.25rem;
        }
        .section-icon {
            font-size: 1.25rem;
            margin-right: 0.75rem;
            color: #58a6ff;
        }
        .section-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0;
            color: #f0f6fc;
        }
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-label {
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: #8b949e;
            display: block;
        }
        .form-control {
            background-color: #0d1117;
            border: 1px solid #30363d;
            color: #f0f6fc;
            border-radius: 6px;
            padding: 0.75rem 1rem;
            font-size: 0.95rem;
            transition: all 0.2s;
            width: 100%;
        }
        .form-control:focus {
            background-color: #0d1117;
            border-color: #58a6ff;
            color: #f0f6fc;
            box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2);
            outline: none;
        }
        .form-select {
            background-color: #0d1117;
            border: 1px solid #30363d;
            color: #f0f6fc;
            border-radius: 6px;
            padding: 0.75rem 1rem;
            font-size: 0.95rem;
            transition: all 0.2s;
            width: 100%;
        }
        .form-select:focus {
            background-color: #0d1117;
            border-color: #58a6ff;
            color: #f0f6fc;
            box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2);
            outline: none;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }
        .metric-card {
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 1rem;
        }
        .metric-input {
            display: flex;
            align-items: center;
        }
        .metric-input .form-control {
            flex: 1;
        }
        .metric-suffix {
            margin-left: 0.5rem;
            color: #8b949e;
            font-size: 0.9rem;
        }
        .btn-add {
            background: none;
            border: 1px solid #58a6ff;
            color: #58a6ff;
            border-radius: 6px;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
        }
        .btn-add:hover {
            background-color: rgba(88, 166, 255, 0.1);
        }
        .skills-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .skill-card {
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 1rem;
        }
        .skill-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        .skill-inputs {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1rem;
            flex: 1;
        }
        .btn-remove {
            background: none;
            border: none;
            color: #f85149;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 4px;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .btn-remove:hover {
            background-color: rgba(248, 81, 73, 0.1);
        }
        .progress-input {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .progress-input .form-control {
            width: 80px;
        }
        .progress-bar {
            flex: 1;
            height: 8px;
            background-color: #0d1117;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background-color: #58a6ff;
            border-radius: 4px;
        }
        .code-tasks-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        .code-task-card {
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 1.25rem;
        }
        .task-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .task-header h3 {
            margin: 0;
            color: #f0f6fc;
            font-size: 1.1rem;
        }
        .code-textarea {
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
        }
        .evaluations-container {
            margin-top: 1.5rem;
        }
        .evaluations-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.25rem;
        }
        .evaluations-header h3 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #f0f6fc;
            margin: 0;
        }
        .evaluations-actions {
            display: flex;
            gap: 0.75rem;
        }
        .btn-eval {
            border: none;
            border-radius: 6px;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
        }
        .btn-eval.positive {
            background-color: rgba(63, 185, 80, 0.1);
            color: #3fb950;
        }
        .btn-eval.positive:hover {
            background-color: rgba(63, 185, 80, 0.2);
        }
        .btn-eval.improvement {
            background-color: rgba(210, 153, 34, 0.1);
            color: #d29922;
        }
        .btn-eval.improvement:hover {
            background-color: rgba(210, 153, 34, 0.2);
        }
        .evaluation-card {
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
        }
        .evaluation-card.positive {
            border-left: 4px solid #3fb950;
        }
        .evaluation-card.improvement {
            border-left: 4px solid #d29922;
        }
        .evaluation-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .evaluation-type {
            font-weight: 600;
            display: flex;
            align-items: center;
        }
        .evaluation-type.positive {
            color: #3fb950;
        }
        .evaluation-type.improvement {
            color: #d29922;
        }
        .points-container {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        .point-item {
            display: flex;
            align-items: center;
        }
        .point-item .form-control {
            flex: 1;
        }
        .btn-add-point {
            background: none;
            border: 1px dashed #58a6ff;
            color: #58a6ff;
            border-radius: 6px;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }
        .btn-add-point:hover {
            background-color: rgba(88, 166, 255, 0.1);
        }
        .btn-group-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }
        .feedback-points-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }
        .feedback-point-item {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }
        .feedback-point-item .form-control {
            flex: 1;
        }
        .form-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid #30363d;
        }
        .actions-right {
            display: flex;
            gap: 0.75rem;
        }
        .btn-reset, .btn-preview, .btn-submit {
            border: none;
            border-radius: 6px;
            padding: 0.75rem 1.25rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
        }
        .btn-reset {
            background-color: #30363d;
            color: #f0f6fc;
        }
        .btn-reset:hover {
            background-color: #484f58;
        }
        .btn-preview {
            background-color: #1f6feb;
            color: white;
        }
        .btn-preview:hover {
            background-color: #388bfd;
        }
        .btn-submit {
            background-color: #238636;
            color: white;
        }
        .btn-submit:hover {
            background-color: #2ea043;
        }
        /* Report View Styles */
        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #30363d;
        }
        .report-title {
            font-size: 1.75rem;
            font-weight: 600;
            color: #f0f6fc;
            margin: 0 0 0.25rem 0;
        }
        .report-date {
            color: #8b949e;
            margin: 0;
        }
        .report-actions {
            display: flex;
            gap: 0.75rem;
        }
        .btn-edit, .btn-export {
            border: none;
            border-radius: 6px;
            padding: 0.5rem 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
        }
        .btn-edit {
            background-color: #30363d;
            color: #f0f6fc;
        }
        .btn-edit:hover {
            background-color: #484f58;
        }
        .btn-export {
            background-color: #1f6feb;
            color: white;
        }
        .btn-export:hover {
            background-color: #388bfd;
        }
        .report-section {
            margin-bottom: 2rem;
        }
        .section-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #f0f6fc;
            margin-bottom: 1.25rem;
            display: flex;
            align-items: center;
        }
        .section-title i {
            margin-right: 0.75rem;
            color: #58a6ff;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }
        .info-item {
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 1rem;
        }
        .info-label {
            color: #8b949e;
            font-size: 0.875rem;
            margin-bottom: 0.25rem;
            display: block;
        }
        .info-value {
            color: #f0f6fc;
            font-weight: 500;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }
        .metric-card {
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 1.25rem;
            text-align: center;
        }
        .metric-label {
            color: #8b949e;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
        }
        .metric-value {
            color: #58a6ff;
            font-size: 1.5rem;
            font-weight: 600;
        }
        .skills-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .skill-item {
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 1rem;
        }
        .skill-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
        }
        .skill-name {
            color: #f0f6fc;
            font-weight: 500;
        }
        .skill-score {
            color: #58a6ff;
            font-weight: 600;
        }
        .skill-progress {
            height: 8px;
            background-color: #0d1117;
            border-radius: 4px;
            overflow: hidden;
        }
        .skill-progress-bar {
            height: 100%;
            background-color: #58a6ff;
            border-radius: 4px;
        }
        .code-tasks-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        .code-task-item {
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 1.25rem;
        }
        .code-task-item h3 {
            color: #f0f6fc;
            margin: 0 0 1rem 0;
            font-size: 1.1rem;
        }
        .task-question, .task-code, .task-result {
            margin-bottom: 1rem;
        }
        .task-label {
            color: #8b949e;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
        }
        .task-text {
            color: #c9d1d9;
        }
        .task-code-block {
            background-color: #0d1117;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 1rem;
            color: #f0f6fc;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
        }
        .evaluations-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        .evaluation-item {
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 1.25rem;
        }
        .evaluation-item.positive {
            border-left: 4px solid #3fb950;
        }
        .evaluation-item.improvement {
            border-left: 4px solid #d29922;
        }
        .evaluation-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
        }
        .evaluation-title.positive {
            color: #3fb950;
        }
        .evaluation-title.improvement {
            color: #d29922;
        }
        .evaluation-points {
            padding-left: 1.5rem;
            margin: 0;
        }
        .evaluation-points li {
            margin-bottom: 0.5rem;
            color: #c9d1d9;
        }
        .reactions-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
        }
        .reaction-category {
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 1.25rem;
        }
        .reaction-category h3 {
            color: #f0f6fc;
            margin: 0 0 1rem 0;
            font-size: 1.1rem;
        }
        .reaction-rating {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
        }
        .rating-stars {
            color: #d29922;
            font-size: 1.25rem;
            margin-right: 0.75rem;
        }
        .rating-value {
            color: #8b949e;
            font-size: 0.9rem;
        }
        .reaction-points {
            padding-left: 1rem;
            margin: 0;
        }
        .reaction-points li {
            margin-bottom: 0.5rem;
            color: #c9d1d9;
        }
        .summary-text {
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 1.25rem;
            color: #c9d1d9;
            white-space: pre-line;
        }
        .recommendation-container {
            display: flex;
            justify-content: center;
        }
        .recommendation-badge {
            padding: 0.75rem 1.5rem;
            border-radius: 30px;
            font-weight: 600;
            font-size: 1.1rem;
        }
        .recommendation-badge.strong {
            background-color: rgba(63, 185, 80, 0.2);
            color: #3fb950;
            border: 1px solid #3fb950;
        }
        .recommendation-badge.recommended {
            background-color: rgba(88, 166, 255, 0.2);
            color: #58a6ff;
            border: 1px solid #58a6ff;
        }
        .recommendation-badge.reservations {
            background-color: rgba(210, 153, 34, 0.2);
            color: #d29922;
            border: 1px solid #d29922;
        }
        .recommendation-badge.not-recommended {
            background-color: rgba(248, 81, 73, 0.2);
            color: #f85149;
            border: 1px solid #f85149;
        }
        .report-footer-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid #30363d;
        }
        .btn-close {
            background-color: #30363d;
            color: #f0f6fc;
            border: none;
            border-radius: 6px;
            padding: 0.75rem 1.25rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
        }
        .btn-close:hover {
            background-color: #484f58;
        }
        @media (max-width: 768px) {
            .report-drawer {
                width: 100%;
                max-width: none;
            }
            .form-grid, .metrics-grid, .info-grid {
                grid-template-columns: 1fr;
            }
            .skill-inputs {
                grid-template-columns: 1fr;
            }
            .evaluations-actions {
                flex-direction: column;
                gap: 0.5rem;
            }
            .form-actions, .actions-right, .report-footer-actions {
                flex-direction: column;
                gap: 0.75rem;
            }
            .reactions-container {
                grid-template-columns: 1fr;
            }
        }
        @media print {
            .report-drawer {
                position: static;
                width: 100%;
                max-width: none;
                transform: none;
                box-shadow: none;
                border: none;
            }
            .drawer-header, .drawer-tabs, .form-actions, .report-footer-actions {
                display: none;
            }
            .drawer-body {
                padding: 0;
            }
        }
      `}</style>
        </div>
    );
};

export default NewReportForm;