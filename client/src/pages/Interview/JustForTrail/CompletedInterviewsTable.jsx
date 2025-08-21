import React, { useState, useEffect } from "react";
import axios from "axios";
import InterviewSummaryModal from "./InterviewSummaryModal";

const CompletedInterviewsTable = ({
  interviews,
  isLoading = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  // useEffect(() => {
  //   const fetchSummaryData = async () => {
  //     if (selectedInterviewId) {
  //       setIsSummaryLoading(true);
  //       try {
  //         const response = await axios.get(`http://localhost:4000/api/interview-summaries/${selectedInterviewId}`);
  //         setSummaryData(response.data);
  //       } catch (error) {
  //         console.error("Error fetching interview summary:", error);
  //       } finally {
  //         setIsSummaryLoading(false);
  //       }
  //     }
  //   };

  //   fetchSummaryData();
  // }, [selectedInterviewId]);

  const handleViewSummary = (interviewId) => {
    setSelectedInterviewId(interviewId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedInterviewId(null);
    setSummaryData(null);
  };

  return (
    <div className="mt-5 bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b">
        <h2 className="text-lg font-medium text-dark">Recent Completed Interviews</h2>
      </div>
      <div className="table-responsive">
        <table className="table min-w-full divide-y divide-gray-200">
          <thead className="bg-light">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Candidate
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Position
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Performance
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : interviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-muted">
                  No completed interviews found
                </td>
              </tr>
            ) : (
              interviews.map((interview) => (
                <tr key={interview.candidate.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={interview.candidate.imageUrl}
                          alt={interview.candidate.name}
                          className="rounded-circle"
                          width="40"
                          height="40"
                        />
                      </div>
                      <div className="ms-4">
                        <div className="text-sm font-medium text-dark">{interview.candidate.name}</div>
                        <div className="text-sm text-muted">{interview.candidate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-dark">{interview.position.title}</div>
                    <div className="text-sm text-muted">{interview.position.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-dark">{new Date(interview.date).toLocaleDateString()}</div>
                    <div className="text-sm text-muted">{`${interview.startTime} - ${interview.endTime}`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <i className="ti ti-check text-success" style={{ fontSize: "20px" }} />
                      </div>
                      <div className="ms-2 text-sm text-dark">
                        8.5/10
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleViewSummary(interview.id)}
                    >
                      View Summary
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <InterviewSummaryModal
        isOpen={isModalOpen}
        summaryData={summaryData}
        isLoading={isSummaryLoading}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default CompletedInterviewsTable;