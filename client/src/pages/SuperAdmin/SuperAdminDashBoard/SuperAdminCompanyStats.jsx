import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import { useSuperAdminContext } from '../../../context/superadmin-context';

const COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'];

const SuperAdminCompanyStats = () => {

    const { isLoading, companies: companyList, getAllCompaniesWithVerificationStatus } = useSuperAdminContext()

    useEffect(() => {
        getAllCompaniesWithVerificationStatus()
    }, [])

    const [filters, setFilters] = useState({
        isVerified: '',
        industry: '',
        companySize: '',
        location: '',
        startDate: '',
        endDate: ''
    });    

    const [selectedCompanies, setSelectedCompanies] = useState([]);

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
            options: [{ value: '', label: 'All Industries' }, ...uniqueIndustries.map(ind => ({ value: ind, label: ind }))]
        },
        {
            label: 'Company Sizes',
            field: 'companySize',
            value: filters.companySize,
            chartType: 'pie',
            options: [{ value: '', label: 'All Sizes' }, ...uniqueCompanySizes.map(size => ({ value: size, label: size }))]
        },
        {
            label: 'Locations',
            field: 'location',
            value: filters.location,
            chartType: 'radar',
            options: [{ value: '', label: 'All Locations' }, ...uniqueLocations.map(loc => ({ value: loc, label: loc }))]
        },
        {
            label: 'Company Registrations Over Time',
            field: 'createdAt',
            value: '',
            chartType: 'area',
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

    const renderChart = (chartData, chartType, field) => {
        if (!chartData.length) {
            return (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                    <p className="text-muted">No data available</p>
                </div>
            );
        }

        switch (chartType) {
            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
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
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name, props) => [`${value} (${props.payload.percent}%)`, name]}
                            contentStyle={{
                                borderRadius: '0.35rem',
                                border: '1px solid #e3e6f0',
                                backgroundColor: '#fff',
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        />
                        <Legend
                            wrapperStyle={{
                                paddingTop: '20px'
                            }}
                        />
                    </PieChart>
                );
            case 'radar':
                return (
                    <RadarChart outerRadius="80%" width={400} height={300} data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
                        <Radar
                            name="Locations"
                            dataKey="count"
                            stroke="#4e73df"
                            fill="#4e73df"
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
                                borderRadius: '0.35rem',
                                border: '1px solid #e3e6f0',
                                backgroundColor: '#fff'
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
                                <stop offset="5%" stopColor="#4e73df" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#4e73df" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fc" />
                        <Tooltip
                            labelFormatter={(date) => `Date: ${new Date(date).toLocaleDateString()}`}
                            formatter={(value) => [`${value} registrations`]}
                            contentStyle={{
                                borderRadius: '0.35rem',
                                border: '1px solid #e3e6f0',
                                backgroundColor: '#fff'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#4e73df"
                            fillOpacity={1}
                            fill="url(#colorCount)"
                            activeDot={{ r: 8 }}
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fc" />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#5a5c69' }}
                        />
                        <YAxis
                            tick={{ fill: '#5a5c69' }}
                        />
                        <Tooltip
                            formatter={(value) => [`${value} (${chartData.find(item => item.count === value)?.percent || '0'}%)`]}
                            contentStyle={{
                                borderRadius: '0.35rem',
                                border: '1px solid #e3e6f0',
                                backgroundColor: '#fff'
                            }}
                        />
                        <Legend
                            wrapperStyle={{
                                paddingTop: '20px'
                            }}
                        />
                        <Bar
                            dataKey="count"
                            fill="#4e73df"
                            radius={[4, 4, 0, 0]}
                            label={{
                                position: 'top',
                                fill: '#5a5c69',
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
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (!companyList.length) return (
        <div className="card shadow">
            <div className="card-body text-center py-5">
                <i className="fas fa-folder-open fa-3x text-gray-300 mb-3"></i>
                <h5 className="text-gray-800">No company data available</h5>
                <p className="text-muted">There are currently no companies to display</p>
            </div>
        </div>
    );

    return (
        <div className="container-fluid px-4">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Company Analytics Dashboard</h1>
                <div>
                    <CSVLink
                        data={csvData}
                        filename="company-export.csv"
                        className="btn btn-sm btn-success shadow-sm me-2"
                    >
                        <i className="fas fa-file-csv me-1"></i> Export CSV
                    </CSVLink>
                    <button
                        className="btn btn-sm btn-danger shadow-sm"
                        onClick={exportPDF}
                        disabled={!selectedCompanies.length}
                        title={!selectedCompanies.length ? "Select companies by clicking on chart elements" : ""}
                    >
                        <i className="fas fa-file-pdf me-1"></i> Export PDF
                    </button>
                </div>
            </div>

            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-primary text-white">
                    <h6 className="m-0 font-weight-bold text-light">Date Range Filter</h6>
                </div>
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label small text-gray-600 fw-bold">From Date</label>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleDateChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small text-gray-600 fw-bold">To Date</label>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleDateChange}
                            />
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

            <div className="row">
                {chartConfigs.map(({ label, field, value, chartType, options }) => {
                    const dataSubset = value ? filterBy(field, value, dateFilteredData) : dateFilteredData;
                    const chartData = field === 'createdAt' ? generateTimeSeriesData(dataSubset) : generateChartData(field, dataSubset);
                    const filteredCount = dataSubset.length;

                    return (
                        <div className="col-xl-6 mb-4" key={field}>
                            <div className="card shadow h-100">
                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
                                    <h6 className="m-0 font-weight-bold text-primary">{label}</h6>
                                    <span className="badge bg-primary rounded-pill">{filteredCount} {filteredCount === 1 ? 'company' : 'companies'}</span>
                                </div>
                                <div className="card-body">
                                    <div className="row flex-column">
                                        <div className="">
                                            {options.length > 0 && (
                                                <>
                                                    <label className="form-label small text-gray-600 fw-bold mb-2">Filter by {label.toLowerCase()}</label>
                                                    <div className='d-flex w-100'>
                                                        <select
                                                            className="form-select form-select-sm mb-2"
                                                            value={value}
                                                            onChange={e => setFilters({ ...filters, [field]: e.target.value })}
                                                        >
                                                            {options.map(option => (
                                                                <option key={option.value} value={option.value}>{option.label}</option>
                                                            ))}
                                                        </select>
                                                        {value && (
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary w-100 mb-2"
                                                                onClick={() => setFilters({ ...filters, [field]: '' })}
                                                            >
                                                                <i className="fas fa-times me-1"></i> Clear Filter
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="col-md-12">
                                            <div style={{ height: '300px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    {renderChart(chartData, chartType, field)}
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

            {selectedCompanies.length > 0 && (
                <div className="card shadow mb-4 mt-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
                        <h6 className="m-0 font-weight-bold text-primary">Selected Companies ({selectedCompanies.length})</h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover table-sm">
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
                                            <td>{company.fullname || 'N/A'}</td>
                                            <td>{company.industry || 'N/A'}</td>
                                            <td>{company.companySize || 'N/A'}</td>
                                            <td>
                                                {company.isVerified ? (
                                                    <span className="badge bg-success">Yes</span>
                                                ) : (
                                                    <span className="badge bg-secondary">No</span>
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












// import { useEffect, useMemo, useState, useCallback } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { CSVLink } from 'react-csv';
// import { debounce } from 'lodash';
// import { useSuperAdminContext } from '../../../context/superadmin-context';

// const COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'];
// const BATCH_SIZE = 1000; // Number of items to process at once
// const MAX_DISPLAY_COMPANIES = 100; // Max companies to show in table
// const CHART_SAMPLE_SIZE = 5000; // Sample size for charts when data is too large

// const SuperAdminCompanyStats = () => {
//     const { isLoading, companies: companyList, getAllCompaniesWithVerificationStatus, getPaginatedCompanies } = useSuperAdminContext()
//     const [displayedCompanies, setDisplayedCompanies] = useState([]);
//     const [totalCompanies, setTotalCompanies] = useState(0);

//     // Load initial data
//     useEffect(() => {
//         // For large datasets, we'll use paginated loading
//         if (companyList.length > 10000) {
//             getPaginatedCompanies(1, BATCH_SIZE).then(data => {
//                 setDisplayedCompanies(data.companies);
//                 setTotalCompanies(data.totalCount);
//             });
//         } else {
//             getAllCompaniesWithVerificationStatus();
//             setTotalCompanies(companyList.length);
//         }
//     }, []);

//     console.log(companyList);


//     const [filters, setFilters] = useState({
//         isVerified: '',
//         industry: '',
//         companySize: '',
//         location: '',
//         startDate: '',
//         endDate: '',
//         searchQuery: ''
//     });

//     const [selectedCompanies, setSelectedCompanies] = useState([]);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [uniqueValues, setUniqueValues] = useState({
//         industries: [],
//         companySizes: [],
//         locations: []
//     });

//     // Debounced filter handler
//     const handleFilterChange = useCallback(debounce((name, value) => {
//         setFilters(prev => ({ ...prev, [name]: value }));
//     }, 300));

//     // Calculate unique values efficiently (memoized and batched)
//     useEffect(() => {
//         if (companyList.length === 0) return;

//         setIsProcessing(true);

//         // Process in batches to avoid UI freeze
//         const processBatch = (batch) => {
//             const industries = new Set();
//             const sizes = new Set();
//             const locations = new Set();

//             batch.forEach(company => {
//                 if (company.industry) industries.add(company.industry);
//                 if (company.companySize) sizes.add(company.companySize);
//                 if (company.locations?.length) {
//                     company.locations.forEach(loc => {
//                         if (loc.city && loc.country) {
//                             locations.add(`${loc.city}, ${loc.country}`);
//                         }
//                     });
//                 }
//             });

//             return { industries, sizes, locations };
//         };

//         // For very large datasets, we'll sample instead of processing everything
//         const sampleSize = Math.min(companyList.length, CHART_SAMPLE_SIZE);
//         const sampleStep = Math.floor(companyList.length / sampleSize);
//         let batchResults = { industries: new Set(), sizes: new Set(), locations: new Set() };

//         for (let i = 0; i < companyList.length; i += sampleStep) {
//             const batch = companyList.slice(i, i + sampleStep);
//             const batchResult = processBatch(batch);
//             batchResult.industries.forEach(v => batchResults.industries.add(v));
//             batchResult.sizes.forEach(v => batchResults.sizes.add(v));
//             batchResult.locations.forEach(v => batchResults.locations.add(v));
//         }

//         setUniqueValues({
//             industries: Array.from(batchResults.industries),
//             companySizes: Array.from(batchResults.sizes),
//             locations: Array.from(batchResults.locations)
//         });

//         setIsProcessing(false);
//     }, [companyList]);

//     // Efficient date filtering with memoization
//     const dateFilteredData = useMemo(() => {
//         if (!filters.startDate && !filters.endDate) return displayedCompanies;

//         return displayedCompanies.filter(company => {
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
//     }, [filters.startDate, filters.endDate, displayedCompanies]);

//     // Efficient filtering with memoization
//     const filteredData = useMemo(() => {
//         let result = dateFilteredData;

//         if (filters.isVerified) {
//             result = result.filter(company => company.isVerified?.toString() === filters.isVerified);
//         }
//         if (filters.industry) {
//             result = result.filter(company => company.industry === filters.industry);
//         }
//         if (filters.companySize) {
//             result = result.filter(company => company.companySize === filters.companySize);
//         }
//         if (filters.location) {
//             result = result.filter(company =>
//                 company.locations?.some(loc =>
//                     `${loc.city}, ${loc.country}` === filters.location
//                 )
//             );
//         }
//         if (filters.searchQuery) {
//             const query = filters.searchQuery.toLowerCase();
//             result = result.filter(company =>
//                 company.fullname?.toLowerCase().includes(query) ||
//                 company.industry?.toLowerCase().includes(query) ||
//                 company.tagline?.toLowerCase().includes(query)
//             );
//         }

//         return result;
//     }, [dateFilteredData, filters]);

//     // Efficient chart data generation with sampling
//     const generateChartData = useCallback((field, data) => {
//         const count = {};
//         const sampleSize = Math.min(data.length, CHART_SAMPLE_SIZE);
//         const sampleStep = Math.floor(data.length / sampleSize);

//         for (let i = 0; i < data.length; i += sampleStep) {
//             const company = data[i];

//             if (field === 'location') {
//                 company.locations?.forEach(loc => {
//                     const key = `${loc.city}, ${loc.country}`;
//                     count[key] = (count[key] || 0) + 1;
//                 });
//             } else {
//                 const key = company[field];
//                 if (key) count[key] = (count[key] || 0) + 1;
//             }
//         }

//         const total = Object.values(count).reduce((sum, val) => sum + val, 0);
//         return Object.entries(count)
//             .map(([key, value]) => ({
//                 name: key,
//                 count: value,
//                 percent: total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
//             }))
//             .sort((a, b) => b.count - a.count); // Sort by count descending
//     }, []);

//     // Time series data with date bucketing for large datasets
//     const generateTimeSeriesData = useCallback((data) => {
//         const dateCounts = {};
//         const sampleSize = Math.min(data.length, CHART_SAMPLE_SIZE);
//         const sampleStep = Math.floor(data.length / sampleSize);

//         for (let i = 0; i < data.length; i += sampleStep) {
//             const company = data[i];
//             if (!company.createdAt) continue;

//             const date = new Date(company.createdAt);
//             if (isNaN(date.getTime())) continue;

//             // Bucket by month for large datasets
//             const dateStr = data.length > 10000
//                 ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
//                 : date.toISOString().split('T')[0];

//             dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
//         }

//         return Object.entries(dateCounts)
//             .map(([date, count]) => ({ date, count }))
//             .sort((a, b) => new Date(a.date) - new Date(b.date));
//     }, []);

//     // Chart configurations
//     const chartConfigs = useMemo(() => [
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
//             label: 'Top Industries',
//             field: 'industry',
//             value: filters.industry,
//             chartType: 'bar',
//             options: [
//                 { value: '', label: 'All Industries' },
//                 ...uniqueValues.industries.map(ind => ({ value: ind, label: ind }))
//             ]
//         },
//         {
//             label: 'Company Sizes',
//             field: 'companySize',
//             value: filters.companySize,
//             chartType: 'pie',
//             options: [
//                 { value: '', label: 'All Sizes' },
//                 ...uniqueValues.companySizes.map(size => ({ value: size, label: size }))
//             ]
//         },
//         {
//             label: 'Top Locations',
//             field: 'location',
//             value: filters.location,
//             chartType: 'radar',
//             options: [
//                 { value: '', label: 'All Locations' },
//                 ...uniqueValues.locations.map(loc => ({ value: loc, label: loc }))
//             ]
//         },
//         {
//             label: 'Company Registrations',
//             field: 'createdAt',
//             value: '',
//             chartType: 'area',
//             options: []
//         }
//     ], [filters, uniqueValues]);

//     // Optimized PDF export with pagination if needed
//     const exportPDF = async () => {
//         if (!selectedCompanies.length) return;

//         const doc = new jsPDF();
//         doc.text('Company List Report', 14, 16);

//         // For large selections, we'll export only the first 1000
//         const exportData = selectedCompanies.slice(0, 1000);

//         autoTable(doc, {
//             head: [['Name', 'Industry', 'Size', 'Verified', 'Created']],
//             body: exportData.map(company => [
//                 company.fullname?.substring(0, 50) || 'N/A', // Truncate long names
//                 company.industry?.substring(0, 30) || 'N/A',
//                 company.companySize || 'N/A',
//                 company.isVerified ? 'Yes' : 'No',
//                 company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'
//             ]),
//             styles: { fontSize: 8 }, // Smaller font for more data
//             margin: { top: 20 }
//         });

//         if (selectedCompanies.length > 1000) {
//             doc.addPage();
//             doc.text('Note: Only first 1000 companies shown', 14, 10);
//             doc.text(`Total companies selected: ${selectedCompanies.length}`, 14, 20);
//         }

//         doc.save('company-report.pdf');
//     };

//     // Optimized CSV data
//     const csvData = useMemo(() =>
//         selectedCompanies.slice(0, 10000).map(company => ({
//             Name: company.fullname || '',
//             Industry: company.industry || '',
//             Size: company.companySize || '',
//             Verified: company.isVerified ? 'Yes' : 'No',
//             Created: company.createdAt ? new Date(company.createdAt).toLocaleDateString() : '',
//             Headquarters: company.headquarters || '',
//             Website: company.website || ''
//         }))
//         , [selectedCompanies]);

//     // Render chart with performance optimizations
//     const renderChart = useCallback((chartData, chartType, field) => {
//         if (!chartData.length) {
//             return (
//                 <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
//                     <p className="text-muted">No data available</p>
//                 </div>
//             );
//         }

//         // Limit data points for better performance
//         const displayData = chartData.length > 50
//             ? [...chartData].sort((a, b) => b.count - a.count).slice(0, 50)
//             : chartData;

//         switch (chartType) {
//             case 'pie':
//                 return (
//                     <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                             <Pie
//                                 data={displayData}
//                                 cx="50%"
//                                 cy="50%"
//                                 outerRadius={80}
//                                 fill="#8884d8"
//                                 dataKey="count"
//                                 nameKey="name"
//                                 label={({ name, percent }) => `${name}: ${percent}%`}
//                                 onClick={(_, index) => {
//                                     if (displayData[index]) {
//                                         setSelectedCompanies(prev => [
//                                             ...new Set([...prev, ...filterBy(field, displayData[index].name, filteredData)])]
//                                         );
//                                     }
//                                 }}
//                             >
//                                 {displayData.map((entry, index) => (
//                                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                 ))}
//                             </Pie>
//                             <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percent}%)`, name]} />
//                             <Legend />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 );
//             case 'radar':
//                 return (
//                     <ResponsiveContainer width="100%" height="100%">
//                         <RadarChart outerRadius="80%" data={displayData}>
//                             <PolarGrid />
//                             <PolarAngleAxis dataKey="name" />
//                             <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
//                             <Radar
//                                 name="Locations"
//                                 dataKey="count"
//                                 stroke="#4e73df"
//                                 fill="#4e73df"
//                                 fillOpacity={0.6}
//                                 onClick={(data) => {
//                                     if (data?.activeLabel) {
//                                         setSelectedCompanies(prev => [
//                                             ...new Set([...prev, ...filterBy(field, data.activeLabel, filteredData)])]
//                                         );
//                                     }
//                                 }}
//                             />
//                             <Tooltip />
//                             <Legend />
//                         </RadarChart>
//                     </ResponsiveContainer>
//                 );
//             case 'area':
//                 return (
//                     <ResponsiveContainer width="100%" height="100%">
//                         <AreaChart data={displayData}>
//                             <defs>
//                                 <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
//                                     <stop offset="5%" stopColor="#4e73df" stopOpacity={0.8} />
//                                     <stop offset="95%" stopColor="#4e73df" stopOpacity={0} />
//                                 </linearGradient>
//                             </defs>
//                             <XAxis
//                                 dataKey="date"
//                                 tickFormatter={(date) =>
//                                     new Date(date).toLocaleDateString('en-US', {
//                                         year: displayData.length > 24 ? '2-digit' : undefined,
//                                         month: 'short',
//                                         day: displayData.length <= 24 ? 'numeric' : undefined
//                                     })
//                                 }
//                             />
//                             <YAxis />
//                             <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fc" />
//                             <Tooltip
//                                 labelFormatter={(date) => `Date: ${new Date(date).toLocaleDateString()}`}
//                                 formatter={(value) => [`${value} registrations`]}
//                             />
//                             <Area
//                                 type="monotone"
//                                 dataKey="count"
//                                 stroke="#4e73df"
//                                 fillOpacity={1}
//                                 fill="url(#colorCount)"
//                             />
//                         </AreaChart>
//                     </ResponsiveContainer>
//                 );
//             default: // bar chart
//                 return (
//                     <ResponsiveContainer width="100%" height="100%">
//                         <BarChart data={displayData}>
//                             <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fc" />
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip
//                                 formatter={(value) => [`${value} (${displayData.find(item => item.count === value)?.percent || '0'}%)`]}
//                             />
//                             <Legend />
//                             <Bar
//                                 dataKey="count"
//                                 fill="#4e73df"
//                                 radius={[4, 4, 0, 0]}
//                                 onClick={(data) => {
//                                     if (data?.activeLabel) {
//                                         setSelectedCompanies(prev => [
//                                             ...new Set([...prev, ...filterBy(field, data.activeLabel, filteredData)])]
//                                         );
//                                     }
//                                 }}
//                             />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 );
//         }
//     }, [filteredData]);

//     const resetDateRange = () => {
//         setFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
//     };

//     if (isLoading || isProcessing) {
//         return (
//             <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <div className="ms-3">Processing {totalCompanies.toLocaleString()} companies...</div>
//             </div>
//         );
//     }

//     if (!displayedCompanies.length) {
//         return (
//             <div className="card shadow">
//                 <div className="card-body text-center py-5">
//                     <i className="fas fa-folder-open fa-3x text-gray-300 mb-3"></i>
//                     <h5 className="text-gray-800">No company data available</h5>
//                     <p className="text-muted">There are currently no companies to display</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container-fluid px-4">
//             <div className="d-sm-flex align-items-center justify-content-between mb-4">
//                 <h1 className="h3 mb-0 text-gray-800">
//                     Company Analytics Dashboard
//                     <small className="text-muted ms-2">{totalCompanies.toLocaleString()} companies</small>
//                 </h1>
//                 <div>
//                     <CSVLink
//                         data={csvData}
//                         filename="company-export.csv"
//                         className="btn btn-sm btn-success shadow-sm me-2"
//                         asyncOnClick={true}
//                         onClick={() => {
//                             if (selectedCompanies.length > 10000) {
//                                 alert('Note: Only the first 10,000 companies will be exported');
//                             }
//                             return true;
//                         }}
//                     >
//                         <i className="fas fa-file-csv me-1"></i> Export CSV
//                     </CSVLink>
//                     <button
//                         className="btn btn-sm btn-danger shadow-sm"
//                         onClick={exportPDF}
//                         disabled={!selectedCompanies.length}
//                         title={!selectedCompanies.length ? "Select companies by clicking on chart elements" : ""}
//                     >
//                         <i className="fas fa-file-pdf me-1"></i> Export PDF
//                     </button>
//                 </div>
//             </div>

//             {/* Search and Filters */}
//             <div className="card shadow mb-4">
//                 <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-primary text-white">
//                     <h6 className="m-0 font-weight-bold text-light">Filters</h6>
//                 </div>
//                 <div className="card-body">
//                     <div className="row g-3">
//                         <div className="col-md-6">
//                             <label className="form-label small text-gray-600 fw-bold">Search Companies</label>
//                             <input
//                                 type="text"
//                                 className="form-control form-control-sm"
//                                 placeholder="Search by name, industry, etc."
//                                 onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
//                             />
//                         </div>
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">From Date</label>
//                             <input
//                                 type="date"
//                                 className="form-control form-control-sm"
//                                 name="startDate"
//                                 value={filters.startDate}
//                                 onChange={(e) => handleFilterChange('startDate', e.target.value)}
//                             />
//                         </div>
//                         <div className="col-md-3">
//                             <label className="form-label small text-gray-600 fw-bold">To Date</label>
//                             <input
//                                 type="date"
//                                 className="form-control form-control-sm"
//                                 name="endDate"
//                                 value={filters.endDate}
//                                 onChange={(e) => handleFilterChange('endDate', e.target.value)}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Charts */}
//             <div className="row">
//                 {chartConfigs.map(({ label, field, value, chartType, options }) => {
//                     const chartData = field === 'createdAt'
//                         ? generateTimeSeriesData(filteredData)
//                         : generateChartData(field, filteredData);

//                     const filteredCount = filteredData.length;

//                     return (
//                         <div className="col-xl-6 mb-4" key={field}>
//                             <div className="card shadow h-100">
//                                 <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
//                                     <h6 className="m-0 font-weight-bold text-primary">{label}</h6>
//                                     <span className="badge bg-primary rounded-pill">
//                                         {filteredCount.toLocaleString()} {filteredCount === 1 ? 'company' : 'companies'}
//                                     </span>
//                                 </div>
//                                 <div className="card-body">
//                                     <div className="row flex-column">
//                                         <div className="">
//                                             {options.length > 0 && (
//                                                 <div className="mb-2">
//                                                     <label className="form-label small text-gray-600 fw-bold mb-1">Filter by {label.toLowerCase()}</label>
//                                                     <select
//                                                         className="form-select form-select-sm"
//                                                         value={value}
//                                                         onChange={e => handleFilterChange(field, e.target.value)}
//                                                     >
//                                                         {options.map(option => (
//                                                             <option key={option.value} value={option.value}>
//                                                                 {option.label}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <div className="col-md-12">
//                                             <div style={{ height: '300px' }}>
//                                                 {renderChart(chartData, chartType, field)}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Selected Companies */}
//             {selectedCompanies.length > 0 && (
//                 <div className="card shadow mb-4 mt-4">
//                     <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
//                         <h6 className="m-0 font-weight-bold text-primary">
//                             Selected Companies ({selectedCompanies.length.toLocaleString()})
//                             <button
//                                 className="btn btn-sm btn-outline-danger ms-2"
//                                 onClick={() => setSelectedCompanies([])}
//                             >
//                                 Clear Selection
//                             </button>
//                         </h6>
//                     </div>
//                     <div className="card-body">
//                         <div className="table-responsive">
//                             <table className="table table-bordered table-hover table-sm">
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
//                                     {selectedCompanies.slice(0, MAX_DISPLAY_COMPANIES).map((company, index) => (
//                                         <tr key={index}>
//                                             <td>{company.fullname || 'N/A'}</td>
//                                             <td>{company.industry || 'N/A'}</td>
//                                             <td>{company.companySize || 'N/A'}</td>
//                                             <td>
//                                                 {company.isVerified ? (
//                                                     <span className="badge bg-success">Yes</span>
//                                                 ) : (
//                                                     <span className="badge bg-secondary">No</span>
//                                                 )}
//                                             </td>
//                                             <td>{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}</td>
//                                         </tr>
//                                     ))}
//                                     {selectedCompanies.length > MAX_DISPLAY_COMPANIES && (
//                                         <tr>
//                                             <td colSpan="5" className="text-center text-muted">
//                                                 + {(selectedCompanies.length - MAX_DISPLAY_COMPANIES).toLocaleString()} more companies
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
