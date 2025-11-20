// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useAuthContext } from "../../../context/auth-context";
// import NewVideoCall from "./NewVideoCall";
// import NewCodeEditor from "./NewCodeEditor";
// import NewReportForm from "./NewReportForm";
// import NewWhiteboard from "./NewWhiteboard";
// import NewRecorder from "./NewRecorder";
// import { io } from "socket.io-client";

// const MockInterviewRoom = () => {
//     const { roomId: id } = useParams();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { response } = location.state || {};
//     const [showCodeEditor, setShowCodeEditor] = useState(true);
//     const [showWhiteboard, setShowWhiteboard] = useState(false);
//     const [recordingStatus, setRecordingStatus] = useState('idle');
//     const [userCount, setUserCount] = useState(1);
//     const [showReportForm, setShowReportForm] = useState(false);
//     const { user, server, token } = useAuthContext();
//     const isInterviewer = (user?.role || '').toLowerCase() === 'interviewer';

//     // State preservation
//     const [editorState, setEditorState] = useState({
//         code: "// Start coding...",
//         taskDescription: "Write a function that reverses a string",
//         editorSettings: {
//             language: "javascript",
//             theme: "vs-dark",
//             fontSize: 14
//         },
//         isConsoleOpen: false,
//         consoleOutput: ""
//     });

//     const [whiteboardState, setWhiteboardState] = useState({
//         paths: [],
//         currentPath: null
//     });

//     // const socket = useMemo(() => io(server, {
//     //     auth: { token },
//     //     reconnectionAttempts: 5,
//     //     reconnectionDelay: 1000,
//     // }), [server, token]);

//     const socket = useMemo(
//         () =>
//             io(server, {
//                 auth: { type: "editor" },
//                 reconnectionAttempts: 5,
//                 reconnectionDelay: 1000,
//             })
//             [server, token]
//     );

//     const { firstId, secondId } = useMemo(() => {
//         if (!response) {
//             return { firstId: null, secondId: null };
//         }
//         const { screen, interviewDetails } = response;
//         return {
//             firstId:
//                 screen === "interviewer"
//                     ? interviewDetails?.interviewerId
//                     : interviewDetails?.requestId,
//             secondId:
//                 screen === "interviewer"
//                     ? interviewDetails?.interviewerName
//                     : interviewDetails?.candidateName,
//         };
//     }, [response, user]);

//     useEffect(() => {
//         socket.emit('joinRoom', id);

//         // Listen for UI state changes
//         socket.on('uiStateChange', (data) => {
//             if (data.showCodeEditor !== undefined) setShowCodeEditor(data.showCodeEditor);
//             if (data.showWhiteboard !== undefined) setShowWhiteboard(data.showWhiteboard);
//         });

//         // Listen for room state
//         socket.on('roomState', (data) => {
//             setShowCodeEditor(data.showCodeEditor);
//             setShowWhiteboard(data.showWhiteboard);
//             if (data.editorState) setEditorState(data.editorState);
//             if (data.whiteboardState) setWhiteboardState(data.whiteboardState);
//         });

//         // Listen for user count updates
//         socket.on('userCountUpdate', (count) => {
//             setUserCount(count);
//         });

//         // Listen for editor state updates
//         socket.on('editorStateUpdate', (data) => {
//             setEditorState(data);
//         });

//         // Listen for whiteboard state updates
//         socket.on('whiteboardStateUpdate', (data) => {
//             setWhiteboardState(data);
//         });

//         return () => {
//             socket.off('uiStateChange');
//             socket.off('roomState');
//             socket.off('userCountUpdate');
//             socket.off('editorStateUpdate');
//             socket.off('whiteboardStateUpdate');
//         };
//     }, [id, socket]);

//     const toggleCodeEditor = () => {
//         const newState = !showCodeEditor;
//         setShowCodeEditor(newState);
//         socket.emit('uiStateChange', {
//             roomId: id,
//             showCodeEditor: newState,
//             editorState: editorState
//         });
//     };

//     const toggleWhiteboard = () => {
//         const newState = !showWhiteboard;
//         setShowWhiteboard(newState);
//         socket.emit('uiStateChange', {
//             roomId: id,
//             showWhiteboard: newState,
//             whiteboardState: whiteboardState
//         });
//     };

//     const handleEditorStateChange = (newState) => {
//         setEditorState(newState);
//         socket.emit('editorStateChange', { roomId: id, editorState: newState });
//     };

//     const handleWhiteboardStateChange = (newState) => {
//         setWhiteboardState(newState);
//         socket.emit('whiteboardStateChange', { roomId: id, whiteboardState: newState });
//     };

//     return (
//         <div className="d-flex flex-column vh-100 bg-dark text-white">
//             {/* Header with controls */}
//             <div className="p-3 border-bottom border-secondary">
//                 <div className="d-flex justify-content-between align-items-center">
//                     <div className="d-flex align-items-center">
//                         <div className="room-info me-4">
//                             <h6 className="mb-0 text-light">Interview Room: {id}</h6>
//                             <div className="user-count">
//                                 <i className="bi bi-people-fill me-1"></i>
//                                 {userCount} {userCount === 1 ? 'User' : 'Users'} Connected
//                             </div>
//                         </div>
//                         <div className="d-flex gap-2">
//                             <button
//                                 onClick={toggleCodeEditor}
//                                 className={`btn btn-sm d-flex align-items-center ${showCodeEditor ? "btn-outline-success" : "btn-outline-secondary"}`}
//                                 title={showCodeEditor ? "Hide Code Editor" : "Show Code Editor"}
//                             >
//                                 <i className={`bi me-1 ${showCodeEditor ? "bi-file-earmark-code-fill" : "bi-code-slash"}`}></i>
//                                 <span className="d-none d-sm-inline">Code</span>
//                             </button>


//                             <button
//                                 onClick={toggleWhiteboard}
//                                 className={`btn btn-sm ${showWhiteboard ? 'btn-danger' : 'btn-primary'}`}
//                                 title={showWhiteboard ? "Hide Whiteboard" : "Show Whiteboard"}
//                             >
//                                 <i className={`bi ${showWhiteboard ? 'bi-x-lg' : 'bi-pencil-square'}`}></i>
//                                 <span className="d-none d-md-inline ms-1">Whiteboard</span>
//                             </button>
//                         </div>
//                     </div>
//                     <div className="d-flex gap-3">
//                         <div className="d-flex align-items-center gap-3">
//                             <div className="d-flex align-items-center">
//                                 <span className="me-2 d-none d-md-inline">Recording:</span>
//                                 <span className={`badge ${recordingStatus === 'recording' ? 'bg-danger' : recordingStatus === 'processing' ? 'bg-warning' : 'bg-secondary'}`}>
//                                     {recordingStatus === 'recording' ? 'LIVE' : recordingStatus === 'processing' ? 'Processing...' : 'Idle'}
//                                 </span>
//                             </div>
//                             <NewRecorder
//                                 onStart={() => setRecordingStatus('recording')}
//                                 onStop={() => setRecordingStatus('processing')}
//                                 onComplete={() => setRecordingStatus('idle')}
//                                 isInterviewer={isInterviewer}
//                                 server={server}
//                                 token={token}
//                                 interviewId={response?.interviewDetails?.interviewId}
//                             />
//                         </div>
//                         {
//                             isInterviewer && (
//                                 <button
//                                     onClick={() => setShowReportForm(true)}
//                                     className="btn btn-sm btn-outline-info d-flex align-items-center"
//                                 >
//                                     <i className="bi bi-pencil-square me-1"></i>
//                                     {/* <i className="bi bi-exclamation-triangle-fill me-1"></i> */}
//                                     <span className="d-none d-sm-inline">Report Form</span>
//                                 </button>
//                             )
//                         }
//                     </div>
//                 </div>
//             </div>

//             {/* Main content area */}
//             <div className="flex-grow-1 overflow-hidden position-relative">
//                 {/* Whiteboard overlay */}
//                 {showWhiteboard && (
//                     <div className="position-absolute top-0 start-0 d-flex flex-column w-100 h-100 z-3 bg-white bg-opacity-95">
//                         <div className="d-flex justify-content-end p-2 bg-white border-bottom">
//                             <button
//                                 className="btn btn-sm btn-danger"
//                                 onClick={toggleWhiteboard}
//                             >
//                                 <i className="bi bi-x-lg me-1"></i> Close Whiteboard
//                             </button>
//                         </div>
//                         <div className="w-100 h-100">
//                             <NewWhiteboard
//                                 roomId={id}
//                                 socket={socket}
//                                 state={whiteboardState}
//                                 onStateChange={handleWhiteboardStateChange}
//                             />
//                         </div>
//                     </div>
//                 )}

//                 {/* Video and editor layout */}
//                 <div className="d-flex h-100">
//                     {/* Video call section */}
//                     <div className={`video-section ${showCodeEditor ? "with-editor" : ""}`}>
//                         <NewVideoCall
//                             roomID={id}
//                             response={response}
//                             firstId={firstId}
//                             secondId={secondId}
//                             user={user}
//                             server={server}
//                             token={token}
//                             users={userCount}
//                         />
//                     </div>

//                     {/* Code editor section */}
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
//                 </div>

//                 {showReportForm && isInterviewer && (
//                     <NewReportForm
//                         isVisible={showReportForm}
//                         onClose={() => setShowReportForm(false)}
//                         roomId={id}
//                         server={server}
//                         token={token}
//                         userCount={userCount}
//                     />
//                 )}
//             </div>

//             <style>{`
//                 .d-flex {
//                     display: flex;
//                     height: 100%;
//                 }
//                 .video-section {
//                     flex: 1;
//                     height: 100%;
//                 }
//                 .video-section.with-editor {
//                     width: 60%;
//                     flex: none;
//                 }
//                 .editor-section {
//                     width: 40%;
//                     height: 100%;
//                     border-left: 1px solid #6c757d;
//                 }
//                 .room-info {
//                     display: flex;
//                     flex-direction: column;
//                 }
//                 .user-count {
//                     color: #58a6ff;
//                     display: flex;
//                     align-items: center;
//                 }
//                 .user-count i {
//                     // font-size: 0.9rem;
//                 }
//                 @media (max-width: 768px) {
//                     .room-info {
//                         flex-direction: row;
//                         align-items: center;
//                     }
//                     .user-count {
//                         margin-left: 1rem;
//                     }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default MockInterviewRoom;





import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
    const navigate = useNavigate();
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
        const { screen, interviewDetails } = response;
        return {
            firstId:
                screen === "interviewer"
                    ? interviewDetails?.interviewerId
                    : interviewDetails?.requestId,
            secondId:
                screen === "interviewer"
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

