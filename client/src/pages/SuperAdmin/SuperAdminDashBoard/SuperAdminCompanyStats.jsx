// import { useEffect, useMemo, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { CSVLink } from 'react-csv';
// import { useSuperAdminContext } from '../../../context/superadmin-context';

// // Enhanced color palette with gradients
// const COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'];
// const GRADIENTS = {
//     primary: ['#4e73df', '#224abe'],
//     success: ['#1cc88a', '#13855c'],
//     info: ['#36b9cc', '#258391'],
//     warning: ['#f6c23e', '#dda20a'],
//     danger: ['#e74a3b', '#be2617'],
//     secondary: ['#858796', '#60616f'],
//     dark: ['#5a5c69', '#373840']
// };

// const SuperAdminCompanyStats = () => {
//     const { isLoading, companies: companyList, getAllCompaniesWithVerificationStatus } = useSuperAdminContext();

//     useEffect(() => {
//         getAllCompaniesWithVerificationStatus();
//     }, []);

//     const [filters, setFilters] = useState({
//         isVerified: '',
//         industry: '',
//         companySize: '',
//         location: '',
//         startDate: '',
//         endDate: ''
//     });
//     const [selectedCompanies, setSelectedCompanies] = useState([]);
//     const [hoveredChart, setHoveredChart] = useState(null);

//     const uniqueIndustries = useMemo(() => [...new Set(companyList.map(company => company.industry || '').filter(Boolean))], [companyList]);
//     const uniqueCompanySizes = useMemo(() => [...new Set(companyList.map(company => company.companySize || '').filter(Boolean))], [companyList]);
//     const uniqueLocations = useMemo(() => {
//         const locationSet = new Set();
//         companyList.forEach(company => {
//             if (company.locations && Array.isArray(company.locations)) {
//                 company.locations.forEach(loc => {
//                     if (loc.city && loc.country) {
//                         locationSet.add(`${loc.city}, ${loc.country}`);
//                     }
//                 });
//             }
//         });
//         return [...locationSet];
//     }, [companyList]);

//     const dateFilteredData = useMemo(() => {
//         return companyList.filter(company => {
//             const companyDate = new Date(company.createdAt);
//             if (isNaN(companyDate.getTime())) return false;
//             const startDate = filters.startDate ? new Date(filters.startDate) : null;
//             const endDate = filters.endDate ? new Date(filters.endDate) : null;
//             if (startDate && isNaN(startDate.getTime())) return false;
//             if (endDate && isNaN(endDate.getTime())) return false;
//             if (startDate && endDate) return companyDate >= startDate && companyDate <= endDate;
//             if (startDate) return companyDate >= startDate;
//             if (endDate) return companyDate <= endDate;
//             return true;
//         });
//     }, [filters.startDate, filters.endDate, companyList]);

//     const filterBy = (field, value, data) => {
//         if (!value) return data;
//         return data.filter(company => {
//             if (field === 'isVerified') return company.isVerified?.toString() === value;
//             if (field === 'industry') return company.industry === value;
//             if (field === 'companySize') return company.companySize === value;
//             if (field === 'location') {
//                 return company.locations?.some(loc =>
//                     `${loc.city}, ${loc.country}` === value
//                 );
//             }
//             return true;
//         });
//     };

//     const generateChartData = (field, data) => {
//         const count = {};
//         data.forEach(company => {
//             if (field === 'location') {
//                 company.locations?.forEach(loc => {
//                     const key = `${loc.city}, ${loc.country}`;
//                     count[key] = (count[key] || 0) + 1;
//                 });
//             } else {
//                 const key = company[field];
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
//         data.forEach(company => {
//             if (!company.createdAt) return;
//             const date = new Date(company.createdAt);
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
//             icon: 'fa-check-circle',
//             gradient: GRADIENTS.success,
//             options: [
//                 { value: '', label: 'All' },
//                 { value: 'true', label: 'Verified' },
//                 { value: 'false', label: 'Not Verified' }
//             ]
//         },
//         {
//             label: 'Industries',
//             field: 'industry',
//             value: filters.industry,
//             chartType: 'bar',
//             icon: 'fa-industry',
//             gradient: GRADIENTS.primary,
//             options: [{ value: '', label: 'All Industries' }, ...uniqueIndustries.map(ind => ({ value: ind, label: ind }))]
//         },
//         {
//             label: 'Company Sizes',
//             field: 'companySize',
//             value: filters.companySize,
//             chartType: 'pie',
//             icon: 'fa-users',
//             gradient: GRADIENTS.info,
//             options: [{ value: '', label: 'All Sizes' }, ...uniqueCompanySizes.map(size => ({ value: size, label: size }))]
//         },
//         {
//             label: 'Locations',
//             field: 'location',
//             value: filters.location,
//             chartType: 'radar',
//             icon: 'fa-map-marker-alt',
//             gradient: GRADIENTS.warning,
//             options: [{ value: '', label: 'All Locations' }, ...uniqueLocations.map(loc => ({ value: loc, label: loc }))]
//         },
//         {
//             label: 'Company Registrations Over Time',
//             field: 'createdAt',
//             value: '',
//             chartType: 'area',
//             icon: 'fa-chart-line',
//             gradient: GRADIENTS.primary,
//             options: []
//         }
//     ];

//     const exportPDF = () => {
//         if (!selectedCompanies.length) return;
//         const doc = new jsPDF();
//         doc.text('Company List Report', 14, 16);
//         autoTable(doc, {
//             head: [['Name', 'Industry', 'Size', 'Verified', 'Created']],
//             body: selectedCompanies.map(company => [
//                 company.fullname || 'N/A',
//                 company.industry || 'N/A',
//                 company.companySize || 'N/A',
//                 company.isVerified ? 'Yes' : 'No',
//                 company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'
//             ])
//         });
//         doc.save('company-report.pdf');
//     };

//     const csvData = selectedCompanies.map(company => ({
//         Name: company.fullname || '',
//         Industry: company.industry || '',
//         Size: company.companySize || '',
//         Verified: company.isVerified ? 'Yes' : 'No',
//         Created: company.createdAt ? new Date(company.createdAt).toLocaleDateString() : ''
//     }));

//     const renderChart = (chartData, chartType, field, gradient) => {
//         if (!chartData.length) {
//             return (
//                 <div className="d-flex justify-content-center align-items-center h-100">
//                     <div className="text-center">
//                         <i className="fas fa-chart-pie fa-3x text-gray-200 mb-3"></i>
//                         <p className="text-muted">No data available</p>
//                     </div>
//                 </div>
//             );
//         }

//         switch (chartType) {
//             case 'pie':
//                 return (
//                     <PieChart>
//                         <defs>
//                             <linearGradient id={`colorGradient-${field}`} x1="0" y1="0" x2="0" y2="1">
//                                 <stop offset="5%" stopColor={gradient[0]} stopOpacity={0.8} />
//                                 <stop offset="95%" stopColor={gradient[1]} stopOpacity={0.8} />
//                             </linearGradient>
//                         </defs>
//                         <Pie
//                             data={chartData}
//                             cx="50%"
//                             cy="50%"
//                             innerRadius={40}
//                             outerRadius={80}
//                             fill="url(#colorGradient)"
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
//                                     setSelectedCompanies(filterBy(field, chartData[index].name, dateFilteredData));
//                                 }
//                             }}
//                         >
//                             {chartData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
//                             ))}
//                         </Pie>
//                         <Tooltip
//                             formatter={(value, name, props) => [`${value} (${props.payload.percent}%)`, name]}
//                             contentStyle={{
//                                 borderRadius: '0.5rem',
//                                 border: 'none',
//                                 boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)',
//                                 backgroundColor: '#fff',
//                                 padding: '0.75rem'
//                             }}
//                         />
//                         <Legend
//                             layout="vertical"
//                             verticalAlign="middle"
//                             align="right"
//                             wrapperStyle={{
//                                 paddingLeft: '20px'
//                             }}
//                         />
//                     </PieChart>
//                 );
//             case 'radar':
//                 return (
//                     <RadarChart outerRadius="80%" width={400} height={300} data={chartData}>
//                         <defs>
//                             <linearGradient id={`radarGradient-${field}`} x1="0" y1="0" x2="0" y2="1">
//                                 <stop offset="5%" stopColor={gradient[0]} stopOpacity={0.8} />
//                                 <stop offset="95%" stopColor={gradient[1]} stopOpacity={0.2} />
//                             </linearGradient>
//                         </defs>
//                         <PolarGrid stroke="#e3e6f0" />
//                         <PolarAngleAxis dataKey="name" tick={{ fill: '#5a5c69', fontSize: 12 }} />
//                         <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={{ fill: '#5a5c69' }} />
//                         <Radar
//                             name="Locations"
//                             dataKey="count"
//                             stroke={gradient[0]}
//                             fill="url(#radarGradient)"
//                             fillOpacity={0.6}
//                             onClick={(data) => {
//                                 if (data?.activeLabel) {
//                                     setSelectedCompanies(filterBy(field, data.activeLabel, dateFilteredData));
//                                 }
//                             }}
//                         />
//                         <Tooltip
//                             formatter={(value) => [`${value}`]}
//                             contentStyle={{
//                                 borderRadius: '0.5rem',
//                                 border: 'none',
//                                 boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)',
//                                 backgroundColor: '#fff',
//                                 padding: '0.75rem'
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
//                                 <stop offset="5%" stopColor={gradient[0]} stopOpacity={0.8} />
//                                 <stop offset="95%" stopColor={gradient[1]} stopOpacity={0.1} />
//                             </linearGradient>
//                         </defs>
//                         <XAxis
//                             dataKey="date"
//                             tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                             tick={{ fill: '#5a5c69' }}
//                         />
//                         <YAxis tick={{ fill: '#5a5c69' }} />
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fc" />
//                         <Tooltip
//                             labelFormatter={(date) => `Date: ${new Date(date).toLocaleDateString()}`}
//                             formatter={(value) => [`${value} registrations`]}
//                             contentStyle={{
//                                 borderRadius: '0.5rem',
//                                 border: 'none',
//                                 boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)',
//                                 backgroundColor: '#fff',
//                                 padding: '0.75rem'
//                             }}
//                         />
//                         <Area
//                             type="monotone"
//                             dataKey="count"
//                             stroke={gradient[0]}
//                             fillOpacity={1}
//                             fill="url(#colorCount)"
//                             activeDot={{ r: 8, fill: gradient[0] }}
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
//                                 setSelectedCompanies(filterBy(field, data.activeLabel, dateFilteredData));
//                             }
//                         }}
//                     >
//                         <defs>
//                             <linearGradient id={`barGradient-${field}`} x1="0" y1="0" x2="0" y2="1">
//                                 <stop offset="5%" stopColor={gradient[0]} stopOpacity={0.8} />
//                                 <stop offset="95%" stopColor={gradient[1]} stopOpacity={0.8} />
//                             </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fc" vertical={false} />
//                         <XAxis
//                             dataKey="name"
//                             tick={{ fill: '#5a5c69' }}
//                             axisLine={false}
//                         />
//                         <YAxis
//                             tick={{ fill: '#5a5c69' }}
//                             axisLine={false}
//                         />
//                         <Tooltip
//                             formatter={(value) => [`${value} (${chartData.find(item => item.count === value)?.percent || '0'}%)`]}
//                             contentStyle={{
//                                 borderRadius: '0.5rem',
//                                 border: 'none',
//                                 boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)',
//                                 backgroundColor: '#fff',
//                                 padding: '0.75rem'
//                             }}
//                         />
//                         <Bar
//                             dataKey="count"
//                             fill="url(#barGradient)"
//                             radius={[4, 4, 0, 0]}
//                             label={{
//                                 position: 'top',
//                                 fill: '#5a5c69',
//                                 fontSize: 12,
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
//             <div className="text-center">
//                 <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="text-muted">Loading company analytics...</p>
//             </div>
//         </div>
//     );

//     if (!companyList.length) return (
//         <div className="card shadow border-0">
//             <div className="card-body text-center py-5">
//                 <i className="fas fa-folder-open fa-4x text-gray-200 mb-4"></i>
//                 <h5 className="text-gray-700 mb-2">No company data available</h5>
//                 <p className="text-muted">There are currently no companies to display</p>
//                 <button
//                     className="btn btn-primary mt-3"
//                     onClick={getAllCompaniesWithVerificationStatus}
//                 >
//                     <i className="fas fa-sync-alt me-2"></i> Refresh Data
//                 </button>
//             </div>
//         </div>
//     );

//     return (
//         <div className="container-fluid px-4">
//             <div className="d-sm-flex align-items-center justify-content-between mb-4">
//                 <h1 className="h3 mb-0 text-gray-800">
//                     <i className="fas fa-chart-bar text-primary me-2"></i>
//                     Company Analytics Dashboard
//                 </h1>
//                 <div className="d-flex">
//                     <CSVLink
//                         data={csvData}
//                         filename="company-export.csv"
//                         className="btn btn-sm btn-success shadow-sm me-2 d-flex align-items-center"
//                     >
//                         <i className="fas fa-file-csv me-1"></i> Export CSV
//                     </CSVLink>
//                     <button
//                         className="btn btn-sm btn-danger shadow-sm d-flex align-items-center"
//                         onClick={exportPDF}
//                         disabled={!selectedCompanies.length}
//                         title={!selectedCompanies.length ? "Select companies by clicking on chart elements" : ""}
//                     >
//                         <i className="fas fa-file-pdf me-1"></i> Export PDF
//                     </button>
//                 </div>
//             </div>

//             {/* Date Range Filter Card */}
//             <div className="card shadow mb-4 border-0">
//                 <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-primary text-white">
//                     <h6 className="m-0 font-weight-bold">
//                         <i className="fas fa-calendar-alt me-2"></i>Date Range Filter
//                     </h6>
//                 </div>
//                 <div className="card-body">
//                     <div className="row g-3 align-items-end">
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">From Date</label>
//                             <div className="input-group">
//                                 <span className="input-group-text bg-light">
//                                     <i className="fas fa-calendar text-gray-500"></i>
//                                 </span>
//                                 <input
//                                     type="date"
//                                     className="form-control form-control-sm"
//                                     name="startDate"
//                                     value={filters.startDate}
//                                     onChange={handleDateChange}
//                                 />
//                             </div>
//                         </div>
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">To Date</label>
//                             <div className="input-group">
//                                 <span className="input-group-text bg-light">
//                                     <i className="fas fa-calendar text-gray-500"></i>
//                                 </span>
//                                 <input
//                                     type="date"
//                                     className="form-control form-control-sm"
//                                     name="endDate"
//                                     value={filters.endDate}
//                                     onChange={handleDateChange}
//                                 />
//                             </div>
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
//                                     <>Showing companies from <strong>{filters.startDate || 'earliest'}</strong> to <strong>{filters.endDate || 'latest'}</strong></>
//                                 ) : 'Showing all dates'}
//                             </small>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Charts Grid */}
//             <div className="row">
//                 {chartConfigs.map(({ label, field, value, chartType, options, icon, gradient }) => {
//                     const dataSubset = value ? filterBy(field, value, dateFilteredData) : dateFilteredData;
//                     const chartData = field === 'createdAt' ? generateTimeSeriesData(dataSubset) : generateChartData(field, dataSubset);
//                     const filteredCount = dataSubset.length;

//                     return (
//                         <div className="col-xl-6 mb-4" key={field}>
//                             <div
//                                 className="card shadow h-100 border-0"
//                                 onMouseEnter={() => setHoveredChart(field)}
//                                 onMouseLeave={() => setHoveredChart(null)}
//                                 style={{
//                                     transition: 'all 0.3s ease',
//                                     transform: hoveredChart === field ? 'translateY(-5px)' : 'none',
//                                     boxShadow: hoveredChart === field ? '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' : '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)'
//                                 }}
//                             >
//                                 <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white border-0">
//                                     <h6 className="m-0 font-weight-bold text-primary">
//                                         <i className={`fas ${icon} me-2`}></i>
//                                         {label}
//                                     </h6>
//                                     <span className="badge bg-primary rounded-pill px-3 py-1">
//                                         {filteredCount} {filteredCount === 1 ? 'company' : 'companies'}
//                                     </span>
//                                 </div>
//                                 <div className="card-body">
//                                     <div className="row flex-column">
//                                         <div className="">
//                                             {options.length > 0 && (
//                                                 <>
//                                                     <label className="form-label small text-gray-600 fw-bold mb-2">Filter by {label.toLowerCase()}</label>
//                                                     <div className='d-flex w-100'>
//                                                         <select
//                                                             className="form-select form-select-sm mb-3"
//                                                             value={value}
//                                                             onChange={e => setFilters({ ...filters, [field]: e.target.value })}
//                                                         >
//                                                             {options.map(option => (
//                                                                 <option key={option.value} value={option.value}>{option.label}</option>
//                                                             ))}
//                                                         </select>
//                                                         {value && (
//                                                             <button
//                                                                 className="btn btn-sm btn-outline-secondary mb-3 ms-2"
//                                                                 onClick={() => setFilters({ ...filters, [field]: '' })}
//                                                             >
//                                                                 <i className="fas fa-times"></i>
//                                                             </button>
//                                                         )}
//                                                     </div>
//                                                 </>
//                                             )}
//                                         </div>
//                                         <div className="col-md-12">
//                                             <div style={{ height: '300px' }}>
//                                                 <ResponsiveContainer width="100%" height="100%">
//                                                     {renderChart(chartData, chartType, field, gradient)}
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

//             {/* Selected Companies Table */}
//             {selectedCompanies.length > 0 && (
//                 <div className="card shadow mb-4 mt-4 border-0">
//                     <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white border-0">
//                         <h6 className="m-0 font-weight-bold text-primary">
//                             <i className="fas fa-building me-2"></i>
//                             Selected Companies ({selectedCompanies.length})
//                         </h6>
//                         <button
//                             className="btn btn-sm btn-outline-secondary"
//                             onClick={() => setSelectedCompanies([])}
//                         >
//                             <i className="fas fa-times me-1"></i> Clear Selection
//                         </button>
//                     </div>
//                     <div className="card-body">
//                         <div className="table-responsive">
//                             <table className="table table-hover table-sm">
//                                 <thead className="bg-light">
//                                     <tr>
//                                         <th>Name</th>
//                                         <th>Industry</th>
//                                         <th>Size</th>
//                                         <th>Verified</th>
//                                         <th>Created</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {selectedCompanies.slice(0, 5).map((company, index) => (
//                                         <tr key={index}>
//                                             <td className="fw-bold">{company.fullname || 'N/A'}</td>
//                                             <td>{company.industry || 'N/A'}</td>
//                                             <td>{company.companySize || 'N/A'}</td>
//                                             <td>
//                                                 {company.isVerified ? (
//                                                     <span className="badge bg-success">Verified</span>
//                                                 ) : (
//                                                     <span className="badge bg-secondary">Not Verified</span>
//                                                 )}
//                                             </td>
//                                             <td>{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}</td>
//                                         </tr>
//                                     ))}
//                                     {selectedCompanies.length > 5 && (
//                                         <tr>
//                                             <td colSpan="5" className="text-center text-muted">
//                                                 + {selectedCompanies.length - 5} more companies
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

// export default SuperAdminCompanyStats;










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
    FiGitBranch,
    FiMapPin,
    FiShield,
    FiList,
    FiLinkedin,
    FiTwitter,
    FiFacebook,
    FiChevronDown,
} from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
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

// ---------- gradient helper ----------
const getGradient = (ctx, chartArea, color1, color2) => {
    if (!chartArea) return color1;
    const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
};

// ---------- Component ----------
const SuperAdminCompanyStats = () => {

    const { isLoading, companieswithprofile, getAllCompaniesWithProfileAndVerificationStatus } = useSuperAdminContext();

    useEffect(() => {
        getAllCompaniesWithProfileAndVerificationStatus();
    }, []);

    const [filteredData, setFilteredData] = useState(companieswithprofile);
    const [timelineFilteredData, setTimelineFilteredData] =
        useState(companieswithprofile);
    const [selectedCompany, setSelectedCompany] = useState(
        companieswithprofile[0] || null
    );
    const [selectedTimeline, setSelectedTimeline] = useState("monthly"); // daily, weekly, monthly, yearly
    const [showTimelineDropdown, setShowTimelineDropdown] = useState(false);
    const [companySizeFilter, setCompanySizeFilter] = useState("all");
    const [industryFilter, setIndustryFilter] = useState("all");
    const [verificationFilter, setVerificationFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("all");
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);


    // close dropdown when clicking outside
    useEffect(() => {
        const onDoc = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowTimelineDropdown(false);
            }
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    // ---------- unique filter lists ----------
    const getUniqueCompanySizes = useMemo(
        () => [...new Set(companieswithprofile.map((c) => c.companySize).filter(Boolean))],
        [companieswithprofile]
    );
    const getUniqueIndustries = useMemo(
        () => [...new Set(companieswithprofile.map((c) => c.industry).filter(Boolean))],
        [companieswithprofile]
    );
    const getUniqueLocations = useMemo(() => {
        const s = new Set();
        companieswithprofile.forEach((c) =>
            c.locations?.forEach((l) => l.city && s.add(l.city))
        );
        return [...s];
    }, [companieswithprofile]);

    // ---------- apply filters ----------
    useEffect(() => {
        let temp = [...companieswithprofile];
        if (companySizeFilter !== "all")
            temp = temp.filter((c) => c.companySize === companySizeFilter);
        if (industryFilter !== "all")
            temp = temp.filter((c) => c.industry === industryFilter);
        if (verificationFilter !== "all") {
            const isV = verificationFilter === "verified";
            temp = temp.filter((c) => c.isVerified === isV);
        }
        if (locationFilter !== "all")
            temp = temp.filter((c) =>
                c.locations?.some((l) => l.city === locationFilter)
            );
        setFilteredData(temp);
    }, [
        companieswithprofile,
        companySizeFilter,
        industryFilter,
        verificationFilter,
        locationFilter,
    ]);

    // ---------- timeline filtering ----------
    useEffect(() => {
        const now = new Date();
        let temp = [...filteredData];

        if (selectedTimeline === "daily") {
            const sevenAgo = new Date(now);
            sevenAgo.setDate(now.getDate() - 7);
            temp = temp.filter(
                (c) => c.createdAt && new Date(c.createdAt) >= sevenAgo
            );
        } else if (selectedTimeline === "weekly") {
            const fourWeeks = new Date(now);
            fourWeeks.setDate(now.getDate() - 28);
            temp = temp.filter(
                (c) => c.createdAt && new Date(c.createdAt) >= fourWeeks
            );
        } else if (selectedTimeline === "monthly") {
            const sixMonths = new Date(now);
            sixMonths.setMonth(now.getMonth() - 6);
            temp = temp.filter(
                (c) => c.createdAt && new Date(c.createdAt) >= sixMonths
            );
        } else if (selectedTimeline === "yearly") {
            const fiveYears = new Date(now);
            fiveYears.setFullYear(now.getFullYear() - 5);
            temp = temp.filter(
                (c) => c.createdAt && new Date(c.createdAt) >= fiveYears
            );
        }

        setTimelineFilteredData(temp);
        if (temp.length > 0 && !temp.find((t) => t._id === selectedCompany?._id)) {
            setSelectedCompany(temp[0] || null);
        }
    }, [filteredData, selectedTimeline, selectedCompany]);

    // ---------- exports ----------
    const exportToCSV = () => {
        if (!timelineFilteredData || timelineFilteredData.length === 0) {
            setError("No data available to export.");
            return;
        }
        try {
            const headers = [
                "Company Name",
                "Industry",
                "Company Size",
                "Location",
                "Email",
                "Phone",
                "Website",
                "CEO",
                "Founder",
                "Verification Status",
                "Created Date",
            ];
            const rows = timelineFilteredData.map((co) => [
                co.fullname || "N/A",
                co.industry || "N/A",
                co.companySize || "N/A",
                co.locations?.[0]
                    ? `${co.locations[0].city}, ${co.locations[0].country}`
                    : "N/A",
                co.email || "N/A",
                co.contactPhone || "N/A",
                co.website || "N/A",
                co.ceo?.ceoName || "N/A",
                co.founder?.founderName || "N/A",
                co.isVerified ? "Verified" : "Not Verified",
                co.createdAt ? new Date(co.createdAt).toLocaleDateString() : "N/A",
            ]);
            const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
                "\n"
            );
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `company_export_${new Date()
                .toISOString()
                .slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            setError(null);
        } catch (err) {
            setError("Failed to export CSV.");
        }
    };

    const exportToExcel = () => {
        if (!timelineFilteredData || timelineFilteredData.length === 0) {
            setError("No data available to export.");
            return;
        }
        try {
            let table = `<table><tr>
        <th>Company Name</th><th>Industry</th><th>Size</th><th>Location</th>
        <th>Email</th><th>Phone</th><th>Website</th><th>Verified</th><th>Created</th>
      </tr>`;
            timelineFilteredData.forEach((co) => {
                table += `<tr>
          <td>${co.fullname || ""}</td>
          <td>${co.industry || ""}</td>
          <td>${co.companySize || ""}</td>
          <td>${co.locations?.[0]
                        ? `${co.locations[0].city}, ${co.locations[0].country}`
                        : ""
                    }</td>
          <td>${co.email || ""}</td>
          <td>${co.contactPhone || ""}</td>
          <td>${co.website || ""}</td>
          <td>${co.isVerified ? "Verified" : "Not Verified"}</td>
          <td>${co.createdAt ? new Date(co.createdAt).toLocaleDateString() : ""
                    }</td>
        </tr>`;
            });
            table += "</table>";
            const blob = new Blob([table], { type: "application/vnd.ms-excel" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `company_export_${new Date()
                .toISOString()
                .slice(0, 10)}.xls`;
            a.click();
            URL.revokeObjectURL(url);
            setError(null);
        } catch (err) {
            setError("Failed to export Excel.");
        }
    };

    // ---------- chart data generators ----------
    const getCompanySizeData = () => {
        if (!timelineFilteredData || timelineFilteredData.length === 0) {
            return {
                labels: ["No Data"],
                datasets: [{ data: [1], backgroundColor: ["#e5e7eb"] }],
            };
        }
        const map = {};
        timelineFilteredData.forEach((c) => {
            if (c.companySize) map[c.companySize] = (map[c.companySize] || 0) + 1;
        });
        const labels = Object.keys(map);
        const data = Object.values(map);
        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: ["#f97316", "#4f46e5", "#10b981", "#06b6d4"],
                    borderWidth: 0,
                    hoverOffset: 6,
                },
            ],
        };
    };

    const getIndustryData = (ctx) => {
        if (!timelineFilteredData || timelineFilteredData.length === 0) {
            return {
                labels: ["No Data"],
                datasets: [{ data: [1], backgroundColor: ["#e5e7eb"] }],
            };
        }
        const map = {};
        timelineFilteredData.forEach((c) => {
            if (c.industry) map[c.industry] = (map[c.industry] || 0) + 1;
        });
        return {
            labels: Object.keys(map),
            datasets: [
                {
                    label: "Companies",
                    data: Object.values(map),
                    backgroundColor: (context) =>
                        getGradient(
                            context.chart.ctx,
                            context.chart.chartArea,
                            "#4f46e5",
                            "#7c3aed"
                        ),
                    borderColor: "#4f46e5",
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                },
            ],
        };
    };

    const getDepartmentData = () => {
        if (!timelineFilteredData || timelineFilteredData.length === 0)
            return { labels: ["No Data"], datasets: [{ data: [1] }] };
        const map = {};
        timelineFilteredData.forEach((c) =>
            c.departments?.forEach((d) => {
                if (d?.value) map[d.value] = (map[d.value] || 0) + 1;
            })
        );
        return {
            labels: Object.keys(map),
            datasets: [
                {
                    label: "Departments",
                    data: Object.values(map),
                    backgroundColor: ["#fb7185", "#60a5fa", "#34d399"],
                },
            ],
        };
    };

    const getTimelineData = () => {
        if (!timelineFilteredData || timelineFilteredData.length === 0)
            return { labels: ["No Data"], datasets: [{ data: [0] }] };
        const now = new Date();
        const labels = [];
        const counts = [];
        if (selectedTimeline === "daily") {
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                labels.push(
                    d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                );
                const start = new Date(d);
                start.setHours(0, 0, 0, 0);
                const end = new Date(d);
                end.setHours(23, 59, 59, 999);
                counts.push(
                    timelineFilteredData.filter(
                        (c) =>
                            c.createdAt &&
                            new Date(c.createdAt) >= start &&
                            new Date(c.createdAt) <= end
                    ).length
                );
            }
        } else if (selectedTimeline === "weekly") {
            for (let i = 3; i >= 0; i--) {
                const start = new Date(now);
                start.setDate(now.getDate() - (i * 7 + 6));
                start.setHours(0, 0, 0, 0);
                const end = new Date(start);
                end.setDate(start.getDate() + 6);
                end.setHours(23, 59, 59, 999);
                labels.push(`W${4 - i}`);
                counts.push(
                    timelineFilteredData.filter(
                        (c) =>
                            c.createdAt &&
                            new Date(c.createdAt) >= start &&
                            new Date(c.createdAt) <= end
                    ).length
                );
            }
        } else if (selectedTimeline === "monthly") {
            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now);
                d.setMonth(now.getMonth() - i);
                labels.push(months[d.getMonth()]);
                counts.push(
                    timelineFilteredData.filter(
                        (c) =>
                            c.createdAt &&
                            new Date(c.createdAt).getMonth() === d.getMonth() &&
                            new Date(c.createdAt).getFullYear() === d.getFullYear()
                    ).length
                );
            }
        } else {
            for (let i = 4; i >= 0; i--) {
                const y = now.getFullYear() - i;
                labels.push(String(y));
                counts.push(
                    timelineFilteredData.filter(
                        (c) => c.createdAt && new Date(c.createdAt).getFullYear() === y
                    ).length
                );
            }
        }

        return {
            labels,
            datasets: [
                {
                    label: "New Companies",
                    data: counts,
                    fill: true,
                    backgroundColor: (ctx) =>
                        getGradient(
                            ctx.chart.ctx,
                            ctx.chart.chartArea,
                            "#4f46e5",
                            "#7c3aed"
                        ),
                    borderColor: "#4f46e5",
                    tension: 0.35,
                },
            ],
        };
    };

    const getLocationData = () => {
        if (!timelineFilteredData || timelineFilteredData.length === 0)
            return { labels: ["No Data"], datasets: [{ data: [1] }] };
        const map = {};
        timelineFilteredData.forEach((c) =>
            c.locations?.forEach((l) => {
                if (l.city) map[l.city] = (map[l.city] || 0) + 1;
            })
        );
        return {
            labels: Object.keys(map),
            datasets: [
                {
                    data: Object.values(map),
                    backgroundColor: ["#ff7eb6", "#7ef4ff", "#ffcf7e"],
                    borderColor: "#fff",
                    borderWidth: 3,
                },
            ],
        };
    };

    const getVerificationData = () => {
        if (!timelineFilteredData || timelineFilteredData.length === 0)
            return { labels: ["No Data"], datasets: [{ data: [1] }] };
        const verified = timelineFilteredData.filter((c) => c.isVerified).length;
        const unverified = timelineFilteredData.length - verified;
        return {
            labels: ["Verified", "Unverified"],
            datasets: [
                {
                    data: [verified, unverified],
                    backgroundColor: ["#10b981", "#ef4444"],
                    borderWidth: 1,
                },
            ],
        };
    };

    // ---------- helpers ----------
    const getTimelineLabel = () => {
        switch (selectedTimeline) {
            case "daily":
                return "Daily";
            case "weekly":
                return "Weekly";
            case "monthly":
                return "Monthly";
            case "yearly":
                return "Yearly";
            default:
                return "Monthly";
        }
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { mode: "index", intersect: false },
        },
        animation: { duration: 750, easing: "easeOutCubic" },
    };

    // ---------- render ----------
    return (
        <div className="container-fluid py-3">
            {/* small inline CSS to keep component self-contained */}
            <style>{`
        .chart-card { background: #fff; border-radius: 10px; padding: 1rem; border:1px solid #e6e9ef; box-shadow: 0 6px 18px rgba(20,20,40,0.04); }
        .stat-card { background:#fff; border-radius:8px; padding: 0.75rem; border:1px solid #e6e9ef; box-shadow: 0 6px 18px rgba(20,20,40,0.03); }
        .timeline-indicator { position:absolute; right:12px; top:10px; background:#ef4444; color:#fff; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px; box-shadow: 0 4px 10px rgba(239,68,68,0.2); }
        .timeline-dropdown { position: relative; display:inline-block; }
        /* CENTERED dropdown under the button (Option B) */
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
      `}</style>

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="mb-0">Company Dashboard</h4>
                    <small className="small-muted">
                        Overview of companies & analytics
                    </small>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <div className="timeline-dropdown me-2" ref={dropdownRef}>
                        {/* Centered button */}
                        <button
                            className="btn btn-sm btn-gradient d-flex align-items-center gap-2"
                            onClick={() => setShowTimelineDropdown((s) => !s)}
                            aria-expanded={showTimelineDropdown}
                        >
                            <FiClock /> <span>{getTimelineLabel()}</span> <FiChevronDown />
                        </button>

                        {/* --- Centered dropdown menu --- */}
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

                    <button className="btn btn-sm btn-success" onClick={exportToCSV}>
                        <FiFile /> Export CSV
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={exportToExcel}>
                        <FiFile /> Export PDF
                    </button>
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
                                    <BsBuilding />
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
                                        {timelineFilteredData.filter((c) => c.isVerified).length}
                                    </div>
                                    <small className="text-muted">VERIFIED</small>
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
                                        {timelineFilteredData.length > 0
                                            ? Math.round(
                                                (timelineFilteredData.filter((c) => c.lastActive)
                                                    .length /
                                                    timelineFilteredData.length) *
                                                100
                                            )
                                            : 0}
                                        %
                                    </div>
                                    <small className="text-muted">ACTIVE</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-card d-flex gap-3 align-items-center">
                                <div className="stat-icon bg-warning text-white rounded p-2">
                                    <FiCalendar />
                                </div>
                                <div>
                                    <div className="h5 mb-0">
                                        {
                                            timelineFilteredData.filter((c) => {
                                                if (!c.createdAt) return false;
                                                const d = new Date(c.createdAt);
                                                const now = new Date();
                                                return (
                                                    d.getMonth() === now.getMonth() &&
                                                    d.getFullYear() === now.getFullYear()
                                                );
                                            }).length
                                        }
                                    </div>
                                    <small className="text-muted">NEW</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="card mb-3 p-3">
                        <div className="row g-3 align-items-end">
                            <div className="col-md-3">
                                <label className="form-label small">Company Size</label>
                                <select
                                    className="form-select"
                                    value={companySizeFilter}
                                    onChange={(e) => setCompanySizeFilter(e.target.value)}
                                >
                                    <option value="all">All Sizes</option>
                                    {getUniqueCompanySizes.map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Industry</label>
                                <select
                                    className="form-select"
                                    value={industryFilter}
                                    onChange={(e) => setIndustryFilter(e.target.value)}
                                >
                                    <option value="all">All Industries</option>
                                    {getUniqueIndustries.map((ind) => (
                                        <option key={ind} value={ind}>
                                            {ind}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Verification</label>
                                <select
                                    className="form-select"
                                    value={verificationFilter}
                                    onChange={(e) => setVerificationFilter(e.target.value)}
                                >
                                    <option value="all">All Companies</option>
                                    <option value="verified">Verified</option>
                                    <option value="unverified">Not Verified</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Location</label>
                                <select
                                    className="form-select"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                >
                                    <option value="all">All Locations</option>
                                    {getUniqueLocations.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => {
                                    setCompanySizeFilter("all");
                                    setIndustryFilter("all");
                                    setVerificationFilter("all");
                                    setLocationFilter("all");
                                }}
                            >
                                <FiRefreshCw /> Reset
                            </button>
                            <small className="text-muted">
                                {timelineFilteredData.length} of {filteredData.length} companies
                                in {getTimelineLabel().toLowerCase()} view
                            </small>
                        </div>
                    </div>

                    {/* Charts: 2 columns responsive */}
                    <div className="row">
                        <div className="col-lg-6 mb-3">
                            <div className="chart-card position-relative">
                                <h6 className="mb-2">
                                    <FiPieChart /> Company Size{" "}
                                    <span className="timeline-indicator">
                                        {timelineFilteredData.length}
                                    </span>
                                </h6>
                                <div style={{ height: 220 }}>
                                    <Doughnut
                                        data={getCompanySizeData()}
                                        options={{
                                            ...commonOptions,
                                            plugins: {
                                                legend: { display: true, position: "bottom" },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                            <div className="chart-card position-relative">
                                <h6 className="mb-2">
                                    <FiBarChart /> Industry{" "}
                                    <span className="timeline-indicator">
                                        {timelineFilteredData.length}
                                    </span>
                                </h6>
                                <div style={{ height: 220 }}>
                                    <Bar
                                        data={getIndustryData()}
                                        options={{
                                            ...commonOptions,
                                            plugins: { legend: { display: false } },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                            <div className="chart-card position-relative">
                                <h6 className="mb-2">
                                    <FiGitBranch /> Departments{" "}
                                    <span className="timeline-indicator">
                                        {timelineFilteredData.length}
                                    </span>
                                </h6>
                                <div style={{ height: 220 }}>
                                    <Bar
                                        data={getDepartmentData()}
                                        options={{
                                            indexAxis: "y",
                                            ...commonOptions,
                                            plugins: { legend: { display: false } },
                                        }}
                                    />
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
                                    <Line
                                        data={getTimelineData()}
                                        options={{
                                            ...commonOptions,
                                            plugins: { legend: { display: false } },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                            <div className="chart-card position-relative">
                                <h6 className="mb-2">
                                    <FiMapPin /> Locations{" "}
                                    <span className="timeline-indicator">
                                        {timelineFilteredData.length}
                                    </span>
                                </h6>
                                <div style={{ height: 220 }}>
                                    <Pie
                                        data={getLocationData()}
                                        options={{
                                            ...commonOptions,
                                            plugins: {
                                                legend: { display: true, position: "bottom" },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                            <div className="chart-card position-relative">
                                <h6 className="mb-2">
                                    <FiShield /> Verification{" "}
                                    <span className="timeline-indicator">
                                        {timelineFilteredData.length}
                                    </span>
                                </h6>
                                <div style={{ height: 220 }}>
                                    <PolarArea
                                        data={getVerificationData()}
                                        options={{
                                            ...commonOptions,
                                            plugins: {
                                                legend: { display: true, position: "bottom" },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company list + details */}
                    <div className="row">
                        <div className="col-lg-6 mb-3">
                            <div className="chart-card">
                                <h6 className="mb-3">
                                    <FiList /> Companies ({timelineFilteredData.length})
                                </h6>
                                <div style={{ maxHeight: 340, overflowY: "auto" }}>
                                    {timelineFilteredData.map((co) => (
                                        <div
                                            key={co._id}
                                            className={`d-flex align-items-center gap-3 p-2 mb-2 ${selectedCompany && selectedCompany._id === co._id
                                                ? "border rounded bg-primary text-white"
                                                : "border rounded bg-light"
                                                }`}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setSelectedCompany(co)}
                                        >
                                            <img
                                                src={
                                                    co.profilePicture || "https://via.placeholder.com/60"
                                                }
                                                alt={co.fullname}
                                                style={{
                                                    width: 52,
                                                    height: 52,
                                                    borderRadius: 8,
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <div className="flex-grow-1">
                                                <div style={{ fontWeight: 700 }}>{co.fullname}</div>
                                                <div className="text-muted small">
                                                    {co.industry} • {co.companySize}
                                                </div>
                                            </div>
                                            <div>
                                                {co.isVerified ? (
                                                    <span className="badge bg-success">Verified</span>
                                                ) : (
                                                    <span className="badge bg-secondary">Unverified</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                            <div className="chart-card company-details">
                                {selectedCompany ? (
                                    <>
                                        <div className="d-flex gap-3 align-items-center mb-3">
                                            <img
                                                src={
                                                    selectedCompany.profilePicture ||
                                                    "https://via.placeholder.com/80"
                                                }
                                                alt="logo"
                                                style={{
                                                    width: 72,
                                                    height: 72,
                                                    borderRadius: 12,
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <div>
                                                <h5 className="mb-0">{selectedCompany.fullname}</h5>
                                                <small className="text-muted">
                                                    {selectedCompany.industry}
                                                </small>
                                                <div className="mt-2">
                                                    {selectedCompany.isVerified && (
                                                        <span className="badge bg-success me-2">
                                                            Verified
                                                        </span>
                                                    )}
                                                    <small className="text-muted">
                                                        {selectedCompany.companySize}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>

                                        <h6 className="mb-2">Basic Information</h6>
                                        <table className="table table-borderless small mb-3">
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: "35%" }}>Website</td>
                                                    <td>
                                                        {selectedCompany.website ? (
                                                            <a
                                                                href={selectedCompany.website}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                            >
                                                                {selectedCompany.website}
                                                            </a>
                                                        ) : (
                                                            "Not specified"
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Email</td>
                                                    <td>{selectedCompany.email || "Not specified"}</td>
                                                </tr>
                                                <tr>
                                                    <td>Phone</td>
                                                    <td>
                                                        {selectedCompany.contactPhone || "Not specified"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Created</td>
                                                    <td>
                                                        {selectedCompany.createdAt
                                                            ? new Date(
                                                                selectedCompany.createdAt
                                                            ).toLocaleDateString()
                                                            : "N/A"}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <h6 className="mb-2">Leadership</h6>
                                        <table className="table table-borderless small mb-3">
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: "35%" }}>CEO</td>
                                                    <td>
                                                        {selectedCompany.ceo?.ceoName || "Not specified"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Founder</td>
                                                    <td>
                                                        {selectedCompany.founder?.founderName ||
                                                            "Not specified"}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <h6 className="mb-2">About</h6>
                                        <p className="small text-muted">
                                            {selectedCompany.about || "No description available"}
                                        </p>

                                        {selectedCompany.departments &&
                                            selectedCompany.departments.length > 0 && (
                                                <>
                                                    <h6 className="mb-2">Departments</h6>
                                                    <div className="mb-2">
                                                        {selectedCompany.departments.map((d, i) => (
                                                            <span key={i} className="badge bg-info me-2">
                                                                {d.value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </>
                                            )}

                                        {selectedCompany.locations &&
                                            selectedCompany.locations.length > 0 && (
                                                <>
                                                    <h6 className="mb-2">Locations</h6>
                                                    <div>
                                                        {selectedCompany.locations.map((l, i) => (
                                                            <span key={i} className="badge bg-secondary me-2">
                                                                {l.city}, {l.country}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </>
                                            )}

                                        {selectedCompany.socialMedia && (
                                            <>
                                                <h6 className="mb-2 mt-3">Social</h6>
                                                <div className="d-flex gap-2">
                                                    {selectedCompany.socialMedia?.linkedin && (
                                                        <a href={selectedCompany.socialMedia.linkedin}>
                                                            <FiLinkedin />
                                                        </a>
                                                    )}
                                                    {selectedCompany.socialMedia?.twitter && (
                                                        <a href={selectedCompany.socialMedia.twitter}>
                                                            <FiTwitter />
                                                        </a>
                                                    )}
                                                    {selectedCompany.socialMedia?.facebook && (
                                                        <a href={selectedCompany.socialMedia.facebook}>
                                                            <FiFacebook />
                                                        </a>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <BsBuilding size={40} className="text-muted" />
                                        <h6 className="mt-2">Select a Company</h6>
                                        <p className="text-muted small">
                                            Choose a company from the list to view details
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default SuperAdminCompanyStats;