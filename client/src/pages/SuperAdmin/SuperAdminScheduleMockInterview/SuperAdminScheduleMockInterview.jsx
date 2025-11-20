import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../context/auth-context';
import toast from 'react-hot-toast';
import { useSuperAdminContext } from '../../../context/superadmin-context';

const SuperAdminScheduleMockInterview = () => {
    const location = useLocation();
    const { interviewId } = location.state || {};
    const { server, token, createNotification } = useAuthContext();
    const navigate = useNavigate()

    // Initialize state
    const [formData, setFormData] = useState({
        _id: '',
        candidateName: '',
        candidateEmail: '',
        candidatePhone: '',
        profile: '',
        experienceLevel: '',
        interviewDate: '',
        interviewStartTime: '',
        interviewEndTime: '',
        interviewerChoice: '',
        interviewerId: '',
        interviewerName: '',
        status: 'scheduled',
        notes: ''
    });

    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { getAllInterviewers, interviewers } = useSuperAdminContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const filteredInterviewers = interviewers.filter(
        (intv) => intv.data.userId
    );

    const fetchMockInterviews = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${server}/api/v1/mockRequest/getMockInterviewOfRequest/${interviewId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Convert mock interviews to calendar events
            const mockInterviewEvents = response.data.data.map(interview => {
                return {
                    _id: interview._id,
                    title: `${interview.candidateName} - ${interview.profile}`,
                    start: new Date(interview.start),
                    end: new Date(interview.end),
                    extendedProps: {
                        ...interview,
                        interviewDate: moment(interview.interviewDate).format('YYYY-MM-DD'),
                        interviewStartTime: moment(interview.start).format('HH:mm'),
                        interviewEndTime: moment(interview.end).format('HH:mm')
                    }
                };
            });

            setEvents(mockInterviewEvents);

            const dataRes = await axios.get(`${server}/api/v1/mockRequest/getMockInterviewDataOfRequest/${interviewId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (dataRes.data.data) {
                setFormData(prev => ({
                    ...prev,
                    candidateName: dataRes.data.data?.candidateName || "",
                    candidateEmail: dataRes.data.data?.candidateEmail || "",
                    candidatePhone: dataRes.data.data?.candidatePhone || "",
                    profile: dataRes.data.data?.profile || "",
                    interviewerChoice: dataRes.data.data?.interviewerChoice || "",
                    experienceLevel: dataRes.data.data?.experienceLevel || ""
                }));
            }

            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch mock interviews:", err);
            setError('Failed to load mock interviews');
            setLoading(false);
        }
    };

    const convertTo24Hour = (time12h) => {
        if (!time12h) return '';

        // Handle case where time might already be in 24h format
        if (time12h.includes(':')) {
            const [hours, minutes] = time12h.split(':');
            if (hours.length === 2 && minutes.length === 2 && !isNaN(hours) && !isNaN(minutes)) {
                if (parseInt(hours) >= 0 && parseInt(hours) <= 23) {
                    return time12h; // Already in 24h format
                }
            }
        }

        // Convert from 12h to 24h format
        const [time, modifier] = time12h.split(' ');
        if (!time || !modifier) return '';

        let [hours, minutes] = time.split(':');
        if (modifier === 'PM' && hours !== '12') {
            hours = parseInt(hours, 10) + 12;
        } else if (modifier === 'AM' && hours === '12') {
            hours = '00';
        }

        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };

    // Helper function to convert 24-hour time to 12-hour format
    const convertTo12Hour = (time24h) => {
        if (!time24h) return '';

        // Handle case where time might already be in 12h format
        if (time24h.includes(' ')) {
            return time24h; // Already in 12h format
        }

        // Convert from 24h to 12h format
        const [hours, minutes] = time24h.split(':');
        const h = parseInt(hours, 10);
        const suffix = h >= 12 ? 'PM' : 'AM';
        const twelveHour = ((h + 11) % 12 + 1);
        return `${twelveHour}:${minutes} ${suffix}`;
    };

    useEffect(() => {
        getAllInterviewers();
        fetchMockInterviews();
    }, [server, token]);

    const handleDateSelect = (selectInfo) => {
        const selectedDate = moment(selectInfo.start).format('YYYY-MM-DD');
        const selectedTime = moment(selectInfo.start).format('HH:mm');

        setFormData(prev => ({
            ...prev,
            _id: '', // Clear ID for new interview
            interviewDate: selectedDate,
            interviewStartTime: selectedTime,
            interviewEndTime: moment(selectInfo.start).add(1, 'hour').format('HH:mm')
        }));
        setShowModal(true);
    };

    const handleEventClick = (clickInfo) => {
        const eventData = clickInfo.event.extendedProps;

        setFormData({
            _id: eventData._id,
            candidateName: eventData.candidateName,
            candidateEmail: eventData.candidateEmail,
            candidatePhone: eventData.candidatePhone,
            profile: eventData.profile,
            experienceLevel: eventData.experienceLevel,
            interviewDate: eventData.interviewDate,
            interviewStartTime: eventData.interviewStartTime,
            interviewEndTime: eventData.interviewEndTime,
            interviewerChoice: eventData.interviewerChoice,
            interviewerId: eventData.interviewerId,
            interviewerName: eventData.interviewerName,
            status: eventData.status,
            notes: eventData.notes || ''
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleInterviewerChange = (e) => {
        const selectedId = e.target.value;
        const selectedName = e.target.options[e.target.selectedIndex].getAttribute("data-name");

        setFormData(prev => ({
            ...prev,
            interviewerId: selectedId,
            interviewerName: selectedName,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.candidateName || !formData.candidateEmail || !formData.candidatePhone || !formData.profile ||
            !formData.experienceLevel || !formData.interviewDate || !formData.interviewStartTime ||
            !formData.interviewerChoice || !formData.interviewEndTime || !formData.interviewerId || !formData.interviewerName) {
            setError('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Prepare data for API (convert times to proper format)
            const apiData = {
                ...formData,
                start: new Date(`${formData.interviewDate}T${convertTo24Hour(formData.interviewStartTime)}`),
                end: new Date(`${formData.interviewDate}T${convertTo24Hour(formData.interviewEndTime)}`)
            };

            // Determine if we're creating or updating
            const isUpdate = !!formData._id;
            let res;

            if (isUpdate) {
                res = await axios.put(`${server}/api/v1/mockRequest/updateMockInterview/${interviewId}/${formData._id}`,
                    apiData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            } else {
                res = await axios.post(`${server}/api/v1/mockRequest/createMockInterview/${interviewId}`,
                    apiData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }

            // Refresh the events list
            await fetchMockInterviews();

            toast.success(res.data.message);
            setShowModal(false);

            createNotification(formData?.interviewerId, "INTERVIEW_SCHEDULED", `You have been assigned to conduct a mock interview for the position of "${formData?.profile}" with ${formData?.candidateName || 'a candidate'}.`)

            // Reset form for new entries
            if (!isUpdate) {
                setFormData({
                    _id: '',
                    candidateName: '',
                    candidateEmail: '',
                    candidatePhone: '',
                    profile: '',
                    experienceLevel: '',
                    interviewDate: '',
                    interviewStartTime: '',
                    interviewEndTime: '',
                    interviewerChoice: '',
                    interviewerId: '',
                    interviewerName: '',
                    status: 'scheduled',
                    notes: ''
                });
            }

            navigate("/superadmin/mockrequests")
        } catch (err) {
            console.error('Mock interview submission error:', err);
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to save mock interview. Please try again.';
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
            await axios.delete(`${server}/api/v1/mockRequest/deleteMockInterview/${formData._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            await fetchMockInterviews();
            toast.success('Mock interview deleted successfully');
            setShowModal(false);
        } catch (err) {
            console.error('Delete error:', err);
            const errorMessage = err.response?.data?.message ||
                'Failed to delete mock interview. Please try again.';
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

    return (
        <div className="container-fluid">
            <div className="container p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Mock Interview Scheduling</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => { setShowModal(true) }}
                    >
                        <i className="bi bi-plus me-2"></i> Schedule Mock Interview
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

                {/* Mock Interview Modal */}
                <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title fs-5">
                                    {formData._id ? 'Edit Mock Interview' : 'New Mock Interview'}
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
                                            <label htmlFor="candidateName" className="form-label small fw-bold">Candidate Name</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm form-control-md-normal"
                                                id="candidateName"
                                                name="candidateName"
                                                value={formData.candidateName}
                                                onChange={handleInputChange}
                                                required
                                                readOnly
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="candidateEmail" className="form-label small fw-bold">Email</label>
                                            <input
                                                type="email"
                                                className="form-control form-control-sm form-control-md-normal"
                                                id="candidateEmail"
                                                name="candidateEmail"
                                                value={formData.candidateEmail}
                                                onChange={handleInputChange}
                                                required
                                                readOnly
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-2 g-md-3 mt-2">
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="candidatePhone" className="form-label small fw-bold">Phone</label>
                                            <input
                                                type="tel"
                                                className="form-control form-control-sm form-control-md-normal"
                                                id="candidatePhone"
                                                name="candidatePhone"
                                                value={formData.candidatePhone}
                                                onChange={handleInputChange}
                                                required
                                                readOnly
                                                disabled={loading}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label htmlFor="profile" className="form-label small fw-bold">Profile</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm form-control-md-normal"
                                                id="profile"
                                                name="profile"
                                                value={formData.profile}
                                                onChange={handleInputChange}
                                                required
                                                readOnly
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-2 g-md-3 mt-2">
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="experienceLevel" className="form-label small fw-bold">Experience Level</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm form-control-md-normal"
                                                id="experienceLevel"
                                                name="experienceLevel"
                                                value={formData.experienceLevel}
                                                onChange={handleInputChange}
                                                required
                                                readOnly
                                                disabled={loading}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label htmlFor="interviewerChoice" className="form-label small fw-bold">Interviewer Choice</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm form-control-md-normal"
                                                id="interviewerChoice"
                                                name="interviewerChoice"
                                                value={formData.interviewerChoice}
                                                onChange={handleInputChange}
                                                required
                                                readOnly
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>


                                    <div className="row g-2 g-md-3 mt-2">
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="interviewDate" className="form-label small fw-bold">Interview Date</label>
                                            <input
                                                type="date"
                                                className="form-control form-control-sm form-control-md-normal"
                                                id="interviewDate"
                                                name="interviewDate"
                                                value={formData.interviewDate}
                                                onChange={handleInputChange}
                                                required
                                                disabled={loading}
                                            />
                                        </div>

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
                                    </div>

                                    <div className="row g-2 g-md-3 mt-2">
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="interviewStartTime" className="form-label small fw-bold">Interview Start Time</label>
                                            <input
                                                type="time"
                                                className="form-control form-control-sm form-control-md-normal"
                                                id="interviewStartTime"
                                                name="interviewStartTime"
                                                value={formData.interviewStartTime}
                                                onChange={handleInputChange}
                                                required
                                                disabled={loading}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label htmlFor="interviewEndTime" className="form-label small fw-bold">Interview End Time</label>
                                            <input
                                                type="time"
                                                className="form-control form-control-sm form-control-md-normal"
                                                id="interviewEndTime"
                                                name="interviewEndTime"
                                                value={formData.interviewEndTime}
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
                                    : 'bg-warning text-dark'
                            }`}
                        style={{ fontSize: '0.65rem' }}
                    >
                        {eventInfo.event.extendedProps.status}
                    </span>
                </div>
                <div
                    className="fc-event-title text-dark fw-medium text-truncate"
                    style={{ fontSize: '0.85rem' }}
                >
                    {eventInfo.event.extendedProps.candidateName}
                </div>
                <div
                    className="fc-event-details text-muted"
                    style={{ fontSize: '0.75rem' }}
                >
                    {eventInfo.event.extendedProps.profile}
                </div>
            </div>
        </div>
    );
}

export default SuperAdminScheduleMockInterview;