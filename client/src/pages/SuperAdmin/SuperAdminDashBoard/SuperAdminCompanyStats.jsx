import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import { useSuperAdminContext } from '../../../context/superadmin-context';

// Enhanced color palette with gradients
const COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'];
const GRADIENTS = {
    primary: ['#4e73df', '#224abe'],
    success: ['#1cc88a', '#13855c'],
    info: ['#36b9cc', '#258391'],
    warning: ['#f6c23e', '#dda20a'],
    danger: ['#e74a3b', '#be2617'],
    secondary: ['#858796', '#60616f'],
    dark: ['#5a5c69', '#373840']
};

const SuperAdminCompanyStats = () => {
    const { isLoading, companies: companyList, getAllCompaniesWithVerificationStatus } = useSuperAdminContext();

    useEffect(() => {
        getAllCompaniesWithVerificationStatus();
    }, []);

    const [filters, setFilters] = useState({
        isVerified: '',
        industry: '',
        companySize: '',
        location: '',
        startDate: '',
        endDate: ''
    });
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [hoveredChart, setHoveredChart] = useState(null);

    const uniqueIndustries = useMemo(() => [...new Set(companyList.map(company => company.industry || '').filter(Boolean))], [companyList]);
    const uniqueCompanySizes = useMemo(() => [...new Set(companyList.map(company => company.companySize || '').filter(Boolean))], [companyList]);
    const uniqueLocations = useMemo(() => {
        const locationSet = new Set();
        companyList.forEach(company => {
            if (company.locations && Array.isArray(company.locations)) {
                company.locations.forEach(loc => {
                    if (loc.city && loc.country) {
                        locationSet.add(`${loc.city}, ${loc.country}`);
                    }
                });
            }
        });
        return [...locationSet];
    }, [companyList]);

    const dateFilteredData = useMemo(() => {
        return companyList.filter(company => {
            const companyDate = new Date(company.createdAt);
            if (isNaN(companyDate.getTime())) return false;
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;
            if (startDate && isNaN(startDate.getTime())) return false;
            if (endDate && isNaN(endDate.getTime())) return false;
            if (startDate && endDate) return companyDate >= startDate && companyDate <= endDate;
            if (startDate) return companyDate >= startDate;
            if (endDate) return companyDate <= endDate;
            return true;
        });
    }, [filters.startDate, filters.endDate, companyList]);

    const filterBy = (field, value, data) => {
        if (!value) return data;
        return data.filter(company => {
            if (field === 'isVerified') return company.isVerified?.toString() === value;
            if (field === 'industry') return company.industry === value;
            if (field === 'companySize') return company.companySize === value;
            if (field === 'location') {
                return company.locations?.some(loc =>
                    `${loc.city}, ${loc.country}` === value
                );
            }
            return true;
        });
    };

    const generateChartData = (field, data) => {
        const count = {};
        data.forEach(company => {
            if (field === 'location') {
                company.locations?.forEach(loc => {
                    const key = `${loc.city}, ${loc.country}`;
                    count[key] = (count[key] || 0) + 1;
                });
            } else {
                const key = company[field];
                count[key] = (count[key] || 0) + 1;
            }
        });
        const total = Object.values(count).reduce((sum, val) => sum + val, 0);
        return Object.entries(count).map(([key, value]) => ({
            name: key,
            count: value,
            percent: total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
        }));
    };

    const generateTimeSeriesData = (data) => {
        const dateCounts = {};
        data.forEach(company => {
            if (!company.createdAt) return;
            const date = new Date(company.createdAt);
            if (isNaN(date.getTime())) return;
            const dateStr = date.toISOString().split('T')[0];
            dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        });
        return Object.entries(dateCounts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const chartConfigs = [
        {
            label: 'Verification Status',
            field: 'isVerified',
            value: filters.isVerified,
            chartType: 'pie',
            icon: 'fa-check-circle',
            gradient: GRADIENTS.success,
            options: [
                { value: '', label: 'All' },
                { value: 'true', label: 'Verified' },
                { value: 'false', label: 'Not Verified' }
            ]
        },
        {
            label: 'Industries',
            field: 'industry',
            value: filters.industry,
            chartType: 'bar',
            icon: 'fa-industry',
            gradient: GRADIENTS.primary,
            options: [{ value: '', label: 'All Industries' }, ...uniqueIndustries.map(ind => ({ value: ind, label: ind }))]
        },
        {
            label: 'Company Sizes',
            field: 'companySize',
            value: filters.companySize,
            chartType: 'pie',
            icon: 'fa-users',
            gradient: GRADIENTS.info,
            options: [{ value: '', label: 'All Sizes' }, ...uniqueCompanySizes.map(size => ({ value: size, label: size }))]
        },
        {
            label: 'Locations',
            field: 'location',
            value: filters.location,
            chartType: 'radar',
            icon: 'fa-map-marker-alt',
            gradient: GRADIENTS.warning,
            options: [{ value: '', label: 'All Locations' }, ...uniqueLocations.map(loc => ({ value: loc, label: loc }))]
        },
        {
            label: 'Company Registrations Over Time',
            field: 'createdAt',
            value: '',
            chartType: 'area',
            icon: 'fa-chart-line',
            gradient: GRADIENTS.primary,
            options: []
        }
    ];

    const exportPDF = () => {
        if (!selectedCompanies.length) return;
        const doc = new jsPDF();
        doc.text('Company List Report', 14, 16);
        autoTable(doc, {
            head: [['Name', 'Industry', 'Size', 'Verified', 'Created']],
            body: selectedCompanies.map(company => [
                company.fullname || 'N/A',
                company.industry || 'N/A',
                company.companySize || 'N/A',
                company.isVerified ? 'Yes' : 'No',
                company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'
            ])
        });
        doc.save('company-report.pdf');
    };

    const csvData = selectedCompanies.map(company => ({
        Name: company.fullname || '',
        Industry: company.industry || '',
        Size: company.companySize || '',
        Verified: company.isVerified ? 'Yes' : 'No',
        Created: company.createdAt ? new Date(company.createdAt).toLocaleDateString() : ''
    }));

    const renderChart = (chartData, chartType, field, gradient) => {
        if (!chartData.length) {
            return (
                <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="text-center">
                        <i className="fas fa-chart-pie fa-3x text-gray-200 mb-3"></i>
                        <p className="text-muted">No data available</p>
                    </div>
                </div>
            );
        }

        switch (chartType) {
            case 'pie':
                return (
                    <PieChart>
                        <defs>
                            <linearGradient id={`colorGradient-${field}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={gradient[0]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={gradient[1]} stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            fill="url(#colorGradient)"
                            dataKey="count"
                            nameKey="name"
                            label={({ name, percent }) => {
                                const num = parseFloat(percent);
                                const isValid = !isNaN(num);
                                const formatted = isValid
                                    ? (num <= 1 ? (num * 100).toFixed(2) : num.toFixed(2))
                                    : '0';
                                return `${name}: ${formatted}%`;
                            }}
                            onClick={(_, index) => {
                                if (chartData[index]) {
                                    setSelectedCompanies(filterBy(field, chartData[index].name, dateFilteredData));
                                }
                            }}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name, props) => [`${value} (${props.payload.percent}%)`, name]}
                            contentStyle={{
                                borderRadius: '0.5rem',
                                border: 'none',
                                boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)',
                                backgroundColor: '#fff',
                                padding: '0.75rem'
                            }}
                        />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            wrapperStyle={{
                                paddingLeft: '20px'
                            }}
                        />
                    </PieChart>
                );
            case 'radar':
                return (
                    <RadarChart outerRadius="80%" width={400} height={300} data={chartData}>
                        <defs>
                            <linearGradient id={`radarGradient-${field}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={gradient[0]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={gradient[1]} stopOpacity={0.2} />
                            </linearGradient>
                        </defs>
                        <PolarGrid stroke="#e3e6f0" />
                        <PolarAngleAxis dataKey="name" tick={{ fill: '#5a5c69', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={{ fill: '#5a5c69' }} />
                        <Radar
                            name="Locations"
                            dataKey="count"
                            stroke={gradient[0]}
                            fill="url(#radarGradient)"
                            fillOpacity={0.6}
                            onClick={(data) => {
                                if (data?.activeLabel) {
                                    setSelectedCompanies(filterBy(field, data.activeLabel, dateFilteredData));
                                }
                            }}
                        />
                        <Tooltip
                            formatter={(value) => [`${value}`]}
                            contentStyle={{
                                borderRadius: '0.5rem',
                                border: 'none',
                                boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)',
                                backgroundColor: '#fff',
                                padding: '0.75rem'
                            }}
                        />
                        <Legend />
                    </RadarChart>
                );
            case 'area':
                const timeSeriesData = generateTimeSeriesData(dateFilteredData);
                return (
                    <AreaChart
                        data={timeSeriesData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={gradient[0]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={gradient[1]} stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            tick={{ fill: '#5a5c69' }}
                        />
                        <YAxis tick={{ fill: '#5a5c69' }} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fc" />
                        <Tooltip
                            labelFormatter={(date) => `Date: ${new Date(date).toLocaleDateString()}`}
                            formatter={(value) => [`${value} registrations`]}
                            contentStyle={{
                                borderRadius: '0.5rem',
                                border: 'none',
                                boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)',
                                backgroundColor: '#fff',
                                padding: '0.75rem'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke={gradient[0]}
                            fillOpacity={1}
                            fill="url(#colorCount)"
                            activeDot={{ r: 8, fill: gradient[0] }}
                        />
                    </AreaChart>
                );
            case 'bar':
            default:
                return (
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        onClick={data => {
                            if (data?.activeLabel) {
                                setSelectedCompanies(filterBy(field, data.activeLabel, dateFilteredData));
                            }
                        }}
                    >
                        <defs>
                            <linearGradient id={`barGradient-${field}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={gradient[0]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={gradient[1]} stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fc" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#5a5c69' }}
                            axisLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#5a5c69' }}
                            axisLine={false}
                        />
                        <Tooltip
                            formatter={(value) => [`${value} (${chartData.find(item => item.count === value)?.percent || '0'}%)`]}
                            contentStyle={{
                                borderRadius: '0.5rem',
                                border: 'none',
                                boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)',
                                backgroundColor: '#fff',
                                padding: '0.75rem'
                            }}
                        />
                        <Bar
                            dataKey="count"
                            fill="url(#barGradient)"
                            radius={[4, 4, 0, 0]}
                            label={{
                                position: 'top',
                                fill: '#5a5c69',
                                fontSize: 12,
                                formatter: (value) => `${value}`
                            }}
                        />
                    </BarChart>
                );
        }
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const resetDateRange = () => {
        setFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
    };

    if (isLoading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted">Loading company analytics...</p>
            </div>
        </div>
    );

    if (!companyList.length) return (
        <div className="card shadow border-0">
            <div className="card-body text-center py-5">
                <i className="fas fa-folder-open fa-4x text-gray-200 mb-4"></i>
                <h5 className="text-gray-700 mb-2">No company data available</h5>
                <p className="text-muted">There are currently no companies to display</p>
                <button
                    className="btn btn-primary mt-3"
                    onClick={getAllCompaniesWithVerificationStatus}
                >
                    <i className="fas fa-sync-alt me-2"></i> Refresh Data
                </button>
            </div>
        </div>
    );

    return (
        <div className="container-fluid px-4">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">
                    <i className="fas fa-chart-bar text-primary me-2"></i>
                    Company Analytics Dashboard
                </h1>
                <div className="d-flex">
                    <CSVLink
                        data={csvData}
                        filename="company-export.csv"
                        className="btn btn-sm btn-success shadow-sm me-2 d-flex align-items-center"
                    >
                        <i className="fas fa-file-csv me-1"></i> Export CSV
                    </CSVLink>
                    <button
                        className="btn btn-sm btn-danger shadow-sm d-flex align-items-center"
                        onClick={exportPDF}
                        disabled={!selectedCompanies.length}
                        title={!selectedCompanies.length ? "Select companies by clicking on chart elements" : ""}
                    >
                        <i className="fas fa-file-pdf me-1"></i> Export PDF
                    </button>
                </div>
            </div>

            {/* Date Range Filter Card */}
            <div className="card shadow mb-4 border-0">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-primary text-white">
                    <h6 className="m-0 font-weight-bold">
                        <i className="fas fa-calendar-alt me-2"></i>Date Range Filter
                    </h6>
                </div>
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label small text-gray-600 fw-bold">From Date</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="fas fa-calendar text-gray-500"></i>
                                </span>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleDateChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small text-gray-600 fw-bold">To Date</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="fas fa-calendar text-gray-500"></i>
                                </span>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleDateChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <button
                                className="btn btn-sm btn-outline-secondary w-100"
                                onClick={resetDateRange}
                                disabled={!filters.startDate && !filters.endDate}
                            >
                                <i className="fas fa-undo me-1"></i> Reset
                            </button>
                        </div>
                        <div className="col-md-4 text-end">
                            <small className="text-gray-600">
                                {filters.startDate || filters.endDate ? (
                                    <>Showing companies from <strong>{filters.startDate || 'earliest'}</strong> to <strong>{filters.endDate || 'latest'}</strong></>
                                ) : 'Showing all dates'}
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="row">
                {chartConfigs.map(({ label, field, value, chartType, options, icon, gradient }) => {
                    const dataSubset = value ? filterBy(field, value, dateFilteredData) : dateFilteredData;
                    const chartData = field === 'createdAt' ? generateTimeSeriesData(dataSubset) : generateChartData(field, dataSubset);
                    const filteredCount = dataSubset.length;

                    return (
                        <div className="col-xl-6 mb-4" key={field}>
                            <div
                                className="card shadow h-100 border-0"
                                onMouseEnter={() => setHoveredChart(field)}
                                onMouseLeave={() => setHoveredChart(null)}
                                style={{
                                    transition: 'all 0.3s ease',
                                    transform: hoveredChart === field ? 'translateY(-5px)' : 'none',
                                    boxShadow: hoveredChart === field ? '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' : '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)'
                                }}
                            >
                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white border-0">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        <i className={`fas ${icon} me-2`}></i>
                                        {label}
                                    </h6>
                                    <span className="badge bg-primary rounded-pill px-3 py-1">
                                        {filteredCount} {filteredCount === 1 ? 'company' : 'companies'}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <div className="row flex-column">
                                        <div className="">
                                            {options.length > 0 && (
                                                <>
                                                    <label className="form-label small text-gray-600 fw-bold mb-2">Filter by {label.toLowerCase()}</label>
                                                    <div className='d-flex w-100'>
                                                        <select
                                                            className="form-select form-select-sm mb-3"
                                                            value={value}
                                                            onChange={e => setFilters({ ...filters, [field]: e.target.value })}
                                                        >
                                                            {options.map(option => (
                                                                <option key={option.value} value={option.value}>{option.label}</option>
                                                            ))}
                                                        </select>
                                                        {value && (
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary mb-3 ms-2"
                                                                onClick={() => setFilters({ ...filters, [field]: '' })}
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="col-md-12">
                                            <div style={{ height: '300px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    {renderChart(chartData, chartType, field, gradient)}
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Selected Companies Table */}
            {selectedCompanies.length > 0 && (
                <div className="card shadow mb-4 mt-4 border-0">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white border-0">
                        <h6 className="m-0 font-weight-bold text-primary">
                            <i className="fas fa-building me-2"></i>
                            Selected Companies ({selectedCompanies.length})
                        </h6>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setSelectedCompanies([])}
                        >
                            <i className="fas fa-times me-1"></i> Clear Selection
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover table-sm">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Name</th>
                                        <th>Industry</th>
                                        <th>Size</th>
                                        <th>Verified</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedCompanies.slice(0, 5).map((company, index) => (
                                        <tr key={index}>
                                            <td className="fw-bold">{company.fullname || 'N/A'}</td>
                                            <td>{company.industry || 'N/A'}</td>
                                            <td>{company.companySize || 'N/A'}</td>
                                            <td>
                                                {company.isVerified ? (
                                                    <span className="badge bg-success">Verified</span>
                                                ) : (
                                                    <span className="badge bg-secondary">Not Verified</span>
                                                )}
                                            </td>
                                            <td>{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        </tr>
                                    ))}
                                    {selectedCompanies.length > 5 && (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted">
                                                + {selectedCompanies.length - 5} more companies
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminCompanyStats;





// import { useState, useEffect, useRef } from 'react';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     ArcElement,
//     PointElement,
//     LineElement,
//     RadialLinearScale,
//     Title,
//     Tooltip,
//     Legend,
//     Filler
// } from 'chart.js';
// import { Doughnut, Bar, Line, Pie, PolarArea } from 'react-chartjs-2';
// import { useSuperAdminContext } from '../../../context/superadmin-context';
// import {
//     FiClock,
//     FiFile,
//     FiAlertTriangle,
//     FiLoader,
//     FiCheckCircle,
//     FiTrendingUp,
//     FiCalendar,
//     FiFilter,
//     FiRefreshCw,
//     FiPieChart,
//     FiBarChart,
//     FiGitBranch,
//     FiMapPin,
//     FiShield,
//     FiList,
//     FiLinkedin,
//     FiTwitter,
//     FiFacebook,
//     FiChevronDown
// } from 'react-icons/fi';
// import { BsBuilding } from "react-icons/bs";

// // Register Chart.js components
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     ArcElement,
//     PointElement,
//     LineElement,
//     RadialLinearScale,
//     Title,
//     Tooltip,
//     Legend,
//     Filler
// );

// const SuperAdminCompanyStats = () => {
//     const [selectedTimeline, setSelectedTimeline] = useState('monthly');
//     const [showTimelineDropdown, setShowTimelineDropdown] = useState(false);
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [companyData, setCompanyData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [timelineFilteredData, setTimelineFilteredData] = useState([]);
//     const [error, setError] = useState(null);
//     const [isMobile, setIsMobile] = useState(false);
//     const [showMobileFilters, setShowMobileFilters] = useState(false);
//     const dropdownRef = useRef(null);

//     const { isLoading, companies: companyList, getAllCompaniesWithVerificationStatus } = useSuperAdminContext();    

//     useEffect(() => {
//         try {
//             getAllCompaniesWithVerificationStatus();
//         } catch (err) {
//             console.error("Error fetching companies:", err);
//             setError("Failed to load company data. Please try again later.");
//         }
//     }, []);

//     useEffect(() => {
//         if (companyList && Array.isArray(companyList)) {
//             setCompanyData(companyList);
//             setFilteredData(companyList);
//             if (companyList.length > 0) {
//                 setSelectedCompany(companyList[0]);
//             }
//             setError(null);
//         } else if (!isLoading) {
//             setError("No company data available.");
//         }
//     }, [companyList, isLoading]);

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 768);
//         };

//         handleResize();
//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setShowTimelineDropdown(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     // Filter states
//     const [companySizeFilter, setCompanySizeFilter] = useState('all');
//     const [industryFilter, setIndustryFilter] = useState('all');
//     const [verificationFilter, setVerificationFilter] = useState('all');
//     const [locationFilter, setLocationFilter] = useState('all');

//     // Apply filters when filter values change
//     useEffect(() => {
//         if (!companyData || !Array.isArray(companyData)) return;

//         let filtered = [...companyData];

//         // Apply company size filter
//         if (companySizeFilter !== 'all') {
//             filtered = filtered.filter(company => company?.companySize === companySizeFilter);
//         }

//         // Apply industry filter
//         if (industryFilter !== 'all') {
//             filtered = filtered.filter(company => company?.industry === industryFilter);
//         }

//         // Apply verification filter
//         if (verificationFilter !== 'all') {
//             const isVerified = verificationFilter === 'verified';
//             filtered = filtered.filter(company => company?.isVerified === isVerified);
//         }

//         // Apply location filter
//         if (locationFilter !== 'all') {
//             filtered = filtered.filter(company =>
//                 company?.locations && Array.isArray(company.locations) &&
//                 company.locations.some(loc => loc && loc.city === locationFilter)
//             );
//         }

//         setFilteredData(filtered);
//     }, [companyData, companySizeFilter, industryFilter, verificationFilter, locationFilter]);

//     // Apply timeline filter
//     useEffect(() => {
//         if (!filteredData || filteredData.length === 0) {
//             setTimelineFilteredData([]);
//             return;
//         }

//         const now = new Date();
//         let timelineFiltered = [...filteredData];

//         if (selectedTimeline === 'daily') {
//             // Last 7 days
//             const sevenDaysAgo = new Date(now);
//             sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
//             sevenDaysAgo.setHours(0, 0, 0, 0);

//             timelineFiltered = filteredData.filter(company => {
//                 if (!company?.createdAt) return false;
//                 const createdDate = new Date(company.createdAt);
//                 return createdDate >= sevenDaysAgo;
//             });
//         } else if (selectedTimeline === 'weekly') {
//             // Last 4 weeks
//             const fourWeeksAgo = new Date(now);
//             fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
//             fourWeeksAgo.setHours(0, 0, 0, 0);

//             timelineFiltered = filteredData.filter(company => {
//                 if (!company?.createdAt) return false;
//                 const createdDate = new Date(company.createdAt);
//                 return createdDate >= fourWeeksAgo;
//             });
//         } else if (selectedTimeline === 'monthly') {
//             // Last 6 months
//             const sixMonthsAgo = new Date(now);
//             sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
//             sixMonthsAgo.setDate(1);
//             sixMonthsAgo.setHours(0, 0, 0, 0);

//             timelineFiltered = filteredData.filter(company => {
//                 if (!company?.createdAt) return false;
//                 const createdDate = new Date(company.createdAt);
//                 return createdDate >= sixMonthsAgo;
//             });
//         } else if (selectedTimeline === 'yearly') {
//             // Last 5 years
//             const fiveYearsAgo = new Date(now);
//             fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
//             fiveYearsAgo.setMonth(0);
//             fiveYearsAgo.setDate(1);
//             fiveYearsAgo.setHours(0, 0, 0, 0);

//             timelineFiltered = filteredData.filter(company => {
//                 if (!company?.createdAt) return false;
//                 const createdDate = new Date(company.createdAt);
//                 return createdDate >= fiveYearsAgo;
//             });
//         }

//         setTimelineFilteredData(timelineFiltered);
//     }, [filteredData, selectedTimeline]);

//     // Get unique values for filters
//     const getUniqueCompanySizes = () => {
//         if (!companyData || !Array.isArray(companyData)) return [];
//         const sizes = [...new Set(companyData.map(company => company?.companySize).filter(Boolean))];
//         return sizes;
//     };

//     const getUniqueIndustries = () => {
//         if (!companyData || !Array.isArray(companyData)) return [];
//         const industries = [...new Set(companyData.map(company => company?.industry).filter(Boolean))];
//         return industries;
//     };

//     const getUniqueLocations = () => {
//         if (!companyData || !Array.isArray(companyData)) return [];
//         const locations = new Set();
//         companyData.forEach(company => {
//             if (company.locations && Array.isArray(company.locations)) {
//                 company.locations.forEach(loc => {
//                     if (loc && loc.city) {
//                         locations.add(loc.city);
//                     }
//                 });
//             }
//         });
//         return Array.from(locations);
//     };

//     // Export functions with error handling
//     const exportToCSV = () => {
//         if (!timelineFilteredData || timelineFilteredData.length === 0) {
//             setError("No data available to export.");
//             return;
//         }

//         try {
//             const headers = [
//                 'Company Name', 'Industry', 'Company Size', 'Location', 'Email',
//                 'Phone', 'Website', 'CEO', 'Founder', 'Verification Status', 'Created Date'
//             ];

//             const csvContent = [
//                 headers.join(','),
//                 ...timelineFilteredData.map(company => [
//                     company?.fullname || 'N/A',
//                     company?.industry || 'N/A',
//                     company?.companySize || 'N/A',
//                     company.locations && company.locations.length > 0
//                         ? `${company.locations[0]?.city || 'N/A'}, ${company.locations[0]?.country || 'N/A'}`
//                         : 'N/A',
//                     company?.email || 'N/A',
//                     company?.contactPhone || 'N/A',
//                     company?.website || 'N/A',
//                     company.ceo ? company.ceo?.ceoName || 'N/A' : 'N/A',
//                     company.founder ? company.founder?.founderName || 'N/A' : 'N/A',
//                     company.isVerified ? 'Verified' : 'Not Verified',
//                     company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'
//                 ].join(','))
//             ].join('\n');

//             const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//             const url = URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.setAttribute('href', url);
//             link.setAttribute('download', `company_data_${new Date().toISOString().slice(0, 10)}.csv`);
//             link.style.visibility = 'hidden';
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             setError(null);
//         } catch (err) {
//             console.error("Error exporting CSV:", err);
//             setError("Failed to export CSV. Please try again.");
//         }
//     };

//     const exportToExcel = () => {
//         if (!timelineFilteredData || timelineFilteredData.length === 0) {
//             setError("No data available to export.");
//             return;
//         }

//         try {
//             const headers = [
//                 'Company Name', 'Industry', 'Company Size', 'Location', 'Email',
//                 'Phone', 'Website', 'CEO', 'Founder', 'Verification Status', 'Created Date'
//             ];

//             let tableContent = '<table>';
//             tableContent += '<tr>' + headers.map(header => `<th>${header}</th>`).join('') + '</tr>';

//             timelineFilteredData.forEach(company => {
//                 tableContent += '<tr>';
//                 tableContent += `<td>${company?.fullname || 'N/A'}</td>`;
//                 tableContent += `<td>${company?.industry || 'N/A'}</td>`;
//                 tableContent += `<td>${company?.companySize || 'N/A'}</td>`;
//                 tableContent += `<td>${company.locations && company.locations.length > 0
//                     ? `${company.locations[0]?.city || 'N/A'}, ${company.locations[0]?.country || 'N/A'}`
//                     : 'N/A'
//                     }</td>`;
//                 tableContent += `<td>${company?.email || 'N/A'}</td>`;
//                 tableContent += `<td>${company?.contactPhone || 'N/A'}</td>`;
//                 tableContent += `<td>${company?.website || 'N/A'}</td>`;
//                 tableContent += `<td>${company.ceo ? company.ceo?.ceoName || 'N/A' : 'N/A'}</td>`;
//                 tableContent += `<td>${company.founder ? company.founder?.founderName || 'N/A' : 'N/A'}</td>`;
//                 tableContent += `<td>${company.isVerified ? 'Verified' : 'Not Verified'}</td>`;
//                 tableContent += `<td>${company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}</td>`;
//                 tableContent += '</tr>';
//             });

//             tableContent += '</table>';

//             const blob = new Blob([tableContent], { type: 'application/vnd.ms-excel' });
//             const url = URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.setAttribute('href', url);
//             link.setAttribute('download', `company_data_${new Date().toISOString().slice(0, 10)}.xls`);
//             link.style.visibility = 'hidden';
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             setError(null);
//         } catch (err) {
//             console.error("Error exporting Excel:", err);
//             setError("Failed to export Excel. Please try again.");
//         }
//     };

//     // Process data for charts with enhanced styling
//     const getCompanySizeData = () => {
//         if (!timelineFilteredData || timelineFilteredData.length === 0) {
//             return {
//                 labels: ['No Data'],
//                 datasets: [{
//                     data: [1],
//                     backgroundColor: ['#e5e7eb'],
//                     borderColor: ['#e5e7eb'],
//                     borderWidth: 2
//                 }]
//             };
//         }

//         const sizeCounts = {};
//         timelineFilteredData.forEach(company => {
//             if (company?.companySize) {
//                 sizeCounts[company.companySize] = (sizeCounts[company.companySize] || 0) + 1;
//             }
//         });

//         return {
//             labels: Object.keys(sizeCounts).length > 0 ? Object.keys(sizeCounts) : ['No Data'],
//             datasets: [{
//                 data: Object.keys(sizeCounts).length > 0 ? Object.values(sizeCounts) : [1],
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.8)',
//                     'rgba(54, 162, 235, 0.8)',
//                     'rgba(255, 206, 86, 0.8)',
//                     'rgba(75, 192, 192, 0.8)',
//                     'rgba(153, 102, 255, 0.8)'
//                 ],
//                 borderColor: [
//                     'rgba(255, 99, 132, 1)',
//                     'rgba(54, 162, 235, 1)',
//                     'rgba(255, 206, 86, 1)',
//                     'rgba(75, 192, 192, 1)',
//                     'rgba(153, 102, 255, 1)'
//                 ],
//                 borderWidth: 2,
//                 hoverOffset: 4
//             }]
//         };
//     };

//     const getIndustryData = () => {
//         if (!timelineFilteredData || timelineFilteredData.length === 0) {
//             return {
//                 labels: ['No Data'],
//                 datasets: [{
//                     label: 'Companies',
//                     data: [1],
//                     backgroundColor: ['#e5e7eb'],
//                     borderColor: ['#e5e7eb'],
//                     borderWidth: 2
//                 }]
//             };
//         }

//         const industryCounts = {};
//         timelineFilteredData.forEach(company => {
//             if (company?.industry) {
//                 industryCounts[company.industry] = (industryCounts[company.industry] || 0) + 1;
//             }
//         });

//         return {
//             labels: Object.keys(industryCounts).length > 0 ? Object.keys(industryCounts) : ['No Data'],
//             datasets: [{
//                 label: 'Companies',
//                 data: Object.keys(industryCounts).length > 0 ? Object.values(industryCounts) : [1],
//                 backgroundColor: (context) => {
//                     const chart = context.chart;
//                     const { ctx, chartArea } = chart;
//                     if (!chartArea) return;
//                     return getGradient(ctx, chartArea, '#667eea', '#764ba2');
//                 },
//                 borderColor: '#667eea',
//                 borderWidth: 2,
//                 borderRadius: 8,
//                 borderSkipped: false,
//             }]
//         };
//     };

//     const getDepartmentData = () => {
//         if (!timelineFilteredData || timelineFilteredData.length === 0) {
//             return {
//                 labels: ['No Data'],
//                 datasets: [{
//                     label: 'Departments',
//                     data: [1],
//                     backgroundColor: ['#e5e7eb'],
//                     borderColor: ['#e5e7eb'],
//                     borderWidth: 2
//                 }]
//             };
//         }

//         const departmentCounts = {};
//         timelineFilteredData.forEach(company => {
//             if (company.departments && Array.isArray(company.departments)) {
//                 company.departments.forEach(dept => {
//                     if (dept?.value) {
//                         departmentCounts[dept.value] = (departmentCounts[dept.value] || 0) + 1;
//                     }
//                 });
//             }
//         });

//         return {
//             labels: Object.keys(departmentCounts).length > 0 ? Object.keys(departmentCounts) : ['No Data'],
//             datasets: [{
//                 label: 'Departments',
//                 data: Object.keys(departmentCounts).length > 0 ? Object.values(departmentCounts) : [1],
//                 backgroundColor: (context) => {
//                     const chart = context.chart;
//                     const { ctx, chartArea } = chart;
//                     if (!chartArea) return;
//                     return getGradient(ctx, chartArea, '#f093fb', '#f5576c');
//                 },
//                 borderColor: '#f093fb',
//                 borderWidth: 2,
//                 borderRadius: 8,
//                 borderSkipped: false,
//             }]
//         };
//     };

//     const getLocationData = () => {
//         if (!timelineFilteredData || timelineFilteredData.length === 0) {
//             return {
//                 labels: ['No Data'],
//                 datasets: [{
//                     label: 'Locations',
//                     data: [1],
//                     backgroundColor: ['#e5e7eb'],
//                     borderColor: ['#e5e7eb'],
//                     borderWidth: 2
//                 }]
//             };
//         }

//         const locationCounts = {};
//         timelineFilteredData.forEach(company => {
//             if (company.locations && Array.isArray(company.locations)) {
//                 company.locations.forEach(loc => {
//                     if (loc && loc.city) {
//                         locationCounts[loc.city] = (locationCounts[loc.city] || 0) + 1;
//                     }
//                 });
//             }
//         });

//         return {
//             labels: Object.keys(locationCounts).length > 0 ? Object.keys(locationCounts) : ['No Data'],
//             datasets: [{
//                 label: 'Locations',
//                 data: Object.keys(locationCounts).length > 0 ? Object.values(locationCounts) : [1],
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.8)',
//                     'rgba(54, 162, 235, 0.8)',
//                     'rgba(255, 206, 86, 0.8)',
//                     'rgba(75, 192, 192, 0.8)',
//                     'rgba(153, 102, 255, 0.8)'
//                 ],
//                 borderColor: '#ffffff',
//                 borderWidth: 3,
//                 hoverOffset: 8
//             }]
//         };
//     };

//     const getVerificationData = () => {
//         if (!timelineFilteredData || timelineFilteredData.length === 0) {
//             return {
//                 labels: ['No Data'],
//                 datasets: [{
//                     data: [1],
//                     backgroundColor: ['#e5e7eb'],
//                     borderColor: ['#e5e7eb'],
//                     borderWidth: 2
//                 }]
//             };
//         }

//         const verifiedCount = timelineFilteredData.filter(company => company?.isVerified).length;
//         const unverifiedCount = timelineFilteredData.length - verifiedCount;

//         return {
//             labels: ['Verified', 'Unverified'],
//             datasets: [{
//                 data: [verifiedCount, unverifiedCount],
//                 backgroundColor: [
//                     'rgba(75, 192, 192, 0.8)',
//                     'rgba(255, 99, 132, 0.8)'
//                 ],
//                 borderColor: [
//                     'rgba(75, 192, 192, 1)',
//                     'rgba(255, 99, 132, 1)'
//                 ],
//                 borderWidth: 2,
//                 hoverOffset: 4
//             }]
//         };
//     };

//     const getTimelineData = () => {
//         if (!timelineFilteredData || timelineFilteredData.length === 0) {
//             return {
//                 labels: ['No Data'],
//                 datasets: [{
//                     label: 'New Companies',
//                     data: [0],
//                     fill: true,
//                     backgroundColor: '#e5e7eb',
//                     borderColor: '#e5e7eb',
//                     borderWidth: 2
//                 }]
//             };
//         }

//         let labels = [];
//         let counts = [];

//         const now = new Date();

//         if (selectedTimeline === 'daily') {
//             // Last 7 days
//             for (let i = 6; i >= 0; i--) {
//                 const date = new Date(now);
//                 date.setDate(date.getDate() - i);
//                 const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//                 labels.push(dateStr);

//                 const dayStart = new Date(date);
//                 dayStart.setHours(0, 0, 0, 0);
//                 const dayEnd = new Date(date);
//                 dayEnd.setHours(23, 59, 59, 999);

//                 const count = timelineFilteredData.filter(company => {
//                     if (!company?.createdAt) return false;
//                     const createdDate = new Date(company.createdAt);
//                     return createdDate >= dayStart && createdDate <= dayEnd;
//                 }).length;

//                 counts.push(count);
//             }
//         } else if (selectedTimeline === 'weekly') {
//             // Last 4 weeks
//             for (let i = 3; i >= 0; i--) {
//                 const weekStart = new Date(now);
//                 weekStart.setDate(weekStart.getDate() - (i * 7 + 6));
//                 weekStart.setHours(0, 0, 0, 0);

//                 const weekEnd = new Date(weekStart);
//                 weekEnd.setDate(weekEnd.getDate() + 6);
//                 weekEnd.setHours(23, 59, 59, 999);

//                 labels.push(`Week ${4 - i}`);

//                 const count = timelineFilteredData.filter(company => {
//                     if (!company?.createdAt) return false;
//                     const createdDate = new Date(company.createdAt);
//                     return createdDate >= weekStart && createdDate <= weekEnd;
//                 }).length;

//                 counts.push(count);
//             }
//         } else if (selectedTimeline === 'monthly') {
//             // Last 6 months
//             const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//             for (let i = 5; i >= 0; i--) {
//                 const date = new Date(now);
//                 date.setMonth(date.getMonth() - i);
//                 labels.push(months[date.getMonth()]);

//                 const count = timelineFilteredData.filter(company => {
//                     if (!company?.createdAt) return false;
//                     const createdDate = new Date(company.createdAt);
//                     return createdDate.getMonth() === date.getMonth() &&
//                         createdDate.getFullYear() === date.getFullYear();
//                 }).length;

//                 counts.push(count);
//             }
//         } else if (selectedTimeline === 'yearly') {
//             // Last 5 years
//             for (let i = 4; i >= 0; i--) {
//                 const year = now.getFullYear() - i;
//                 labels.push(year.toString());

//                 const count = timelineFilteredData.filter(company => {
//                     if (!company?.createdAt) return false;
//                     const createdDate = new Date(company.createdAt);
//                     return createdDate.getFullYear() === year;
//                 }).length;

//                 counts.push(count);
//             }
//         }

//         return {
//             labels: labels,
//             datasets: [{
//                 label: 'New Companies',
//                 data: counts,
//                 fill: true,
//                 backgroundColor: (context) => {
//                     const chart = context.chart;
//                     const { ctx, chartArea } = chart;
//                     if (!chartArea) return;
//                     return getGradient(ctx, chartArea, '#667eea', '#764ba2');
//                 },
//                 borderColor: '#667eea',
//                 borderWidth: 3,
//                 pointBackgroundColor: '#667eea',
//                 pointBorderColor: '#ffffff',
//                 pointBorderWidth: 2,
//                 pointRadius: 6,
//                 pointHoverRadius: 8,
//                 tension: 0.4
//             }]
//         };
//     };

//     // Helper function to create gradient
//     const getGradient = (ctx, chartArea, color1, color2) => {
//         const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
//         gradient.addColorStop(0, color1);
//         gradient.addColorStop(1, color2);
//         return gradient;
//     };

//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false
//             },
//             tooltip: {
//                 backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                 titleColor: '#ffffff',
//                 bodyColor: '#ffffff',
//                 borderColor: 'rgba(255, 255, 255, 0.1)',
//                 borderWidth: 1,
//                 cornerRadius: 8,
//                 padding: 12,
//                 displayColors: true,
//                 intersect: false,
//                 titleFont: {
//                     size: isMobile ? 12 : 14,
//                     weight: 'bold'
//                 },
//                 bodyFont: {
//                     size: isMobile ? 10 : 12
//                 }
//             }
//         },
//         scales: {
//             x: {
//                 grid: {
//                     display: false,
//                     drawBorder: false
//                 },
//                 ticks: {
//                     color: '#6b7280',
//                     font: {
//                         size: isMobile ? 10 : 12,
//                         weight: '500'
//                     }
//                 }
//             },
//             y: {
//                 grid: {
//                     color: 'rgba(107, 114, 128, 0.1)',
//                     drawBorder: false
//                 },
//                 ticks: {
//                     color: '#6b7280',
//                     font: {
//                         size: isMobile ? 10 : 12,
//                         weight: '500'
//                     },
//                     beginAtZero: true,
//                     padding: 10
//                 }
//             }
//         },
//         animation: {
//             duration: 1000,
//             easing: 'easeInOutQuart'
//         }
//     };

//     const doughnutOptions = {
//         ...chartOptions,
//         cutout: '60%',
//         plugins: {
//             ...chartOptions.plugins,
//             legend: {
//                 display: true,
//                 position: 'bottom',
//                 labels: {
//                     padding: 20,
//                     usePointStyle: true,
//                     font: {
//                         size: isMobile ? 10 : 12
//                     }
//                 }
//             }
//         }
//     };

//     const polarOptions = {
//         ...chartOptions,
//         scales: {
//             r: {
//                 grid: {
//                     color: 'rgba(107, 114, 128, 0.1)'
//                 },
//                 ticks: {
//                     color: '#6b7280',
//                     backdropColor: 'transparent'
//                 }
//             }
//         }
//     };

//     const handleTimelineSelect = (timeline) => {
//         setSelectedTimeline(timeline);
//         setShowTimelineDropdown(false);
//     };

//     const getTimelineLabel = () => {
//         switch (selectedTimeline) {
//             case 'daily': return 'Daily';
//             case 'weekly': return 'Weekly';
//             case 'monthly': return 'Monthly';
//             case 'yearly': return 'Yearly';
//             default: return 'Monthly';
//         }
//     };

//     return (
//         <>
//             <style>{`
//             .dashboard-container {
//                 background-color: #f8fafc;
//             }

//             .dashboard-header {
//                 background-color: #ffffff;
//                 border-bottom: 1px solid #e5e7eb;
//                 padding: 1rem;
//                 margin-bottom: 1rem;
//                 box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
//                 position: sticky;
//                 top: 0;
//                 z-index: 1000;
//             }

//             .dashboard-title {
//                 font-size: 1.5rem;
//                 font-weight: 700;
//                 color: #1f2937;
//                 margin-bottom: 0.25rem;
//             }

//             .dashboard-subtitle {
//                 color: #6b7280;
//                 font-size: 0.875rem;
//                 margin-bottom: 0;
//             }

//             .mobile-header {
//                 display: flex;
//                 flex-wrap: wrap;
//                 justify-content: space-between;
//                 align-items: center;
//                 padding: 1rem;
//                 background: #ffffff;
//                 border-bottom: 1px solid #e5e7eb;
//             }

//             .mobile-title {
//                 font-size: 1.25rem;
//                 font-weight: 700;
//                 color: #1f2937;
//             }

//             .mobile-actions {
//                 display: flex;
//                 gap: 0.5rem;
//             }

//             .mobile-btn {
//                 padding: 0.5rem 1rem;
//                 font-size: 0.875rem;
//                 border-radius: 6px;
//                 border: none;
//                 background: linear-gradient(135deg, #667eea, #764ba2);
//                 color: #ffffff;
//                 font-weight: 600;
//                 display: flex;
//                 align-items: center;
//                 gap: 0.5rem;
//             }

//             .mobile-btn:hover {
//                 background: linear-gradient(135deg, #5a67d8, #764ba2);
//             }

//             .stat-card {
//                 background-color: #ffffff;
//                 border: 1px solid #e5e7eb;
//                 border-radius: 12px;
//                 padding: 1rem;
//                 margin-bottom: 1rem;
//                 transition: all 0.3s ease;
//                 position: relative;
//                 overflow: hidden;
//             }

//             .stat-card::before {
//                 content: '';
//                 position: absolute;
//                 top: 0;
//                 left: 0;
//                 right: 0;
//                 height: 3px;
//                 background: linear-gradient(90deg, #667eea, #764ba2);
//             }

//             .stat-card:hover {
//                 transform: translateY(-2px);
//                 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//             }

//             .stat-number {
//                 font-size: 1.75rem;
//                 font-weight: 700;
//                 color: #1f2937;
//                 margin-bottom: 0.5rem;
//                 line-height: 1;
//             }

//             .stat-label {
//                 color: #6b7280;
//                 font-size: 0.75rem;
//                 font-weight: 500;
//                 text-transform: uppercase;
//                 letter-spacing: 0.025em;
//             }

//             .stat-icon {
//                 width: 50px;
//                 height: 50px;
//                 border-radius: 12px;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 font-size: 1.25rem;
//                 color: #ffffff;
//                 margin-bottom: 0.75rem;
//                 background: linear-gradient(135deg, #667eea, #764ba2);
//             }

//             .filter-section {
//                 background-color: #ffffff;
//                 border: 1px solid #e5e7eb;
//                 border-radius: 12px;
//                 padding: 1rem;
//                 margin-bottom: 1rem;
//             }

//             .filter-title {
//                 font-size: 1rem;
//                 font-weight: 600;
//                 color: #1f2937;
//                 margin-bottom: 1rem;
//                 display: flex;
//                 align-items: center;
//                 gap: 0.5rem;
//             }

//             .form-control {
//                 border: 1px solid #e5e7eb;
//                 border-radius: 6px;
//                 padding: 0.5rem 0.75rem;
//                 font-size: 0.875rem;
//                 transition: all 0.3s ease;
//                 background: #ffffff;
//             }

//             .form-control:focus {
//                 border-color: #667eea;
//                 box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//                 outline: none;
//             }

//             .btn {
//                 border-radius: 6px;
//                 padding: 0.5rem 1rem;
//                 font-weight: 600;
//                 font-size: 0.875rem;
//                 transition: all 0.3s ease;
//                 border: none;
//                 position: relative;
//                 overflow: hidden;
//             }

//             .btn-primary {
//                 background: linear-gradient(135deg, #667eea, #764ba2);
//                 color: #ffffff;
//             }

//             .btn-primary:hover {
//                 background: linear-gradient(135deg, #5a67d8, #764ba2);
//             }

//             .btn-success {
//                 background: linear-gradient(135deg, #10b981, #059669);
//                 color: #ffffff;
//             }

//             .btn-success:hover {
//                 background: linear-gradient(135deg, #0e9c6b, #059669);
//             }

//             .btn-secondary {
//                 background: linear-gradient(135deg, #6b7280, #4b5563);
//                 color: #ffffff;
//             }

//             .btn-secondary:hover {
//                 background: linear-gradient(135deg, #5a6268, #4b5563);
//             }

//             .dropdown-toggle::after {
//                 display: none;
//             }

//             .dropdown-menu {
//                 border: none;
//                 border-radius: 6px;
//                 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//                 padding: 0.25rem 0;
//                 background: #ffffff;
//                 margin-top: 0.25rem;
//                 max-height: 200px;
//                 overflow-y: auto;
//             }

//             .dropdown-item {
//                 padding: 0.5rem 0.75rem;
//                 color: #374151;
//                 font-weight: 500;
//                 transition: all 0.3s ease;
//                 border-radius: 0;
//                 font-size: 0.875rem;
//             }

//             .dropdown-item:hover {
//                 background: linear-gradient(135deg, #667eea, #764ba2);
//                 color: #ffffff;
//             }

//             .chart-card {
//                 background: #ffffff;
//                 border-radius: 12px;
//                 padding: 1rem;
//                 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
//                 margin-bottom: 1rem;
//                 border: 1px solid #e5e7eb;
//                 transition: all 0.3s ease;
//                 position: relative;
//                 overflow: hidden;
//             }

//             .chart-card::before {
//                 content: '';
//                 position: absolute;
//                 top: 0;
//                 left: 0;
//                 right: 0;
//                 height: 3px;
//                 background: linear-gradient(90deg, #667eea, #764ba2);
//             }

//             .chart-card:hover {
//                 transform: translateY(-2px);
//                 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
//             }

//             .chart-title {
//                 font-size: 1rem;
//                 font-weight: 600;
//                 color: #1f2937;
//                 margin-bottom: 1rem;
//                 display: flex;
//                 align-items: center;
//                 gap: 0.5rem;
//             }

//             .chart-title svg {
//                 color: #667eea;
//             }

//             .chart-container {
//                 position: relative;
//                 height: 250px;
//                 padding: 0.5rem;
//                 background: linear-gradient(135deg, #f8fafc, #f1f5f9);
//                 border-radius: 8px;
//             }

//             .chart-wrapper {
//                 position: relative;
//                 height: 100%;
//                 width: 100%;
//             }

//             .company-list {
//                 background: #ffffff;
//                 border-radius: 12px;
//                 padding: 1rem;
//                 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
//                 margin-bottom: 1rem;
//                 border: 1px solid #e5e7eb;
//             }

//             .company-item {
//                 background: #f9fafb;
//                 border-radius: 8px;
//                 padding: 0.75rem;
//                 margin-bottom: 0.75rem;
//                 cursor: pointer;
//                 transition: all 0.3s ease;
//                 border: 1px solid transparent;
//             }

//             .company-item:hover {
//                 background: #ffffff;
//                 transform: translateX(3px);
//                 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//             }

//             .company-item.active {
//                 background: linear-gradient(135deg, #667eea, #764ba2);
//                 color: #ffffff;
//                 border-color: #667eea;
//             }

//             .company-item.active .company-name,
//             .company-item.active .company-industry,
//             .company-item.active .company-size {
//                 color: #ffffff;
//             }

//             .company-logo {
//                 width: 40px;
//                 height: 40px;
//                 border-radius: 6px;
//                 object-fit: cover;
//                 margin-right: 0.75rem;
//             }

//             .company-name {
//                 font-weight: 600;
//                 color: #1f2937;
//                 margin-bottom: 0.25rem;
//                 font-size: 0.875rem;
//             }

//             .company-industry,
//             .company-size {
//                 color: #6b7280;
//                 font-size: 0.75rem;
//                 margin-bottom: 0.25rem;
//             }

//             .badge-success {
//                 background: linear-gradient(135deg, #10b981, #059669);
//                 color: #ffffff;
//                 padding: 0.125rem 0.5rem;
//                 border-radius: 12px;
//                 font-size: 0.625rem;
//                 font-weight: 600;
//             }

//             .company-details {
//                 background: #ffffff;
//                 border-radius: 12px;
//                 padding: 1rem;
//                 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
//                 margin-bottom: 1rem;
//                 border: 1px solid #e5e7eb;
//             }

//             .company-details h4 {
//                 color: #1f2937;
//                 font-weight: 700;
//                 margin-bottom: 0.75rem;
//                 font-size: 1.125rem;
//             }

//             .company-details h6 {
//                 color: #374151;
//                 font-weight: 600;
//                 margin-bottom: 0.75rem;
//                 font-size: 0.875rem;
//             }

//             .table {
//                 background: transparent;
//             }

//             .table td {
//                 padding: 0.5rem 0;
//                 border: none;
//                 vertical-align: middle;
//                 font-size: 0.75rem;
//             }

//             .table td:first-child {
//                 font-weight: 600;
//                 color: #6b7280;
//                 width: 40%;
//             }

//             .table td:last-child {
//                 color: #1f2937;
//             }

//             .badge {
//                 padding: 0.25rem 0.5rem;
//                 border-radius: 6px;
//                 font-weight: 600;
//                 font-size: 0.75rem;
//                 margin-right: 0.5rem;
//                 margin-bottom: 0.5rem;
//                 display: inline-block;
//             }

//             .badge-info {
//                 background: linear-gradient(135deg, #06b6d4, #0891b2);
//                 color: #ffffff;
//             }

//             .badge-secondary {
//                 background: linear-gradient(135deg, #6b7280, #4b5563);
//                 color: #ffffff;
//             }

//             .social-links {
//                 display: flex;
//                 gap: 0.5rem;
//                 flex-wrap: wrap;
//             }

//             .social-links a {
//                 display: inline-flex;
//                 align-items: center;
//                 justify-content: center;
//                 width: 32px;
//                 height: 32px;
//                 border-radius: 6px;
//                 background: linear-gradient(135deg, #667eea, #764ba2);
//                 color: #ffffff;
//                 margin-right: 0.5rem;
//                 transition: all 0.3s ease;
//             }

//             .social-links a:hover {
//                 transform: translateY(-2px);
//                 box-shadow: 0 3px 10px rgba(102, 126, 234, 0.4);
//             }

//             .empty-state {
//                 text-align: center;
//                 padding: 2rem;
//                 color: #6b7280;
//             }

//             .empty-state svg {
//                 font-size: 3rem;
//                 color: #d1d5db;
//                 margin-bottom: 0.75rem;
//             }

//             .company-details {
//                 max-height: 500px;
//                 overflow-y: auto;
//                 padding-right: 0.5rem;
//             }

//             .company-details::-webkit-scrollbar {
//                 width: 4px;
//             }

//             .company-details::-webkit-scrollbar-track {
//                 background: #f1f1f1;
//                 border-radius: 6px;
//             }

//             .company-details::-webkit-scrollbar-thumb {
//                 background: linear-gradient(135deg, #667eea, #764ba2);
//                 border-radius: 6px;
//             }

//             .company-details::-webkit-scrollbar-thumb:hover {
//                 background: linear-gradient(135deg, #764ba2, #667eea);
//             }

//             .filter-info {
//                 background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
//                 border-radius: 6px;
//                 padding: 0.25rem 0.5rem;
//                 color: #374151;
//                 font-weight: 500;
//                 display: inline-block;
//                 font-size: 0.75rem;
//             }

//             .controls-section {
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: center;
//                 margin-bottom: 1rem;
//                 flex-wrap: wrap;
//                 gap: 0.5rem;
//             }

//             .error-message {
//                 background-color: #fee;
//                 color: #b91c1c;
//                 padding: 0.75rem;
//                 border-radius: 6px;
//                 margin-bottom: 1rem;
//                 text-align: center;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 gap: 0.5rem;
//             }

//             .loading-spinner {
//                 display: flex;
//                 flex-direction: column;
//                 justify-content: center;
//                 align-items: center;
//                 padding: 1rem;
//                 gap: 0.5rem;
//             }

//             .loading-spinner svg {
//                 font-size: 1.5rem;
//                 color: #667eea;
//                 animation: spin 2s linear infinite;
//             }

//             @keyframes spin {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//             }

//             /* Timeline Dropdown Styles */
//             .timeline-dropdown {
//                 position: relative;
//                 display: inline-block;
//             }

//             .timeline-dropdown-toggle {
//                 display: flex;
//                 align-items: center;
//                 gap: 0.5rem;
//                 padding: 0.5rem 1rem;
//                 background: linear-gradient(135deg, #667eea, #764ba2);
//                 color: #ffffff;
//                 border: none;
//                 border-radius: 6px;
//                 font-weight: 600;
//                 font-size: 0.875rem;
//                 cursor: pointer;
//                 transition: all 0.3s ease;
//             }

//             .timeline-dropdown-toggle:hover {
//                 background: linear-gradient(135deg, #5a67d8, #764ba2);
//             }

//             .timeline-dropdown-menu {
//                 position: absolute;
//                 top: 100%;
//                 left: 0;
//                 right: 0;
//                 background: #ffffff;
//                 border-radius: 6px;
//                 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//                 padding: 0.25rem 0;
//                 margin-top: 0.25rem;
//                 z-index: 1000;
//                 min-width: 120px;
//             }

//             .timeline-dropdown-item {
//                 padding: 0.5rem 0.75rem;
//                 color: #374151;
//                 font-weight: 500;
//                 transition: all 0.3s ease;
//                 border-radius: 0;
//                 font-size: 0.875rem;
//                 cursor: pointer;
//             }

//             .timeline-dropdown-item:hover {
//                 background: linear-gradient(135deg, #667eea, #764ba2);
//                 color: #ffffff;
//             }

//             /* Timeline indicator */
//             .timeline-indicator {
//                 position: absolute;
//                 right: 8px;
//                 background: #ef4444;
//                 color: white;
//                 border-radius: 50%;
//                 width: 20px;
//                 height: 20px;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 font-size: 10px;
//                 font-weight: bold;
//                 z-index: 10;
//             }

//             /* Mobile specific styles */
//             @media (max-width: 768px) {
//                 .dashboard-title {
//                     font-size: 1.25rem;
//                 }

//                 .stat-number {
//                     font-size: 1.5rem;
//                 }

//                 .stat-icon {
//                     width: 40px;
//                     height: 40px;
//                     font-size: 1rem;
//                 }

//                 .stat-label {
//                     font-size: 0.625rem;
//                 }

//                 .chart-container {
//                     height: 200px;
//                     padding: 0.25rem;
//                 }

//                 .company-logo {
//                     width: 32px;
//                     height: 32px;
//                 }

//                 .company-name {
//                     font-size: 0.875rem;
//                 }

//                 .company-industry,
//                 .company-size {
//                     font-size: 0.625rem;
//                 }

//                 .badge-success {
//                     font-size: 0.5rem;
//                     padding: 0.125rem 0.375rem;
//                 }

//                 .company-details h4 {
//                     font-size: 1rem;
//                     margin-bottom: 0.5rem;
//                 }

//                 .company-details h6 {
//                     font-size: 0.75rem;
//                     margin-bottom: 0.5rem;
//                 }

//                 .table td {
//                     font-size: 0.625rem;
//                 }

//                 .table td:first-child {
//                     width: 35%;
//                 }

//                 .social-links a {
//                     width: 28px;
//                     height: 28px;
//                 }
//             }
//         `}</style>
//             <div className="container-fluid">
//                 <div className="container">
//                     <div className="dashboard-container">

//                         <div className="dashboard-header">
//                             <div className="mobile-header d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3">
//                                 <h1 className="mobile-title text-center text-lg-start m-0">
//                                     Company Dashboard
//                                 </h1>

//                                 <div className="mobile-actions d-flex flex-wrap align-items-center justify-content-center justify-content-lg-end gap-2">
//                                     <div className="timeline-dropdown position-relative" ref={dropdownRef}>
//                                         <button
//                                             className="timeline-dropdown-toggle btn btn-outline-primary d-flex align-items-center gap-1"
//                                             onClick={() => setShowTimelineDropdown(!showTimelineDropdown)}
//                                         >
//                                             <FiClock />
//                                             <span>{getTimelineLabel()}</span>
//                                             <FiChevronDown />
//                                         </button>

//                                         {showTimelineDropdown && (
//                                             <div className="timeline-dropdown-menu position-absolute mt-2 bg-white border rounded shadow-sm">
//                                                 <div
//                                                     className="timeline-dropdown-item px-3 py-2"
//                                                     onClick={() => handleTimelineSelect("daily")}
//                                                 >
//                                                     Daily
//                                                 </div>
//                                                 <div
//                                                     className="timeline-dropdown-item px-3 py-2"
//                                                     onClick={() => handleTimelineSelect("weekly")}
//                                                 >
//                                                     Weekly
//                                                 </div>
//                                                 <div
//                                                     className="timeline-dropdown-item px-3 py-2"
//                                                     onClick={() => handleTimelineSelect("monthly")}
//                                                 >
//                                                     Monthly
//                                                 </div>
//                                                 <div
//                                                     className="timeline-dropdown-item px-3 py-2"
//                                                     onClick={() => handleTimelineSelect("yearly")}
//                                                 >
//                                                     Yearly
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>

//                                     <button className="mobile-btn btn btn-outline-success d-flex align-items-center gap-1" onClick={exportToCSV}>
//                                         <FiFile /> Export CSV
//                                     </button>

//                                     <button className="mobile-btn btn btn-outline-danger d-flex align-items-center gap-1" onClick={exportToExcel}>
//                                         <FiFile /> Export PDF
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="container mb-3">
//                             {/* Error Message */}
//                             {error && (
//                                 <div className="error-message">
//                                     <FiAlertTriangle />
//                                     {error}
//                                 </div>
//                             )}

//                             {/* Loading State */}
//                             {isLoading && (
//                                 <div className="loading-spinner">
//                                     <FiLoader />
//                                     <p>Loading data...</p>
//                                 </div>
//                             )}

//                             {/* Content when not loading */}
//                             {!isLoading && (
//                                 <>
//                                     {/* Statistics Cards */}
//                                     <div className="row">
//                                         <div className="col-6 col-md-3 mb-3">
//                                             <div className="stat-card d-flex gap-2">
//                                                 <div className="stat-icon">
//                                                     <BsBuilding />
//                                                 </div>
//                                                 <div>
//                                                     <div className="stat-number">{timelineFilteredData.length}</div>
//                                                     <div className="stat-label">Total</div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="col-6 col-md-3 mb-3">
//                                             <div className="stat-card d-flex gap-2">
//                                                 <div className="stat-icon">
//                                                     <FiCheckCircle />
//                                                 </div>
//                                                 <div>
//                                                     <div className="stat-number">{timelineFilteredData.filter(c => c?.isVerified).length}</div>
//                                                     <div className="stat-label">Verified</div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="col-6 col-md-3 mb-3">
//                                             <div className="stat-card d-flex gap-2">
//                                                 <div className="stat-icon">
//                                                     <FiTrendingUp />
//                                                 </div>
//                                                 <div>
//                                                     <div className="stat-number">
//                                                         {timelineFilteredData.length > 0 ? Math.round((timelineFilteredData.filter(c => c?.lastActive).length / timelineFilteredData.length) * 100) : 0}%
//                                                     </div>
//                                                     <div className="stat-label">Active</div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="col-6 col-md-3 mb-3">
//                                             <div className="stat-card d-flex gap-2">
//                                                 <div className="stat-icon">
//                                                     <FiCalendar />
//                                                 </div>
//                                                 <div>
//                                                     <div className="stat-number">
//                                                         {timelineFilteredData.filter(c => {
//                                                             if (!c?.createdAt) return false;
//                                                             const createdDate = new Date(c.createdAt);
//                                                             const now = new Date();
//                                                             return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
//                                                         }).length}
//                                                     </div>
//                                                     <div className="stat-label">New</div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Mobile Filters Toggle */}
//                                     <div className="d-flex justify-content-between align-items-center mb-3">
//                                         <h6 className="filter-title">
//                                             <FiFilter />
//                                             Filters
//                                         </h6>
//                                         <button
//                                             className="mobile-btn"
//                                             onClick={() => setShowMobileFilters(!showMobileFilters)}
//                                         >
//                                             <FiFilter />
//                                         </button>
//                                     </div>

//                                     {/* Filters Section */}
//                                     <div className={`filter-section ${showMobileFilters ? 'show' : ''}`}>
//                                         <div className="row">
//                                             {/* <div className="col-12 mb-2"> */}
//                                             <div className="col-12 col-lg-3 mb-3">
//                                                 <label className="form-label">Company Size</label>
//                                                 <select
//                                                     className="form-control"
//                                                     value={companySizeFilter}
//                                                     onChange={(e) => setCompanySizeFilter(e.target.value)}
//                                                 >
//                                                     <option value="all">All Sizes</option>
//                                                     {getUniqueCompanySizes().map(size => (
//                                                         <option key={size} value={size}>{size}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                             {/* <div className="col-12 mb-2"> */}
//                                             <div className="col-12 col-lg-3 mb-3">
//                                                 <label className="form-label">Industry</label>
//                                                 <select
//                                                     className="form-control"
//                                                     value={industryFilter}
//                                                     onChange={(e) => setIndustryFilter(e.target.value)}
//                                                 >
//                                                     <option value="all">All Industries</option>
//                                                     {getUniqueIndustries().map(industry => (
//                                                         <option key={industry} value={industry}>{industry}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                             {/* <div className="col-12 mb-2"> */}
//                                             <div className="col-12 col-lg-3 mb-3">
//                                                 <label className="form-label">Verification</label>
//                                                 <select
//                                                     className="form-control"
//                                                     value={verificationFilter}
//                                                     onChange={(e) => setVerificationFilter(e.target.value)}
//                                                 >
//                                                     <option value="all">All Companies</option>
//                                                     <option value="verified">Verified</option>
//                                                     <option value="unverified">Not Verified</option>
//                                                 </select>
//                                             </div>
//                                             {/* <div className="col-12 mb-2"> */}
//                                             <div className="col-12 col-lg-3 mb-3">
//                                                 <label className="form-label">Location</label>
//                                                 <select
//                                                     className="form-control"
//                                                     value={locationFilter}
//                                                     onChange={(e) => setLocationFilter(e.target.value)}
//                                                 >
//                                                     <option value="all">All Locations</option>
//                                                     {getUniqueLocations().map(location => (
//                                                         <option key={location} value={location}>{location}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>
//                                         <div className="d-flex justify-content-between align-items-center mt-3">
//                                             <button
//                                                 className="mobile-btn btn-secondary"
//                                                 onClick={() => {
//                                                     setCompanySizeFilter('all');
//                                                     setIndustryFilter('all');
//                                                     setVerificationFilter('all');
//                                                     setLocationFilter('all');
//                                                 }}
//                                             >
//                                                 <FiRefreshCw />
//                                                 Reset
//                                             </button>
//                                             <span className="filter-info">
//                                                 {timelineFilteredData.length} of {filteredData.length} companies in {getTimelineLabel().toLowerCase()} view
//                                             </span>
//                                         </div>
//                                     </div>

//                                     {/* Charts Row 1 */}
//                                     <div className="row">
//                                         {/* <div className="col-12 mb-3"> */}
//                                         <div className="col-12 col-lg-6 mb-3">
//                                             <div className="chart-card">
//                                                 <h6 className="chart-title">
//                                                     <FiPieChart />
//                                                     Company Size
//                                                     <span className="timeline-indicator">{timelineFilteredData.length}</span>
//                                                 </h6>
//                                                 <div className="chart-container">
//                                                     <div className="chart-wrapper">
//                                                         <Doughnut data={getCompanySizeData()} options={doughnutOptions} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         {/* <div className="col-12 mb-3"> */}
//                                         <div className="col-12 col-lg-6 mb-3">
//                                             <div className="chart-card">
//                                                 <h6 className="chart-title">
//                                                     <FiBarChart />
//                                                     Industry
//                                                     <span className="timeline-indicator">{timelineFilteredData.length}</span>
//                                                 </h6>
//                                                 <div className="chart-container">
//                                                     <div className="chart-wrapper">
//                                                         <Bar data={getIndustryData()} options={chartOptions} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Charts Row 2 */}
//                                     <div className="row">
//                                         {/* <div className="col-12 mb-3"> */}
//                                         <div className="col-12 col-lg-6 mb-3">
//                                             <div className="chart-card">
//                                                 <h6 className="chart-title">
//                                                     <FiGitBranch />
//                                                     Departments
//                                                     <span className="timeline-indicator">{timelineFilteredData.length}</span>
//                                                 </h6>
//                                                 <div className="chart-container">
//                                                     <div className="chart-wrapper">
//                                                         <Bar data={getDepartmentData()} options={{ ...chartOptions, indexAxis: 'y' }} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         {/* <div className="col-12 mb-3"> */}
//                                         <div className="col-12 col-lg-6 mb-3">
//                                             <div className="chart-card">
//                                                 <h6 className="chart-title">
//                                                     <FiTrendingUp />
//                                                     Timeline
//                                                     <span className="timeline-indicator">{timelineFilteredData.length}</span>
//                                                 </h6>
//                                                 <div className="chart-container">
//                                                     <div className="chart-wrapper">
//                                                         <Line data={getTimelineData()} options={chartOptions} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Charts Row 3 */}
//                                     <div className="row">
//                                         {/* <div className="col-12 mb-3"> */}
//                                         <div className="col-12 col-lg-6 mb-3">
//                                             <div className="chart-card">
//                                                 <h6 className="chart-title">
//                                                     <FiMapPin />
//                                                     Locations
//                                                     <span className="timeline-indicator">{timelineFilteredData.length}</span>
//                                                 </h6>
//                                                 <div className="chart-container">
//                                                     <div className="chart-wrapper">
//                                                         <Pie data={getLocationData()} options={doughnutOptions} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         {/* <div className="col-12 mb-3"> */}
//                                         <div className="col-12 col-lg-6 mb-3">
//                                             <div className="chart-card">
//                                                 <h6 className="chart-title">
//                                                     <FiShield />
//                                                     Verification
//                                                     <span className="timeline-indicator">{timelineFilteredData.length}</span>
//                                                 </h6>
//                                                 <div className="chart-container">
//                                                     <div className="chart-wrapper">
//                                                         <PolarArea data={getVerificationData()} options={polarOptions} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Company List and Details */}
//                                     <div className="row">
//                                         {/* <div className="col-12 col-md-6 mb-3"> */}
//                                         <div className="col-12 col-lg-6 mb-3">
//                                             <div className="company-list">
//                                                 <h6 className="chart-title">
//                                                     <FiList />
//                                                     Companies ({timelineFilteredData.length})
//                                                 </h6>
//                                                 <div className="company-details">
//                                                     {timelineFilteredData.map(company => (
//                                                         <div
//                                                             key={company._id}
//                                                             className={`company-item ${selectedCompany && selectedCompany._id === company._id ? 'active' : ''}`}
//                                                             onClick={() => setSelectedCompany(company)}
//                                                         >
//                                                             <div className="d-flex align-items-center">
//                                                                 <img
//                                                                     src={company?.profilePicture || 'https://via.placeholder.com/40'}
//                                                                     className="company-logo"
//                                                                     alt={company?.fullname}
//                                                                 />
//                                                                 <div>
//                                                                     <div className="company-name">{company?.fullname || 'Unknown Company'}</div>
//                                                                     <div className="company-industry">{company?.industry || 'Unknown Industry'}</div>
//                                                                     <div className="company-size">{company?.companySize || 'Unknown Size'}</div>
//                                                                     {company?.isVerified && (
//                                                                         <span className="badge badge-success">Verified</span>
//                                                                     )}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         {/* <div className="col-12 col-md-6 mb-3"> */}
//                                         <div className="col-12 col-lg-6 mb-3">
//                                             <div className="company-details">
//                                                 {selectedCompany ? (
//                                                     <div>
//                                                         <div className="d-flex align-items-center gap-3 mb-3">
//                                                             <img
//                                                                 src={selectedCompany?.profilePicture || 'https://via.placeholder.com/60'}
//                                                                 style={{ width: '60px', height: '60px', borderRadius: '12px' }}
//                                                                 alt={selectedCompany?.fullname}
//                                                             />
//                                                             <div className="ml-3">
//                                                                 <h4>{selectedCompany?.fullname || 'Unknown Company'}</h4>
//                                                                 <p className="text-muted mb-2">{selectedCompany?.tagline || 'No tagline available'}</p>
//                                                                 <p className="text-muted mb-0">{selectedCompany?.industry || 'Unknown Industry'}</p>
//                                                                 {selectedCompany?.isVerified && (
//                                                                     <span className="badge badge-success">Verified</span>
//                                                                 )}
//                                                             </div>
//                                                         </div>

//                                                         <div className="row">
//                                                             <div className="col-12 mb-3">
//                                                                 <h6>Basic Information</h6>
//                                                                 <table className="table">
//                                                                     <tbody>
//                                                                         <tr>
//                                                                             <td>Company Size</td>
//                                                                             <td>{selectedCompany?.companySize || 'Not specified'}</td>
//                                                                         </tr>
//                                                                         <tr>
//                                                                             <td>Headquarters</td>
//                                                                             <td>{selectedCompany?.headquarters || 'Not specified'}</td>
//                                                                         </tr>
//                                                                         <tr>
//                                                                             <td>Website</td>
//                                                                             <td>
//                                                                                 {selectedCompany?.website ? (
//                                                                                     <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
//                                                                                         {selectedCompany.website}
//                                                                                     </a>
//                                                                                 ) : 'Not specified'}
//                                                                             </td>
//                                                                         </tr>
//                                                                         <tr>
//                                                                             <td>Email</td>
//                                                                             <td>{selectedCompany?.email || 'Not specified'}</td>
//                                                                         </tr>
//                                                                         <tr>
//                                                                             <td>Phone</td>
//                                                                             <td>{selectedCompany?.contactPhone || 'Not specified'}</td>
//                                                                         </tr>
//                                                                     </tbody>
//                                                                 </table>
//                                                             </div>
//                                                             <div className="col-12 mb-3">
//                                                                 <h6>Leadership</h6>
//                                                                 <table className="table">
//                                                                     <tbody>
//                                                                         <tr>
//                                                                             <td>CEO</td>
//                                                                             <td>{selectedCompany?.ceo?.ceoName || 'Not specified'}</td>
//                                                                         </tr>
//                                                                         <tr>
//                                                                             <td>CEO Since</td>
//                                                                             <td>{selectedCompany?.ceo?.since || 'Not specified'}</td>
//                                                                         </tr>
//                                                                         <tr>
//                                                                             <td>Founder</td>
//                                                                             <td>{selectedCompany?.founder?.founderName || 'Not specified'}</td>
//                                                                         </tr>
//                                                                         <tr>
//                                                                             <td>Founder Role</td>
//                                                                             <td>{selectedCompany?.founder?.currentRole || 'Not specified'}</td>
//                                                                         </tr>
//                                                                     </tbody>
//                                                                 </table>
//                                                             </div>
//                                                         </div>

//                                                         <div className="mt-3">
//                                                             <h6>About</h6>
//                                                             <p>{selectedCompany?.about || 'No description available'}</p>
//                                                         </div>

//                                                         {selectedCompany?.departments && selectedCompany.departments.length > 0 && (
//                                                             <div className="mt-3">
//                                                                 <h6>Departments</h6>
//                                                                 <div>
//                                                                     {selectedCompany.departments.map((dept, index) => (
//                                                                         <span key={index} className="badge badge-info mr-2 mb-2">{dept?.value || 'N/A'}</span>
//                                                                     ))}
//                                                                 </div>
//                                                             </div>
//                                                         )}

//                                                         {selectedCompany?.locations && selectedCompany.locations.length > 0 && (
//                                                             <div className="mt-3">
//                                                                 <h6>Locations</h6>
//                                                                 <div>
//                                                                     {selectedCompany.locations.map((loc, index) => (
//                                                                         <span key={index} className="badge badge-secondary mr-2 mb-2">
//                                                                             {loc?.city || 'N/A'}, {loc?.country || 'N/A'}
//                                                                         </span>
//                                                                     ))}
//                                                                 </div>
//                                                             </div>
//                                                         )}

//                                                         {selectedCompany?.socialMedia && (
//                                                             <div className="mt-3">
//                                                                 <h6>Social Media</h6>
//                                                                 <div className="social-links">
//                                                                     {selectedCompany.socialMedia?.linkedin && (
//                                                                         <a href={`https://${selectedCompany.socialMedia.linkedin}`} target="_blank" rel="noopener noreferrer">
//                                                                             <FiLinkedin />
//                                                                         </a>
//                                                                     )}
//                                                                     {selectedCompany.socialMedia?.twitter && (
//                                                                         <a href={`https://${selectedCompany.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer">
//                                                                             <FiTwitter />
//                                                                         </a>
//                                                                     )}
//                                                                     {selectedCompany.socialMedia?.facebook && (
//                                                                         <a href={`https://${selectedCompany.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer">
//                                                                             <FiFacebook />
//                                                                         </a>
//                                                                     )}
//                                                                 </div>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 ) : (
//                                                     <div className="empty-state">
//                                                         {/* <FiBuilding /> */}
//                                                         <BsBuilding />
//                                                         <h5>Select a Company</h5>
//                                                         <p>Choose a company from list to view details</p>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </>
//                             )}
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </>
//     );

// }

// export default SuperAdminCompanyStats;