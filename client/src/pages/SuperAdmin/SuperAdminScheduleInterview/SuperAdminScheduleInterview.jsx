import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '../../../context/auth-context';
import toast from 'react-hot-toast';
import { useSuperAdminContext } from '../../../context/superadmin-context';

const SuperAdminScheduleInterview = () => {
    const location = useLocation();
    const { state } = location;
    const { server } = useAuthContext();
    const token = localStorage.getItem("token");

    // Initialize state
    const [formData, setFormData] = useState({
        _id: '',
        candidateId: '',
        candidateName: '',
        jobId: '',
        jobTitle: '',
        companyId: '',
        companyName: '',
        interviewerId: '',
        interviewerName: '',
        start: '',
        end: '',
        notes: '',
        status: 'scheduled'
    });

    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { getAllInterviewers, interviewers } = useSuperAdminContext()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const filteredInterviewers = interviewers.filter(
        (intv) => intv.data.userId
    );

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            if (state?.applicant?._id) {
                const interviewsRes = await axios.get(`${server}/api/v1/superadmin/getCandidateAllInterviews/${state.applicant._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setEvents(
                    interviewsRes.data.data.map(event => ({
                        ...event,
                        start: new Date(event.start),
                        end: new Date(event.end)
                    }))
                );
            }

            // Set form data if coming from applicant page
            if (state?.applicant && state?.job) {
                setFormData(prev => ({
                    ...prev,
                    candidateId: state.applicant._id,
                    candidateName: state.applicant.fullname,
                    jobId: state.job._id,
                    jobTitle: state.job.title,
                    companyId: state.job.companyId,
                    companyName: state.job.company
                }));
            }

            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch initial data:", err);
            setError('Failed to load initial data');
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllInterviewers()
        fetchInitialData();
    }, [state, server, token]);

    const handleDateSelect = (selectInfo) => {
        setFormData(prev => ({
            ...prev,
            _id: '', // Clear ID for new interview
            start: selectInfo.start,
            end: moment(selectInfo.start).add(1, 'hour').toDate()
        }));
        setShowModal(true);
    };

    const handleEventClick = (clickInfo) => {
        setFormData({
            ...clickInfo.event.extendedProps,
            start: clickInfo.event.start,
            end: clickInfo.event.end
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.candidateId || !formData.jobId || !formData.interviewerName ||
            !formData.start || !formData.end) {
            setError('Please fill all required fields');
            return;
        }

        if (new Date(formData.start) >= new Date(formData.end)) {
            setError('End time must be after start time');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const interviewData = {
                ...formData,
                start: new Date(formData.start).toISOString(),
                end: new Date(formData.end).toISOString()
            };

            // Determine if we're creating or updating
            const isUpdate = !!formData._id;
            let res;

            if (isUpdate) {
                res = await axios.put(
                    `${server}/api/v1/superadmin/updateInterviews/${formData._id}`,
                    interviewData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            } else {
                res = await axios.post(`${server}/api/v1/superadmin/createInterviews`,
                    interviewData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }

            // Update events state
            if (isUpdate) {
                setEvents(prevEvents =>
                    prevEvents.map(event =>
                        event._id === formData._id
                            ? {
                                ...res.data.data,
                                start: new Date(res.data.data.start),
                                end: new Date(res.data.data.end)
                            }
                            : event
                    )
                );
            } else {
                setEvents(prevEvents => [
                    ...prevEvents,
                    {
                        ...res.data.data,
                        start: new Date(res.data.data.start),
                        end: new Date(res.data.data.end)
                    }
                ]);
            }
            fetchInitialData()
            toast.success(res.data.message);
            setShowModal(false);

            // Reset form for new entries (but keep candidate/job info if coming from applicant page)
            if (!isUpdate) {
                setFormData(prev => ({
                    ...prev,
                    _id: '',
                    interviewerId: '',
                    interviewerName: '',
                    start: '',
                    end: '',
                    notes: '',
                    status: 'scheduled'
                }));
            }
        } catch (err) {
            console.error('Interview submission error:', err);
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to save interview. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!formData._id) return;

        try {
            setLoading(true);
            await axios.delete(`${server}/api/v1/superadmin/deleteInterviews/${formData._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setEvents(prevEvents => prevEvents.filter(event => event._id !== formData._id));
            toast.success('Interview deleted successfully');
            setShowModal(false);
        } catch (err) {
            console.error('Delete error:', err);
            const errorMessage = err.response?.data?.message ||
                'Failed to delete interview. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    const handleInterviewerChange = (e) => {
        const selectedId = e.target.value;
        const selectedName = e.target.options[e.target.selectedIndex].getAttribute("data-name");

        setFormData(prev => ({
            ...prev,
            interviewerId: selectedId,
            interviewerName: selectedName,
        }));
    };


    return (
        <div className="container-fluid">
            <div className="container p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Interview Scheduling</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setFormData(prev => ({
                                ...prev,
                                _id: '',
                                interviewerId: '',
                                interviewerName: '',
                                start: '',
                                end: '',
                                notes: '',
                                status: 'scheduled'
                            }));
                            setShowModal(true);
                        }}
                    >
                        <i className="bi bi-plus me-2"></i> Schedule Interview
                    </button>
                </div>

                <div className="card shadow-sm">
                    <div className="card-body">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            weekends={true}
                            nowIndicator={true}
                            events={events}
                            eventContent={renderEventContent}
                            select={handleDateSelect}
                            eventClick={handleEventClick}
                            height="auto"
                        />
                    </div>
                </div>

                {/* Interview Modal */}
                <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title fs-5">
                                    {formData._id ? 'Edit Interview' : 'New Interview'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                    disabled={loading}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {error && <div className="alert alert-danger mb-3">{error}</div>}

                                    <div className="row g-2 g-md-3">
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="candidateName" className="form-label small fw-bold">Candidate</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm form-control-md-normal"
                                                id="candidateName"
                                                name="candidateName"
                                                value={formData.candidateName}
                                                onChange={handleInputChange}
                                                required
                                                disabled={loading || !!formData.candidateId}
                                            />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="jobTitle" className="form-label small fw-bold">Job Position</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm form-control-md-normal"
                                                id="jobTitle"
                                                name="jobTitle"
                                                value={formData.jobTitle}
                                                onChange={handleInputChange}
                                                required
                                                disabled={loading || !!formData.jobId}
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-2 g-md-3 mt-2">
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="interviewerName" className="form-label small fw-bold">Interviewer</label>
                                            <select
                                                className="form-select form-select-sm form-select-md-normal"
                                                id="interviewerName"
                                                name="interviewerId"
                                                value={formData.interviewerId}
                                                onChange={handleInterviewerChange}
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">Select Interviewer</option>
                                                {filteredInterviewers.map(interviewer => (
                                                    <option
                                                        key={interviewer.data.userId}
                                                        value={interviewer.data.userId}
                                                        data-name={interviewer.data.fullname}
                                                    >
                                                        {interviewer.data.fullname}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label htmlFor="companyName" className="form-label small fw-bold">Company</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm form-control-md-normal"
                                                id="companyName"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleInputChange}
                                                required
                                                disabled={loading || !!formData.companyId}
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-2 g-md-3 mt-2">
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="start" className="form-label small fw-bold">Start Time</label>
                                            <input
                                                type="datetime-local"
                                                className="form-control form-control-sm form-control-md-normal"
                                                id="start"
                                                name="start"
                                                value={formData.start ? moment(formData.start).format('YYYY-MM-DDTHH:mm') : ''}
                                                onChange={handleInputChange}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="end" className="form-label small fw-bold">End Time</label>
                                            <input
                                                type="datetime-local"
                                                className="form-control form-control-sm form-control-md-normal"
                                                id="end"
                                                name="end"
                                                value={formData.end ? moment(formData.end).format('YYYY-MM-DDTHH:mm') : ''}
                                                onChange={handleInputChange}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <label htmlFor="notes" className="form-label small fw-bold">Notes</label>
                                        <textarea
                                            className="form-control form-control-sm form-control-md-normal"
                                            id="notes"
                                            rows="2"
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            placeholder="Any special instructions or details"
                                            disabled={loading}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer d-flex flex-wrap gap-2">
                                    {formData._id && (
                                        <button
                                            type="button"
                                            className="btn btn-danger order-1 order-md-0 me-md-auto"
                                            onClick={handleDelete}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                            ) : (
                                                <i className="bi bi-trash me-1"></i>
                                            )}
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary order-2 order-md-1"
                                        onClick={() => setShowModal(false)}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary order-3 order-md-2"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                        ) : (
                                            <i className={`bi ${formData._id ? 'bi-pencil' : 'bi-calendar-plus'} me-1`}></i>
                                        )}
                                        {formData._id ? 'Update' : 'Schedule'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Modal Backdrop */}
                {showModal && <div className="modal-backdrop fade show"></div>}
            </div>
        </div>
    );
};


function renderEventContent(eventInfo) {
    return (
        <div
            className="fc-event-content position-relative p-1 bg-light border rounded-3 shadow-sm"
            style={{
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                zIndex: 1,
                cursor: 'pointer',
                overflow: 'visible'
            }}
        >
            {/* Compact view (always visible) */}
            <div className="compact-view">
                <div className="d-flex align-items-center gap-1">
                    <div className="fc-event-time fw-bold text-primary" style={{ fontSize: '0.8rem' }}>
                        {eventInfo.timeText}
                    </div>
                    <span
                        className={`badge rounded-pill ${eventInfo.event.extendedProps.status === 'completed'
                            ? 'bg-success'
                            : eventInfo.event.extendedProps.status === 'cancelled'
                                ? 'bg-danger'
                                : eventInfo.event.extendedProps.status === 'scheduled'
                                    ? 'bg-primary'
                                    : 'bg-secondary'
                            } text-white`}
                        style={{ fontSize: '0.65rem' }}
                    >
                        {eventInfo.event.extendedProps.status}
                    </span>
                </div>
                <div
                    className="fc-event-title text-dark fw-medium text-truncate"
                    style={{ fontSize: '0.85rem' }}
                >
                    {eventInfo.event.extendedProps.jobTitle}
                </div>
            </div>
        </div>
    );
}

export default SuperAdminScheduleInterview;