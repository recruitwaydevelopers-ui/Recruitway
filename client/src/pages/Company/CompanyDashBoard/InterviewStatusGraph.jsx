// import { useEffect, useMemo, useState } from "react";
// import {
//     BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
//     ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
// } from "recharts";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useAuthContext } from "../../../context/auth-context";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { CSVLink } from "react-csv";
// import RecentInterviews from "./RecentInterviews";
// import UpcomingInterviews from "./UpcomingInterviews";

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

// const InterviewStatusGraph = () => {
//     const { server, user, token } = useAuthContext();
//     // const token = localStorage.getItem("token");

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
//             const response = await axios.get(`${server}/api/v1/companyDashboard/${user.userId}/getInterviewStats`,
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
//                                 formatter={(value, name, props) => [`${value} (${(props.payload.percent * 100).toFixed(1)}%)`, name]}
//                                 contentStyle={{
//                                     borderRadius: '0.35rem',
//                                     border: '1px solid #e3e6f0',
//                                     backgroundColor: '#fff'
//                                 }}
//                             />
//                             <Legend
//                                 layout="vertical"
//                                 verticalAlign="middle"
//                                 align="right"
//                             />
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
//                 <RecentInterviews interviewsList={rawData} />
//                 <UpcomingInterviews interviewsList={rawData} />
//             </div>
//         </div>
//     );
// };

// export default InterviewStatusGraph;












import { useEffect, useMemo, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/auth-context";
import RecentInterviews from "./RecentInterviews";
import UpcomingInterviews from "./UpcomingInterviews";

// 🌊 Unified gradient blue theme
const COLORS = ["#4e73df", "#36b9cc", "#1cc88a", "#e74a3b"];

const InterviewStatusGraph = () => {
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

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${server}/api/v1/companyDashboard/${user.userId}/getInterviewStats`,
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

    const uniqueJobs = useMemo(() => [...new Set(rawData.map((i) => i.jobTitle))], [rawData]);

    const { filteredData, lineChartData } = useMemo(() => {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - Number(filters.range));

        const filtered = rawData.filter((item) => {
            const matchStatus = filters.status ? item.status === filters.status : true;
            const matchJobTitle = filters.jobTitle ? item.jobTitle === filters.jobTitle : true;
            const matchIsActive =
                filters.isActive !== "" ? item.isActive === (filters.isActive === "true") : true;
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

            if (!grouped[job]) {
                grouped[job] = { jobTitle: job, scheduled: 0, inProcess: 0, completed: 0, cancelled: 0 };
            }
            grouped[job][status]++;

            if (!lineMap[date]) {
                lineMap[date] = { date, scheduled: 0, inProcess: 0, completed: 0, cancelled: 0 };
            }
            lineMap[date][status]++;
        }

        return {
            filteredData: Object.values(grouped),
            lineChartData: Object.values(lineMap).sort(
                (a, b) => new Date(a.date) - new Date(b.date)
            ),
        };
    }, [filters, rawData]);

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
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        setFilters({
            status: "",
            jobTitle: "",
            isActive: "",
            cancelledBy: "",
            range: "7",
            chartType: "bar",
        });
    };

    const exportPDF = () => {
        if (!filteredData.length) return;

        const doc = new jsPDF();
        doc.text(`Interview Stats - Last ${filters.range} Days`, 14, 14);
        const headers =
            filters.chartType === "line"
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
            [filters.chartType === "line" ? "Date" : "Job Title"]:
                filters.chartType === "line" ? item.date : item.jobTitle,
            Scheduled: item.scheduled || 0,
            "In Process": item.inProcess || 0,
            Completed: item.completed || 0,
            Cancelled: item.cancelled || 0,
        }));
    }, [filteredData, lineChartData, filters.chartType]);

    const tooltipStyle = {
        borderRadius: "10px",
        border: "none",
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontSize: "12px",
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 shadow-sm rounded border">
                    <p className="fw-bold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={`tooltip-${index}`} style={{ color: entry.color }} className="mb-0">
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderChart = () => {
        if (loading)
            return (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-2 text-muted">Loading interview data...</p>
                </div>
            );

        if (!filteredData.length)
            return <div className="text-center text-muted py-5">No data available.</div>;

        return (
            <div className="chart-container" style={{ minHeight: "400px" }}>
                <ResponsiveContainer width="100%" height={400}>
                    {filters.chartType === "bar" && (
                        <BarChart data={filteredData}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4e73df" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#36b9cc" stopOpacity={0.6} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e3e6f0" />
                            <XAxis dataKey="jobTitle" tick={{ fill: "#6b7280" }} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="scheduled" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="inProcess" fill="#1cc88a" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="completed" fill="#36b9cc" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="cancelled" fill="#e74a3b" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    )}

                    {filters.chartType === "line" && (
                        <LineChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e3e6f0" />
                            <XAxis dataKey="date" tick={{ fill: "#6b7280" }} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="scheduled" stroke="#4e73df" strokeWidth={3} />
                            <Line type="monotone" dataKey="inProcess" stroke="#1cc88a" strokeWidth={3} />
                            <Line type="monotone" dataKey="completed" stroke="#36b9cc" strokeWidth={3} />
                            <Line type="monotone" dataKey="cancelled" stroke="#e74a3b" strokeWidth={3} />
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
                                outerRadius={130}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip contentStyle={tooltipStyle} />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <div className="container-fluid px-4">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 fw-bold text-primary mb-0">
                    <i className="fas fa-user-clock me-2"></i> Interview Analytics
                </h1>
                <div>
                    <CSVLink
                        data={csvData}
                        filename={`interview-stats-${filters.range}-days.csv`}
                        className="btn btn-sm text-white fw-semibold me-2"
                        style={{
                            background: "linear-gradient(90deg, #36b9cc, #4e73df)",
                            border: "none",
                        }}
                    >
                        <i className="fas fa-file-csv me-1"></i> Export CSV
                    </CSVLink>
                    <button
                        className="btn btn-sm text-white fw-semibold"
                        style={{
                            background: "linear-gradient(90deg, #e74a3b, #f6c23e)",
                            border: "none",
                        }}
                        onClick={exportPDF}
                        disabled={!filteredData.length}
                    >
                        <i className="fas fa-file-pdf me-1"></i> Export PDF
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div
                    className="card-header text-white rounded-top-4"
                    style={{ background: "linear-gradient(90deg, #4e73df, #36b9cc)" }}
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
                                onChange={handleChange}
                                value={filters.range}
                            >
                                <option value="7">Last 7 Days</option>
                                <option value="30">Last 30 Days</option>
                                <option value="90">Last 90 Days</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary">Chart Type</label>
                            <select
                                name="chartType"
                                className="form-select form-select-sm"
                                onChange={handleChange}
                                value={filters.chartType}
                            >
                                <option value="bar">Bar</option>
                                <option value="pie">Pie</option>
                                <option value="line">Line</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary">Job Title</label>
                            <select
                                name="jobTitle"
                                className="form-select form-select-sm"
                                onChange={handleChange}
                                value={filters.jobTitle}
                            >
                                <option value="">All Jobs</option>
                                {uniqueJobs.map((job) => (
                                    <option key={job}>{job}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3 d-flex align-items-end">
                            <button
                                className="btn btn-sm text-white fw-semibold w-100"
                                style={{
                                    background: "linear-gradient(90deg, #36b9cc, #4e73df)",
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

            {/* Chart Card */}
            <div className="card border-0 shadow-sm rounded-4 hover-card">
                <div className="card-body p-3">{renderChart()}</div>
                <div className="card-footer bg-white text-muted small">
                    Showing data for the last {filters.range} days. Updated:{" "}
                    {new Date().toLocaleString()}
                </div>
            </div>

            {/* Interview Lists */}
            <div className="row mt-4">
                <RecentInterviews interviewsList={rawData} />
                <UpcomingInterviews interviewsList={rawData} />
            </div>

            {/* Hover Effect */}
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

export default InterviewStatusGraph;