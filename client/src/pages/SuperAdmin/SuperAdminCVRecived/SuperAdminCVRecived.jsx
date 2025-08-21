import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../../../context/auth-context';
import toast from 'react-hot-toast';

const SuperAdminCVRecived = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { server, token } = useAuthContext();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${server}/api/v1/superadmin/cvforinterview`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setJobs(response.data.data);
                setLoading(false);
            } catch (err) {
                toast.error(err.response.data.message);
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const handleViewCVs = (jobId) => {
        navigate(`/superadmin/cv-received/${jobId}`);
    };

    if (loading) return (
        <div className="container-fluid">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );

    if (jobs.length === 0) {
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10">
                        <div className="card border-0 shadow-sm rounded-lg">
                            <div className="card-body p-4 p-md-5 text-center">
                                <div className="text-muted mb-4">
                                    <i className="bi bi-file-earmark-excel display-4"></i>
                                </div>
                                <h3 className="h4 mb-3">No CVs Received Yet</h3>
                                <p className="text-muted mb-4">There are currently no job postings with received CVs.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-lg overflow-hidden mb-4">
                        <div className="card-header bg-primary text-white py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h2 className="h5 mb-0">Received CVs</h2>
                                <span className="badge bg-white text-primary">{jobs.length} Jobs</span>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="py-3 px-3">Job Title</th>
                                            <th className="py-3 px-3 d-none d-md-table-cell">Company</th>
                                            <th className="py-3 px-3 d-none d-sm-table-cell">Location</th>
                                            <th className="py-3 px-3 text-center">CVs</th>
                                            <th className="py-3 px-3 text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobs.map((job) => (
                                            <tr key={job._id} className="align-middle">
                                                <td className="py-3 px-3 fw-semibold">
                                                    <div className="d-flex flex-column">
                                                        <span>{job.title}</span>
                                                        <small className="text-muted d-md-none">{job.company}</small>
                                                        <small className="text-muted d-sm-none">{job.location}</small>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 d-none d-md-table-cell">{job.company}</td>
                                                <td className="py-3 px-3 d-none d-sm-table-cell">{job.location}</td>
                                                <td className="py-3 px-3 text-center">
                                                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                                                        {job.CvFile ? job.CvFile.length : 0}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3 text-end">
                                                    <button
                                                        onClick={() => handleViewCVs(job._id)}
                                                        className="btn btn-sm btn-outline-primary rounded-pill"
                                                    >
                                                        <i className="bi bi-eye-fill me-1"></i> View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer bg-light py-3">
                            <small className="text-muted">Showing {jobs.length} job listings with received CVs</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminCVRecived;




