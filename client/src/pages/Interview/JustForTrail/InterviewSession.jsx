import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Editor from '@monaco-editor/react';

const InterviewSession = () => {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [showCodeEditor, setShowCodeEditor] = useState(false);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [codeTask, setCodeTask] = useState('');
    const [isConnecting, setIsConnecting] = useState(true);
    const [isAiThinking, setIsAiThinking] = useState(false);

    const wsRef = useRef(null);
    const messagesEndRef = useRef(null);

    const fetchInterview = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/interviews/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching interview:", error);
            toast.error("Failed to fetch interview details.");
        }
    };

    useEffect(() => {
        const getInterview = async () => {
            // const interview = await fetchInterview();
            const interview = {
                id: "int-9482",
                date: "2025-04-20",
                startTime: "10:00",
                endTime: "10:45",
                status: "scheduled",
                meetingLink: "https://zoom.us/j/948273645",
                meetingLinkSent: true,
                candidate: {
                    id: "cand-573",
                    name: "Alicia Monroe",
                    email: "alicia.monroe@example.com",
                    phone: "+1 (555) 123-4567",
                    resumeUrl: "https://example.com/resumes/alicia-monroe.pdf",
                    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg"
                },
                position: {
                    id: "pos-302",
                    title: "Frontend Developer",
                    department: "Engineering"
                }
            };

            if (interview) {
                setMessages([
                    {
                        role: 'system',
                        content: `Interview session started for ${interview.candidate.name} (${interview.position.title}).`
                    },
                    {
                        role: 'ai',
                        content: `Hello! I'm your AI interviewer for the ${interview.position.title} position. Let's get started with the first question: Could you introduce yourself and tell me about your background in ${interview.position.title.toLowerCase()} roles?`
                    }
                ]);

                const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}/${window.location.host}`);

                ws.onopen = () => {
                    console.log('WebSocket connection established');
                    setIsConnecting(false);
                };

                ws.onmessage = (event) => {
                    const response = JSON.parse(event.data);

                    if (response.type === 'interview_response') {
                        setMessages((prev) => [
                            ...prev,
                            { role: 'ai', content: response.data.evaluation || 'Thank you for your response.' },
                            { role: 'ai', content: response.data.nextQuestion || 'Let\'s move on to the next question.' }
                        ]);

                        if (response.data.requiresCode) {
                            setShowCodeEditor(true);
                            setCodeTask(response.data.nextQuestion);
                        } else {
                            setShowCodeEditor(false);
                        }

                        setIsAiThinking(false);
                    } else if (response.type === 'code_evaluation') {
                        setMessages((prev) => [
                            ...prev,
                            { role: 'ai', content: response.data.evaluation || 'Thank you for your code.' }
                        ]);

                        if (response.data.points?.length) {
                            const pointsMessage = response.data.points
                                .map((point) =>
                                    `${point.type === 'positive' ? '✓' : point.type === 'warning' ? '⚠' : '✗'} ${point.text}`
                                ).join('\n');

                            setMessages((prev) => [...prev, { role: 'ai', content: pointsMessage }]);
                        }

                        setMessages((prev) => [
                            ...prev,
                            { role: 'ai', content: 'Let\'s move on to the next question. Can you tell me about your experience with...' }
                        ]);

                        setShowCodeEditor(false);
                        setIsAiThinking(false);
                    } else if (response.type === 'error') {
                        toast.error(response.message || 'An error occurred');
                        setIsAiThinking(false);
                    }
                };

                ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    toast.error('Failed to connect to interview server');
                    setIsConnecting(false);
                };

                ws.onclose = () => console.log('WebSocket connection closed');

                wsRef.current = ws;
            }
        };

        getInterview();

        return () => {
            wsRef.current?.close();
        };
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (userInput.trim() === '') return;

        setMessages((prev) => [...prev, { role: 'user', content: userInput }]);

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            setIsAiThinking(true);
            wsRef.current.send(JSON.stringify({
                type: 'interview_question_answer',
                interviewId: id,
                question: messages[messages.length - 1]?.content,
                answer: userInput
            }));
        } else {
            toast.error('Not connected to the interview server');
        }

        setUserInput('');
    };

    const handleSubmitCode = () => {
        if (code.trim() === '') return;

        setMessages((prev) => [...prev, { role: 'user', content: code, isCode: true }]);

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            setIsAiThinking(true);
            wsRef.current.send(JSON.stringify({
                type: 'code_answer',
                language,
                task: codeTask,
                code
            }));
        } else {
            toast.error('Not connected to the interview server');
        }

        setCode('');
    };

    if (!messages.length) {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100">
                <div className="spinner-border text-primary" role="status" />
            </div>
        );
    }

    return (
        <div className="d-flex flex-column vh-100">
            <header className="bg-white shadow-sm border-bottom py-3">
                <div className="container d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 text-primary">AI Interview Session</h4>
                </div>
            </header>

            <div className="flex-grow-1 overflow-auto bg-light">
                <div className="container py-3">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`d-flex mb-2 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className={`p-3 rounded ${msg.role === 'system'
                                ? 'bg-secondary text-white'
                                : msg.role === 'user'
                                    ? 'bg-primary text-white'
                                    : 'bg-white border'}`}
                                style={{ maxWidth: '80%' }}
                            >
                                {msg.isCode
                                    ? <pre className="mb-0 text-monospace">{msg.content}</pre>
                                    : <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>}
                            </div>
                        </div>
                    ))}

                    {isAiThinking && (
                        <div className="d-flex justify-content-start mb-2">
                            <div className="p-2 bg-white border rounded d-flex gap-2">
                                <div className="spinner-grow spinner-grow-sm text-muted"></div>
                                <div className="spinner-grow spinner-grow-sm text-muted"></div>
                                <div className="spinner-grow spinner-grow-sm text-muted"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef}></div>
                </div>
            </div>

            <div className="border-top bg-white p-3">
                <div className="container">
                    {showCodeEditor ? (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-code-slash me-2"></i>
                                    <h6 className="mb-0">Code Editor</h6>
                                </div>
                                <div className="d-flex gap-2">
                                    <select className="form-select form-select-sm" value={language} onChange={(e) => setLanguage(e.target.value)}>
                                        <option value="javascript">JavaScript</option>
                                        <option value="typescript">TypeScript</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="csharp">C#</option>
                                    </select>
                                    <button className="btn btn-sm btn-primary" onClick={handleSubmitCode}>Submit Code</button>
                                </div>
                            </div>
                            <div className="border rounded overflow-hidden" style={{ height: '320px' }}>
                                <Editor
                                    height="100%"
                                    language={language}
                                    value={code}
                                    onChange={(value) => setCode(value || '')}
                                    theme="vs-dark"
                                    options={{ minimap: { enabled: false }, fontSize: 14 }}
                                />
                            </div>
                        </>
                    ) : (
                        <div>
                            <textarea
                                className="form-control"
                                placeholder="Type your response..."
                                rows={4}
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.ctrlKey && e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <small className="text-muted">Press Ctrl+Enter to send</small>
                                <button className="btn btn-primary" onClick={handleSendMessage}>
                                {/* <button className="btn btn-primary" onClick={handleSendMessage} disabled={userInput.trim() === '' || isConnecting || isAiThinking}> */}
                                    <i className="bi bi-send me-1"></i>Send
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewSession;

