// import { useAuthContext } from '../../../context/auth-context';
// import axios from "axios";
// import { useState, useEffect, useMemo } from 'react';
// import toast from 'react-hot-toast';
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { CSVLink } from "react-csv";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// // Modern vibrant color palette
// const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6', '#EC4899'];

// const SuperAdminReportsStats = () => {
//     const { server, token } = useAuthContext();
//     const [allData, setAllData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filters, setFilters] = useState({
//         range: 7,
//         chartType: "bar",
//         positionTitle: ""
//     });

//     const fetchStats = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${server}/api/v1/superadminDashboard/getSuperAdminReportsStats`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setAllData(response.data.data || []);
//         } catch (error) {
//             const message = error?.response?.data?.message || "Failed to load data.";
//             toast.error(message);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchStats();
//     }, []);

//     const uniqueJobTitles = useMemo(() => [...new Set(allData.map(item => item.positionTitle))], [allData]);

//     const { filteredData, topJobTitles } = useMemo(() => {
//         const fromDate = new Date();
//         fromDate.setDate(fromDate.getDate() - filters.range);

//         const recent = allData.filter(item => {
//             const interviewDate = new Date(item.interviewDate);
//             const inRange = interviewDate >= fromDate;
//             const matchesJob = filters.positionTitle ? item.positionTitle === filters.positionTitle : true;
//             return inRange && matchesJob;
//         });

//         // Calculate feedback distribution
//         const feedbackMap = {};
//         for (const item of recent) {
//             const key = item.positionTitle;
//             const score = item.overallScore || 0;
//             let feedback = "average";
//             if (score >= 8) feedback = "good";
//             else if (score <= 4) feedback = "poor";

//             if (!feedbackMap[key]) feedbackMap[key] = {
//                 positionTitle: key,
//                 good: 0,
//                 average: 0,
//                 poor: 0
//             };

//             feedbackMap[key][feedback] += 1;
//         }

//         // Calculate top performers
//         const topMap = {};
//         for (const item of recent) {
//             const title = item.positionTitle;
//             if (!topMap[title]) topMap[title] = { total: 0, count: 0 };
//             topMap[title].total += item.overallScore || 0;
//             topMap[title].count += 1;
//         }

//         const topPerformers = Object.entries(topMap)
//             .map(([title, { total, count }]) => ({
//                 title,
//                 average: +(total / count).toFixed(2)
//             }))
//             .sort((a, b) => b.average - a.average)
//             .slice(0, 3);

//         return {
//             filteredData: Object.values(feedbackMap),
//             topJobTitles: topPerformers
//         };
//     }, [allData, filters.range, filters.positionTitle]);

//     const pieChartData = useMemo(() => [
//         { name: "Good (8-10)", value: filteredData.reduce((acc, d) => acc + (d.good || 0), 0) },
//         { name: "Average (5-7)", value: filteredData.reduce((acc, d) => acc + (d.average || 0), 0) },
//         { name: "Poor (0-4)", value: filteredData.reduce((acc, d) => acc + (d.poor || 0), 0) },
//     ], [filteredData]);

//     const exportPDF = () => {
//         if (!filteredData.length) return;

//         const doc = new jsPDF();
//         doc.text(`Interview Report Stats - Last ${filters.range} Days`, 14, 14);
//         autoTable(doc, {
//             head: [["Position Title", "Good", "Average", "Poor"]],
//             body: filteredData.map(row => [
//                 row.positionTitle,
//                 row.good || 0,
//                 row.average || 0,
//                 row.poor || 0,
//             ]),
//         });
//         doc.save(`report-stats-${filters.range}-days.pdf`);
//     };

//     const csvData = useMemo(() => {
//         return filteredData.map(row => ({
//             "Position Title": row.positionTitle,
//             "Good (8-10)": row.good || 0,
//             "Average (5-7)": row.average || 0,
//             "Poor (0-4)": row.poor || 0
//         }));
//     }, [filteredData]);

//     const CustomTooltip = ({ active, payload, label }) => {
//         if (active && payload && payload.length) {
//             return (
//                 <div className="bg-white p-3 shadow-sm rounded border">
//                     <p className="fw-bold mb-2">{label}</p>
//                     {payload.map((entry, index) => (
//                         <p key={`tooltip-${index}`} style={{ color: entry.color }} className="mb-0">
//                             {entry.name}: {entry.value}
//                         </p>
//                     ))}
//                 </div>
//             );
//         }
//         return null;
//     };

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({ ...prev, [name]: value }));
//     };

//     const resetFilters = () => {
//         setFilters({
//             range: 7,
//             chartType: "bar",
//             positionTitle: ""
//         });
//     };

//     return (
//         <div className="container-fluid px-4">
//             <div className="d-sm-flex align-items-center justify-content-between mb-4">
//                 <h1 className="h3 mb-0 text-gray-800">Interview Feedback Analytics</h1>
//                 <div>
//                     <CSVLink
//                         data={csvData}
//                         filename={`report-stats-${filters.range}-days.csv`}
//                         className="btn btn-sm btn-success shadow-sm me-2"
//                     >
//                         <i className="fas fa-file-csv me-1"></i> Export CSV
//                     </CSVLink>
//                     <button
//                         className="btn btn-sm btn-danger shadow-sm"
//                         onClick={exportPDF}
//                         disabled={!filteredData.length}
//                     >
//                         <i className="fas fa-file-pdf me-1"></i> Export PDF
//                     </button>
//                 </div>
//             </div>

//             <div className="card shadow mb-4">
//                 <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-primary text-white">
//                     <h6 className="m-0 font-weight-bold text-light">Filters</h6>
//                 </div>
//                 <div className="card-body">
//                     <div className="row g-3">
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">Time Range</label>
//                             <select
//                                 name="range"
//                                 className="form-select form-select-sm"
//                                 onChange={handleFilterChange}
//                                 value={filters.range}
//                             >
//                                 <option value={7}>Last 7 Days</option>
//                                 <option value={30}>Last 30 Days</option>
//                                 <option value={90}>Last 90 Days</option>
//                                 <option value={365}>Last 1 Year</option>
//                             </select>
//                         </div>
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">Position Title</label>
//                             <select
//                                 name="positionTitle"
//                                 className="form-select form-select-sm"
//                                 onChange={handleFilterChange}
//                                 value={filters.positionTitle}
//                             >
//                                 <option value="">All Positions</option>
//                                 {uniqueJobTitles.map((title, idx) => (
//                                     <option key={idx} value={title}>{title}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">Chart Type</label>
//                             <select
//                                 name="chartType"
//                                 className="form-select form-select-sm"
//                                 onChange={handleFilterChange}
//                                 value={filters.chartType}
//                             >
//                                 <option value="bar">Bar Chart</option>
//                                 <option value="pie">Pie Chart</option>
//                             </select>
//                         </div>
//                         <div className="col-md-3 d-flex align-items-end">
//                             <button
//                                 className="btn btn-sm btn-outline-secondary w-100"
//                                 onClick={resetFilters}
//                             >
//                                 <i className="fas fa-undo me-1"></i> Reset Filters
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="card shadow mb-4">
//                 <div className="card-body">
//                     {loading ? (
//                         <div className="text-center py-5">
//                             <div className="spinner-border text-primary" role="status">
//                                 <span className="visually-hidden">Loading...</span>
//                             </div>
//                             <p className="mt-2 text-muted">Loading report data...</p>
//                         </div>
//                     ) : filteredData.length === 0 ? (
//                         <div className="text-center py-5">
//                             <div className="alert alert-info mx-3">
//                                 No data available for the selected filters
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="chart-container" style={{ height: '400px' }}>
//                             <ResponsiveContainer width="100%" height="100%">
//                                 {filters.chartType === "bar" ? (
//                                     <BarChart data={filteredData}>
//                                         <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
//                                         <XAxis
//                                             dataKey="positionTitle"
//                                             tick={{ fill: '#6b7280' }}
//                                             tickMargin={10}
//                                         />
//                                         <YAxis
//                                             allowDecimals={false}
//                                             tick={{ fill: '#6b7280' }}
//                                         />
//                                         <Tooltip content={<CustomTooltip />} />
//                                         <Legend />
//                                         <Bar
//                                             dataKey="good"
//                                             stackId="a"
//                                             fill={COLORS[0]}
//                                             radius={[4, 4, 0, 0]}
//                                             name="Good (8-10)"
//                                         />
//                                         <Bar
//                                             dataKey="average"
//                                             stackId="a"
//                                             fill={COLORS[1]}
//                                             radius={[4, 4, 0, 0]}
//                                             name="Average (5-7)"
//                                         />
//                                         <Bar
//                                             dataKey="poor"
//                                             stackId="a"
//                                             fill={COLORS[2]}
//                                             radius={[4, 4, 0, 0]}
//                                             name="Poor (0-4)"
//                                         />
//                                     </BarChart>
//                                 ) : (
//                                     <PieChart>
//                                         <Pie
//                                             data={pieChartData}
//                                             cx="50%"
//                                             cy="50%"
//                                             outerRadius={120}
//                                             innerRadius={60}
//                                             paddingAngle={2}
//                                             dataKey="value"
//                                             nameKey="name"
//                                             label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                                             labelLine={false}
//                                         >
//                                             {pieChartData.map((entry, index) => (
//                                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                             ))}
//                                         </Pie>
//                                         <Legend />
//                                         <Tooltip
//                                             formatter={(value, name, props) => [`${value} (${(props.payload.percent * 100).toFixed(1)}%)`, name]}
//                                             contentStyle={{
//                                                 borderRadius: '0.35rem',
//                                                 border: '1px solid #e3e6f0',
//                                                 backgroundColor: '#fff'
//                                             }}
//                                         />
//                                     </PieChart>
//                                 )}
//                             </ResponsiveContainer>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             <div className="row">
//                 <div className="col-lg-8 mb-4">
//                     <div className="card shadow h-100">
//                         <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
//                             <h6 className="m-0 font-weight-bold text-primary">Top Performing Positions</h6>
//                             <small className="text-muted">By average interview score</small>
//                         </div>
//                         <div className="card-body">
//                             {topJobTitles.length > 0 ? (
//                                 <div className="list-group list-group-flush">
//                                     {topJobTitles.map((item, idx) => (
//                                         <div key={idx} className="list-group-item border-0 d-flex justify-content-between align-items-center py-3">
//                                             <div className="d-flex align-items-center">
//                                                 <span className="badge bg-primary rounded-circle me-3 d-flex justify-content-center align-items-center" style={{ width: '30px', height: '30px' }}>
//                                                     {idx + 1}
//                                                 </span>
//                                                 <span className="fw-medium">{item.title}</span>
//                                             </div>
//                                             <div className="d-flex align-items-center">
//                                                 <div className="progress flex-grow-1" style={{ width: '100px', height: '8px' }}>
//                                                     <div
//                                                         className="progress-bar bg-success"
//                                                         role="progressbar"
//                                                         style={{ width: `${(item.average / 10) * 100}%` }}
//                                                         aria-valuenow={item.average}
//                                                         aria-valuemin="0"
//                                                         aria-valuemax="10"
//                                                     ></div>
//                                                 </div>
//                                                 <span className="badge bg-success-soft text-success ms-3">
//                                                     {item.average}/10
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-3 text-muted">
//                                     <i className="fas fa-trophy fa-2x text-gray-300 mb-2"></i>
//                                     <p>No top performers data available</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-lg-4 mb-4">
//                     <div className="card shadow h-100">
//                         <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
//                             <h6 className="m-0 font-weight-bold text-primary">Feedback Summary</h6>
//                         </div>
//                         <div className="card-body d-flex flex-column justify-content-center">
//                             {pieChartData.length > 0 ? (
//                                 <div className="text-center">
//                                     <div className="mb-4" style={{ height: '200px' }}>
//                                         <ResponsiveContainer width="100%" height="100%">
//                                             <PieChart>
//                                                 <Pie
//                                                     data={pieChartData}
//                                                     cx="50%"
//                                                     cy="50%"
//                                                     innerRadius={60}
//                                                     outerRadius={80}
//                                                     paddingAngle={2}
//                                                     dataKey="value"
//                                                 >
//                                                     {pieChartData.map((entry, index) => (
//                                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                                     ))}
//                                                 </Pie>
//                                                 <Tooltip
//                                                     formatter={(value, name, props) => {
//                                                         const total = pieChartData.reduce((sum, item) => sum + item.value, 0);
//                                                         const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
//                                                         return [
//                                                             `${value} interviews (${percentage}%)`,
//                                                             name
//                                                         ];
//                                                     }}
//                                                     contentStyle={{
//                                                         borderRadius: '0.35rem',
//                                                         border: '1px solid #e3e6f0',
//                                                         backgroundColor: '#fff'
//                                                     }}
//                                                 />
//                                             </PieChart>
//                                         </ResponsiveContainer>
//                                     </div>
//                                     <div className="d-flex justify-content-center gap-3 flex-wrap">
//                                         {pieChartData.map((item, index) => (
//                                             <div key={index} className="text-center">
//                                                 <span className="d-block fw-bold" style={{ color: COLORS[index] }}>
//                                                     {item.value}
//                                                 </span>
//                                                 <small className="text-muted">{item.name}</small>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="text-center text-muted py-3">
//                                     No feedback data available
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SuperAdminReportsStats;












import React, { useEffect, useMemo, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";
import { FiRefreshCw } from "react-icons/fi";
import { useAuthContext } from '../../../context/auth-context';
import axios from "axios";
import toast from 'react-hot-toast';

const COLORS = ["#4F46E5", "#10B981", "#EF4444"];
const ICON_BG = [
    "linear-gradient(135deg,#7c3aed,#4f46e5)",
    "linear-gradient(135deg,#06d6a0,#0ea5e9)",
    "linear-gradient(135deg,#ff6b6b,#ff8e53)",
    "linear-gradient(135deg,#0ea5e9,#38bdf8)"
];

const SuperAdminReportsStats = () => {
    const [allData, setAllData] = useState([]);
    const { server, token } = useAuthContext();
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${server}/api/v1/superadminDashboard/getSuperAdminReportsStats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllData(response.data.data || []);
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to load data.";
            toast.error(message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const [filters, setFilters] = useState({
        range: 7,
        chartType: "bar",
        positionTitle: ""
    });

    const uniqueJobTitles = useMemo(
        () => [...new Set(allData.map((item) => item.positionTitle))],
        [allData]
    );

    const { filteredData, topJobTitles } = useMemo(() => {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - filters.range);

        const recent = allData.filter((item) => {
            const d = new Date(item.interviewDate);
            const inRange = d >= fromDate;
            const match = filters.positionTitle ? item.positionTitle === filters.positionTitle : true;
            return inRange && match;
        });

        const map = {};
        recent.forEach((item) => {
            const title = item.positionTitle;
            const score = item.overallScore;

            let type = "average";
            if (score >= 8) type = "good";
            else if (score <= 4) type = "poor";

            if (!map[title]) map[title] = { positionTitle: title, good: 0, average: 0, poor: 0 };
            map[title][type]++;
        });

        const topMap = {};
        recent.forEach((item) => {
            if (!topMap[item.positionTitle])
                topMap[item.positionTitle] = { total: 0, count: 0 };
            topMap[item.positionTitle].total += item.overallScore;
            topMap[item.positionTitle].count++;
        });

        const top = Object.entries(topMap)
            .map(([title, x]) => ({ title, average: (x.total / x.count).toFixed(2) }))
            .sort((a, b) => b.average - a.average)
            .slice(0, 3);

        return {
            filteredData: Object.values(map),
            topJobTitles: top
        };
    }, [allData, filters]);

    const pieChartData = useMemo(
        () => [
            { name: "Good (8-10)", value: filteredData.reduce((s, x) => s + x.good, 0) },
            { name: "Average (5-7)", value: filteredData.reduce((s, x) => s + x.average, 0) },
            { name: "Poor (0-4)", value: filteredData.reduce((s, x) => s + x.poor, 0) }
        ],
        [filteredData]
    );

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text(`Interview Feedback Report — Last ${filters.range} Days`, 14, 14);

        autoTable(doc, {
            head: [["Position", "Good", "Average", "Poor"]],
            body: filteredData.map((r) => [r.positionTitle, r.good, r.average, r.poor])
        });

        doc.save("feedback-report.pdf");
    };

    const csvData = filteredData.map((row) => ({
        "Position Title": row.positionTitle,
        "Good": row.good,
        "Average": row.average,
        "Poor": row.poor
    }));

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading report data...</p>
            </div>
        )
    }
    return (
        <div className="container-fluid px-3 py-3">

            {/* ===============================
          ⭐ HEADER
      =============================== */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold mb-0">Interview Feedback Analytics</h2>
                    <small className="text-muted">Overview of interview performance & trends</small>
                </div>

                <div className="d-flex gap-2">
                    {/* <CSVLink data={csvData} className="btn btn-light border" filename="feedback-report.csv">
                        Export CSV
                    </CSVLink>

                    <button className="btn btn-primary" onClick={exportPDF}>
                        Export PDF
                    </button> */}


                    <CSVLink
                        data={csvData}
                        className="btn btn-sm text-white fw-semibold me-2"
                        style={{
                            background: "linear-gradient(90deg, #36b9cc, #4e73df)",
                            border: "none",
                        }}
                        filename="applications.csv">
                        Export CSV
                    </CSVLink>
                    <button
                        className="btn btn-sm text-white fw-semibold"
                        style={{
                            background: "linear-gradient(90deg, #e74a3b, #f6c23e)",
                            border: "none",
                        }}
                        onClick={exportPDF}>
                        Export PDF
                    </button>
                </div>

            </div>

            {/* ===============================
          ⭐ SUMMARY CARDS
      =============================== */}
            <div className="row g-3 mb-4">

                <div className="col-md-4">
                    <div className="p-3 bg-white rounded-4 shadow-sm" style={{ border: "1px solid #eef1ff" }}>
                        <div className="d-flex align-items-center gap-3">
                            <div style={{
                                width: 44, height: 44, borderRadius: 12,
                                background: ICON_BG[0], color: "#fff",
                                display: "flex", justifyContent: "center", alignItems: "center",
                                fontSize: 22
                            }}>—</div>
                            <div>
                                <h4 className="mb-0">{uniqueJobTitles.length}</h4>
                                <small className="text-muted">Total Job Roles</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="p-3 bg-white rounded-4 shadow-sm" style={{ border: "1px solid #eef1ff" }}>
                        <div className="d-flex align-items-center gap-3">
                            <div style={{
                                width: 44, height: 44, borderRadius: 12,
                                background: ICON_BG[1], color: "#fff",
                                display: "flex", justifyContent: "center", alignItems: "center",
                                fontSize: 22
                            }}>✓</div>
                            <div>
                                <h4 className="mb-0">{filteredData.length}</h4>
                                <small className="text-muted">Active Positions</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="p-3 bg-white rounded-4 shadow-sm" style={{ border: "1px solid #eef1ff" }}>
                        <div className="d-flex align-items-center gap-3">
                            <div style={{
                                width: 44, height: 44, borderRadius: 12,
                                background: ICON_BG[2], color: "#fff",
                                display: "flex", justifyContent: "center", alignItems: "center",
                                fontSize: 22
                            }}>○</div>
                            <div>
                                <h4 className="mb-0">
                                    {filteredData.reduce((s, x) => s + x.good + x.average + x.poor, 0)}
                                </h4>
                                <small className="text-muted">Total Feedback Entries</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===============================
          ⭐ FILTERS
      =============================== */}
            <div className="card p-3 rounded-4 shadow-sm mb-4">

                <div className="row g-3">

                    <div className="col-md-3">
                        <label className="text-muted small">Time Range</label>
                        <select
                            className="form-select form-select-sm"
                            value={filters.range}
                            onChange={(e) => setFilters({ ...filters, range: Number(e.target.value) })}
                        >
                            <option value={7}>Last 7 Days</option>
                            <option value={30}>Last 30 Days</option>
                            <option value={90}>Last 90 Days</option>
                            <option value={365}>Last 1 Year</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="text-muted small">Position Title</label>
                        <select
                            className="form-select form-select-sm"
                            value={filters.positionTitle}
                            onChange={(e) => setFilters({ ...filters, positionTitle: e.target.value })}
                        >
                            <option value="">All</option>
                            {uniqueJobTitles.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label className="text-muted small">Chart Type</label>
                        <select
                            className="form-select form-select-sm"
                            value={filters.chartType}
                            onChange={(e) => setFilters({ ...filters, chartType: e.target.value })}
                        >
                            <option value="bar">Bar Chart</option>
                            <option value="pie">Pie Chart</option>
                        </select>
                    </div>

                    <div className="col-md-2 d-flex align-items-end">
                        <button
                            className="btn btn-sm text-white fw-semibold w-100"
                            style={{
                                background: "linear-gradient(90deg, #36b9cc, #4e73df)",
                                border: "none",
                            }}
                            onClick={() => setFilters({ range: 7, chartType: "bar", positionTitle: "" })}
                        >
                            <FiRefreshCw /> Reset
                        </button>
                    </div>

                </div>
            </div>

            {/* ===============================
          ⭐ MAIN CHART
      =============================== */}
            <div className="card p-3 rounded-4 shadow-sm mb-4" style={{ height: 400 }}>
                {!filteredData.length ? (
                    <div className="text-center text-muted py-5">No data for selected filters</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        {filters.chartType === "bar" ? (
                            <BarChart data={filteredData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="positionTitle" />
                                <YAxis />
                                <Tooltip />
                                <Legend />

                                <Bar dataKey="good" fill={COLORS[0]} />
                                <Bar dataKey="average" fill={COLORS[1]} />
                                <Bar dataKey="poor" fill={COLORS[2]} />
                            </BarChart>
                        ) : (
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    dataKey="value"
                                    label
                                >
                                    {pieChartData.map((entry, i) => (
                                        <Cell key={i} fill={COLORS[i]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        )}
                    </ResponsiveContainer>
                )}
            </div>

            {/* ===============================
          ⭐ BOTTOM ROW
      =============================== */}
            <div className="row">

                {/* Top Performing */}
                <div className="col-lg-8 mb-4">
                    <div className="card rounded-4 shadow-sm">
                        <div className="card-header bg-white fw-bold text-primary">
                            Top Performing Positions
                        </div>

                        <div className="card-body">
                            {topJobTitles.length ? (
                                topJobTitles.map((x, i) => (
                                    <div key={i} className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="fw-bold">{i + 1}. {x.title}</div>
                                        <span className="badge bg-success">{x.average}/10</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-muted py-3">No data</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Feedback Summary */}
                <div className="col-lg-4 mb-4">
                    <div className="card rounded-4 shadow-sm">
                        <div className="card-header bg-white fw-bold text-primary">
                            Feedback Summary
                        </div>

                        <div className="card-body">
                            <div style={{ height: 240 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            dataKey="value"
                                        >
                                            {pieChartData.map((entry, i) => (
                                                <Cell key={i} fill={COLORS[i]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="d-flex justify-content-around pt-2">
                                {pieChartData.map((x, i) => (
                                    <div key={i} className="text-center">
                                        <strong style={{ color: COLORS[i] }}>{x.value}</strong>
                                        <div className="text-muted small">{x.name}</div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default SuperAdminReportsStats;