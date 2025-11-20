// import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
// import { useAuthContext } from '../../../context/auth-context';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import CodeEditor1 from './CodeEditor1';
// import ReportForm1 from './ReportForm1';

// const appID = parseInt(import.meta.env.VITE_ZEGOCLOUD_APPID, 10);
// // SECURITY NOTE: Don't expose server secret in frontend in production.
// const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;

// const RoomPageWithZegoCloud1 = () => {
//   const { roomId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { response } = location.state || {};
//   const { user, server, socket, token } = useAuthContext();

//   const zpInstance = useRef(null);
//   const [users, setUsers] = useState([]);
//   const [showReportForm, setShowReportForm] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingUrl, setRecordingUrl] = useState(null);
//   const [recordingTaskId, setRecordingTaskId] = useState(null);
//   const [isRecordingLoading, setIsRecordingLoading] = useState(false);
//   const [recordingStatus, setRecordingStatus] = useState('idle');

//   const { firstId, secondId } = useMemo(() => {
//     if (!response) return { firstId: null, secondId: null };
//     const { source, screen, interviewDetails } = response;
//     return {
//       firstId:
//         source === 'Byjobpost'
//           ? user?.userId
//           : screen === 'interviewer'
//             ? interviewDetails?.interviewerId
//             : interviewDetails?.cvId,
//       secondId:
//         source === 'Byjobpost'
//           ? user?.fullname
//           : screen === 'interviewer'
//             ? interviewDetails?.interviewerName
//             : interviewDetails?.candidateName,
//     };
//   }, [response, user]);

//   const myMeeting = useCallback(
//     async (element) => {
//       if (!element || !firstId || !roomId) return;

//       try {
//         // NOTE: This uses generateKitTokenForTest which requires server secret.
//         // In production you must request a server-generated kit token instead.
//         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//           appID,
//           serverSecret,
//           roomId,
//           firstId,
//           secondId || 'Anonymous'
//         );
//         const zp = ZegoUIKitPrebuilt.create(kitToken);
//         zpInstance.current = zp;

//         const role =
//           user?.role === 'interviewer' ? ZegoUIKitPrebuilt.Host : ZegoUIKitPrebuilt.Cohost;

//         zp.joinRoom({
//           container: element,
//           sharedLinks: [
//             {
//               name: 'Personal link',
//               url: `${window.location.origin}${window.location.pathname}?roomID=${roomId}`,
//             },
//           ],
//           scenario: { mode: ZegoUIKitPrebuilt.OneONOneCall },
//           turnOnMicrophoneWhenJoining: true,
//           turnOnCameraWhenJoining: true,
//           showPreJoinView: true,
//           showScreenSharingButton: true,
//           showRoomTimer: true,
//           showLeavingView: false,
//           showRecordButton: false,
//           role: role,
//           onLeaveRoom: () => {
//             if (isRecording) {
//               handleStopRecording();
//             }

//             if (!response?.source) {
//               window.close();
//               return;
//             }

//             if (response.source === 'Byjobpost') {
//               const destination =
//                 user?.role === 'interviewer'
//                   ? '/interviewer/interviews-by-job-posts'
//                   : '/user/interviews-by-job-posts';
//               navigate(destination);
//             } else if (response.source === 'ByCV' && user?.role === 'interviewer') {
//               navigate('/interviewer/interviews-by-cv');
//             } else {
//               window.close();
//             }
//           },
//         });
//       } catch (error) {
//         console.error('Failed to initialize video call:', error);
//         navigate('/error', { state: { error: 'Failed to initialize video call' } });
//       }
//     },
//     [roomId, firstId, secondId, user, navigate, response, isRecording]
//   );

//   const getUserViewClass = useMemo(() => {
//     if (!response?.screen) return 'default-view';
//     return {
//       interviewer: 'interviewer-view',
//       'random-candidate': 'random-candidate-view',
//       candidate: 'candidate-view',
//     }[response.screen] || 'default-view';
//   }, [response?.screen]);

//   const handleStartRecording = useCallback(async () => {
//     if (isRecording || isRecordingLoading) return;

//     setIsRecordingLoading(true);
//     try {
//       const { data } = await axios.post(
//         `${server}/api/v1/recording/start`,
//         { roomId, details: response },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data.success && data.taskId) {
//         setIsRecording(true);
//         setRecordingTaskId(data.taskId);
//         setRecordingStatus('started');
//         toast.success(data.message || 'Recording started');
//       } else {
//         toast.error(data.message || 'Failed to start recording');
//       }
//     } catch (err) {
//       console.error('Failed to start recording:', err);
//       const errMsg = err.response?.data?.message || 'Failed to start recording';
//       toast.error(errMsg);
//     } finally {
//       setIsRecordingLoading(false);
//     }
//   }, [roomId, server, token, isRecording, isRecordingLoading, response]);

//   const handleStopRecording = useCallback(async () => {
//     if (!isRecording || !recordingTaskId || isRecordingLoading) return;

//     setIsRecordingLoading(true);
//     setRecordingStatus('processing');
//     const loadingToastId = toast.loading('Processing recording...');

//     try {
//       const res = await axios.post(
//         `${server}/api/v1/recording/stop`,
//         { taskId: recordingTaskId, roomId: roomId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Server returns { message, details: { files: [...], recordingUrl } }
//       if (res.data && (res.data.details || res.data.recordingUrl)) {
//         setIsRecording(false);
//         const details = res.data.details || {};
//         const firstUrl = details.recordingUrl || (details.files && details.files[0] && details.files[0].FileUrl) || null;
//         setRecordingUrl(firstUrl);
//         setRecordingStatus('completed');
//         toast.success(res.data.message || 'Recording saved successfully');
//       } else {
//         setRecordingStatus('failed');
//         toast.error(res.data.message || 'Failed to process recording');
//       }
//     } catch (err) {
//       console.error('Failed to stop recording:', err);
//       setRecordingStatus('failed');
//       const errMsg = err.response?.data?.message || 'Failed to stop recording';
//       toast.error(errMsg);
//     } finally {
//       toast.dismiss(loadingToastId);
//       setIsRecordingLoading(false);
//       setRecordingTaskId(null);
//     }
//   }, [recordingTaskId, server, token, isRecording, isRecordingLoading, roomId]);

//   // Poll recording status when recordingTaskId exists (use GET with roomId query param)
//   useEffect(() => {
//     let intervalId;

//     if (isRecording && recordingTaskId) {
//       intervalId = setInterval(async () => {
//         try {
//           const res = await axios.get(
//             `${server}/api/v1/recording/status/${recordingTaskId}?roomId=${encodeURIComponent(roomId)}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           // Server returns { Data: {...} } OR our consistent shape { status, details }
//           // We'll support both. Prefer our shape.
//           if (res.data?.status) {
//             setRecordingStatus(res.data.status);
//             if (res.data.status === 'completed' || res.data.status === 'failed') {
//               setIsRecording(false);
//               const firstUrl = res.data.details?.recordingUrl || (res.data.details?.files?.[0]?.FileUrl) || null;
//               if (firstUrl) setRecordingUrl(firstUrl);
//               setRecordingTaskId(null);

//               if (res.data.status === 'completed') toast.success('Recording completed');
//               else toast.error('Recording failed');

//               clearInterval(intervalId);
//             }
//           } else if (res.data?.Data) {
//             // Zego raw response -- try to extract
//             const zdata = res.data.Data;
//             setRecordingStatus(zdata.Status || recordingStatus);
//             const files = zdata.RecordFiles || [];
//             const allFinished =
//               files.length > 0 && files.every((f) => f.Status === 4 && (f.FileUrl || f.FileKey));
//             if (allFinished) {
//               setIsRecording(false);
//               const first = files[0];
//               const url = first.FileUrl || first.FileKey;
//               if (url) setRecordingUrl(url);
//               setRecordingTaskId(null);
//               toast.success('Recording completed');
//               clearInterval(intervalId);
//             }
//           }
//         } catch (err) {
//           console.error('Error checking recording status:', err);
//         }
//       }, 5000);
//     }

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [isRecording, recordingTaskId, server, token, roomId]);

//   useEffect(() => {
//     const updateInterviewStatus = async () => {
//       try {
//         const res = await axios.post(
//           `${server}/api/v1/interviews/updateStatus`,
//           { interviewId: roomId },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         if (user?.role === 'interviewer') {
//           toast.success(res.data.message);
//         }
//       } catch (error) {
//         console.error('Error updating interview status:', error);
//         const errMsg = error.response?.data?.message || 'Failed to update interview status.';
//         if (user?.role === 'interviewer') {
//           toast.error(errMsg);
//         }
//       }
//     };

//     if (users.length > 1) updateInterviewStatus();
//   }, [users, roomId, server, token, user?.role]);

//   return (
//     <div className="room-container">
//       <div className={`main-content ${getUserViewClass}`}>
//         <div className="video-editor-container">
//           <div className="video-container left-panel" ref={myMeeting} />
//           <CodeEditor1
//             onShowReport={() => user?.role === 'interviewer' && setShowReportForm(true)}
//             isInterviewer={user?.role === 'interviewer'}
//             setUsers={setUsers}
//             socket={socket}
//             userId={firstId}
//             userName={secondId}
//             roomId={roomId}
//           />
//         </div>

//         {user?.role?.toLowerCase() === 'interviewer' && (
//           <div className="record-controls">
//             {!isRecording ? (
//               <button onClick={handleStartRecording} className="btn btn-success" disabled={isRecordingLoading}>
//                 {isRecordingLoading ? (
//                   <>
//                     <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Starting...
//                   </>
//                 ) : (
//                   <>
//                     <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '6px' }}>
//                       <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
//                       <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
//                     </svg>
//                     Start Recording
//                   </>
//                 )}
//               </button>
//             ) : (
//               <button onClick={handleStopRecording} className="btn btn-danger" disabled={isRecordingLoading}>
//                 {isRecordingLoading ? (
//                   <>
//                     <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     {recordingStatus === 'processing' ? 'Processing...' : 'Stopping...'}
//                   </>
//                 ) : (
//                   <>
//                     <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '6px' }}>
//                       <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z" />
//                     </svg>
//                     Stop Recording
//                   </>
//                 )}
//               </button>
//             )}

//             {isRecording && (
//               <div className="recording-status">
//                 <div className={`status-dot ${recordingStatus}`}></div>
//                 <span>
//                   {recordingStatus === 'started' && 'Recording...'}
//                   {recordingStatus === 'processing' && 'Processing...'}
//                   {recordingStatus === 'completed' && 'Completed'}
//                   {recordingStatus === 'failed' && 'Failed'}
//                 </span>
//               </div>
//             )}

//             {recordingUrl && (
//               <a href={recordingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
//                 <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '6px' }}>
//                   <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
//                   <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm9 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
//                 </svg>
//                 View Recording
//               </a>
//             )}
//           </div>
//         )}
//       </div>

//       {showReportForm && (
//         <ReportForm1
//           isVisible={showReportForm}
//           onClose={() => setShowReportForm(false)}
//           roomId={roomId}
//           token={token}
//           server={server}
//           recordingUrl={recordingUrl}
//         />
//       )}

//       <style>
//         {`
//                 .room-container {
//                     display: flex;
//                     flex-direction: column;
//                     height: 100vh;
//                     width: 100vw;
//                     overflow: hidden;
//                     background-color: #0d1117;
//                 }
//                 .main-content {
//                     position: relative;
//                     display: flex;
//                     flex-direction: column;
//                     width: 100%;
//                     height: 100%;
//                 }
//                 .video-editor-container {
//                     display: flex;
//                     width: 100%;
//                     height: 100%;
//                 }
//                 .video-container {
//                     flex: 0 0 60%;
//                     height: 100%;
//                     background-color: #161b22;
//                     min-width: 0;
//                 }
//                 .record-controls {
//                     position: absolute;
//                     top: 20px;
//                     left: 50%;
//                     transform: translateX(-50%);
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     gap: 12px;
//                     padding: 12px;
//                     z-index: 1000;
//                     background-color: rgba(22, 27, 34, 0.9);
//                     backdrop-filter: blur(10px);
//                     border-radius: 8px;
//                     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
//                     border: 1px solid #30363d;
//                 }
//                 .btn {
//                     padding: 10px 16px;
//                     border: none;
//                     border-radius: 6px;
//                     font-size: 14px;
//                     font-weight: 500;
//                     cursor: pointer;
//                     transition: all 0.2s ease;
//                     text-decoration: none;
//                     display: inline-flex;
//                     align-items: center;
//                 }
//                 .btn:disabled {
//                     opacity: 0.7;
//                     cursor: not-allowed;
//                 }
//                 .btn-success {
//                     background-color: #238636;
//                     color: white;
//                 }
//                 .btn-success:hover:not(:disabled) {
//                     background-color: #2ea043;
//                 }
//                 .btn-danger {
//                     background-color: #da3633;
//                     color: white;
//                 }
//                 .btn-danger:hover:not(:disabled) {
//                     background-color: #f85149;
//                 }
//                 .btn-primary {
//                     background-color: #1f6feb;
//                     color: white;
//                 }
//                 .btn-primary:hover {
//                     background-color: #388bfd;
//                 }
//                 .recording-status {
//                     display: flex;
//                     align-items: center;
//                     gap: 8px;
//                     padding: 6px 12px;
//                     background-color: rgba(22, 27, 34, 0.8);
//                     border-radius: 20px;
//                     font-size: 13px;
//                     color: #f0f6fc;
//                 }
//                 .status-dot {
//                     width: 8px;
//                     height: 8px;
//                     border-radius: 50%;
//                     background-color: #f85149;
//                 }
//                 .status-dot.started {
//                     background-color: #f85149;
//                     animation: pulse 1.5s infinite;
//                 }
//                 .status-dot.processing {
//                     background-color: #d29922;
//                 }
//                 .status-dot.completed {
//                     background-color: #3fb950;
//                 }
//                 .status-dot.failed {
//                     background-color: #da3633;
//                 }
//                 @keyframes pulse {
//                     0% { opacity: 1; }
//                     50% { opacity: 0.5; }
//                     100% { opacity: 1; }
//                 }
//                 @media (max-width: 768px) {
//                     .video-editor-container {
//                         flex-direction: column;
//                     }
//                     .video-container {
//                         flex: 0 0 50%;
//                         width: 100%;
//                     }
//                     .record-controls {
//                         position: relative;
//                         transform: none;
//                         left: 0;
//                         top: 0;
//                         margin: 10px;
//                         width: calc(100% - 20px);
//                         flex-wrap: wrap;
//                     }
//                 }
//                 .animate-spin {
//                     animation: spin 1s linear infinite;
//                 }
//                 @keyframes spin {
//                     from { transform: rotate(0deg); }
//                     to { transform: rotate(360deg); }
//                 }
//             `}
//       </style>
//     </div>
//   );
// };

// export default RoomPageWithZegoCloud1;














import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io as ioClient } from 'socket.io-client';
import CodeEditor1 from './CodeEditor1';
import ReportForm1 from './ReportForm1';
import { useAuthContext } from '../../../context/auth-context';

const RoomPageWithZegoCloud1 = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { response } = location.state || {};
  const { user, server, socket, token } = useAuthContext();

  console.log(user);
  

  const [users, setUsers] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingLoading, setIsRecordingLoading] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('idle');
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [recordingTaskId, setRecordingTaskId] = useState(null);

  const appID = parseInt(import.meta.env.VITE_ZEGOCLOUD_APPID, 10);
  // // SECURITY NOTE: Don't expose server secret in frontend in production.
  const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;

  const isInterviewer = (user?.role || '').toLowerCase() === 'interviewer';
  const zegoContainerRef = useRef(null);
  const zpRef = useRef(null);
  const socketRef = useRef(null);

  const { firstId, secondId } = useMemo(() => {
    if (!response) return { firstId: null, secondId: null };
    const { source, screen, interviewDetails } = response;
    return {
      firstId:
        source === 'Byjobpost'
          ? user?.userId
          : screen === 'interviewer'
            ? interviewDetails?.interviewerId
            : interviewDetails?.cvId,
      secondId:
        source === 'Byjobpost'
          ? user?.fullname
          : screen === 'interviewer'
            ? interviewDetails?.interviewerName
            : interviewDetails?.candidateName,
    };
  }, [response, user]);

  // Initialize Zego UI using server-issued kit token
  const initZego = useCallback(async (container) => {
    if (!container || !firstId || !roomId) return;

    try {

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        firstId,
        secondId || 'Anonymous'
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp;

      const role =
        user?.role === 'interviewer' ? ZegoUIKitPrebuilt.Host : ZegoUIKitPrebuilt.Cohost;

      zp.joinRoom({
        container,
        sharedLinks: [
          {
            name: 'Personal link',
            url: `${window.location.origin}${window.location.pathname}?roomID=${roomId}`,
          },
        ],
        scenario: { mode: ZegoUIKitPrebuilt.OneONOneCall },
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showPreJoinView: true,
        showScreenSharingButton: true,
        showRoomTimer: true,
        showLeavingView: false,
        showRecordButton: false,
        role: role,
        onLeaveRoom: () => {
          if (isRecording) {
            handleStopRecording();
          }

          if (!response?.source) {
            window.close();
            return;
          }

          if (response.source === 'Byjobpost') {
            const destination =
              user?.role === 'interviewer'
                ? '/interviewer/interviews-by-job-posts'
                : '/user/interviews-by-job-posts';
            navigate(destination);
          } else if (response.source === 'ByCV' && user?.role === 'interviewer') {
            navigate('/interviewer/interviews-by-cv');
          } else {
            window.close();
          }
        },
      });
    } catch (error) {
      console.error('Failed to initialize video call:', error);
      toast.error('Failed to initialize video');
    }
  }, [roomId, firstId, secondId, user, navigate, response, isRecording]);


  // attach Zego to container once ref is set
  useEffect(() => {
    if (zegoContainerRef.current) initZego(zegoContainerRef.current);
    return () => {
      try { zpRef.current?.leaveRoom?.(); } catch (e) { }
    };
  }, [zegoContainerRef, initZego]);

  // Socket.IO client for realtime events (recording completed)
  useEffect(() => {
    socketRef.current = ioClient(); // configure URI if backend differs
    const s = socketRef.current;
    s.on('connect', () => console.log('socket connected', s.id));
    s.on('recording:completed', (payload) => {
      // If this is our task update UI instantly
      if (payload?.taskId && payload.taskId === recordingTaskId) {
        setRecordingStatus('completed');
        setRecordingUrl(payload.recordingUrl || (payload.files && payload.files[0] && payload.files[0].FileUrl));
        setRecordingTaskId(null);
        setIsRecording(false);
        toast.success('Recording ready');
      }
    });
    s.on('recording:failed', (payload) => {
      if (payload?.taskId === recordingTaskId) {
        setRecordingStatus('failed');
        setIsRecording(false);
        setRecordingTaskId(null);
        toast.error('Recording failed on server');
      }
    });

    return () => {
      s.off('recording:completed');
      s.off('recording:failed');
      s.disconnect();
    };
  }, [recordingTaskId]);

  const handleStartRecording = useCallback(async () => {
    if (isRecording || isRecordingLoading) return;
    setIsRecordingLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/recording/start`, { roomId, details: response }, { headers: { Authorization: `Bearer ${token}` } });
      if (data?.success && data?.taskId) {
        setIsRecording(true);
        setRecordingTaskId(data.taskId);
        setRecordingStatus('started');
        toast.success('Recording started');
      } else {
        toast.error(data?.message || 'Failed to start recording');
      }
    } catch (err) {
      console.error('start recording client error', err);
      toast.error(err?.response?.data?.message || 'Failed to start recording');
    } finally {
      setIsRecordingLoading(false);
    }
  }, [isRecording, isRecordingLoading, roomId, response, server, token]);

  const handleStopRecording = useCallback(async ({ silent } = {}) => {
    if (!isRecording || !recordingTaskId || isRecordingLoading) return;
    setIsRecordingLoading(true);
    setRecordingStatus('processing');
    const loadingId = silent ? null : toast.loading('Stopping recording — server will finish processing in background');

    try {
      await axios.post(`${server}/api/v1/recording/stop`, { taskId: recordingTaskId, roomId }, { headers: { Authorization: `Bearer ${token}` } });
      // Do not clear recordingTaskId — let server/push/fallback poll clear it when done.
      setIsRecording(false);
      if (!silent) toast.success('Recording will continue processing in background');
    } catch (err) {
      console.error('stop recording client error', err);
      setRecordingStatus('failed');
      toast.error(err?.response?.data?.message || 'Failed to stop recording');
    } finally {
      if (loadingId) toast.dismiss(loadingId);
      setIsRecordingLoading(false);
    }
  }, [isRecording, recordingTaskId, isRecordingLoading, roomId, server, token]);

  // Poll fallback: only poll if we have a recordingTaskId and status is started/processing
  useEffect(() => {
    let interval;
    const shouldPoll = Boolean(recordingTaskId) && ['started', 'processing'].includes(recordingStatus);
    if (shouldPoll) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`${server}/api/v1/recording/status/${recordingTaskId}?roomId=${encodeURIComponent(roomId)}`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.data?.status) {
            setRecordingStatus(res.data.status);
            if (res.data.status === 'completed' || res.data.status === 'failed') {
              const firstUrl = res.data.details?.recordingUrl || res.data.details?.files?.[0]?.FileUrl || null;
              if (firstUrl) setRecordingUrl(firstUrl);
              setIsRecording(false);
              setRecordingTaskId(null);
              if (res.data.status === 'completed') toast.success('Recording ready');
              else toast.error('Recording failed');
              clearInterval(interval);
            }
          }
        } catch (err) {
          console.error('poll status error', err);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [recordingTaskId, recordingStatus, server, roomId, token]);

  // Update interview status on join >1 user (your original behavior)
  useEffect(() => {
    const updateInterviewStatus = async () => {
      try {
        const res = await axios.post(`${server}/api/v1/interviews/updateStatus`, { interviewId: roomId }, { headers: { Authorization: `Bearer ${token}` } });
        if (isInterviewer) toast.success(res.data.message);
      } catch (err) {
        if (isInterviewer) toast.error(err?.response?.data?.message || 'Failed to update interview status');
      }
    };
    if (users.length > 1) updateInterviewStatus();
  }, [users, roomId, server, token, isInterviewer]);

  return (
    <div className="room-container">
      <div className="main-content">
        <div className="video-editor-container">
          <div className="video-container left-panel" ref={zegoContainerRef} />
          <CodeEditor1
            onShowReport={() => user?.role === 'interviewer' && setShowReportForm(true)}
            isInterviewer={user?.role === 'interviewer'}
            setUsers={setUsers}
            socket={socket}
            userId={firstId}
            userName={secondId}
            roomId={roomId}
          />
        </div>

        {user?.role?.toLowerCase() === 'interviewer' && (
          <div className="record-controls">
            {!isRecording ? (
              <button onClick={handleStartRecording} className="btn btn-success" disabled={isRecordingLoading}>
                {isRecordingLoading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Starting...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '6px' }}>
                      <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                    </svg>
                    Start Recording
                  </>
                )}
              </button>
            ) : (
              <button onClick={handleStopRecording} className="btn btn-danger" disabled={isRecordingLoading}>
                {isRecordingLoading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {recordingStatus === 'processing' ? 'Processing...' : 'Stopping...'}
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '6px' }}>
                      <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z" />
                    </svg>
                    Stop Recording
                  </>
                )}
              </button>
            )}

            {isRecording && (
              <div className="recording-status">
                <div className={`status-dot ${recordingStatus}`}></div>
                <span>
                  {recordingStatus === 'started' && 'Recording...'}
                  {recordingStatus === 'processing' && 'Processing...'}
                  {recordingStatus === 'completed' && 'Completed'}
                  {recordingStatus === 'failed' && 'Failed'}
                </span>
              </div>
            )}

            {/* {recordingUrl && (
              <a href={recordingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '6px' }}>
                  <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                  <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm9 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                </svg>
                View Recording
              </a>
            )} */}
          </div>
        )}
      </div>

      {showReportForm && (
        <ReportForm1
          isVisible={showReportForm}
          onClose={() => setShowReportForm(false)}
          roomId={roomId}
          token={token}
          server={server}
          recordingUrl={recordingUrl}
        />
      )}

      <style>
        {`
                .room-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    width: 100vw;
                    overflow: hidden;
                    background-color: #0d1117;
                }
                .main-content {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                }
                .video-editor-container {
                    display: flex;
                    width: 100%;
                    height: 100%;
                }
                .video-container {
                    flex: 0 0 60%;
                    height: 100%;
                    background-color: #161b22;
                    min-width: 0;
                }
                .record-controls {
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    z-index: 1000;
                    background-color: rgba(22, 27, 34, 0.9);
                    backdrop-filter: blur(10px);
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    border: 1px solid #30363d;
                }
                .btn {
                    padding: 10px 16px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                }
                .btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .btn-success {
                    background-color: #238636;
                    color: white;
                }
                .btn-success:hover:not(:disabled) {
                    background-color: #2ea043;
                }
                .btn-danger {
                    background-color: #da3633;
                    color: white;
                }
                .btn-danger:hover:not(:disabled) {
                    background-color: #f85149;
                }
                .btn-primary {
                    background-color: #1f6feb;
                    color: white;
                }
                .btn-primary:hover {
                    background-color: #388bfd;
                }
                .recording-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 12px;
                    background-color: rgba(22, 27, 34, 0.8);
                    border-radius: 20px;
                    font-size: 13px;
                    color: #f0f6fc;
                }
                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #f85149;
                }
                .status-dot.started {
                    background-color: #f85149;
                    animation: pulse 1.5s infinite;
                }
                .status-dot.processing {
                    background-color: #d29922;
                }
                .status-dot.completed {
                    background-color: #3fb950;
                }
                .status-dot.failed {
                    background-color: #da3633;
                }
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                @media (max-width: 768px) {
                    .video-editor-container {
                        flex-direction: column;
                    }
                    .video-container {
                        flex: 0 0 50%;
                        width: 100%;
                    }
                    .record-controls {
                        position: relative;
                        transform: none;
                        left: 0;
                        top: 0;
                        margin: 10px;
                        width: calc(100% - 20px);
                        flex-wrap: wrap;
                    }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}
      </style>
    </div>
  );
};

export default RoomPageWithZegoCloud1;

