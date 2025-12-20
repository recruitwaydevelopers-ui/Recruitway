// import { useEffect, useMemo, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { CSVLink } from 'react-csv';
// import { useSuperAdminContext } from '../../../context/superadmin-context';

// const COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'];

// const SuperAdminCandidateStats = () => {

//     const { isLoading, candidates: candidateList, getAllCandidatesWithVerificationStatus } = useSuperAdminContext()

//     useEffect(() => {
//         getAllCandidatesWithVerificationStatus()
//     }, [])

//     const [filters, setFilters] = useState({
//         isVerified: '',
//         gender: '',
//         skills: '',
//         location: '',
//         startDate: '',
//         endDate: ''
//     });

//     const [selectedCandidates, setSelectedCandidates] = useState([]);

//     const uniqueGenders = useMemo(() => [...new Set(candidateList.map(candidate => candidate.gender || '').filter(Boolean))], [candidateList]);
//     const uniqueSkills = useMemo(() => {
//         const skillsSet = new Set();
//         candidateList.forEach(candidate => {
//             if (candidate.skills && Array.isArray(candidate.skills)) {
//                 candidate.skills.forEach(skill => {
//                     if (skill.skills) {
//                         skillsSet.add(skill.skills);
//                     }
//                 });
//             }
//         });
//         return [...skillsSet];
//     }, [candidateList]);
//     const uniqueLocations = useMemo(() => [...new Set(candidateList.map(candidate => candidate.location || '').filter(Boolean))], [candidateList]);

//     const dateFilteredData = useMemo(() => {
//         return candidateList.filter(candidate => {
//             const candidateDate = new Date(candidate.createdAt);
//             if (isNaN(candidateDate.getTime())) return false;

//             const startDate = filters.startDate ? new Date(filters.startDate) : null;
//             const endDate = filters.endDate ? new Date(filters.endDate) : null;

//             if (startDate && isNaN(startDate.getTime())) return false;
//             if (endDate && isNaN(endDate.getTime())) return false;

//             if (startDate && endDate) return candidateDate >= startDate && candidateDate <= endDate;
//             if (startDate) return candidateDate >= startDate;
//             if (endDate) return candidateDate <= endDate;
//             return true;
//         });
//     }, [filters.startDate, filters.endDate, candidateList]);

//     const filterBy = (field, value, data) => {
//         if (!value) return data;

//         return data.filter(candidate => {
//             if (field === 'isVerified') return candidate.isVerified?.toString() === value;
//             if (field === 'gender') return candidate.gender === value;
//             if (field === 'skills') {
//                 return candidate.skills?.some(skill =>
//                     skill.skills === value
//                 );
//             }
//             if (field === 'location') return candidate.location === value;
//             return true;
//         });
//     };

//     const generateChartData = (field, data) => {
//         const count = {};
//         data.forEach(candidate => {
//             if (field === 'skills') {
//                 candidate.skills?.forEach(skill => {
//                     const key = skill.skills;
//                     count[key] = (count[key] || 0) + 1;
//                 });
//             } else {
//                 const key = candidate[field];
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

//         data.forEach(candidate => {
//             if (!candidate.createdAt) return;

//             const date = new Date(candidate.createdAt);
//             if (isNaN(date.getTime())) return;

//             const dateStr = date.toISOString().split('T')[0];
//             dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
//         });

//         return Object.entries(dateCounts)
//             .map(([date, count]) => ({ date, count }))
//             .sort((a, b) => new Date(a.date) - new Date(b.date));
//     };

//     const chartConfigs = [
//         {
//             label: 'Verification Status',
//             field: 'isVerified',
//             value: filters.isVerified,
//             chartType: 'pie',
//             options: [
//                 { value: '', label: 'All' },
//                 { value: 'true', label: 'Verified' },
//                 { value: 'false', label: 'Not Verified' }
//             ]
//         },
//         {
//             label: 'Gender',
//             field: 'gender',
//             value: filters.gender,
//             chartType: 'bar',
//             options: [{ value: '', label: 'All Genders' }, ...uniqueGenders.map(gender => ({ value: gender, label: gender }))]
//         },
//         {
//             label: 'Skills',
//             field: 'skills',
//             value: filters.skills,
//             chartType: 'pie',
//             options: [{ value: '', label: 'All Skills' }, ...uniqueSkills.map(skill => ({ value: skill, label: skill }))]
//         },
//         {
//             label: 'Locations',
//             field: 'location',
//             value: filters.location,
//             chartType: 'radar',
//             options: [{ value: '', label: 'All Locations' }, ...uniqueLocations.map(loc => ({ value: loc, label: loc }))]
//         },
//         {
//             label: 'Candidate Registrations Over Time',
//             field: 'createdAt',
//             value: '',
//             chartType: 'area',
//             options: []
//         }
//     ];

//     const exportPDF = () => {
//         if (!selectedCandidates.length) return;

//         const doc = new jsPDF();
//         doc.text('Candidate List Report', 14, 16);

//         autoTable(doc, {
//             head: [['Name', 'Gender', 'Skills', 'Verified', 'Created']],
//             body: selectedCandidates.map(candidate => [
//                 candidate.fullname || 'N/A',
//                 candidate.gender || 'N/A',
//                 candidate.skills?.map(s => s.skills).join(', ') || 'N/A',
//                 candidate.isVerified ? 'Yes' : 'No',
//                 candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : 'N/A'
//             ])
//         });
//         doc.save('candidate-report.pdf');
//     };

//     const csvData = selectedCandidates.map(candidate => ({
//         Name: candidate.fullname || '',
//         Gender: candidate.gender || '',
//         Skills: candidate.skills?.map(s => s.skills).join(', ') || '',
//         Verified: candidate.isVerified ? 'Yes' : 'No',
//         Created: candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : ''
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
//                                     setSelectedCandidates(filterBy(field, chartData[index].name, dateFilteredData));
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
//                                     setSelectedCandidates(filterBy(field, data.activeLabel, dateFilteredData));
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
//                             formatter={(value) => [`${value} registrations`]}
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
//                 return (
//                     <BarChart
//                         data={chartData}
//                         margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                         onClick={data => {
//                             if (data?.activeLabel) {
//                                 setSelectedCandidates(filterBy(field, data.activeLabel, dateFilteredData));
//                             }
//                         }}
//                     >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fc" />
//                         <XAxis
//                             dataKey="name"
//                             tick={{ fill: '#5a5c69' }}
//                         />
//                         <YAxis
//                             tick={{ fill: '#5a5c69' }}
//                         />
//                         <Tooltip
//                             formatter={(value) => [`${value} (${chartData.find(item => item.count === value)?.percent || '0'}%)`]}
//                             contentStyle={{
//                                 borderRadius: '0.35rem',
//                                 border: '1px solid #e3e6f0',
//                                 backgroundColor: '#fff'
//                             }}
//                         />
//                         <Legend
//                             wrapperStyle={{
//                                 paddingTop: '20px'
//                             }}
//                         />
//                         <Bar
//                             dataKey="count"
//                             fill="#4e73df"
//                             radius={[4, 4, 0, 0]}
//                             label={{
//                                 position: 'top',
//                                 fill: '#5a5c69',
//                                 formatter: (value) => `${value}`
//                             }}
//                         />
//                     </BarChart>
//                 );
//         }
//     };

//     const handleDateChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({ ...prev, [name]: value }));
//     };

//     const resetDateRange = () => {
//         setFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
//     };

//     if (isLoading) return (
//         <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
//             <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//             </div>
//         </div>
//     );

//     if (!candidateList.length) return (
//         <div className="card shadow">
//             <div className="card-body text-center py-5">
//                 <i className="fas fa-folder-open fa-3x text-gray-300 mb-3"></i>
//                 <h5 className="text-gray-800">No candidate data available</h5>
//                 <p className="text-muted">There are currently no candidates to display</p>
//             </div>
//         </div>
//     );

//     return (
//         <div className="container-fluid px-4">
//             <div className="d-sm-flex align-items-center justify-content-between mb-4">
//                 <h1 className="h3 mb-0 text-gray-800">Candidate Analytics Dashboard</h1>
//                 <div>
//                     <CSVLink
//                         data={csvData}
//                         filename="candidate-export.csv"
//                         className="btn btn-sm btn-success shadow-sm me-2"
//                     >
//                         <i className="fas fa-file-csv me-1"></i> Export CSV
//                     </CSVLink>
//                     <button
//                         className="btn btn-sm btn-danger shadow-sm"
//                         onClick={exportPDF}
//                         disabled={!selectedCandidates.length}
//                         title={!selectedCandidates.length ? "Select candidates by clicking on chart elements" : ""}
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
//                                     <>Showing candidates from <strong>{filters.startDate || 'earliest'}</strong> to <strong>{filters.endDate || 'latest'}</strong></>
//                                 ) : 'Showing all dates'}
//                             </small>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="row">
//                 {chartConfigs.map(({ label, field, value, chartType, options }) => {
//                     const dataSubset = value ? filterBy(field, value, dateFilteredData) : dateFilteredData;
//                     const chartData = field === 'createdAt' ? generateTimeSeriesData(dataSubset) : generateChartData(field, dataSubset);
//                     const filteredCount = dataSubset.length;

//                     return (
//                         <div className="col-xl-6 mb-4" key={field}>
//                             <div className="card shadow h-100">
//                                 <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
//                                     <h6 className="m-0 font-weight-bold text-primary">{label}</h6>
//                                     <span className="badge bg-primary rounded-pill">{filteredCount} {filteredCount === 1 ? 'candidate' : 'candidates'}</span>
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

//             {selectedCandidates.length > 0 && (
//                 <div className="card shadow mb-4 mt-4">
//                     <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
//                         <h6 className="m-0 font-weight-bold text-primary">Selected Candidates ({selectedCandidates.length})</h6>
//                     </div>
//                     <div className="card-body">
//                         <div className="table-responsive">
//                             <table className="table table-bordered table-hover table-sm">
//                                 <thead className="bg-light">
//                                     <tr>
//                                         <th>Name</th>
//                                         <th>Gender</th>
//                                         <th>Skills</th>
//                                         <th>Verified</th>
//                                         <th>Created</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {selectedCandidates.slice(0, 5).map((candidate, index) => (
//                                         <tr key={index}>
//                                             <td>{candidate.fullname || 'N/A'}</td>
//                                             <td>{candidate.gender || 'N/A'}</td>
//                                             <td>{candidate.skills?.map(s => s.skills).join(', ') || 'N/A'}</td>
//                                             <td>
//                                                 {candidate.isVerified ? (
//                                                     <span className="badge bg-success">Yes</span>
//                                                 ) : (
//                                                     <span className="badge bg-secondary">No</span>
//                                                 )}
//                                             </td>
//                                             <td>{candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : 'N/A'}</td>
//                                         </tr>
//                                     ))}
//                                     {selectedCandidates.length > 5 && (
//                                         <tr>
//                                             <td colSpan="5" className="text-center text-muted">
//                                                 + {selectedCandidates.length - 5} more candidates
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

// export default SuperAdminCandidateStats;

















import { useEffect, useMemo, useRef, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Doughnut, Bar, Line, Pie, PolarArea } from "react-chartjs-2";
import {
    FiClock,
    FiFile,
    FiAlertTriangle,
    FiLoader,
    FiCheckCircle,
    FiTrendingUp,
    FiCalendar,
    FiFilter,
    FiRefreshCw,
    FiPieChart,
    FiBarChart,
    FiMapPin,
    FiShield,
    FiList,
    FiChevronDown,
} from "react-icons/fi";
import { BsPersonFill } from "react-icons/bs";
import { useSuperAdminContext } from '../../../context/superadmin-context';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

const THEME_PRIMARY = "#4f46e5";
const THEME_SECOND = "#7c3aed";

// small helper to make gradients used by chart callbacks
const getGradient = (ctx, chartArea, c1 = THEME_PRIMARY, c2 = THEME_SECOND) => {
    if (!chartArea) return c1;
    const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
    gradient.addColorStop(0, c1);
    gradient.addColorStop(1, c2);
    return gradient;
};

// -----------------------------
// Component
// -----------------------------
const SuperAdminCandidateStats = () => {
    const { isLoading, candidates, getAllCandidatesWithVerificationStatus } = useSuperAdminContext()

    useEffect(() => {
        getAllCandidatesWithVerificationStatus()
    }, [])

    const [filtered, setFiltered] = useState(candidates);
    const [timelineFiltered, setTimelineFiltered] = useState(candidates);
    const [selectedTimeline, setSelectedTimeline] = useState("monthly"); // daily, weekly, monthly, yearly
    const [showTimelineDropdown, setShowTimelineDropdown] = useState(false);
    const [genderFilter, setGenderFilter] = useState("all");
    const [skillFilter, setSkillFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("all");
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);

    // close dropdown on outside click
    useEffect(() => {
        const onDoc = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowTimelineDropdown(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    // unique filter options
    const uniqueGenders = useMemo(() => [...new Set(candidates.map((c) => c.gender).filter(Boolean))], [candidates]);
    const uniqueSkills = useMemo(() => {
        const s = new Set();
        candidates.forEach((c) => c.skills?.skills?.forEach((sk) => s.add(sk)));
        return [...s];
    }, [candidates]);
    const uniqueLocations = useMemo(() => [...new Set(candidates.map((c) => c.location).filter(Boolean))], [candidates]);

    // apply basic filters
    useEffect(() => {
        let tmp = [...candidates];
        if (genderFilter !== "all") tmp = tmp.filter((c) => c.gender === genderFilter);
        if (skillFilter !== "all") tmp = tmp.filter((c) => c.skills?.includes(skillFilter));
        if (locationFilter !== "all") tmp = tmp.filter((c) => c.location === locationFilter);
        setFiltered(tmp);
    }, [candidates, genderFilter, skillFilter, locationFilter]);

    // timeline filter (daily / weekly / monthly / yearly)
    useEffect(() => {
        const now = new Date();
        let tmp = [...filtered];
        if (selectedTimeline === "daily") {
            const s = new Date(now); s.setDate(now.getDate() - 7); s.setHours(0, 0, 0, 0);
            tmp = tmp.filter((c) => c.createdAt && new Date(c.createdAt) >= s);
        } else if (selectedTimeline === "weekly") {
            const s = new Date(now); s.setDate(now.getDate() - 28); s.setHours(0, 0, 0, 0);
            tmp = tmp.filter((c) => c.createdAt && new Date(c.createdAt) >= s);
        } else if (selectedTimeline === "monthly") {
            const s = new Date(now); s.setMonth(now.getMonth() - 6); s.setHours(0, 0, 0, 0);
            tmp = tmp.filter((c) => c.createdAt && new Date(c.createdAt) >= s);
        } else {
            const s = new Date(now); s.setFullYear(now.getFullYear() - 5); s.setHours(0, 0, 0, 0);
            tmp = tmp.filter((c) => c.createdAt && new Date(c.createdAt) >= s);
        }
        setTimelineFiltered(tmp);
    }, [filtered, selectedTimeline]);

    // exports
    const exportCSV = () => {
        if (!timelineFiltered.length) { setError("No data to export."); return; }
        const headers = ["Name", "Gender", "Skills", "Location", "Verified", "Created"];
        const rows = timelineFiltered.map(c => [
            c.fullname,
            c.gender,
            (c.skills || []).join("|"),
            c.location,
            c.isVerified ? "Yes" : "No",
            c.createdAt || ""
        ]);
        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `candidates_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
        URL.revokeObjectURL(url);
        setError(null);
    };

    const exportExcel = () => {
        if (!timelineFiltered.length) { setError("No data to export."); return; }
        let table = "<table><tr><th>Name</th><th>Gender</th><th>Skills</th><th>Location</th><th>Verified</th><th>Created</th></tr>";
        timelineFiltered.forEach(c => {
            table += `<tr><td>${c.fullname}</td><td>${c.gender}</td><td>${(c.skills || []).join(", ")}</td><td>${c.location}</td><td>${c.isVerified ? "Yes" : "No"}</td><td>${c.createdAt || ""}</td></tr>`;
        });
        table += "</table>";
        const blob = new Blob([table], { type: "application/vnd.ms-excel" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `candidates_${new Date().toISOString().slice(0, 10)}.xls`; a.click();
        URL.revokeObjectURL(url);
        setError(null);
    };

    // chart creators
    const getVerificationData = (ctx) => {
        if (!timelineFiltered.length) return { labels: ["No Data"], datasets: [{ data: [1], backgroundColor: ["#e5e7eb"] }] };
        const verified = timelineFiltered.filter(c => c.isVerified).length;
        const unverified = timelineFiltered.length - verified;
        return { labels: ["Verified", "Unverified"], datasets: [{ data: [verified, unverified], backgroundColor: [THEME_SECOND, "#ef4444"], hoverOffset: 6 }] };
    };

    const getGenderData = (ctx) => {
        if (!timelineFiltered.length) return { labels: ["No Data"], datasets: [{ data: [1], backgroundColor: ["#e5e7eb"] }] };
        const map = {};
        timelineFiltered.forEach(c => { map[c.gender] = (map[c.gender] || 0) + 1; });
        return { labels: Object.keys(map), datasets: [{ label: "Count", data: Object.values(map), backgroundColor: (ctx) => getGradient(ctx.chart.ctx, ctx.chart.chartArea, THEME_PRIMARY, THEME_SECOND) }] };
    };

    const getSkillData = () => {
        if (!timelineFiltered.length) return { labels: ["No Data"], datasets: [{ data: [1], backgroundColor: ["#e5e7eb"] }] };
        const map = {};
        timelineFiltered.forEach(c => (c.skills || []).forEach(sk => map[sk] = (map[sk] || 0) + 1));
        return { labels: Object.keys(map), datasets: [{ data: Object.values(map), backgroundColor: ["#f97316", "#4f46e5", "#10b981", "#06b6d4"], borderWidth: 0 }] };
    };

    const getLocationData = () => {
        if (!timelineFiltered.length) return { labels: ["No Data"], datasets: [{ data: [1], backgroundColor: ["#e5e7eb"] }] };
        const map = {};
        timelineFiltered.forEach(c => { map[c.location] = (map[c.location] || 0) + 1; });
        return { labels: Object.keys(map), datasets: [{ data: Object.values(map), backgroundColor: (ctx) => getGradient(ctx.chart.ctx, ctx.chart.chartArea, "#ff7eb6", THEME_PRIMARY) }] };
    };

    const getTimelineData = () => {
        if (!timelineFiltered.length) return { labels: ["No Data"], datasets: [{ label: "Registrations", data: [0] }] };
        const now = new Date();
        let labels = [], counts = [];
        if (selectedTimeline === "daily") {
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now); d.setDate(now.getDate() - i);
                const start = new Date(d); start.setHours(0, 0, 0, 0);
                const end = new Date(d); end.setHours(23, 59, 59, 999);
                labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
                counts.push(timelineFiltered.filter(c => c.createdAt && new Date(c.createdAt) >= start && new Date(c.createdAt) <= end).length);
            }
        } else if (selectedTimeline === "weekly") {
            for (let w = 3; w >= 0; w--) {
                const start = new Date(now); start.setDate(now.getDate() - (w * 7 + 6)); start.setHours(0, 0, 0, 0);
                const end = new Date(start); end.setDate(start.getDate() + 6); end.setHours(23, 59, 59, 999);
                labels.push(`W${4 - w}`);
                counts.push(timelineFiltered.filter(c => c.createdAt && new Date(c.createdAt) >= start && new Date(c.createdAt) <= end).length);
            }
        } else if (selectedTimeline === "monthly") {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            for (let m = 5; m >= 0; m--) {
                const d = new Date(now); d.setMonth(now.getMonth() - m);
                labels.push(months[d.getMonth()]);
                counts.push(timelineFiltered.filter(c => c.createdAt && new Date(c.createdAt).getMonth() === d.getMonth() && new Date(c.createdAt).getFullYear() === d.getFullYear()).length);
            }
        } else {
            for (let y = 4; y >= 0; y--) {
                const year = now.getFullYear() - y;
                labels.push(String(year));
                counts.push(timelineFiltered.filter(c => c.createdAt && new Date(c.createdAt).getFullYear() === year).length);
            }
        }
        return { labels, datasets: [{ label: "Registrations", data: counts, backgroundColor: (ctx) => getGradient(ctx.chart.ctx, ctx.chart.chartArea, THEME_PRIMARY, THEME_SECOND), borderColor: THEME_PRIMARY, fill: true, tension: 0.35 }] };
    };

    // chart common options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom", labels: { boxWidth: 12, padding: 12 } },
            tooltip: { mode: "index", intersect: false }
        },
        animation: { duration: 700, easing: "easeOutCubic" }
    };

    // small UI helpers
    const getTimelineLabel = () => {
        switch (selectedTimeline) {
            case "daily": return "Daily";
            case "weekly": return "Weekly";
            case "monthly": return "Monthly";
            case "yearly": return "Yearly";
            default: return "Monthly";
        }
    };

    return (
        <div className="container-fluid py-3">
            <style>{`
        .card-soft { background: #fff; border-radius: 12px; border: 1px solid #eef2ff; box-shadow: 0 6px 18px rgba(15,23,42,0.03); }
        .stat-card { padding: 0.85rem; border-radius:10px; background: #fff; border:1px solid #eef2ff; }
        .stat-icon { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#fff; }
        .timeline-indicator { position:absolute; right:12px; top:12px; background:${THEME_SECOND}; color:#fff; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px; box-shadow:0 6px 18px rgba(124,58,237,0.12); }
        .chart-card { padding: 1rem; border-radius:12px; background:linear-gradient(180deg, #ffffff, #fbfbff); border:1px solid #eef2ff; box-shadow:0 8px 24px rgba(79,70,229,0.04); }
        .filter-card { padding: 1rem; border-radius: 12px; background: #fff; border:1px solid #eef2ff; }
        .btn-grad { background: linear-gradient(90deg, ${THEME_PRIMARY}, ${THEME_SECOND}); color: #fff; border: none; }
        .btn-grad:hover { opacity: 0.95; }
        .small-muted { color: #6b7280; font-size: 0.8rem; }
        .company-list-item:hover { transform: translateX(4px); transition: all .18s ease; }
        @media (max-width: 768px) { .timeline-indicator { right:8px; top:8px; } }
      `}</style>

            {/* header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="mb-0">Candidate Dashboard</h4>
                    <small className="small-muted">Recruitment analytics & candidate insights</small>
                </div>

                <div className="d-flex gap-2 align-items-center">
                    <div ref={dropdownRef} className="position-relative">
                        <button className="btn btn-sm btn-grad d-flex align-items-center gap-2" onClick={() => setShowTimelineDropdown(s => !s)}>
                            <FiClock /> {getTimelineLabel()} <FiChevronDown />
                        </button>
                        {showTimelineDropdown && (
                            <div className="dropdown-menu p-2 show shadow-sm" style={{ right: 0, position: "absolute" }}>
                                <button className="dropdown-item" onClick={() => { setSelectedTimeline("daily"); setShowTimelineDropdown(false); }}>Daily</button>
                                <button className="dropdown-item" onClick={() => { setSelectedTimeline("weekly"); setShowTimelineDropdown(false); }}>Weekly</button>
                                <button className="dropdown-item" onClick={() => { setSelectedTimeline("monthly"); setShowTimelineDropdown(false); }}>Monthly</button>
                                <button className="dropdown-item" onClick={() => { setSelectedTimeline("yearly"); setShowTimelineDropdown(false); }}>Yearly</button>
                            </div>
                        )}
                    </div>

                    <button className="btn btn-sm btn-success" onClick={exportCSV}><FiFile /> CSV</button>
                    <button className="btn btn-sm btn-danger" onClick={exportExcel}><FiFile /> Excel</button>
                </div>
            </div>

            {error && <div className="alert alert-danger"><FiAlertTriangle /> {error}</div>}
            {isLoading && <div className="text-center py-3"><FiLoader /> Loading...</div>}

            {!isLoading && (
                <>
                    {/* stats */}
                    <div className="row g-3 mb-3">
                        <div className="col-6 col-md-3">
                            <div className="stat-card d-flex align-items-center gap-3">
                                <div className="stat-icon" style={{ background: getGradient(document.createElement('canvas').getContext('2d'), { bottom: 100 }, THEME_PRIMARY, THEME_SECOND) }}><BsPersonFill /></div>
                                <div>
                                    <div className="h5 mb-0">{timelineFiltered.length}</div>
                                    <small className="small-muted">TOTAL CANDIDATES</small>
                                </div>
                            </div>
                        </div>

                        <div className="col-6 col-md-3">
                            <div className="stat-card d-flex align-items-center gap-3">
                                <div className="stat-icon" style={{ background: "#10b981" }}><FiCheckCircle /></div>
                                <div>
                                    <div className="h5 mb-0">{timelineFiltered.filter(c => c.isVerified).length}</div>
                                    <small className="small-muted">VERIFIED</small>
                                </div>
                            </div>
                        </div>

                        <div className="col-6 col-md-3">
                            <div className="stat-card d-flex align-items-center gap-3">
                                <div className="stat-icon" style={{ background: "#06b6d4" }}><FiTrendingUp /></div>
                                <div>
                                    <div className="h5 mb-0">{timelineFiltered.length ? Math.round((timelineFiltered.filter(c => c.lastActive).length / timelineFiltered.length) * 100) : 0}%</div>
                                    <small className="small-muted">ACTIVE</small>
                                </div>
                            </div>
                        </div>

                        <div className="col-6 col-md-3">
                            <div className="stat-card d-flex align-items-center gap-3">
                                <div className="stat-icon" style={{ background: "#f59e0b" }}><FiCalendar /></div>
                                <div>
                                    <div className="h5 mb-0">
                                        {timelineFiltered.filter(c => {
                                            if (!c.createdAt) return false;
                                            const d = new Date(c.createdAt); const now = new Date();
                                            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                                        }).length}
                                    </div>
                                    <small className="small-muted">NEW THIS MONTH</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* filters */}
                    <div className="filter-card mb-3">
                        <div className="row g-3 align-items-end">
                            <div className="col-md-3">
                                <label className="form-label small">Gender</label>
                                <select className="form-select" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                                    <option value="all">All</option>
                                    {uniqueGenders.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label small">Skill</label>
                                <select className="form-select" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
                                    <option value="all">All</option>
                                    {uniqueSkills.map((s, i) => <option key={i} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label small">Location</label>
                                <select className="form-select" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                                    <option value="all">All</option>
                                    {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>

                            <div className="col-md-3 d-flex gap-2">
                                <button className="btn btn-outline-secondary w-100" onClick={() => { setGenderFilter("all"); setSkillFilter("all"); setLocationFilter("all"); }}>
                                    <FiRefreshCw /> Reset
                                </button>
                                <div className="d-flex align-items-center small-muted ps-2">Showing {timelineFiltered.length} of {filtered.length}</div>
                            </div>
                        </div>
                    </div>

                    {/* charts */}
                    <div className="row g-3">
                        <div className="col-lg-6">
                            <div className="chart-card position-relative">
                                <h6 className="mb-2"><FiPieChart /> Verification <span className="timeline-indicator">{timelineFiltered.length}</span></h6>
                                <div style={{ height: 220 }}>
                                    <Doughnut data={getVerificationData()} options={{ ...commonOptions, plugins: { legend: { position: "bottom" } } }} />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="chart-card position-relative">
                                <h6 className="mb-2"><FiBarChart /> Gender Distribution <span className="timeline-indicator">{timelineFiltered.length}</span></h6>
                                <div style={{ height: 220 }}>
                                    <Bar data={getGenderData()} options={{ ...commonOptions, plugins: { legend: { display: false } } }} />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="chart-card position-relative">
                                <h6 className="mb-2"><FiPieChart /> Top Skills <span className="timeline-indicator">{timelineFiltered.length}</span></h6>
                                <div style={{ height: 220 }}>
                                    <Pie data={getSkillData()} options={{ ...commonOptions, plugins: { legend: { position: "bottom" } } }} />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="chart-card position-relative">
                                <h6 className="mb-2"><FiMapPin /> Locations <span className="timeline-indicator">{timelineFiltered.length}</span></h6>
                                <div style={{ height: 220 }}>
                                    <Pie data={getLocationData()} options={{ ...commonOptions, plugins: { legend: { position: "bottom" } } }} />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="chart-card position-relative">
                                <h6 className="mb-2"><FiList /> Registrations Timeline <span className="timeline-indicator">{timelineFiltered.length}</span></h6>
                                <div style={{ height: 220 }}>
                                    <Line data={getTimelineData()} options={{ ...commonOptions, plugins: { legend: { display: false } } }} />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="chart-card position-relative">
                                <h6 className="mb-2"><FiShield /> Active vs Inactive <span className="timeline-indicator">{timelineFiltered.length}</span></h6>
                                <div style={{ height: 220 }}>
                                    <PolarArea data={{
                                        labels: ["Active", "Inactive"],
                                        datasets: [{ data: [timelineFiltered.filter(c => c.lastActive).length, timelineFiltered.length - timelineFiltered.filter(c => c.lastActive).length], backgroundColor: [THEME_SECOND, "#93c5fd"] }]
                                    }} options={{ ...commonOptions, plugins: { legend: { position: "bottom" } } }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* candidate list and details */}
                    <div className="row g-3 mt-3">

                        {/* LEFT SIDE – CANDIDATE LIST */}
                        <div className="col-lg-6">
                            <div
                                className="card-soft"
                                style={{
                                    borderRadius: 16,
                                    overflow: "hidden",
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
                                }}
                            >
                                <div className="p-3 border-bottom d-flex justify-content-between align-items-center"
                                    style={{ background: "linear-gradient(90deg,#f6f7ff,#fff)" }}>
                                    <h6 className="mb-0" style={{ fontWeight: 700 }}>
                                        <FiList /> Candidates ({timelineFiltered.length})
                                    </h6>
                                </div>

                                <div style={{ maxHeight: 420, overflowY: "auto", padding: 16 }}>
                                    {timelineFiltered.map(c => {
                                        const cleanDate = new Date(c.createdAt).toLocaleDateString();
                                        const skillList = c.skills?.map(s => s.skills) || [];

                                        return (
                                            <div
                                                key={c._id}
                                                className="candidate-card d-flex align-items-center justify-content-between mb-3 p-3"
                                                style={{
                                                    borderRadius: 14,
                                                    background: "#ffffffcc",
                                                    backdropFilter: "blur(6px)",
                                                    border: "1px solid #e8ecff",
                                                    transition: "0.25s",
                                                    cursor: "pointer"
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.transform = "translateY(-3px)";
                                                    e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.10)";
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.transform = "translateY(0px)";
                                                    e.currentTarget.style.boxShadow = "none";
                                                }}
                                            >
                                                {/* LEFT CONTENT */}
                                                <div className="d-flex align-items-center gap-3">

                                                    {/* PROFILE PICTURE */}
                                                    <div style={{ position: "relative" }}>
                                                        {c.profilePicture ? (
                                                            <img
                                                                src={c.profilePicture}
                                                                alt="profile"
                                                                style={{
                                                                    width: 52,
                                                                    height: 52,
                                                                    borderRadius: 12,
                                                                    objectFit: "cover",
                                                                    border: "2px solid #d5d9ff",
                                                                    transition: "0.25s"
                                                                }}
                                                                className="candidate-img"
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.transform = "scale(1.06)";
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.transform = "scale(1)";
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    width: 52,
                                                                    height: 52,
                                                                    borderRadius: 12,
                                                                    background:
                                                                        "linear-gradient(135deg,#6a11cb,#2575fc)",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    color: "#fff",
                                                                    fontWeight: 700,
                                                                    transition: "0.25s"
                                                                }}
                                                            >
                                                                {(c.fullname || "?").charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* NAME + DETAILS */}
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: 16 }}>
                                                            {c.fullname}
                                                        </div>

                                                        <div className="small-muted">{c.location}</div>

                                                        {/* SKILLS */}
                                                        <div className="mt-1 d-flex flex-wrap gap-1">
                                                            {skillList.slice(0, 3).map((sk, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="badge"
                                                                    style={{
                                                                        background: "linear-gradient(90deg,#eef2ff,#f3f5ff)",
                                                                        color: "#4150ff",
                                                                        padding: "4px 10px",
                                                                        fontSize: 11,
                                                                        borderRadius: 5,
                                                                        border: "1px solid #dfe4ff"
                                                                    }}
                                                                >
                                                                    {sk}
                                                                </span>
                                                            ))}

                                                            {skillList.length > 3 && (
                                                                <span
                                                                    className="badge bg-light text-muted"
                                                                    style={{
                                                                        padding: "4px 7px",
                                                                        fontSize: 10,
                                                                        borderRadius: 5
                                                                    }}
                                                                >
                                                                    +{skillList.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* RIGHT SIDE */}
                                                <div className="text-end">
                                                    <span
                                                        className={c.isVerified ? "badge bg-success" : "badge bg-secondary"}
                                                        style={{ padding: "6px 10px", borderRadius: 6, fontSize: 11 }}
                                                    >
                                                        {c.isVerified ? "Verified" : "Unverified"}
                                                    </span>

                                                    <div className="small-muted mt-1">{cleanDate}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE – INSIGHTS */}
                        <div className="col-lg-6">
                            <div
                                className="card-soft p-4"
                                style={{
                                    borderRadius: 16,
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                                    background: "linear-gradient(180deg,#ffffff,#f9faff)"
                                }}
                            >
                                <h5 style={{ fontWeight: 700 }}><FiFile /> Candidate Insights</h5>
                                <p className="small-muted" style={{ marginTop: -4 }}>
                                    Visual overview based on applied filters.
                                </p>

                                <div className="row g-4 mt-2">
                                    {/* AVG SKILLS */}
                                    <div className="col-6">
                                        <div className="small-muted">Avg. Skills</div>
                                        <div style={{ fontWeight: 800, fontSize: 26 }}>
                                            {(
                                                timelineFiltered.reduce(
                                                    (s, c) => s + (c.skills?.length || 0),
                                                    0
                                                ) / (timelineFiltered.length || 1)
                                            ).toFixed(1)}
                                        </div>
                                    </div>

                                    {/* VERIFIED RATIO */}
                                    <div className="col-6">
                                        <div className="small-muted">Verified Ratio</div>
                                        <div style={{ fontWeight: 800, fontSize: 26 }}>
                                            {timelineFiltered.length
                                                ? `${Math.round(
                                                    (timelineFiltered.filter(c => c.isVerified).length /
                                                        timelineFiltered.length) *
                                                    100
                                                )}%`
                                                : "0%"}
                                        </div>
                                    </div>
                                </div>

                                <hr />

                                {/* ACTIONS */}
                                <div className="d-flex justify-content-between">
                                    <small className="small-muted">Exports / Actions</small>

                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-grad px-3" onClick={exportCSV}>
                                            <FiFile /> CSV
                                        </button>

                                        <button
                                            className="btn btn-sm btn-outline-secondary px-3"
                                            onClick={() => {
                                                setGenderFilter("all");
                                                setSkillFilter("all");
                                                setLocationFilter("all");
                                            }}
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}

export default SuperAdminCandidateStats;