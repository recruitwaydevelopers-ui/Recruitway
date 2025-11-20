import React, { useState } from 'react';

const OpenAiTest = () => {
    const [testType, setTestType] = useState('interview');
    const [interviewId, setInterviewId] = useState(1);
    const [question, setQuestion] = useState('Tell me about your experience with web development technologies.');
    const [answer, setAnswer] = useState('I have 4 years of experience with React and Node.js...');
    const [language, setLanguage] = useState('javascript');
    const [task, setTask] = useState('Write a function to find the longest substring without repeating characters.');
    const [code, setCode] = useState(`function lengthOfLongestSubstring(s) {\n  let maxLength = 0;\n  let start = 0;\n  const charMap = new Map();\n\n  for (let i = 0; i < s.length; i++) {\n    const char = s[i];\n    if (charMap.has(char) && charMap.get(char) >= start) {\n      start = charMap.get(char) + 1;\n    } else {\n      maxLength = Math.max(maxLength, i - start + 1);\n    }\n    charMap.set(char, i);\n  }\n\n  return maxLength;\n}`);
    const [summaryInterviewId, setSummaryInterviewId] = useState(1);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleTestTypeChange = (e) => {
        setTestType(e.target.value);
        setResult(null);
        setError('');
    };

    const mockApiResponse = () => {
        return {
            status: 'success',
            message: 'Mock API response received.',
            data: Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                value: Math.floor(Math.random() * 100),
                description: `Sample output ${i + 1}`
            }))
        };
    };

    const handleRunTest = async () => {
        try {
            setError('');
            let responseData;

            // Simulate API behavior
            if (testType === 'interview') {
                responseData = mockApiResponse();
            } else if (testType === 'code') {
                responseData = mockApiResponse();
            } else if (testType === 'summary') {
                responseData = mockApiResponse();
            }

            setResult(responseData);
        } catch (err) {
            setError(`Something went wrong: ${err.message}`);
        }
    };

    return (
        <div className="container my-5">
            <div className="bg-white p-4 rounded shadow">
                <h1 className="text-primary mb-4">OpenAI Integration Test</h1>

                <div className="mb-3">
                    <label className="form-label">Select Test Type:</label>
                    <select className="form-select" value={testType} onChange={handleTestTypeChange}>
                        <option value="interview">Process Interview Question</option>
                        <option value="code">Evaluate Code</option>
                        <option value="summary">Generate Interview Summary</option>
                    </select>
                </div>

                {testType === 'interview' && (
                    <div>
                        <div className="mb-3">
                            <label className="form-label">Interview ID:</label>
                            <input
                                type="number"
                                className="form-control"
                                value={interviewId}
                                onChange={(e) => setInterviewId(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Question:</label>
                            <textarea
                                className="form-control"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Answer:</label>
                            <textarea
                                className="form-control"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {testType === 'code' && (
                    <div>
                        <div className="mb-3">
                            <label className="form-label">Programming Language:</label>
                            <select className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="csharp">C#</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Coding Task:</label>
                            <textarea
                                className="form-control"
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Code:</label>
                            <textarea
                                className="form-control"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {testType === 'summary' && (
                    <div className="mb-3">
                        <label className="form-label">Interview ID:</label>
                        <input
                            type="number"
                            className="form-control"
                            value={summaryInterviewId}
                            onChange={(e) => setSummaryInterviewId(e.target.value)}
                        />
                    </div>
                )}

                <button className="btn btn-primary" onClick={handleRunTest}>
                    Run Test
                </button>

                {result && (
                    <div className="result mt-4 border-top pt-4">
                        <h4>Result:</h4>
                        <pre className="bg-light p-3 rounded">{JSON.stringify(result, null, 2)}</pre>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger mt-4" role="alert">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OpenAiTest;
