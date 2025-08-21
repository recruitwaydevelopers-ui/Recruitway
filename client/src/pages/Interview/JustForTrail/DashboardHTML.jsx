import React, { useEffect, useState } from 'react';

const DashboardHTML = () => {
  const [stats, setStats] = useState({
    scheduledCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    cancelledCount: 0,
  });

  const [interviews, setInterviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  const mockInterviews = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    candidate: { name: `Candidate ${i + 1}` },
    position: { title: `Position ${i + 1}` },
    startTime: '10:00 AM',
    endTime: '10:30 AM',
    status: ['scheduled', 'in-progress', 'completed', 'cancelled'][i % 4],
    meetingLinkSent: i % 2 === 0,
  }));

  useEffect(() => {
    // Simulate fetch calls
    setStats({
      scheduledCount: 3,
      inProgressCount: 2,
      completedCount: 4,
      cancelledCount: 1,
    });
    setInterviews(mockInterviews);
  }, []);

  const openSendLinkModal = (interview) => {
    setSelectedInterview(interview);
    setMeetingLink('https://meet.google.com/abc-defg-hij');
    setEmailSubject(`Technical Interview for ${interview.position.title} position`);
    setEmailMessage(`Hello ${interview.candidate.name},\n\nWe're excited for your upcoming technical interview for the ${interview.position.title} position. Please join using the link below at the scheduled time: ${interview.startTime}.\n\nBest regards,\nThe Recruitment Team`);
    setShowModal(true);
  };

  const sendInterviewLink = () => {
    if (!meetingLink) return alert('Please enter a meeting link');
    alert('Interview link sent successfully!');
    setShowModal(false);
  };

  return (
    <div className="container my-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">AI Interview Platform</h2>
        <nav>
          <a href="#" className="me-3 text-secondary text-decoration-none">Dashboard</a>
          <a href="#" className="me-3 text-secondary text-decoration-none">Interviews</a>
          <a href="#" className="me-3 text-secondary text-decoration-none">Candidates</a>
          <a href="#" className="text-secondary text-decoration-none">Reports</a>
        </nav>
      </header>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Dashboard</h3>
        <button className="btn btn-primary">New Interview</button>
      </div>

      <div className="row mb-4">
        {['Scheduled', 'In Progress', 'Completed', 'Cancelled'].map((label, idx) => (
          <div className="col-md-3 mb-3" key={label}>
            <div className="card text-center">
              <div className="card-body">
                <h6 className="text-muted text-uppercase">{label}</h6>
                <h3 className="text-primary">{Object.values(stats)[idx]}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Today's Interviews</h5>
          <button className="btn btn-outline-primary" onClick={() => setInterviews(mockInterviews)}>Refresh</button>
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>Candidate</th>
                <th>Position</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviews.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-4">No interviews scheduled for today</td></tr>
              ) : (
                interviews.map(interview => (
                  <tr key={interview.id}>
                    <td>{interview.candidate.name}</td>
                    <td>{interview.position.title}</td>
                    <td>{interview.startTime} - {interview.endTime}</td>
                    <td>
                      <span className={`badge ${{
                        'scheduled': 'bg-primary-subtle text-primary',
                        'in-progress': 'bg-warning-subtle text-warning',
                        'completed': 'bg-success-subtle text-success',
                        'cancelled': 'bg-danger-subtle text-danger',
                      }[interview.status]}`}>{interview.status}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openSendLinkModal(interview)}
                      >
                        {interview.meetingLinkSent ? 'Resend Link' : 'Send Link'}
                      </button>
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
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Interview Link</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Meeting Link</label>
                  <input className="form-control" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Subject</label>
                  <input className="form-control" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Message</label>
                  <textarea className="form-control" rows="5" value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={sendInterviewLink}>Send Link</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHTML;
