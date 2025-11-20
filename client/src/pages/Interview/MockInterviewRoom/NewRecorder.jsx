import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const NewRecorder = ({ onStart, onStop, onComplete, isInterviewer, server, token, interviewId }) => {
    const [recorder, setRecorder] = useState(null);
    const [uploadId, setUploadId] = useState(null);
    const [fileKey, setFileKey] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [autoStart, setAutoStart] = useState(false);
    const autoStartAttempted = useRef(false);

    useEffect(() => {
        if (!isInterviewer) {
            setAutoStart(true);
        }
    }, [isInterviewer]);

    // Function to start recording
    const startRecording = async () => {
        try {
            // Capture full screen with system audio
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always"
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });

            // Capture microphone
            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                },
                video: false
            });

            // Combine streams
            const combinedStream = new MediaStream([
                ...displayStream.getVideoTracks(),
                ...displayStream.getAudioTracks(),
                ...micStream.getAudioTracks(),
            ]);

            const fileName = `interview-${Date.now()}.webm`;

            // Start upload session
            const startRes = await fetch(`${server}/api/upload/start-upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ fileName, interviewId }),
            });

            const { uploadId, key, message } = await startRes.json();
            if (!uploadId || !key) {
                toast.error("Failed to initialize upload!");
                return;
            }

            toast.success(message);
            setUploadId(uploadId);
            setFileKey(key);

            // Setup recorder
            const mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType: "video/webm;codecs=vp9,opus",
            });

            mediaRecorder.ondataavailable = async (e) => {
                if (e.data.size > 0) {
                    const formData = new FormData();
                    formData.append("chunk", e.data);
                    formData.append("uploadId", uploadId);
                    formData.append("key", key);

                    try {
                        const res = await fetch(`${server}/api/upload/upload-part`, {
                            method: "POST",
                            body: formData,
                        });
                        const data = await res.json();
                        if (data.flushed || data.buffered) {
                            console.log("✅ Chunk handled:", data);
                            setProgress((prev) => Math.min(prev + 5, 95));
                        }
                    } catch (err) {
                        console.error("Error uploading chunk:", err);
                    }
                }
            };

            // Record every 20s to avoid lag
            mediaRecorder.start(20000);
            setRecorder(mediaRecorder);
            setIsRecording(true);
            onStart && onStart();

            // Handle screen sharing stop
            displayStream.getVideoTracks()[0].onended = () => {
                console.log("Screen sharing stopped");
                if (isRecording) {
                    stopRecording();
                }
            };

        } catch (err) {
            console.error("Error starting recording:", err);
            toast.error("Failed to start recording. Please check permissions.");
            setIsRecording(false);
        }
    };

    const stopRecording = async () => {
        if (!recorder) return;

        recorder.stop();
        setIsRecording(false);
        onStop && onStop();

        setTimeout(async () => {
            try {
                const res = await fetch(`${server}/api/upload/complete-upload`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ uploadId, key: fileKey, interviewId }),
                });
                const data = await res.json();
                console.log("Upload completed!", data);
                setProgress(100);
                onComplete && onComplete();

                // Reset
                setRecorder(null);
                setUploadId(null);
                setFileKey(null);
                toast.success(data?.message || "Recording completed successfully!");

            } catch (err) {
                console.error("Error completing upload:", err);
                toast.error("Failed to complete upload. Please try again.");
            }
        }, 2000);
    };

    // Auto-start recording when component mounts for candidates
    useEffect(() => {
        if (autoStart && !isInterviewer && !autoStartAttempted.current && !isRecording) {
            autoStartAttempted.current = true;

            // Add a small delay to ensure the component is fully mounted
            const timer = setTimeout(() => {
                startRecording();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [autoStart, isInterviewer, isRecording]);

    return (
        <div className="d-flex gap-2 align-items-center">
            <button
                onClick={startRecording}
                disabled={isRecording}
                className="btn btn-sm btn-success d-flex align-items-center"
            >
                <i className="bi bi-record-circle me-1"></i>
                <span className="d-none d-sm-inline">Record</span>
            </button>
            <button
                onClick={stopRecording}
                disabled={!isRecording}
                className="btn btn-sm btn-danger d-flex align-items-center"
            >
                <i className="bi bi-stop-circle me-1"></i>
                <span className="d-none d-sm-inline">Stop</span>
            </button>
            {progress > 0 && progress < 100 && (
                <div className="d-flex align-items-center ms-2">
                    <div className="progress" style={{ width: "100px", height: "10px" }}>
                        <div
                            className="progress-bar bg-warning"
                            role="progressbar"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="ms-2 small">{progress}%</span>
                </div>
            )}
        </div>
    );
};

export default NewRecorder;