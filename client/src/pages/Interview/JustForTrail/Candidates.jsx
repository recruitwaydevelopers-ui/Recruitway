import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./Layout";

const Candidates = () => {
    // const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        resumeUrl: "",
        imageUrl: "",
    });

    // const fetchCandidates = async () => {
    //     try {
    //         const res = await axios.get("http://localhost:4000/api/candidates");
    //         setCandidates(res.data);
    //     } catch (error) {
    //         toast.error("Failed to load candidates");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchCandidates();
    // }, []);



    const candidates = [
        {
            _id: '661b0d0f0f1a0a001b9c0001',
            name: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            phone: '+1-202-555-0143',
            resumeUrl: 'https://resumes.example.com/alice-johnson.pdf',
            imageUrl: 'https://images.example.com/alice.jpg',
            interviews: ['661b0d0f0f1a0a001b9c1001', '661b0d0f0f1a0a001b9c1002'],
        },
        {
            _id: '661b0d0f0f1a0a001b9c0002',
            name: 'Brian Chen',
            email: 'brian.chen@example.com',
            phone: '+1-202-555-0178',
            imageUrl: 'https://images.example.com/brian.png',
            interviews: ['661b0d0f0f1a0a001b9c1003'],
        },
        {
            _id: '661b0d0f0f1a0a001b9c0003',
            name: 'Carla Mendes',
            email: 'carla.mendes@example.com',
            resumeUrl: 'https://resumes.example.com/carla-mendes.pdf',
            interviews: [],
        },
        {
            _id: '661b0d0f0f1a0a001b9c0004',
            name: 'Derek Smith',
            email: 'derek.smith@example.com',
            phone: '+1-202-555-0100',
            resumeUrl: 'https://resumes.example.com/derek-smith.pdf',
            imageUrl: 'https://images.example.com/derek.jpg',
            interviews: [
                '661b0d0f0f1a0a001b9c1004',
                '661b0d0f0f1a0a001b9c1005',
                '661b0d0f0f1a0a001b9c1006',
            ],
        },
        {
            _id: '661b0d0f0f1a0a001b9c0005',
            name: 'Ella Williams',
            email: 'ella.williams@example.com',
            imageUrl: 'https://images.example.com/ella.png',
            interviews: ['661b0d0f0f1a0a001b9c1007'],
        },
        {
            _id: '661b0d0f0f1a0a001b9c0006',
            name: 'Faisal Rahman',
            email: 'faisal.rahman@example.com',
            phone: '+44-20-7946-0958',
            resumeUrl: 'https://resumes.example.com/faisal-rahman.pdf',
            interviews: [],
        },
        {
            _id: '661b0d0f0f1a0a001b9c0007',
            name: 'Grace Lee',
            email: 'grace.lee@example.com',
            phone: '+1-202-555-0123',
            resumeUrl: 'https://resumes.example.com/grace-lee.pdf',
            imageUrl: 'https://images.example.com/grace.jpg',
            interviews: ['661b0d0f0f1a0a001b9c1008'],
        },
        {
            _id: '661b0d0f0f1a0a001b9c0008',
            name: 'Hugo Martínez',
            email: 'hugo.martinez@example.com',
            phone: '+34-91-123-4567',
            interviews: [],
        },
        {
            _id: '661b0d0f0f1a0a001b9c0009',
            name: 'Isabella Rossi',
            email: 'isabella.rossi@example.com',
            resumeUrl: 'https://resumes.example.com/isabella-rossi.pdf',
            interviews: ['661b0d0f0f1a0a001b9c1009', '661b0d0f0f1a0a001b9c1010'],
        },
        {
            _id: '661b0d0f0f1a0a001b9c0010',
            name: 'James O’Connor',
            email: 'james.oconnor@example.com',
            phone: '+1-202-555-0199',
            resumeUrl: 'https://resumes.example.com/james-oconnor.pdf',
            imageUrl: 'https://images.example.com/james.jpg',
            interviews: ['661b0d0f0f1a0a001b9c1011'],
        },
    ];


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddCandidate = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:4000/api/candidates", formData);
            toast.success("Candidate added successfully");
            setShowModal(false);
            setFormData({
                name: "",
                email: "",
                phone: "",
                resumeUrl: "",
                imageUrl: "",
            });
            fetchCandidates();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add candidate");
        }
    };

    return (
        <Layout>
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold">Candidates</h2>
                        <p className="text-muted">Manage candidates for interviews</p>
                    </div>
                    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
                        <i className="ti ti-plus-circle"></i> Add Candidate
                    </button>
                </div>

                {/* Table */}
                {/* <div className="table-responsive border rounded">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Resume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            <div className="spinner-border spinner-border-sm" role="status"></div>
                                            <span>Loading candidates...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : candidates.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-muted">
                                        No candidates found. Add your first candidate.
                                    </td>
                                </tr>
                            ) : (
                                candidates?.map((candidate) => (
                                    <tr key={candidate.id}>
                                        <td>{candidate.name}</td>
                                        <td>{candidate.email}</td>
                                        <td>{candidate.phone}</td>
                                        <td>
                                            {candidate.resumeUrl ? (
                                                <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                                                    View Resume
                                                </a>
                                            ) : (
                                                <span className="text-muted">No resume</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div> */}

                {/* <div className="table-responsive border rounded">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Applied For</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Resume</th>
                                <th>View Full Application</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            <div className="spinner-border spinner-border-sm" role="status"></div>
                                            <span>Loading candidates...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : candidates.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        No candidates found. Add your first candidate.
                                    </td>
                                </tr>
                            ) : (
                                candidates?.map((candidate) => (
                                    <tr key={candidate.id}>
                                        <td>{candidate.appliedFor || <span className="text-muted">N/A</span>}</td>
                                        <td>{candidate.name}</td>
                                        <td>{candidate.email}</td>
                                        <td>{candidate.phone}</td>
                                        <td>
                                            {candidate.resumeUrl ? (
                                                <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                                                    View Resume
                                                </a>
                                            ) : (
                                                <span className="text-muted">No resume</span>
                                            )}
                                        </td>
                                        <td>
                                            <a href={`/applications/${candidate.id}`} className="btn btn-sm btn-outline-primary">
                                                View Application
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div> */}

                <div className="w-100 overflow-auto">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Applied For</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Resume</th>
                                    <th>View Full Application</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                <div className="spinner-border spinner-border-sm" role="status"></div>
                                                <span>Loading candidates...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : candidates.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No candidates found. Add your first candidate.
                                        </td>
                                    </tr>
                                ) : (
                                    candidates?.map((candidate) => (
                                        <tr key={candidate.id}>
                                            <td>{candidate.appliedFor || <span className="text-muted">N/A</span>}</td>
                                            <td>{candidate.name}</td>
                                            <td>{candidate.email}</td>
                                            <td>{candidate.phone}</td>
                                            <td>
                                                {candidate.resumeUrl ? (
                                                    <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                                                        View Resume
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">No resume</span>
                                                )}
                                            </td>
                                            <td>
                                                <a href={`/applications/${candidate.id}`} className="btn btn-sm btn-outline-primary">
                                                    View Application
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>



                {/* Modal */}
                {showModal && (
                    <div className="modal d-block show fade" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <form onSubmit={handleAddCandidate}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New Candidate</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setShowModal(false)}
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Phone Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Resume URL (Optional)</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                name="resumeUrl"
                                                value={formData.resumeUrl}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Profile Image URL (Optional)</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                name="imageUrl"
                                                value={formData.imageUrl}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Add Candidate
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="modal-backdrop fade show"></div>
                    </div>
                )}
            </div>
        </Layout>

    );
};

export default Candidates;
