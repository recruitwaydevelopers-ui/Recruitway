import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import { useCompanyContext } from '../../../context/company-context';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';

const COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'];

const JobDashboard = () => {
    const { getAllJobs, isLoading, jobList } = useCompanyContext();

    useEffect(() => {
        getAllJobs();
    }, []);

    const [filters, setFilters] = useState({
        isFlagged: '',
        skill: '',
        title: '',
        status: '',
        type: '',
        startDate: '',
        endDate: ''
    });

    const [selectedJobs, setSelectedJobs] = useState([]);

    const uniqueSkills = useMemo(() => {
        const skillSet = new Set();
        jobList.forEach(job => {
            if (job.skills && Array.isArray(job.skills)) {
                job.skills.forEach(skill => skillSet.add(skill));
            }
        });
        return [...skillSet];
    }, [jobList]);

    const uniqueTitles = useMemo(() => [...new Set(jobList.map(job => job.title || '').filter(Boolean))], [jobList]);
    const uniqueTypes = useMemo(() => [...new Set(jobList.map(job => job.type || '').filter(Boolean))], [jobList]);

    const dateFilteredData = useMemo(() => {
        return jobList.filter(job => {
            const jobDate = new Date(job.posted);
            if (isNaN(jobDate.getTime())) return false;

            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            if (startDate && isNaN(startDate.getTime())) return false;
            if (endDate && isNaN(endDate.getTime())) return false;

            if (startDate && endDate) return jobDate >= startDate && jobDate <= endDate;
            if (startDate) return jobDate >= startDate;
            if (endDate) return jobDate <= endDate;
            return true;
        });
    }, [filters.startDate, filters.endDate, jobList]);

    const filterBy = (field, value, data) => {
        if (!value) return data;

        return data.filter(job => {
            if (field === 'isFlagged') return job.isFlagged?.toString() === value;
            if (field === 'skill') return job.skills?.includes(value);
            if (field === 'title') return job.title === value;
            if (field === 'status') return job.status === value;
            if (field === 'type') return job.type === value;
            return true;
        });
    };

    const generateChartData = (field, data) => {
        const count = {};
        data.forEach(job => {
            if (field === 'skill') {
                job.skills?.forEach(skill => {
                    count[skill] = (count[skill] || 0) + 1;
                });
            } else {
                const key = job[field];
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

        data.forEach(job => {
            if (!job.posted) return;

            const date = new Date(job.posted);
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
            label: 'Flagged Status',
            field: 'isFlagged',
            value: filters.isFlagged,
            chartType: 'pie',
            options: [
                { value: '', label: 'All' },
                { value: 'true', label: 'Flagged' },
                { value: 'false', label: 'Not Flagged' }
            ]
        },
        {
            label: 'Skills',
            field: 'skill',
            value: filters.skill,
            chartType: 'radar',
            options: [{ value: '', label: 'All Skills' }, ...uniqueSkills.map(skill => ({ value: skill, label: skill }))]
        },
        {
            label: 'Job Titles',
            field: 'title',
            value: filters.title,
            chartType: 'bar',
            options: [{ value: '', label: 'All Titles' }, ...uniqueTitles.map(title => ({ value: title, label: title }))]
        },
        {
            label: 'Job Status',
            field: 'status',
            value: filters.status,
            chartType: 'pie',
            options: [
                { value: '', label: 'All Statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Draft', label: 'Draft' }
            ]
        },
        {
            label: 'Job Types',
            field: 'type',
            value: filters.type,
            chartType: 'pie',
            options: [{ value: '', label: 'All Types' }, ...uniqueTypes.map(type => ({ value: type, label: type }))]
        },
        {
            label: 'Job Postings Over Time',
            field: 'posted',
            value: '',
            chartType: 'area',
            options: []
        }
    ];

    const exportPDF = () => {
        if (!selectedJobs.length) return;

        const doc = new jsPDF();
        doc.text('Job List Report', 14, 16);

        autoTable(doc, {
            head: [['Title', 'Type', 'Status', 'Flagged', 'Posted']],
            body: selectedJobs.map(job => [
                job.title || 'N/A',
                job.type || 'N/A',
                job.status || 'N/A',
                job.isFlagged ? 'Yes' : 'No',
                job.posted ? new Date(job.posted).toLocaleDateString() : 'N/A'
            ])
        });
        doc.save('job-report.pdf');
    };

    const csvData = selectedJobs.map(job => ({
        Title: job.title || '',
        Type: job.type || '',
        Status: job.status || '',
        Flagged: job.isFlagged ? 'Yes' : 'No',
        Posted: job.posted ? new Date(job.posted).toLocaleDateString() : ''
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
                                    setSelectedJobs(filterBy(field, chartData[index].name, dateFilteredData));
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
                            name="Skills"
                            dataKey="count"
                            stroke="#4e73df"
                            fill="#4e73df"
                            fillOpacity={0.6}
                            onClick={(data) => {
                                if (data?.activeLabel) {
                                    setSelectedJobs(filterBy(field, data.activeLabel, dateFilteredData));
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
                            formatter={(value) => [`${value} postings`]}
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
                                setSelectedJobs(filterBy(field, data.activeLabel, dateFilteredData));
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

    if (!jobList.length) return (
        <div className="card shadow">
            <div className="card-body text-center py-5">
                <i className="fas fa-folder-open fa-3x text-gray-300 mb-3"></i>
                <h5 className="text-gray-800">No job data available</h5>
                <p className="text-muted">There are currently no jobs to display</p>
            </div>
        </div>
    );

    if (jobList.length === 0) return (
        <div className="card shadow">
            <div className="card-body text-center py-5">
                <i className="fas fa-folder-open fa-3x text-gray-300 mb-3"></i>
                <h5 className="text-gray-800">No job data available</h5>
                <p className="text-muted">There are currently no jobs to display</p>
            </div>
        </div>
    );

    return (
        <div className="container-fluid px-4">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Job Analytics Dashboard</h1>
                <div>
                    <CSVLink
                        data={csvData}
                        filename="job-export.csv"
                        className="btn btn-sm btn-success shadow-sm me-2"
                    >
                        <i className="fas fa-file-csv me-1"></i> Export CSV
                    </CSVLink>
                    <button
                        className="btn btn-sm btn-danger shadow-sm"
                        onClick={exportPDF}
                        disabled={!selectedJobs.length}
                        title={!selectedJobs.length ? "Select jobs by clicking on chart elements" : ""}
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
                                    <>Showing jobs from <strong>{filters.startDate || 'earliest'}</strong> to <strong>{filters.endDate || 'latest'}</strong></>
                                ) : 'Showing all dates'}
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {chartConfigs.map(({ label, field, value, chartType, options }) => {
                    const dataSubset = value ? filterBy(field, value, dateFilteredData) : dateFilteredData;
                    const chartData = field === 'posted' ? generateTimeSeriesData(dataSubset) : generateChartData(field, dataSubset);
                    const filteredCount = dataSubset.length;

                    return (
                        <div className="col-xl-6 mb-4" key={field}>
                            <div className="card shadow h-100">
                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
                                    <h6 className="m-0 font-weight-bold text-primary">{label}</h6>
                                    <span className="badge bg-primary rounded-pill">{filteredCount} {filteredCount === 1 ? 'job' : 'jobs'}</span>
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

            {selectedJobs.length > 0 && (
                <div className="card shadow mb-4 mt-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
                        <h6 className="m-0 font-weight-bold text-primary">Selected Jobs ({selectedJobs.length})</h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover table-sm">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Title</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Flagged</th>
                                        <th>Posted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedJobs.slice(0, 5).map((job, index) => (
                                        <tr key={index}>
                                            <td>{job.title || 'N/A'}</td>
                                            <td>{job.type || 'N/A'}</td>
                                            <td>
                                                <span className={`badge ${job.status === 'Active' ? 'bg-success' : job.status === 'Inactive' ? 'bg-secondary' : 'bg-warning'}`}>
                                                    {job.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                {job.isFlagged ? (
                                                    <span className="badge bg-danger">Yes</span>
                                                ) : (
                                                    <span className="badge bg-success">No</span>
                                                )}
                                            </td>
                                            <td>{job.posted ? new Date(job.posted).toLocaleDateString() : 'N/A'}</td>
                                        </tr>
                                    ))}
                                    {selectedJobs.length > 5 && (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted">
                                                + {selectedJobs.length - 5} more jobs
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

export default JobDashboard;
