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

// const UserJobApplicationStats = () => {
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
//             const response = await axios.get(`${server}/api/v1/candidateDashboard/${user.userId}/getUserApplicationStatusStats`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setAllData(response.data.data || []);
//             console.log(response.data.data);

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

// export default UserJobApplicationStats;




import { useEffect, useMemo, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
    ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import axios from "axios";
import { useAuthContext } from "../../../context/auth-context";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";

const COLORS = ["#4F46E5", "#10B981", "#EF4444", "#3B82F6"];

const UserJobApplicationStats = () => {

    const { server, user, token } = useAuthContext();

    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        range: 7,
        chartType: "bar",
        jobTitle: ""
    });

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${server}/api/v1/candidateDashboard/${user.userId}/getUserApplicationStatusStats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllData(response.data.data || []);
            console.log(response.data.data);

        } catch (error) {
            const message = error?.response?.data?.message || "Failed to load data.";
            toast.error(message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const uniqueJobTitles = useMemo(
        () => [...new Set(allData.map(item => item.jobTitle))],
        [allData]
    );

    const filteredData = useMemo(() => {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - filters.range);

        const recent = allData.filter(item => {
            const inRange = new Date(item.createdAt) >= fromDate;
            const match = filters.jobTitle ? item.jobTitle === filters.jobTitle : true;
            return inRange && match;
        });

        const grouped = {};

        recent.forEach(item => {
            if (!grouped[item.jobTitle]) {
                grouped[item.jobTitle] = {
                    jobTitle: item.jobTitle,
                    Applied: 0,
                    Shortlisted: 0,
                    "Interview Scheduled": 0,
                    Rejected: 0
                };
            }
            grouped[item.jobTitle][item.status]++;
        });

        return Object.values(grouped);
    }, [allData, filters]);

    const pieChartData = useMemo(() => [
        { name: "Applied", value: filteredData.reduce((s, x) => s + x.Applied, 0) },
        { name: "Shortlisted", value: filteredData.reduce((s, x) => s + x.Shortlisted, 0) },
        { name: "Rejected", value: filteredData.reduce((s, x) => s + x.Rejected, 0) },
        { name: "Interview Scheduled", value: filteredData.reduce((s, x) => s + x["Interview Scheduled"], 0) }
    ], [filteredData]);

    const exportPDF = () => {
        if (!filteredData.length) return;

        const doc = new jsPDF();
        doc.text(`Job Application Report - Last ${filters.range} Days`, 14, 14);

        autoTable(doc, {
            head: [["Job Title", "Applied", "Shortlisted", "Interview", "Rejected"]],
            body: filteredData.map(row => [
                row.jobTitle,
                row.Applied,
                row.Shortlisted,
                row["Interview Scheduled"],
                row.Rejected
            ])
        });

        doc.save("job-application-stats.pdf");
    };

    const csvData = filteredData.map(row => ({
        "Job Title": row.jobTitle,
        Applied: row.Applied,
        Shortlisted: row.Shortlisted,
        "Interview Scheduled": row["Interview Scheduled"],
        Rejected: row.Rejected
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload) return null;
        return (
            <div className="p-2 bg-white border shadow-sm rounded-3">
                <strong>{label}</strong>
                {payload.map((p, i) => (
                    <div key={i} className="small" style={{ color: p.color }}>
                        {p.name}: {p.value}
                    </div>
                ))}
            </div>
        );
    };

    const renderChart = () => {
        if (loading)
            return <div className="text-center py-5">Loading chart...</div>;

        if (!filteredData.length)
            return <div className="text-center py-5 text-muted">No data found</div>;

        return (
            <div style={{ height: 380 }}>
                <ResponsiveContainer width="100%" height="100%">
                    {filters.chartType === "bar" ? (
                        <BarChart data={filteredData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="jobTitle" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="Applied" fill={COLORS[0]} barSize={40} radius={[6, 6, 0, 0]} />
                            <Bar dataKey="Shortlisted" fill={COLORS[1]} barSize={40} radius={[6, 6, 0, 0]} />
                            <Bar dataKey="Rejected" fill={COLORS[2]} barSize={40} radius={[6, 6, 0, 0]} />
                            <Bar dataKey="Interview Scheduled" fill={COLORS[3]} barSize={40} radius={[6, 6, 0, 0]} />
                        </BarChart>
                    ) : (
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={145}
                                label
                                cx="50%"
                                cy="50%"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <div className="container-fluid px-4">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark">Job Application Analytics</h3>

                <div>
                    <CSVLink
                        data={csvData}
                        filename="job-stats.csv"
                        className="btn btn-outline-success btn-sm me-2"
                    >
                        Export CSV
                    </CSVLink>

                    <button className="btn btn-danger btn-sm" onClick={exportPDF}>
                        Export PDF
                    </button>
                </div>
            </div>

            {/* FILTER CARD */}
            <div className="card shadow-sm border-0 mb-4 rounded-4">
                <div className="card-header bg-primary text-white fw-semibold rounded-top-4">
                    Filters
                </div>

                <div className="card-body">
                    <div className="row g-3">

                        <div className="col-md-3">
                            <label className="fw-semibold">Time Range</label>
                            <select
                                className="form-select"
                                value={filters.range}
                                onChange={e => setFilters({ ...filters, range: Number(e.target.value) })}
                            >
                                <option value={7}>Last 7 Days</option>
                                <option value={30}>Last 30 Days</option>
                                <option value={90}>Last 90 Days</option>
                                <option value={365}>Last 1 Year</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="fw-semibold">Job Title</label>
                            <select
                                className="form-select"
                                value={filters.jobTitle}
                                onChange={e => setFilters({ ...filters, jobTitle: e.target.value })}
                            >
                                <option value="">All</option>
                                {uniqueJobTitles.map((title, idx) => (
                                    <option key={idx} value={title}>{title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="fw-semibold">Chart Type</label>
                            <select
                                className="form-select"
                                value={filters.chartType}
                                onChange={e => setFilters({ ...filters, chartType: e.target.value })}
                            >
                                <option value="bar">Bar Chart</option>
                                <option value="pie">Pie Chart</option>
                            </select>
                        </div>

                        <div className="col-md-3 d-flex align-items-end">
                            <button
                                className="btn btn-secondary w-100"
                                onClick={() => setFilters({ range: 7, chartType: "bar", jobTitle: "" })}
                            >
                                Reset Filters
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* CHART CARD */}
            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body">
                    {renderChart()}
                </div>

                <div className="card-footer bg-white text-muted small">
                    Last Updated: {new Date().toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default UserJobApplicationStats;