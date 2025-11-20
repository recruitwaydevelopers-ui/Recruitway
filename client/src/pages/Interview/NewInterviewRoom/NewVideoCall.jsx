// Initial Version Without Eye & Lip Tracking
import { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';

const NewVideoCall = ({ roomID, response, firstId, user, secondId, server, token, isInterviewer, users, candidateRecordingStatus, onStart }) => {
    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!firstId || !roomID) return;

        const appID = parseInt(import.meta.env.VITE_ZEGOCLOUD_APPID, 10);
        const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomID,
            firstId,
            secondId || 'Anonymous'
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        const role = user?.role === 'interviewer' ? ZegoUIKitPrebuilt.Host : ZegoUIKitPrebuilt.Cohost;

        zp.joinRoom({
            container: containerRef.current,
            sharedLinks: [
                {
                    name: "Interview Link",
                    url: `${window.location.origin}${window.location.pathname}?roomID=${roomID}`,
                }
            ],
            scenario: { mode: ZegoUIKitPrebuilt.GroupCall },
            turnOnMicrophoneWhenJoining: true,
            turnOnCameraWhenJoining: true,
            showLeavingView: false,
            showPreJoinView: true,
            showRoomTimer: true,
            showRoomDetailsButton: false,
            showUsersButton: true,
            showScreenSharingButton: true,
            showTextChat: true,
            showUserList: true,
            role: role,
            onLeaveRoom: () => {
                if (!response?.source) {
                    window.close();
                    return;
                }

                if (candidateRecordingStatus === "recording") {
                    onStart && onStart();
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
    }, [roomID, firstId, secondId, user, response, navigate]);

    // Update interview status when users > 1
    useEffect(() => {
        const updateInterviewStatus = async () => {
            try {
                const res = await axios.post(`${server}/api/v1/interviews/updateStatus`,
                    { interviewId: roomID },
                    {
                        headers:
                        {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (isInterviewer) toast.success(res.data.message);
            } catch (err) {
                if (isInterviewer) toast.error(err?.response?.data?.message || 'Failed to update interview status');
            }
        };

        if (users >= 2) {
            if (isInterviewer) {
                updateInterviewStatus();
            }
        }
    }, [roomID, server, token, isInterviewer, users]);

    return <div ref={containerRef} className="w-100 h-100" />;
};

export default NewVideoCall;















// // First Version with Eye & Lips Tracking

// import { useEffect, useRef, useState } from "react";
// import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import EyeLipTracker from "./EyeLipTracker";

// const NewVideoCall = ({
//     roomID,
//     response,
//     firstId,
//     user,
//     secondId,
//     server,
//     token,
//     isInterviewer,
//     users,
//     candidateRecordingStatus,
//     onStop,
//     onCheatingDetected = () => { },
//     onProctoringWarnings = () => { },
//     cheatingIncidents: parentCheatingIncidents = [],
// }) => {
//     const containerRef = useRef(null);
//     const navigate = useNavigate();

//     // Local anti-cheat state
//     const [cheatingDetected, setCheatingDetected] = useState(false);
//     const [cheatingReason, setCheatingReason] = useState("");
//     const [antiCheatWarnings, setAntiCheatWarnings] = useState([]);
//     const [showAntiCheat, setShowAntiCheat] = useState(!isInterviewer);
//     const [cheatingIncidents, setCheatingIncidents] = useState([]);

//     // Pass cheating events up and log incidents
//     const handleCheatingDetected = (isCheating, reason = "") => {
//         setCheatingDetected(isCheating);
//         setCheatingReason(reason);

//         // Construct incident object with metadata
//         if (isCheating && reason) {
//             const incident = {
//                 reason,
//                 timestamp: new Date().toISOString(),
//                 roomId: roomID,
//                 userId: user?.userId,
//                 userName: user?.fullname || "",
//             };
//             setCheatingIncidents((prev) => [...prev, incident]);
//             onCheatingDetected(isCheating, reason, incident);
//         }
//     };

//     // Pass warnings up
//     const handleWarningsUpdate = (warnings) => {
//         setAntiCheatWarnings(warnings);
//         onProctoringWarnings(warnings);
//     };

//     useEffect(() => {
//         if (cheatingDetected && isInterviewer && cheatingReason) {
//             toast.dismiss();
//             toast.error(`Candidate behavior alert: ${cheatingReason}`, {
//                 duration: 4000,
//                 position: 'top-right',
//             });
//         }
//     }, [cheatingDetected, cheatingReason, isInterviewer]);

//     useEffect(() => {
//         if (!firstId || !roomID) return;

//         const appID = parseInt(import.meta.env.VITE_ZEGOCLOUD_APPID, 10);
//         const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;

//         // Generate Zego token
//         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//             appID,
//             serverSecret,
//             roomID,
//             firstId,
//             secondId || "Anonymous"
//         );

//         const zp = ZegoUIKitPrebuilt.create(kitToken);
//         const role =
//             user?.role === "interviewer"
//                 ? ZegoUIKitPrebuilt.Host
//                 : ZegoUIKitPrebuilt.Cohost;

//         // ✅ Correct template string for shareable link
//         const interviewUrl = `${window.location.origin}${window.location.pathname}?roomID=${roomID}`;

//         zp.joinRoom({
//             container: containerRef.current,
//             sharedLinks: [
//                 {
//                     name: "Interview Link",
//                     url: interviewUrl,
//                 },
//             ],
//             scenario: {
//                 mode: ZegoUIKitPrebuilt.GroupCall,
//             },
//             turnOnMicrophoneWhenJoining: true,
//             turnOnCameraWhenJoining: true,
//             showLeavingView: false,
//             showPreJoinView: true,
//             showRoomTimer: true,
//             showRoomDetailsButton: false,
//             showUsersButton: true,
//             showScreenSharingButton: true,
//             showTextChat: true,
//             showUserList: true,
//             role,
//             onLeaveRoom: () => {
//                 if (!response?.source) {
//                     window.close();
//                     return;
//                 }

//                 if (candidateRecordingStatus === "recording" && onStop) {
//                     onStop();
//                 }

//                 // Log all cheating incidents
//                 if (cheatingIncidents.length > 0) {
//                     console.log("Cheating incidents during interview:", cheatingIncidents);
//                 }

//                 if (response.source === "Byjobpost") {
//                     const destination =
//                         user?.role === "interviewer"
//                             ? "/interviewer/interviews-by-job-posts"
//                             : "/user/interviews-by-job-posts";
//                     navigate(destination);
//                 } else if (response.source === "ByCV" && user?.role === "interviewer") {
//                     navigate("/interviewer/interviews-by-cv");
//                 } else {
//                     window.close();
//                 }
//             },
//         });

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [roomID, firstId, secondId, user, response, navigate, candidateRecordingStatus, onStop]);


//     // Interview status auto-update
//     useEffect(() => {
//         const updateInterviewStatus = async () => {
//             try {
//                 const res = await axios.post(
//                     `${server}/api/v1/interviews/updateStatus`,
//                     { interviewId: roomID },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );

//                 if (isInterviewer) toast.success(res.data.message);
//             } catch (err) {
//                 if (isInterviewer)
//                     toast.error(err?.response?.data?.message || "Failed to update interview status");
//             }
//         };

//         if (users >= 2 && isInterviewer) {
//             updateInterviewStatus();
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [roomID, server, token, isInterviewer, users]);


//     return (
//         <div className="video-call-container position-relative w-100 h-100">
//             {/* Main ZegoCloud video container */}
//             <div ref={containerRef} className="w-100 h-100" />

//             {/* Candidate anti-cheat overlay */}
//             {!isInterviewer && showAntiCheat && (
//                 <div className="anti-cheat-overlay position-absolute top-0 end-0 m-3">
//                     <EyeLipTracker
//                         onCheatingDetected={handleCheatingDetected}
//                         onWarningsUpdate={handleWarningsUpdate}
//                         isEnabled={!isInterviewer}
//                     />
//                 </div>
//             )}

//             {/* Cheating alert for interviewer */}
//             {isInterviewer && cheatingDetected && (
//                 <div className="cheating-alert position-absolute top-0 start-50 translate-middle-x mt-3 z-3">
//                     <div className="alert alert-warning d-flex align-items-center mb-0 shadow">
//                         <i className="bi bi-exclamation-triangle-fill me-2"></i>
//                         <div>
//                             <strong>Candidate Behavior Alert:</strong> {cheatingReason}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Anti-cheat warnings panel (for interviewer only) */}
//             {antiCheatWarnings.length > 0 && isInterviewer && (
//                 <div className="anti-cheat-warnings position-absolute top-0 start-0 m-3 z-3">
//                     <div className="card border-warning shadow">
//                         <div className="card-header bg-warning text-dark py-2">
//                             <i className="bi bi-shield-exclamation me-2"></i>
//                             <small><strong>Proctoring Guidelines</strong></small>
//                         </div>
//                         <div className="card-body p-2">
//                             {antiCheatWarnings.map((warning, index) => (
//                                 <div key={index} className="warning-item d-flex align-items-center mb-1">
//                                     <small className="text-muted">{warning}</small>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Cheating incidents counter */}
//             {isInterviewer && cheatingIncidents.length > 0 && (
//                 <div className="cheating-counter position-absolute top-0 end-0 m-3 z-3">
//                     <div className="badge bg-danger">
//                         <i className="bi bi-flag me-1"></i>
//                         {cheatingIncidents.length} Incident{cheatingIncidents.length > 1 ? 's' : ''}
//                     </div>
//                 </div>
//             )}

//             {/* Toggle monitor for candidates only (if wanted) */}
//             {!isInterviewer && (
//                 <div className="anti-cheat-controls position-absolute bottom-0 start-0 m-3 z-3">
//                     <button
//                         className="btn btn-sm btn-outline-light d-flex align-items-center"
//                         onClick={() => setShowAntiCheat((v) => !v)}
//                         title={showAntiCheat ? "Hide Anti-Cheat Monitor" : "Show Anti-Cheat Monitor"}
//                     >
//                         <i className={`bi ${showAntiCheat ? "bi-eye-slash" : "bi-eye"} me-1`}></i>
//                         <small>{showAntiCheat ? "Hide Monitor" : "Show Monitor"}</small>
//                     </button>
//                 </div>
//             )}


//             {/* Styles */}
//             <style jsx>{`
//                 .video-call-container {
//                     background: #1a1a1a;
//                     border-radius: 8px;
//                     overflow: hidden;
//                 }
//                 .anti-cheat-overlay {
//                     z-index: 1000;
//                     background: rgba(0, 0, 0, 0.85);
//                     border-radius: 10px;
//                     padding: 8px;
//                     backdrop-filter: blur(5px);
//                 }
//                 .cheating-alert { z-index: 1001; animation: fadeInOut 2s ease-in-out infinite; }
//                 .anti-cheat-warnings { z-index: 1000; max-width: 280px; }
//                 .cheating-counter { z-index: 1000; }
//                 .anti-cheat-controls { z-index: 1000; }
//                 .warning-item:last-child { margin-bottom: 0 !important; }
//                 @keyframes fadeInOut {
//                     0% { opacity: 1; }
//                     50% { opacity: 0.7; }
//                     100% { opacity: 1; }
//                 }
//                 @media (max-width: 768px) {
//                     .anti-cheat-overlay { top: 70px !important; right: 10px !important; transform: scale(0.8); }
//                 }
//                 @media (max-width: 480px) {
//                     .anti-cheat-overlay { transform: scale(0.7); }
//                     .anti-cheat-warnings { max-width: 180px; }
//                 }
//             `}</style>
//         </div >
//     );
// };

// export default NewVideoCall;
