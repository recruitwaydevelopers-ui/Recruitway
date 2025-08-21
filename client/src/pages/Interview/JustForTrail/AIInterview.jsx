// // AIInterview.jsx
// import React, { useEffect, useState, useRef } from 'react';

// const AIInterview = () => {
//     const [chatMessages, setChatMessages] = useState([
//         { from: 'ai', text: "Hello! Welcome to your technical interview. I'll be asking you a series of questions to assess your skills. Let's get started with the first question." },
//         { from: 'ai', text: 'The AI interviewer is being initialized. Please wait a moment...' }
//     ]);
//     const [inputDisabled, setInputDisabled] = useState(true);
//     const [codeDisabled, setCodeDisabled] = useState(true);
//     const [sendDisabled, setSendDisabled] = useState(true);
//     const [submitDisabled, setSubmitDisabled] = useState(true);
//     const [code, setCode] = useState('');
//     const [language, setLanguage] = useState('javascript');
//     const [evaluation, setEvaluation] = useState(null);
//     const [timer, setTimer] = useState('00:00:00');
//     const [startTime, setStartTime] = useState(null);
//     const [interviewId, setInterviewId] = useState(null);

//     const chatEndRef = useRef(null);

//     useEffect(() => {
//         const params = new URLSearchParams(window.location.search);
//         const id = params.get('id');
//         if (!id) {
//             setChatMessages(prev => [...prev, { from: 'ai', text: 'No interview ID provided. Please use a valid interview link.' }]);
//         } else {
//             setInterviewId(id);
//             initializeInterview(id);
//         }
//     }, []);

//     useEffect(() => {
//         chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [chatMessages]);

//     useEffect(() => {
//         if (!startTime) return;
//         const interval = setInterval(() => {
//             const now = new Date();
//             const diff = now - startTime;
//             const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
//             const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
//             const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
//             setTimer(`${h}:${m}:${s}`);
//         }, 1000);
//         return () => clearInterval(interval);
//     }, [startTime]);

//     const initializeInterview = async (id) => {
//         try {
//             const response = await fetch(`/api/interviews/${id}`);
//             if (!response.ok) throw new Error('Interview not found');
//             const interview = await response.json();

//             if (interview.status === 'scheduled') {
//                 await fetch(`/api/interviews/${id}/status`, {
//                     method: 'PATCH',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ status: 'in-progress' })
//                 });
//             }

//             setStartTime(new Date());
//             setChatMessages(prev => [...prev, { from: 'ai', text: "Connection established! I'll be asking you a series of technical questions to assess your skills. Let's begin." }]);
//             setTimeout(() => {
//                 setChatMessages(prev => [...prev, { from: 'ai', text: 'Tell me about your experience with web development technologies like React, Node.js, and databases.' }]);
//                 setInputDisabled(false);
//                 setSendDisabled(false);
//             }, 1000);
//         } catch (err) {
//             console.error(err);
//             setChatMessages(prev => [...prev, { from: 'ai', text: 'Error: Failed to initialize interview. Please refresh the page or contact support.' }]);
//         }
//     };

//     const handleSend = async () => {
//         const userInput = document.getElementById('userInput').value;
//         if (!userInput) return;
//         setChatMessages(prev => [...prev, { from: 'user', text: userInput }]);
//         document.getElementById('userInput').value = '';
//         try {
//             const res = await fetch('/api/interview-process', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     interviewId,
//                     question: '...',
//                     answer: userInput
//                 })
//             });
//             const result = await res.json();
//             if (result.evaluation) setChatMessages(prev => [...prev, { from: 'ai', text: result.evaluation }]);
//             if (result.nextQuestion) {
//                 if (result.requiresCode) {
//                     setCodeDisabled(false);
//                     setSubmitDisabled(false);
//                     setChatMessages(prev => [...prev, { from: 'ai', text: 'This question requires you to write code. Please use the code editor on the right.' }]);
//                 }
//                 setTimeout(() => setChatMessages(prev => [...prev, { from: 'ai', text: result.nextQuestion }]), 1000);
//             } else {
//                 setChatMessages(prev => [...prev, { from: 'ai', text: 'Thank you for completing the interview. Your results are being processed.' }]);
//                 setInputDisabled(true);
//                 setSendDisabled(true);
//                 setCodeDisabled(true);
//                 setSubmitDisabled(true);
//                 await fetch(`/api/interviews/${interviewId}/status`, {
//                     method: 'PATCH',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ status: 'completed' })
//                 });
//             }
//         } catch (err) {
//             console.error(err);
//             setChatMessages(prev => [...prev, { from: 'ai', text: 'Error: Failed to process your answer. Please try again.' }]);
//         }
//     };

//     const handleSubmitCode = async () => {
//         try {
//             const res = await fetch('/api/code-evaluation', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     language,
//                     task: '...',
//                     code
//                 })
//             });
//             const result = await res.json();
//             setEvaluation(result.evaluation);
//             setChatMessages(prev => [...prev, { from: 'ai', text: `I've evaluated your code. Score: ${result.evaluation.score}/10. ${result.evaluation.feedback}` }]);
//             setTimeout(() => handleSend(), 3000);
//         } catch (err) {
//             console.error(err);
//             setChatMessages(prev => [...prev, { from: 'ai', text: 'Error: Failed to evaluate your code. Please try again.' }]);
//         }
//     };

//     return (
//         <div className="font-sans bg-gray-100 min-h-screen">
//             <header className="bg-white shadow py-4 mb-6">
//                 <div className="container mx-auto px-4 flex justify-between items-center">
//                     <a href="#" className="text-indigo-600 text-2xl font-bold">AI Technical Interview</a>
//                     <div className="text-lg font-semibold">{timer}</div>
//                 </div>
//             </header>

//             <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-6">
//                 <div className="bg-white rounded shadow p-4">
//                     <h2 className="text-xl font-semibold mb-4">Chat with AI Interviewer</h2>
//                     <div className="flex flex-col h-96">
//                         <div className="flex-1 overflow-y-auto bg-gray-50 p-3 rounded">
//                             {chatMessages.map((msg, i) => (
//                                 <div key={i} className={`mb-2 p-2 rounded w-fit ${msg.from === 'ai' ? 'bg-gray-200 text-black' : 'bg-indigo-600 text-white ml-auto'}`}>
//                                     <p>{msg.text}</p>
//                                 </div>
//                             ))}
//                             <div ref={chatEndRef}></div>
//                         </div>
//                         <div className="flex mt-3">
//                             <textarea id="userInput" className="flex-1 border rounded p-2 text-sm" placeholder="Type your answer here..." disabled={inputDisabled}></textarea>
//                             <button className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded" disabled={sendDisabled} onClick={handleSend}>Send</button>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded shadow p-4">
//                     <h2 className="text-xl font-semibold mb-4">Code Editor</h2>
//                     <textarea
//                         className="w-full h-64 border rounded p-2 font-mono text-sm mb-2"
//                         placeholder="// Write your code here when prompted..."
//                         disabled={codeDisabled}
//                         value={code}
//                         onChange={(e) => setCode(e.target.value)}
//                     ></textarea>
//                     <div className="flex justify-between items-center">
//                         <select className="border rounded px-2 py-1" disabled={codeDisabled} value={language} onChange={(e) => setLanguage(e.target.value)}>
//                             <option value="javascript">JavaScript</option>
//                             <option value="python">Python</option>
//                             <option value="java">Java</option>
//                             <option value="csharp">C#</option>
//                         </select>
//                         <button className="bg-indigo-600 text-white px-4 py-2 rounded" disabled={submitDisabled} onClick={handleSubmitCode}>Submit Code</button>
//                     </div>

//                     {evaluation && (
//                         <div className="mt-4 border-l-4 border-indigo-600 bg-gray-50 p-3 rounded">
//                             <h3 className="font-semibold mb-2">Code Evaluation</h3>
//                             <p><strong>Score:</strong> {evaluation.score}/10</p>
//                             <p><strong>Feedback:</strong> {evaluation.feedback}</p>
//                             <div>
//                                 <strong>Strengths:</strong>
//                                 <ul className="list-disc ml-5 text-green-600">
//                                     {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
//                                 </ul>
//                             </div>
//                             <div>
//                                 <strong>Areas for Improvement:</strong>
//                                 <ul className="list-disc ml-5 text-red-600">
//                                     {evaluation.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
//                                 </ul>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AIInterview;


import React, { useEffect, useState, useRef } from 'react';

const AIInterview = () => {
    const [chatMessages, setChatMessages] = useState([
        { from: 'ai', text: "Hello! Welcome to your technical interview. I'll be asking you a series of questions to assess your skills. Let's get started with the first question." },
        { from: 'ai', text: 'The AI interviewer is being initialized. Please wait a moment...' }
    ]);
    const [inputDisabled, setInputDisabled] = useState(true);
    const [codeDisabled, setCodeDisabled] = useState(true);
    const [sendDisabled, setSendDisabled] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [evaluation, setEvaluation] = useState(null);
    const [timer, setTimer] = useState('00:00:00');
    const [startTime, setStartTime] = useState(null);
    const [interviewId, setInterviewId] = useState(null);

    const chatEndRef = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        console.log(id);
        
        if (!id) {
            setChatMessages(prev => [...prev, { from: 'ai', text: 'No interview ID provided. Please use a valid interview link.' }]);
        } else {
            setInterviewId(id);
            initializeInterview(id);
        }
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    useEffect(() => {
        if (!startTime) return;
        const interval = setInterval(() => {
            const now = new Date();
            const diff = now - startTime;
            const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
            const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
            const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
            setTimer(`${h}:${m}:${s}`);
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    const initializeInterview = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/api/interviews/${id}`);
            if (!response.ok) throw new Error('Interview not found');
            const interview = await response.json();

            if (interview.status === 'scheduled') {
                await fetch(`http://localhost:4000/api/interviews/${id}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'in-progress' })
                });
            }

            setStartTime(new Date());
            setChatMessages(prev => [...prev, { from: 'ai', text: "Connection established! I'll be asking you a series of technical questions to assess your skills. Let's begin." }]);
            setTimeout(() => {
                setChatMessages(prev => [...prev, { from: 'ai', text: 'Tell me about your experience with web development technologies like React, Node.js, and databases.' }]);
                setInputDisabled(false);
                setSendDisabled(false);
            }, 1000);
        } catch (err) {
            console.error(err);
            setChatMessages(prev => [...prev, { from: 'ai', text: 'Error: Failed to initialize interview. Please refresh the page or contact support.' }]);
        }
    };

    const handleSend = async () => {
        const userInput = document.getElementById('userInput').value;
        if (!userInput) return;
        setChatMessages(prev => [...prev, { from: 'user', text: userInput }]);
        document.getElementById('userInput').value = '';
        try {
            const res = await fetch('http://localhost:4000/api/interview-process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    interviewId,
                    question: '...',
                    answer: userInput
                })
            });
            const result = await res.json();
            if (result.evaluation) setChatMessages(prev => [...prev, { from: 'ai', text: result.evaluation }]);
            if (result.nextQuestion) {
                if (result.requiresCode) {
                    setCodeDisabled(false);
                    setSubmitDisabled(false);
                    setChatMessages(prev => [...prev, { from: 'ai', text: 'This question requires you to write code. Please use the code editor on the right.' }]);
                }
                setTimeout(() => setChatMessages(prev => [...prev, { from: 'ai', text: result.nextQuestion }]), 1000);
            } else {
                setChatMessages(prev => [...prev, { from: 'ai', text: 'Thank you for completing the interview. Your results are being processed.' }]);
                setInputDisabled(true);
                setSendDisabled(true);
                setCodeDisabled(true);
                setSubmitDisabled(true);
                await fetch(`http://localhost:4000/api/interviews/${interviewId}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'completed' })
                });
            }
        } catch (err) {
            console.error(err);
            setChatMessages(prev => [...prev, { from: 'ai', text: 'Error: Failed to process your answer. Please try again.' }]);
        }
    };

    const handleSubmitCode = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/code-evaluation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language,
                    task: '...',
                    code
                })
            });
            const result = await res.json();
            setEvaluation(result.evaluation);
            setChatMessages(prev => [...prev, { from: 'ai', text: `I've evaluated your code. Score: ${result.evaluation.score}/10. ${result.evaluation.feedback}` }]);
            setTimeout(() => handleSend(), 3000);
        } catch (err) {
            console.error(err);
            setChatMessages(prev => [...prev, { from: 'ai', text: 'Error: Failed to evaluate your code. Please try again.' }]);
        }
    };

    return (
        <div className="bg-light min-vh-100">
            <header className="bg-white shadow-sm py-3 mb-4">
                <div className="container d-flex justify-content-between align-items-center">
                    <a href="#" className="text-primary h4 mb-0 text-decoration-none">AI Technical Interview</a>
                    <div className="fs-5 fw-semibold">{timer}</div>
                </div>
            </header>

            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-6">
                        <div className="bg-white rounded shadow-sm p-3">
                            <h2 className="h5 mb-3">Chat with AI Interviewer</h2>
                            <div className="d-flex flex-column" style={{ height: '24rem' }}>
                                <div className="flex-grow-1 overflow-auto bg-light p-2 rounded border mb-3">
                                    {chatMessages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`mb-2 p-2 rounded ${msg.from === 'ai' ? 'bg-secondary text-white' : 'bg-primary text-white text-end'}`}>
                                            <p className="mb-0">{msg.text}</p>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef}></div>
                                </div>
                                <div className="d-flex">
                                    <textarea
                                        id="userInput"
                                        className="form-control me-2"
                                        placeholder="Type your answer here..."
                                        disabled={inputDisabled}
                                    />
                                    <button className="btn btn-primary" disabled={sendDisabled} onClick={handleSend}>Send</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="bg-white rounded shadow-sm p-3">
                            <h2 className="h5 mb-3">Code Editor</h2>
                            <textarea
                                className="form-control mb-3"
                                rows="10"
                                placeholder="// Write your code here when prompted..."
                                disabled={codeDisabled}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <div className="d-flex justify-content-between align-items-center">
                                <select className="form-select w-50 me-3" disabled={codeDisabled} value={language} onChange={(e) => setLanguage(e.target.value)}>
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="csharp">C#</option>
                                </select>
                                <button className="btn btn-primary" disabled={submitDisabled} onClick={handleSubmitCode}>Submit Code</button>
                            </div>

                            {evaluation && (
                                <div className="mt-4 border-start border-4 border-primary bg-light p-3 rounded">
                                    <h5 className="fw-bold mb-2">Code Evaluation</h5>
                                    <p><strong>Score:</strong> {evaluation.score}/10</p>
                                    <p><strong>Feedback:</strong> {evaluation.feedback}</p>
                                    <div>
                                        <strong>Strengths:</strong>
                                        <ul className="text-success ps-3">
                                            {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <strong>Areas for Improvement:</strong>
                                        <ul className="text-danger ps-3">
                                            {evaluation.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIInterview;

