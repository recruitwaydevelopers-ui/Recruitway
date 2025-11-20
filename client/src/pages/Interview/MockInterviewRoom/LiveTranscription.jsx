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

