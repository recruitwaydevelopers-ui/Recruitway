import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanyContext } from '../../../context/company-context';

const CompanyCreateJobPost = () => {
    const navigate = useNavigate();
    const [jobData, setJobData] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        type: 'Full-time',
        experience: '',
        description: '',
        requirements: [''],
        skills: [''],
        status: 'Active'
    });

    const { addJob } = useCompanyContext()

    const jobTypes = [
        'Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship',
        'Freelance', 'Seasonal', 'Volunteer', 'Apprenticeship',
        'Remote', 'Hybrid', 'On-site', 'Consultant'
    ];

    const experienceLevels = [
        'Entry Level', '1-2 years', '2-3 years', '3-5 years',
        '5+ years', '8+ years', '10+ years', 'Executive'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobData(prev => ({ ...prev, [name]: value }));
    };

    const handleRequirementChange = (index, value) => {
        const newRequirements = [...jobData.requirements];
        newRequirements[index] = value;
        setJobData(prev => ({ ...prev, requirements: newRequirements }));
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...jobData.skills];
        newSkills[index] = value;
        setJobData(prev => ({ ...prev, skills: newSkills }));
    };

    const addRequirement = () => {
        setJobData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }));
    };

    const removeRequirement = (index) => {
        const newRequirements = jobData.requirements.filter((_, i) => i !== index);
        setJobData(prev => ({ ...prev, requirements: newRequirements }));
    };

    const addSkill = () => {
        setJobData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
    };

    const removeSkill = (index) => {
        const newSkills = jobData.skills.filter((_, i) => i !== index);
        setJobData(prev => ({ ...prev, skills: newSkills }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addJob(jobData)
            navigate('/company/job-posts');
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <>
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-lg">
                                <div className="card-header bg-primary text-white py-3">
                                    <h2 className="h4 mb-0 text-white">
                                        <i className="bi bi-file-earmark-plus me-2"></i>Create New Job Post
                                    </h2>
                                    <p className="mb-0">
                                        <i className="bi bi-megaphone me-2"></i>Fill in the details to attract top talent
                                    </p>
                                </div>
                                <div className="card-body p-4 p-md-5">
                                    <form onSubmit={handleSubmit}>
                                        {/* Basic Information Section */}
                                        <div className="mb-4">
                                            <h3 className="h5 mb-3 text-primary">Basic Information</h3>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label htmlFor="title" className="form-label">Job Title*</label>
                                                    <input
                                                        type="text"
                                                        id="title"
                                                        name="title"
                                                        value={jobData.title}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        placeholder="e.g. Senior Frontend Developer"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="company" className="form-label">Company Name*</label>
                                                    <input
                                                        type="text"
                                                        id="company"
                                                        name="company"
                                                        value={jobData.company}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        placeholder="Your company name"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="location" className="form-label">Location*</label>
                                                    <input
                                                        type="text"
                                                        id="location"
                                                        name="location"
                                                        value={jobData.location}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        placeholder="e.g. San Francisco, CA (Remote)"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="salary" className="form-label">Salary Range*</label>
                                                    <input
                                                        type="text"
                                                        id="salary"
                                                        name="salary"
                                                        value={jobData.salary}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        placeholder="e.g. $120,000 - $150,000"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="type" className="form-label">Job Type*</label>
                                                    <select
                                                        id="type"
                                                        name="type"
                                                        value={jobData.type}
                                                        onChange={handleChange}
                                                        className="form-select"
                                                        required
                                                    >
                                                        {jobTypes.map((type) => (
                                                            <option key={type} value={type}>{type}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="experience" className="form-label">Experience Level*</label>
                                                    <select
                                                        id="experience"
                                                        name="experience"
                                                        value={jobData.experience}
                                                        onChange={handleChange}
                                                        className="form-select"
                                                        required
                                                    >
                                                        <option value="">Select experience level</option>
                                                        {experienceLevels.map((level) => (
                                                            <option key={level} value={level}>{level}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Job Description Section */}
                                        <div className="mb-4">
                                            <h3 className="h5 mb-3 text-primary">Job Description</h3>
                                            <label htmlFor="description" className="form-label">Detailed Description*</label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={jobData.description}
                                                onChange={handleChange}
                                                className="form-control"
                                                rows="6"
                                                placeholder="Describe the role, responsibilities, and what makes your company great to work for..."
                                                required
                                            />
                                        </div>

                                        {/* Requirements Section */}
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h3 className="h5 text-primary">Requirements</h3>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={addRequirement}
                                                >
                                                    <i className="bi bi-plus"></i> Add Requirement
                                                </button>
                                            </div>
                                            {jobData.requirements.map((req, index) => (
                                                <div key={index} className="d-flex mb-2 align-items-center">
                                                    <input
                                                        type="text"
                                                        value={req}
                                                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                                                        className="form-control me-2"
                                                        placeholder={`Requirement #${index + 1}`}
                                                        required
                                                    />
                                                    {jobData.requirements.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            onClick={() => removeRequirement(index)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Skills Section */}
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h3 className="h5 text-primary">Required Skills</h3>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={addSkill}
                                                >
                                                    <i className="bi bi-plus"></i> Add Skill
                                                </button>
                                            </div>
                                            <div className="d-flex flex-wrap gap-2">
                                                {jobData.skills.map((skill, index) => (
                                                    <div key={index} className="d-flex align-items-center bg-light rounded p-2">
                                                        <input
                                                            type="text"
                                                            value={skill}
                                                            onChange={(e) => handleSkillChange(index, e.target.value)}
                                                            className="form-control form-control-sm border-0 bg-transparent"
                                                            placeholder="Skill"
                                                            required
                                                        />
                                                        {jobData.skills.length > 1 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-link text-danger p-0 ms-1"
                                                                onClick={() => removeSkill(index)}
                                                            >
                                                                <i className="bi bi-x-lg"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Status Section */}
                                        <div className="mb-4 p-4 bg-light rounded-3 border">
                                            <h3 className="h5 mb-3 text-dark fw-semibold">Post Visibility</h3>

                                            {/* Modern Toggle Buttons */}
                                            <div className="d-flex flex-column flex-md-row gap-3 mb-3">
                                                <div className="flex-grow-1">
                                                    <div className="btn-group w-100 shadow-sm" role="group">
                                                        <input
                                                            type="radio"
                                                            className="btn-check"
                                                            name="status"
                                                            id="status-active"
                                                            autoComplete="off"
                                                            checked={jobData.status === 'Active'}
                                                            onChange={() => setJobData(prev => ({ ...prev, status: 'Active' }))}
                                                        />
                                                        <label
                                                            className={`btn ${jobData.status === 'Active' ? 'btn-success' : 'btn-outline-success'}`}
                                                            htmlFor="status-active"
                                                        >
                                                            <i className="bi bi-eye-fill me-2"></i> Active
                                                        </label>

                                                        <input
                                                            type="radio"
                                                            className="btn-check"
                                                            name="status"
                                                            id="status-inactive"
                                                            autoComplete="off"
                                                            checked={jobData.status === 'Inactive'}
                                                            onChange={() => setJobData(prev => ({ ...prev, status: 'Inactive' }))}
                                                        />
                                                        <label
                                                            className={`btn ${jobData.status === 'Inactive' ? 'btn-warning' : 'btn-outline-warning'}`}
                                                            htmlFor="status-inactive"
                                                        >
                                                            <i className="bi bi-eye-slash-fill me-2"></i> Inactive
                                                        </label>

                                                        <input
                                                            type="radio"
                                                            className="btn-check"
                                                            name="status"
                                                            id="status-draft"
                                                            autoComplete="off"
                                                            checked={jobData.status === 'Draft'}
                                                            onChange={() => setJobData(prev => ({ ...prev, status: 'Draft' }))}
                                                        />
                                                        <label
                                                            className={`btn ${jobData.status === 'Draft' ? 'btn-info' : 'btn-outline-info'}`}
                                                            htmlFor="status-draft"
                                                        >
                                                            <i className="bi bi-file-earmark-text-fill me-2"></i> Draft
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Card */}
                                            <div className={`card border-0 shadow-sm ${jobData.status === 'Active' ? 'border-start border-4 border-success' : jobData.status === 'Inactive' ? 'border-start border-4 border-warning' : 'border-start border-4 border-info'}`}>
                                                <div className="card-body p-3">
                                                    <div className="d-flex align-items-center">
                                                        {jobData.status === 'Active' && (
                                                            <>
                                                                <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                                                                    <i className="bi bi-check-circle-fill text-success fs-4"></i>
                                                                </div>
                                                                <div>
                                                                    <h6 className="mb-1 text-success">Visible to Candidates</h6>
                                                                    <p className="small text-muted mb-0">This job post is live and accepting applications</p>
                                                                </div>
                                                            </>
                                                        )}
                                                        {jobData.status === 'Inactive' && (
                                                            <>
                                                                <div className="bg-warning bg-opacity-10 p-2 rounded me-3">
                                                                    <i className="bi bi-pause-circle-fill text-warning fs-4"></i>
                                                                </div>
                                                                <div>
                                                                    <h6 className="mb-1 text-warning">Hidden from Candidates</h6>
                                                                    <p className="small text-muted mb-0">This job post is saved but not visible publicly</p>
                                                                </div>
                                                            </>
                                                        )}
                                                        {jobData.status === 'Draft' && (
                                                            <>
                                                                <div className="bg-info bg-opacity-10 p-2 rounded me-3">
                                                                    <i className="bi bi-file-earmark-text-fill text-info fs-4"></i>
                                                                </div>
                                                                <div>
                                                                    <h6 className="mb-1 text-info">Draft Mode</h6>
                                                                    <p className="small text-muted mb-0">Saved but not published</p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Form Actions */}
                                        <div className="d-flex justify-content-end gap-3 mt-5">
                                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => navigate('/company/job-posts')}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary btn-sm px-4">
                                                Post Job
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompanyCreateJobPost;