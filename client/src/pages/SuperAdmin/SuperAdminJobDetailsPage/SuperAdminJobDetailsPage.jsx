// import { useNavigate, useLocation } from 'react-router-dom';

// const SuperAdminJobDetailsPage = () => {
//     const location = useLocation();
//     const job = location.state?.job;
//     const navigate = useNavigate();
//     // In a real app, you'd fetch this data based on the ID
//     // const job = {
//     //     "_id": "68107e9b2172d6f22a11e0c0",
//     //     "title": "Front-End Developer",
//     //     "company": "PixelSoft",
//     //     "location": "New York, NY",
//     //     "salary": "$110,000 - $130,000",
//     //     "type": "Full-time",
//     //     "experience": "3-5 years",
//     //     "posted": "2025-04-09T09:30:00.000Z",
//     //     "description": "We're looking for a skilled Front-End Developer to join our growing team. You'll be responsible for building responsive web interfaces using modern frameworks and collaborating with our design team to create seamless user experiences.",
//     //     "responsibilities": [
//     //         "Develop new user-facing features",
//     //         "Build reusable code and libraries for future use",
//     //         "Ensure technical feasibility of UI/UX designs",
//     //         "Optimize applications for maximum speed and scalability",
//     //         "Collaborate with back-end developers and web designers"
//     //     ],
//     //     "requirements": [
//     //         "3+ years experience with React",
//     //         "Proficient understanding of web markup, including HTML5, CSS3",
//     //         "Strong understanding of state management (Redux, Context API)",
//     //         "Experience with responsive and adaptive design",
//     //         "Familiarity with RESTful APIs"
//     //     ],
//     //     "skills": [
//     //         "React",
//     //         "JavaScript (ES6+)",
//     //         "CSS3/SASS",
//     //         "HTML5",
//     //         "Redux",
//     //         "Git"
//     //     ],
//     //     "benefits": [
//     //         "Health, dental, and vision insurance",
//     //         "401(k) matching",
//     //         "Flexible work hours",
//     //         "Remote work options",
//     //         "Professional development budget",
//     //         "Generous PTO"
//     //     ],
//     //     "applicants": 12,
//     //     "status": "Active",
//     //     "applicationDeadline": "2025-05-15T00:00:00.000Z"
//     // };

//     return (
//         <div className="container-fluid bg-light">
//             <div className="container py-5">
//                 {/* Back Button */}
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="btn btn-outline-secondary mb-4"
//                 >
//                     <i className="bi bi-arrow-left me-2"></i> Back to Jobs
//                 </button>

//                 {/* Main Job Card */}
//                 <div className="card shadow-sm mb-5">
//                     <div className="card-body p-4">
//                         <div className="row">
//                             <div className="col-md-8">
//                                 <div className="d-flex align-items-start mb-4">
//                                     <div className="flex-grow-1">
//                                         <h1 className="h2 mb-2">{job.title}</h1>
//                                         <h2 className="h4 text-muted mb-3">{job.company}</h2>

//                                         <div className="d-flex flex-wrap gap-3 mb-4">
//                                             <span className="badge bg-primary bg-opacity-10 text-primary">
//                                                 <i className="bi bi-briefcase me-1"></i> {job.type}
//                                             </span>
//                                             <span className="badge bg-secondary bg-opacity-10 text-secondary">
//                                                 <i className="bi bi-geo-alt me-1"></i> {job.location}
//                                             </span>
//                                             <span className="badge bg-success bg-opacity-10 text-success">
//                                                 <i className="bi bi-cash-stack me-1"></i> {job.salary}
//                                             </span>
//                                             <span className="badge bg-info bg-opacity-10 text-info">
//                                                 <i className="bi bi-person me-1"></i> {job.experience}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     <div className="text-end">
//                                         <span className="d-block text-muted small mb-2">
//                                             Posted: {new Date(job.posted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}

//                                         </span>
//                                         <span className="d-block text-muted small mb-3">
//                                             {job.applicants} {job.applicants === 1 ? 'applicant' : 'applicants'}
//                                         </span>
//                                         <button className="btn btn-primary btn-lg px-4">
//                                             Apply Now <i className="bi bi-send ms-2"></i>
//                                         </button>
//                                     </div>
//                                 </div>

//                                 {/* Job Description */}
//                                 <section className="mb-5">
//                                     <h3 className="h5 mb-3">Job Description</h3>
//                                     <p className="mb-4">{job.description}</p>
//                                 </section>

//                                 {/* Requirements & Skills */}
//                                 <div className="row">
//                                     <div className="col-12 mb-4">
//                                         <section>
//                                             <h3 className="h5 mb-3">Requirements</h3>
//                                             <ul className="list-unstyled">
//                                                 {job.requirements.map((req, i) => (
//                                                     <li key={i} className="mb-2 d-flex">
//                                                         <i className="bi bi-check-circle text-primary mt-1 me-2"></i>
//                                                         <span>{req}</span>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </section>
//                                     </div>

//                                     <div className="col-12 mb-4">
//                                         <section>
//                                             <h3 className="h5 mb-3">Skills</h3>
//                                             <div className="d-flex flex-wrap gap-2">
//                                                 {job.skills.map((skill, i) => (
//                                                     <span key={i} className="badge bg-light text-dark">
//                                                         {skill}
//                                                     </span>
//                                                 ))}
//                                             </div>
//                                         </section>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Sidebar */}
//                             <div className="col-md-4">
//                                 <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
//                                     <div className="card-body">
//                                         <h3 className="h5 mb-4">Job Summary</h3>

//                                         <ul className="list-group list-group-flush mb-4">
//                                             <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
//                                                 <span className="text-muted">Job Type</span>
//                                                 <span>{job.type}</span>
//                                             </li>
//                                             <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
//                                                 <span className="text-muted">Location</span>
//                                                 <span>{job.location}</span>
//                                             </li>
//                                             <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
//                                                 <span className="text-muted">Salary</span>
//                                                 <span>{job.salary}</span>
//                                             </li>
//                                             <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
//                                                 <span className="text-muted">Experience</span>
//                                                 <span>{job.experience}</span>
//                                             </li>
//                                             <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
//                                                 <span className="text-muted">Posted</span>
//                                                 <span>{new Date(job.posted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
//                                             </li>
//                                             <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
//                                                 <span className="text-muted">Deadline</span>
//                                                 <span>{new Date(job.applicationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
//                                             </li>
//                                         </ul>

//                                         <button className="btn btn-primary w-100 mb-3">
//                                             Apply Now
//                                         </button>
//                                         <button className="btn btn-outline-secondary w-100">
//                                             Save Job
//                                         </button>

//                                         {/* Share Options */}
//                                         <div className="mt-4 pt-3 border-top">
//                                             <h4 className="h6 mb-3">Share this job:</h4>
//                                             <div className="d-flex gap-2">
//                                                 <button className="btn btn-sm btn-outline-primary">
//                                                     <i className="bi bi-linkedin"></i>
//                                                 </button>
//                                                 <button className="btn btn-sm btn-outline-info">
//                                                     <i className="bi bi-twitter"></i>
//                                                 </button>
//                                                 <button className="btn btn-sm btn-outline-secondary">
//                                                     <i className="bi bi-envelope"></i>
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Application CTA */}
//                         <section className="mt-5 pt-4 border-top">
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div>
//                                     <h3 className="h5 mb-2">Ready to apply?</h3>
//                                     <p className="text-muted mb-0">
//                                         Application deadline: {new Date(job.posted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                                     </p>
//                                 </div>
//                                 <button className="btn btn-primary btn-lg px-5">
//                                     Apply Now <i className="bi bi-send ms-2"></i>
//                                 </button>
//                             </div>
//                         </section>
//                     </div>
//                 </div>

//                 {/* Similar Jobs Section */}
//                 <section className="mb-5">
//                     <h2 className="h4 mb-4">Similar Jobs</h2>
//                     <div className="row">
//                         {/* These would be dynamically populated in a real app */}
//                         <div className="col-md-4 mb-4">
//                             <div className="card h-100 shadow-sm">
//                                 <div className="card-body">
//                                     <h3 className="h5 mb-1">React Developer</h3>
//                                     <p className="text-muted small mb-2">TechSolutions Inc.</p>
//                                     <div className="d-flex flex-wrap gap-2 mb-3">
//                                         <span className="badge bg-light text-dark small">Full-time</span>
//                                         <span className="badge bg-light text-dark small">Remote</span>
//                                         <span className="badge bg-light text-dark small">$100k-$120k</span>
//                                     </div>
//                                     <button className="btn btn-sm btn-outline-primary w-100">
//                                         View Details
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Add 2 more similar job cards */}
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// };

// export default SuperAdminJobDetailsPage;






import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSuperAdminContext } from '../../../context/superadmin-context';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';

const SuperAdminJobDetailsPage = () => {

    const { jobId } = useParams()
    const navigate = useNavigate();
    const {
        isLoading, getDetailsOfSingleJob, jobDetails: job,
        handleChangeStatus, handleMarkAsFlag, handleMarkAsUnFlag,
        handleConfirmDeleteJob
    } = useSuperAdminContext()


    useEffect(() => {
        getDetailsOfSingleJob(jobId)
    }, [])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);

    const handleDeleteJobModal = (jobId) => {
        setJobToDelete(jobId);
        setIsModalOpen(true);
    };

    const changeStatus = async (status, id) => {
        try {
            await handleChangeStatus(status, id)
            await getDetailsOfSingleJob(id)
        } catch (error) {
            console.error("Failed to delete job:", error);
        }
    }

    const markAsFlag = async (id) => {
        try {
            await handleMarkAsFlag(id)
            await getDetailsOfSingleJob(id)
        } catch (error) {
            console.error("Failed to delete job:", error);
        }
    }

    const removeFlag = async (id) => {
        try {
            await handleMarkAsUnFlag(id)
            await getDetailsOfSingleJob(id)
        } catch (error) {
            console.error("Failed to delete job:", error);
        }
    }

    const handleDeleteJob = async () => {
        try {
            await handleConfirmDeleteJob(jobToDelete);
            setIsModalOpen(false);
            setJobToDelete(null);
            navigate(`/superadmin/companiesJobs/${job?.userId}`);
        } catch (error) {
            console.error("Failed to delete job:", error);
        }
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setJobToDelete(null);
    };

    const handleViewApplicants = (jobId) => navigate(`/superadmin/jobs/${jobId}/viewallapplicants`);

    if (isLoading) {
        return (
            <>
                <div className="container-fluid">
                    <div className="container mt-5 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading your applications...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="container-fluid">
                <div className="container py-5">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-sm btn-outline-primary mb-4"
                    >
                        <i className="bi bi-arrow-left me-2"></i> Back to Jobs
                    </button>

                    {/* Admin Action Bar */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body py-2">
                            <div className="d-flex justify-content-between align-items-center flex-column flex-md-row gap-3 gap-md-0">
                                <h2 className="h5 mb-0">Admin Actions</h2>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleViewApplicants(job._id)}
                                    >
                                        <i className="bi bi-people me-1"></i> View Applicants
                                    </button>

                                    <div className="dropdown">
                                        <button
                                            className="btn btn-secondary btn-sm dropdown-toggle"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i className="bi bi-gear me-1"></i> Change Status
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => changeStatus('Active', job._id)}
                                                >
                                                    <i className="bi bi-check-circle text-success me-2"></i> Set Active
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => changeStatus('Inactive', job._id)}
                                                >
                                                    <i className="bi bi-pause-circle text-warning me-2"></i> Set Inactive
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item text-danger"
                                                    onClick={() => changeStatus('Draft', job._id)}
                                                >
                                                    <i className="bi bi-archive text-danger me-2"></i> Draft
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Job Card */}
                    <div className="card shadow-sm mb-5">
                        <div className="card-body p-4">
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="border-bottom pb-3 mb-4">
                                        {/* Main Header Row */}
                                        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">

                                            {/* Job Title & Company */}
                                            <div className="flex-grow-1">
                                                <h1 className="display-6 fw-bold mb-2 text-break">{job.title}</h1>
                                                <h2 className="h5 text-muted mb-3">{job.company}</h2>

                                                {/* Badges - Responsive Layout */}
                                                <div className="d-flex flex-wrap align-items-center gap-2">
                                                    <span
                                                        className={`badge rounded-pill ${job.status === 'Active' ? 'bg-success bg-opacity-10 text-success' :
                                                            job.status === 'Inactive' ? 'bg-warning bg-opacity-10 text-warning' :
                                                                'bg-danger bg-opacity-10 text-danger'}`}
                                                    >
                                                        {job.status}
                                                    </span>
                                                    <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary d-flex align-items-center">
                                                        <i className="bi bi-briefcase me-1"></i>
                                                        <span className="d-none d-sm-inline">{job.type}</span>
                                                        <span className="d-inline d-sm-none">FT</span>
                                                    </span>

                                                    <span className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary d-flex align-items-center">
                                                        <i className="bi bi-geo-alt me-1"></i>
                                                        <span className="d-none d-md-inline">{job.location}</span>
                                                        <span className="d-inline d-md-none">NY</span>
                                                    </span>

                                                    <span className="badge rounded-pill bg-success bg-opacity-10 text-success d-flex align-items-center">
                                                        <i className="bi bi-cash-stack me-1"></i>
                                                        <span className="d-none d-lg-inline">{job.salary}</span>
                                                        <span className="d-inline d-lg-none">$120k</span>
                                                    </span>

                                                    <span className="badge rounded-pill bg-info bg-opacity-10 text-info d-flex align-items-center">
                                                        <i className="bi bi-person-badge me-1"></i>
                                                        <span>{job.experience}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Dates Section */}
                                            <div className="flex-shrink-0">
                                                <div className="d-flex flex-column gap-1 text-lg-end">
                                                    <span className="text-muted small d-flex align-items-center justify-content-lg-end">
                                                        <i className="bi bi-calendar3 me-2 d-lg-none"></i>
                                                        <span>
                                                            <span className="d-none d-lg-inline">Posted: </span>
                                                            {new Date(job.posted).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </span>

                                                    <span className="text-muted small d-flex align-items-center justify-content-lg-end">
                                                        <i className="bi bi-arrow-repeat me-2 d-lg-none"></i>
                                                        <span>
                                                            <span className="d-none d-lg-inline">Updated: </span>
                                                            {new Date(job.updatedAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Details Sections */}
                                    <section className="mb-5">
                                        <h3 className="h5 mb-3">Job Description</h3>
                                        <p className="mb-4">{job.description}</p>
                                    </section>

                                    {/* Requirements & Skills */}
                                    <div className="row">
                                        <div className="col-md-6 mb-4">
                                            <section>
                                                <h3 className="h5 mb-3">Requirements</h3>
                                                <ul className="list-unstyled">
                                                    {job?.requirements?.map((req, i) => (
                                                        <li key={i} className="mb-2 d-flex">
                                                            <i className="bi bi-check-circle text-primary mt-1 me-2"></i>
                                                            <span>{req}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </section>
                                        </div>

                                        <div className="col-md-6 mb-4">
                                            <section>
                                                <h3 className="h5 mb-3">Skills</h3>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {job?.skills?.map((skill, i) => (
                                                        <span key={i} className="badge bg-light text-dark">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Sidebar */}
                                <div className="col-md-4">
                                    <div className="card shadow-sm sticky-top" style={{ top: '20px', zIndex: "2" }}>
                                        <div className="card-body">
                                            <h3 className="h5 mb-4">Job Statistics</h3>

                                            <ul className="list-group list-group-flush mb-4">
                                                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                                                    <span className="text-muted">Total Applicants</span>
                                                    <span className="badge bg-primary rounded-pill">{job.applicants}</span>
                                                </li>
                                                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                                                    <span className="text-muted">Experience Level</span>
                                                    <span>{job.experience}</span>
                                                </li>
                                                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                                                    <span className="text-muted">Job Type</span>
                                                    <span>{job.type}</span>
                                                </li>
                                                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                                                    <span className="text-muted">Last Updated</span>
                                                    <span>
                                                        {new Date(job.updatedAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </li>
                                            </ul>

                                            <div className="d-grid gap-2">
                                                {/* View Applicants Button */}
                                                <button
                                                    className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                                                    onClick={() => handleViewApplicants(job._id)}
                                                >
                                                    <i className="bi bi-people-fill me-2"></i>
                                                    <span>View Applicants</span>
                                                </button>

                                                {/* Flag/Fraud Button */}
                                                <button
                                                    className={`btn w-100 d-flex align-items-center justify-content-center ${job.isFlagged ? 'btn-danger' : 'btn-outline-warning'}`}
                                                    onClick={() => job.isFlagged ? removeFlag(job._id) : markAsFlag(job._id)}
                                                >
                                                    <i className="bi bi-flag-fill me-2"></i>
                                                    <span>{job.isFlagged ? 'Remove Flag' : 'Mark as Flagged/Fraud'}</span>
                                                </button>

                                                {/* Delete Job Button */}
                                                <button
                                                    className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                                                    onClick={() => handleDeleteJobModal(job._id)}
                                                >
                                                    <i className="bi bi-trash-fill me-2"></i>
                                                    <span>Delete Job</span>
                                                </button>
                                            </div>

                                            {/* Quick Status Change */}
                                            <div className="mt-4 pt-3 border-top">
                                                <h4 className="h6 mb-3">Quick Status Update</h4>
                                                <div className="d-flex flex-wrap gap-2">
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => changeStatus('Active', job._id)}
                                                    >
                                                        Active
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() => changeStatus('Inactive', job._id)}
                                                    >
                                                        Pause
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => changeStatus('Draft', job._id)}
                                                    >
                                                        Draft
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DeleteConfirmationModal
                            isOpen={isModalOpen}
                            onClose={handleCancelDelete}
                            onConfirm={handleDeleteJob}
                        />
                    </div>

                    {/* Applicant Preview - Removed since we only have applicant count */}
                    {/* <div className="alert alert-info">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-info-circle-fill me-2"></i>
                            <div>
                                <h4 className="h6 mb-1">Applicant Management</h4>
                                <p className="mb-0">This job has {job.applicants} applicants. Click "View Applicants" to manage them.</p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </>

    );
};

export default SuperAdminJobDetailsPage;