// import { useEffect, useMemo, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// import axios from "axios";
// import { useAuthContext } from "../../../context/auth-context";
// import toast from "react-hot-toast";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { CSVLink } from "react-csv";

// const COLORS = [
//     '#4F46E5', // Indigo (Modern primary)
//     '#10B981', // Emerald (Fresh green)
//     '#EF4444', // Rose Red (Modern red)
//     '#3B82F6', // Blue (Bright and clean)
//     //   '#8B5CF6', // Violet (Trendy purple)
//     //   '#06B6D4', // Cyan (Cool and calm)
//     //   '#F97316', // Orange (Modern orange)
//     //   '#64748B', // Slate Gray (Neutral for contrast)
// ];

// const JobApplicationStats = () => {
//     const { server, user, token } = useAuthContext();
//     // const token = localStorage.getItem("token");
//     const [allData, setAllData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filters, setFilters] = useState({
//         range: 7,
//         chartType: "bar",
//         jobTitle: ""
//     });

//     const fetchStats = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${server}/api/v1/companyDashboard/${user.userId}/getApplicationStatusStats`, {
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

//     const uniqueJobTitles = useMemo(() => [...new Set(allData.map(item => item.jobTitle))], [allData]);

//     const filteredData = useMemo(() => {
//         const fromDate = new Date();
//         fromDate.setDate(fromDate.getDate() - filters.range);

//         const recent = allData.filter(item => {
//             const inRange = new Date(item.createdAt) >= fromDate;
//             const matchesJob = filters.jobTitle ? item.jobTitle === filters.jobTitle : true;
//             return inRange && matchesJob;
//         });

//         const map = {};
//         for (const item of recent) {
//             const key = item.jobTitle;
//             if (!map[key]) map[key] = {
//                 jobTitle: key,
//                 Applied: 0,
//                 "Interview Scheduled": 0,
//                 Shortlisted: 0,
//                 Rejected: 0
//             };
//             map[key][item.status] = (map[key][item.status] || 0) + 1;
//         }

//         return Object.values(map);
//     }, [allData, filters.range, filters.jobTitle]);

//     const pieChartData = useMemo(() => [
//         { name: "Applied", value: filteredData.reduce((acc, d) => acc + (d.Applied || 0), 0) },
//         { name: "Shortlisted", value: filteredData.reduce((acc, d) => acc + (d.Shortlisted || 0), 0) },
//         { name: "Rejected", value: filteredData.reduce((acc, d) => acc + (d.Rejected || 0), 0) },
//         { name: "Interview Scheduled", value: filteredData.reduce((acc, d) => acc + (d["Interview Scheduled"] || 0), 0) },
//     ], [filteredData]);

//     const exportPDF = () => {
//         if (!filteredData.length) return;

//         const doc = new jsPDF();
//         doc.text(`Job Application Stats - Last ${filters.range} Days`, 14, 14);
//         autoTable(doc, {
//             head: [["Job Title", "Applied", "Interview Scheduled", "Shortlisted", "Rejected"]],
//             body: filteredData.map(row => [
//                 row.jobTitle,
//                 row.Applied || 0,
//                 row["Interview Scheduled"] || 0,
//                 row.Shortlisted || 0,
//                 row.Rejected || 0,
//             ]),
//         });
//         doc.save(`job-application-status-${filters.range}-days.pdf`);
//     };

//     const csvData = useMemo(() => filteredData.map(row => ({
//         "Job Title": row.jobTitle,
//         "Applied": row.Applied || 0,
//         "Interview Scheduled": row["Interview Scheduled"] || 0,
//         "Shortlisted": row.Shortlisted || 0,
//         "Rejected": row.Rejected || 0
//     })), [filteredData]);

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
//                     <div className="spinner-border text-primary" role="status" />
//                     <p className="mt-2 text-muted">Loading application data...</p>
//                 </div>
//             );
//         }

//         if (!filteredData.length) {
//             return (
//                 <div className="text-center text-muted py-5">
//                     No data available for the selected filters.
//                 </div>
//             );
//         }

//         return (
//             <div className="chart-container" style={{ minHeight: '400px' }}>
//                 <ResponsiveContainer width="100%" height={400}>
//                     {filters.chartType === "bar" ? (
//                         <BarChart data={filteredData}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="jobTitle" />
//                             <YAxis allowDecimals={false} />
//                             <Tooltip content={<CustomTooltip />} />
//                             <Legend />
//                             <Bar dataKey="Applied" stackId="a" fill={COLORS[0]} />
//                             <Bar dataKey="Shortlisted" stackId="a" fill={COLORS[1]} />
//                             <Bar dataKey="Rejected" stackId="a" fill={COLORS[2]} />
//                             <Bar dataKey="Interview Scheduled" stackId="a" fill={COLORS[3]} />
//                         </BarChart>
//                     ) : (
//                         <PieChart>
//                             <Pie
//                                 dataKey="value"
//                                 data={pieChartData}
//                                 cx="50%"
//                                 cy="50%"
//                                 outerRadius={150}
//                                 label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                                 labelLine={false}
//                             >
//                                 {pieChartData.map((entry, index) => (
//                                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                 ))}
//                             </Pie>
//                             <Legend />
//                             <Tooltip
//                                 formatter={(value) => [`${value} (${(value / pieChartData.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(1)}%)`]}
//                                 contentStyle={{
//                                     borderRadius: '0.35rem',
//                                     border: '1px solid #e3e6f0',
//                                     backgroundColor: '#fff'
//                                 }}
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
//                 <h1 className="h3 mb-0 text-gray-800">Job Application Status</h1>
//                 <div>
//                     <CSVLink
//                         data={csvData}
//                         filename={`job-application-status-${filters.range}-days.csv`}
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
//                                 className="form-select form-select-sm"
//                                 value={filters.range}
//                                 onChange={(e) => setFilters({ ...filters, range: Number(e.target.value) })}
//                             >
//                                 <option value={7}>Last 7 Days</option>
//                                 <option value={30}>Last 30 Days</option>
//                                 <option value={90}>Last 90 Days</option>
//                                 <option value={365}>Last 1 Year</option>
//                             </select>
//                         </div>
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">Job Title</label>
//                             <select
//                                 className="form-select form-select-sm"
//                                 value={filters.jobTitle}
//                                 onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
//                             >
//                                 <option value="">All Job Titles</option>
//                                 {uniqueJobTitles.map((title, idx) => (
//                                     <option key={idx} value={title}>{title}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">Chart Type</label>
//                             <select
//                                 className="form-select form-select-sm"
//                                 value={filters.chartType}
//                                 onChange={(e) => setFilters({ ...filters, chartType: e.target.value })}
//                             >
//                                 <option value="bar">Bar Chart</option>
//                                 <option value="pie">Pie Chart</option>
//                             </select>
//                         </div>
//                         <div className="col-md-3 d-flex align-items-end">
//                             <button
//                                 className="btn btn-sm btn-outline-secondary w-100"
//                                 onClick={() => setFilters({
//                                     range: 7,
//                                     chartType: "bar",
//                                     jobTitle: ""
//                                 })}
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
//         </div>
//     );
// };

// export default JobApplicationStats;















import { useState, useEffect, useMemo } from "react";
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
import axios from "axios";
import { useAuthContext } from "../../../context/auth-context";
import toast from "react-hot-toast";

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#6366F1", "#8B5CF6", "#EC4899"];

const JobApplicationStats = () => {
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🆕 Added status filter
    const [filters, setFilters] = useState({
        range: 7,
        chartType: "bar",
        positionTitle: "",
        status: "",
    });

    const { server, user, token } = useAuthContext();

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${server}/api/v1/companyDashboard/${user.userId}/getApplicationStatusStats`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAllData(response.data.data || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load data.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Unique job titles
    const uniqueJobTitles = useMemo(
        () => [...new Set(allData.map((item) => item.jobTitle))],
        [allData]
    );

    // Unique Job Application Status
    const uniqueJobApplicationStatus = useMemo(
        () => [...new Set(allData.map((item) => item.status))],
        [allData]
    );

    const { filteredData, pieData } = useMemo(() => {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - filters.range);

        // Step 1: Filter raw data
        const recent = allData.filter((item) => {
            const created = new Date(item.createdAt);
            const inRange = created >= fromDate;

            const jobMatch = filters.positionTitle
                ? item.jobTitle === filters.positionTitle
                : true;

            const statusMatch = filters.status
                ? item.status === filters.status
                : true;

            return inRange && jobMatch && statusMatch;
        });

        // Step 2: Get ALL statuses across dataset
        const allStatuses = [...new Set(allData.map((d) => d.status))];

        // Step 3: Group by jobTitle and include all statuses
        const jobMap = {};

        recent.forEach((item) => {
            if (!jobMap[item.jobTitle]) {
                jobMap[item.jobTitle] = { jobTitle: item.jobTitle };

                // initialize all statuses with 0
                allStatuses.forEach((s) => {
                    jobMap[item.jobTitle][s] = 0;
                });
            }

            jobMap[item.jobTitle][item.status] += 1;
        });

        const tableData = Object.values(jobMap);

        // Step 4: Pie chart totals
        const statusTotals = {};
        recent.forEach((item) => {
            if (!statusTotals[item.status]) statusTotals[item.status] = 0;
            statusTotals[item.status] += 1;
        });

        const pieArray = Object.keys(statusTotals).map((s) => ({
            name: s,
            value: statusTotals[s],
        }));

        return { filteredData: tableData, pieData: pieArray };
    }, [allData, filters.range, filters.positionTitle, filters.status]);

    const csvData = useMemo(() => {
        return filteredData.map((row) => {
            const obj = { "Job Title": row.jobTitle };
            Object.keys(row).forEach((k) => {
                if (k !== "jobTitle") obj[k] = row[k];
            });
            return obj;
        });
    }, [filteredData]);

    const exportPDF = () => {
        if (!filteredData.length) return;
        const doc = new jsPDF();
        doc.text(`Application Status Stats - Last ${filters.range} Days`, 14, 14);

        const head = ["Job Title", ...Object.keys(filteredData[0]).filter((k) => k !== "jobTitle")];
        const body = filteredData.map((row) => [
            row.jobTitle,
            ...Object.keys(row)
                .filter((k) => k !== "jobTitle")
                .map((k) => row[k] || 0),
        ]);

        autoTable(doc, { head: [head], body });
        doc.save(`application-status-${filters.range}-days.pdf`);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 shadow-sm rounded border">
                    <p className="fw-bold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="mb-0">
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const resetFilters = () =>
        setFilters({ range: 7, chartType: "bar", positionTitle: "", status: "" });

    return (
        <div className="container-fluid px-4">
            {/* Header */}
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 fw-bold text-primary">
                    <i className="fas fa-chart-pie me-2"></i> Application Status Analytics
                </h1>

                <div>
                    <CSVLink
                        data={csvData}
                        filename={`application-status-${filters.range}-days.csv`}
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
                        {/* Time range */}
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary">
                                Time Range
                            </label>
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

                        {/* Position Title */}
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary">
                                Position Title
                            </label>
                            <select
                                name="positionTitle"
                                className="form-select form-select-sm"
                                onChange={handleFilterChange}
                                value={filters.positionTitle}
                            >
                                <option value="">All Positions</option>
                                {uniqueJobTitles.map((title, idx) => (
                                    <option key={idx} value={title}>
                                        {title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 🆕 Status Filter */}
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary">
                                Status
                            </label>
                            <select
                                name="status"
                                className="form-select form-select-sm"
                                onChange={handleFilterChange}
                                value={filters.status}
                            >
                                <option value="">All Status</option>
                                {uniqueJobApplicationStatus.map((title, idx) => (
                                    <option key={idx} value={title}>
                                        {title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Chart Type */}
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary">
                                Chart Type
                            </label>
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

                        {/* Reset */}
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

            {/* Charts */}
            <div className="card border-0 shadow-sm rounded-4 hover-card">
                <div className="card-body p-3">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status" />
                            <p className="mt-2 text-muted">Loading report data...</p>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="text-center text-muted py-5">
                            No data available for selected filters.
                        </div>
                    ) : (
                        <div style={{ height: "400px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                {filters.chartType === "bar" ? (
                                    <BarChart data={filteredData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="jobTitle" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />

                                        {/* dynamically add bars for all statuses */}
                                        {Object.keys(filteredData[0])
                                            .filter((k) => k !== "jobTitle")
                                            .map((status, index) => (
                                                <Bar
                                                    key={status}
                                                    dataKey={status}
                                                    fill={COLORS[index % COLORS.length]}
                                                    name={status}
                                                />
                                            ))}
                                    </BarChart>
                                ) : (
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120}
                                            innerRadius={60}
                                            dataKey="value"
                                            nameKey="name"
                                            label={({ name, percent }) =>
                                                `${name}: ${(percent * 100).toFixed(0)}%`
                                            }
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="card-footer bg-white text-muted small">
                    Showing data for last {filters.range} days. Updated:{" "}
                    {new Date().toLocaleString()}
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

export default JobApplicationStats;





