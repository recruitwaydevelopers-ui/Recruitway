// import { useEffect, useMemo, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { CSVLink } from 'react-csv';
// import { useAuthContext } from '../../../context/auth-context';
// import axios from "axios";

// const COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'];

// const SuperAdminJobStats = () => {
//     const [filters, setFilters] = useState({
//         status: '',
//         type: '',
//         skills: '',
//         location: '',
//         startDate: '',
//         endDate: ''
//     });

//     const { server, token } = useAuthContext();

//     const [jobsData, setJobsData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const getJobdata = async () => {
//         setLoading(true)
//         try {
//             const response = await axios.get(`${server}/api/v1/superadminDashboard/getSuperAdminJobStats`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );
//             setJobsData(response.data.data);
//         } catch (error) {
//             console.error("Error fetching interview data:", error);
//         }
//         finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         getJobdata();
//     }, []);

//     const [selectedJobs, setSelectedJobs] = useState([]);

//     const uniqueTypes = useMemo(() => [...new Set(jobsData.map(job => job.type || '').filter(Boolean))], [jobsData]);
//     const uniqueSkills = useMemo(() => {
//         const skillsSet = new Set();
//         jobsData.forEach(job => {
//             if (job.skills && Array.isArray(job.skills)) {
//                 job.skills.forEach(skill => {
//                     if (typeof skill === 'string') {
//                         skillsSet.add(skill);
//                     }
//                 });
//             }
//         });
//         return [...skillsSet];
//     }, [jobsData]);
//     const uniqueLocations = useMemo(() => [...new Set(jobsData.map(job => job.location || '').filter(Boolean))], [jobsData]);
//     const uniqueStatuses = useMemo(() => [...new Set(jobsData.map(job => job.status || '').filter(Boolean))], [jobsData]);

//     const dateFilteredData = useMemo(() => {
//         return jobsData.filter(job => {
//             const jobDate = new Date(job.posted);
//             if (isNaN(jobDate.getTime())) return false;

//             const startDate = filters.startDate ? new Date(filters.startDate) : null;
//             const endDate = filters.endDate ? new Date(filters.endDate) : null;

//             if (startDate && isNaN(startDate.getTime())) return false;
//             if (endDate && isNaN(endDate.getTime())) return false;

//             if (startDate && endDate) return jobDate >= startDate && jobDate <= endDate;
//             if (startDate) return jobDate >= startDate;
//             if (endDate) return jobDate <= endDate;
//             return true;
//         });
//     }, [filters.startDate, filters.endDate, jobsData]);

//     const filterBy = (field, value, data) => {
//         if (!value) return data;

//         return data.filter(job => {
//             if (field === 'status') return job.status === value;
//             if (field === 'type') return job.type === value;
//             if (field === 'skills') {
//                 return job.skills?.some(skill =>
//                     typeof skill === 'string' ? skill === value : skill.skills === value
//                 );
//             }
//             if (field === 'location') return job.location === value;
//             return true;
//         });
//     };

//     const generateChartData = (field, data) => {
//         const count = {};
//         data.forEach(job => {
//             if (field === 'skills') {
//                 job.skills?.forEach(skill => {
//                     const key = typeof skill === 'string' ? skill : skill.skills;
//                     count[key] = (count[key] || 0) + 1;
//                 });
//             } else {
//                 const key = job[field];
//                 count[key] = (count[key] || 0) + 1;
//             }
//         });
//         const total = Object.values(count).reduce((sum, val) => sum + val, 0);
//         return Object.entries(count).map(([key, value]) => ({
//             name: key,
//             count: value,
//             percent: total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
//         }));
//     };

//     const generateTimeSeriesData = (data) => {
//         const dateCounts = {};

//         data.forEach(job => {
//             if (!job.posted) return;

//             const date = new Date(job.posted);
//             if (isNaN(date.getTime())) return;

//             const dateStr = date.toISOString().split('T')[0];
//             dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
//         });

//         return Object.entries(dateCounts)
//             .map(([date, count]) => ({ date, count }))
//             .sort((a, b) => new Date(a.date) - new Date(b.date));
//     };

//     const generateApplicantsData = (data) => {
//         return data.map(job => ({
//             name: job.title,
//             applicants: job.applicants || 0,
//             status: job.status
//         }));
//     };

//     const chartConfigs = [
//         {
//             label: 'Job Status',
//             field: 'status',
//             value: filters.status,
//             chartType: 'pie',
//             options: [
//                 { value: '', label: 'All Statuses' },
//                 ...uniqueStatuses.map(status => ({ value: status, label: status }))
//             ]
//         },
//         {
//             label: 'Job Type',
//             field: 'type',
//             value: filters.type,
//             chartType: 'bar',
//             options: [
//                 { value: '', label: 'All Types' },
//                 ...uniqueTypes.map(type => ({ value: type, label: type }))
//             ]
//         },
//         {
//             label: 'Required Skills',
//             field: 'skills',
//             value: filters.skills,
//             chartType: 'pie',
//             options: [
//                 { value: '', label: 'All Skills' },
//                 ...uniqueSkills.map(skill => ({ value: skill, label: skill }))
//             ]
//         },
//         {
//             label: 'Locations',
//             field: 'location',
//             value: filters.location,
//             chartType: 'radar',
//             options: [
//                 { value: '', label: 'All Locations' },
//                 ...uniqueLocations.map(loc => ({ value: loc, label: loc }))
//             ]
//         },
//         {
//             label: 'Job Postings Over Time',
//             field: 'posted',
//             value: '',
//             chartType: 'area',
//             options: []
//         },
//         {
//             label: 'Applicants per Job',
//             field: 'applicants',
//             value: '',
//             chartType: 'bar',
//             options: []
//         }
//     ];

//     const exportPDF = () => {
//         if (!selectedJobs.length) return;

//         const doc = new jsPDF();
//         doc.text('Job Listings Report', 14, 16);

//         autoTable(doc, {
//             head: [['Title', 'Type', 'Location', 'Status', 'Applicants', 'Posted']],
//             body: selectedJobs.map(job => [
//                 job.title || 'N/A',
//                 job.type || 'N/A',
//                 job.location || 'N/A',
//                 job.status || 'N/A',
//                 job.applicants || 0,
//                 job.posted ? new Date(job.posted).toLocaleDateString() : 'N/A'
//             ])
//         });
//         doc.save('job-listings-report.pdf');
//     };

//     const csvData = selectedJobs.map(job => ({
//         Title: job.title || '',
//         Type: job.type || '',
//         Location: job.location || '',
//         Status: job.status || '',
//         Applicants: job.applicants || 0,
//         Salary: job.salary || '',
//         Experience: job.experience || '',
//         Posted: job.posted ? new Date(job.posted).toLocaleDateString() : '',
//         Skills: job.skills?.join(', ') || ''
//     }));

//     const renderChart = (chartData, chartType, field) => {
//         if (!chartData.length) {
//             return (
//                 <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
//                     <p className="text-muted">No data available</p>
//                 </div>
//             );
//         }

//         switch (chartType) {
//             case 'pie':
//                 return (
//                     <PieChart>
//                         <Pie
//                             data={chartData}
//                             cx="50%"
//                             cy="50%"
//                             labelLine={false}
//                             outerRadius={80}
//                             fill="#8884d8"
//                             dataKey="count"
//                             nameKey="name"
//                             label={({ name, percent }) => {
//                                 const num = parseFloat(percent);
//                                 const isValid = !isNaN(num);
//                                 const formatted = isValid
//                                     ? (num <= 1 ? (num * 100).toFixed(2) : num.toFixed(2))
//                                     : '0';
//                                 return `${name}: ${formatted}%`;
//                             }}
//                             onClick={(_, index) => {
//                                 if (chartData[index]) {
//                                     setSelectedJobs(filterBy(field, chartData[index].name, dateFilteredData));
//                                 }
//                             }}
//                         >
//                             {chartData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                         </Pie>
//                         <Tooltip
//                             formatter={(value, name, props) => [`${value} (${props.payload.percent}%)`, name]}
//                             contentStyle={{
//                                 borderRadius: '0.35rem',
//                                 border: '1px solid #e3e6f0',
//                                 backgroundColor: '#fff',
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center"
//                             }}
//                         />
//                         <Legend
//                             wrapperStyle={{
//                                 paddingTop: '20px'
//                             }}
//                         />
//                     </PieChart>
//                 );
//             case 'radar':
//                 return (
//                     <RadarChart outerRadius="80%" width={400} height={300} data={chartData}>
//                         <PolarGrid />
//                         <PolarAngleAxis dataKey="name" />
//                         <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
//                         <Radar
//                             name="Locations"
//                             dataKey="count"
//                             stroke="#4e73df"
//                             fill="#4e73df"
//                             fillOpacity={0.6}
//                             onClick={(data) => {
//                                 if (data?.activeLabel) {
//                                     setSelectedJobs(filterBy(field, data.activeLabel, dateFilteredData));
//                                 }
//                             }}
//                         />
//                         <Tooltip
//                             formatter={(value) => [`${value}`]}
//                             contentStyle={{
//                                 borderRadius: '0.35rem',
//                                 border: '1px solid #e3e6f0',
//                                 backgroundColor: '#fff'
//                             }}
//                         />
//                         <Legend />
//                     </RadarChart>
//                 );
//             case 'area':
//                 const timeSeriesData = generateTimeSeriesData(dateFilteredData);
//                 return (
//                     <AreaChart
//                         data={timeSeriesData}
//                         margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//                     >
//                         <defs>
//                             <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
//                                 <stop offset="5%" stopColor="#4e73df" stopOpacity={0.8} />
//                                 <stop offset="95%" stopColor="#4e73df" stopOpacity={0} />
//                             </linearGradient>
//                         </defs>
//                         <XAxis
//                             dataKey="date"
//                             tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                         />
//                         <YAxis />
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fc" />
//                         <Tooltip
//                             labelFormatter={(date) => `Date: ${new Date(date).toLocaleDateString()}`}
//                             formatter={(value) => [`${value} postings`]}
//                             contentStyle={{
//                                 borderRadius: '0.35rem',
//                                 border: '1px solid #e3e6f0',
//                                 backgroundColor: '#fff'
//                             }}
//                         />
//                         <Area
//                             type="monotone"
//                             dataKey="count"
//                             stroke="#4e73df"
//                             fillOpacity={1}
//                             fill="url(#colorCount)"
//                             activeDot={{ r: 8 }}
//                         />
//                     </AreaChart>
//                 );
//             case 'bar':
//             default:
//                 if (field === 'applicants') {
//                     const applicantsData = generateApplicantsData(dateFilteredData);
//                     return (
//                         <BarChart
//                             data={applicantsData}
//                             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                             onClick={data => {
//                                 if (data?.activeLabel) {
//                                     setSelectedJobs(dateFilteredData.filter(job => job.title === data.activeLabel));
//                                 }
//                             }}
//                         >
//                             <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fc" />
//                             <XAxis
//                                 dataKey="name"
//                                 tick={{ fill: '#5a5c69' }}
//                             />
//                             <YAxis
//                                 tick={{ fill: '#5a5c69' }}
//                             />
//                             <Tooltip
//                                 formatter={(value, name) => [`${value} applicants`, name]}
//                                 contentStyle={{
//                                     borderRadius: '0.35rem',
//                                     border: '1px solid #e3e6f0',
//                                     backgroundColor: '#fff'
//                                 }}
//                             />
//                             <Legend />
//                             <Bar
//                                 dataKey="applicants"
//                                 fill="#4e73df"
//                                 radius={[4, 4, 0, 0]}
//                                 label={{
//                                     position: 'top',
//                                     fill: '#5a5c69',
//                                     formatter: (value) => `${value}`
//                                 }}
//                             />
//                         </BarChart>
//                     );
//                 } else {
//                     return (
//                         <BarChart
//                             data={chartData}
//                             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                             onClick={data => {
//                                 if (data?.activeLabel) {
//                                     setSelectedJobs(filterBy(field, data.activeLabel, dateFilteredData));
//                                 }
//                             }}
//                         >
//                             <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fc" />
//                             <XAxis
//                                 dataKey="name"
//                                 tick={{ fill: '#5a5c69' }}
//                             />
//                             <YAxis
//                                 tick={{ fill: '#5a5c69' }}
//                             />
//                             <Tooltip
//                                 formatter={(value) => [`${value} (${chartData.find(item => item.count === value)?.percent || '0'}%)`]}
//                                 contentStyle={{
//                                     borderRadius: '0.35rem',
//                                     border: '1px solid #e3e6f0',
//                                     backgroundColor: '#fff'
//                                 }}
//                             />
//                             <Legend
//                                 wrapperStyle={{
//                                     paddingTop: '20px'
//                                 }}
//                             />
//                             <Bar
//                                 dataKey="count"
//                                 fill="#4e73df"
//                                 radius={[4, 4, 0, 0]}
//                                 label={{
//                                     position: 'top',
//                                     fill: '#5a5c69',
//                                     formatter: (value) => `${value}`
//                                 }}
//                             />
//                         </BarChart>
//                     );
//                 }
//         }
//     };

//     const handleDateChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({ ...prev, [name]: value }));
//     };

//     const resetDateRange = () => {
//         setFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
//     };

//     if (loading) return (
//         <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
//             <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//             </div>
//         </div>
//     );

//     if (!jobsData.length) return (
//         <div className="card shadow">
//             <div className="card-body text-center py-5">
//                 <i className="fas fa-folder-open fa-3x text-gray-300 mb-3"></i>
//                 <h5 className="text-gray-800">No job data available</h5>
//                 <p className="text-muted">There are currently no jobs to display</p>
//             </div>
//         </div>
//     );

//     return (
//         <div className="container-fluid px-4">
//             <div className="d-sm-flex align-items-center justify-content-between mb-4">
//                 <h1 className="h3 mb-0 text-gray-800">Job Analytics Dashboard</h1>
//                 <div>
//                     <CSVLink
//                         data={csvData}
//                         filename="job-listings-export.csv"
//                         className="btn btn-sm btn-success shadow-sm me-2"
//                     >
//                         <i className="fas fa-file-csv me-1"></i> Export CSV
//                     </CSVLink>
//                     <button
//                         className="btn btn-sm btn-danger shadow-sm"
//                         onClick={exportPDF}
//                         disabled={!selectedJobs.length}
//                         title={!selectedJobs.length ? "Select jobs by clicking on chart elements" : ""}
//                     >
//                         <i className="fas fa-file-pdf me-1"></i> Export PDF
//                     </button>
//                 </div>
//             </div>

//             <div className="card shadow mb-4">
//                 <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-primary text-white">
//                     <h6 className="m-0 font-weight-bold text-light">Date Range Filter</h6>
//                 </div>
//                 <div className="card-body">
//                     <div className="row g-3 align-items-end">
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">From Date</label>
//                             <input
//                                 type="date"
//                                 className="form-control form-control-sm"
//                                 name="startDate"
//                                 value={filters.startDate}
//                                 onChange={handleDateChange}
//                             />
//                         </div>
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">To Date</label>
//                             <input
//                                 type="date"
//                                 className="form-control form-control-sm"
//                                 name="endDate"
//                                 value={filters.endDate}
//                                 onChange={handleDateChange}
//                             />
//                         </div>
//                         <div className="col-md-2">
//                             <button
//                                 className="btn btn-sm btn-outline-secondary w-100"
//                                 onClick={resetDateRange}
//                                 disabled={!filters.startDate && !filters.endDate}
//                             >
//                                 <i className="fas fa-undo me-1"></i> Reset
//                             </button>
//                         </div>
//                         <div className="col-md-4 text-end">
//                             <small className="text-gray-600">
//                                 {filters.startDate || filters.endDate ? (
//                                     <>Showing jobs posted from <strong>{filters.startDate || 'earliest'}</strong> to <strong>{filters.endDate || 'latest'}</strong></>
//                                 ) : 'Showing all dates'}
//                             </small>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="row">
//                 {chartConfigs.map(({ label, field, value, chartType, options }) => {
//                     const dataSubset = value ? filterBy(field, value, dateFilteredData) : dateFilteredData;
//                     const chartData = field === 'posted'
//                         ? generateTimeSeriesData(dataSubset)
//                         : field === 'applicants'
//                             ? generateApplicantsData(dataSubset)
//                             : generateChartData(field, dataSubset);
//                     const filteredCount = dataSubset.length;

//                     return (
//                         <div className="col-xl-6 mb-4" key={field}>
//                             <div className="card shadow h-100">
//                                 <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
//                                     <h6 className="m-0 font-weight-bold text-primary">{label}</h6>
//                                     <span className="badge bg-primary rounded-pill">{filteredCount} {filteredCount === 1 ? 'job' : 'jobs'}</span>
//                                 </div>
//                                 <div className="card-body">
//                                     <div className="row flex-column">
//                                         <div className="">
//                                             {options.length > 0 && (
//                                                 <>
//                                                     <label className="form-label small text-gray-600 fw-bold mb-2">Filter by {label.toLowerCase()}</label>
//                                                     <div className='d-flex w-100'>
//                                                         <select
//                                                             className="form-select form-select-sm mb-2"
//                                                             value={value}
//                                                             onChange={e => setFilters({ ...filters, [field]: e.target.value })}
//                                                         >
//                                                             {options.map(option => (
//                                                                 <option key={option.value} value={option.value}>{option.label}</option>
//                                                             ))}
//                                                         </select>
//                                                         {value && (
//                                                             <button
//                                                                 className="btn btn-sm btn-outline-secondary w-100 mb-2"
//                                                                 onClick={() => setFilters({ ...filters, [field]: '' })}
//                                                             >
//                                                                 <i className="fas fa-times me-1"></i> Clear Filter
//                                                             </button>
//                                                         )}
//                                                     </div>
//                                                 </>
//                                             )}
//                                         </div>
//                                         <div className="col-md-12">
//                                             <div style={{ height: '300px' }}>
//                                                 <ResponsiveContainer width="100%" height="100%">
//                                                     {renderChart(chartData, chartType, field)}
//                                                 </ResponsiveContainer>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {selectedJobs.length > 0 && (
//                 <div className="card shadow mb-4 mt-4">
//                     <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
//                         <h6 className="m-0 font-weight-bold text-primary">Selected Jobs ({selectedJobs.length})</h6>
//                     </div>
//                     <div className="card-body">
//                         <div className="table-responsive">
//                             <table className="table table-bordered table-hover table-sm">
//                                 <thead className="bg-light">
//                                     <tr>
//                                         <th>Title</th>
//                                         <th>Type</th>
//                                         <th>Location</th>
//                                         <th>Status</th>
//                                         <th>Applicants</th>
//                                         <th>Posted</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {selectedJobs.slice(0, 5).map((job, index) => (
//                                         <tr key={index}>
//                                             <td>{job.title || 'N/A'}</td>
//                                             <td>{job.type || 'N/A'}</td>
//                                             <td>{job.location || 'N/A'}</td>
//                                             <td>
//                                                 <span className={`badge ${job.status === 'Active' ? 'bg-success' :
//                                                     job.status === 'Draft' ? 'bg-warning' :
//                                                         'bg-secondary'
//                                                     }`}>
//                                                     {job.status || 'N/A'}
//                                                 </span>
//                                             </td>
//                                             <td>{job.applicants || 0}</td>
//                                             <td>{job.posted ? new Date(job.posted).toLocaleDateString() : 'N/A'}</td>
//                                         </tr>
//                                     ))}
//                                     {selectedJobs.length > 5 && (
//                                         <tr>
//                                             <td colSpan="6" className="text-center text-muted">
//                                                 + {selectedJobs.length - 5} more jobs
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SuperAdminJobStats;







// import { useEffect, useMemo, useState, useCallback } from "react";
// import {
//     ResponsiveContainer,
//     BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
//     PieChart, Pie, Cell,
//     AreaChart, Area,
//     RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
// } from "recharts";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { CSVLink } from "react-csv";
// import axios from "axios";
// import { useAuthContext } from "../../../context/auth-context";

// /* ---------- Visual constants ---------- */
// const BASE_GRADIENT_START = "#4F46E5";
// const BASE_GRADIENT_END = "#7C3AED";
// const ALT_GRADIENT_START = "#10B981";
// const ALT_GRADIENT_END = "#06B6D4";

// const COLORS = [
//     "#4F46E5", "#10B981", "#3B82F6", "#EF4444", "#F59E0B", "#6366F1", "#F97316"
// ];

// /* ---------- Helpers ---------- */
// const safeDate = (d) => (d ? new Date(d) : null);

// const normalize = (v) => (v == null ? "" : String(v).trim().toLowerCase());

// const csvHeaders = [
//     { label: "Title", key: "Title" },
//     { label: "Type", key: "Type" },
//     { label: "Location", key: "Location" },
//     { label: "Status", key: "Status" },
//     { label: "Applicants", key: "Applicants" },
//     { label: "Skills", key: "Skills" },
//     { label: "Posted", key: "Posted" }
// ];

// const formatDate = (iso) => {
//     if (!iso) return "-";
//     const d = new Date(iso);
//     if (Number.isNaN(d.getTime())) return "-";
//     return d.toLocaleDateString();
// };

// /* ---------- Component ---------- */
// const SuperAdminJobStats = () => {
//     const { server, token } = useAuthContext();

//     const [jobsData, setJobsData] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const [filters, setFilters] = useState({
//         status: "",
//         type: "",
//         skills: "",
//         location: "",
//         startDate: "",
//         endDate: ""
//     });

//     const [selectedJobs, setSelectedJobs] = useState([]);

//     /* ---------- Fetch data ---------- */
//     const getJobdata = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(
//                 `${server}/api/v1/superadminDashboard/getSuperAdminJobStats`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             // ensure array
//             setJobsData(Array.isArray(response.data?.data) ? response.data.data : []);
//         } catch (err) {
//             console.error("Error fetching job stats:", err);
//             setJobsData([]);
//         } finally {
//             setLoading(false);
//         }
//     }, [server, token]);

//     useEffect(() => {
//         getJobdata();
//     }, [getJobdata]);

//     /* ---------- Derived lists for filters ---------- */
//     const uniqueTypes = useMemo(() =>
//         [...new Set(jobsData.map(j => normalize(j.type)).filter(Boolean))]
//             .map(t => t), [jobsData]);

//     const uniqueStatuses = useMemo(() =>
//         [...new Set(jobsData.map(j => normalize(j.status)).filter(Boolean))]
//             .map(s => s), [jobsData]);

//     const uniqueLocations = useMemo(() =>
//         [...new Set(jobsData.map(j => normalize(j.location)).filter(Boolean))]
//             .map(l => l), [jobsData]);

//     const uniqueSkills = useMemo(() => {
//         const s = new Set();
//         jobsData.forEach(j => (j.skills || []).forEach(sk => {
//             if (sk != null) s.add(String(sk).trim());
//         }));
//         return [...s];
//     }, [jobsData]);

//     /* ---------- Date range filtering ---------- */
//     const dateFilteredData = useMemo(() => {
//         if (!jobsData.length) return [];
//         return jobsData.filter(job => {
//             // ignore items with no posted date for range checks (include them by default)
//             if (!job.posted) return true;
//             const posted = safeDate(job.posted);
//             if (!posted) return true;

//             if (filters.startDate) {
//                 const start = safeDate(filters.startDate);
//                 if (start && posted < start) return false;
//             }
//             if (filters.endDate) {
//                 // treat endDate as inclusive
//                 const end = safeDate(filters.endDate);
//                 if (end) {
//                     // add end-of-day to include the day
//                     end.setHours(23, 59, 59, 999);
//                     if (posted > end) return false;
//                 }
//             }
//             return true;
//         });
//     }, [jobsData, filters.startDate, filters.endDate]);

//     /* ---------- Generic field filter (case-insensitive) ---------- */
//     const filterByField = (field, value, dataset) => {
//         if (!value) return dataset;
//         const valNorm = normalize(value);
//         return dataset.filter(item => {
//             if (field === "skills") {
//                 return (item.skills || []).some(sk => normalize(sk) === valNorm);
//             }
//             // fallback to compare normalized strings
//             return normalize(item[field]) === valNorm;
//         });
//     };

//     /* ---------- Chart data generators ---------- */
//     const generateChartCounts = (field, dataset) => {
//         const map = {};
//         dataset.forEach(item => {
//             if (field === "skills") {
//                 (item.skills || []).forEach(sk => {
//                     const key = (sk == null ? "Unknown" : String(sk).trim());
//                     map[key] = (map[key] || 0) + 1;
//                 });
//             } else {
//                 const key = item[field] || "Unknown";
//                 map[key] = (map[key] || 0) + 1;
//             }
//         });
//         return Object.entries(map).map(([name, count]) => ({ name, count }));
//     };

//     const generateTimeSeries = (dataset) => {
//         const map = {};
//         dataset.forEach(job => {
//             if (!job.posted) return; // skip if no posted date
//             const day = String(job.posted).split("T")[0] || String(job.posted);
//             if (!day) return;
//             map[day] = (map[day] || 0) + 1;
//         });
//         return Object.entries(map)
//             .map(([date, count]) => ({ date, count }))
//             .sort((a, b) => new Date(a.date) - new Date(b.date));
//     };

//     const generateApplicants = (dataset) => dataset.map(j => ({ name: j.title || "Untitled", applicants: j.applicants || 0 }));

//     /* ---------- Chart configurations ---------- */
//     const chartConfigs = [
//         { label: "Job Status", field: "status", type: "pie", options: ["", ...uniqueStatuses] },
//         { label: "Job Type", field: "type", type: "bar", options: ["", ...uniqueTypes] },
//         { label: "Required Skills", field: "skills", type: "pie", options: ["", ...uniqueSkills] },
//         { label: "Locations", field: "location", type: "radar", options: ["", ...uniqueLocations] },
//         { label: "Job Postings Over Time", field: "posted", type: "area", options: [] },
//         { label: "Applicants Per Job", field: "applicants", type: "bar_applicants", options: [] }
//     ];

//     /* ---------- Exports (CSV / PDF) ---------- */
//     const csvData = (selectedJobs.length ? selectedJobs : jobsData).map(j => ({
//         Title: j.title,
//         Type: j.type,
//         Location: j.location,
//         Status: j.status,
//         Applicants: j.applicants,
//         Skills: (j.skills || []).join(", "),
//         Posted: j.posted ? formatDate(j.posted) : ""
//     }));

//     const exportPDF = () => {
//         const list = selectedJobs.length ? selectedJobs : jobsData;
//         if (!list.length) return;
//         const doc = new jsPDF();
//         doc.setFontSize(14);
//         doc.text("Job Listings Report", 14, 18);
//         const head = [["Title", "Type", "Location", "Status", "Applicants", "Posted"]];
//         const body = list.map(j => [
//             j.title || "N/A",
//             j.type || "N/A",
//             j.location || "N/A",
//             j.status || "N/A",
//             (j.applicants || 0).toString(),
//             j.posted ? formatDate(j.posted) : "N/A"
//         ]);
//         autoTable(doc, { startY: 24, head, body, styles: { fontSize: 9 } });
//         doc.save(`job_report_${new Date().toISOString().slice(0, 10)}.pdf`);
//     };

//     /* ---------- UI helpers ---------- */
//     const handleFilterChange = (key, value) => {
//         setFilters(prev => ({ ...prev, [key]: value }));
//     };

//     // clear selected jobs whenever filters change (so selection always matches visible data)
//     useEffect(() => {
//         setSelectedJobs([]);
//     }, [filters]);

//     /* ---------- Chart interaction: click to select matching jobs ---------- */
//     const handleChartClick = (field, payload) => {
//         // payload shape differs by chart type. Try to extract name/value.
//         if (!payload) return;
//         // For Pie: payload.name or payload.payload.name
//         let clickedLabel = payload.name ?? (payload.payload && payload.payload.name) ?? null;
//         // For Bar (category): payload.name or payload.payload.name
//         if (!clickedLabel && payload.activeLabel) clickedLabel = payload.activeLabel;
//         if (!clickedLabel) return;

//         const clickedNorm = normalize(clickedLabel);

//         // Find matching jobs in the base (dateFilteredData) set
//         const matched = dateFilteredData.filter(j => {
//             if (field === "skills") {
//                 return (j.skills || []).some(sk => normalize(sk) === clickedNorm);
//             }
//             if (field === "applicants") {
//                 // applicants chart uses title as name
//                 return normalize(j.title) === clickedNorm;
//             }
//             if (field === "posted") {
//                 // match starting date
//                 return (j.posted || "").startsWith(clickedLabel);
//             }
//             // default: compare normalized fields
//             return normalize(j[field]) === clickedNorm;
//         });

//         setSelectedJobs(matched);
//     };

//     /* ---------- Render chart helper ---------- */
//     const renderChart = (cfg) => {
//         const { label, field, type } = cfg;
//         let filtered = filterByField(field, filters[field], dateFilteredData);
//         if (!field) filtered = dateFilteredData;

//         let data = [];
//         if (type === "area") data = generateTimeSeries(filtered);
//         else if (type === "bar_applicants") data = generateApplicants(filtered);
//         else data = generateChartCounts(field, filtered);

//         if (!data || data.length === 0) {
//             return <div className="text-center text-muted py-4">No data available</div>;
//         }

//         const gradientId = `areaGrad-${field || label}`.replace(/\s+/g, "-");

//         switch (type) {
//             case "pie":
//                 return (
//                     <ResponsiveContainer width="100%" height={260}>
//                         <PieChart>
//                             <Pie
//                                 data={data}
//                                 dataKey="count"
//                                 nameKey="name"
//                                 cx="50%"
//                                 cy="48%"
//                                 outerRadius={80}
//                                 innerRadius={40}
//                                 label
//                                 onClick={(entry, index) => handleChartClick(field, entry)}
//                             >
//                                 {data.map((d, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//                             </Pie>
//                             <Tooltip />
//                             <Legend verticalAlign="bottom" height={36} />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 );

//             case "radar":
//                 return (
//                     <ResponsiveContainer width="100%" height={260}>
//                         <RadarChart data={data}>
//                             <PolarGrid />
//                             <PolarAngleAxis dataKey="name" />
//                             <PolarRadiusAxis />
//                             <Radar dataKey="count" stroke={BASE_GRADIENT_START} fill={BASE_GRADIENT_START} fillOpacity={0.5} />
//                             <Tooltip />
//                         </RadarChart>
//                     </ResponsiveContainer>
//                 );

//             case "area":
//                 return (
//                     <ResponsiveContainer width="100%" height={260}>
//                         <AreaChart data={data}>
//                             <defs>
//                                 <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
//                                     <stop offset="0%" stopColor={BASE_GRADIENT_START} stopOpacity={0.85} />
//                                     <stop offset="100%" stopColor={BASE_GRADIENT_END} stopOpacity={0.05} />
//                                 </linearGradient>
//                             </defs>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="date" />
//                             <YAxis />
//                             <Tooltip />
//                             <Area type="monotone" dataKey="count" stroke={BASE_GRADIENT_START} fill={`url(#${gradientId})`} />
//                         </AreaChart>
//                     </ResponsiveContainer>
//                 );

//             case "bar_applicants":
//                 return (
//                     <ResponsiveContainer width="100%" height={260}>
//                         <BarChart data={data}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Bar
//                                 dataKey="applicants"
//                                 fill={ALT_GRADIENT_START}
//                                 radius={[6, 6, 0, 0]}
//                                 onClick={(entry, index) => handleChartClick("applicants", entry)}
//                             />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 );

//             default: // bar (counts)
//                 return (
//                     <ResponsiveContainer width="100%" height={260}>
//                         <BarChart data={data}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Bar
//                                 dataKey="count"
//                                 fill={BASE_GRADIENT_START}
//                                 radius={[6, 6, 0, 0]}
//                                 onClick={(entry, index) => handleChartClick(field, entry)}
//                             />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 );
//         }
//     };

//     /* ---------- small CSS for modern look (Bootstrap-only friendly) ---------- */
//     const styleBlock = `
//     .job-stats .card { border-radius: 12px; border: 1px solid rgba(15,23,42,0.04); box-shadow: 0 6px 18px rgba(15,23,42,0.04); transition: transform .15s ease, box-shadow .15s ease; }
//     .job-stats .card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(15,23,42,0.06); }
//     .job-stats .chart-title { display:flex; align-items:center; gap:.6rem; font-weight:600; color: #1f2937; }
//     .job-stats .filter-row .form-control, .job-stats .filter-row .form-select { border-radius: 8px; }
//     .job-stats .btn-gradient { background: linear-gradient(90deg, ${BASE_GRADIENT_START}, ${BASE_GRADIENT_END}); color: #fff; border: none; border-radius: 8px; padding: .45rem .9rem; box-shadow: 0 6px 18px rgba(99,102,241,0.12); }
//     .job-stats .btn-outline-soft { border-radius: 8px; padding: .45rem .9rem; border: 1px solid rgba(15,23,42,0.06); background: white; }
//     .job-stats .small-muted { color: #6b7280; font-size: .85rem; }
//     .job-stats .stat-card { border-radius: 10px; padding: .8rem; background: white; display:flex; gap:.8rem; align-items:center; }
//     .job-stats .stat-icon { width:44px; height:44px; display:flex; align-items:center; justify-content:center; border-radius:8px; color:#fff; }
//     .job-stats .stat-icon.primary { background: linear-gradient(90deg, ${BASE_GRADIENT_START}, ${BASE_GRADIENT_END}); }
//     .job-stats .stat-icon.success { background: linear-gradient(90deg, ${ALT_GRADIENT_START}, ${ALT_GRADIENT_END}); }
//   `;

//     /* ---------- Render ---------- */
//     return (
//         <div className="container-fluid px-3 job-stats">
//             <style>{styleBlock}</style>

//             {/* Header */}
//             <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div>
//                     <h4 className="mb-0">Job Analytics</h4>
//                     <div className="small-muted">Overview of job listings, applicants & trends</div>
//                 </div>

//                 <div className="d-flex gap-2">
//                     <CSVLink data={csvData} headers={csvHeaders} filename={`jobs_export_${new Date().toISOString().slice(0, 10)}.csv`}>
//                         <button className="btn btn-outline-soft">Export CSV</button>
//                     </CSVLink>
//                     <button className="btn btn-gradient" onClick={exportPDF}>Export PDF</button>
//                 </div>
//             </div>

//             {/* Stats row */}
//             <div className="row g-3 mb-3">
//                 <div className="col-6 col-md-3">
//                     <div className="stat-card">
//                         <div className="stat-icon primary">
//                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
//                         </div>
//                         <div>
//                             <div className="h5 mb-0">{jobsData.length}</div>
//                             <div className="small-muted">Total Jobs</div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-6 col-md-3">
//                     <div className="stat-card">
//                         <div className="stat-icon success">
//                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
//                         </div>
//                         <div>
//                             <div className="h5 mb-0">{jobsData.filter(j => normalize(j.status) === "active").length}</div>
//                             <div className="small-muted">Active</div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-6 col-md-3">
//                     <div className="stat-card">
//                         <div className="stat-icon" style={{ background: "linear-gradient(90deg,#f97316,#fb7185)", color: "#fff" }}>
//                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1.5" /></svg>
//                         </div>
//                         <div>
//                             <div className="h5 mb-0">{jobsData.reduce((s, j) => s + (j.applicants || 0), 0)}</div>
//                             <div className="small-muted">Total Applicants</div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-6 col-md-3">
//                     <div className="stat-card">
//                         <div className="stat-icon" style={{ background: "linear-gradient(90deg,#06b6d4,#3b82f6)", color: "#fff" }}>
//                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 7h18M3 12h18M3 17h18" stroke="white" strokeWidth="1.4" strokeLinecap="round" /></svg>
//                         </div>
//                         <div>
//                             <div className="h5 mb-0">{new Set(jobsData.map(j => normalize(j.location))).size}</div>
//                             <div className="small-muted">Locations</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Filters */}
//             <div className="card mb-3 p-3">
//                 <div className="row filter-row g-3 align-items-end">
//                     <div className="col-md-2">
//                         <label className="form-label small">Status</label>
//                         <select className="form-select" value={filters.status} onChange={e => handleFilterChange("status", e.target.value)}>
//                             <option value="">All</option>
//                             {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
//                         </select>
//                     </div>

//                     <div className="col-md-2">
//                         <label className="form-label small">Type</label>
//                         <select className="form-select" value={filters.type} onChange={e => handleFilterChange("type", e.target.value)}>
//                             <option value="">All</option>
//                             {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
//                         </select>
//                     </div>

//                     <div className="col-md-2">
//                         <label className="form-label small">Skill</label>
//                         <select className="form-select" value={filters.skills} onChange={e => handleFilterChange("skills", e.target.value)}>
//                             <option value="">All</option>
//                             {uniqueSkills.map(sk => <option key={sk} value={sk}>{sk}</option>)}
//                         </select>
//                     </div>

//                     <div className="col-md-2">
//                         <label className="form-label small">Location</label>
//                         <select className="form-select" value={filters.location} onChange={e => handleFilterChange("location", e.target.value)}>
//                             <option value="">All</option>
//                             {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
//                         </select>
//                     </div>

//                     <div className="col-md-2">
//                         <label className="form-label small">From</label>
//                         <input className="form-control" type="date" value={filters.startDate} onChange={e => handleFilterChange("startDate", e.target.value)} />
//                     </div>

//                     <div className="col-md-2">
//                         <label className="form-label small">To</label>
//                         <input className="form-control" type="date" value={filters.endDate} onChange={e => handleFilterChange("endDate", e.target.value)} />
//                     </div>

//                     <div className="col-12 mt-2">
//                         <div className="d-flex justify-content-end gap-2">
//                             <button className="btn btn-outline-soft" onClick={() => setFilters({
//                                 status: "", type: "", skills: "", location: "", startDate: "", endDate: ""
//                             })}>Reset Filters</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Charts grid */}
//             <div className="row">
//                 {chartConfigs.map(cfg => (
//                     <div key={cfg.label} className="col-lg-6 mb-3">
//                         <div className="card p-3">
//                             <div className="chart-title mb-2">
//                                 <span style={{ width: 8, height: 8, borderRadius: 4, background: BASE_GRADIENT_START, display: "inline-block" }}></span>
//                                 <span className="ms-2">{cfg.label}</span>
//                                 <small className="ms-auto small-muted">{/* reserved */}</small>
//                             </div>

//                             <div>
//                                 {renderChart(cfg)}
//                             </div>

//                             <div className="mt-2 small-muted">Tip: click a pie slice or bar to populate the Selected Jobs list</div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Selected jobs / table */}
//             <div className="card mt-3 p-3">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                     <strong>Selected Jobs ({selectedJobs.length})</strong>
//                     <div>
//                         <button className="btn btn-outline-soft me-2" onClick={() => setSelectedJobs([])}>Clear</button>
//                         <CSVLink data={csvData} headers={csvHeaders} filename={`jobs_selected_${new Date().toISOString().slice(0, 10)}.csv`}>
//                             <button className="btn btn-gradient">Download CSV</button>
//                         </CSVLink>
//                     </div>
//                 </div>

//                 {selectedJobs.length === 0 ? (
//                     <div className="text-muted">No jobs selected. Click bars / slices to populate this list.</div>
//                 ) : (
//                     <div className="table-responsive">
//                         <table className="table table-sm table-borderless">
//                             <thead>
//                                 <tr>
//                                     <th>Title</th><th>Type</th><th>Location</th><th>Status</th><th>Applicants</th><th>Posted</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {selectedJobs.map((j, idx) => (
//                                     <tr key={j._id || idx}>
//                                         <td>{j.title}</td>
//                                         <td>{j.type}</td>
//                                         <td>{j.location}</td>
//                                         <td><span className={`badge ${normalize(j.status) === "active" ? "bg-success" : "bg-secondary"}`}>{j.status}</span></td>
//                                         <td>{j.applicants}</td>
//                                         <td>{j.posted ? formatDate(j.posted) : "-"}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             {/* Loading overlay */}
//             {loading && (
//                 <div className="position-fixed top-0 start-0 vw-100 vh-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(15,23,42,0.04)", zIndex: 2000 }}>
//                     <div className="p-3 rounded" style={{ background: "white", boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
//                         Loading...
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SuperAdminJobStats;





import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
    ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
    PieChart, Pie, Cell,
    AreaChart, Area,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";
import axios from "axios";
import { useAuthContext } from "../../../context/auth-context";

/* ---------- Visual constants ---------- */
const BASE_GRADIENT_START = "#4F46E5";
const BASE_GRADIENT_END = "#7C3AED";
const ALT_GRADIENT_START = "#10B981";
const ALT_GRADIENT_END = "#06B6D4";

const COLORS = [
    "#4F46E5", "#10B981", "#3B82F6", "#EF4444", "#F59E0B", "#6366F1", "#F97316"
];

/* ---------- Helpers ---------- */
const safeDate = (d) => (d ? new Date(d) : null);
const normalize = (v) => (v == null ? "" : String(v).trim().toLowerCase());
const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
};

const csvHeaders = [
    { label: "Title", key: "Title" },
    { label: "Type", key: "Type" },
    { label: "Location", key: "Location" },
    { label: "Status", key: "Status" },
    { label: "Applicants", key: "Applicants" },
    { label: "Skills", key: "Skills" },
    { label: "Posted", key: "Posted" }
];

/* ---------- Component ---------- */
const SuperAdminJobStats = () => {
    const { server, token } = useAuthContext();

    const [jobsData, setJobsData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        status: "",
        type: "",
        skills: "",
        location: "",
        startDate: "",
        endDate: ""
    });

    const [selectedJobs, setSelectedJobs] = useState([]);

    // UI extras
    const [selectedJobModal, setSelectedJobModal] = useState(null); // job object for modal
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("none"); // none | title_asc | title_desc | applicants_asc | applicants_desc | posted_desc | posted_asc

    // chart type toggles (default from config); key by label
    const [chartTypeMap, setChartTypeMap] = useState({
        "Job Status": "pie",
        "Job Type": "bar",
        "Required Skills": "pie",
        "Locations": "radar",
        "Job Postings Over Time": "area",
        "Applicants Per Job": "bar_applicants"
    });

    const getJobdata = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${server}/api/v1/superadminDashboard/getSuperAdminJobStats`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setJobsData(Array.isArray(response.data?.data) ? response.data.data : []);
        } catch (err) {
            console.error("Error fetching job stats:", err);
            setJobsData([]);
        } finally {
            setLoading(false);
        }
    }, [server, token]);

    useEffect(() => {
        getJobdata();
    }, [getJobdata]);

    /* ---------- Derived lists for filters ---------- */
    const uniqueTypes = useMemo(() =>
        [...new Set(jobsData.map(j => normalize(j.type)).filter(Boolean))], [jobsData]);

    const uniqueStatuses = useMemo(() =>
        [...new Set(jobsData.map(j => normalize(j.status)).filter(Boolean))], [jobsData]);

    const uniqueLocations = useMemo(() =>
        [...new Set(jobsData.map(j => normalize(j.location)).filter(Boolean))], [jobsData]);

    const uniqueSkills = useMemo(() => {
        const s = new Set();
        jobsData.forEach(j => (j.skills || []).forEach(sk => { if (sk != null) s.add(String(sk).trim()); }));
        return [...s];
    }, [jobsData]);

    /* ---------- Date range filtering ---------- */
    const dateFilteredData = useMemo(() => {
        if (!jobsData.length) return [];
        return jobsData.filter(job => {
            if (!job.posted) return true;
            const posted = safeDate(job.posted);
            if (!posted) return true;

            if (filters.startDate) {
                const start = safeDate(filters.startDate);
                if (start && posted < start) return false;
            }
            if (filters.endDate) {
                const end = safeDate(filters.endDate);
                if (end) {
                    end.setHours(23, 59, 59, 999);
                    if (posted > end) return false;
                }
            }
            return true;
        });
    }, [jobsData, filters.startDate, filters.endDate]);

    /* ---------- Generic field filter (case-insensitive) ---------- */
    const filterByField = (field, value, dataset) => {
        if (!value) return dataset;
        const valNorm = normalize(value);
        return dataset.filter(item => {
            if (field === "skills") {
                return (item.skills || []).some(sk => normalize(sk) === valNorm);
            }
            return normalize(item[field]) === valNorm;
        });
    };

    /* ---------- Chart data generators ---------- */
    const generateChartCounts = (field, dataset) => {
        const map = {};
        dataset.forEach(item => {
            if (field === "skills") {
                (item.skills || []).forEach(sk => {
                    const key = sk == null ? "Unknown" : String(sk).trim();
                    map[key] = (map[key] || 0) + 1;
                });
            } else {
                const key = item[field] || "Unknown";
                map[key] = (map[key] || 0) + 1;
            }
        });
        return Object.entries(map).map(([name, count]) => ({ name, count }));
    };

    const generateTimeSeries = (dataset) => {
        const map = {};
        dataset.forEach(job => {
            if (!job.posted) return;
            const day = String(job.posted).split("T")[0] || String(job.posted);
            if (!day) return;
            map[day] = (map[day] || 0) + 1;
        });
        return Object.entries(map).map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const generateApplicants = (dataset) => dataset.map(j => ({ name: j.title || "Untitled", applicants: j.applicants || 0 }));

    /* ---------- Chart configurations ---------- */
    const chartConfigs = [
        { label: "Job Status", field: "status", type: chartTypeMap["Job Status"], options: ["", ...uniqueStatuses] },
        { label: "Job Type", field: "type", type: chartTypeMap["Job Type"], options: ["", ...uniqueTypes] },
        { label: "Required Skills", field: "skills", type: chartTypeMap["Required Skills"], options: ["", ...uniqueSkills] },
        { label: "Locations", field: "location", type: chartTypeMap["Locations"], options: ["", ...uniqueLocations] },
        { label: "Job Postings Over Time", field: "posted", type: chartTypeMap["Job Postings Over Time"], options: [] },
        { label: "Applicants Per Job", field: "applicants", type: chartTypeMap["Applicants Per Job"], options: [] }
    ];

    /* ---------- Exports ---------- */
    const csvData = (selectedJobs.length ? selectedJobs : jobsData).map(j => ({
        Title: j.title,
        Type: j.type,
        Location: j.location,
        Status: j.status,
        Applicants: j.applicants,
        Skills: (j.skills || []).join(", "),
        Posted: j.posted ? formatDate(j.posted) : ""
    }));

    const exportPDF = () => {
        const list = selectedJobs.length ? selectedJobs : jobsData;
        if (!list.length) return;
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("Job Listings Report", 14, 18);
        const head = [["Title", "Type", "Location", "Status", "Applicants", "Posted"]];
        const body = list.map(j => [
            j.title || "N/A",
            j.type || "N/A",
            j.location || "N/A",
            j.status || "N/A",
            (j.applicants || 0).toString(),
            j.posted ? formatDate(j.posted) : "N/A"
        ]);
        autoTable(doc, { startY: 24, head, body, styles: { fontSize: 9 } });
        doc.save(`job_report_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    /* ---------- UI helpers ---------- */
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => setSelectedJobs([]), [filters]); // clear selection when filters change

    /* ---------- Chart interaction ---------- */
    const handleChartClick = (field, entry) => {
        if (!entry) return;
        // entry may be payload object or event depending on chart
        const clickedLabel = entry.name ?? (entry.payload && entry.payload.name) ?? entry.activeLabel ?? null;
        if (!clickedLabel) return;

        const clickedNorm = normalize(clickedLabel);

        const matched = dateFilteredData.filter(j => {
            if (field === "skills") {
                return (j.skills || []).some(sk => normalize(sk) === clickedNorm);
            }
            if (field === "applicants") {
                return normalize(j.title) === clickedNorm;
            }
            if (field === "posted") {
                return (j.posted || "").startsWith(clickedLabel);
            }
            return normalize(j[field]) === clickedNorm;
        });

        setSelectedJobs(matched);
    };

    /* ---------- Chart toggle handler ---------- */
    const toggleChartType = (label, newType) => {
        setChartTypeMap(prev => ({ ...prev, [label]: newType }));
    };

    /* ---------- Render chart helper ---------- */
    const renderChartInner = (cfg) => {
        const { label, field } = cfg;
        const type = chartTypeMap[label] || cfg.type;
        let filtered = filterByField(field, filters[field], dateFilteredData);
        if (!field) filtered = dateFilteredData;

        let data = [];
        if (type === "area") data = generateTimeSeries(filtered);
        else if (type === "bar_applicants") data = generateApplicants(filtered);
        else data = generateChartCounts(field, filtered);

        if (!data || data.length === 0) {
            return <div className="text-center text-muted py-4">No data available</div>;
        }

        const gradientId = `areaGrad-${(field || label).replace(/\s+/g, "-")}`;

        switch (type) {
            case "pie":
                return (
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="count"
                                nameKey="name"
                                cx="50%"
                                cy="48%"
                                innerRadius={40}
                                outerRadius={80}
                                label
                                onClick={(entry) => handleChartClick(field, entry)}
                            >
                                {data.map((d, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case "radar":
                return (
                    <ResponsiveContainer width="100%" height={260}>
                        <RadarChart data={data}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" />
                            <PolarRadiusAxis />
                            <Radar dataKey="count" stroke={BASE_GRADIENT_START} fill={BASE_GRADIENT_START} fillOpacity={0.5} />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                );

            case "area":
                return (
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={BASE_GRADIENT_START} stopOpacity={0.85} />
                                    <stop offset="100%" stopColor={BASE_GRADIENT_END} stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="count" stroke={BASE_GRADIENT_START} fill={`url(#${gradientId})`} />
                        </AreaChart>
                    </ResponsiveContainer>
                );

            case "bar_applicants":
                return (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="applicants" fill={ALT_GRADIENT_START} radius={[6, 6, 0, 0]} onClick={(entry) => handleChartClick("applicants", entry)} />
                        </BarChart>
                    </ResponsiveContainer>
                );

            default: // bar counts
                return (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill={BASE_GRADIENT_START} radius={[6, 6, 0, 0]} onClick={(entry) => handleChartClick(field, entry)} />
                        </BarChart>
                    </ResponsiveContainer>
                );
        }
    };

    /* ---------- Small style block ---------- */
    const styleBlock = `
    .job-stats .card { border-radius: 12px; border: 1px solid rgba(15,23,42,0.04); box-shadow: 0 6px 18px rgba(15,23,42,0.04); transition: transform .15s ease, box-shadow .15s ease; }
    .job-stats .card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(15,23,42,0.06); }
    .job-stats .chart-title { display:flex; align-items:center; gap:.6rem; font-weight:600; color: #1f2937; }
    .job-stats .filter-row .form-control, .job-stats .filter-row .form-select { border-radius: 8px; }
    .job-stats .btn-gradient { background: linear-gradient(90deg, ${BASE_GRADIENT_START}, ${BASE_GRADIENT_END}); color: #fff; border: none; border-radius: 8px; padding: .45rem .9rem; box-shadow: 0 6px 18px rgba(99,102,241,0.12); }
    .job-stats .btn-outline-soft { border-radius: 8px; padding: .45rem .9rem; border: 1px solid rgba(15,23,42,0.06); background: white; }
    .job-stats .small-muted { color: #6b7280; font-size: .85rem; }
    .job-stats .stat-card { border-radius: 10px; padding: .8rem; background: white; display:flex; gap:.8rem; align-items:center; }
    .job-stats .stat-icon { width:44px; height:44px; display:flex; align-items:center; justify-content:center; border-radius:8px; color:#fff; }
    .job-stats .stat-icon.primary { background: linear-gradient(90deg, ${BASE_GRADIENT_START}, ${BASE_GRADIENT_END}); }
    .job-stats .stat-icon.success { background: linear-gradient(90deg, ${ALT_GRADIENT_START}, ${ALT_GRADIENT_END}); }
    /* skeleton */
    .skeleton { background: linear-gradient(90deg,#f3f4f6,#eef2ff,#f3f4f6); background-size: 200% 100%; animation: shimmer 1.2s linear infinite; border-radius: 8px; }
    @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
  `;

    /* ---------- Selected jobs: apply search & sort ---------- */
    const filteredSelectedJobs = useMemo(() => {
        let list = selectedJobs.slice();

        if (searchTerm) {
            const q = normalize(searchTerm);
            list = list.filter(j =>
                normalize(j.title).includes(q) ||
                normalize(j.company).includes(q) ||
                normalize(j.location).includes(q)
            );
        }

        switch (sortBy) {
            case "title_asc":
                list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
                break;
            case "title_desc":
                list.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
                break;
            case "applicants_asc":
                list.sort((a, b) => (a.applicants || 0) - (b.applicants || 0));
                break;
            case "applicants_desc":
                list.sort((a, b) => (b.applicants || 0) - (a.applicants || 0));
                break;
            case "posted_desc":
                list.sort((a, b) => new Date(b.posted || 0) - new Date(a.posted || 0));
                break;
            case "posted_asc":
                list.sort((a, b) => new Date(a.posted || 0) - new Date(b.posted || 0));
                break;
            default:
                break;
        }

        return list;
    }, [selectedJobs, searchTerm, sortBy]);

    /* ---------- Render ---------- */
    return (
        <div className="container-fluid px-3 job-stats">
            <style>{styleBlock}</style>

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="mb-0">Job Analytics</h4>
                    <div className="small-muted">Overview of job listings, applicants & trends</div>
                </div>

                <div className="d-flex gap-2">
                    <CSVLink data={csvData} headers={csvHeaders} filename={`jobs_export_${new Date().toISOString().slice(0, 10)}.csv`}>
                        <button className="btn btn-outline-soft">Export CSV</button>
                    </CSVLink>
                    <button className="btn btn-gradient" onClick={exportPDF}>Export PDF</button>
                </div>
            </div>

            {/* Stats row */}
            <div className="row g-3 mb-3">
                {[{
                    icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>),
                    value: jobsData.length,
                    label: "Total Jobs",
                    cls: "primary"
                }, {
                    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
                    value: jobsData.filter(j => normalize(j.status) === "active").length,
                    label: "Active",
                    cls: "success"
                }, {
                    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1.5" /></svg>),
                    value: jobsData.reduce((s, j) => s + (j.applicants || 0), 0),
                    label: "Total Applicants",
                    cls: "warm"
                }, {
                    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 7h18M3 12h18M3 17h18" stroke="white" strokeWidth="1.4" strokeLinecap="round" /></svg>),
                    value: new Set(jobsData.map(j => normalize(j.location))).size,
                    label: "Locations",
                    cls: "blue"
                }].map((s, idx) => (
                    <div key={idx} className="col-6 col-md-3">
                        <div className="stat-card">
                            <div className={`stat-icon ${s.cls === "primary" ? "primary" : s.cls === "success" ? "success" : ""}`} style={{
                                background: s.cls === "warm" ? "linear-gradient(90deg,#f97316,#fb7185)" : s.cls === "blue" ? "linear-gradient(90deg,#06b6d4,#3b82f6)" : undefined
                            }}>
                                {s.icon}
                            </div>
                            <div>
                                <div className="h5 mb-0">{s.value}</div>
                                <div className="small-muted">{s.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="card mb-3 p-3">
                <div className="row filter-row g-3 align-items-end">
                    <div className="col-md-2">
                        <label className="form-label small">Status</label>
                        <select className="form-select" value={filters.status} onChange={e => handleFilterChange("status", e.target.value)}>
                            <option value="">All</option>
                            {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <label className="form-label small">Type</label>
                        <select className="form-select" value={filters.type} onChange={e => handleFilterChange("type", e.target.value)}>
                            <option value="">All</option>
                            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <label className="form-label small">Skill</label>
                        <select className="form-select" value={filters.skills} onChange={e => handleFilterChange("skills", e.target.value)}>
                            <option value="">All</option>
                            {uniqueSkills.map(sk => <option key={sk} value={sk}>{sk}</option>)}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <label className="form-label small">Location</label>
                        <select className="form-select" value={filters.location} onChange={e => handleFilterChange("location", e.target.value)}>
                            <option value="">All</option>
                            {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <label className="form-label small">From</label>
                        <input className="form-control" type="date" value={filters.startDate} onChange={e => handleFilterChange("startDate", e.target.value)} />
                    </div>

                    <div className="col-md-2">
                        <label className="form-label small">To</label>
                        <input className="form-control" type="date" value={filters.endDate} onChange={e => handleFilterChange("endDate", e.target.value)} />
                    </div>

                    <div className="col-12 mt-2">
                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-outline-soft" onClick={() => setFilters({
                                status: "", type: "", skills: "", location: "", startDate: "", endDate: ""
                            })}>Reset Filters</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts grid (with toggles & skeletons) */}
            <div className="row">
                {chartConfigs.map(cfg => (
                    <div key={cfg.label} className="col-lg-6 mb-3">
                        <div className="card p-3">
                            <div className="d-flex align-items-center mb-2">
                                <div className="chart-title">
                                    <span style={{ width: 8, height: 8, borderRadius: 4, background: BASE_GRADIENT_START, display: "inline-block" }}></span>
                                    <span className="ms-2">{cfg.label}</span>
                                </div>

                                {/* chart type toggles */}
                                <div className="ms-auto d-flex align-items-center gap-2">
                                    {/* Provide some possible types—choose per chart */}
                                    {["pie", "bar", "radar", "area", "bar_applicants"].map(t => (
                                        // only show relevant toggles
                                        (t === "bar_applicants" && cfg.label !== "Applicants Per Job") ? null :
                                            (t === "area" && cfg.field !== "posted" ? null :
                                                (t === "radar" && cfg.field !== "location" ? null :
                                                    <button
                                                        key={t}
                                                        onClick={() => toggleChartType(cfg.label, t)}
                                                        className={`btn btn-sm ${chartTypeMap[cfg.label] === t ? "btn-gradient" : "btn-outline-soft"}`}
                                                        title={`Switch to ${t}`}
                                                    >
                                                        {t}
                                                    </button>
                                                )
                                            )
                                    ))}
                                </div>
                            </div>

                            <div>
                                {loading ? (
                                    // skeleton while loading
                                    <div style={{ height: 260, display: "grid", placeItems: "center" }}>
                                        <div style={{ width: "90%" }}>
                                            <div className="skeleton" style={{ height: 160, marginBottom: 12 }} />
                                            <div className="d-flex gap-2">
                                                <div className="skeleton" style={{ height: 12, width: "60%" }} />
                                                <div className="skeleton" style={{ height: 12, width: "20%" }} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    renderChartInner(cfg)
                                )}
                            </div>

                            <div className="mt-2 small-muted">Tip: click a pie slice or bar to populate the Selected Jobs list</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected jobs controls */}
            <div className="card mt-3 p-3">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-2 align-items-start align-items-md-center mb-2">
                    <strong>Selected Jobs ({selectedJobs.length})</strong>

                    <div className="d-flex gap-2">
                        <div className="input-group">
                            <span className="input-group-text">Search</span>
                            <input type="text" className="form-control" placeholder="Search title, company or location..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>

                        <select className="form-select" style={{ width: 220 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="none">Sort: None</option>
                            <option value="title_asc">Title A → Z</option>
                            <option value="title_desc">Title Z → A</option>
                            <option value="applicants_desc">Applicants ↓</option>
                            <option value="applicants_asc">Applicants ↑</option>
                            <option value="posted_desc">Posted New → Old</option>
                            <option value="posted_asc">Posted Old → New</option>
                        </select>

                        <button className="btn btn-outline-soft" onClick={() => { setSelectedJobs([]); setSearchTerm(""); setSortBy("none"); }}>Clear</button>

                        <CSVLink data={csvData} headers={csvHeaders} filename={`jobs_selected_${new Date().toISOString().slice(0, 10)}.csv`}>
                            <button className="btn btn-gradient">Download CSV</button>
                        </CSVLink>
                    </div>
                </div>

                {filteredSelectedJobs.length === 0 ? (
                    <div className="text-muted">No jobs selected. Click bars / slices to populate this list.</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-sm table-borderless align-middle">
                            <thead>
                                <tr>
                                    <th>Title</th><th>Company</th><th>Type</th><th>Location</th><th>Status</th><th>Applicants</th><th>Posted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSelectedJobs.map((j, idx) => (
                                    <tr key={j._id || idx} style={{ cursor: "pointer" }} onClick={() => setSelectedJobModal(j)}>
                                        <td>{j.title}</td>
                                        <td>{j.company}</td>
                                        <td>{j.type}</td>
                                        <td>{j.location}</td>
                                        <td><span className={`badge ${normalize(j.status) === "active" ? "bg-success" : "bg-secondary"}`}>{j.status}</span></td>
                                        <td>{j.applicants}</td>
                                        <td>{j.posted ? formatDate(j.posted) : "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Job detail modal (Bootstrap markup) */}
            {selectedJobModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{ background: "rgba(0,0,0,0.45)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedJobModal.title}</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedJobModal(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Company:</strong> {selectedJobModal.company}</p>
                                <p><strong>Location:</strong> {selectedJobModal.location}</p>
                                <p><strong>Type:</strong> {selectedJobModal.type} • <strong>Experience:</strong> {selectedJobModal.experience}</p>
                                <p><strong>Salary:</strong> {selectedJobModal.salary || "-"}</p>
                                <p><strong>Applicants:</strong> {selectedJobModal.applicants || 0}</p>
                                <hr />
                                <p><strong>Description</strong></p>
                                <p className="small-muted">{selectedJobModal.description || "-"}</p>

                                <hr />
                                <p><strong>Requirements</strong></p>
                                <ul>
                                    {(selectedJobModal.requirements || []).map((r, i) => <li key={i}>{r}</li>)}
                                </ul>

                                <hr />
                                <p><strong>Skills</strong></p>
                                <div className="d-flex flex-wrap gap-2">
                                    {(selectedJobModal.skills || []).map((sk, i) => (
                                        <span key={i} className="badge bg-light text-dark" style={{ padding: "6px 10px", borderRadius: 8 }}>{sk}</span>
                                    ))}
                                </div>

                                <hr />
                                <p className="small-muted"><strong>Posted:</strong> {selectedJobModal.posted ? formatDate(selectedJobModal.posted) : "-"}</p>
                                <p className="small-muted"><strong>Updated:</strong> {selectedJobModal.updatedAt ? formatDate(selectedJobModal.updatedAt) : "-"}</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-soft" onClick={() => setSelectedJobModal(null)}>Close</button>
                                <a className="btn btn-gradient" href={selectedJobModal.resume || "#"} target="_blank" rel="noreferrer">Open Job (if link)</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading overlay */}
            {loading && (
                <div className="position-fixed top-0 start-0 vw-100 vh-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(15,23,42,0.04)", zIndex: 2000 }}>
                    <div className="p-3 rounded" style={{ background: "white", boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
                        Loading...
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminJobStats;

