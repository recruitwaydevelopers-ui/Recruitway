import React, { useState } from 'react';

const Test = () => {
    const [stats, setStats] = useState({
        scheduledCount: '-',
        inProgressCount: '-',
        completedCount: '-',
        cancelledCount: '-',
    });
    const [apiResponse, setApiResponse] = useState('Click the button above to load data');

    const mockApiCall = () => {
        // Simulating a delay and response with 10 random data sets
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockData = {
                    scheduledCount: Math.floor(Math.random() * 100),
                    inProgressCount: Math.floor(Math.random() * 100),
                    completedCount: Math.floor(Math.random() * 100),
                    cancelledCount: Math.floor(Math.random() * 100),
                };
                resolve(mockData);
            }, 1000);
        });
    };

    const loadStats = async () => {
        try {
            const data = await mockApiCall();
            setStats(data);
            setApiResponse(JSON.stringify(data, null, 2));
        } catch (error) {
            setApiResponse(`Error: ${error.message}`);
        }
    };

    return (
        <div className="container my-5">
            <div className="bg-white p-4 rounded shadow">
                <h1 className="text-primary">AI Interview Platform - Test Page</h1>
                <p>This is a simple test page to verify that the server is working correctly.</p>

                <div className="card my-4">
                    <div className="card-body">
                        <h2 className="card-title">Interview Statistics</h2>
                        <div className="row text-center my-3">
                            <div className="col-md-3 mb-3">
                                <div className="border p-3 rounded shadow-sm">
                                    <h6 className="text-uppercase text-muted">Scheduled</h6>
                                    <p className="h4 text-primary">{stats.scheduledCount}</p>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="border p-3 rounded shadow-sm">
                                    <h6 className="text-uppercase text-muted">In Progress</h6>
                                    <p className="h4 text-primary">{stats.inProgressCount}</p>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="border p-3 rounded shadow-sm">
                                    <h6 className="text-uppercase text-muted">Completed</h6>
                                    <p className="h4 text-primary">{stats.completedCount}</p>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="border p-3 rounded shadow-sm">
                                    <h6 className="text-uppercase text-muted">Cancelled</h6>
                                    <p className="h4 text-primary">{stats.cancelledCount}</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={loadStats}>Load Statistics</button>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <h2 className="card-title">API Response</h2>
                        <pre className="bg-light p-3 rounded">{apiResponse}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Test;
