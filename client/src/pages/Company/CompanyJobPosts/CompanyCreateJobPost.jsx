// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCompanyContext } from '../../../context/company-context';

// const CompanyCreateJobPost = () => {
//     const navigate = useNavigate();
//     const [jobData, setJobData] = useState({
//         title: '',
//         company: '',
//         location: '',
//         salary: '',
//         type: 'Full-time',
//         experience: '',
//         description: '',
//         requirements: [''],
//         skills: [''],
//         status: 'Active'
//     });

//     const { addJob } = useCompanyContext()

//     const jobTypes = [
//         'Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship',
//         'Freelance', 'Seasonal', 'Volunteer', 'Apprenticeship',
//         'Remote', 'Hybrid', 'On-site', 'Consultant'
//     ];

//     const experienceLevels = [
//         'Entry Level', '1-2 years', '2-3 years', '3-5 years',
//         '5+ years', '8+ years', '10+ years', 'Executive'
//     ];

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setJobData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleRequirementChange = (index, value) => {
//         const newRequirements = [...jobData.requirements];
//         newRequirements[index] = value;
//         setJobData(prev => ({ ...prev, requirements: newRequirements }));
//     };

//     const handleSkillChange = (index, value) => {
//         const newSkills = [...jobData.skills];
//         newSkills[index] = value;
//         setJobData(prev => ({ ...prev, skills: newSkills }));
//     };

//     const addRequirement = () => {
//         setJobData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }));
//     };

//     const removeRequirement = (index) => {
//         const newRequirements = jobData.requirements.filter((_, i) => i !== index);
//         setJobData(prev => ({ ...prev, requirements: newRequirements }));
//     };

//     const addSkill = () => {
//         setJobData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
//     };

//     const removeSkill = (index) => {
//         const newSkills = jobData.skills.filter((_, i) => i !== index);
//         setJobData(prev => ({ ...prev, skills: newSkills }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await addJob(jobData)
//             navigate('/company/job-posts');
//         } catch (error) {
//             console.error(error)
//         }
//     };

//     return (
//         <>
//             <div className="container-fluid">
//                 <div className="container py-5">
//                     <div className="row justify-content-center">
//                         <div className="col-lg-8">
//                             <div className="card border-0 shadow-lg">
//                                 <div className="card-header bg-primary text-white py-3">
//                                     <h2 className="h4 mb-0 text-white">
//                                         <i className="bi bi-file-earmark-plus me-2"></i>Create New Job Post
//                                     </h2>
//                                     <p className="mb-0">
//                                         <i className="bi bi-megaphone me-2"></i>Fill in the details to attract top talent
//                                     </p>
//                                 </div>
//                                 <div className="card-body p-4 p-md-5">
//                                     <form onSubmit={handleSubmit}>
//                                         {/* Basic Information Section */}
//                                         <div className="mb-4">
//                                             <h3 className="h5 mb-3 text-primary">Basic Information</h3>
//                                             <div className="row g-3">
//                                                 <div className="col-md-6">
//                                                     <label htmlFor="title" className="form-label">Job Title*</label>
//                                                     <input
//                                                         type="text"
//                                                         id="title"
//                                                         name="title"
//                                                         value={jobData.title}
//                                                         onChange={handleChange}
//                                                         className="form-control"
//                                                         placeholder="e.g. Senior Frontend Developer"
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div className="col-md-6">
//                                                     <label htmlFor="company" className="form-label">Company Name*</label>
//                                                     <input
//                                                         type="text"
//                                                         id="company"
//                                                         name="company"
//                                                         value={jobData.company}
//                                                         onChange={handleChange}
//                                                         className="form-control"
//                                                         placeholder="Your company name"
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div className="col-md-6">
//                                                     <label htmlFor="location" className="form-label">Location*</label>
//                                                     <input
//                                                         type="text"
//                                                         id="location"
//                                                         name="location"
//                                                         value={jobData.location}
//                                                         onChange={handleChange}
//                                                         className="form-control"
//                                                         placeholder="e.g. San Francisco, CA (Remote)"
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div className="col-md-6">
//                                                     <label htmlFor="salary" className="form-label">Salary Range*</label>
//                                                     <input
//                                                         type="text"
//                                                         id="salary"
//                                                         name="salary"
//                                                         value={jobData.salary}
//                                                         onChange={handleChange}
//                                                         className="form-control"
//                                                         placeholder="e.g. $120,000 - $150,000"
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div className="col-md-6">
//                                                     <label htmlFor="type" className="form-label">Job Type*</label>
//                                                     <select
//                                                         id="type"
//                                                         name="type"
//                                                         value={jobData.type}
//                                                         onChange={handleChange}
//                                                         className="form-select"
//                                                         required
//                                                     >
//                                                         {jobTypes.map((type) => (
//                                                             <option key={type} value={type}>{type}</option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                                 <div className="col-md-6">
//                                                     <label htmlFor="experience" className="form-label">Experience Level*</label>
//                                                     <select
//                                                         id="experience"
//                                                         name="experience"
//                                                         value={jobData.experience}
//                                                         onChange={handleChange}
//                                                         className="form-select"
//                                                         required
//                                                     >
//                                                         <option value="">Select experience level</option>
//                                                         {experienceLevels.map((level) => (
//                                                             <option key={level} value={level}>{level}</option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Job Description Section */}
//                                         <div className="mb-4">
//                                             <h3 className="h5 mb-3 text-primary">Job Description</h3>
//                                             <label htmlFor="description" className="form-label">Detailed Description*</label>
//                                             <textarea
//                                                 id="description"
//                                                 name="description"
//                                                 value={jobData.description}
//                                                 onChange={handleChange}
//                                                 className="form-control"
//                                                 rows="6"
//                                                 placeholder="Describe the role, responsibilities, and what makes your company great to work for..."
//                                                 required
//                                             />
//                                         </div>

//                                         {/* Requirements Section */}
//                                         <div className="mb-4">
//                                             <div className="d-flex justify-content-between align-items-center mb-3">
//                                                 <h3 className="h5 text-primary">Requirements</h3>
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-sm btn-outline-primary"
//                                                     onClick={addRequirement}
//                                                 >
//                                                     <i className="bi bi-plus"></i> Add Requirement
//                                                 </button>
//                                             </div>
//                                             {jobData.requirements.map((req, index) => (
//                                                 <div key={index} className="d-flex mb-2 align-items-center">
//                                                     <input
//                                                         type="text"
//                                                         value={req}
//                                                         onChange={(e) => handleRequirementChange(index, e.target.value)}
//                                                         className="form-control me-2"
//                                                         placeholder={`Requirement #${index + 1}`}
//                                                         required
//                                                     />
//                                                     {jobData.requirements.length > 1 && (
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-outline-danger"
//                                                             onClick={() => removeRequirement(index)}
//                                                         >
//                                                             <i className="bi bi-trash"></i>
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         {/* Skills Section */}
//                                         <div className="mb-4">
//                                             <div className="d-flex justify-content-between align-items-center mb-3">
//                                                 <h3 className="h5 text-primary">Required Skills</h3>
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-sm btn-outline-primary"
//                                                     onClick={addSkill}
//                                                 >
//                                                     <i className="bi bi-plus"></i> Add Skill
//                                                 </button>
//                                             </div>
//                                             <div className="d-flex flex-wrap gap-2">
//                                                 {jobData.skills.map((skill, index) => (
//                                                     <div key={index} className="d-flex align-items-center bg-light rounded p-2">
//                                                         <input
//                                                             type="text"
//                                                             value={skill}
//                                                             onChange={(e) => handleSkillChange(index, e.target.value)}
//                                                             className="form-control form-control-sm border-0 bg-transparent"
//                                                             placeholder="Skill"
//                                                             required
//                                                         />
//                                                         {jobData.skills.length > 1 && (
//                                                             <button
//                                                                 type="button"
//                                                                 className="btn btn-sm btn-link text-danger p-0 ms-1"
//                                                                 onClick={() => removeSkill(index)}
//                                                             >
//                                                                 <i className="bi bi-x-lg"></i>
//                                                             </button>
//                                                         )}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>

//                                         {/* Status Section */}
//                                         <div className="mb-4 p-4 bg-light rounded-3 border">
//                                             <h3 className="h5 mb-3 text-dark fw-semibold">Post Visibility</h3>

//                                             {/* Modern Toggle Buttons */}
//                                             <div className="d-flex flex-column flex-md-row gap-3 mb-3">
//                                                 <div className="flex-grow-1">
//                                                     <div className="btn-group w-100 shadow-sm" role="group">
//                                                         <input
//                                                             type="radio"
//                                                             className="btn-check"
//                                                             name="status"
//                                                             id="status-active"
//                                                             autoComplete="off"
//                                                             checked={jobData.status === 'Active'}
//                                                             onChange={() => setJobData(prev => ({ ...prev, status: 'Active' }))}
//                                                         />
//                                                         <label
//                                                             className={`btn ${jobData.status === 'Active' ? 'btn-success' : 'btn-outline-success'}`}
//                                                             htmlFor="status-active"
//                                                         >
//                                                             <i className="bi bi-eye-fill me-2"></i> Active
//                                                         </label>

//                                                         <input
//                                                             type="radio"
//                                                             className="btn-check"
//                                                             name="status"
//                                                             id="status-inactive"
//                                                             autoComplete="off"
//                                                             checked={jobData.status === 'Inactive'}
//                                                             onChange={() => setJobData(prev => ({ ...prev, status: 'Inactive' }))}
//                                                         />
//                                                         <label
//                                                             className={`btn ${jobData.status === 'Inactive' ? 'btn-warning' : 'btn-outline-warning'}`}
//                                                             htmlFor="status-inactive"
//                                                         >
//                                                             <i className="bi bi-eye-slash-fill me-2"></i> Inactive
//                                                         </label>

//                                                         <input
//                                                             type="radio"
//                                                             className="btn-check"
//                                                             name="status"
//                                                             id="status-draft"
//                                                             autoComplete="off"
//                                                             checked={jobData.status === 'Draft'}
//                                                             onChange={() => setJobData(prev => ({ ...prev, status: 'Draft' }))}
//                                                         />
//                                                         <label
//                                                             className={`btn ${jobData.status === 'Draft' ? 'btn-info' : 'btn-outline-info'}`}
//                                                             htmlFor="status-draft"
//                                                         >
//                                                             <i className="bi bi-file-earmark-text-fill me-2"></i> Draft
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {/* Status Card */}
//                                             <div className={`card border-0 shadow-sm ${jobData.status === 'Active' ? 'border-start border-4 border-success' : jobData.status === 'Inactive' ? 'border-start border-4 border-warning' : 'border-start border-4 border-info'}`}>
//                                                 <div className="card-body p-3">
//                                                     <div className="d-flex align-items-center">
//                                                         {jobData.status === 'Active' && (
//                                                             <>
//                                                                 <div className="bg-success bg-opacity-10 p-2 rounded me-3">
//                                                                     <i className="bi bi-check-circle-fill text-success fs-4"></i>
//                                                                 </div>
//                                                                 <div>
//                                                                     <h6 className="mb-1 text-success">Visible to Candidates</h6>
//                                                                     <p className="small text-muted mb-0">This job post is live and accepting applications</p>
//                                                                 </div>
//                                                             </>
//                                                         )}
//                                                         {jobData.status === 'Inactive' && (
//                                                             <>
//                                                                 <div className="bg-warning bg-opacity-10 p-2 rounded me-3">
//                                                                     <i className="bi bi-pause-circle-fill text-warning fs-4"></i>
//                                                                 </div>
//                                                                 <div>
//                                                                     <h6 className="mb-1 text-warning">Hidden from Candidates</h6>
//                                                                     <p className="small text-muted mb-0">This job post is saved but not visible publicly</p>
//                                                                 </div>
//                                                             </>
//                                                         )}
//                                                         {jobData.status === 'Draft' && (
//                                                             <>
//                                                                 <div className="bg-info bg-opacity-10 p-2 rounded me-3">
//                                                                     <i className="bi bi-file-earmark-text-fill text-info fs-4"></i>
//                                                                 </div>
//                                                                 <div>
//                                                                     <h6 className="mb-1 text-info">Draft Mode</h6>
//                                                                     <p className="small text-muted mb-0">Saved but not published</p>
//                                                                 </div>
//                                                             </>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Form Actions */}
//                                         <div className="d-flex justify-content-end gap-3 mt-5">
//                                             <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => navigate('/company/job-posts')}>
//                                                 Cancel
//                                             </button>
//                                             <button type="submit" className="btn btn-primary btn-sm px-4">
//                                                 Post Job
//                                             </button>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default CompanyCreateJobPost;















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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [activeSection, setActiveSection] = useState('basic');

    const { addJob } = useCompanyContext();

    const jobTypes = [
        'Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship',
        'Freelance', 'Seasonal', 'Volunteer', 'Apprenticeship',
        'Remote', 'Hybrid', 'On-site', 'Consultant'
    ];

    const experienceLevels = [
        'Entry Level', '1-2 years', '2-3 years', '3-5 years',
        '5+ years', '8+ years', '10+ years', 'Executive'
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!jobData.title.trim()) newErrors.title = 'Job title is required';
        if (!jobData.company.trim()) newErrors.company = 'Company name is required';
        if (!jobData.location.trim()) newErrors.location = 'Location is required';
        if (!jobData.salary.trim()) newErrors.salary = 'Salary range is required';
        if (!jobData.experience) newErrors.experience = 'Experience level is required';
        if (!jobData.description.trim()) newErrors.description = 'Job description is required';

        // Check if all requirements are filled
        const emptyRequirements = jobData.requirements.filter(req => !req.trim());
        if (emptyRequirements.length > 0) {
            newErrors.requirements = 'All requirements must be filled or removed';
        }

        // Check if all skills are filled
        const emptySkills = jobData.skills.filter(skill => !skill.trim());
        if (emptySkills.length > 0) {
            newErrors.skills = 'All skills must be filled or removed';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleRequirementChange = (index, value) => {
        const newRequirements = [...jobData.requirements];
        newRequirements[index] = value;
        setJobData(prev => ({ ...prev, requirements: newRequirements }));
        // Clear error when user starts typing
        if (errors.requirements) {
            setErrors(prev => ({ ...prev, requirements: '' }));
        }
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...jobData.skills];
        newSkills[index] = value;
        setJobData(prev => ({ ...prev, skills: newSkills }));
        // Clear error when user starts typing
        if (errors.skills) {
            setErrors(prev => ({ ...prev, skills: '' }));
        }
    };

    const addRequirement = () => {
        setJobData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }));
    };

    const removeRequirement = (index) => {
        if (jobData.requirements.length > 1) {
            const newRequirements = jobData.requirements.filter((_, i) => i !== index);
            setJobData(prev => ({ ...prev, requirements: newRequirements }));
        }
    };

    const addSkill = () => {
        setJobData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
    };

    const removeSkill = (index) => {
        if (jobData.skills.length > 1) {
            const newSkills = jobData.skills.filter((_, i) => i !== index);
            setJobData(prev => ({ ...prev, skills: newSkills }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Find the first section with an error and activate it
            if (errors.title || errors.company || errors.location || errors.salary || errors.experience) {
                setActiveSection('basic');
            } else if (errors.description) {
                setActiveSection('description');
            } else if (errors.requirements) {
                setActiveSection('requirements');
            } else if (errors.skills) {
                setActiveSection('skills');
            }
            return;
        }

        setIsSubmitting(true);
        try {
            await addJob(jobData);
            navigate('/company/job-posts');
        } catch (error) {
            console.error(error);
            setErrors({ submit: 'Failed to create job post. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const sections = [
        { id: 'basic', label: 'Basic Info', icon: 'bi-info-circle' },
        { id: 'description', label: 'Description', icon: 'bi-file-text' },
        { id: 'requirements', label: 'Requirements', icon: 'bi-check-square' },
        { id: 'skills', label: 'Skills', icon: 'bi-tools' },
        { id: 'status', label: 'Status', icon: 'bi-eye' }
    ];

    return (
        <div className="container-fluid">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {/* Header */}
                        <div className="text-center mb-4">
                            <h1 className="display-5 fw-bold text-primary mb-2">Create New Job Post</h1>
                            <p className="lead text-muted">Fill in the details to attract top talent</p>
                        </div>

                        {/* Progress Indicator */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    {sections.map((section, index) => (
                                        <div key={section.id} className="d-flex align-items-center">
                                            <button
                                                className={`btn rounded-circle p-2 ${activeSection === section.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                onClick={() => setActiveSection(section.id)}
                                            >
                                                <i className={`bi ${section.icon}`}></i>
                                            </button>
                                            <span className={`ms-2 d-none d-md-inline ${activeSection === section.id ? 'fw-bold text-primary' : 'text-muted'}`}>
                                                {section.label}
                                            </span>
                                            {index < sections.length - 1 && (
                                                <div className={`mx-3 d-none d-md-block ${activeSection === section.id || (index > 0 && sections[index - 1].id === activeSection) ? 'border-top border-primary' : 'border-top border-light'}`} style={{ width: '50px' }}></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Form Card */}
                        <div className="card border-0 shadow-lg">
                            <div className="card-header bg-primary text-white py-3">
                                <h2 className="h4 mb-0 text-white">
                                    <i className="bi bi-file-earmark-plus me-2"></i>Job Details
                                </h2>
                            </div>
                            <div className="card-body p-4 p-md-5">
                                {errors.submit && (
                                    <div className="alert alert-danger" role="alert">
                                        {errors.submit}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    {/* Basic Information Section */}
                                    {activeSection === 'basic' && (
                                        <div className="animate-fadeIn">
                                            <h3 className="h5 mb-4 text-primary">
                                                <i className="bi bi-info-circle me-2"></i>Basic Information
                                            </h3>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label htmlFor="title" className="form-label fw-semibold">Job Title*</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="bi bi-briefcase"></i></span>
                                                        <input
                                                            type="text"
                                                            id="title"
                                                            name="title"
                                                            value={jobData.title}
                                                            onChange={handleChange}
                                                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                            placeholder="e.g. Senior Frontend Developer"
                                                        />
                                                    </div>
                                                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="company" className="form-label fw-semibold">Company Name*</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="bi bi-building"></i></span>
                                                        <input
                                                            type="text"
                                                            id="company"
                                                            name="company"
                                                            value={jobData.company}
                                                            onChange={handleChange}
                                                            className={`form-control ${errors.company ? 'is-invalid' : ''}`}
                                                            placeholder="Your company name"
                                                        />
                                                    </div>
                                                    {errors.company && <div className="invalid-feedback">{errors.company}</div>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="location" className="form-label fw-semibold">Location*</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="bi bi-geo-alt"></i></span>
                                                        <input
                                                            type="text"
                                                            id="location"
                                                            name="location"
                                                            value={jobData.location}
                                                            onChange={handleChange}
                                                            className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                                                            placeholder="e.g. San Francisco, CA (Remote)"
                                                        />
                                                    </div>
                                                    {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="salary" className="form-label fw-semibold">Salary Range*</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="bi bi-currency-dollar"></i></span>
                                                        <input
                                                            type="text"
                                                            id="salary"
                                                            name="salary"
                                                            value={jobData.salary}
                                                            onChange={handleChange}
                                                            className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                                                            placeholder="e.g. $120,000 - $150,000"
                                                        />
                                                    </div>
                                                    {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="type" className="form-label fw-semibold">Job Type*</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="bi bi-clock"></i></span>
                                                        <select
                                                            id="type"
                                                            name="type"
                                                            value={jobData.type}
                                                            onChange={handleChange}
                                                            className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                                                        >
                                                            {jobTypes.map((type) => (
                                                                <option key={type} value={type}>{type}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="experience" className="form-label fw-semibold">Experience Level*</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="bi bi-graph-up"></i></span>
                                                        <select
                                                            id="experience"
                                                            name="experience"
                                                            value={jobData.experience}
                                                            onChange={handleChange}
                                                            className={`form-select ${errors.experience ? 'is-invalid' : ''}`}
                                                        >
                                                            <option value="">Select experience level</option>
                                                            {experienceLevels.map((level) => (
                                                                <option key={level} value={level}>{level}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-end mt-4">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => setActiveSection('description')}
                                                >
                                                    Next <i className="bi bi-arrow-right ms-2"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Job Description Section */}
                                    {activeSection === 'description' && (
                                        <div className="animate-fadeIn">
                                            <h3 className="h5 mb-4 text-primary">
                                                <i className="bi bi-file-text me-2"></i>Job Description
                                            </h3>
                                            <div className="mb-4">
                                                <label htmlFor="description" className="form-label fw-semibold">Detailed Description*</label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    value={jobData.description}
                                                    onChange={handleChange}
                                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                    rows="8"
                                                    placeholder="Describe the role, responsibilities, and what makes your company great to work for..."
                                                />
                                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                                <div className="form-text">
                                                    <i className="bi bi-info-circle me-1"></i>
                                                    A detailed description helps attract qualified candidates
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-between mt-4">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => setActiveSection('basic')}
                                                >
                                                    <i className="bi bi-arrow-left me-2"></i> Previous
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => setActiveSection('requirements')}
                                                >
                                                    Next <i className="bi bi-arrow-right ms-2"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Requirements Section */}
                                    {activeSection === 'requirements' && (
                                        <div className="animate-fadeIn">
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h3 className="h5 text-primary mb-0">
                                                    <i className="bi bi-check-square me-2"></i>Requirements
                                                </h3>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={addRequirement}
                                                >
                                                    <i className="bi bi-plus-circle me-1"></i> Add Requirement
                                                </button>
                                            </div>

                                            {errors.requirements && (
                                                <div className="alert alert-warning" role="alert">
                                                    {errors.requirements}
                                                </div>
                                            )}

                                            <div className="bg-light p-3 rounded-3 mb-4">
                                                {jobData.requirements.map((req, index) => (
                                                    <div key={index} className="d-flex mb-3 align-items-center">
                                                        <span className="badge bg-primary rounded-circle p-2 me-3">
                                                            {index + 1}
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={req}
                                                            onChange={(e) => handleRequirementChange(index, e.target.value)}
                                                            className="form-control me-2"
                                                            placeholder={`Requirement #${index + 1}`}
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

                                            <div className="d-flex justify-content-between mt-4">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => setActiveSection('description')}
                                                >
                                                    <i className="bi bi-arrow-left me-2"></i> Previous
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => setActiveSection('skills')}
                                                >
                                                    Next <i className="bi bi-arrow-right ms-2"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Skills Section */}
                                    {activeSection === 'skills' && (
                                        <div className="animate-fadeIn">
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h3 className="h5 text-primary mb-0">
                                                    <i className="bi bi-tools me-2"></i>Required Skills
                                                </h3>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={addSkill}
                                                >
                                                    <i className="bi bi-plus-circle me-1"></i> Add Skill
                                                </button>
                                            </div>

                                            {errors.skills && (
                                                <div className="alert alert-warning" role="alert">
                                                    {errors.skills}
                                                </div>
                                            )}

                                            <div className="bg-light p-3 rounded-3 mb-4">
                                                <div className="d-flex flex-wrap gap-2">
                                                    {jobData.skills.map((skill, index) => (
                                                        <div key={index} className="d-flex align-items-center bg-white rounded p-2 shadow-sm">
                                                            <input
                                                                type="text"
                                                                value={skill}
                                                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                                                className="form-control form-control-sm border-0 bg-transparent"
                                                                placeholder="Skill"
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

                                            <div className="d-flex justify-content-between mt-4">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => setActiveSection('requirements')}
                                                >
                                                    <i className="bi bi-arrow-left me-2"></i> Previous
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => setActiveSection('status')}
                                                >
                                                    Next <i className="bi bi-arrow-right ms-2"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Status Section */}
                                    {activeSection === 'status' && (
                                        <div className="animate-fadeIn">
                                            <h3 className="h5 mb-4 text-primary">
                                                <i className="bi bi-eye me-2"></i>Post Visibility
                                            </h3>

                                            <div className="row g-3 mb-4">
                                                <div className="col-md-4">
                                                    <div className={`card h-100 border-2 ${jobData.status === 'Active' ? 'border-success bg-success bg-opacity-5' : 'border-light'}`}>
                                                        <div className="card-body text-center p-3">
                                                            <input
                                                                type="radio"
                                                                className="form-check-input d-none"
                                                                name="status"
                                                                id="status-active"
                                                                checked={jobData.status === 'Active'}
                                                                onChange={() => setJobData(prev => ({ ...prev, status: 'Active' }))}
                                                            />
                                                            <label htmlFor="status-active" className="w-100 cursor-pointer">
                                                                <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-block mb-2">
                                                                    <i className="bi bi-eye-fill text-success fs-4"></i>
                                                                </div>
                                                                <h6 className="mb-1">Active</h6>
                                                                <p className="small text-muted mb-0">Visible to candidates</p>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className={`card h-100 border-2 ${jobData.status === 'Inactive' ? 'border-warning bg-warning bg-opacity-5' : 'border-light'}`}>
                                                        <div className="card-body text-center p-3">
                                                            <input
                                                                type="radio"
                                                                className="form-check-input d-none"
                                                                name="status"
                                                                id="status-inactive"
                                                                checked={jobData.status === 'Inactive'}
                                                                onChange={() => setJobData(prev => ({ ...prev, status: 'Inactive' }))}
                                                            />
                                                            <label htmlFor="status-inactive" className="w-100 cursor-pointer">
                                                                <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-block mb-2">
                                                                    <i className="bi bi-eye-slash-fill text-warning fs-4"></i>
                                                                </div>
                                                                <h6 className="mb-1">Inactive</h6>
                                                                <p className="small text-muted mb-0">Hidden from candidates</p>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className={`card h-100 border-2 ${jobData.status === 'Draft' ? 'border-info bg-info bg-opacity-5' : 'border-light'}`}>
                                                        <div className="card-body text-center p-3">
                                                            <input
                                                                type="radio"
                                                                className="form-check-input d-none"
                                                                name="status"
                                                                id="status-draft"
                                                                checked={jobData.status === 'Draft'}
                                                                onChange={() => setJobData(prev => ({ ...prev, status: 'Draft' }))}
                                                            />
                                                            <label htmlFor="status-draft" className="w-100 cursor-pointer">
                                                                <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-block mb-2">
                                                                    <i className="bi bi-file-earmark-text-fill text-info fs-4"></i>
                                                                </div>
                                                                <h6 className="mb-1">Draft</h6>
                                                                <p className="small text-muted mb-0">Saved but not published</p>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`alert ${jobData.status === 'Active' ? 'alert-success' : jobData.status === 'Inactive' ? 'alert-warning' : 'alert-info'} d-flex align-items-center`} role="alert">
                                                <i className={`bi ${jobData.status === 'Active' ? 'bi-check-circle-fill' : jobData.status === 'Inactive' ? 'bi-pause-circle-fill' : 'bi-file-earmark-text-fill'} me-2`}></i>
                                                <div>
                                                    <strong>{jobData.status === 'Active' ? 'Visible to Candidates' : jobData.status === 'Inactive' ? 'Hidden from Candidates' : 'Draft Mode'}</strong>
                                                    <p className="mb-0">
                                                        {jobData.status === 'Active'
                                                            ? 'This job post will be live and accepting applications'
                                                            : jobData.status === 'Inactive'
                                                                ? 'This job post will be saved but not visible publicly'
                                                                : 'This job post will be saved but not published'
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-between mt-4">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => setActiveSection('skills')}
                                                >
                                                    <i className="bi bi-arrow-left me-2"></i> Previous
                                                </button>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => navigate('/company/job-posts')}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-sm btn-primary px-4"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                Creating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-check-circle me-2"></i>
                                                                Create Job Post
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .cursor-pointer {
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default CompanyCreateJobPost;