// import { useEffect, useRef, useState } from "react";
// import { FaceMesh } from "@mediapipe/face_mesh";
// import { Camera } from "@mediapipe/camera_utils";
// import { drawConnectors } from "@mediapipe/drawing_utils";
// import {
//     FACEMESH_LEFT_EYE,
//     FACEMESH_RIGHT_EYE,
//     FACEMESH_LIPS,
//     FACEMESH_FACE_OVAL,
// } from "@mediapipe/face_mesh";

// const EyeLipTracker = ({ onCheatingDetected, onWarningsUpdate, isEnabled = true }) => {
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [cheating, setCheating] = useState(false);
//     const [cheatingReason, setCheatingReason] = useState("");
//     const [warnings, setWarnings] = useState([]);

//     const cheatCounterRef = useRef(0);
//     const CHEAT_FRAMES = 15;
//     const faceVisibleCounterRef = useRef(0);

//     // Audio state
//     const [audioContext, setAudioContext] = useState(null);
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [audioLevel, setAudioLevel] = useState(0);
//     const [audioEnabled, setAudioEnabled] = useState(false);

//     // Warnings
//     const addWarning = (warning) => {
//         setWarnings((prev) => {
//             if (!prev.includes(warning)) {
//                 const newWarnings = [...prev, warning];
//                 onWarningsUpdate && onWarningsUpdate(newWarnings);
//                 return newWarnings;
//             }
//             return prev;
//         });
//     };

//     const removeWarning = (warning) => {
//         setWarnings((prev) => {
//             const newWarnings = prev.filter((w) => w !== warning);
//             onWarningsUpdate && onWarningsUpdate(newWarnings);
//             return newWarnings;
//         });
//     };

//     // Audio detection setup
//     const initializeAudioDetection = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 audio: {
//                     echoCancellation: true,
//                     noiseSuppression: true,
//                     autoGainControl: false,
//                 },
//             });

//             const context = new (window.AudioContext || window.webkitAudioContext)();
//             const analyserNode = context.createAnalyser();
//             analyserNode.fftSize = 256;

//             const microphoneSource = context.createMediaStreamSource(stream);
//             microphoneSource.connect(analyserNode);

//             setAudioContext(context);

//             const analyzeAudio = () => {
//                 const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

//                 const checkAudio = () => {
//                     if (!analyserNode) return;

//                     analyserNode.getByteFrequencyData(dataArray);

//                     let sum = 0;
//                     for (let i = 0; i < dataArray.length; i++) {
//                         sum += dataArray[i];
//                     }
//                     const average = sum / dataArray.length;
//                     setAudioLevel(average);

//                     const isCurrentlySpeaking = average > 20;
//                     setIsSpeaking(isCurrentlySpeaking);

//                     requestAnimationFrame(checkAudio);
//                 };

//                 checkAudio();
//             };

//             analyzeAudio();
//             setAudioEnabled(true);
//         } catch (err) {
//             console.warn("Audio detection not available:", err.message);
//             addWarning("Microphone access denied - audio monitoring disabled");
//             setAudioEnabled(false);
//         }
//     };

//     // Camera permission check
//     const checkCameraPermissions = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
//             });
//             stream.getTracks().forEach((track) => track.stop());
//             return true;
//         } catch (err) {
//             console.error("Camera permission denied:", err);
//             setError(`Camera access denied: ${err.message}`);
//             return false;
//         }
//     };

//     useEffect(() => {
//         if (!isEnabled) return;

//         let faceMesh = null;
//         let camera = null;

//         const initializeFaceTracking = async () => {
//             try {
//                 setIsLoading(true);

//                 const hasCameraPermission = await checkCameraPermissions();
//                 if (!hasCameraPermission) {
//                     setIsLoading(false);
//                     return;
//                 }

//                 faceMesh = new FaceMesh({
//                     locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
//                 });

//                 faceMesh.setOptions({
//                     maxNumFaces: 5, // detect multiple faces
//                     refineLandmarks: true,
//                     minDetectionConfidence: 0.5,
//                     minTrackingConfidence: 0.5,
//                 });

//                 faceMesh.onResults((results) => {
//                     const canvas = canvasRef.current;
//                     const ctx = canvas?.getContext("2d");
//                     if (!ctx || !canvas) return;

//                     ctx.clearRect(0, 0, canvas.width, canvas.height);

//                     if (results.image) {
//                         ctx.save();
//                         ctx.scale(-1, 1);
//                         ctx.drawImage(results.image, -canvas.width, 0, canvas.width, canvas.height);
//                         ctx.restore();
//                     }

//                     if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
//                         // 🚨 If more than one face detected
//                         if (results.multiFaceLandmarks.length > 1) {
//                             setCheating(true);
//                             setCheatingReason("Multiple faces detected");
//                             onCheatingDetected && onCheatingDetected(true, "Multiple faces detected");
//                             addWarning("More than one face detected - Only one person allowed in frame");

//                             results.multiFaceLandmarks.forEach((landmarks) => {
//                                 const mirrored = landmarks.map((lm) => ({ ...lm, x: 1 - lm.x }));
//                                 drawConnectors(ctx, mirrored, FACEMESH_FACE_OVAL, { color: "#FF0000", lineWidth: 2 });
//                                 drawConnectors(ctx, mirrored, FACEMESH_LIPS, { color: "#FF0000", lineWidth: 2 });
//                             });
//                             return; // still tracking but flagged
//                         }

//                         // ✅ Normal single-face logic
//                         const landmarks = results.multiFaceLandmarks[0];
//                         faceVisibleCounterRef.current++;

//                         const getFaceCenter = () => {
//                             const faceOvalIndices = [
//                                 10, 338, 297, 332, 284, 251, 389, 356, 454, 323,
//                                 361, 288, 397, 365, 379, 378, 400, 377, 152, 148,
//                                 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
//                                 162, 21, 54, 103, 67, 109,
//                             ];
//                             let sumX = 0;
//                             let sumY = 0;
//                             faceOvalIndices.forEach((i) => {
//                                 if (landmarks[i]) {
//                                     sumX += landmarks[i].x;
//                                     sumY += landmarks[i].y;
//                                 }
//                             });
//                             return { x: sumX / faceOvalIndices.length, y: sumY / faceOvalIndices.length };
//                         };

//                         const checkHeadRotation = () => {
//                             const noseTip = landmarks[1];
//                             const leftFace = landmarks[234];
//                             const rightFace = landmarks[454];
//                             if (!noseTip || !leftFace || !rightFace) return 0;
//                             const faceWidth = Math.abs(leftFace.x - rightFace.x);
//                             const noseOffset = Math.abs(noseTip.x - (leftFace.x + rightFace.x) / 2);
//                             return noseOffset / faceWidth;
//                         };

//                         const checkEyeGaze = () => {
//                             const leftEyeInner = landmarks[33];
//                             const leftEyeOuter = landmarks[133];
//                             const leftEyeCenter = landmarks[468];
//                             const rightEyeInner = landmarks[362];
//                             const rightEyeOuter = landmarks[263];
//                             const rightEyeCenter = landmarks[473];
//                             if (!leftEyeCenter || !rightEyeCenter) return false;

//                             const leftEyeWidth = Math.abs(leftEyeOuter.x - leftEyeInner.x);
//                             const leftIrisOffset = Math.abs(leftEyeCenter.x - (leftEyeInner.x + leftEyeOuter.x) / 2);
//                             const leftGazeDeviation = leftIrisOffset / leftEyeWidth;

//                             const rightEyeWidth = Math.abs(rightEyeOuter.x - rightEyeInner.x);
//                             const rightIrisOffset = Math.abs(rightEyeCenter.x - (rightEyeInner.x + rightEyeOuter.x) / 2);
//                             const rightGazeDeviation = rightIrisOffset / rightEyeWidth;

//                             return leftGazeDeviation > 0.3 || rightGazeDeviation > 0.3;
//                         };

//                         const checkLipMovement = () => {
//                             const upperLip = landmarks[13];
//                             const lowerLip = landmarks[14];
//                             const lipLeft = landmarks[78];
//                             const lipRight = landmarks[308];
//                             if (!upperLip || !lowerLip) return { isMouthOpen: false, openness: 0 };
//                             const verticalOpenness = Math.abs(upperLip.y - lowerLip.y);
//                             const horizontalWidth = Math.abs(lipRight.x - lipLeft.x);
//                             const opennessRatio = verticalOpenness / horizontalWidth;
//                             return { isMouthOpen: opennessRatio > 0.15, openness: opennessRatio };
//                         };

//                         const faceCenter = getFaceCenter();
//                         const headRotation = checkHeadRotation();
//                         const isLookingAway = checkEyeGaze();
//                         const lipStatus = checkLipMovement();

//                         const isFaceOffCenter = Math.abs(faceCenter.x - 0.5) > 0.25;
//                         const isHeadRotated = headRotation > 0.15;
//                         const isFaceTooSmall = faceCenter.y < 0.3 || faceCenter.y > 0.7;

//                         const audioVisualMismatch = audioEnabled && isSpeaking && !lipStatus.isMouthOpen;
//                         const visualAudioMismatch =
//                             audioEnabled && !isSpeaking && lipStatus.isMouthOpen && lipStatus.openness > 0.2;
//                         const backgroundNoise =
//                             audioEnabled && isSpeaking && audioLevel > 50 && !lipStatus.isMouthOpen;

//                         // --- Add after backgroundNoise calculation ---
//                         const possibleVoiceMismatch =
//                             audioEnabled &&
//                             isSpeaking &&
//                             lipStatus.isMouthOpen &&
//                             audioLevel > 40 &&              // high audio intensity
//                             lipStatus.openness < 0.1;       // minimal mouth opening (fake talking)

//                         let currentCheatingReason = "";
//                         let currentWarning = "";

//                         if (isFaceOffCenter) {
//                             currentCheatingReason = "Face not centered";
//                             currentWarning = "Please keep your face centered in frame";
//                         } else if (isHeadRotated) {
//                             currentCheatingReason = "Head turned away";
//                             currentWarning = "Please face the camera directly";
//                         } else if (isLookingAway) {
//                             currentCheatingReason = "Looking away from screen";
//                             currentWarning = "Please maintain eye contact with the camera";
//                         } else if (isFaceTooSmall) {
//                             currentCheatingReason = "Face too far from camera";
//                             currentWarning = "Please move closer to the camera";
//                         } else if (audioVisualMismatch) {
//                             currentCheatingReason = "Audio detected but no lip movement";
//                             currentWarning = "Audio detected without corresponding lip movement";
//                         } else if (visualAudioMismatch) {
//                             currentCheatingReason = "Lip movement but no audio";
//                             currentWarning = "Lip movement detected but no audio input";
//                         } else if (backgroundNoise) {
//                             currentCheatingReason = "Background noise detected";
//                             currentWarning = "Background noise detected - please check your environment";
//                         } else if (possibleVoiceMismatch) {
//                             currentCheatingReason = "Possible second person speaking";
//                             currentWarning = "Mismatch between voice and lip movement - another person may be speaking";
//                         }


//                         const isCheating =
//                             isFaceOffCenter ||
//                             isHeadRotated ||
//                             isLookingAway ||
//                             isFaceTooSmall ||
//                             audioVisualMismatch ||
//                             visualAudioMismatch ||
//                             backgroundNoise ||
//                             possibleVoiceMismatch;

//                         if (isCheating) {
//                             cheatCounterRef.current++;
//                             setCheatingReason(currentCheatingReason);
//                             if (cheatCounterRef.current >= CHEAT_FRAMES) {
//                                 setCheating(true);
//                                 onCheatingDetected && onCheatingDetected(true, currentCheatingReason);
//                                 if (currentWarning) addWarning(currentWarning);
//                             }
//                         } else {
//                             cheatCounterRef.current = 0;
//                             setCheating(false);
//                             setCheatingReason("");
//                             setWarnings([]);
//                             onWarningsUpdate && onWarningsUpdate([]);
//                             onCheatingDetected && onCheatingDetected(false, "");
//                         }

//                         // draw landmarks
//                         const mirroredLandmarks = landmarks.map((landmark) => ({
//                             ...landmark,
//                             x: 1 - landmark.x,
//                         }));
//                         const connectionColor = cheating ? "#FF0000" : "#00FF00";
//                         const lipColor = audioEnabled && isSpeaking ? "#00FF00" : "#FF0000";

//                         drawConnectors(ctx, mirroredLandmarks, FACEMESH_LEFT_EYE, { color: connectionColor, lineWidth: 2 });
//                         drawConnectors(ctx, mirroredLandmarks, FACEMESH_RIGHT_EYE, { color: connectionColor, lineWidth: 2 });
//                         drawConnectors(ctx, mirroredLandmarks, FACEMESH_LIPS, { color: lipColor, lineWidth: 2 });
//                         drawConnectors(ctx, mirroredLandmarks, FACEMESH_FACE_OVAL, { color: connectionColor, lineWidth: 1 });

//                         ctx.fillStyle = cheating ? "#FF0000" : "#00FF00";
//                         ctx.beginPath();
//                         ctx.arc(faceCenter.x * canvas.width, faceCenter.y * canvas.height, 5, 0, 2 * Math.PI);
//                         ctx.fill();

//                         if (audioEnabled) {
//                             ctx.fillStyle = isSpeaking ? "#00FF00" : "#666666";
//                             ctx.fillRect(10, 10, 20, Math.max(5, audioLevel));
//                         }
//                     } else {
//                         faceVisibleCounterRef.current = 0;
//                         cheatCounterRef.current++;
//                         if (cheatCounterRef.current >= CHEAT_FRAMES * 2) {
//                             setCheatingReason("No face detected");
//                             setCheating(true);
//                             onCheatingDetected && onCheatingDetected(true, "No face detected");
//                             addWarning("No face detected - please position yourself in front of the camera");
//                         } else {
//                             setCheating(false);
//                             onCheatingDetected && onCheatingDetected(false, "");
//                         }
//                     }
//                 });

//                 await faceMesh.initialize();

//                 if (videoRef.current) {
//                     camera = new Camera(videoRef.current, {
//                         onFrame: async () => {
//                             if (faceMesh && videoRef.current) {
//                                 try {
//                                     await faceMesh.send({ image: videoRef.current });
//                                 } catch (err) {
//                                     console.error("Error processing frame:", err);
//                                 }
//                             }
//                         },
//                         width: 640,
//                         height: 480,
//                     });

//                     await camera.start();
//                     setIsLoading(false);

//                     setTimeout(() => {
//                         initializeAudioDetection();
//                     }, 1000);
//                 }
//             } catch (err) {
//                 console.error("Face tracking initialization failed:", err);
//                 setError(err.message);
//                 setIsLoading(false);
//             }
//         };

//         initializeFaceTracking();

//         return () => {
//             if (camera) camera.stop();
//             if (audioContext) audioContext.close();
//         };
//     }, [isEnabled]);

//     if (!isEnabled) {
//         return <div style={{ padding: "10px", background: "#f8f9fa", borderRadius: "5px", textAlign: "center" }}>
//             Anti-cheating monitoring disabled
//         </div>;
//     }

//     if (error) {
//         return <div style={{ padding: "10px", background: "#ffe6e6", borderRadius: "5px", color: "#d63031" }}>
//             <small>Anti-cheat error: {error}</small>
//         </div>;
//     }

//     return (
//         <div style={{ position: "relative", display: "inline-block" }}>
//             {isLoading && (
//                 <div style={{
//                     position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
//                     color: "white", backgroundColor: "rgba(0,0,0,0.7)", padding: "5px 10px",
//                     borderRadius: "4px", zIndex: 10, fontSize: "12px"
//                 }}>Starting anti-cheat...</div>
//             )}

//             <video ref={videoRef} style={{ display: "none" }} width="640" height="480" playsInline />
//             <canvas ref={canvasRef} width="320" height="240" style={{
//                 transform: "scaleX(-1)", border: cheating ? "2px solid #ff4444" : "2px solid #00ff00",
//                 borderRadius: "5px", maxWidth: "100%", height: "auto"
//             }} />

//             {/* Status Panel */}
//             <div style={{
//                 position: "absolute", top: "5px", left: "5px",
//                 background: "rgba(0,0,0,0.7)", padding: "5px", color: "white",
//                 borderRadius: "3px", zIndex: 20, fontSize: "10px"
//             }}>
//                 <div>Audio: <span style={{ color: audioEnabled ? (isSpeaking ? "#00FF00" : "#FF0000") : "#888" }}>
//                     {audioEnabled ? (isSpeaking ? "SPEAKING" : "SILENT") : "OFF"}
//                 </span></div>
//             </div>

//             {cheating && (
//                 <div style={{
//                     position: "absolute", bottom: "5px", left: "50%", transform: "translateX(-50%)",
//                     background: "rgba(255,0,0,0.7)", padding: "5px 10px", color: "white",
//                     fontWeight: "bold", borderRadius: "3px", zIndex: 20, fontSize: "10px"
//                 }}>
//                     ⚠ {cheatingReason}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default EyeLipTracker;





















import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors } from "@mediapipe/drawing_utils";
import {
    FACEMESH_LEFT_EYE,
    FACEMESH_RIGHT_EYE,
    FACEMESH_LIPS,
    FACEMESH_FACE_OVAL,
} from "@mediapipe/face_mesh";

const EyeLipTracker = ({ onCheatingDetected, onWarningsUpdate, isEnabled = true }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cheating, setCheating] = useState(false);
    const [cheatingReason, setCheatingReason] = useState("");
    const [warnings, setWarnings] = useState([]);

    const cheatCounterRef = useRef(0);
    const CHEAT_FRAMES = 15;
    const faceVisibleCounterRef = useRef(0);

    // NEW: Separate frame counters for new scenarios
    const lipSyncCheatCounterRef = useRef(0);
    const audioWithoutLipsCheatCounterRef = useRef(0);

    // Audio state
    const [audioContext, setAudioContext] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [audioEnabled, setAudioEnabled] = useState(false);

    // Warnings
    const addWarning = (warning) => {
        setWarnings((prev) => {
            if (!prev.includes(warning)) {
                const newWarnings = [...prev, warning];
                onWarningsUpdate && onWarningsUpdate(newWarnings);
                return newWarnings;
            }
            return prev;
        });
    };

    const removeWarning = (warning) => {
        setWarnings((prev) => {
            const newWarnings = prev.filter((w) => w !== warning);
            onWarningsUpdate && onWarningsUpdate(newWarnings);
            return newWarnings;
        });
    };

    // Audio detection setup
    const initializeAudioDetection = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: false,
                },
            });

            const context = new (window.AudioContext || window.webkitAudioContext)();
            const analyserNode = context.createAnalyser();
            analyserNode.fftSize = 256;

            const microphoneSource = context.createMediaStreamSource(stream);
            microphoneSource.connect(analyserNode);

            setAudioContext(context);

            const analyzeAudio = () => {
                const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

                const checkAudio = () => {
                    if (!analyserNode) return;

                    analyserNode.getByteFrequencyData(dataArray);

                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        sum += dataArray[i];
                    }
                    const average = sum / dataArray.length;
                    setAudioLevel(average);

                    const isCurrentlySpeaking = average > 20;
                    setIsSpeaking(isCurrentlySpeaking);

                    requestAnimationFrame(checkAudio);
                };

                checkAudio();
            };

            analyzeAudio();
            setAudioEnabled(true);
        } catch (err) {
            console.warn("Audio detection not available:", err.message);
            addWarning("Microphone access denied - audio monitoring disabled");
            setAudioEnabled(false);
        }
    };

    // Camera permission check
    const checkCameraPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
            });
            stream.getTracks().forEach((track) => track.stop());
            return true;
        } catch (err) {
            console.error("Camera permission denied:", err);
            setError(`Camera access denied: ${err.message}`);
            return false;
        }
    };

    useEffect(() => {
        if (!isEnabled) return;

        let faceMesh = null;
        let camera = null;

        const initializeFaceTracking = async () => {
            try {
                setIsLoading(true);

                const hasCameraPermission = await checkCameraPermissions();
                if (!hasCameraPermission) {
                    setIsLoading(false);
                    return;
                }

                faceMesh = new FaceMesh({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
                });

                faceMesh.setOptions({
                    maxNumFaces: 5, // detect multiple faces
                    refineLandmarks: true,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                });

                faceMesh.onResults((results) => {
                    const canvas = canvasRef.current;
                    const ctx = canvas?.getContext("2d");
                    if (!ctx || !canvas) return;

                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    if (results.image) {
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.drawImage(results.image, -canvas.width, 0, canvas.width, canvas.height);
                        ctx.restore();
                    }

                    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                        // 🚨 If more than one face detected
                        if (results.multiFaceLandmarks.length > 1) {
                            setCheating(true);
                            setCheatingReason("Multiple faces detected");
                            onCheatingDetected && onCheatingDetected(true, "Multiple faces detected");
                            addWarning("More than one face detected - Only one person allowed in frame");

                            results.multiFaceLandmarks.forEach((landmarks) => {
                                const mirrored = landmarks.map((lm) => ({ ...lm, x: 1 - lm.x }));
                                drawConnectors(ctx, mirrored, FACEMESH_FACE_OVAL, { color: "#FF0000", lineWidth: 2 });
                                drawConnectors(ctx, mirrored, FACEMESH_LIPS, { color: "#FF0000", lineWidth: 2 });
                            });
                            // Reset lipsync counters since this situation trumps others
                            lipSyncCheatCounterRef.current = 0;
                            audioWithoutLipsCheatCounterRef.current = 0;
                            return;
                        }

                        // ✅ Normal single-face logic
                        const landmarks = results.multiFaceLandmarks[0];
                        faceVisibleCounterRef.current++;

                        const getFaceCenter = () => {
                            const faceOvalIndices = [
                                10, 338, 297, 332, 284, 251, 389, 356, 454, 323,
                                361, 288, 397, 365, 379, 378, 400, 377, 152, 148,
                                176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
                                162, 21, 54, 103, 67, 109,
                            ];
                            let sumX = 0;
                            let sumY = 0;
                            faceOvalIndices.forEach((i) => {
                                if (landmarks[i]) {
                                    sumX += landmarks[i].x;
                                    sumY += landmarks[i].y;
                                }
                            });
                            return { x: sumX / faceOvalIndices.length, y: sumY / faceOvalIndices.length };
                        };

                        const checkHeadRotation = () => {
                            const noseTip = landmarks[1];
                            const leftFace = landmarks[234];
                            const rightFace = landmarks[454];
                            if (!noseTip || !leftFace || !rightFace) return 0;
                            const faceWidth = Math.abs(leftFace.x - rightFace.x);
                            const noseOffset = Math.abs(noseTip.x - (leftFace.x + rightFace.x) / 2);
                            return noseOffset / faceWidth;
                        };

                        const checkEyeGaze = () => {
                            const leftEyeInner = landmarks[33];
                            const leftEyeOuter = landmarks[133];
                            const leftEyeCenter = landmarks[468];
                            const rightEyeInner = landmarks[362];
                            const rightEyeOuter = landmarks[263];
                            const rightEyeCenter = landmarks[473];
                            if (!leftEyeCenter || !rightEyeCenter) return false;

                            const leftEyeWidth = Math.abs(leftEyeOuter.x - leftEyeInner.x);
                            const leftIrisOffset = Math.abs(leftEyeCenter.x - (leftEyeInner.x + leftEyeOuter.x) / 2);
                            const leftGazeDeviation = leftIrisOffset / leftEyeWidth;

                            const rightEyeWidth = Math.abs(rightEyeOuter.x - rightEyeInner.x);
                            const rightIrisOffset = Math.abs(rightEyeCenter.x - (rightEyeInner.x + rightEyeOuter.x) / 2);
                            const rightGazeDeviation = rightIrisOffset / rightEyeWidth;

                            return leftGazeDeviation > 0.3 || rightGazeDeviation > 0.3;
                        };

                        const checkLipMovement = () => {
                            const upperLip = landmarks[13];
                            const lowerLip = landmarks[14];
                            const lipLeft = landmarks[78];
                            const lipRight = landmarks[308];
                            if (!upperLip || !lowerLip) return { isMouthOpen: false, openness: 0 };
                            const verticalOpenness = Math.abs(upperLip.y - lowerLip.y);
                            const horizontalWidth = Math.abs(lipRight.x - lipLeft.x);
                            const opennessRatio = verticalOpenness / horizontalWidth;
                            return { isMouthOpen: opennessRatio > 0.15, openness: opennessRatio };
                        };

                        const faceCenter = getFaceCenter();
                        const headRotation = checkHeadRotation();
                        const isLookingAway = checkEyeGaze();
                        const lipStatus = checkLipMovement();

                        const isFaceOffCenter = Math.abs(faceCenter.x - 0.5) > 0.25;
                        const isHeadRotated = headRotation > 0.15;
                        const isFaceTooSmall = faceCenter.y < 0.3 || faceCenter.y > 0.7;

                        // Extended logic for lipsync/bystander speaking detection
                        // Lip movement but NO audio (possible lipsync/proxy cheating)
                        const lipsMovingButNoAudio =
                            lipStatus.isMouthOpen &&
                            lipStatus.openness > 0.2 &&
                            audioEnabled &&
                            !isSpeaking;
                        // Audio but NO lip movement (possible bystander speaking)
                        const audioButNoLipsMoving =
                            audioEnabled &&
                            isSpeaking &&
                            (!lipStatus.isMouthOpen || lipStatus.openness < 0.1);

                        // Robust frame counting for advanced cheating
                        if (lipsMovingButNoAudio) {
                            lipSyncCheatCounterRef.current++;
                        } else {
                            lipSyncCheatCounterRef.current = 0;
                        }

                        if (audioButNoLipsMoving) {
                            audioWithoutLipsCheatCounterRef.current++;
                        } else {
                            audioWithoutLipsCheatCounterRef.current = 0;
                        }

                        let currentCheatingReason = "";
                        let currentWarning = "";

                        // NEW: If any advanced lipsync cheat sustained
                        if (lipSyncCheatCounterRef.current >= CHEAT_FRAMES) {
                            currentCheatingReason =
                                "Visible lips moving but no audio detected (possible hidden speaker)";
                            currentWarning =
                                "Lips are moving but no voice detected—possible hidden speaker cheating attempt";
                        } else if (audioWithoutLipsCheatCounterRef.current >= CHEAT_FRAMES) {
                            currentCheatingReason =
                                "Audio detected but visible lips not moving (possible silent proxy)";
                            currentWarning =
                                "Voice detected but lips not moving—possible silent proxy speaking for candidate";
                        } else if (isFaceOffCenter) {
                            currentCheatingReason = "Face not centered";
                            currentWarning = "Please keep your face centered in frame";
                        } else if (isHeadRotated) {
                            currentCheatingReason = "Head turned away";
                            currentWarning = "Please face the camera directly";
                        } else if (isLookingAway) {
                            currentCheatingReason = "Looking away from screen";
                            currentWarning = "Please maintain eye contact with the camera";
                        } else if (isFaceTooSmall) {
                            currentCheatingReason = "Face too far from camera";
                            currentWarning = "Please move closer to the camera";
                        }

                        // Extend isCheating check to include new scenarios
                        const isCheating =
                            (lipSyncCheatCounterRef.current >= CHEAT_FRAMES) ||
                            (audioWithoutLipsCheatCounterRef.current >= CHEAT_FRAMES) ||
                            isFaceOffCenter ||
                            isHeadRotated ||
                            isLookingAway ||
                            isFaceTooSmall;

                        if (isCheating) {
                            cheatCounterRef.current++;
                            setCheatingReason(currentCheatingReason);
                            if (cheatCounterRef.current >= CHEAT_FRAMES) {
                                setCheating(true);
                                onCheatingDetected && onCheatingDetected(true, currentCheatingReason);
                                if (currentWarning) addWarning(currentWarning);
                            }
                        } else {
                            cheatCounterRef.current = 0;
                            setCheating(false);
                            setCheatingReason("");
                            setWarnings([]);
                            onWarningsUpdate && onWarningsUpdate([]);
                            onCheatingDetected && onCheatingDetected(false, "");
                        }

                        // draw landmarks
                        const mirroredLandmarks = landmarks.map((landmark) => ({
                            ...landmark,
                            x: 1 - landmark.x,
                        }));
                        const connectionColor = cheating ? "#FF0000" : "#00FF00";
                        const lipColor = audioEnabled && isSpeaking ? "#00FF00" : "#FF0000";

                        drawConnectors(ctx, mirroredLandmarks, FACEMESH_LEFT_EYE, { color: connectionColor, lineWidth: 2 });
                        drawConnectors(ctx, mirroredLandmarks, FACEMESH_RIGHT_EYE, { color: connectionColor, lineWidth: 2 });
                        drawConnectors(ctx, mirroredLandmarks, FACEMESH_LIPS, { color: lipColor, lineWidth: 2 });
                        drawConnectors(ctx, mirroredLandmarks, FACEMESH_FACE_OVAL, { color: connectionColor, lineWidth: 1 });

                        ctx.fillStyle = cheating ? "#FF0000" : "#00FF00";
                        ctx.beginPath();
                        ctx.arc(faceCenter.x * canvas.width, faceCenter.y * canvas.height, 5, 0, 2 * Math.PI);
                        ctx.fill();

                        if (audioEnabled) {
                            ctx.fillStyle = isSpeaking ? "#00FF00" : "#666666";
                            ctx.fillRect(10, 10, 20, Math.max(5, audioLevel));
                        }
                    } else {
                        faceVisibleCounterRef.current = 0;
                        cheatCounterRef.current++;
                        lipSyncCheatCounterRef.current = 0;
                        audioWithoutLipsCheatCounterRef.current = 0;
                        if (cheatCounterRef.current >= CHEAT_FRAMES * 2) {
                            setCheatingReason("No face detected");
                            setCheating(true);
                            onCheatingDetected && onCheatingDetected(true, "No face detected");
                            addWarning("No face detected - please position yourself in front of the camera");
                        } else {
                            setCheating(false);
                            onCheatingDetected && onCheatingDetected(false, "");
                        }
                    }
                });

                await faceMesh.initialize();

                if (videoRef.current) {
                    camera = new Camera(videoRef.current, {
                        onFrame: async () => {
                            if (faceMesh && videoRef.current) {
                                try {
                                    await faceMesh.send({ image: videoRef.current });
                                } catch (err) {
                                    console.error("Error processing frame:", err);
                                }
                            }
                        },
                        width: 640,
                        height: 480,
                    });

                    await camera.start();
                    setIsLoading(false);

                    setTimeout(() => {
                        initializeAudioDetection();
                    }, 1000);
                }
            } catch (err) {
                console.error("Face tracking initialization failed:", err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        initializeFaceTracking();

        return () => {
            if (camera) camera.stop();
            if (audioContext) audioContext.close();
        };
    }, [isEnabled]);

    if (!isEnabled) {
        return <div style={{ padding: "10px", background: "#f8f9fa", borderRadius: "5px", textAlign: "center" }}>
            Anti-cheating monitoring disabled
        </div>;
    }

    if (error) {
        return <div style={{ padding: "10px", background: "#ffe6e6", borderRadius: "5px", color: "#d63031" }}>
            <small>Anti-cheat error: {error}</small>
        </div>;
    }

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            {isLoading && (
                <div style={{
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    color: "white", backgroundColor: "rgba(0,0,0,0.7)", padding: "5px 10px",
                    borderRadius: "4px", zIndex: 10, fontSize: "12px"
                }}>Starting anti-cheat...</div>
            )}

            <video ref={videoRef} style={{ display: "none" }} width="640" height="480" playsInline />
            <canvas ref={canvasRef} width="320" height="240" style={{
                transform: "scaleX(-1)", border: cheating ? "2px solid #ff4444" : "2px solid #00ff00",
                borderRadius: "5px", maxWidth: "100%", height: "auto"
            }} />

            {/* Status Panel */}
            <div style={{
                position: "absolute", top: "5px", left: "5px",
                background: "rgba(0,0,0,0.7)", padding: "5px", color: "white",
                borderRadius: "3px", zIndex: 20, fontSize: "10px"
            }}>
                <div>Audio: <span style={{ color: audioEnabled ? (isSpeaking ? "#00FF00" : "#FF0000") : "#888" }}>
                    {audioEnabled ? (isSpeaking ? "SPEAKING" : "SILENT") : "OFF"}
                </span></div>
            </div>

            {cheating && (
                <div style={{
                    position: "absolute", bottom: "5px", left: "50%", transform: "translateX(-50%)",
                    background: "rgba(255,0,0,0.7)", padding: "5px 10px", color: "white",
                    fontWeight: "bold", borderRadius: "3px", zIndex: 20, fontSize: "10px"
                }}>
                    ⚠ {cheatingReason}
                </div>
            )}
        </div>
    );
};

export default EyeLipTracker;