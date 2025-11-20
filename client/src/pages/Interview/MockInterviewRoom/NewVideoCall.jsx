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

                if (response.screen === 'interviewer') {
                    const destination = '/interviewer/mock-interviews'
                    navigate(destination);
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
                const res = await axios.post(`${server}/api/v1/interviews/mock-updateStatus`,
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