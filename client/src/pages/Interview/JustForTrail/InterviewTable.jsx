import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import axios from "axios";
import SendLinkModal from "./SendLinkModal";

const InterviewTable = ({ interviews, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const handleSendLink = (interview) => {
    setSelectedInterview(interview);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedInterview(null);
  };

  const handleSendEmail = async (interviewId, emailData) => {
    try {
      await axios.post(`http://localhost:4000/api/interviews/${interviewId}/send-link`, emailData);

      toast.success("Interview link sent to candidate");

      // Invalidate the interviews query to refresh data
      // Assuming you have some state management to trigger re-fetch

      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to send interview link");
    }
  };

  // Filter interviews based on search term
  const filteredInterviews = interviews.filter((interview) =>
    interview.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.position.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-primary text-white";
      case "in-progress":
        return "bg-warning text-black";
      case "completed":
        return "bg-success text-white";
      case "cancelled":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="d-flex justify-content-between px-6 py-4 border-bottom">
        <h2 className="h4 text-gray-900">Upcoming Interviews</h2>
        <div className="d-flex gap-3">
          <div className="position-relative">
            <input
              type="text"
              className="form-control pl-10"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
              <i className="ti ti-search text-gray-400" />
            </div>
          </div>
          <button className="btn btn-primary">
            <i className="ti ti-plus me-2" />
            Schedule New
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="table table-striped table-hover">
          <thead className="bg-light">
            <tr>
              <th>Candidate</th>
              <th>Position</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <div className="spinner-border" role="status" />
                </td>
              </tr>
            ) : filteredInterviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  No interviews found
                </td>
              </tr>
            ) : (
              filteredInterviews.map((interview) => (
                <tr key={interview.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <img
                          src={interview.candidate.imageUrl || "default-avatar.png"}
                          alt={interview.candidate.name}
                          className="rounded-circle"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <div className="fw-semibold">{interview.candidate.name}</div>
                        <div className="text-muted">{interview.candidate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-muted">{interview.position.title}</div>
                    <div className="text-muted">{interview.position.department}</div>
                  </td>
                  <td>
                    <div>{new Date(interview.date).toLocaleDateString()}</div>
                    <div>{`${interview.startTime} - ${interview.endTime}`}</div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusClass(interview.status)}`}>
                      {getStatusLabel(interview.status)}
                    </span>
                  </td>
                  <td className="text-end">
                    {interview.status === "scheduled" ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleSendLink(interview)}
                        disabled={interview.meetingLinkSent}
                      >
                        {interview.meetingLinkSent ? "Link Sent" : "Send Link"}
                      </button>
                    ) : interview.status === "in-progress" ? (
                      <Link to={`/interview/${interview.id}`}>
                        <button className="btn btn-sm btn-outline-primary">
                          View Live
                        </button>
                      </Link>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between px-4 py-3 border-top">
        <div className="d-flex gap-3">
          <button className="btn btn-outline-secondary btn-sm">Previous</button>
          <button className="btn btn-outline-secondary btn-sm">Next</button>
        </div>
        <div>
          <p className="text-muted">
            Showing <strong>1</strong> to <strong>{filteredInterviews.length}</strong> of{" "}
            <strong>{interviews.length}</strong> results
          </p>
        </div>
      </div>

      {isModalOpen && selectedInterview && (
        <SendLinkModal
          isOpen={isModalOpen}
          interview={selectedInterview}
          onClose={handleModalClose}
          onSend={handleSendEmail}
        />
      )}
    </div>
  );
};

export default InterviewTable;
