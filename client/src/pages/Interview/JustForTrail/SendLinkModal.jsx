import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const SendLinkModal = ({ isOpen, interview, onClose, onSend }) => {
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [meetingLink, setMeetingLink] = useState("");

    useEffect(() => {
        if (interview) {
            const candidateSlug = interview.candidate.name.toLowerCase().replace(/\s+/g, '-');
            const dateSlug = new Date(interview.date).toISOString().split('T')[0].replace(/-/g, '');
            const generatedLink = `${window.location.origin}/candidate-interview/${interview.id}`;

            setMeetingLink(generatedLink);

            setEmailSubject(`Interview Invitation: ${interview.position.title} Position`);
            setEmailMessage(`Dear ${interview.candidate.name},

We're pleased to invite you for an interview for the ${interview.position.title} position. Please click the link below at your scheduled time (${new Date(interview.date).toLocaleDateString()}, ${interview.startTime} - ${interview.endTime}).

The interview will be conducted by our AI interviewer and will include technical questions and coding assessments.

Best regards,
Recruitment Team`);
        }
    }, [interview]);

    const handleSend = () => {
        if (interview) {
            onSend(interview.id, {
                meetingLink,
                emailSubject,
                emailMessage,
            });
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(meetingLink);
        toast.success("Copy To Clipboard")
    };

    if (!interview) return null;

    return (
        <div className={`modal fade ${isOpen ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Send Interview Link
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        <p>
                            You are about to send an interview meeting link to <strong>{interview.candidate.name}</strong> for the position of <strong>{interview.position.title}</strong>.
                        </p>

                        <div className="mb-3">
                            <label htmlFor="emailSubject" className="form-label">Email Subject</label>
                            <input
                                type="text"
                                className="form-control"
                                id="emailSubject"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="emailMessage" className="form-label">Email Message</label>
                            <textarea
                                className="form-control"
                                id="emailMessage"
                                rows="6"
                                value={emailMessage}
                                onChange={(e) => setEmailMessage(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="meetingLink" className="form-label">Meeting Link</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="meetingLink"
                                    value={meetingLink}
                                    readOnly
                                />
                                <button className="btn btn-outline-secondary" type="button" onClick={copyLink}>
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSend}>Send Email</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendLinkModal;
