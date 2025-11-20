import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import CodeEditor from './CodeEditor';
import ReportForm from './ReportForm';
import { useAuthContext } from '../../../context/auth-context';
import axios from 'axios';
import toast from 'react-hot-toast';

const RoomPageWithZegoCloud = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { response } = location.state || {};
    const { user, server, socket, token } = useAuthContext();

    const zpInstance = useRef(null);
    const [users, setUsers] = useState([]);
    const [showReportForm, setShowReportForm] = useState(false);

    // Memoized IDs based on response context
    const { firstId, secondId } = useMemo(() => {
        if (!response) return { firstId: null, secondId: null };

        const { source, screen, interviewDetails } = response;

        return {
            firstId: source === 'Byjobpost'
                ? user?.userId
                : screen === 'interviewer'
                    ? interviewDetails?.interviewerId
                    : interviewDetails?.cvId,
            secondId: source === 'Byjobpost'
                ? user?.fullname
                : screen === 'interviewer'
                    ? interviewDetails?.interviewerName
                    : interviewDetails?.candidateName,
        };
    }, [response, user]);

    // Handle video meeting
    const myMeeting = useCallback(
        async (element) => {
            if (!element || !firstId || !roomId) return;

            const appID = 1195136988;
            const serverSecret = '9a22edcaca9c34bd3111176b2bb0f92d';

            try {
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    appID,
                    serverSecret,
                    roomId,
                    firstId,
                    secondId || 'Anonymous'
                );

                const zp = ZegoUIKitPrebuilt.create(kitToken);
                zpInstance.current = zp;

                zp.joinRoom({
                    container: element,
                    sharedLinks: [
                        {
                            name: 'Personal link',
                            url: `${window.location.origin}${window.location.pathname}?roomID=${roomId}`,
                        },
                    ],
                    scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
                    turnOnMicrophoneWhenJoining: true,
                    turnOnCameraWhenJoining: true,
                    showPreJoinView: true,
                    showScreenSharingButton: true,
                    showRoomTimer: true,
                    onLeaveRoom: () => {
                        if (!response?.source) {
                            window.close();
                            return;
                        }

                        if (response.source === 'Byjobpost') {
                            const destination = user?.role === 'interviewer'
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
                navigate('/error', { state: { error: 'Failed to initialize video call' } });
            }
        },
        [roomId, firstId, secondId, user, navigate, response]
    );

    const getUserViewClass = useMemo(() => {
        if (!response?.screen) return 'default-view';

        return {
            'interviewer': 'interviewer-view',
            'random-candidate': 'random-candidate-view',
            'candidate': 'candidate-view',
        }[response.screen] || 'default-view';
    }, [response?.screen]);

    useEffect(() => {
        const updateInterviewStatus = async () => {
            try {
                const response = await axios.post(`${server}/api/v1/interviews/updateStatus`,
                    { interviewId: roomId },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.screen === 'interviewer') {
                    toast.success(response.data.message);
                }
            } catch (error) {
                console.error('Error updating interview status:', error);
                const errMsg =
                    error.response?.data?.message || 'Failed to update interview status.';
                if (response.screen === 'interviewer') {
                    toast.error(errMsg);
                }
            }
        };

        // if (users.length >= 1) {
        //     updateInterviewStatus();
        // }
    }, [users, roomId, server, token]);

    return (
        <div className="room-container">
            <div className={`main-content ${getUserViewClass}`}>
                <div className="video-editor-container">
                    <div className="video-container left-panel" ref={myMeeting} />
                    <CodeEditor
                        onShowReport={() => user?.role === 'interviewer' && setShowReportForm(true)}
                        isInterviewer={user?.role === 'interviewer'}
                        setUsers={setUsers}
                        socket={socket}
                        userId={firstId}
                        userName={secondId}
                        roomId={roomId}
                    />
                </div>
            </div>

            {showReportForm && (
                <ReportForm
                    isVisible={showReportForm}
                    onClose={() => setShowReportForm(false)}
                    roomId={roomId}
                    token={token}
                    server={server}
                />
            )}

            <style jsx>{`
                .room-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    width: 100vw;
                    overflow: hidden;
                    background-color: #f5f7fa;
                }

                .main-content {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                }

                .video-editor-container {
                    display: flex;
                    width: 100%;
                    height: calc(100% - 60px);
                }

                .video-container {
                    flex: 0 0 60%;
                    height: 100%;
                    background-color: #2d3748;
                    min-width: 0; /* Prevent flex overflow */
                }

                @media (max-width: 768px) {
                    .video-editor-container {
                        flex-direction: column;
                    }

                    .video-container {
                        flex: 0 0 50%;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default RoomPageWithZegoCloud;
