import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// const InterviewSummaryModal = ({ isOpen, summaryData, isLoading, onClose }) => {
const InterviewSummaryModal = ({ isOpen, isLoading, onClose }) => {
    const [forwardEmailAddress, setForwardEmailAddress] = useState('');
    const [forwardEmailName, setForwardEmailName] = useState('');
    const [additionalNote, setAdditionalNote] = useState('');
    const [activeTab, setActiveTab] = useState('summary');
    const [isForwarding, setIsForwarding] = useState(false);


    const summaryData = {
        interview: {
          candidate: {
            name: "Priya Sharma",
            email: "priya.sharma@example.com"
          },
          position: {
            title: "Full Stack Developer"
          },
          date: "2025-04-10T10:30:00Z"
        },
        overallScore: "8.8/10",
        questionsAnswered: 13,
        totalQuestions: 15,
        duration: 60,
        skillAssessmentsParsed: [
          { name: "JavaScript", score: "9/10", percentage: 90 },
          { name: "React", score: "8.5/10", percentage: 85 },
          { name: "Node.js", score: "8/10", percentage: 80 },
          { name: "MongoDB", score: "7.5/10", percentage: 75 },
          { name: "System Design", score: "8/10", percentage: 80 },
          { name: "Communication", score: "9/10", percentage: 90 }
        ],
        codeAssessmentParsed: {
          task: "Build a REST API with Node.js and MongoDB to manage a product catalog",
          code: `// server.js
      const express = require('express');
      const mongoose = require('mongoose');
      const app = express();
      app.use(express.json());
      
      mongoose.connect('mongodb://localhost:27017/products');
      
      const Product = mongoose.model('Product', {
        name: String,
        price: Number,
        description: String
      });
      
      app.get('/products', async (req, res) => {
        const products = await Product.find();
        res.json(products);
      });
      
      app.post('/products', async (req, res) => {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
      });
      
      app.listen(3000, () => console.log('Server running on port 3000'));`,
          evaluation: [
            { type: "positive", points: ["RESTful structure is clear and consistent"] },
            { type: "positive", points: ["Proper use of async/await and MongoDB operations"] },
            { type: "warning", points: ["Lacks validation and error handling"] }
          ]
        },
        aiSummary: `Priya demonstrated excellent understanding of full stack development with React and Node.js. She was confident in discussing RESTful architecture and asynchronous programming.
      
      Her code was clean, functional, and showed awareness of proper API structure. While the API lacked error handling and validation, it met the functional requirements.
      
      Her communication was articulate, and she explained her technical choices effectively. She would benefit from diving deeper into advanced database indexing and scalability strategies. Overall, Priya is a strong candidate for full stack roles.`
      };
      
      
    const handleForwardReport = async () => {
        if (!summaryData) return;

        if (!forwardEmailAddress || !forwardEmailName) {
            toast.error("Please provide recipient email and name");
            return;
        }

        setIsForwarding(true);
        try {
            await axios.post(`http://localhost:4000/api/interview-summaries/${summaryData.interviewId}/forward`, {
                recipientEmail: forwardEmailAddress,
                recipientName: forwardEmailName,
                additionalNote
            });

            toast.success("Interview report forwarded successfully");

            setForwardEmailAddress('');
            setForwardEmailName('');
            setAdditionalNote('');
            setActiveTab('summary');
        } catch (error) {
            toast.error("Failed to forward interview report");
        } finally {
            setIsForwarding(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {isLoading ? (
                                <div className="placeholder-glow w-100">
                                    <span className="placeholder col-6"></span>
                                </div>
                            ) : summaryData ? (
                                `Interview Summary: ${summaryData.interview.candidate.name}`
                            ) : (
                                "Interview Summary Not Found"
                            )}
                        </h5>
                        {!isLoading && summaryData && (
                            <span className="badge bg-success ms-3">Score: {summaryData.overallScore}</span>
                        )}
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {isLoading ? (
                            <div>
                                <div className="placeholder-glow mb-3">
                                    <span className="placeholder col-12" style={{ height: '100px' }}></span>
                                </div>
                                <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: '200px' }}></span>
                                </div>
                            </div>
                        ) : !summaryData ? (
                            <div className="text-center text-muted">No summary data found for this interview.</div>
                        ) : (
                            <>
                                <ul className="nav nav-tabs mb-3">
                                    <li className="nav-item">
                                        <button className={`nav-link ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Summary</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link ${activeTab === 'coding' ? 'active' : ''}`} onClick={() => setActiveTab('coding')}>Code Assessment</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link ${activeTab === 'forward' ? 'active' : ''}`} onClick={() => setActiveTab('forward')}>Forward Report</button>
                                    </li>
                                </ul>

                                {activeTab === 'summary' && (
                                    <div className="">
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <h6>Candidate Details</h6>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p><strong>Name:</strong> {summaryData.interview.candidate.name}</p>
                                                        <p><strong>Email:</strong> {summaryData.interview.candidate.email}</p>
                                                        <p><strong>Position:</strong> {summaryData.interview.position.title}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p><strong>Interview Date:</strong> {new Date(summaryData.interview.date).toLocaleDateString()}</p>
                                                        <p><strong>Duration:</strong> {summaryData.duration} minutes</p>
                                                        <p><strong>Questions Answered:</strong> {summaryData.questionsAnswered}/{summaryData.totalQuestions}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <h6>Skills Assessment</h6>
                                            <div className="row">
                                                {summaryData.skillAssessmentsParsed.map((skill, index) => (
                                                    <div className="col-md-4 mb-2" key={index}>
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="d-flex justify-content-between">
                                                                    <span>{skill.name}</span>
                                                                    <small>{skill.score}</small>
                                                                </div>
                                                                <div className="progress">
                                                                    <div
                                                                        className={`progress-bar ${skill.percentage >= 80 ? 'bg-success' : skill.percentage >= 60 ? 'bg-warning' : 'bg-danger'}`}
                                                                        role="progressbar"
                                                                        style={{ width: `${skill.percentage}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h6>AI Summary Analysis</h6>
                                            <div className="card">
                                                <div className="card-body">
                                                    {summaryData.aiSummary.split('\n\n').map((paragraph, index) => (
                                                        <p key={index} className={index > 0 ? 'mt-3' : ''}>{paragraph}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'coding' && (
                                    <div>
                                        <h6 className="mb-3">Coding Assessment</h6>
                                        <div className="card">
                                            <div className="card-body">
                                                <p><strong>Task:</strong> {summaryData.codeAssessmentParsed.task}</p>
                                                <pre className="bg-dark text-white p-3 rounded">
                                                    {summaryData.codeAssessmentParsed.code}
                                                </pre>
                                                {summaryData.codeAssessmentParsed.evaluation.map((evalItem, index) => (
                                                    <div key={index} className="d-flex align-items-center mt-2">
                                                        <span className={`me-2 text-${evalItem.type === 'positive' ? 'success' : evalItem.type === 'warning' ? 'warning' : 'danger'}`}>•</span>
                                                        <span>{evalItem.points}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'forward' && (
                                    <div>
                                        <div className="mb-3">
                                            <label htmlFor="recipientEmail" className="form-label">Recipient Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="recipientEmail"
                                                value={forwardEmailAddress}
                                                onChange={(e) => setForwardEmailAddress(e.target.value)}
                                                placeholder="manager@example.com"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="recipientName" className="form-label">Recipient Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="recipientName"
                                                value={forwardEmailName}
                                                onChange={(e) => setForwardEmailName(e.target.value)}
                                                placeholder="Hiring Manager"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="additionalNote" className="form-label">Additional Note (Optional)</label>
                                            <textarea
                                                className="form-control"
                                                id="additionalNote"
                                                rows="4"
                                                value={additionalNote}
                                                onChange={(e) => setAdditionalNote(e.target.value)}
                                                placeholder="Add any additional comments or notes about this candidate..."
                                            ></textarea>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        {activeTab === 'forward' ? (
                            <button
                                onClick={handleForwardReport}
                                disabled={isLoading || !summaryData || isForwarding}
                                className="btn btn-primary"
                            >
                                {isForwarding ? "Forwarding..." : "Forward Report"}
                            </button>
                        ) : (
                            <button onClick={onClose} className="btn btn-secondary">Close</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewSummaryModal;