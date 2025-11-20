// import { useEffect, useRef, useState } from 'react';
// import { io } from 'socket.io-client';

// const LiveTranscription = ({ roomId, server, token, user, isInterviewer, isVisible, onClose }) => {
//     const [isListening, setIsListening] = useState(false);
//     const [transcript, setTranscript] = useState('');
//     const [receivedTranscripts, setReceivedTranscripts] = useState([]);
//     const [language, setLanguage] = useState('en-US');
//     const [browserSupport, setBrowserSupport] = useState(true);
//     const [error, setError] = useState(null);
//     const recognitionRef = useRef(null);
//     const socketRef = useRef(null);
//     const transcriptEndRef = useRef(null);

//     // Initialize socket connection
//     useEffect(() => {
//         if (!isVisible) return;

//         socketRef.current = io(server, {
//             auth: { token },
//             reconnectionAttempts: 5,
//             reconnectionDelay: 1000,
//         });

//         // Join transcription room
//         socketRef.current.emit('joinTranscriptionRoom', roomId);

//         // Listen for transcriptions from other participants
//         socketRef.current.on('transcription', (data) => {
//             setReceivedTranscripts(prev => [...prev, {
//                 id: Date.now(),
//                 text: data.transcript,
//                 isUser: data.userId === user?.userId,
//                 timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//             }]);
//         });

//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.disconnect();
//             }
//         };
//     }, [roomId, server, token, user, isVisible]);

//     // Initialize speech recognition
//     useEffect(() => {
//         if (!isVisible) return;

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) {
//             setBrowserSupport(false);
//             return;
//         }

//         recognitionRef.current = new SpeechRecognition();
//         recognitionRef.current.continuous = true;
//         recognitionRef.current.interimResults = true;
//         recognitionRef.current.lang = language;

//         recognitionRef.current.onresult = (event) => {
//             let finalTranscript = '';
//             for (let i = event.resultIndex; i < event.results.length; i++) {
//                 const transcript = event.results[i][0].transcript;
//                 if (event.results[i].isFinal) {
//                     finalTranscript += transcript + ' ';
//                     // Send final transcript to other participants
//                     socketRef.current?.emit('transcription', {
//                         roomId,
//                         transcript: finalTranscript,
//                         userId: user?.userId,
//                         role: user?.role
//                     });
//                 }
//             }

//             if (finalTranscript) {
//                 setTranscript(prev => prev + finalTranscript);
//             }
//         };

//         recognitionRef.current.onerror = (event) => {
//             console.error('Speech recognition error', event.error);
//             setError(event.error);
//             setIsListening(false);
//         };

//         return () => {
//             if (recognitionRef.current) {
//                 recognitionRef.current.stop();
//             }
//         };
//     }, [language, roomId, user, isVisible]);

//     // Auto-scroll to bottom of transcript
//     useEffect(() => {
//         transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [transcript, receivedTranscripts]);

//     const toggleListening = () => {
//         if (isListening) {
//             recognitionRef.current?.stop();
//             setIsListening(false);
//         } else {
//             recognitionRef.current?.start();
//             setIsListening(true);
//         }
//     };

//     const handleLanguageChange = (e) => {
//         const newLanguage = e.target.value;
//         setLanguage(newLanguage);
//         if (recognitionRef.current) {
//             recognitionRef.current.lang = newLanguage;
//         }
//     };

//     const clearTranscript = () => {
//         setTranscript('');
//         setReceivedTranscripts([]);
//     };

//     if (!isVisible) return null;

//     if (!browserSupport) {
//         return (
//             <div className="h-100 d-flex flex-column">
//                 <div className="alert alert-warning m-2">
//                     Your browser does not support the Web Speech API. Please try using Chrome or Edge.
//                 </div>
//             </div>
//         );
//     }

//     return (



//         <div className="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
//             <div className="offcanvas-header">
//                 <h5 className="offcanvas-title" id="offcanvasBottomLabel">Offcanvas bottom</h5>
//                 <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
//             </div>
//             <div className="offcanvas-body small">
//                 <div className="d-flex flex-column">
//                     {/* Controls */}
//                     <div className="d-flex justify-content-between align-items-center p-2 border-bottom border-secondary">
//                         <div className="d-flex align-items-center gap-2">
//                             <i className="bi bi-translate"></i>
//                             <select
//                                 className="form-select form-select-sm text-dark bg-white"
//                                 value={language}
//                                 onChange={handleLanguageChange}
//                             >
//                                 <option value="en-US">English (US)</option>
//                                 <option value="es-ES">Spanish</option>
//                                 <option value="fr-FR">French</option>
//                                 <option value="de-DE">German</option>
//                                 <option value="it-IT">Italian</option>
//                                 <option value="pt-BR">Portuguese</option>
//                                 <option value="ru-RU">Russian</option>
//                                 <option value="ja-JP">Japanese</option>
//                                 <option value="ko-KR">Korean</option>
//                                 <option value="zh-CN">Chinese</option>
//                             </select>
//                         </div>
//                         <div className="d-flex align-items-center gap-2">
//                             <button
//                                 className={`btn btn-sm ${isListening ? 'btn-danger' : 'btn-primary'}`}
//                                 onClick={toggleListening}
//                                 title={isListening ? 'Stop listening' : 'Start listening'}
//                             >
//                                 <i className={`bi ${isListening ? 'bi-stop-fill' : 'bi-mic-fill'}`}></i>
//                                 {isListening ? 'Stop' : 'Start'}
//                             </button>
//                             <button
//                                 className="btn btn-sm btn-outline-secondary"
//                                 onClick={clearTranscript}
//                                 title="Clear transcript"
//                             >
//                                 <i className="bi bi-trash"></i>
//                             </button>
//                         </div>
//                     </div>

//                     {/* Error message */}
//                     {error && (
//                         <div className="alert alert-danger m-2">
//                             <i className="bi bi-exclamation-triangle-fill me-2"></i>
//                             Error: {error}
//                         </div>
//                     )}

//                     {/* Transcript display */}
//                     <div className="flex-grow-1 overflow-y-auto p-2">
//                         {/* User's own transcript */}
//                         <div className="mb-3 p-2 bg-black bg-opacity-30 rounded">
//                             <div className="d-flex justify-content-between align-items-center mb-1">
//                                 <span className="text-xs text-info fw-bold">
//                                     <i className="bi bi-person-fill me-1"></i>
//                                     You ({isInterviewer ? 'Interviewer' : 'Candidate'})
//                                 </span>
//                                 <span className="text-xs text-secondary">
//                                     {isListening ? 'Listening...' : 'Idle'}
//                                 </span>
//                             </div>
//                             <div className="text-sm">
//                                 {transcript || <span className="text-secondary">Start speaking to see your transcript here...</span>}
//                             </div>
//                         </div>

//                         {/* Transcripts from other participants */}
//                         {receivedTranscripts.length > 0 && (
//                             <>
//                                 <h6 className="text-xs text-uppercase text-secondary mb-2 px-2">Other Participants</h6>
//                                 {receivedTranscripts.map(item => (
//                                     <div key={item.id} className="mb-2 p-2 bg-black bg-opacity-20 rounded">
//                                         <div className="d-flex justify-content-between align-items-center mb-1">
//                                             <span className="text-xs text-warning fw-bold">
//                                                 <i className="bi bi-person-circle me-1"></i>
//                                                 {item.isUser ? 'You' : (isInterviewer ? 'Candidate' : 'Interviewer')}
//                                             </span>
//                                             <span className="text-xs text-secondary">{item.timestamp}</span>
//                                         </div>
//                                         <div className="text-sm">{item.text}</div>
//                                     </div>
//                                 ))}
//                             </>
//                         )}

//                         {/* Empty state */}
//                         {receivedTranscripts.length === 0 && (
//                             <div className="text-center py-4 text-secondary">
//                                 <i className="bi bi-chat-dots fs-4 mb-2 d-block"></i>
//                                 <p>Waiting for transcripts from other participants...</p>
//                             </div>
//                         )}

//                         <div ref={transcriptEndRef} />
//                     </div>

//                     {/* Status bar */}
//                     <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top border-secondary text-xs text-secondary">
//                         <span>Language: {language}</span>
//                         <span>Status: {isListening ? 'Listening...' : 'Idle'}</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LiveTranscription;














// import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";

// const LiveTranscription = ({
//     roomId,
//     server,
//     token,
//     user,
//     isInterviewer,
//     isVisible,
//     onClose,
// }) => {
//     const [isListening, setIsListening] = useState(false);
//     const [transcript, setTranscript] = useState("");
//     const [receivedTranscripts, setReceivedTranscripts] = useState([]);
//     const [language, setLanguage] = useState("en-US");
//     const [browserSupport, setBrowserSupport] = useState(true);
//     const [error, setError] = useState(null);

//     const recognitionRef = useRef(null);
//     const socketRef = useRef(null);
//     const transcriptEndRef = useRef(null);

//     // Setup socket connection
//     useEffect(() => {
//         if (!isVisible) return;

//         const socket = io(server, {
//             auth: { token },
//             reconnectionAttempts: 5,
//             reconnectionDelay: 1000,
//         });

//         socket.emit("joinTranscriptionRoom", roomId);

//         socket.on("transcription", (data) => {
//             setReceivedTranscripts((prev) => [
//                 ...prev,
//                 {
//                     id: Date.now(),
//                     text: data.transcript,
//                     isUser: data.userId === user?.userId,
//                     timestamp: new Date().toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                     }),
//                 },
//             ]);
//         });

//         socketRef.current = socket;

//         return () => {
//             socket.disconnect();
//         };
//     }, [roomId, server, token, user, isVisible]);

//     // Setup speech recognition
//     useEffect(() => {
//         if (!isVisible) return;

//         const SpeechRecognition =
//             window.SpeechRecognition || window.webkitSpeechRecognition;

//         if (!SpeechRecognition) {
//             setBrowserSupport(false);
//             return;
//         }

//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = true;
//         recognition.lang = language;

//         recognition.onresult = (event) => {
//             let interimTranscript = "";
//             let finalTranscript = "";

//             for (let i = event.resultIndex; i < event.results.length; i++) {
//                 const current = event.results[i][0].transcript;
//                 if (event.results[i].isFinal) {
//                     finalTranscript += current + " ";
//                     socketRef.current?.emit("transcription", {
//                         roomId,
//                         transcript: current,
//                         userId: user?.userId,
//                         role: user?.role,
//                     });
//                 } else {
//                     interimTranscript += current;
//                 }
//             }

//             if (finalTranscript) {
//                 setTranscript((prev) => prev + finalTranscript);
//             } else if (interimTranscript) {
//                 setTranscript((prev) => prev + interimTranscript);
//             }
//         };

//         recognition.onerror = (event) => {
//             setError(event.error);
//             setIsListening(false);
//         };

//         recognitionRef.current = recognition;

//         return () => {
//             recognition.stop();
//         };
//     }, [language, isVisible, roomId, user]);

//     // Auto-scroll
//     useEffect(() => {
//         transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [transcript, receivedTranscripts]);

//     const toggleListening = () => {
//         if (!recognitionRef.current) return;

//         if (isListening) {
//             recognitionRef.current.stop();
//             setIsListening(false);
//         } else {
//             recognitionRef.current.start();
//             setIsListening(true);
//         }
//     };

//     const handleLanguageChange = (e) => {
//         const newLang = e.target.value;
//         setLanguage(newLang);
//         if (recognitionRef.current) {
//             recognitionRef.current.stop();
//             recognitionRef.current.lang = newLang;
//             if (isListening) recognitionRef.current.start();
//         }
//     };

//     const clearTranscript = () => {
//         setTranscript("");
//         setReceivedTranscripts([]);
//     };

//     if (!isVisible) return null;

//     if (!browserSupport) {
//         return (
//             <div className="offcanvas offcanvas-bottom show" style={{ visibility: "visible" }}>
//                 <div className="offcanvas-header">
//                     <h5 className="offcanvas-title">Live Transcription</h5>
//                     <button type="button" className="btn-close" onClick={onClose}></button>
//                 </div>
//                 <div className="offcanvas-body">
//                     <div className="alert alert-warning">
//                         Your browser does not support the Web Speech API. Please use Chrome or Edge.
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="offcanvas offcanvas-bottom show" style={{ visibility: "visible" }}>
//             <div className="offcanvas-header">
//                 <h5 className="offcanvas-title d-flex align-items-center">
//                     <i className="bi bi-chat-square-text-fill me-2"></i>
//                     Live Transcription
//                 </h5>
//                 <div className="d-flex align-items-center gap-2">
//                     <i className="bi bi-translate"></i>
//                     <select
//                         className="form-select form-select-sm text-dark"
//                         value={language}
//                         onChange={handleLanguageChange}
//                     >
//                         <option value="en-US">English (US)</option>
//                         <option value="es-ES">Spanish</option>
//                         <option value="fr-FR">French</option>
//                         <option value="de-DE">German</option>
//                         <option value="it-IT">Italian</option>
//                         <option value="pt-BR">Portuguese</option>
//                         <option value="ru-RU">Russian</option>
//                         <option value="ja-JP">Japanese</option>
//                         <option value="ko-KR">Korean</option>
//                         <option value="zh-CN">Chinese</option>
//                     </select>
//                     <button
//                         className={`btn btn-sm ${isListening ? "btn-danger" : "btn-primary"}`}
//                         onClick={toggleListening}
//                     >
//                         <i className={`bi ${isListening ? "bi-stop-fill" : "bi-mic-fill"}`}></i>
//                         {isListening ? "Stop" : "Start"}
//                     </button>
//                     <button className="btn btn-sm btn-outline-secondary" onClick={clearTranscript}>
//                         <i className="bi bi-trash"></i>
//                     </button>
//                     <button type="button" className="btn-close" onClick={onClose}></button>
//                 </div>
//             </div>
//             <div className="offcanvas-body">
//                 {error && (
//                     <div className="alert alert-danger mb-3">
//                         <i className="bi bi-exclamation-triangle-fill me-2"></i>
//                         Error: {error}
//                     </div>
//                 )}

//                 <div className="transcript-container mb-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
//                     <div className="mb-3 p-2 bg-dark bg-opacity-25 rounded">
//                         <div className="d-flex justify-content-between mb-1">
//                             <span className="text-xs text-info fw-bold">
//                                 <i className="bi bi-person-fill me-1"></i>
//                                 You ({isInterviewer ? "Interviewer" : "Candidate"})
//                             </span>
//                             <span className="text-xs text-secondary">{isListening ? "Listening..." : "Idle"}</span>
//                         </div>
//                         <div className="text-sm">
//                             {transcript || (
//                                 <span className="text-secondary">Start speaking to see your transcript...</span>
//                             )}
//                         </div>
//                     </div>

//                     {receivedTranscripts.length > 0 ? (
//                         <>
//                             <h6 className="text-xs text-uppercase text-secondary mb-2">Other Participants</h6>
//                             {receivedTranscripts.map((item) => (
//                                 <div key={item.id} className="mb-2 p-2 bg-dark bg-opacity-10 rounded">
//                                     <div className="d-flex justify-content-between mb-1">
//                                         <span className="text-xs text-warning fw-bold">
//                                             <i className="bi bi-person-circle me-1"></i>
//                                             {item.isUser ? "You" : isInterviewer ? "Candidate" : "Interviewer"}
//                                         </span>
//                                         <span className="text-xs text-secondary">{item.timestamp}</span>
//                                     </div>
//                                     <div className="text-sm">{item.text}</div>
//                                 </div>
//                             ))}
//                         </>
//                     ) : (
//                         <div className="text-center py-4 text-secondary">
//                             <i className="bi bi-chat-dots fs-4 mb-2 d-block"></i>
//                             <p>Waiting for transcripts from other participants...</p>
//                         </div>
//                     )}

//                     <div ref={transcriptEndRef} />
//                 </div>

//                 <div className="d-flex justify-content-between pt-2 border-top border-secondary text-xs text-secondary">
//                     <span>Language: {language}</span>
//                     <span>Status: {isListening ? "Listening..." : "Idle"}</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LiveTranscription;













// LiveTranscription.jsx
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const LiveTranscription = ({ roomId, user, server }) => {
    const [transcript, setTranscript] = useState("");
    const [receivedTranscripts, setReceivedTranscripts] = useState([]);
    const [language, setLanguage] = useState("en-US");
    const [targetLanguage, setTargetLanguage] = useState("en-US");
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);

    const recognitionRef = useRef(null);
    const socketRef = useRef(null);
    const transcriptEndRef = useRef(null);

    // Initialize Socket.io
    useEffect(() => {
        socketRef.current = io(server);

        socketRef.current.emit("joinTranscriptionRoom", roomId);

        socketRef.current.on("transcription", (data) => {
            console.log(data);

            setReceivedTranscripts((prev) => [...prev, data]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId, server]);

    // Initialize SpeechRecognition
    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError("Your browser does not support Web Speech API");
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = language;

        recognitionRef.current.onresult = (event) => {
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptText = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptText + " ";

                    // Send final transcript to server
                    socketRef.current.emit("transcription", {
                        roomId,
                        transcript: transcriptText,
                        userId: user?.id,
                        role: user?.role,
                        targetLanguage
                    });
                }
            }

            if (finalTranscript) {
                setTranscript((prev) => prev + finalTranscript);
            }
        };

        // recognitionRef.current.onerror = (event) => {
        //     console.log(event.error);

        //     if (event.error === "no-speech") {
        //         console.warn("No speech detected. Please speak into the microphone.");
        //         // Optionally, restart recognition automatically
        //         if (isListening) {
        //             recognitionRef.current.stop();
        //             setTimeout(() => recognitionRef.current.start(), 500);
        //         }
        //     } else if (event.error === "audio-capture") {
        //         setError("Microphone not found or permission denied.");
        //         setIsListening(false);
        //     } else if (event.error === "not-allowed") {
        //         setError("Microphone access blocked by browser.");
        //         setIsListening(false);
        //     } else {
        //         console.error("Speech recognition error:", event.error);
        //         setError(event.error);
        //         setIsListening(false);
        //     }
        // };

        recognitionRef.current.onerror = (event) => {
            switch (event.error) {
                case "no-speech":
                    // Ignore silently or restart automatically
                    console.warn("No speech detected.");
                    if (isListening) {
                        recognitionRef.current.stop();
                        setTimeout(() => recognitionRef.current.start(), 500);
                    }
                    break;

                case "audio-capture":
                    setError("Microphone not found or permission denied.");
                    setIsListening(false);
                    break;

                case "not-allowed":
                    setError("Microphone access blocked by browser.");
                    setIsListening(false);
                    break;

                default:
                    console.error("Speech recognition error:", event.error);
                    setError(event.error);
                    setIsListening(false);
            }
        };


        return () => {
            recognitionRef.current?.stop();
        };
    }, [language, targetLanguage, roomId, user]);

    console.log(error);

    // Auto-scroll transcript
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcript, receivedTranscripts]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        if (recognitionRef.current) recognitionRef.current.lang = newLang;
    };

    const clearTranscript = () => {
        setTranscript("");
        setReceivedTranscripts([]);
    };

    console.log(receivedTranscripts);


    return (
        <div className="live-transcription p-3 bg-light border rounded" style={{ maxWidth: 500 }}>
            <div className="d-flex mb-2 gap-2 align-items-center">
                <select value={language} onChange={handleLanguageChange} className="form-select form-select-sm">
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="de-DE">German</option>
                    <option value="it-IT">Italian</option>
                </select>
                <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} className="form-select form-select-sm">
                    <option value="en-US">English</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="de-DE">German</option>
                </select>
                <button className={`btn btn-sm ${isListening ? "btn-danger" : "btn-primary"}`} onClick={toggleListening}>
                    {isListening ? "Stop" : "Start"}
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={clearTranscript}>Clear</button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="transcripts border rounded p-2 mb-2" style={{ maxHeight: 200, overflowY: "auto", background: "#f8f9fa" }}>
                <div><strong>You:</strong> {transcript || <span className="text-muted">Start speaking...</span>}</div>
                {receivedTranscripts.map((item, idx) => (
                    <div key={idx} className="mt-1">
                        <strong>{item.role}:</strong> {item.transcript} {item.translatedText && <em>({item.translatedText})</em>}
                    </div>
                ))}
                <div ref={transcriptEndRef} />
            </div>
        </div>
    );
};

export default LiveTranscription;

