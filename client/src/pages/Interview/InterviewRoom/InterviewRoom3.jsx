// import React, { useEffect, useRef, useState } from 'react';
// import { connect, createLocalVideoTrack } from 'twilio-video';
// import Editor from '@monaco-editor/react';
// import { useAuthContext } from '../../../context/auth-context';
// import axios from 'axios';

// const InterviewRoom3 = ({ interviewId }) => {

//     const { server, user } = useAuthContext();
//     const identity = `${user.role}-${user.fullname}`;
//     const token = localStorage.getItem("token");


//     const [room, setRoom] = useState(null);
//     const [isAudioEnabled, setIsAudioEnabled] = useState(true);
//     const [isVideoEnabled, setIsVideoEnabled] = useState(true);
//     const [isScreenSharing, setIsScreenSharing] = useState(false);
//     const [messages, setMessages] = useState([]);
//     const [chatInput, setChatInput] = useState('');
//     const [fullscreen, setFullscreen] = useState(false);

//     const localVideoRef = useRef(null);
//     const remoteVideoRef = useRef(null);
//     const screenTrackRef = useRef(null);

//     useEffect(() => {
//         const joinRoom = async () => {
//             const res = await axios.post(`${server}/api/v1/interviews/video/token`, {
//                 identity,
//                 room: interviewId
//             }, { headers: { Authorization: `Bearer ${token}` } });

//             const connectOptions = {
//                 name: interviewId,
//                 bandwidthProfile: {
//                     video: {
//                         mode: 'collaboration',
//                         maxTracks: 10,
//                         renderDimensions: {
//                             high: { width: 1280, height: 720 },
//                             standard: { width: 640, height: 480 },
//                             low: { width: 320, height: 240 }
//                         }
//                     }
//                 },
//                 preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
//                 networkQuality: { local: 1, remote: 1 }
//             };
//             const room = await connect(res.data.token, connectOptions);
//             setRoom(room);

//             const localTrack = await createLocalVideoTrack();
//             const localElement = localTrack.attach();
//             localElement.style.width = '100%';
//             localVideoRef.current.appendChild(localElement);

//             room.on('participantConnected', participant => {
//                 participant.tracks.forEach(publication => {
//                     if (publication.isSubscribed) {
//                         const trackElement = publication.track.attach();
//                         trackElement.style.width = '100%';
//                         remoteVideoRef.current.appendChild(trackElement);
//                     }
//                 });
//                 participant.on('trackSubscribed', track => {
//                     const trackElement = track.attach();
//                     trackElement.style.width = '100%';
//                     remoteVideoRef.current.appendChild(trackElement);
//                 });
//             });
//         };

//         joinRoom();

//         return () => {
//             if (room) room.disconnect();
//         };
//     }, [token, interviewId]);

//     const toggleAudio = () => {
//         room.localParticipant.audioTracks.forEach(pub => {
//             pub.track.enable(!isAudioEnabled);
//         });
//         setIsAudioEnabled(prev => !prev);
//     };

//     const toggleVideo = () => {
//         room.localParticipant.videoTracks.forEach(pub => {
//             pub.track.enable(!isVideoEnabled);
//         });
//         setIsVideoEnabled(prev => !prev);
//     };

//     const startScreenShare = async () => {
//         const stream = await navigator.mediaDevices.getDisplayMedia();
//         const screenTrack = stream.getTracks()[0];
//         screenTrackRef.current = screenTrack;

//         room.localParticipant.publishTrack(screenTrack);
//         screenTrack.onended = () => {
//             room.localParticipant.unpublishTrack(screenTrack);
//             setIsScreenSharing(false);
//         };

//         setIsScreenSharing(true);
//     };

//     const stopScreenShare = () => {
//         if (screenTrackRef.current) {
//             room.localParticipant.unpublishTrack(screenTrackRef.current);
//             screenTrackRef.current.stop();
//             setIsScreenSharing(false);
//         }
//     };

//     const toggleFullScreen = () => {
//         const el = document.documentElement;
//         if (!fullscreen) {
//             el.requestFullscreen();
//         } else {
//             document.exitFullscreen();
//         }
//         setFullscreen(!fullscreen);
//     };

//     const leaveRoom = () => {
//         room.disconnect();
//         window.location.href = '/';
//     };

//     const sendMessage = () => {
//         if (!chatInput.trim()) return;
//         setMessages(prev => [...prev, { sender: 'You', text: chatInput }]);
//         setChatInput('');
//     };

//     return (
//         <div className="container-fluid py-3 bg-light">
//             <div className="row mb-3">
//                 {/* Video Section */}
//                 <div className="col-lg-6 position-relative">
//                     <div className="bg-white shadow rounded overflow-hidden">
//                         <div className="p-2 border-bottom bg-dark text-white">Candidate Video</div>
//                         <div className="position-relative" ref={remoteVideoRef} style={{ height: '400px' }} />
//                     </div>

//                     {/* Local video in bottom right */}
//                     <div
//                         ref={localVideoRef}
//                         className="position-absolute rounded shadow border"
//                         style={{
//                             width: '150px',
//                             height: '110px',
//                             bottom: '10px',
//                             right: '10px',
//                             zIndex: 10,
//                             background: '#000',
//                             overflow: 'hidden',
//                         }}
//                     />
//                 </div>

//                 {/* Code Editor */}
//                 <div className="col-lg-6 mb-3">
//                     <div className="bg-white shadow rounded h-100 d-flex flex-column">
//                         <div className="p-2 border-bottom bg-dark text-white">Code Editor</div>
//                         <div className="flex-grow-1">
//                             <Editor height="400px" defaultLanguage="javascript" defaultValue="// Start coding..." />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Controls + Chat */}
//             <div className="row">
//                 {/* Controls */}
//                 <div className="col-md-8 mb-3">
//                     <div className="bg-white p-3 rounded shadow d-flex flex-wrap gap-2 align-items-center">
//                         <button className="btn btn-outline-primary" onClick={toggleAudio}>
//                             {isAudioEnabled ? 'Mute' : 'Unmute'}
//                         </button>
//                         <button className="btn btn-outline-primary" onClick={toggleVideo}>
//                             {isVideoEnabled ? 'Stop Camera' : 'Start Camera'}
//                         </button>
//                         <button
//                             className={`btn btn-outline-${isScreenSharing ? 'danger' : 'success'}`}
//                             onClick={isScreenSharing ? stopScreenShare : startScreenShare}
//                         >
//                             {isScreenSharing ? 'Stop Share' : 'Share Screen'}
//                         </button>
//                         <button className="btn btn-outline-secondary" onClick={toggleFullScreen}>
//                             {fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
//                         </button>
//                         <button className="btn btn-danger ms-auto" onClick={leaveRoom}>
//                             Leave Meeting
//                         </button>
//                     </div>
//                 </div>

//                 {/* Chat */}
//                 <div className="col-md-4 mb-3">
//                     <div className="bg-white rounded shadow d-flex flex-column h-100">
//                         <div className="p-2 border-bottom bg-dark text-white">Chat</div>
//                         <div className="flex-grow-1 p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                             {messages.map((msg, idx) => (
//                                 <div key={idx} className="mb-1">
//                                     <strong>{msg.sender}: </strong>{msg.text}
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="input-group p-2 border-top">
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 placeholder="Type message..."
//                                 value={chatInput}
//                                 onChange={e => setChatInput(e.target.value)}
//                                 onKeyDown={e => e.key === 'Enter' && sendMessage()}
//                             />
//                             <button className="btn btn-primary" onClick={sendMessage}>
//                                 Send
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InterviewRoom3;




import React, { useEffect, useRef, useState } from 'react';
import { connect, createLocalVideoTrack } from 'twilio-video';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useAuthContext } from '../../../context/auth-context';

const InterviewRoom3 = ({ interviewId }) => {

    const { server, user } = useAuthContext();
    const identity = `${user.role}-${user.fullname}`;
    const token = localStorage.getItem("token");

    const [room, setRoom] = useState(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [fullscreen, setFullscreen] = useState(false);

    const localVideoRef = useRef(null);
    const mainVideoRef = useRef(null);
    const remoteSmallVideoRef = useRef(null);
    const screenTrackRef = useRef(null);

    useEffect(() => {
        const joinRoom = async () => {
            const res = await axios.post(`${server}/api/v1/interviews/video/token`, {
                identity,
                room: interviewId
            }, { headers: { Authorization: `Bearer ${token}` } });

            const connectOptions = {
                name: interviewId,
                bandwidthProfile: {
                    video: {
                        mode: 'collaboration',
                        maxTracks: 10,
                        renderDimensions: {
                            high: { width: 1280, height: 720 },
                            standard: { width: 640, height: 480 },
                            low: { width: 320, height: 240 }
                        }
                    }
                },
                preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
                networkQuality: { local: 1, remote: 1 }
            };
            const room = await connect(res.data.token, connectOptions);
            setRoom(room);

            const localTrack = await createLocalVideoTrack();
            localVideoRef.current.innerHTML = '';
            localVideoRef.current.appendChild(localTrack.attach());

            // Attach already connected participants
            room.participants.forEach(participant => {
                handleParticipant(participant);
            });

            room.on('participantConnected', participant => {
                handleParticipant(participant);
            });
        };

        const handleParticipant = (participant) => {
            participant.tracks.forEach(publication => {
                if (publication.isSubscribed) {
                    attachTrack(publication.track);
                }
            });

            participant.on('trackSubscribed', track => {
                attachTrack(track);
            });
        };

        const attachTrack = (track) => {
            const element = track.attach();
            element.style.width = '100%';

            if (track.kind === 'video') {
                if (isScreenSharing) {
                    remoteSmallVideoRef.current.innerHTML = '';
                    remoteSmallVideoRef.current.appendChild(element);
                } else {
                    mainVideoRef.current.innerHTML = '';
                    mainVideoRef.current.appendChild(element);
                }
            }
        };

        joinRoom();

        return () => {
            if (room) room.disconnect();
        };
    }, [token, interviewId, isScreenSharing]);

    const toggleAudio = () => {
        room.localParticipant.audioTracks.forEach(pub => {
            pub.track.enable(!isAudioEnabled);
        });
        setIsAudioEnabled(prev => !prev);
    };

    const toggleVideo = () => {
        room.localParticipant.videoTracks.forEach(pub => {
            pub.track.enable(!isVideoEnabled);
        });
        setIsVideoEnabled(prev => !prev);
    };

    const startScreenShare = async () => {
        const stream = await navigator.mediaDevices.getDisplayMedia();
        const screenTrack = stream.getTracks()[0];
        screenTrackRef.current = screenTrack;

        room.localParticipant.publishTrack(screenTrack);
        const screenElement = screenTrack.attach();
        screenElement.style.width = '100%';

        mainVideoRef.current.innerHTML = '';
        mainVideoRef.current.appendChild(screenElement);

        screenTrack.onended = () => {
            stopScreenShare();
        };

        setIsScreenSharing(true);
    };

    const stopScreenShare = () => {
        if (screenTrackRef.current) {
            room.localParticipant.unpublishTrack(screenTrackRef.current);
            screenTrackRef.current.stop();
            screenTrackRef.current = null;
        }
        setIsScreenSharing(false);
        mainVideoRef.current.innerHTML = '';
    };

    const toggleFullScreen = () => {
        const el = document.documentElement;
        if (!fullscreen) {
            el.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setFullscreen(!fullscreen);
    };

    const leaveRoom = () => {
        room.disconnect();
        window.location.href = '/';
    };

    const sendMessage = () => {
        if (!chatInput.trim()) return;
        setMessages(prev => [...prev, { sender: 'You', text: chatInput }]);
        setChatInput('');
    };

    return (
        <div className="container-fluid py-3 bg-light">
            <div className="row mb-3">
                {/* Main Video */}
                <div className="col-lg-6 position-relative">
                    <div className="bg-white shadow rounded overflow-hidden">
                        <div className="p-2 border-bottom bg-dark text-white">
                            {isScreenSharing ? 'Screen Share' : 'Candidate Video'}
                        </div>
                        <div
                            className="position-relative"
                            ref={mainVideoRef}
                            style={{ height: '400px', background: '#000' }}
                        />
                    </div>

                    {/* Small remote video if screen is shared */}
                    {isScreenSharing && (
                        <div
                            ref={remoteSmallVideoRef}
                            className="position-absolute border shadow rounded"
                            style={{
                                width: '150px',
                                height: '110px',
                                bottom: '130px',
                                right: '10px',
                                background: '#000',
                                zIndex: 10,
                                overflow: 'hidden',
                            }}
                        />
                    )}

                    {/* Local Video Bottom Right */}
                    <div
                        ref={localVideoRef}
                        className="position-absolute border shadow rounded"
                        style={{
                            width: '150px',
                            height: '110px',
                            bottom: '10px',
                            right: '10px',
                            background: '#000',
                            zIndex: 10,
                            overflow: 'hidden',
                        }}
                    />
                </div>

                {/* Code Editor */}
                <div className="col-lg-6 mb-3">
                    <div className="bg-white shadow rounded h-100 d-flex flex-column">
                        <div className="p-2 border-bottom bg-dark text-white">Code Editor</div>
                        <div className="flex-grow-1">
                            <Editor height="400px" defaultLanguage="javascript" defaultValue="// Start coding..." />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls + Chat */}
            <div className="row">
                {/* Controls */}
                <div className="col-md-8 mb-3">
                    <div className="bg-white p-3 rounded shadow d-flex flex-wrap gap-2 align-items-center">
                        <button className="btn btn-outline-primary" onClick={toggleAudio}>
                            {isAudioEnabled ? 'Mute' : 'Unmute'}
                        </button>
                        <button className="btn btn-outline-primary" onClick={toggleVideo}>
                            {isVideoEnabled ? 'Stop Camera' : 'Start Camera'}
                        </button>
                        <button
                            className={`btn btn-outline-${isScreenSharing ? 'danger' : 'success'}`}
                            onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                        >
                            {isScreenSharing ? 'Stop Share' : 'Share Screen'}
                        </button>
                        <button className="btn btn-outline-secondary" onClick={toggleFullScreen}>
                            {fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        </button>
                        <button className="btn btn-danger ms-auto" onClick={leaveRoom}>
                            Leave Meeting
                        </button>
                    </div>
                </div>

                {/* Chat */}
                <div className="col-md-4 mb-3">
                    <div className="bg-white rounded shadow d-flex flex-column h-100">
                        <div className="p-2 border-bottom bg-dark text-white">Chat</div>
                        <div className="flex-grow-1 p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} className="mb-1">
                                    <strong>{msg.sender}: </strong>{msg.text}
                                </div>
                            ))}
                        </div>
                        <div className="input-group p-2 border-top">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type message..."
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            />
                            <button className="btn btn-primary" onClick={sendMessage}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewRoom3;


