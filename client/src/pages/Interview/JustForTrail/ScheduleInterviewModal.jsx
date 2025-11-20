import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export function ScheduleInterviewModal({ isOpen, onClose }) {
    // Form state
    const [formData, setFormData] = useState({
        candidateId: "",
        positionId: "",
        date: "",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
    });

    const [candidates, setCandidates] = useState([]);
    const [positions, setPositions] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    // Fetch candidates and positions
    useEffect(() => {
        if (isOpen) {
            // Fetch candidates
            fetch("http://localhost:4000/api/candidates")
                .then((response) => response.json())
                .then((data) => setCandidates(data))
                .catch((error) => console.error("Error fetching candidates:", error));

            // Fetch positions
            fetch("http://localhost:4000/api/positions")
                .then((response) => response.json())
                .then((data) => setPositions(data))
                .catch((error) => console.error("Error fetching positions:", error));
        }
    }, [isOpen]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            candidateId: parseInt(formData.candidateId),
            positionId: parseInt(formData.positionId),
            date: new Date(formData.date),
            startTime: formData.startTime,
            endTime: formData.endTime,
            status: "scheduled",
            meetingLink: "",
            meetingLinkSent: false,
        };

        try {
            const response = await fetch("http://localhost:4000/api/interviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to schedule interview");
            }

            toast.success("Interview scheduled successfully");
            onClose();
        } catch (error) {
            toast.error("Failed to schedule interview. Please try again.");
            console.error("Error scheduling interview:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`modal ${isOpen ? "show" : ""}`} style={{ display: isOpen ? "block" : "none" }} aria-labelledby="scheduleInterviewModal" aria-hidden={!isOpen}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Schedule New Interview</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>

                    <form onSubmit={handleSubmit} className="modal-body">
                        {/* Candidate Selection */}
                        <div className="mb-3">
                            <label className="form-label">Candidate</label>
                            <select className="form-select" name="candidateId" value={formData.candidateId} onChange={handleChange}>
                                <option value="">Select candidate</option>
                                {candidates.map((candidate) => (
                                    <option key={candidate.id} value={candidate.id.toString()}>
                                        {candidate.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Position Selection */}
                        <div className="mb-3">
                            <label className="form-label">Position</label>
                            <select className="form-select" name="positionId" value={formData.positionId} onChange={handleChange}>
                                <option value="">Select position</option>
                                {positions.map((position) => (
                                    <option key={position.id} value={position.id.toString()}>
                                        {position.title} ({position.department})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Selection */}
                        <div className="mb-3">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]} // Disable past dates
                            />
                        </div>

                        {/* Time Selection */}
                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label">Start Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col">
                                <label className="form-label">End Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? "Scheduling..." : "Schedule Interview"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ScheduleInterviewModal;
