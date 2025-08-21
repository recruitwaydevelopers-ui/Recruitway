import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { useAuthContext } from '../../../context/auth-context';
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const InterviewerAllInterviewsByCV = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { server } = useAuthContext();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${server}/api/v1/interviewer/getInterviewerInterviewsbycv`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const formattedEvents = response.data.map(interview => ({
                id: interview._id,
                title: `${interview.jobTitle} - ${interview.candidateName}`,
                start: interview.start,
                end: interview.end,
                interviewId: interview.interviewId,
                extendedProps: {
                    jobId: interview.jobId,
                    jobTitle: interview.jobTitle,
                    companyId: interview.companyId,
                    companyName: interview.companyName,
                    cvId: interview.cvId,
                    candidateName: interview.candidateName,
                    candidateEmail: interview.candidateName,
                    candidatePhone: interview.candidateName,
                    notes: interview.notes,
                    status: interview.status,
                    isLinkSent: interview.isLinkSent,
                    interviewId: interview.interviewId,
                },
                color: getEventColor(interview.status)
            }));

            setEvents(formattedEvents);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch interviews');
            setLoading(false);
        }
    };

    const getEventColor = (status) => {
        switch (status) {
            case 'scheduled': return '#3788d8'; // blue
            case 'confirmed': return '#17a2b8'; // teal
            case 'inProcess': return '#ffc107'; // yellow
            case 'completed': return '#28a745'; // green
            case 'cancelled': return '#dc3545'; // red
            default: return '#6c757d'; // gray
        }
    };

    const handleEventClick = (clickInfo) => {
        setSelectedEvent({
            ...clickInfo.event.extendedProps,
            id: clickInfo.event.id,
            start: clickInfo.event.start,
            end: clickInfo.event.end
        });
        setShowModal(true);
    };

    const handleCancelInterview = async () => {
        setLoading(true);
        try {
            const res = await axios.put(`${server}/api/v1/interviewer/${selectedEvent.id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const { message } = res.data
            toast.success(message)
            fetchInterviews();
            setShowModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel interview');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleStartInterview = () => {
        navigate('/interviewer/videoroom', { state: { id: selectedEvent.interviewId } });
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="container-fluid">
            <div className="container">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h2 className="mb-0">All Scheduled Interview By CV</h2>
                    </div>
                    <div className="card-body">
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            events={events}
                            eventClick={handleEventClick}
                            height="70vh"
                            nowIndicator={true}
                            editable={false}
                            selectable={false}
                        />
                    </div>
                </div>

                {/* Interview Details Modal */}
                {selectedEvent && (
                    <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Interview Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row mb-3">
                                        <div className="col-md-8">
                                            <h4>{selectedEvent.jobTitle}</h4>
                                            <p className="text-muted">{selectedEvent.companyName}</p>
                                        </div>
                                        <div className="col-md-4 text-end">
                                            <span className={`badge ${selectedEvent.status === 'scheduled' ? 'bg-primary' :
                                                selectedEvent.status === 'confirmed' ? 'bg-info' :
                                                    selectedEvent.status === 'inProcess' ? 'bg-warning text-dark' :
                                                        selectedEvent.status === 'completed' ? 'bg-success' : 'bg-danger'
                                                }`}>
                                                {selectedEvent.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <p>
                                                <i className="bi bi-person me-2"></i>
                                                <strong>Candidate:</strong> {selectedEvent.candidateName}
                                            </p>
                                            <p>
                                                <i className="bi bi-camera-video me-2"></i>
                                                <strong>Location:</strong> Online via Video Call
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <p>
                                                <i className="bi bi-calendar me-2"></i>
                                                <strong>Date:</strong> {formatDate(selectedEvent.start)}
                                            </p>
                                            <p>
                                                <i className="bi bi-clock me-2"></i>
                                                <strong>Duration:</strong> {formatDate(selectedEvent.start).split(' ')[1]} - {formatDate(selectedEvent.end).split(' ')[1]}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedEvent.notes && (
                                        <div className="mb-3">
                                            <h6>Notes</h6>
                                            <p>{selectedEvent.notes}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    {selectedEvent.status === 'scheduled' && (
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-danger me-2"
                                                onClick={handleCancelInterview}
                                            >
                                                Cancel Interview
                                            </button>
                                        </>
                                    )}
                                    {selectedEvent.status === 'scheduled' && (
                                        // <Link 
                                        //     to={`/interviewer/videoroom/${selectedEvent.interviewId}`}
                                        //     className="btn btn-primary me-2"
                                        // >
                                        //     Start Interview
                                        // </Link>
                                        <button className="btn btn-primary me-2" onClick={handleStartInterview}>
                                            Start Interview
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal backdrop */}
                {showModal && <div className="modal-backdrop fade show"></div>}
            </div>
        </div>
    );
};

export default InterviewerAllInterviewsByCV;