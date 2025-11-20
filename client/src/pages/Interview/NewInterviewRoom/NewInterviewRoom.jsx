// Initial version working fine without Eye & Lips Tracking
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuthContext } from "../../../context/auth-context";
import NewVideoCall from "./NewVideoCall";
import NewCodeEditor from "./NewCodeEditor";
import NewReportForm from "./NewReportForm";
import NewWhiteboard from "./NewWhiteboard";
import NewRecorder from "./NewRecorder";
// import LiveTranscription from "./LiveTranscription";
import { io } from "socket.io-client";

const NewInterviewRoom = () => {
    const { roomId: id } = useParams();
    const location = useLocation();
    const { response } = location.state || {};
    const [showCodeEditor, setShowCodeEditor] = useState(true);
    const [showWhiteboard, setShowWhiteboard] = useState(false);
    // const [showTranscription, setShowTranscription] = useState(false);
    const [candidateRecordingStatus, setCandidateRecordingStatus] = useState('idle');
    const [userCount, setUserCount] = useState(1);
    const [showReportForm, setShowReportForm] = useState(false);
    const { user, server, token } = useAuthContext();
    const isInterviewer = (user?.role || '').toLowerCase() === 'interviewer';

    // State preservation
    const [editorState, setEditorState] = useState({
        code: "// Start coding...",
        taskDescription: "Write a function that reverses a string",
        editorSettings: {
            language: "javascript",
            theme: "vs-dark",
            fontSize: 14
        },
        isConsoleOpen: false,
        consoleOutput: ""
    });

    const [whiteboardState, setWhiteboardState] = useState({
        paths: [],
        currentPath: null
    });

    const socket = useMemo(() => io(server, {
        auth: { type: "editor" },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    }), [server, token]);

    const { firstId, secondId } = useMemo(() => {
        if (!response) {
            return { firstId: null, secondId: null };
        }
        const { source, screen, interviewDetails } = response;
        return {
            firstId:
                source === "Byjobpost"
                    ? user?.userId
                    : screen === "interviewer"
                        ? interviewDetails?.interviewerId
                        : interviewDetails?.cvId,
            secondId:
                source === "Byjobpost"
                    ? user?.fullname
                    : screen === "interviewer"
                        ? interviewDetails?.interviewerName
                        : interviewDetails?.candidateName,
        };
    }, [response, user]);

    useEffect(() => {
        socket.emit('joinRoom', id);

        // Listen for UI state changes
        socket.on('uiStateChange', (data) => {
            if (data.showCodeEditor !== undefined) {
                setShowCodeEditor(data.showCodeEditor);
                // Ensure only one panel is open at a time
                if (data.showCodeEditor) {
                    setShowWhiteboard(false);
                }
            }
            if (data.showWhiteboard !== undefined) {
                setShowWhiteboard(data.showWhiteboard);
                // Ensure only one panel is open at a time
                if (data.showWhiteboard) {
                    setShowCodeEditor(false);
                }
            }
        });

        // Listen for room state
        socket.on('roomState', (data) => {
            setShowCodeEditor(data.showCodeEditor);
            setShowWhiteboard(data.showWhiteboard);
            if (data.editorState) setEditorState(data.editorState);
            if (data.whiteboardState) setWhiteboardState(data.whiteboardState);
        });

        // Listen for user count updates
        socket.on('userCountUpdate', (count) => {
            setUserCount(count);
        });

        // Listen for editor state updates
        socket.on('editorStateUpdate', (data) => {
            setEditorState(data);
        });

        // Listen for whiteboard state updates
        socket.on('whiteboardStateUpdate', (data) => {
            setWhiteboardState(data);
        });

        // Listen for recording status updates
        socket.on('recordingStatusUpdate', (data) => {
            setCandidateRecordingStatus(data.status);
        });

        return () => {
            socket.off('uiStateChange');
            socket.off('roomState');
            socket.off('userCountUpdate');
            socket.off('editorStateUpdate');
            socket.off('whiteboardStateUpdate');
            socket.off('recordingStatusUpdate');
        };
    }, [id, socket]);

    const toggleCodeEditor = () => {
        const newState = !showCodeEditor;
        setShowCodeEditor(newState);
        // If opening code editor, close whiteboard
        if (newState) {
            setShowWhiteboard(false);
        }
        socket.emit('uiStateChange', {
            roomId: id,
            showCodeEditor: newState,
            showWhiteboard: false,
            editorState: editorState
        });
    };

    const toggleWhiteboard = () => {
        const newState = !showWhiteboard;
        setShowWhiteboard(newState);
        // If opening whiteboard, close code editor
        if (newState) {
            setShowCodeEditor(false);
        }
        socket.emit('uiStateChange', {
            roomId: id,
            showWhiteboard: newState,
            showCodeEditor: false,
            whiteboardState: whiteboardState
        });
    };

    const handleEditorStateChange = (newState) => {
        setEditorState(newState);
        socket.emit('editorStateChange', { roomId: id, editorState: newState });
    };

    const handleWhiteboardStateChange = (newState) => {
        setWhiteboardState(newState);
        socket.emit('whiteboardStateChange', { roomId: id, whiteboardState: newState });
    };

    const handleRecordingStatusChange = (status) => {
        setCandidateRecordingStatus(status);
        // Emit recording status to all participants
        socket.emit('recordingStatusChange', {
            roomId: id,
            status: status,
            role: 'candidate'
        });
    };

    return (
        <div className="d-flex flex-column vh-100 bg-dark text-white">
            {/* Header with controls */}
            <div className="p-3 border-bottom border-secondary">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <div className="room-info me-4">
                            <h6 className="mb-0 text-light">Interview Room: {id}</h6>
                            <div className="user-count">
                                <i className="bi bi-people-fill me-1"></i>
                                {userCount} {userCount === 1 ? 'User' : 'Users'} Connected
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                onClick={toggleCodeEditor}
                                className={`btn btn-sm d-flex align-items-center ${showCodeEditor ? "btn-outline-success" : "btn-outline-secondary"}`}
                                title={showCodeEditor ? "Hide Code Editor" : "Show Code Editor"}
                            >
                                <i className={`bi me-1 ${showCodeEditor ? "bi-file-earmark-code-fill" : "bi-code-slash"}`}></i>
                                <span className="d-none d-sm-inline">Code</span>
                            </button>

                            <button
                                onClick={toggleWhiteboard}
                                className={`btn btn-sm ${showWhiteboard ? 'btn-danger' : 'btn-primary'}`}
                                title={showWhiteboard ? "Hide Whiteboard" : "Show Whiteboard"}
                            >
                                <i className={`bi ${showWhiteboard ? 'bi-x-lg' : 'bi-pencil-square'}`}></i>
                                <span className="d-none d-md-inline ms-1">Whiteboard</span>
                            </button>

                            {/* <button
                                className={`btn btn-sm d-flex align-items-center ${showTranscription ? "btn-outline-success" : "btn-outline-secondary"}`}
                                onClick={() => setShowTranscription(!showTranscription)}
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasBottom"
                                aria-controls="offcanvasBottom"
                            >
                                <i className={`bi me-1 ${showTranscription ? "bi-chat-square-text-fill" : "bi-chat-square-text"}`}></i>
                                <span className="d-none d-sm-inline">Transcription</span>
                            </button> */}

                        </div>
                    </div>
                    <div className="d-flex gap-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center">
                                <span className="me-2 d-none d-md-inline">Recording:</span>
                                <span className={`badge ${candidateRecordingStatus === 'recording' ? 'bg-success' : candidateRecordingStatus === 'processing' ? 'bg-warning' : 'bg-danger'}`}>
                                    {candidateRecordingStatus === 'recording' ? 'Started' : candidateRecordingStatus === 'processing' ? 'Processing...' : 'Stopped'}
                                </span>
                            </div>

                            {!isInterviewer && (
                                <NewRecorder
                                    onStart={() => handleRecordingStatusChange('recording')}
                                    onStop={() => handleRecordingStatusChange('processing')}
                                    onComplete={() => handleRecordingStatusChange('idle')}
                                    isInterviewer={isInterviewer}
                                    server={server}
                                    token={token}
                                    interviewId={response?.interviewDetails?.interviewId}
                                />
                            )}
                        </div>
                        {
                            isInterviewer && (
                                <button
                                    onClick={() => setShowReportForm(true)}
                                    className="btn btn-sm btn-outline-info d-flex align-items-center"
                                >
                                    <i className="bi bi-pencil-square me-1"></i>
                                    <span className="d-none d-sm-inline">Report Form</span>
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-grow-1 overflow-hidden position-relative">
                {/* Video and editor/whiteboard layout */}
                <div className="d-flex h-100">
                    {/* Video call section - always visible */}
                    <div className={`video-section ${showCodeEditor || showWhiteboard ? "with-panel" : ""}`}>
                        <NewVideoCall
                            roomID={id}
                            response={response}
                            firstId={firstId}
                            secondId={secondId}
                            user={user}
                            server={server}
                            token={token}
                            users={userCount}
                            isInterviewer={isInterviewer}
                            candidateRecordingStatus={candidateRecordingStatus}
                            onStop={() => handleRecordingStatusChange('processing')}
                        />
                    </div>

                    {/* Code editor section */}
                    {showCodeEditor && (
                        <div className="editor-section">
                            <NewCodeEditor
                                roomId={id}
                                isInterviewer={isInterviewer}
                                socket={socket}
                                state={editorState}
                                onStateChange={handleEditorStateChange}
                            />
                        </div>
                    )}

                    {/* Whiteboard section */}
                    {showWhiteboard && (
                        <div className="whiteboard-section">
                            <NewWhiteboard
                                roomId={id}
                                socket={socket}
                                state={whiteboardState}
                                onStateChange={handleWhiteboardStateChange}
                            />
                        </div>
                    )}
                </div>

                {/* {showTranscription && (
                    <LiveTranscription
                        roomId={id}
                        server={server}
                        token={token}
                        user={user}
                        isInterviewer={isInterviewer}
                        isVisible={showTranscription}
                        onClose={() => setShowTranscription(false)}
                    />
                )} */}

                {showReportForm && isInterviewer && (
                    <NewReportForm
                        isVisible={showReportForm}
                        onClose={() => setShowReportForm(false)}
                        roomId={id}
                        server={server}
                        token={token}
                        userCount={userCount}
                    />
                )}
            </div>

            <style>{`
                .d-flex {
                    display: flex;
                    height: 100%;
                }
                .video-section {
                    flex: 1;
                    min-width: 0;
                }
                .video-section.with-panel {
                    width: 60%;
                    flex: none;
                }
                .editor-section, .whiteboard-section {
                    width: 40%;
                    height: 100%;
                    border-left: 1px solid #6c757d;
                }
                .room-info {
                    display: flex;
                    flex-direction: column;
                }
                .user-count {
                    color: #58a6ff;
                    display: flex;
                    align-items: center;
                }
                .user-count i {
                    // font-size: 0.9rem;
                }
                @media (max-width: 768px) {
                    .room-info {
                        flex-direction: row;
                        align-items: center;
                    }
                    .user-count {
                        margin-left: 1rem;
                    }
                    .video-section.with-panel {
                        width: 50%;
                    }
                    .editor-section, .whiteboard-section {
                        width: 50%;
                    }
                }
            `}</style>
        </div>
    );
};

export default NewInterviewRoom;
















// // First Version of Eye & Lip Tracking

// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import { useAuthContext } from "../../../context/auth-context";
// import NewVideoCall from "./NewVideoCall";
// import EyeLipTracker from "./EyeLipTracker"; // Ensure correct import path
// import NewCodeEditor from "./NewCodeEditor";
// import NewReportForm from "./NewReportForm";
// import NewWhiteboard from "./NewWhiteboard";
// import NewRecorder from "./NewRecorder";
// import LiveTranscription from "./LiveTranscription";
// import { io } from "socket.io-client";

// const NewInterviewRoom = () => {
//     const { roomId: id } = useParams();
//     const location = useLocation();
//     const { response } = location.state || {};
//     const [showCodeEditor, setShowCodeEditor] = useState(true);
//     const [showWhiteboard, setShowWhiteboard] = useState(false);
//     const [showTranscription, setShowTranscription] = useState(false);
//     const [candidateRecordingStatus, setCandidateRecordingStatus] = useState("idle");
//     const [userCount, setUserCount] = useState(1);
//     const [showReportForm, setShowReportForm] = useState(false);
//     const { user, server, token } = useAuthContext();
//     const isInterviewer = (user?.role || "").toLowerCase() === "interviewer";

//     // Anti-cheat state
//     const [cheatingDetected, setCheatingDetected] = useState(false);
//     const [cheatingReason, setCheatingReason] = useState("");
//     const [cheatingIncidents, setCheatingIncidents] = useState([]);
//     const [proctoringWarnings, setProctoringWarnings] = useState([]);

//     // State preservation
//     const [editorState, setEditorState] = useState({
//         code: "// Start coding...",
//         taskDescription: "Write a function that reverses a string",
//         editorSettings: {
//             language: "javascript",
//             theme: "vs-dark",
//             fontSize: 14,
//         },
//         isConsoleOpen: false,
//         consoleOutput: "",
//     });

//     const [whiteboardState, setWhiteboardState] = useState({
//         paths: [],
//         currentPath: null,
//     });

//     const socket = useMemo(
//         () =>
//             io(server, {
//                 auth: { type: "editor" },
//                 reconnectionAttempts: 5,
//                 reconnectionDelay: 1000,
//             }),
//         // io(server, {
//         //     auth: { token },
//         //     reconnectionAttempts: 5,
//         //     reconnectionDelay: 1000,
//         // }),
//         [server, token]
//     );

//     const { firstId, secondId } = useMemo(() => {
//         if (!response) {
//             return { firstId: null, secondId: null };
//         }
//         const { source, screen, interviewDetails } = response;
//         return {
//             firstId:
//                 source === "Byjobpost"
//                     ? user?.userId
//                     : screen === "interviewer"
//                         ? interviewDetails?.interviewerId
//                         : interviewDetails?.cvId,
//             secondId:
//                 source === "Byjobpost"
//                     ? user?.fullname
//                     : screen === "interviewer"
//                         ? interviewDetails?.interviewerName
//                         : interviewDetails?.candidateName,
//         };
//     }, [response, user]);

//     // Efficient cheating handler for proctoring and video
//     const handleCheatingDetected = (isCheating, reason = "", incidentData = null) => {
//         setCheatingDetected(isCheating);
//         setCheatingReason(reason);

//         // Prepare robust incident object
//         const incident = incidentData || {
//             reason: reason,
//             timestamp: new Date().toISOString(),
//             userId: user?.userId,
//             userName: user?.fullname,
//             roomId: id,
//         };

//         // Only log/emit new incidents
//         if (isCheating && reason && !cheatingIncidents.some(c => c.timestamp === incident.timestamp && c.reason === reason)) {
//             setCheatingIncidents((prev) => [...prev, incident]);

//             // Emit to socket for real-time notification
//             socket.emit("cheatingIncident", {
//                 roomId: id,
//                 incident: incident,
//                 isInterviewer: isInterviewer,
//             });
//         }
//     };

//     // For real-time warnings sent by proctoring component
//     const handleProctoringWarnings = (warnings) => {
//         setProctoringWarnings(warnings);

//         // Optionally send warnings to the socket for interviewer
//         socket.emit("proctoringWarnings", {
//             roomId: id,
//             warnings,
//         });
//     };

//     useEffect(() => {
//         socket.emit("joinRoom", id);

//         socket.on("uiStateChange", (data) => {
//             if (data.showCodeEditor !== undefined) {
//                 setShowCodeEditor(data.showCodeEditor);
//                 if (data.showCodeEditor) setShowWhiteboard(false);
//             }
//             if (data.showWhiteboard !== undefined) {
//                 setShowWhiteboard(data.showWhiteboard);
//                 if (data.showWhiteboard) setShowCodeEditor(false);
//             }
//         });

//         socket.on("roomState", (data) => {
//             setShowCodeEditor(data.showCodeEditor);
//             setShowWhiteboard(data.showWhiteboard);
//             if (data.editorState) setEditorState(data.editorState);
//             if (data.whiteboardState) setWhiteboardState(data.whiteboardState);
//         });

//         socket.on("userCountUpdate", (count) => setUserCount(count));
//         socket.on("editorStateUpdate", (data) => setEditorState(data));
//         socket.on("whiteboardStateUpdate", (data) => setWhiteboardState(data));
//         socket.on("recordingStatusUpdate", (data) => setCandidateRecordingStatus(data.status));

//         socket.on("cheatingIncident", (data) => {
//             if (isInterviewer && data.incident) {
//                 setCheatingDetected(true);
//                 setCheatingReason(data.incident.reason);
//                 setCheatingIncidents((prev) => [...prev, data.incident]);
//                 // Optionally, UI notification for interviewer
//             }
//         });

//         socket.on("proctoringWarnings", (data) => {
//             if (isInterviewer) {
//                 setProctoringWarnings(data.warnings);
//             }
//         });

//         return () => {
//             socket.off("uiStateChange");
//             socket.off("roomState");
//             socket.off("userCountUpdate");
//             socket.off("editorStateUpdate");
//             socket.off("whiteboardStateUpdate");
//             socket.off("recordingStatusUpdate");
//             socket.off("cheatingIncident");
//             socket.off("proctoringWarnings");
//         };
//     }, [id, socket, isInterviewer, user]);

//     const toggleCodeEditor = () => {
//         const newState = !showCodeEditor;
//         setShowCodeEditor(newState);
//         if (newState) setShowWhiteboard(false);
//         socket.emit("uiStateChange", {
//             roomId: id,
//             showCodeEditor: newState,
//             showWhiteboard: false,
//             editorState,
//         });
//     };

//     const toggleWhiteboard = () => {
//         const newState = !showWhiteboard;
//         setShowWhiteboard(newState);
//         if (newState) setShowCodeEditor(false);
//         socket.emit("uiStateChange", {
//             roomId: id,
//             showWhiteboard: newState,
//             showCodeEditor: false,
//             whiteboardState,
//         });
//     };

//     const handleEditorStateChange = (newState) => {
//         setEditorState(newState);
//         socket.emit("editorStateChange", { roomId: id, editorState: newState });
//     };

//     const handleWhiteboardStateChange = (newState) => {
//         setWhiteboardState(newState);
//         socket.emit("whiteboardStateChange", {
//             roomId: id,
//             whiteboardState: newState,
//         });
//     };

//     const handleRecordingStatusChange = (status) => {
//         setCandidateRecordingStatus(status);
//         socket.emit("recordingStatusChange", {
//             roomId: id,
//             status: status,
//             role: "candidate",
//         });
//     };

//     // Get cheating statistics for report
//     const getCheatingStats = () => ({
//         totalIncidents: cheatingIncidents.length,
//         incidentsByType: cheatingIncidents.reduce((acc, incident) => {
//             acc[incident.reason] = (acc[incident.reason] || 0) + 1;
//             return acc;
//         }, {}),
//         firstIncident: cheatingIncidents[0]?.timestamp,
//         lastIncident: cheatingIncidents[cheatingIncidents.length - 1]?.timestamp,
//     });

//     const clearCheatingAlert = () => {
//         setCheatingDetected(false);
//         setCheatingReason("");
//     };

//     return (
//         <div className="d-flex flex-column vh-100 bg-dark text-white">
//             {/* Header with controls (unchanged) */}
//             {/* ... (existing header code) ... */}

//             {/* Main content area */}
//             <div className="flex-grow-1 overflow-hidden position-relative">
//                 {/* Video and editor/whiteboard layout */}
//                 <div className="d-flex h-100">
//                     {/* Video section: Add EyeLipTracker overlay here */}
//                     <div className={`video-section ${showCodeEditor || showWhiteboard ? "with-panel" : ""}`}>
//                         <div style={{ position: "relative", width: "100%", height: "100%" }}>
//                             {/* Video Call */}
//                             <NewVideoCall
//                                 roomID={id}
//                                 response={response}
//                                 firstId={firstId}
//                                 secondId={secondId}
//                                 user={user}
//                                 server={server}
//                                 token={token}
//                                 users={userCount}
//                                 isInterviewer={isInterviewer}
//                                 candidateRecordingStatus={candidateRecordingStatus}
//                                 onStop={() => handleRecordingStatusChange("processing")}
//                             />

//                             {/* Proctoring (EyeLipTracker) */}
//                             {!isInterviewer && (
//                                 <div
//                                     style={{
//                                         position: "absolute",
//                                         top: 10,
//                                         right: 10,
//                                         zIndex: 50,
//                                         background: "rgba(34,34,34,0.7)",
//                                         borderRadius: "6px",
//                                         padding: 0,
//                                     }}
//                                 >
//                                     <EyeLipTracker
//                                         onCheatingDetected={handleCheatingDetected}
//                                         onWarningsUpdate={handleProctoringWarnings}
//                                         isEnabled={true}
//                                     />
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Code editor */}
//                     {showCodeEditor && (
//                         <div className="editor-section">
//                             <NewCodeEditor
//                                 roomId={id}
//                                 isInterviewer={isInterviewer}
//                                 socket={socket}
//                                 state={editorState}
//                                 onStateChange={handleEditorStateChange}
//                             />
//                         </div>
//                     )}

//                     {/* Whiteboard */}
//                     {showWhiteboard && (
//                         <div className="whiteboard-section">
//                             <NewWhiteboard
//                                 roomId={id}
//                                 socket={socket}
//                                 state={whiteboardState}
//                                 onStateChange={handleWhiteboardStateChange}
//                             />
//                         </div>
//                     )}
//                 </div>

//                 {/* Proctoring Warnings Sidebar for Interviewer */}
//                 {isInterviewer && proctoringWarnings.length > 0 && (
//                     <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 1050, maxWidth: "300px" }}>
//                         <div className="card border-warning">
//                             <div className="card-header bg-warning text-dark py-2">
//                                 <i className="bi bi-shield-exclamation me-2"></i>
//                                 <small>
//                                     <strong>Proctoring Alerts</strong>
//                                 </small>
//                             </div>
//                             <div className="card-body p-2">
//                                 {proctoringWarnings.map((warning, index) => (
//                                     <div key={index} className="d-flex align-items-center mb-2">
//                                         <i className="bi bi-info-circle text-warning me-2"></i>
//                                         <small className="text-muted">{warning}</small>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {showTranscription && (
//                     <LiveTranscription
//                         roomId={id}
//                         server={server}
//                         token={token}
//                         user={user}
//                         isInterviewer={isInterviewer}
//                         isVisible={showTranscription}
//                         onClose={() => setShowTranscription(false)}
//                     />
//                 )}

//                 {showReportForm && isInterviewer && (
//                     <NewReportForm
//                         isVisible={showReportForm}
//                         onClose={() => setShowReportForm(false)}
//                         roomId={id}
//                         server={server}
//                         token={token}
//                         userCount={userCount}
//                         cheatingData={{
//                             incidents: cheatingIncidents,
//                             stats: getCheatingStats(),
//                             warnings: proctoringWarnings,
//                         }}
//                     />
//                 )}
//             </div>

//             {/* ... (style block unchanged) ... */}
//         </div>
//     );

// };

// export default NewInterviewRoom;