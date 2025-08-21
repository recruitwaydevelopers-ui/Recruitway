import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const CandidateInterview = () => {
    const { id } = useParams();
    // const [interview, setInterview] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [showCodeEditor, setShowCodeEditor] = useState(false);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [codeTask, setCodeTask] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [interviewStarted, setInterviewStarted] = useState(false);

    const wsRef = useRef(null);
    const messagesEndRef = useRef(null);

    // useEffect(() => {
    //     const fetchInterview = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:4000/api/interviews/${id}`);
    //             const interviewData = response.data;
    //             setInterview(interviewData);

    //             setMessages([
    //                 {
    //                     role: 'system',
    //                     content: `Welcome to your interview for the ${interviewData.position.title} position.`,
    //                 },
    //                 {
    //                     role: 'ai',
    //                     content: `Hello ${interviewData.candidate.name}! I'm your AI interviewer for the ${interviewData.position.title} position. When you're ready to begin, please click the "Start Interview" button below.`,
    //                 },
    //             ]);

    //             if (interviewData.status === 'in-progress') {
    //                 setInterviewStarted(true);
    //             }
    //         } catch (error) {
    //             console.error('Failed to load interview', error);
    //             toast.error('Failed to load interview');
    //         }
    //     };

    //     fetchInterview();
    // }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const interview = {
        id: 1,
        candidate: {
            id: 'c001',
            name: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            phone: '+1-202-555-0101',
            resumeUrl: 'https://example.com/resume/alice-johnson.pdf',
            imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg'
        },
        position: {
            id: 'p001',
            title: 'Frontend Developer',
            department: 'Engineering'
        }
    }

    const startInterview = async () => {
        if (!interview) return;

        setInterviewStarted(true);
        setIsConnecting(true);

        // const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`);

        const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
        // const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:3001`;
        console.log('WebSocket URL:', wsUrl);
        const ws = new WebSocket(wsUrl);
        console.log(ws);


        ws.onopen = () => {
            setIsConnecting(false);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'ai',
                    content: `Let's begin. Tell me about your background related to ${interview.position.title}.`,
                },
            ]);
        };

        ws.onmessage = (event) => {
            const response = JSON.parse(event.data);

            if (response.type === 'interview_response') {
                setMessages((prev) => [
                    ...prev,
                    { role: 'ai', content: response.data.evaluation || 'Thanks for your answer.' },
                    { role: 'ai', content: response.data.nextQuestion || 'Next question...' },
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
                    { role: 'ai', content: response.data.evaluation || 'Thanks for your code.' },
                ]);

                if (response.data.points?.length) {
                    const summary = response.data.points
                        .map((point) => `${point.type === 'positive' ? '✓' : point.type === 'warning' ? '⚠' : '✗'} ${point.text}`)
                        .join('\n');

                    setMessages((prev) => [...prev, { role: 'ai', content: summary }]);
                }

                setShowCodeEditor(false);
                setIsAiThinking(false);
            } else if (response.type === 'error') {
                toast.error(response.message || 'An error occurred.');
                setIsAiThinking(false);
            }
        };

        ws.onerror = (err) => {
            console.error(err);
            toast.error('WebSocket connection failed.');
            setIsConnecting(false);
        };

        wsRef.current = ws;

        try {
            await axios.patch(`http://localhost:4000/api/interviews/${id}/status`, { status: 'in-progress' });
        } catch (error) {
            console.error('Status update failed', error);
        }
    };

    const handleSendMessage = () => {
        if (!userInput.trim()) return;

        setMessages((prev) => [...prev, { role: 'user', content: userInput }]);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            setIsAiThinking(true);
            wsRef.current.send(
                JSON.stringify({
                    type: 'interview_question_answer',
                    interviewId: id,
                    question: messages[messages.length - 1]?.content || '',
                    answer: userInput,
                })
            );
        } else {
            toast.error('WebSocket not connected');
        }

        setUserInput('');
    };

    const handleSubmitCode = () => {
        if (!code.trim()) return;

        setMessages((prev) => [...prev, { role: 'user', content: code, isCode: true }]);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            setIsAiThinking(true);
            wsRef.current.send(
                JSON.stringify({
                    type: 'code_answer',
                    language,
                    task: codeTask,
                    code,
                })
            );
        } else {
            toast.error('WebSocket not connected');
        }

        setCode('');
    };

    // if (!interview) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center">
    //             <div className="text-center">
    //                 <i className="ti ti-alert-circle text-red-500 mx-auto mb-2" size={48}></i>
    //                 <h2 className="text-xl font-semibold">Interview Not Found</h2>
    //                 <p className="text-gray-600">The interview does not exist or was removed.</p>
    //             </div>
    //         </div>
    //     );
    // }

    // return (
    //     <div className="flex flex-col h-screen bg-gray-50">
    //         <header className="bg-white shadow p-4 flex justify-between items-center">
    //             <h1 className="text-2xl font-semibold text-blue-600">AI Interview</h1>
    //             <span className="text-sm text-gray-500">Position: {interview?.position?.title}</span>
    //         </header>

    //         <main className="flex-1 overflow-y-auto p-4 space-y-4">
    //             {messages.map((msg, i) => (
    //                 <div
    //                     key={i}
    //                     className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
    //                 >
    //                     <div
    //                         className={`rounded-lg p-3 max-w-xl whitespace-pre-wrap ${msg.role === 'system'
    //                             ? 'bg-gray-300 text-gray-800'
    //                             : msg.role === 'user'
    //                                 ? 'bg-blue-600 text-white'
    //                                 : 'bg-white border'
    //                             }`}
    //                     >
    //                         {msg.isCode ? (
    //                             <pre className="text-sm font-mono overflow-x-auto">{msg.content}</pre>
    //                         ) : (
    //                             <p>{msg.content}</p>
    //                         )}
    //                     </div>
    //                 </div>
    //             ))}

    //             {isAiThinking && (
    //                 <div className="text-sm text-gray-500 italic animate-pulse">AI is thinking...</div>
    //             )}

    //             <div ref={messagesEndRef} />
    //         </main>

    //         <footer className="bg-white p-4 border-t space-y-2">
    //             {!interviewStarted ? (
    //                 <button
    //                     className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium"
    //                     onClick={startInterview}
    //                 >
    //                     Start Interview
    //                 </button>
    //             ) : showCodeEditor ? (
    //                 <div>
    //                     <div className="flex justify-between items-center mb-2">
    //                         <div className="flex items-center space-x-2">
    //                             <i className="ti ti-code" size={20}></i>
    //                             <span className="text-sm font-medium text-gray-600">Code Editor</span>
    //                         </div>
    //                         <div className="flex space-x-2">
    //                             <select
    //                                 className="border rounded px-2 py-1 text-sm"
    //                                 value={language}
    //                                 onChange={(e) => setLanguage(e.target.value)}
    //                             >
    //                                 <option value="javascript">JavaScript</option>
    //                                 <option value="typescript">TypeScript</option>
    //                                 <option value="python">Python</option>
    //                                 <option value="java">Java</option>
    //                                 <option value="csharp">C#</option>
    //                             </select>
    //                             <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleSubmitCode}>
    //                                 Submit Code
    //                             </button>
    //                         </div>
    //                     </div>
    //                     <Editor
    //                         height="300px"
    //                         language={language}
    //                         value={code}
    //                         onChange={(value) => setCode(value || '')}
    //                         theme="vs-dark"
    //                         options={{ minimap: { enabled: false }, fontSize: 14 }}
    //                     />
    //                 </div>
    //             ) : (
    //                 <div>
    //                     <textarea
    //                         className="w-full border rounded p-2 h-24 resize-none"
    //                         placeholder="Type your response..."
    //                         value={userInput}
    //                         onChange={(e) => setUserInput(e.target.value)}
    //                         onKeyDown={(e) => {
    //                             if (e.key === 'Enter' && e.ctrlKey) {
    //                                 handleSendMessage();
    //                             }
    //                         }}
    //                     />
    //                     <div className="flex justify-between items-center mt-2">
    //                         <span className="text-xs text-gray-400">Ctrl+Enter to send</span>
    //                         <button
    //                             className="bg-dark text-white px-4 py-2 rounded flex items-center gap-2"
    //                             onClick={handleSendMessage}
    //                             disabled={!userInput.trim() || isConnecting || isAiThinking}
    //                         >
    //                             <i className="ti ti-send" size={16}></i>
    //                             Send
    //                         </button>
    //                     </div>
    //                 </div>
    //             )}
    //         </footer>

    //         <div className="text-xs text-gray-500 text-center py-2 flex justify-center items-center gap-1 border-t">
    //             <i className="ti ti-monitor" size={14}></i>
    //             Your interview is being recorded for review.
    //         </div>
    //     </div>
    // );


    if (!interview) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="text-center">
                    <i className="ti ti-alert-circle text-danger mb-2" style={{ fontSize: 48 }}></i>
                    <h2 className="h5 fw-bold">Interview Not Found</h2>
                    <p className="text-muted">The interview does not exist or was removed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column vh-100 bg-light">
            <header className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
                <h1 className="h4 text-primary m-0">AI Interview</h1>
                <span className="text-muted small">Position: {interview?.position?.title}</span>
            </header>

            <main className="flex-grow-1 overflow-auto p-3">
                {messages.map((msg, i) => (
                    <div key={i} className={`d-flex mb-2 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div
                            className={`p-2 rounded shadow-sm ${msg.role === 'system'
                                ? 'bg-secondary text-light'
                                : msg.role === 'user'
                                    ? 'bg-primary text-white'
                                    : 'bg-white border'}`}
                            style={{ maxWidth: '75%' }}
                        >
                            {msg.isCode ? (
                                <pre className="mb-0 small">{msg.content}</pre>
                            ) : (
                                <p className="mb-0">{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}

                {isAiThinking && (
                    <div className="text-muted small fst-italic">AI is thinking...</div>
                )}

                <div ref={messagesEndRef} />
            </main>

            <footer className="bg-white p-3 border-top">
                {!interviewStarted ? (
                    <button
                        className="btn btn-primary w-100"
                        onClick={startInterview}
                        disabled={isConnecting}
                    >
                        Start Interview
                    </button>
                ) : showCodeEditor ? (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center gap-2">
                                <i className="ti ti-code me-2"></i>
                                <span className="small text-muted">Code Editor</span>
                            </div>
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select form-select-sm"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="typescript">TypeScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="csharp">C#</option>
                                </select>
                                <button className="btn btn-success btn-sm" onClick={handleSubmitCode}>
                                    Submit Code
                                </button>
                            </div>
                        </div>
                        <Editor
                            height="300px"
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            theme="vs-dark"
                            options={{ minimap: { enabled: false }, fontSize: 14 }}
                        />
                    </div>
                ) : (
                    <>
                        <textarea
                            className="form-control"
                            placeholder="Type your response..."
                            rows={4}
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    handleSendMessage();
                                }
                            }}
                        />
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <small className="text-muted">Ctrl+Enter to send</small>
                            <button
                                className="btn btn-dark btn-sm"
                                onClick={handleSendMessage}
                                disabled={!userInput.trim() || isConnecting || isAiThinking}
                            >
                                <i className="ti ti-send me-1"></i>Send
                            </button>
                        </div>
                    </>
                )}
            </footer>

            <div className="text-center text-muted small py-2 border-top">
                <i className="ti ti-monitor me-1"></i>
                Your interview is being recorded for review.
            </div>
        </div>

    )

};

export default CandidateInterview;
