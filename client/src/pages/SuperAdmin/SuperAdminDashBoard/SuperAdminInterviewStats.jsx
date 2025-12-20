// import { useEffect, useMemo, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useAuthContext } from "../../../context/auth-context";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { CSVLink } from "react-csv";
// import SuperAdminRecentInterviews from "./SuperAdminRecentInterviews";
// import SuperAdminUpcomingInterviews from "./SuperAdminUpcomingInterviews";
// import SuperAdminDueInterview from "./SuperAdminDueInterview";

// // Modern vibrant color palette
// const COLORS = [
//     '#4F46E5', // Indigo (Modern primary)
//     '#10B981', // Emerald (Fresh green)
//     '#3B82F6', // Blue (Bright and clean)
//     '#EF4444', // Rose Red (Modern red)
// ];

// const SuperAdminInterviewStats = () => {
//     const { server, token } = useAuthContext();

//     const [rawData, setRawData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [filters, setFilters] = useState({
//         status: "",
//         jobTitle: "",
//         isActive: "",
//         cancelledBy: "",
//         range: "7",
//         chartType: "bar"
//     });

//     const getInterviewdata = async () => {
//         setLoading(true)
//         try {
//             const response = await axios.get(`${server}/api/v1/superadminDashboard/getSuperAdminInterviewStats`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );
//             setRawData(response.data.data);
//         } catch (error) {
//             console.error("Error fetching interview data:", error);
//         }
//         finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         getInterviewdata();
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
//             const matchDate = new Date(item.createdAt) >= fromDate;

//             return matchStatus && matchJobTitle && matchIsActive && matchDate;
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
//                 <SuperAdminRecentInterviews interviewsList={rawData} />
//                 <SuperAdminUpcomingInterviews interviewsList={rawData} />
//                 <SuperAdminDueInterview interviewsList={rawData} />
//             </div>
//         </div>
//     );
// };

// export default SuperAdminInterviewStats;













import { useState, useEffect, useMemo, useRef } from "react";
import { useAuthContext } from "../../../context/auth-context";
import SuperAdminRecentInterviews from "./SuperAdminRecentInterviews";
import SuperAdminUpcomingInterviews from "./SuperAdminUpcomingInterviews";
import SuperAdminDueInterview from "./SuperAdminDueInterview";
import { CSVLink } from "react-csv";
import axios from "axios";
import {
    FiCalendar,
    FiClock,
    FiChevronDown,
    FiFile,
    FiFilter,
    FiAlertTriangle,
    FiLoader,
    FiRefreshCw,
    FiTrendingUp,
    FiCheckCircle,
    FiBarChart,
    FiPieChart,
    FiGitBranch,
    FiMapPin,
    FiShield,
    FiList,
    FiUser,
    FiMail,
    FiPhone,
    FiX,
} from "react-icons/fi";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ReTooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// Data from the original component
const COLORS = ["#4F46E5", "#10B981", "#3B82F6", "#EF4444"];

// Component
const SuperAdminInterviewStats = () => {
    const { server, token } = useAuthContext();

    const [rawData, setRawData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [timelineFilteredData, setTimelineFilteredData] = useState([]);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [selectedTimeline, setSelectedTimeline] = useState("monthly");
    const [showTimelineDropdown, setShowTimelineDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);

    // Filters
    const [filters, setFilters] = useState({
        status: "",
        jobTitle: "",
        isActive: "",
        chartType: "bar",
    });

    const getInterviewdata = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${server}/api/v1/superadminDashboard/getSuperAdminInterviewStats`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setRawData(response.data.data);
        } catch (error) {
            console.error("Error fetching interview data:", error);
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getInterviewdata();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const onDoc = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowTimelineDropdown(false);
            }
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    // Get unique values for filters
    const uniqueJobs = useMemo(() => {
        try {
            return [...new Set(rawData.map((r) => r.jobTitle).filter(Boolean))];
        } catch {
            return [];
        }
    }, [rawData]);

    const uniqueCompanies = useMemo(() => {
        try {
            return [...new Set(rawData.map((r) => r.companyName).filter(Boolean))];
        } catch {
            return [];
        }
    }, [rawData]);

    // Apply filters
    useEffect(() => {
        let temp = [...rawData];
        if (filters.status) temp = temp.filter((c) => c.status === filters.status);
        if (filters.jobTitle) temp = temp.filter((c) => c.jobTitle === filters.jobTitle);
        if (filters.isActive !== "") {
            const isActive = filters.isActive === "true";
            temp = temp.filter((c) => c.isActive === isActive);
        }
        setFilteredData(temp);
    }, [rawData, filters]);

    // Timeline filtering
    useEffect(() => {
        const now = new Date();
        let temp = [...filteredData];
        const days = selectedTimeline === "daily" ? 7 :
            selectedTimeline === "weekly" ? 28 :
                selectedTimeline === "monthly" ? 180 :
                    selectedTimeline === "yearly" ? 365 : 30;

        const fromDate = new Date(now);
        fromDate.setDate(now.getDate() - days);

        temp = temp.filter(
            (c) => c.createdAt && new Date(c.createdAt) >= fromDate
        );

        setTimelineFilteredData(temp);
        if (temp.length > 0 && !temp.find((t) => t._id === selectedInterview?._id)) {
            setSelectedInterview(temp[0] || null);
        }
    }, [filteredData, selectedTimeline, selectedInterview]);

    // Data processing for charts
    const { groupedForBar, timeSeries } = useMemo(() => {
        // Group by job title for bar chart
        const grouped = {};
        timelineFilteredData.forEach((it) => {
            const job = it.jobTitle || "Other";
            if (!grouped[job]) grouped[job] = { jobTitle: job, scheduled: 0, inProcess: 0, completed: 0, cancelled: 0 };
            grouped[job][it.status] = (grouped[job][it.status] || 0) + 1;
        });

        // Time series data
        const seriesMap = {};
        timelineFilteredData.forEach((it) => {
            const dateKey = it.createdAt ? it.createdAt.split("T")[0] : "unknown";
            if (!seriesMap[dateKey]) seriesMap[dateKey] = { date: dateKey, scheduled: 0, inProcess: 0, completed: 0, cancelled: 0 };
            seriesMap[dateKey][it.status] = (seriesMap[dateKey][it.status] || 0) + 1;
        });

        const timeSeriesArr = Object.values(seriesMap).sort((a, b) => new Date(a.date) - new Date(b.date));
        return { groupedForBar: Object.values(grouped), timeSeries: timeSeriesArr };
    }, [timelineFilteredData]);

    // Pie data
    const pieData = useMemo(() => {
        const totals = { scheduled: 0, inProcess: 0, completed: 0, cancelled: 0 };
        (groupedForBar || []).forEach((g) => {
            totals.scheduled += g.scheduled || 0;
            totals.inProcess += g.inProcess || 0;
            totals.completed += g.completed || 0;
            totals.cancelled += g.cancelled || 0;
        });
        return [
            { name: "Scheduled", value: totals.scheduled },
            { name: "In Process", value: totals.inProcess },
            { name: "Completed", value: totals.completed },
            { name: "Cancelled", value: totals.cancelled },
        ];
    }, [groupedForBar]);

    // Company data for chart
    const getCompanyData = () => {
        if (!timelineFilteredData || timelineFilteredData.length === 0) {
            return [];
        }
        const map = {};
        timelineFilteredData.forEach((c) => {
            if (c.companyName) map[c.companyName] = (map[c.companyName] || 0) + 1;
        });

        return Object.keys(map).map((company) => ({
            name: company,
            value: map[company]
        }));
    };

    // Timeline data - Fixed version
    const getTimelineData = () => {
        if (!timelineFilteredData || timelineFilteredData.length === 0)
            return [];

        const now = new Date();
        const data = [];

        if (selectedTimeline === "daily") {
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                const start = new Date(d);
                start.setHours(0, 0, 0, 0);
                const end = new Date(d);
                end.setHours(23, 59, 59, 999);

                const count = timelineFilteredData.filter(
                    (c) =>
                        c.createdAt &&
                        new Date(c.createdAt) >= start &&
                        new Date(c.createdAt) <= end
                ).length;

                data.push({ date: dateStr, count });
            }
        } else if (selectedTimeline === "weekly") {
            for (let i = 3; i >= 0; i--) {
                const start = new Date(now);
                start.setDate(now.getDate() - (i * 7 + 6));
                start.setHours(0, 0, 0, 0);
                const end = new Date(start);
                end.setDate(start.getDate() + 6);
                end.setHours(23, 59, 59, 999);

                const count = timelineFilteredData.filter(
                    (c) =>
                        c.createdAt &&
                        new Date(c.createdAt) >= start &&
                        new Date(c.createdAt) <= end
                ).length;

                data.push({ date: `W${4 - i}`, count });
            }
        } else if (selectedTimeline === "monthly") {
            const months = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now);
                d.setMonth(now.getMonth() - i);

                const count = timelineFilteredData.filter(
                    (c) =>
                        c.createdAt &&
                        new Date(c.createdAt).getMonth() === d.getMonth() &&
                        new Date(c.createdAt).getFullYear() === d.getFullYear()
                ).length;

                data.push({ date: months[d.getMonth()], count });
            }
        } else {
            for (let i = 4; i >= 0; i--) {
                const y = now.getFullYear() - i;

                const count = timelineFilteredData.filter(
                    (c) => c.createdAt && new Date(c.createdAt).getFullYear() === y
                ).length;

                data.push({ date: String(y), count });
            }
        }

        return data;
    };

    // Helper functions
    const getTimelineLabel = () => {
        switch (selectedTimeline) {
            case "daily": return "Daily";
            case "weekly": return "Weekly";
            case "monthly": return "Monthly";
            case "yearly": return "Yearly";
            default: return "Monthly";
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((s) => ({ ...s, [name]: value }));
    };

    const resetFilters = () => {
        setFilters({
            status: "",
            jobTitle: "",
            isActive: "",
            chartType: "bar",
        });
    };

    // CSV data for export
    const csvRows = useMemo(() => {
        if (!timelineFilteredData.length) return [];
        return timelineFilteredData.map((g) => ({
            CandidateName: g.candidateName,
            Company: g.companyName,
            JobTitle: g.jobTitle,
            Interviewer: g.interviewerName,
            Status: g.status,
            Date: g.start ? new Date(g.start).toLocaleDateString() : "N/A",
            Time: g.start ? new Date(g.start).toLocaleTimeString() : "N/A",
            LinkSent: g.isLinkSent ? "Yes" : "No",
        }));
    }, [timelineFilteredData]);

    // Render main chart
    const renderMainChart = () => {
        if (isLoading) {
            return <div className="text-center py-5 text-muted">Loading chart...</div>;
        }

        if (filters.chartType === "bar") {
            if (!groupedForBar.length) return <div className="text-center py-4 text-muted">No data</div>;
            return (
                <ResponsiveContainer width="100%" height={360}>
                    <BarChart data={groupedForBar}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="jobTitle" />
                        <YAxis allowDecimals={false} />
                        <ReTooltip />
                        <Legend />
                        <Bar dataKey="scheduled" stackId="a" fill={COLORS[0]} />
                        <Bar dataKey="inProcess" stackId="a" fill={COLORS[1]} />
                        <Bar dataKey="completed" stackId="a" fill={COLORS[2]} />
                        <Bar dataKey="cancelled" stackId="a" fill={COLORS[3]} />
                    </BarChart>
                </ResponsiveContainer>
            );
        }

        if (filters.chartType === "line") {
            if (!timeSeries.length) return <div className="text-center py-4 text-muted">No data</div>;
            return (
                <ResponsiveContainer width="100%" height={360}>
                    <LineChart data={timeSeries}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <ReTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="scheduled" stroke={COLORS[0]} />
                        <Line type="monotone" dataKey="inProcess" stroke={COLORS[1]} />
                        <Line type="monotone" dataKey="completed" stroke={COLORS[2]} />
                        <Line type="monotone" dataKey="cancelled" stroke={COLORS[3]} />
                    </LineChart>
                </ResponsiveContainer>
            );
        }

        // Pie chart
        if (!pieData.some((p) => p.value > 0)) return <div className="text-center py-4 text-muted">No data</div>;
        return (
            <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={120} label>
                        {pieData.map((entry, idx) => (
                            <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                        ))}
                    </Pie>
                    <ReTooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="container-fluid">
            {/* Inline styles */}
            <style>{`
        .chart-card { background: #fff; border-radius: 10px; padding: 1rem; border:1px solid #e6e9ef; box-shadow: 0 6px 18px rgba(20,20,40,0.04); }
        .stat-card { background:#fff; border-radius:8px; padding: 0.75rem; border:1px solid #e6e9ef; box-shadow: 0 6px 18px rgba(20,20,40,0.03); }
        .timeline-indicator { position:absolute; right:12px; top:10px; background:#ef4444; color:#fff; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px; box-shadow: 0 4px 10px rgba(239,68,68,0.2); }
        .timeline-dropdown { position: relative; display:inline-block; }
        .timeline-menu-centered {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 160px;
          z-index: 1200;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(18,24,40,0.12);
          border: 1px solid rgba(16,24,40,0.06);
          padding: 6px;
        }
        .timeline-menu-centered .dropdown-item {
          width: 100%;
          text-align: left;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 6px;
          background: transparent;
          border: none;
        }
        .timeline-menu-centered .dropdown-item:hover { background: linear-gradient(90deg, rgba(102,126,234,0.08), rgba(124,58,237,0.06)); }
        .btn-gradient {
          background: linear-gradient(135deg,#667eea,#764ba2);
          color: white;
          border: none;
          box-shadow: 0 6px 18px rgba(103,58,183,0.12);
        }
        .btn-gradient:active { transform: translateY(1px); }
        .small-muted { color: #6b7280; font-size: 0.9rem; }
        .interview-card { cursor: pointer; transition: all 0.2s; }
        .interview-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .interview-card.selected { border-left: 4px solid #4F46E5; }
        .status-badge { font-size: 0.75rem; padding: 0.25rem 0.5rem; }
      `}</style>

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="mb-0">Interview Analytics</h4>
                    <small className="small-muted">Overview of scheduled / completed / cancelled interviews</small>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <div className="timeline-dropdown me-2" ref={dropdownRef}>
                        <button
                            className="btn btn-sm btn-gradient d-flex align-items-center gap-2"
                            onClick={() => setShowTimelineDropdown((s) => !s)}
                            aria-expanded={showTimelineDropdown}
                        >
                            <FiClock /> <span>{getTimelineLabel()}</span> <FiChevronDown />
                        </button>

                        {showTimelineDropdown && (
                            <div className="timeline-menu-centered" role="menu">
                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        setSelectedTimeline("daily");
                                        setShowTimelineDropdown(false);
                                    }}
                                >
                                    Daily
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        setSelectedTimeline("weekly");
                                        setShowTimelineDropdown(false);
                                    }}
                                >
                                    Weekly
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        setSelectedTimeline("monthly");
                                        setShowTimelineDropdown(false);
                                    }}
                                >
                                    Monthly
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        setSelectedTimeline("yearly");
                                        setShowTimelineDropdown(false);
                                    }}
                                >
                                    Yearly
                                </button>
                            </div>
                        )}
                    </div>

                    <CSVLink className="btn btn-sm btn-success" data={csvRows} filename={`interview-stats-${new Date().toISOString().slice(0, 10)}.csv`}>
                        <FiFile /> Export CSV
                    </CSVLink>
                </div>
            </div>

            {/* Error / Loading */}
            {error && (
                <div className="alert alert-danger">
                    <FiAlertTriangle /> {error}
                </div>
            )}
            {isLoading && (
                <div className="text-center py-3">
                    <FiLoader /> Loading...
                </div>
            )}

            {!isLoading && (
                <>
                    {/* Stat cards */}
                    <div className="row g-3 mb-3">
                        <div className="col-6 col-md-3">
                            <div className="stat-card d-flex gap-3 align-items-center">
                                <div className="stat-icon bg-primary text-white rounded p-2">
                                    <FiCalendar />
                                </div>
                                <div>
                                    <div className="h5 mb-0">{timelineFilteredData.length}</div>
                                    <small className="text-muted">TOTAL</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-card d-flex gap-3 align-items-center">
                                <div className="stat-icon bg-success text-white rounded p-2">
                                    <FiCheckCircle />
                                </div>
                                <div>
                                    <div className="h5 mb-0">
                                        {timelineFilteredData.filter((c) => c.status === "completed").length}
                                    </div>
                                    <small className="text-muted">COMPLETED</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-card d-flex gap-3 align-items-center">
                                <div className="stat-icon bg-info text-white rounded p-2">
                                    <FiTrendingUp />
                                </div>
                                <div>
                                    <div className="h5 mb-0">
                                        {timelineFilteredData.filter((c) => c.status === "scheduled").length}
                                    </div>
                                    <small className="text-muted">SCHEDULED</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-card d-flex gap-3 align-items-center">
                                <div className="stat-icon bg-warning text-white rounded p-2">
                                    <FiClock />
                                </div>
                                <div>
                                    <div className="h5 mb-0">
                                        {timelineFilteredData.filter((c) => c.status === "inProcess").length}
                                    </div>
                                    <small className="text-muted">IN PROCESS</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="card mb-3 p-3">
                        <div className="row g-3 align-items-end">
                            <div className="col-md-3">
                                <label className="form-label small">Chart Type</label>
                                <select className="form-select" name="chartType" value={filters.chartType} onChange={handleFilterChange}>
                                    <option value="bar">Bar (stacked)</option>
                                    <option value="line">Line (time-series)</option>
                                    <option value="pie">Pie (summary)</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Status</label>
                                <select className="form-select" name="status" value={filters.status} onChange={handleFilterChange}>
                                    <option value="">All</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="inProcess">In Process</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Job Title</label>
                                <select className="form-select" name="jobTitle" value={filters.jobTitle} onChange={handleFilterChange}>
                                    <option value="">All</option>
                                    {uniqueJobs.map((j) => <option key={j} value={j}>{j}</option>)}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Active</label>
                                <select className="form-select" name="isActive" value={filters.isActive} onChange={handleFilterChange}>
                                    <option value="">All</option>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <button className="btn btn-outline-secondary" onClick={resetFilters}>
                                <FiRefreshCw /> Reset
                            </button>
                            <small className="text-muted">
                                {timelineFilteredData.length} of {filteredData.length} interviews in {getTimelineLabel().toLowerCase()} view
                            </small>
                        </div>
                    </div>

                    {/* Main chart */}
                    <div className="chart-card mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <h6 className="mb-0">Overview</h6>
                                <small className="small-muted">Interactive chart — switch chart type or filters</small>
                            </div>
                            <div className="small-muted">Showing results for last {getTimelineLabel().toLowerCase()}</div>
                        </div>

                        <div style={{ minHeight: 380 }}>
                            {renderMainChart()}
                        </div>
                    </div>

                    {/* Additional charts */}
                    <div className="row">
                        <div className="col-lg-6 mb-3">
                            <div className="chart-card position-relative">
                                <h6 className="mb-2">
                                    <FiPieChart /> Company Distribution{" "}
                                    <span className="timeline-indicator">
                                        {timelineFilteredData.length}
                                    </span>
                                </h6>
                                <div style={{ height: 220 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={getCompanyData()}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {getCompanyData().map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <ReTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                            <div className="chart-card position-relative">
                                <h6 className="mb-2">
                                    <FiTrendingUp /> Timeline{" "}
                                    <span className="timeline-indicator">
                                        {timelineFilteredData.length}
                                    </span>
                                </h6>
                                <div style={{ height: 220 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={getTimelineData()}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <ReTooltip />
                                            <Line type="monotone" dataKey="count" stroke="#4F46E5" fill="#4F46E5" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interview list and details */}
                    <div className="row">
                        <div className="col-lg-6 mb-3">
                            <div className="chart-card">
                                <h6 className="mb-3">
                                    <FiList /> Interviews ({timelineFilteredData.length})
                                </h6>
                                <div style={{ maxHeight: 340, overflowY: "auto" }}>
                                    {timelineFilteredData.map((interview) => (
                                        <div
                                            key={interview._id}
                                            className={`interview-card d-flex align-items-center gap-3 p-2 mb-2 border rounded ${selectedInterview && selectedInterview._id === interview._id
                                                ? "selected bg-light"
                                                : "bg-white"
                                                }`}
                                            onClick={() => setSelectedInterview(interview)}
                                        >
                                            <div className="flex-grow-1">
                                                <div style={{ fontWeight: 700 }}>{interview.candidateName}</div>
                                                <div className="small-muted">
                                                    {interview.companyName} • {interview.jobTitle}
                                                </div>
                                                <div className="small-muted">
                                                    {interview.start ? new Date(interview.start).toLocaleDateString() : "N/A"} • {interview.interviewerName}
                                                </div>
                                            </div>
                                            <div>
                                                <span className={`status-badge badge ${interview.status === "completed" ? "bg-success" :
                                                    interview.status === "scheduled" ? "bg-info" :
                                                        interview.status === "inProcess" ? "bg-warning" :
                                                            "bg-danger"
                                                    }`}>
                                                    {interview.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                            <div className="chart-card">
                                {selectedInterview ? (
                                    <>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="mb-0">{selectedInterview.candidateName}</h5>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setSelectedInterview(null)}
                                            >
                                                <FiX />
                                            </button>
                                        </div>

                                        <h6 className="mb-2">Interview Details</h6>
                                        <table className="table table-borderless small mb-3">
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: "35%" }}>Company</td>
                                                    <td>{selectedInterview.companyName}</td>
                                                </tr>
                                                <tr>
                                                    <td>Job Title</td>
                                                    <td>{selectedInterview.jobTitle}</td>
                                                </tr>
                                                <tr>
                                                    <td>Interviewer</td>
                                                    <td>{selectedInterview.interviewerName}</td>
                                                </tr>
                                                <tr>
                                                    <td>Date</td>
                                                    <td>
                                                        {selectedInterview.start
                                                            ? new Date(selectedInterview.start).toLocaleDateString()
                                                            : "N/A"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Time</td>
                                                    <td>
                                                        {selectedInterview.start
                                                            ? new Date(selectedInterview.start).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })
                                                            : "N/A"}{" "}
                                                        -{" "}
                                                        {selectedInterview.end
                                                            ? new Date(selectedInterview.end).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })
                                                            : "N/A"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Status</td>
                                                    <td>
                                                        <span className={`badge ${selectedInterview.status === "completed" ? "bg-success" :
                                                            selectedInterview.status === "scheduled" ? "bg-info" :
                                                                selectedInterview.status === "inProcess" ? "bg-warning" :
                                                                    "bg-danger"
                                                            }`}>
                                                            {selectedInterview.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Active</td>
                                                    <td>
                                                        <span className={`badge ${selectedInterview.isActive ? "bg-success" : "bg-secondary"}`}>
                                                            {selectedInterview.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Link Sent</td>
                                                    <td>
                                                        <span className={`badge ${selectedInterview.isLinkSent ? "bg-success" : "bg-secondary"}`}>
                                                            {selectedInterview.isLinkSent ? "Yes" : "No"}
                                                        </span>
                                                    </td>
                                                </tr>
                                                {selectedInterview.status === "cancelled" && (
                                                    <tr>
                                                        <td>Cancelled By</td>
                                                        <td>{selectedInterview.cancelledBy || "N/A"}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <FiCalendar size={40} className="text-muted" />
                                        <h6 className="mt-2">Select an Interview</h6>
                                        <p className="text-muted small">
                                            Choose an interview from the list to view details
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="row mt-4">
                <SuperAdminRecentInterviews interviewsList={rawData} />
                <SuperAdminUpcomingInterviews interviewsList={rawData} />
                <SuperAdminDueInterview interviewsList={rawData} />
            </div>
        </div>
    );
}

export default SuperAdminInterviewStats;