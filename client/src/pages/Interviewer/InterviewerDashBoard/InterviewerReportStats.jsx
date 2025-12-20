// import { useAuthContext } from '../../../context/auth-context';
// import { useState, useEffect, useMemo } from 'react';
// import axios from "axios";
// import toast from 'react-hot-toast';
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { CSVLink } from "react-csv";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// // Modern vibrant color palette
// const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6', '#EC4899'];

// const InterviewerReportStats = () => {
//     const { server, user, token } = useAuthContext();
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
//             const response = await axios.get(`${server}/api/v1/interviewerDashboard/${user.userId}/getInterviewerReportsStats`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             setAllData(response.data.data || []);
//         } catch (error) {
//             const message = error?.response?.data?.message || "Failed to load data.";
//             toast.error(message);
//         } finally {
//             setLoading(false);
//         }
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
//             head: [["Job Title", "Good", "Average", "Poor"]],
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
//                                         {/* <Legend
//                                             layout="vertical"
//                                             verticalAlign="middle"
//                                             align="right"
//                                         /> */}
//                                         <Legend/>
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
//                                                         // Safely calculate percentage
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

// export default InterviewerReportStats;





import { useAuthContext } from '../../../context/auth-context';
import { useState, useEffect, useMemo } from 'react';
import axios from "axios";
import toast from 'react-hot-toast';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const THEME_START = "#4e73df";
const THEME_END = "#36b9cc";
const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#6366F1", "#8B5CF6", "#EC4899"];

const GradientDefs = () => (
    <defs>
        <linearGradient id="grad-good" x1="0" x2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#36b9cc" />
        </linearGradient>
        <linearGradient id="grad-average" x1="0" x2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id="grad-poor" x1="0" x2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f87171" />
        </linearGradient>
    </defs>
);

const TooltipCard = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white p-3 shadow-sm rounded border" style={{ minWidth: 160 }}>
            <div className="fw-bold mb-2 text-dark">{label}</div>
            {payload.map((entry, i) => (
                <div key={i} className="d-flex align-items-center mb-1">
                    <div
                        style={{
                            width: 10,
                            height: 10,
                            background: entry.color,
                            borderRadius: 3,
                            marginRight: 8,
                        }}
                    />
                    <div style={{ color: "#374151", fontSize: 13 }}>
                        {entry.name}: <span className="fw-semibold">{entry.value}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const InterviewerReportStats = () => {
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        range: 7,
        chartType: "bar",
        positionTitle: "",
    });

    const { server, user, token } = useAuthContext();

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${server}/api/v1/interviewerDashboard/${user.userId}/getInterviewerReportsStats`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAllData(response.data.data || []);
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to load data.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const uniqueJobTitles = useMemo(
        () => [...new Set(allData.map((i) => i.positionTitle))],
        [allData]
    );

    const { filteredData, topJobTitles } = useMemo(() => {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - filters.range);

        const recent = allData.filter((item) => {
            const interviewDate = new Date(item.interviewDate);
            const inRange = interviewDate >= fromDate;
            const matchesJob = filters.positionTitle
                ? item.positionTitle === filters.positionTitle
                : true;
            return inRange && matchesJob;
        });

        const feedbackMap = {};
        for (const item of recent) {
            const key = item.positionTitle;
            const score = item.overallScore || 0;
            let feedback = "average";
            if (score >= 8) feedback = "good";
            else if (score <= 4) feedback = "poor";

            if (!feedbackMap[key])
                feedbackMap[key] = { positionTitle: key, good: 0, average: 0, poor: 0 };
            feedbackMap[key][feedback]++;
        }

        const topMap = {};
        for (const item of recent) {
            const title = item.positionTitle;
            if (!topMap[title]) topMap[title] = { total: 0, count: 0 };
            topMap[title].total += item.overallScore || 0;
            topMap[title].count++;
        }

        const topPerformers = Object.entries(topMap)
            .map(([title, { total, count }]) => ({
                title,
                average: +(total / count).toFixed(2),
            }))
            .sort((a, b) => b.average - a.average)
            .slice(0, 3);

        return {
            filteredData: Object.values(feedbackMap),
            topJobTitles: topPerformers,
        };
    }, [allData, filters.range, filters.positionTitle]);

    const pieChartData = useMemo(
        () => [
            { name: "Good (8-10)", value: filteredData.reduce((a, b) => a + (b.good || 0), 0) },
            { name: "Average (5-7)", value: filteredData.reduce((a, b) => a + (b.average || 0), 0) },
            { name: "Poor (0-4)", value: filteredData.reduce((a, b) => a + (b.poor || 0), 0) },
        ],
        [filteredData]
    );

    const exportPDF = () => {
        if (!filteredData.length) return;
        const doc = new jsPDF();
        doc.text(`Interview Report Stats - Last ${filters.range} Days`, 14, 14);
        autoTable(doc, {
            head: [["Job Title", "Good", "Average", "Poor"]],
            body: filteredData.map((r) => [r.positionTitle, r.good || 0, r.average || 0, r.poor || 0]),
        });
        doc.save(`report-stats-${filters.range}-days.pdf`);
    };

    const csvData = useMemo(
        () =>
            filteredData.map((r) => ({
                "Position Title": r.positionTitle,
                "Good (8-10)": r.good || 0,
                "Average (5-7)": r.average || 0,
                "Poor (0-4)": r.poor || 0,
            })),
        [filteredData]
    );

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((p) => ({ ...p, [name]: value }));
    };

    const resetFilters = () => setFilters({ range: 7, chartType: "bar", positionTitle: "" });

    return (
        <div className="container-fluid px-4">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h3
                    className="fw-bold text-dark"
                    style={{
                        background: `linear-gradient(90deg, ${THEME_START}, ${THEME_END})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    <i className="fas fa-chart-bar me-2" style={{ color: THEME_END }}></i>
                    Interview Feedback Analytics
                </h3>
                <div>
                    <CSVLink
                        data={csvData}
                        filename={`report-stats-${filters.range}-days.csv`}
                        className="btn btn-sm text-white fw-semibold me-2"
                        style={{
                            background: `linear-gradient(90deg, ${THEME_END}, ${THEME_START})`,
                            border: "none",
                        }}
                    >
                        <i className="fas fa-file-csv me-1"></i> Export CSV
                    </CSVLink>
                    <button
                        className="btn btn-sm text-white fw-semibold"
                        onClick={exportPDF}
                        style={{
                            background: "linear-gradient(90deg, #e74a3b, #f6c23e)",
                            border: "none",
                        }}
                    >
                        <i className="fas fa-file-pdf me-1"></i> Export PDF
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="card border-0 shadow-sm rounded-4 hover-card mb-4">
                <div
                    className="card-header text-white rounded-top-4"
                    style={{ background: `linear-gradient(90deg, ${THEME_START}, ${THEME_END})` }}
                >
                    <h6 className="m-0 fw-semibold">Filters</h6>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary">Time Range</label>
                            <select
                                name="range"
                                className="form-select form-select-sm"
                                onChange={handleFilterChange}
                                value={filters.range}
                            >
                                <option value={7}>Last 7 Days</option>
                                <option value={30}>Last 30 Days</option>
                                <option value={90}>Last 90 Days</option>
                                <option value={365}>Last 1 Year</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary">Position Title</label>
                            <select
                                name="positionTitle"
                                className="form-select form-select-sm"
                                onChange={handleFilterChange}
                                value={filters.positionTitle}
                            >
                                <option value="">All Positions</option>
                                {uniqueJobTitles.map((t, i) => (
                                    <option key={i} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary">Chart Type</label>
                            <select
                                name="chartType"
                                className="form-select form-select-sm"
                                onChange={handleFilterChange}
                                value={filters.chartType}
                            >
                                <option value="bar">Bar Chart</option>
                                <option value="pie">Pie Chart</option>
                            </select>
                        </div>
                        <div className="col-md-3 d-flex align-items-end">
                            <button
                                className="btn btn-sm text-white fw-semibold w-100"
                                style={{
                                    background: `linear-gradient(90deg, ${THEME_END}, ${THEME_START})`,
                                    border: "none",
                                }}
                                onClick={resetFilters}
                            >
                                <i className="fas fa-undo me-1"></i> Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="card border-0 shadow-sm rounded-4 hover-card mb-4">
                <div className="card-body">
                    <svg style={{ position: "absolute", width: 0, height: 0 }}>
                        <GradientDefs />
                    </svg>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2 text-muted">Loading report data...</p>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            No data available for selected filters.
                        </div>
                    ) : (
                        <div style={{ height: "400px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                {filters.chartType === "bar" ? (
                                    <BarChart data={filteredData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="positionTitle" tick={{ fill: "#374151" }} />
                                        <YAxis allowDecimals={false} tick={{ fill: "#374151" }} />
                                        <Tooltip content={<TooltipCard />} />
                                        <Legend />
                                        <Bar dataKey="good" fill="url(#grad-good)" name="Good (8-10)" radius={[6, 6, 0, 0]} animationDuration={900} />
                                        <Bar dataKey="average" fill="url(#grad-average)" name="Average (5-7)" radius={[6, 6, 0, 0]} animationDuration={900} />
                                        <Bar dataKey="poor" fill="url(#grad-poor)" name="Poor (0-4)" radius={[6, 6, 0, 0]} animationDuration={900} />
                                    </BarChart>
                                ) : (
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={110}
                                            innerRadius={60}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            animationDuration={900}
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<TooltipCard />} />
                                        <Legend verticalAlign="bottom" />
                                    </PieChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
                <div className="card-footer bg-white text-muted small">
                    Showing data for last {filters.range} days • Updated: {new Date().toLocaleString()}
                </div>
            </div>

            {/* Top Performers + Feedback Summary */}
            <div className="row">
                <div className="col-lg-8 mb-4">
                    <div className="card shadow-sm rounded-4 hover-card h-100">
                        <div
                            className="card-header text-white rounded-top-4"
                            style={{ background: `linear-gradient(90deg, ${THEME_START}, ${THEME_END})` }}
                        >
                            <h6 className="m-0 fw-semibold">Top Performing Positions</h6>
                        </div>
                        <div className="card-body">
                            {topJobTitles.length ? (
                                topJobTitles.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="d-flex justify-content-between align-items-center border-bottom py-2"
                                    >
                                        <span className="fw-semibold text-dark">{idx + 1}. {item.title}</span>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="progress" style={{ width: "100px", height: "8px" }}>
                                                <div
                                                    className="progress-bar"
                                                    role="progressbar"
                                                    style={{
                                                        width: `${(item.average / 10) * 100}%`,
                                                        background: `linear-gradient(90deg, ${THEME_END}, ${THEME_START})`,
                                                    }}
                                                />
                                            </div>
                                            <span className="badge bg-light text-dark">{item.average}/10</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted py-3">No top performer data available</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm rounded-4 hover-card h-100">
                        <div
                            className="card-header text-white rounded-top-4"
                            style={{ background: `linear-gradient(90deg, ${THEME_START}, ${THEME_END})` }}
                        >
                            <h6 className="m-0 fw-semibold">Feedback Summary</h6>
                        </div>
                        <div className="card-body text-center">
                            {pieChartData.length ? (
                                <>
                                    <div style={{ height: "180px" }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                                                    {pieChartData.map((entry, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                                        {pieChartData.map((item, index) => (
                                            <div key={index}>
                                                <span
                                                    className="d-block fw-semibold"
                                                    style={{ color: COLORS[index] }}
                                                >
                                                    {item.value}
                                                </span>
                                                <small className="text-muted">{item.name}</small>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted">No feedback data available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .hover-card {
          transition: all 0.25s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(78,115,223,0.15);
        }
      `}</style>
        </div>
    );
};

export default InterviewerReportStats;




