// import { useState, useEffect } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import moment from 'moment';
// import { useAuthContext } from '../../../context/auth-context';
// import { useSuperAdminContext } from '../../../context/superadmin-context';
// import toast from 'react-hot-toast';

// const ScheduleInterviewWithCV = () => {
//     const { jobId, encodedCVId } = useParams();
//     const cvId = decodeURIComponent(encodedCVId);
//     const navigate = useNavigate();

//     const { server, token } = useAuthContext();
//     const { getAllInterviewers, interviewers } = useSuperAdminContext();

//     const [job, setJob] = useState(null);
//     const [cv, setCv] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [events, setEvents] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//     const [selectedEvent, setSelectedEvent] = useState(null);

//     const [formData, setFormData] = useState({
//         _id: '',
//         jobTitle: '',
//         candidateName: "",
//         candidateEmail: "",
//         candidatePhone: "",
//         interviewerName: '',
//         interviewerId: '',
//         interviewDate: '',
//         start: '',
//         end: '',
//         notes: '',
//         status: 'scheduled',
//     });

//     const filteredInterviewers = interviewers.filter(
//         (intv) => intv.data.userId
//     );

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 768);
//         };
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     useEffect(() => {
//         getAllInterviewers();
//         fetchJobAndCVData();
//     }, []);

//     const fetchJobAndCVData = async () => {
//         try {
//             const jobResponse = await axios.get(`${server}/api/v1/superadmin/cvforinterview/${jobId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setJob(jobResponse.data.data);

//             const foundCv = jobResponse.data.data.CvFile.find(c => c._id === cvId);
//             if (!foundCv) throw new Error('CV not found');

//             setCv(foundCv);

//             setFormData(prev => ({
//                 ...prev,
//                 jobTitle: jobResponse.data.data.title || '',
//                 candidateName: foundCv.candidateName || "",
//                 candidateEmail: foundCv.candidateEmail || "",
//                 candidatePhone: foundCv.candidatePhone || ""
//             }));

//             const interviewsRes = await axios.get(`${server}/api/v1/superadmin/getCVInterviews/${jobId}/${cvId}`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             setEvents(
//                 interviewsRes.data.data.map(event => ({
//                     ...event,
//                     id: event._id,
//                     title: `${event.jobTitle} - ${event.candidateName}`,
//                     start: new Date(event.start),
//                     end: new Date(event.end)
//                 }))
//             );

//             setLoading(false);
//         } catch (err) {
//             setError(err.message);
//             setLoading(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleInterviewerChange = (e) => {
//         const selectedId = e.target.value;
//         const selectedName = e.target.options[e.target.selectedIndex].getAttribute("data-name");

//         setFormData(prev => ({
//             ...prev,
//             interviewerId: selectedId,
//             interviewerName: selectedName,
//         }));
//     };

//     const handleDateSelect = (selectInfo) => {
//         setSelectedEvent(null);
//         setFormData(prev => ({
//             ...prev,
//             _id: '',
//             interviewDate: moment(selectInfo.start).format('YYYY-MM-DD'),
//             start: moment(selectInfo.start).format('HH:mm'),
//             end: moment(selectInfo.start).add(1, 'hour').format('HH:mm'),
//             status: 'scheduled'
//         }));
//         setShowModal(true);
//     };

//     const handleEventClick = (clickInfo) => {
//         const event = clickInfo.event;
//         setSelectedEvent(event);

//         setFormData({
//             _id: event.id,
//             jobTitle: event.extendedProps.jobTitle,
//             candidateName: event.extendedProps.candidateName,
//             candidateEmail: event.extendedProps.candidateEmail,
//             candidatePhone: event.extendedProps.candidatePhone,
//             interviewerId: event.extendedProps.interviewerId,
//             interviewerName: event.extendedProps.interviewerName,
//             interviewDate: moment(event.start).format('YYYY-MM-DD'),
//             start: moment(event.start).format('HH:mm'),
//             end: moment(event.end).format('HH:mm'),
//             notes: event.extendedProps.notes,
//             status: event.extendedProps.status || 'scheduled'
//         });
//         setShowModal(true);
//     };

//     const validateForm = () => {
//         if (!formData.jobTitle) {
//             toast.error('Job title is required');
//             return false;
//         }
//         if (!formData.candidateName) {
//             toast.error('Candidate name is required');
//             return false;
//         }
//         if (!formData.candidateEmail) {
//             toast.error('Candidate email is required');
//             return false;
//         }
//         if (!formData.candidatePhone) {
//             toast.error('Candidate phone is required');
//             return false;
//         }
//         if (!formData.interviewerId) {
//             toast.error('Interviewer is required');
//             return false;
//         }
//         if (!formData.interviewDate) {
//             toast.error('Interview date is required');
//             return false;
//         }
//         if (!formData.start) {
//             toast.error('Start time is required');
//             return false;
//         }
//         if (!formData.end) {
//             toast.error('End time is required');
//             return false;
//         }
//         return true;
//     };    

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);

//         if (!validateForm()) return;

//         try {
//             setLoading(true);

//             const interviewData = {
//                 ...formData,
//                 startDateTime: moment(`${formData.interviewDate} ${formData.start}`).toISOString(),
//                 endDateTime: moment(`${formData.interviewDate} ${formData.end}`).toISOString()
//             };

//             let res;
//             const isUpdate = !!formData._id;
//             if (isUpdate) {
//                 res = await axios.put(`${server}/api/v1/superadmin/updateCVInterview/${jobId}/${cvId}/${formData._id}`,
//                     interviewData,
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );
//             } else {
//                 res = await axios.post(`${server}/api/v1/superadmin/cvforinterview/${jobId}/schedule`,
//                     { cvId, interviewDetails: interviewData },
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );
//             }

//             toast.success(res.data.message);
//             fetchJobAndCVData();
//             setShowModal(false);
//             setSelectedEvent(null);
//         } catch (err) {
//             console.error(err);
//             toast.error(err.response?.data?.message || err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async () => {
//         if (!formData._id) return;

//         try {
//             setLoading(true);
//             await axios.delete(
//                 `${server}/api/v1/superadmin/deleteCVInterview/${jobId}/${cvId}/${formData._id}`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             toast.success('Interview deleted successfully');
//             fetchJobAndCVData();
//             setShowModal(false);
//             setSelectedEvent(null);
//         } catch (err) {
//             console.error(err);
//             toast.error(err.response?.data?.message || err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return (
//         <div className="d-flex justify-content-center align-items-center vh-100">
//             <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//             </div>
//         </div>
//     );

//     if (error) return (
//         <div className="container-fluid">
//             <div className="container py-4">
//                 <div className="alert alert-danger">
//                     <i className="bi bi-exclamation-triangle-fill me-2"></i>
//                     {error}
//                 </div>
//             </div>
//         </div>
//     );

//     if (!job || !cv) return (
//         <div className="container-fluid">
//             <div className="container py-4">
//                 <div className="alert alert-info">
//                     <i className="bi bi-info-circle-fill me-2"></i>
//                     Data not found
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <div className="container-fluid px-0">
//             <div className="container p-3 p-md-4">
//                 <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4 gap-2">
//                     <h2 className="h4 mb-0">Schedule Interview for CV</h2>
//                     <div className="d-flex flex-wrap gap-2">
//                         <button
//                             className="btn btn-outline-secondary btn-sm"
//                             onClick={() => navigate(-1)}
//                         >
//                             <i className="bi bi-arrow-left me-1 me-md-2"></i>
//                             <span className="d-none d-md-inline">Back to CV List</span>
//                         </button>
//                         <button
//                             className="btn btn-primary btn-sm"
//                             onClick={() => {
//                                 setSelectedEvent(null);
//                                 setFormData(prev => ({
//                                     ...prev,
//                                     _id: '',
//                                     interviewerId: '',
//                                     interviewerName: '',
//                                     interviewDate: '',
//                                     start: '',
//                                     end: '',
//                                     notes: '',
//                                     status: 'scheduled'
//                                 }));
//                                 setShowModal(true);
//                             }}
//                         >
//                             <i className="bi bi-plus me-1 me-md-2"></i>
//                             <span className="d-none d-md-inline">Schedule Interview</span>
//                             <span className="d-md-none">Schedule</span>
//                         </button>
//                     </div>
//                 </div>

//                 <div className="card border-0 shadow-sm">
//                     <div className="card-header bg-white border-bottom-0 pb-0 d-flex align-items-center">
//                         <div className="bg-primary bg-opacity-10 p-2 rounded me-2 me-md-3">
//                             <i className="bi bi-calendar-event fs-5 fs-md-4 text-primary"></i>
//                         </div>
//                         <h5 className="h6 mb-0">Scheduled Interviews</h5>
//                     </div>
//                     <div className="card-body p-2 p-md-3">
//                         <FullCalendar
//                             plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//                             initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
//                             headerToolbar={{
//                                 left: 'prev,next today',
//                                 center: 'title',
//                                 right: isMobile ? '' : 'dayGridMonth,timeGridWeek,timeGridDay'
//                             }}
//                             selectable={true}
//                             selectMirror={true}
//                             dayMaxEvents={true}
//                             weekends={true}
//                             nowIndicator={true}
//                             events={events}
//                             eventContent={renderEventContent}
//                             select={handleDateSelect}
//                             eventClick={handleEventClick}
//                             height="auto"
//                             aspectRatio={isMobile ? 0.5 : 1.8}
//                             eventDisplay="block"
//                             eventTextColor="#000"
//                             eventBackgroundColor="#fff"
//                             eventBorderColor="#ddd"
//                         />
//                     </div>
//                 </div>

//                 {/* Interview Modal */}
//                 <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1">
//                     <div className={`modal-dialog ${isMobile ? 'modal-fullscreen' : 'modal-xl modal-dialog-centered'}`}>
//                         <div className="modal-content">
//                             <div className="modal-header bg-light">
//                                 <h5 className="modal-title fs-5">
//                                     {formData._id ? 'Edit Interview' : 'New Interview'}
//                                 </h5>
//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     onClick={() => {
//                                         setShowModal(false);
//                                         setSelectedEvent(null);
//                                     }}
//                                     disabled={loading}
//                                 ></button>
//                             </div>
//                             <div className="modal-body p-0 overflow-auto" style={{ maxHeight: isMobile ? 'calc(100vh - 120px)' : '70vh' }}>
//                                 <div className="row g-0">
//                                     {/* CV Preview Card */}
//                                     <div className="col-lg-6">
//                                         <div className="card border-0 h-100">
//                                             <div className="card-header bg-white border-bottom-0 pb-0 d-flex align-items-center">
//                                                 <div className="bg-primary bg-opacity-10 p-2 rounded me-2 me-md-3">
//                                                     <i className="bi bi-file-earmark-text fs-5 fs-md-4 text-primary"></i>
//                                                 </div>
//                                                 <div>
//                                                     <h5 className="h6 mb-0">CV Preview</h5>
//                                                     <p className="text-muted small mb-0">{cv.originalName}</p>
//                                                 </div>
//                                                 <span className="badge bg-secondary ms-auto small">{(cv.size / 1024).toFixed(2)} KB</span>
//                                             </div>
//                                             <div className="card-body p-2">
//                                                 <div className="ratio ratio-1x1 bg-light rounded-3 border">
//                                                     {cv.secure_url.endsWith('.pdf') ? (
//                                                         <embed
//                                                             src={cv.secure_url}
//                                                             type="application/pdf"
//                                                             className="w-100 h-100"
//                                                             title="CV Preview"
//                                                         />
//                                                     ) : (
//                                                         <iframe
//                                                             src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cv.secure_url)}`}
//                                                             className="w-100 h-100"
//                                                             title="CV Preview"
//                                                         ></iframe>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <form className="col-lg-6 p-3" onSubmit={handleSubmit}>
//                                         {error && <div className="alert alert-danger mb-3">{error}</div>}

//                                         <div className="row g-2">
//                                             <div className="col-12 col-md-6">
//                                                 <label className="form-label small fw-bold">Job Title</label>
//                                                 <input
//                                                     type="text"
//                                                     className="form-control form-control-sm"
//                                                     name="jobTitle"
//                                                     value={formData.jobTitle}
//                                                     onChange={handleChange}
//                                                     required
//                                                 />
//                                             </div>
//                                             <div className="col-12 col-md-6">
//                                                 <label className="form-label small fw-bold">Candidate Name</label>
//                                                 <input
//                                                     type="text"
//                                                     className="form-control form-control-sm"
//                                                     name="candidateName"
//                                                     value={formData.candidateName}
//                                                     onChange={handleChange}
//                                                     required
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="row g-2 mt-2">
//                                             <div className="col-12 col-md-6">
//                                                 <label className="form-label small fw-bold">Candidate Email</label>
//                                                 <input
//                                                     type="email"
//                                                     className="form-control form-control-sm"
//                                                     name="candidateEmail"
//                                                     value={formData.candidateEmail}
//                                                     onChange={handleChange}
//                                                     required
//                                                 />
//                                             </div>
//                                             <div className="col-12 col-md-6">
//                                                 <label className="form-label small fw-bold">Candidate Phone</label>
//                                                 <input
//                                                     type="text"
//                                                     className="form-control form-control-sm"
//                                                     name="candidatePhone"
//                                                     value={formData.candidatePhone}
//                                                     onChange={handleChange}
//                                                     required
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="row g-2 mt-2">
//                                             <div className="col-12 col-md-6">
//                                                 <label className="form-label small fw-bold">Interviewer</label>
//                                                 <select
//                                                     className="form-select form-select-sm"
//                                                     name="interviewerId"
//                                                     value={formData.interviewerId}
//                                                     onChange={handleInterviewerChange}
//                                                     required
//                                                     disabled={loading}
//                                                 >
//                                                     <option value="">Select Interviewer</option>
//                                                     {filteredInterviewers.map(interviewer => (
//                                                         <option
//                                                             key={interviewer.data.userId}
//                                                             value={interviewer.data.userId}
//                                                             data-name={interviewer.data.fullname}
//                                                         >
//                                                             {interviewer.data.fullname}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                             <div className="col-12 col-md-6">
//                                                 <label className="form-label small fw-bold">Interview Date</label>
//                                                 <input
//                                                     type="date"
//                                                     className="form-control form-control-sm"
//                                                     name="interviewDate"
//                                                     value={formData.interviewDate}
//                                                     onChange={handleChange}
//                                                     required
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="row g-2 mt-2">
//                                             <div className="col-12 col-md-6">
//                                                 <label className="form-label small fw-bold">Start Time</label>
//                                                 <input
//                                                     type="time"
//                                                     className="form-control form-control-sm"
//                                                     name="start"
//                                                     value={formData.start}
//                                                     onChange={handleChange}
//                                                     required
//                                                 />
//                                             </div>
//                                             <div className="col-12 col-md-6">
//                                                 <label className="form-label small fw-bold">End Time</label>
//                                                 <input
//                                                     type="time"
//                                                     className="form-control form-control-sm"
//                                                     name="end"
//                                                     value={formData.end}
//                                                     onChange={handleChange}
//                                                     required
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="mt-3">
//                                             <label className="form-label small fw-bold">Notes</label>
//                                             <textarea
//                                                 className="form-control form-control-sm"
//                                                 rows="3"
//                                                 name="notes"
//                                                 value={formData.notes}
//                                                 onChange={handleChange}
//                                                 placeholder="Any special instructions or details"
//                                             ></textarea>
//                                         </div>

//                                         <div className="modal-footer d-flex flex-wrap gap-2 mt-3 px-0">
//                                             {formData._id && (
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-danger order-1 order-md-0 me-md-auto btn-sm"
//                                                     onClick={handleDelete}
//                                                     disabled={loading}
//                                                 >
//                                                     {loading ? (
//                                                         <span className="spinner-border spinner-border-sm me-1" role="status"></span>
//                                                     ) : (
//                                                         <i className="bi bi-trash me-1"></i>
//                                                     )}
//                                                     Delete
//                                                 </button>
//                                             )}
//                                             <button
//                                                 type="button"
//                                                 className="btn btn-outline-secondary order-2 order-md-1 btn-sm"
//                                                 onClick={() => {
//                                                     setShowModal(false);
//                                                     setSelectedEvent(null);
//                                                 }}
//                                                 disabled={loading}
//                                             >
//                                                 Cancel
//                                             </button>
//                                             <button
//                                                 type="submit"
//                                                 className="btn btn-primary order-3 order-md-2 btn-sm"
//                                                 disabled={loading}
//                                             >
//                                                 {loading ? (
//                                                     <span className="spinner-border spinner-border-sm me-1" role="status"></span>
//                                                 ) : (
//                                                     <i className={`bi ${formData._id ? 'bi-pencil' : 'bi-calendar-plus'} me-1`}></i>
//                                                 )}
//                                                 {formData._id ? 'Update' : 'Schedule'}
//                                             </button>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Modal Backdrop */}
//                 {showModal && <div className="modal-backdrop fade show"></div>}
//             </div>
//         </div>
//     );
// };

// function renderEventContent(eventInfo) {
//     return (
//         <div
//             className="fc-event-content position-relative p-1 bg-light border rounded-3 shadow-sm"
//             style={{
//                 transition: 'transform 0.2s ease, box-shadow 0.2s ease',
//                 zIndex: 1,
//                 cursor: 'pointer',
//                 overflow: 'visible'
//             }}
//         >
//             <div className="compact-view">
//                 <div className="d-flex align-items-center gap-1">
//                     <div className="fc-event-time fw-bold text-primary" style={{ fontSize: '0.8rem' }}>
//                         {eventInfo.timeText}
//                     </div>
//                     <span
//                         className={`badge rounded-pill ${eventInfo.event.extendedProps.status === 'completed'
//                             ? 'bg-success'
//                             : eventInfo.event.extendedProps.status === 'cancelled'
//                                 ? 'bg-danger'
//                                 : eventInfo.event.extendedProps.status === 'scheduled'
//                                     ? 'bg-primary'
//                                     : 'bg-secondary'
//                             } text-white`}
//                         style={{ fontSize: '0.65rem' }}
//                     >
//                         {eventInfo.event.extendedProps.status}
//                     </span>
//                 </div>
//                 <div
//                     className="fc-event-title text-dark fw-medium text-truncate"
//                     style={{ fontSize: '0.85rem' }}
//                 >
//                     {eventInfo.event.title}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ScheduleInterviewWithCV;













import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { useAuthContext } from '../../../context/auth-context';
import { useSuperAdminContext } from '../../../context/superadmin-context';
import toast from 'react-hot-toast';

const ScheduleInterviewWithCV = () => {
    const { jobId, encodedCVId } = useParams();
    const cvId = decodeURIComponent(encodedCVId);
    const navigate = useNavigate();

    const { server, token } = useAuthContext();
    const { getAllInterviewers, interviewers, markAsCancelledForCV } = useSuperAdminContext();

    const [job, setJob] = useState(null);
    const [cv, setCv] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [formData, setFormData] = useState({
        _id: '',
        jobTitle: '',
        candidateName: "",
        candidateEmail: "",
        candidatePhone: "",
        interviewerName: '',
        interviewerId: '',
        interviewDate: '',
        start: '',
        end: '',
        notes: '',
        status: 'scheduled',
    });

    const filteredInterviewers = interviewers.filter(
        (intv) => intv.data.userId
    );

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        getAllInterviewers();
        fetchJobAndCVData();
    }, []);

    const fetchJobAndCVData = async () => {
        try {
            const jobResponse = await axios.get(`${server}/api/v1/superadmin/cvforinterview/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJob(jobResponse.data.data);

            const foundCv = jobResponse.data.data.CvFile.find(c => c._id === cvId);
            if (!foundCv) throw new Error('CV not found');

            setCv(foundCv);

            setFormData(prev => ({
                ...prev,
                jobTitle: jobResponse.data.data.title || '',
                candidateName: foundCv.candidateName || "",
                candidateEmail: foundCv.candidateEmail || "",
                candidatePhone: foundCv.candidatePhone || ""
            }));

            const interviewsRes = await axios.get(`${server}/api/v1/superadmin/getCVInterviews/${jobId}/${cvId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEvents(
                interviewsRes.data.data.map(event => ({
                    ...event,
                    id: event._id,
                    title: `${event.jobTitle} - ${event.candidateName}`,
                    start: new Date(event.start),
                    end: new Date(event.end)
                }))
            );

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

    const handleDateSelect = (selectInfo) => {
        setFormData(prev => ({
            ...prev,
            _id: '',
            interviewerId: '',
            interviewerName: '',
            interviewDate: moment(selectInfo.start).format('YYYY-MM-DD'),
            start: moment(selectInfo.start).format('HH:mm'),
            end: moment(selectInfo.start).add(1, 'hour').format('HH:mm'),
            notes: '',
            status: 'scheduled'
        }));
        setShowModal(true);
    };

    const handleEventClick = (clickInfo) => {
        const event = clickInfo.event;
        setFormData({
            _id: event.id,
            jobTitle: event.extendedProps.jobTitle,
            candidateName: event.extendedProps.candidateName,
            candidateEmail: event.extendedProps.candidateEmail,
            candidatePhone: event.extendedProps.candidatePhone,
            interviewerId: event.extendedProps.interviewerId,
            interviewerName: event.extendedProps.interviewerName,
            interviewDate: moment(event.start).format('YYYY-MM-DD'),
            start: moment(event.start).format('HH:mm'),
            end: moment(event.end).format('HH:mm'),
            notes: event.extendedProps.notes,
            status: event.extendedProps.status || 'scheduled'
        });
        setShowModal(true);
    };

    const validateForm = () => {
        if (!formData.jobTitle) {
            toast.error('Job title is required');
            return false;
        }
        if (!formData.candidateName) {
            toast.error('Candidate name is required');
            return false;
        }
        if (!formData.candidateEmail) {
            toast.error('Candidate email is required');
            return false;
        }
        if (!formData.candidatePhone) {
            toast.error('Candidate phone is required');
            return false;
        }
        if (!formData.interviewerId) {
            toast.error('Interviewer is required');
            return false;
        }
        if (!formData.interviewDate) {
            toast.error('Interview date is required');
            return false;
        }
        if (!formData.start) {
            toast.error('Start time is required');
            return false;
        }
        if (!formData.end) {
            toast.error('End time is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        try {
            setLoading(true);

            const interviewData = {
                ...formData,
                startDateTime: moment(`${formData.interviewDate} ${formData.start}`).toISOString(),
                endDateTime: moment(`${formData.interviewDate} ${formData.end}`).toISOString()
            };

            let res;
            const isUpdate = !!formData._id;
            if (isUpdate) {
                res = await axios.put(`${server}/api/v1/superadmin/updateCVInterview/${jobId}/${cvId}/${formData._id}`,
                    interviewData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                res = await axios.post(`${server}/api/v1/superadmin/cvforinterview/${jobId}/schedule`,
                    { cvId, interviewDetails: interviewData },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            toast.success(res.data.message);
            fetchJobAndCVData();
            setShowModal(false);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!formData._id) return;

        try {
            setLoading(true);
            const res = await axios.delete(`${server}/api/v1/superadmin/deleteCVInterview/${jobId}/${cvId}/${formData._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(res.data.message);
            fetchJobAndCVData();
            setShowModal(false);
        } catch (err) {
            // console.error(err);
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelInterviewForCV = async () => {
        if (!formData._id) return;

        try {
            setLoading(true);
            markAsCancelledForCV(jobId, cvId, formData._id)
            fetchJobAndCVData();
            setShowModal(false);
        } catch (err) {
            // console.error(err);
            toast.error(err.response?.data?.message || err.message);
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

    if (error) return (
        <div className="container-fluid">
            <div className="container py-4">
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            </div>
        </div>
    );

    if (!job || !cv) return (
        <div className="container-fluid">
            <div className="container py-4">
                <div className="alert alert-info">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    Data not found
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid px-0">
            <div className="container p-3 p-md-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4 gap-2">
                    <h2 className="h4 mb-0">Schedule Interview for CV</h2>
                    <div className="d-flex flex-wrap gap-2">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => navigate(-1)}
                        >
                            <i className="bi bi-arrow-left me-1 me-md-2"></i>
                            <span className="d-none d-md-inline">Back to CV List</span>
                        </button>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                setFormData(prev => ({
                                    ...prev,
                                    _id: '',
                                    interviewerId: '',
                                    interviewerName: '',
                                    interviewDate: '',
                                    start: '',
                                    end: '',
                                    notes: '',
                                    status: 'scheduled'
                                }));
                                setShowModal(true);
                            }}
                        >
                            <i className="bi bi-plus me-1 me-md-2"></i>
                            <span className="d-none d-md-inline">Schedule Interview</span>
                            <span className="d-md-none">Schedule</span>
                        </button>
                    </div>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-bottom-0 pb-0 d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 p-2 rounded me-2 me-md-3">
                            <i className="bi bi-calendar-event fs-5 fs-md-4 text-primary"></i>
                        </div>
                        <h5 className="h6 mb-0">Scheduled Interviews</h5>
                    </div>
                    <div className="card-body p-2 p-md-3">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: isMobile ? '' : 'dayGridMonth,timeGridWeek,timeGridDay'
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
                            aspectRatio={isMobile ? 0.5 : 1.8}
                            eventDisplay="block"
                            eventTextColor="#000"
                            eventBackgroundColor="#fff"
                            eventBorderColor="#ddd"
                        />
                    </div>
                </div>

                {/* Interview Modal */}
                <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1">
                    <div className={`modal-dialog ${isMobile ? 'modal-fullscreen' : 'modal-xl modal-dialog-centered'}`}>
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
                            <div className="modal-body p-0 overflow-auto" style={{ maxHeight: isMobile ? 'calc(100vh - 120px)' : '70vh' }}>
                                <div className="row g-0">
                                    {/* CV Preview Card */}
                                    <div className="col-lg-6">
                                        <div className="card border-0 h-100">
                                            <div className="card-header bg-white border-bottom-0 pb-0 d-flex align-items-center">
                                                <div className="bg-primary bg-opacity-10 p-2 rounded me-2 me-md-3">
                                                    <i className="bi bi-file-earmark-text fs-5 fs-md-4 text-primary"></i>
                                                </div>
                                                <div>
                                                    <h5 className="h6 mb-0">CV Preview</h5>
                                                    <p className="text-muted small mb-0">{cv.originalName}</p>
                                                </div>
                                                <span className="badge bg-secondary ms-auto small">{(cv.size / 1024).toFixed(2)} KB</span>
                                            </div>
                                            <div className="card-body p-2">
                                                <div className="ratio ratio-1x1 bg-light rounded-3 border">
                                                    {cv.secure_url.endsWith('.pdf') ? (
                                                        <embed
                                                            src={cv.secure_url}
                                                            type="application/pdf"
                                                            className="w-100 h-100"
                                                            title="CV Preview"
                                                        />
                                                    ) : (
                                                        <iframe
                                                            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cv.secure_url)}`}
                                                            className="w-100 h-100"
                                                            title="CV Preview"
                                                        ></iframe>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <form className="col-lg-6 p-3" onSubmit={handleSubmit}>
                                        {error && <div className="alert alert-danger mb-3">{error}</div>}

                                        <div className="row g-2">
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small fw-bold">Job Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    name="jobTitle"
                                                    value={formData.jobTitle}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small fw-bold">Candidate Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    name="candidateName"
                                                    value={formData.candidateName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small fw-bold">Candidate Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control form-control-sm"
                                                    name="candidateEmail"
                                                    value={formData.candidateEmail}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small fw-bold">Candidate Phone</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    name="candidatePhone"
                                                    value={formData.candidatePhone}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small fw-bold">Interviewer</label>
                                                <select
                                                    className="form-select form-select-sm"
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
                                                <label className="form-label small fw-bold">Interview Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control form-control-sm"
                                                    name="interviewDate"
                                                    value={formData.interviewDate}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small fw-bold">Start Time</label>
                                                <input
                                                    type="time"
                                                    className="form-control form-control-sm"
                                                    name="start"
                                                    value={formData.start}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small fw-bold">End Time</label>
                                                <input
                                                    type="time"
                                                    className="form-control form-control-sm"
                                                    name="end"
                                                    value={formData.end}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <label className="form-label small fw-bold">Notes</label>
                                            <textarea
                                                className="form-control form-control-sm"
                                                rows="3"
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                placeholder="Any special instructions or details"
                                            ></textarea>
                                        </div>

                                        <div className="modal-footer d-flex flex-wrap gap-2 mt-3 px-0">
                                            {formData._id && (
                                                <button
                                                    type="button"
                                                    className="btn btn-danger order-1 order-md-0 me-md-auto btn-sm"
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
                                                className="btn btn-outline-secondary order-2 order-md-1 btn-sm"
                                                onClick={handleCancelInterviewForCV}
                                                disabled={loading}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary order-3 order-md-2 btn-sm"
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
                    {eventInfo.event.title}
                </div>
            </div>
        </div>
    );
}

export default ScheduleInterviewWithCV;
