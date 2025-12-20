// import { useEffect, useMemo, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useAuthContext } from "../../../context/auth-context";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { CSVLink } from "react-csv";
// import InterviewerRecentInterviews from "./InterviewerRecentInterviews";
// import InterviewerUpcomingInterviews from "./InterviewerUpcomingInterviews";

// // Modern vibrant color palette
// const COLORS = [
//     '#4F46E5', // Indigo (Modern primary)
//     '#10B981', // Emerald (Fresh green)
//     '#3B82F6', // Blue (Bright and clean)
//     '#EF4444', // Rose Red (Modern red)
//     //   '#8B5CF6', // Violet (Trendy purple)
//     //   '#06B6D4', // Cyan (Cool and calm)
//     //   '#F97316', // Orange (Modern orange)
//     //   '#64748B', // Slate Gray (Neutral for contrast)
// ];

// const InterviewerInterviewStatusGraph = () => {
//     const { server, user, token } = useAuthContext();
//     const [rawData, setRawData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filters, setFilters] = useState({
//         status: "",
//         jobTitle: "",
//         isActive: "",
//         cancelledBy: "",
//         range: "7",
//         chartType: "bar"
//     });

//     const fetchStats = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${server}/api/v1/interviewerDashboard/${user.userId}/getInterviewerInterviewStats`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             setRawData(response.data.data || []);
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

//     const uniqueJobs = useMemo(() => [...new Set(rawData.map(item => item.jobTitle))], [rawData]);

//     const { filteredData, lineChartData } = useMemo(() => {
//         const fromDate = new Date();
//         fromDate.setDate(fromDate.getDate() - Number(filters.range));

//         const filtered = rawData.filter(item => {
//             const matchStatus = filters.status ? item.status === filters.status : true;
//             const matchJobTitle = filters.jobTitle ? item.jobTitle === filters.jobTitle : true;
//             const matchIsActive = filters.isActive !== ""
//                 ? item.isActive === (filters.isActive === "true") : true;
//             const matchCancelledBy = filters.cancelledBy
//                 ? item.cancelledBy === filters.cancelledBy : true;
//             const matchDate = new Date(item.createdAt) >= fromDate;

//             return matchStatus && matchJobTitle && matchIsActive && matchCancelledBy && matchDate;
//         });

//         const grouped = {};
//         const lineMap = {};

//         for (const item of filtered) {
//             const job = item.jobTitle;
//             const status = item.status;
//             const date = new Date(item.createdAt).toISOString().split("T")[0];

//             if (!grouped[job]) {
//                 grouped[job] = { jobTitle: job, scheduled: 0, inProcess: 0, completed: 0, cancelled: 0 };
//             }
//             grouped[job][status]++;

//             if (!lineMap[date]) {
//                 lineMap[date] = { date, scheduled: 0, inProcess: 0, completed: 0, cancelled: 0 };
//             }
//             lineMap[date][status]++;
//         }

//         return {
//             filteredData: Object.values(grouped),
//             lineChartData: Object.values(lineMap).sort((a, b) => new Date(a.date) - new Date(b.date))
//         };
//     }, [filters, rawData]);

//     const pieChartData = useMemo(() => [
//         { name: "Scheduled", value: filteredData.reduce((a, b) => a + (b.scheduled || 0), 0) },
//         { name: "In Process", value: filteredData.reduce((a, b) => a + (b.inProcess || 0), 0) },
//         { name: "Completed", value: filteredData.reduce((a, b) => a + (b.completed || 0), 0) },
//         { name: "Cancelled", value: filteredData.reduce((a, b) => a + (b.cancelled || 0), 0) },
//     ], [filteredData]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({ ...prev, [name]: value }));
//     };

//     const resetFilters = () => {
//         setFilters({
//             status: "",
//             jobTitle: "",
//             isActive: "",
//             cancelledBy: "",
//             range: "7",
//             chartType: "bar"
//         });
//     };

//     const exportPDF = () => {
//         if (!filteredData.length) return;

//         const doc = new jsPDF();
//         doc.text(`Interview Stats - Last ${filters.range} Days`, 14, 14);
//         const headers = filters.chartType === "line"
//             ? [["Date", "Scheduled", "In Process", "Completed", "Cancelled"]]
//             : [["Job Title", "Scheduled", "In Process", "Completed", "Cancelled"]];

//         const dataToExport = filters.chartType === "line" ? lineChartData : filteredData;
//         const body = dataToExport.map(item => [
//             filters.chartType === "line" ? item.date : item.jobTitle,
//             item.scheduled || 0,
//             item.inProcess || 0,
//             item.completed || 0,
//             item.cancelled || 0,
//         ]);

//         autoTable(doc, { head: headers, body });
//         doc.save(`interview-stats-${filters.range}-days.pdf`);
//     };

//     const csvData = useMemo(() => {
//         const dataToExport = filters.chartType === "line" ? lineChartData : filteredData;
//         return dataToExport.map(item => ({
//             [filters.chartType === "line" ? "Date" : "Job Title"]: filters.chartType === "line" ? item.date : item.jobTitle,
//             "Scheduled": item.scheduled || 0,
//             "In Process": item.inProcess || 0,
//             "Completed": item.completed || 0,
//             "Cancelled": item.cancelled || 0
//         }));
//     }, [filteredData, lineChartData, filters.chartType]);

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

//     const renderChart = () => {
//         if (loading) {
//             return (
//                 <div className="text-center py-5">
//                     <div className="spinner-border text-primary" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                     <p className="mt-2 text-muted">Loading interview data...</p>
//                 </div>
//             );
//         }

//         if (!filteredData.length) {
//             return (
//                 <div className="text-center py-5">
//                     <p className="text-muted">No data available for selected filters.</p>
//                 </div>
//             );
//         }

//         return (
//             <div className="chart-container" style={{ minHeight: '400px' }}>
//                 <ResponsiveContainer width="100%" height={400}>
//                     {filters.chartType === "bar" && (
//                         <BarChart data={filteredData}>
//                             <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
//                             <XAxis
//                                 dataKey="jobTitle"
//                                 tick={{ fill: '#6b7280' }}
//                                 tickMargin={10}
//                             />
//                             <YAxis
//                                 tick={{ fill: '#6b7280' }}
//                                 tickMargin={10}
//                             />
//                             <Tooltip content={<CustomTooltip />} />
//                             <Legend />
//                             <Bar
//                                 dataKey="scheduled"
//                                 stackId="a"
//                                 fill={COLORS[0]}
//                                 radius={[4, 4, 0, 0]}
//                             />
//                             <Bar
//                                 dataKey="inProcess"
//                                 stackId="a"
//                                 fill={COLORS[1]}
//                                 radius={[4, 4, 0, 0]}
//                             />
//                             <Bar
//                                 dataKey="completed"
//                                 stackId="a"
//                                 fill={COLORS[2]}
//                                 radius={[4, 4, 0, 0]}
//                             />
//                             <Bar
//                                 dataKey="cancelled"
//                                 stackId="a"
//                                 fill={COLORS[3]}
//                                 radius={[4, 4, 0, 0]}
//                             />
//                         </BarChart>
//                     )}
//                     {filters.chartType === "line" && (
//                         <LineChart data={lineChartData}>
//                             <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
//                             <XAxis
//                                 dataKey="date"
//                                 tick={{ fill: '#6b7280' }}
//                                 tickMargin={10}
//                                 tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                             />
//                             <YAxis
//                                 tick={{ fill: '#6b7280' }}
//                                 tickMargin={10}
//                             />
//                             <Tooltip
//                                 content={<CustomTooltip />}
//                                 labelFormatter={(value) => new Date(value).toLocaleDateString()}
//                             />
//                             <Legend />
//                             <Line
//                                 type="monotone"
//                                 dataKey="scheduled"
//                                 stroke={COLORS[0]}
//                                 strokeWidth={2}
//                                 dot={{ r: 4 }}
//                                 activeDot={{ r: 6 }}
//                             />
//                             <Line
//                                 type="monotone"
//                                 dataKey="inProcess"
//                                 stroke={COLORS[1]}
//                                 strokeWidth={2}
//                                 dot={{ r: 4 }}
//                                 activeDot={{ r: 6 }}
//                             />
//                             <Line
//                                 type="monotone"
//                                 dataKey="completed"
//                                 stroke={COLORS[2]}
//                                 strokeWidth={2}
//                                 dot={{ r: 4 }}
//                                 activeDot={{ r: 6 }}
//                             />
//                             <Line
//                                 type="monotone"
//                                 dataKey="cancelled"
//                                 stroke={COLORS[3]}
//                                 strokeWidth={2}
//                                 dot={{ r: 4 }}
//                                 activeDot={{ r: 6 }}
//                             />
//                         </LineChart>
//                     )}
//                     {filters.chartType === "pie" && (
//                         <PieChart>
//                             <Pie
//                                 data={pieChartData}
//                                 dataKey="value"
//                                 nameKey="name"
//                                 cx="50%"
//                                 cy="50%"
//                                 outerRadius={140}
//                                 label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                                 labelLine={false}
//                             >
//                                 {pieChartData.map((entry, index) => (
//                                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                 ))}
//                             </Pie>
//                             <Tooltip
//                                 formatter={(value) => [`${value} (${(value / pieChartData.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(1)}%)`]}
//                                 contentStyle={{
//                                     borderRadius: '0.35rem',
//                                     border: '1px solid #e3e6f0',
//                                     backgroundColor: '#fff'
//                                 }}
//                             />
//                             <Legend />
//                         </PieChart>
//                     )}
//                 </ResponsiveContainer>
//             </div>
//         );
//     };

//     return (
//         <div className="container-fluid px-4">
//             <div className="d-sm-flex align-items-center justify-content-between mb-4">
//                 <h1 className="h3 mb-0 text-gray-800">Interview Analytics Dashboard</h1>
//                 <div>
//                     <CSVLink
//                         data={csvData}
//                         filename={`interview-stats-${filters.range}-days.csv`}
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
//                                 onChange={handleChange}
//                                 value={filters.range}
//                             >
//                                 <option value="7">Last 7 Days</option>
//                                 <option value="30">Last 30 Days</option>
//                                 <option value="90">Last 90 Days</option>
//                                 <option value="365">Last 1 Year</option>
//                             </select>
//                         </div>
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">Chart Type</label>
//                             <select
//                                 name="chartType"
//                                 className="form-select form-select-sm"
//                                 onChange={handleChange}
//                                 value={filters.chartType}
//                             >
//                                 <option value="bar">Bar Chart</option>
//                                 <option value="pie">Pie Chart</option>
//                                 <option value="line">Line Chart</option>
//                             </select>
//                         </div>
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">Status</label>
//                             <select
//                                 name="status"
//                                 className="form-select form-select-sm"
//                                 onChange={handleChange}
//                                 value={filters.status}
//                             >
//                                 <option value="">All Status</option>
//                                 <option value="scheduled">Scheduled</option>
//                                 <option value="inProcess">In Process</option>
//                                 <option value="completed">Completed</option>
//                                 <option value="cancelled">Cancelled</option>
//                             </select>
//                         </div>
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">Job Title</label>
//                             <select
//                                 name="jobTitle"
//                                 className="form-select form-select-sm"
//                                 onChange={handleChange}
//                                 value={filters.jobTitle}
//                             >
//                                 <option value="">All Jobs</option>
//                                 {uniqueJobs.map(job => (
//                                     <option key={job} value={job}>{job}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">Active Status</label>
//                             <select
//                                 name="isActive"
//                                 className="form-select form-select-sm"
//                                 onChange={handleChange}
//                                 value={filters.isActive}
//                             >
//                                 <option value="">All</option>
//                                 <option value="true">Active</option>
//                                 <option value="false">Inactive</option>
//                             </select>
//                         </div>
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">Cancelled By</label>
//                             <select
//                                 name="cancelledBy"
//                                 className="form-select form-select-sm"
//                                 onChange={handleChange}
//                                 value={filters.cancelledBy}
//                             >
//                                 <option value="">None</option>
//                                 <option value="Candidate">Candidate</option>
//                                 <option value="Interviewer">Interviewer</option>
//                                 <option value="Recruitway">Recruitway</option>
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

//             <div className="card shadow">
//                 <div className="card-body p-0">
//                     {renderChart()}
//                 </div>
//                 <div className="card-footer bg-white text-muted small">
//                     Showing data for the last {filters.range} days. Last updated: {new Date().toLocaleString()}
//                 </div>
//             </div>

//             <div className="row mt-4">
//                 <InterviewerRecentInterviews interviewsList={rawData} />
//                 <InterviewerUpcomingInterviews interviewsList={rawData} />
//             </div>
//         </div>
//     );
// };

// export default InterviewerInterviewStatusGraph;











import { useEffect, useMemo, useState } from "react";
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
    LineChart,
    Line,

} from "recharts";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/auth-context";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";
import InterviewerRecentInterviews from "./InterviewerRecentInterviews";
import InterviewerUpcomingInterviews from "./InterviewerUpcomingInterviews";

const THEME_START = "#4e73df";
const THEME_END = "#36b9cc";
const ACCENTS = ["#4F46E5", "#10B981", "#3B82F6", "#EF4444"];

const GradientDefs = () => (
    <defs>
        <linearGradient id="grad-scheduled" x1="0" x2="1">
            <stop offset="0%" stopColor="#36b9cc" stopOpacity="1" />
            <stop offset="100%" stopColor="#4e73df" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="grad-inProcess" x1="0" x2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="grad-completed" x1="0" x2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="grad-cancelled" x1="0" x2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
        </linearGradient>

        {/* soft drop shadow filter */}
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#4e73df" floodOpacity="0.08" />
        </filter>
    </defs>
);

const TooltipCard = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="bg-white p-3 shadow-sm rounded border" style={{ minWidth: 160 }}>
            <div className="fw-bold mb-2" style={{ color: "#111827" }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} className="d-flex align-items-center mb-1">
                    <div style={{ width: 10, height: 10, background: p.color, borderRadius: 3, marginRight: 8 }} />
                    <div style={{ color: "#374151", fontSize: 13 }}>{p.name}: <span className="fw-semibold">{p.value}</span></div>
                </div>
            ))}
        </div>
    );
};

const InterviewerInterviewStatusGraph = () => {
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: "",
        jobTitle: "",
        isActive: "",
        cancelledBy: "",
        range: "7",
        chartType: "bar",
    });

    const { server, user, token } = useAuthContext();

    //   useEffect(() => {
    //     setTimeout(() => {
    //       setRawData([
    //         { jobTitle: "Frontend Developer", status: "scheduled", createdAt: "2025-11-02", isActive: true, cancelledBy: "" },
    //         { jobTitle: "Frontend Developer", status: "completed", createdAt: "2025-11-01", isActive: false, cancelledBy: "" },
    //         { jobTitle: "Backend Developer", status: "inProcess", createdAt: "2025-10-30", isActive: true, cancelledBy: "" },
    //         { jobTitle: "Backend Developer", status: "cancelled", createdAt: "2025-10-29", isActive: false, cancelledBy: "Candidate" },
    //         { jobTitle: "UI/UX Designer", status: "completed", createdAt: "2025-10-25", isActive: false, cancelledBy: "" },
    //       ]);
    //       setLoading(false);
    //     }, 800);
    //   }, []);


    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${server}/api/v1/interviewerDashboard/${user.userId}/getInterviewerInterviewStats`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRawData(response.data.data || []);
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

    const uniqueJobs = useMemo(() => [...new Set(rawData.map((r) => r.jobTitle))], [rawData]);

    const { filteredData, lineChartData } = useMemo(() => {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - Number(filters.range));
        const filtered = rawData.filter((item) => {
            const matchStatus = filters.status ? item.status === filters.status : true;
            const matchJobTitle = filters.jobTitle ? item.jobTitle === filters.jobTitle : true;
            const matchIsActive = filters.isActive !== "" ? item.isActive === (filters.isActive === "true") : true;
            const matchCancelledBy = filters.cancelledBy ? item.cancelledBy === filters.cancelledBy : true;
            const matchDate = new Date(item.createdAt) >= fromDate;
            return matchStatus && matchJobTitle && matchIsActive && matchCancelledBy && matchDate;
        });

        const grouped = {};
        const lineMap = {};
        for (const item of filtered) {
            const job = item.jobTitle;
            const status = item.status;
            const date = new Date(item.createdAt).toISOString().split("T")[0];

            if (!grouped[job]) grouped[job] = { jobTitle: job, scheduled: 0, inProcess: 0, completed: 0, cancelled: 0 };
            grouped[job][status]++;

            if (!lineMap[date]) lineMap[date] = { date, scheduled: 0, inProcess: 0, completed: 0, cancelled: 0 };
            lineMap[date][status]++;
        }

        return {
            filteredData: Object.values(grouped),
            lineChartData: Object.values(lineMap).sort((a, b) => new Date(a.date) - new Date(b.date)),
        };
    }, [rawData, filters]);

    const pieChartData = useMemo(
        () => [
            { name: "Scheduled", value: filteredData.reduce((a, b) => a + (b.scheduled || 0), 0) },
            { name: "In Process", value: filteredData.reduce((a, b) => a + (b.inProcess || 0), 0) },
            { name: "Completed", value: filteredData.reduce((a, b) => a + (b.completed || 0), 0) },
            { name: "Cancelled", value: filteredData.reduce((a, b) => a + (b.cancelled || 0), 0) },
        ],
        [filteredData]
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((p) => ({ ...p, [name]: value }));
    };

    const resetFilters = () =>
        setFilters({
            status: "",
            jobTitle: "",
            isActive: "",
            cancelledBy: "",
            range: "7",
            chartType: "bar",
        });

    const exportPDF = () => {
        if (!filteredData.length && !lineChartData.length) return;
        const doc = new jsPDF();
        doc.text(`Interview Stats - Last ${filters.range} Days`, 14, 14);
        const headers = filters.chartType === "line"
            ? [["Date", "Scheduled", "In Process", "Completed", "Cancelled"]]
            : [["Job Title", "Scheduled", "In Process", "Completed", "Cancelled"]];
        const dataToExport = filters.chartType === "line" ? lineChartData : filteredData;
        const body = dataToExport.map((item) => [
            filters.chartType === "line" ? item.date : item.jobTitle,
            item.scheduled || 0,
            item.inProcess || 0,
            item.completed || 0,
            item.cancelled || 0,
        ]);
        autoTable(doc, { head: headers, body });
        doc.save(`interview-stats-${filters.range}-days.pdf`);
    };

    const csvData = useMemo(() => {
        const dataToExport = filters.chartType === "line" ? lineChartData : filteredData;
        return dataToExport.map((item) => ({
            [filters.chartType === "line" ? "Date" : "Job Title"]: filters.chartType === "line" ? item.date : item.jobTitle,
            Scheduled: item.scheduled || 0,
            "In Process": item.inProcess || 0,
            Completed: item.completed || 0,
            Cancelled: item.cancelled || 0,
        }));
    }, [filteredData, lineChartData, filters.chartType]);

    const renderChart = () => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-2 text-muted">Loading interview data...</p>
                </div>
            );
        }

        if (!filteredData.length) {
            return <div className="text-center py-5 text-muted">No data available for selected filters.</div>;
        }

        return (
            <div style={{ minHeight: 420 }} className="p-3">
                <svg style={{ position: "absolute", width: 0, height: 0 }}>
                    <GradientDefs />
                </svg>

                <ResponsiveContainer width="100%" height={400}>
                    {filters.chartType === "bar" && (
                        <BarChart data={filteredData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                            <XAxis dataKey="jobTitle" tick={{ fill: "#374151" }} />
                            <YAxis tick={{ fill: "#374151" }} />
                            <Tooltip content={<TooltipCard />} />
                            <Legend verticalAlign="top" />
                            <Bar dataKey="scheduled" name="Scheduled" fill="url(#grad-scheduled)" radius={[6, 6, 0, 0]} animationDuration={900} />
                            <Bar dataKey="inProcess" name="In Process" fill="url(#grad-inProcess)" radius={[6, 6, 0, 0]} animationDuration={900} />
                            <Bar dataKey="completed" name="Completed" fill="url(#grad-completed)" radius={[6, 6, 0, 0]} animationDuration={900} />
                            <Bar dataKey="cancelled" name="Cancelled" fill="url(#grad-cancelled)" radius={[6, 6, 0, 0]} animationDuration={900} />
                        </BarChart>
                    )}

                    {filters.chartType === "line" && (
                        <LineChart data={lineChartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                            <XAxis dataKey="date" tick={{ fill: "#374151" }} />
                            <YAxis tick={{ fill: "#374151" }} />
                            <Tooltip content={<TooltipCard />} />
                            <Legend verticalAlign="top" />
                            <Line type="monotone" dataKey="scheduled" stroke={ACCENTS[0]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} animationDuration={1200} />
                            <Line type="monotone" dataKey="inProcess" stroke={ACCENTS[1]} strokeWidth={2} dot={{ r: 3 }} animationDuration={1200} />
                            <Line type="monotone" dataKey="completed" stroke={ACCENTS[2]} strokeWidth={2} dot={{ r: 3 }} animationDuration={1200} />
                            <Line type="monotone" dataKey="cancelled" stroke={ACCENTS[3]} strokeWidth={2} dot={{ r: 3 }} animationDuration={1200} />
                        </LineChart>
                    )}

                    {filters.chartType === "pie" && (
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                innerRadius={55}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                                animationDuration={900}
                            >
                                {pieChartData.map((entry, i) => (
                                    <Cell key={i} fill={ACCENTS[i % ACCENTS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<TooltipCard />} />
                            <Legend verticalAlign="bottom" />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <div className="container-fluid px-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h3 className="fw-bold text-dark" style={{ background: `linear-gradient(90deg, ${THEME_START}, ${THEME_END})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    <i className="fas fa-chart-line me-2" style={{ color: THEME_END }}></i>
                    Interview Analytics
                </h3>

                <div className="d-flex gap-2">
                    <CSVLink
                        data={csvData}
                        filename={`interview-stats-${filters.range}-days.csv`}
                        className="btn btn-sm btn-gradient"
                        style={{
                            background: `linear-gradient(90deg, ${THEME_END}, ${THEME_START})`,
                            color: "#fff",
                            border: "none",
                            fontWeight: 600,
                        }}
                    >
                        <i className="fas fa-file-csv me-1"></i> Export CSV
                    </CSVLink>

                    <button
                        onClick={exportPDF}
                        className="btn btn-sm"
                        style={{
                            background: "linear-gradient(90deg, #e74a3b, #f6c23e)",
                            color: "#fff",
                            border: "none",
                            fontWeight: 600,
                        }}
                    >
                        <i className="fas fa-file-pdf me-1"></i> Export PDF
                    </button>
                </div>
            </div>

            <div className="card shadow-sm mb-4 border-0 rounded-4 hover-card" style={{ overflow: "hidden" }}>
                <div className="card-header text-white rounded-top-4" style={{ background: `linear-gradient(90deg, ${THEME_START}, ${THEME_END})` }}>
                    <h6 className="m-0 fw-semibold">Filters</h6>
                </div>

                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary">Time Range</label>
                            <select name="range" className="form-select form-select-sm" onChange={handleChange} value={filters.range}>
                                <option value="7">Last 7 Days</option>
                                <option value="30">Last 30 Days</option>
                                <option value="90">Last 90 Days</option>
                                <option value="365">Last 1 Year</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary">Chart Type</label>
                            <select name="chartType" className="form-select form-select-sm" onChange={handleChange} value={filters.chartType}>
                                <option value="bar">Bar Chart</option>
                                <option value="pie">Pie Chart</option>
                                <option value="line">Line Chart</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary">Job Title</label>
                            <select name="jobTitle" className="form-select form-select-sm" onChange={handleChange} value={filters.jobTitle}>
                                <option value="">All Positions</option>
                                {uniqueJobs.map((j, i) => (
                                    <option key={i} value={j}>{j}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3 d-flex align-items-end">
                            <button
                                onClick={resetFilters}
                                className="btn btn-sm text-white fw-semibold w-100"
                                style={{ background: `linear-gradient(90deg, ${THEME_END}, ${THEME_START})`, border: "none" }}
                            >
                                <i className="fas fa-undo me-1"></i> Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm rounded-4 mb-4 hover-card" style={{ filter: "url(#softShadow)" }}>
                {renderChart()}
                <div className="card-footer bg-white text-muted small">
                    Showing data for last {filters.range} days • Updated: {new Date().toLocaleString()}
                </div>
            </div>

            <div className="row mt-4">
                <InterviewerRecentInterviews interviewsList={rawData} />
                <InterviewerUpcomingInterviews interviewsList={rawData} />
            </div>

            <style>{`
        .hover-card { transition: transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out; }
        .hover-card:hover { transform: translateY(-6px); box-shadow: 0 10px 30px rgba(78,115,223,0.12); }
        .btn-gradient { transition: transform 0.12s ease, opacity 0.12s ease; }
        .btn-gradient:hover { transform: translateY(-2px); opacity: 0.95; }
      `}</style>
        </div>
    );
};

export default InterviewerInterviewStatusGraph;