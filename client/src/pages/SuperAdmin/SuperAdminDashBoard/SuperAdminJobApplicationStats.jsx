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
// ];

// const SuperAdminJobApplicationStats = () => {
//     const { server, token } = useAuthContext();
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
//             const response = await axios.get(`${server}/api/v1/superadminDashboard/getSuperAdminJobApplicationStats`, {
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

//     const uniqueJobTitles = useMemo(() => {
//         const titles = new Set();
//         allData.forEach(app => {
//             app.items.forEach(item => {
//                 if (item.jobTitle) {
//                     titles.add(item.jobTitle);
//                 }
//             });
//         });
//         return Array.from(titles);
//     }, [allData]);

//     const filteredData = useMemo(() => {
//         const fromDate = new Date();
//         fromDate.setDate(fromDate.getDate() - filters.range);

//         // First flatten the data structure
//         const flattened = allData.flatMap(app =>
//             app.items.map(item => ({
//                 ...item,
//                 createdAt: item.createdAt,
//                 updatedAt: item.updatedAt
//             }))
//         );

//         // Then filter based on date range and job title
//         const recent = flattened.filter(item => {
//             const inRange = new Date(item.updatedAt) >= fromDate;
//             const matchesJob = filters.jobTitle ? item.jobTitle === filters.jobTitle : true;
//             return inRange && matchesJob;
//         });

//         // Aggregate counts by job title and status
//         const map = {};
//         for (const item of recent) {
//             const key = item.jobTitle || "Unknown Job";
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

// export default SuperAdminJobApplicationStats;









// import { useEffect, useMemo, useState } from "react";
// import {
//     ResponsiveContainer,
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     Tooltip,
//     Legend,
//     CartesianGrid,
//     PieChart,
//     Pie,
//     Cell,
// } from "recharts";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { CSVLink } from "react-csv";
// import axios from "axios";
// import { useAuthContext } from "../../../context/auth-context";
// import toast from "react-hot-toast";
// import { FiRefreshCw } from "react-icons/fi";

// const COLORS = ["#4F46E5", "#10B981", "#EF4444", "#3B82F6"];

// const SuperAdminJobApplicationStats = () => {
//     const { server, token } = useAuthContext();
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Filters
//     const [filters, setFilters] = useState({
//         range: 7,
//         chartType: "bar",
//         jobTitle: "",
//     });

//     // CSV/PDF rows
//     const [selectedRows, setSelectedRows] = useState([]);

//     const fetchStats = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${server}/api/v1/superadminDashboard/getSuperAdminJobApplicationStats`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setData(response.data.data || []);
//         } catch (error) {
//             const message = error?.response?.data?.message || "Failed to load data.";
//             toast.error(message);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchStats();
//     }, []);

//     console.log(data);

//     // Unique Job Titles
//     const uniqueJobTitles = useMemo(() => {
//         const setTitles = new Set();
//         data.forEach(app => {
//             app.items.forEach(it => {
//                 if (it.jobId?.title) setTitles.add(it.jobId.title);
//             });
//         });
//         return [...setTitles];
//     }, [data]);

//     const flattenedRecent = useMemo(() => {
//         if (!data.length) return [];
//         const from = new Date();
//         from.setDate(from.getDate() - Number(filters.range));

//         const flat = data.flatMap(app =>
//             app.items.map(it => ({
//                 ...it,
//                 jobTitle: it.jobId?.title || "Unknown",
//                 updatedAtFull: it.updatedAt ? new Date(it.updatedAt) : null
//             }))
//         );

//         return flat.filter(row => {
//             const inRange = row.updatedAtFull >= from;
//             const jobMatch = filters.jobTitle ? row.jobTitle === filters.jobTitle : true;
//             return inRange && jobMatch;
//         });

//     }, [data, filters]);

//     const groupedByJob = useMemo(() => {
//         const jobMap = {};

//         flattenedRecent.forEach(row => {
//             const key = row.jobTitle;

//             if (!jobMap[key]) {
//                 jobMap[key] = {
//                     jobTitle: key,
//                     Applied: 0,
//                     Shortlisted: 0,
//                     Rejected: 0,
//                     "Interview Scheduled": 0,
//                 };
//             }
//             jobMap[key][row.status]++;
//         });

//         const result = Object.values(jobMap);
//         setSelectedRows(result);
//         return result;
//     }, [flattenedRecent]);

//     // PIE summary
//     const pieData = useMemo(() => {
//         const totals = { Applied: 0, Shortlisted: 0, Rejected: 0, "Interview Scheduled": 0 };

//         groupedByJob.forEach((r) => {
//             totals.Applied += r.Applied;
//             totals.Shortlisted += r.Shortlisted;
//             totals.Rejected += r.Rejected;
//             totals["Interview Scheduled"] += r["Interview Scheduled"];
//         });

//         return [
//             { name: "Applied", value: totals.Applied },
//             { name: "Shortlisted", value: totals.Shortlisted },
//             { name: "Rejected", value: totals.Rejected },
//             { name: "Interview Scheduled", value: totals["Interview Scheduled"] },
//         ];
//     }, [groupedByJob]);

//     // CSV Data
//     const csvRows = groupedByJob.map((r) => ({
//         "Job Title": r.jobTitle,
//         Applied: r.Applied,
//         "Interview Scheduled": r["Interview Scheduled"],
//         Shortlisted: r.Shortlisted,
//         Rejected: r.Rejected,
//     }));

//     // Export PDF
//     const exportPDF = () => {
//         const doc = new jsPDF({ unit: "pt", format: "a4" });

//         doc.text(`Job Application Stats — Last ${filters.range} days`, 40, 40);

//         autoTable(doc, {
//             head: [["Job Title", "Applied", "Interview Scheduled", "Shortlisted", "Rejected"]],
//             body: groupedByJob.map((r) => [
//                 r.jobTitle,
//                 r.Applied,
//                 r["Interview Scheduled"],
//                 r.Shortlisted,
//                 r.Rejected,
//             ]),
//             startY: 65,
//         });

//         doc.save("job-application-stats.pdf");
//     };

//     // CHART COMPONENT
//     const renderMainChart = () => {
//         if (loading)
//             return <div className="text-center py-5 text-muted">Loading...</div>;

//         if (!groupedByJob.length)
//             return <div className="text-center py-5 text-muted">No data found</div>;

//         if (filters.chartType === "pie") {
//             return (
//                 <ResponsiveContainer width="100%" height={340}>
//                     <PieChart>
//                         <Pie
//                             data={pieData}
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={120}
//                             dataKey="value"
//                             label
//                         >
//                             {pieData.map((_, i) => (
//                                 <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                             ))}
//                         </Pie>
//                         <Tooltip />
//                         <Legend />
//                     </PieChart>
//                 </ResponsiveContainer>
//             );
//         }

//         return (
//             <ResponsiveContainer width="100%" height={340}>
//                 <BarChart data={groupedByJob}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="jobTitle" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="Applied" fill={COLORS[0]} />
//                     <Bar dataKey="Interview Scheduled" fill={COLORS[3]} />
//                     <Bar dataKey="Shortlisted" fill={COLORS[1]} />
//                     <Bar dataKey="Rejected" fill={COLORS[2]} />
//                 </BarChart>
//             </ResponsiveContainer>
//         );
//     };

//     return (
//         <div className="container-fluid px-3 py-3">

//             {/* ===============================
//           ⭐ TOP ANALYTICS + BUTTONS
//       =============================== */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//                 <div>
//                     <h2 className="fw-bold mb-0">Job Applications Analytics</h2>
//                     <small className="text-muted">Overview of job applications & trends</small>
//                 </div>

//                 <div className="d-flex gap-2">
//                     <CSVLink
//                         data={csvRows}
//                         className="btn btn-light border"
//                         filename="applications.csv"
//                     >
//                         Export CSV
//                     </CSVLink>

//                     <button className="btn btn-primary" onClick={exportPDF}>
//                         Export PDF
//                     </button>
//                 </div>
//             </div>

//             {/* ===============================
//           ⭐ SUMMARY CARDS
//       =============================== */}
//             <div className="row g-3 mb-4">

//                 <div className="col-md-3">
//                     <div className="p-3 bg-white rounded-4 shadow-sm" style={{ border: "1px solid #eef1ff" }}>
//                         <div className="d-flex align-items-center gap-3">
//                             <div style={{
//                                 width: 44,
//                                 height: 44,
//                                 borderRadius: 12,
//                                 background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
//                                 color: "#fff",
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 fontSize: 20
//                             }}>—</div>

//                             <div>
//                                 <h4 className="mb-0">{uniqueJobTitles.length}</h4>
//                                 <small className="text-muted">Total Job Roles</small>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-md-3">
//                     <div className="p-3 bg-white rounded-4 shadow-sm" style={{ border: "1px solid #eef1ff" }}>
//                         <div className="d-flex align-items-center gap-3">
//                             <div style={{
//                                 width: 44,
//                                 height: 44,
//                                 borderRadius: 12,
//                                 background: "linear-gradient(135deg,#06d6a0,#0ea5e9)",
//                                 color: "#fff",
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 fontSize: 20
//                             }}>✓</div>

//                             <div>
//                                 <h4 className="mb-0">{groupedByJob.length}</h4>
//                                 <small className="text-muted">Active Jobs</small>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-md-3">
//                     <div className="p-3 bg-white rounded-4 shadow-sm" style={{ border: "1px solid #eef1ff" }}>
//                         <div className="d-flex align-items-center gap-3">
//                             <div style={{
//                                 width: 44,
//                                 height: 44,
//                                 borderRadius: 12,
//                                 background: "linear-gradient(135deg,#ff6b6b,#ff8e53)",
//                                 color: "#fff",
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 fontSize: 20
//                             }}>○</div>

//                             <div>
//                                 <h4 className="mb-0">{flattenedRecent.length}</h4>
//                                 <small className="text-muted">Total Applications</small>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-md-3">
//                     <div className="p-3 bg-white rounded-4 shadow-sm" style={{ border: "1px solid #eef1ff" }}>
//                         <div className="d-flex align-items-center gap-3">
//                             <div style={{
//                                 width: 44,
//                                 height: 44,
//                                 borderRadius: 12,
//                                 background: "linear-gradient(135deg,#0ea5e9,#38bdf8)",
//                                 color: "#fff",
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 fontSize: 20
//                             }}>≡</div>

//                             <div>
//                                 <h4 className="mb-0">3</h4>
//                                 <small className="text-muted">Locations</small>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//             </div>

//             {/* ===============================
//           ⭐ FILTERS
//       =============================== */}
//             <div className="card p-3 rounded-4 mb-4 shadow-sm">
//                 <div className="row g-3">

//                     <div className="col-md-3">
//                         <label className="text-muted small">Time Range</label>
//                         <select
//                             className="form-select form-select-sm"
//                             value={filters.range}
//                             onChange={(e) => setFilters({ ...filters, range: Number(e.target.value) })}
//                         >
//                             <option value={7}>Last 7 days</option>
//                             <option value={30}>Last 30 days</option>
//                             <option value={90}>Last 90 days</option>
//                             <option value={365}>Last 1 year</option>
//                         </select>
//                     </div>

//                     <div className="col-md-4">
//                         <label className="text-muted small">Job Title</label>
//                         <select
//                             className="form-select form-select-sm"
//                             value={filters.jobTitle}
//                             onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
//                         >
//                             <option value="">All</option>
//                             {uniqueJobTitles.map((t) => (
//                                 <option key={t} value={t}>{t}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="col-md-3">
//                         <label className="text-muted small">Chart Type</label>
//                         <select
//                             className="form-select form-select-sm"
//                             value={filters.chartType}
//                             onChange={(e) => setFilters({ ...filters, chartType: e.target.value })}
//                         >
//                             <option value="bar">Bar Chart</option>
//                             <option value="pie">Pie Chart</option>
//                         </select>
//                     </div>

//                     <div className="col-md-2 d-grid">
//                         <button
//                             className="btn btn-outline-secondary btn-sm"
//                             onClick={() => setFilters({ range: 7, chartType: "bar", jobTitle: "" })}
//                         >
//                             <FiRefreshCw /> Reset
//                         </button>
//                     </div>

//                 </div>
//             </div>

//             {/* ===============================
//           ⭐ MAIN CHART AREA
//       =============================== */}
//             <div className="card p-3 rounded-4 shadow-sm mb-4">
//                 <h5 className="mb-3">Applications by Job</h5>
//                 {renderMainChart()}
//             </div>

//             {/* ===============================
//           ⭐ TABLE PREVIEW
//       =============================== */}
//             <div className="card p-3 rounded-4 shadow-sm">
//                 <h6 className="mb-3">Grouped Summary</h6>

//                 <div className="table-responsive">
//                     <table className="table table-sm table-borderless">
//                         <thead>
//                             <tr className="text-muted small">
//                                 <th>Job</th>
//                                 <th className="text-end">Applied</th>
//                                 <th className="text-end">Interview</th>
//                                 <th className="text-end">Shortlisted</th>
//                                 <th className="text-end">Rejected</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {groupedByJob.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={5} className="text-center text-muted py-3">No data available</td>
//                                 </tr>
//                             ) : (
//                                 groupedByJob.map((r) => (
//                                     <tr key={r.jobTitle}>
//                                         <td>{r.jobTitle}</td>
//                                         <td className="text-end">{r.Applied}</td>
//                                         <td className="text-end">{r["Interview Scheduled"]}</td>
//                                         <td className="text-end">{r.Shortlisted}</td>
//                                         <td className="text-end">{r.Rejected}</td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//         </div>
//     );
// }

// export default SuperAdminJobApplicationStats;












import { useEffect, useMemo, useState } from "react";
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
import axios from "axios";
import { useAuthContext } from "../../../context/auth-context";
import toast from "react-hot-toast";
import { FiRefreshCw, FiClock, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";

// Color palette & gradients
const COLORS = ["#4F46E5", "#10B981", "#EF4444", "#3B82F6"];
const GRADIENTS = [
    "linear-gradient(135deg, #6a11cb, #2575fc)",
    "linear-gradient(135deg, #ff6a00, #ee0979)",
    "linear-gradient(135deg, #11998e, #38ef7d)",
];
const STATUS_COLOR = {
    "Applied": "#007bff",
    "Shortlisted": "#6f42c1",
    "Rejected": "#dc3545",
    "Interview Scheduled": "#28a745",
};

const SuperAdminJobApplicationStats = () => {
    const { server, token } = useAuthContext();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ range: 7, chartType: "bar", jobTitle: "" });
    const [selectedRows, setSelectedRows] = useState([]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${server}/api/v1/superadminDashboard/getSuperAdminJobApplicationStats`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setData(response.data.data || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load data.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // ===================== DATA TRANSFORMATIONS =====================
    const uniqueJobTitles = useMemo(() => {
        const setTitles = new Set();
        data.forEach(app => {
            app.items.forEach(it => it.jobId?.title && setTitles.add(it.jobId.title));
        });
        return [...setTitles];
    }, [data]);

    const flattenedRecent = useMemo(() => {
        if (!data.length) return [];
        const from = new Date();
        from.setDate(from.getDate() - Number(filters.range));
        const flat = data.flatMap(app =>
            app.items.map(it => ({
                ...it,
                jobTitle: it.jobId?.title || "Unknown",
                updatedAtFull: it.updatedAt ? new Date(it.updatedAt) : null
            }))
        );
        return flat.filter(row => {
            const inRange = row.updatedAtFull >= from;
            const jobMatch = filters.jobTitle ? row.jobTitle === filters.jobTitle : true;
            return inRange && jobMatch;
        });
    }, [data, filters]);

    const groupedByJob = useMemo(() => {
        const jobMap = {};
        flattenedRecent.forEach(row => {
            const key = row.jobTitle;
            if (!jobMap[key]) {
                jobMap[key] = {
                    jobTitle: key,
                    Applied: 0,
                    Shortlisted: 0,
                    Rejected: 0,
                    "Interview Scheduled": 0,
                };
            }
            jobMap[key][row.status]++;
        });
        const result = Object.values(jobMap);
        setSelectedRows(result);
        return result;
    }, [flattenedRecent]);

    // PIE summary
    const pieData = useMemo(() => {
        const totals = { Applied: 0, Shortlisted: 0, Rejected: 0, "Interview Scheduled": 0 };
        groupedByJob.forEach(r => {
            totals.Applied += r.Applied;
            totals.Shortlisted += r.Shortlisted;
            totals.Rejected += r.Rejected;
            totals["Interview Scheduled"] += r["Interview Scheduled"];
        });
        return [
            { name: "Applied", value: totals.Applied },
            { name: "Shortlisted", value: totals.Shortlisted },
            { name: "Rejected", value: totals.Rejected },
            { name: "Interview Scheduled", value: totals["Interview Scheduled"] },
        ];
    }, [groupedByJob]);

    const csvRows = groupedByJob.map(r => ({
        "Job Title": r.jobTitle,
        Applied: r.Applied,
        "Interview Scheduled": r["Interview Scheduled"],
        Shortlisted: r.Shortlisted,
        Rejected: r.Rejected,
    }));

    const exportPDF = () => {
        const doc = new jsPDF({ unit: "pt", format: "a4" });
        doc.text(`Job Application Stats — Last ${filters.range} days`, 40, 40);
        autoTable(doc, {
            head: [["Job Title", "Applied", "Interview Scheduled", "Shortlisted", "Rejected"]],
            body: groupedByJob.map(r => [
                r.jobTitle, r.Applied, r["Interview Scheduled"], r.Shortlisted, r.Rejected
            ]),
            startY: 65,
        });
        doc.save("job-application-stats.pdf");
    };

    // ===================== CHART RENDER =====================
    const renderMainChart = () => {
        if (loading) return <div className="text-center py-5 text-muted">Loading...</div>;
        if (!groupedByJob.length) return <div className="text-center py-5 text-muted">No data found</div>;

        if (filters.chartType === "pie") {
            return (
                <ResponsiveContainer width="100%" height={340}>
                    <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={120} dataKey="value" label>
                            {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            );
        }

        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={groupedByJob}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="jobTitle" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {Object.keys(STATUS_COLOR).map(key => <Bar key={key} dataKey={key} fill={STATUS_COLOR[key]} radius={6} />)}
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        );
    };

    return (
        <div className="container-fluid px-3 py-3">

            {/* ================= TOP ANALYTICS + BUTTONS ================= */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0">Job Applications Analytics</h2>
                    <small className="text-muted">Overview of job applications & trends</small>
                </div>

                <div className="d-flex gap-2">
                    <CSVLink
                        data={csvRows}
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

            {/* ================= SUMMARY CARDS ================= */}
            <div className="row g-3 mb-4">
                <div className="row g-3 mb-4">

                    <div className="col-md-4">
                        <div className="p-3 bg-white rounded-4 shadow-sm" style={{ border: "1px solid #eef1ff" }}>
                            <div className="d-flex align-items-center gap-3">
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                    color: "#fff",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: 20
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
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    background: "linear-gradient(135deg,#06d6a0,#0ea5e9)",
                                    color: "#fff",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: 20
                                }}>✓</div>

                                <div>
                                    <h4 className="mb-0">{groupedByJob.length}</h4>
                                    <small className="text-muted">Active Jobs</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-3 bg-white rounded-4 shadow-sm" style={{ border: "1px solid #eef1ff" }}>
                            <div className="d-flex align-items-center gap-3">
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    background: "linear-gradient(135deg,#ff6b6b,#ff8e53)",
                                    color: "#fff",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: 20
                                }}>○</div>

                                <div>
                                    <h4 className="mb-0">{flattenedRecent.length}</h4>
                                    <small className="text-muted">Total Applications</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= FILTERS ================= */}
            <div className="card p-3 rounded-4 mb-4 shadow-sm">
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="text-muted small">Time Range</label>
                        <select className="form-select form-select-sm" value={filters.range} onChange={(e) => setFilters({ ...filters, range: Number(e.target.value) })}>
                            <option value={7}>Last 7 days</option>
                            <option value={30}>Last 30 days</option>
                            <option value={90}>Last 90 days</option>
                            <option value={365}>Last 1 year</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="text-muted small">Job Title</label>
                        <select className="form-select form-select-sm" value={filters.jobTitle} onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}>
                            <option value="">All</option>
                            {uniqueJobTitles.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="text-muted small">Chart Type</label>
                        <select className="form-select form-select-sm" value={filters.chartType} onChange={(e) => setFilters({ ...filters, chartType: e.target.value })}>
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
                            onClick={() => setFilters({ range: 7, chartType: "bar", jobTitle: "" })}>
                            <FiRefreshCw /> Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= MAIN CHART ================= */}
            <div className="card p-3 rounded-4 shadow-sm mb-4">
                <h5 className="mb-3">Applications by Job</h5>
                {renderMainChart()}
            </div>

            {/* ================= AI Insights (Step 7) ================= */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-3 mt-3" style={{ borderRadius: 14, background: "rgba(0,0,0,0.05)", backdropFilter: "blur(5px)" }}>
                <h6><FiTrendingUp /> AI Insights</h6>
                <div className="small-muted mt-2">Highest activity job: <b>{groupedByJob[0]?.jobTitle || "N/A"}</b></div>
                <div className="small-muted">Avg updates per candidate: <b>{(flattenedRecent.length / (data.length || 1)).toFixed(1)}</b></div>
            </motion.div>

            {/* ================= TABLE ================= */}
            <div className="card p-3 rounded-4 shadow-sm mt-4">
                <h6 className="mb-3">Grouped Summary</h6>
                <div className="table-responsive">
                    <table className="table table-sm table-borderless">
                        <thead>
                            <tr className="text-muted small">
                                <th>Job</th>
                                <th className="text-end">Applied</th>
                                <th className="text-end">Interview</th>
                                <th className="text-end">Shortlisted</th>
                                <th className="text-end">Rejected</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedByJob.length === 0 ? (
                                <tr><td colSpan={5} className="text-center text-muted py-3">No data available</td></tr>
                            ) : (
                                groupedByJob.map(r => (
                                    <tr key={r.jobTitle}>
                                        <td>{r.jobTitle}</td>
                                        <td className="text-end">{r.Applied}</td>
                                        <td className="text-end">{r["Interview Scheduled"]}</td>
                                        <td className="text-end">{r.Shortlisted}</td>
                                        <td className="text-end">{r.Rejected}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= STEP 4: Candidate Cards ================= */}
            <div className="card p-3 rounded-4 shadow-sm mt-4">
                <h6 className="mb-3">Applicants Timeline</h6>
                <div style={{ maxHeight: 360, overflowY: "auto", padding: 12 }}>
                    {flattenedRecent.map((c, index) => (
                        <motion.div
                            key={c._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="d-flex align-items-center justify-content-between mb-3 p-3"
                            style={{
                                borderRadius: 14,
                                background: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(0,0,0,0.1)",
                            }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div style={{
                                    width: 52, height: 52, borderRadius: "50%",
                                    background: GRADIENTS[index % GRADIENTS.length],
                                    color: "#fff", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    fontWeight: 700, fontSize: 20
                                }}>{(c.jobTitle || "?").charAt(0)}</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 16 }}>{c.jobTitle}</div>
                                </div>
                            </div>
                            <div className="text-end">
                                <span className="badge" style={{
                                    background: STATUS_COLOR[c.status] || "#aaa",
                                    padding: "6px 10px",
                                    borderRadius: 8,
                                    fontSize: 12
                                }}>{c.status}</span>
                                <div className="small-muted mt-1"><FiClock /> {new Date(c.createdAt).toLocaleDateString()}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default SuperAdminJobApplicationStats;
