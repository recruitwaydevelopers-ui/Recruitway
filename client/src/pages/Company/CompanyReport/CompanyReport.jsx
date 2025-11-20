import { useEffect, useState } from 'react';
import { FiSearch, FiUser, FiBriefcase, FiCalendar, FiClock, FiAward, FiFileText } from 'react-icons/fi';
import { useCompanyContext } from '../../../context/company-context';
import { useNavigate } from 'react-router-dom';

const CompanyReport = () => {
  const { getAllDoneInterviewsOfCompany, companyInterviews, companyInterviewsWithCV, isLoading } = useCompanyContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('All Positions');
  const [sortOrder, setSortOrder] = useState('newest');
  const [activeTab, setActiveTab] = useState('job'); // 'job' or 'cv'
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1);
  const summariesPerPage = 10;

  // Determine which data to display based on active tab
  const displayData = activeTab === 'job' ? companyInterviews : companyInterviewsWithCV;

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time helper
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    getAllDoneInterviewsOfCompany();
  }, []);

  // Handle summary click
  const handleSummaryClick = async (interviewId) => {
    navigate("/company/detailedReport", { state: { id: interviewId } });
  };

  function getUniqueJobTitles(data) {
    const titles = data.map(item => item.jobTitle);
    return [...new Set(titles)];
  }

  const uniqueJobTitles = getUniqueJobTitles(displayData);

  // Filter and sort data
  const filteredReports = displayData.filter(report => {
    const matchesSearch = report.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.interviewId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition === 'All Positions' ||
      (report.jobTitle === filterPosition);
    return matchesSearch && matchesPosition;
  }).sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.start) - new Date(a.start);
    } else {
      return new Date(a.start) - new Date(b.start);
    }
  });

  // Pagination logic
  const indexOfLastSummary = currentPage * summariesPerPage;
  const indexOfFirstSummary = indexOfLastSummary - summariesPerPage;
  const currentSummaries = filteredReports.slice(indexOfFirstSummary, indexOfLastSummary);
  const totalPages = Math.ceil(filteredReports.length / summariesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h2 className="font-weight-bold mb-1">Interview Reports</h2>
          <p className="text-muted mb-0">
            {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'} found
          </p>
        </div>
        <div className="col-md-6">
          <div className="position-relative">
            <FiSearch className="position-absolute search-icon text-muted" />
            <input
              type="text"
              className="form-control pl-5"
              style={{ paddingLeft: "30px" }}
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="row g-2">
            <div className="col-6">
              <button
                className={`btn btn-sm w-100 ${activeTab === "job" ? "btn-primary" : "btn-outline-primary"}`}
                id="job-tab"
                onClick={() => setActiveTab("job")}>
                <FiBriefcase className="me-2" /> Interviews with Job Post
              </button>
            </div>
            <div className="col-6">
              <button
                className={`btn btn-sm w-100 ${activeTab === "cv" ? "btn-secondary" : "btn-outline-secondary"}`}
                id="cv-tab"
                onClick={() => setActiveTab("cv")}>
                <FiFileText className="me-2" /> Interviews with CV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <label className="small font-weight-bold text-muted mb-1">Position</label>
          <select
            className="form-control form-control-sm"
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
          >
            <option value="All Positions">All</option>
            {uniqueJobTitles.map((pos) => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <label className="small font-weight-bold text-muted mb-1">Sort by</label>
          <select
            className="form-control form-control-sm"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Date (Newest First)</option>
            <option value="oldest">Date (Oldest First)</option>
          </select>
        </div>
        <div className="col-md-4 mb-2 d-flex align-items-end">
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterPosition('All Positions');
              setSortOrder('newest');
            }}
            className="btn btn-sm btn-outline-secondary w-100"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && filteredReports.length === 0 && (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredReports.length === 0 && (
        <div className="text-center py-5">
          <FiAward className="text-muted mb-3" style={{ fontSize: '3rem' }} />
          <h5 className="font-weight-bold">
            {displayData.length === 0 ?
              `You don't have any interview reports for ${activeTab === 'job' ? 'job posts' : 'CVs'} yet.` :
              "No reports match your criteria."}
          </h5>
          <p className="text-muted small">
            {displayData.length === 0 ?
              "Completed interviews will appear here." :
              "Try adjusting your search or filter criteria."}
          </p>
        </div>
      )}

      {/* Reports list */}
      {!isLoading && filteredReports.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="card shadow-sm d-none d-md-block">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="thead-light">
                  <tr>
                    <th style={{ minWidth: '200px' }}>Candidate</th>
                    <th>Position</th>
                    <th>Interviewer</th>
                    <th>Date</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSummaries.map((summary) => (
                    <tr key={summary._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mr-3" style={{ width: '40px', height: '40px' }}>
                            <FiUser />
                          </div>
                          <div>
                            <div className="font-weight-bold">{summary.candidateName}</div>
                            <div className="small text-muted">{summary.interviewId}</div>
                          </div>
                        </div>
                      </td>
                      <td>{summary.jobTitle}</td>
                      <td>{summary.interviewerName}</td>
                      <td>
                        <div>{formatDate(summary.start)}</div>
                        <div className="small text-muted">{formatTime(summary.start)}</div>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => handleSummaryClick(summary.interviewId)}
                          className="btn btn-sm btn-outline-primary"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="d-md-none">
            {currentSummaries.map((summary) => (
              <div key={summary._id} className="card report-card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mr-3" style={{ width: '40px', height: '40px' }}>
                        <FiUser />
                      </div>
                      <div>
                        <h6 className="font-weight-bold mb-0">{summary.candidateName}</h6>
                        <small className="text-muted">{summary.interviewId}</small>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSummaryClick(summary.interviewId)}
                      className="btn btn-sm btn-primary"
                    >
                      View
                    </button>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="d-flex align-items-center mb-2 gap-2">
                        <FiBriefcase className="mr-2 text-muted" />
                        <span>{summary.jobTitle}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center mb-2 gap-2">
                        <FiUser className="mr-2 text-muted" />
                        <span>{summary.interviewerName}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center mb-2 gap-2">
                        <FiCalendar className="mr-2 text-muted" />
                        <span>{formatDate(summary.start)}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center mb-2 gap-2">
                        <FiClock className="mr-2 text-muted" />
                        <span>{formatTime(summary.start)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <nav aria-label="Page navigation" className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(pageNum)}>
                      {pageNum}
                    </button>
                  </li>
                );
              })}

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}

      <style jsx>{`
        .report-card {
          transition: all 0.2s ease;
        }
        .report-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .skill-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }
        .modal-overlay {
          background-color: rgba(0,0,0,0.5);
        }
        .search-icon {
          top: 50%;
          transform: translateY(-50%);
          left: 12px;
        }
        .nav-tabs {
          border-bottom: 1px solid #dee2e6;
          margin-bottom: 1rem;
        }
        .nav-tabs .nav-link {
          color: #495057;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 0.5rem 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .nav-tabs .nav-link:hover {
          border-bottom: 2px solid #e9ecef;
          color: #3b82f6;
        }
        .nav-tabs .nav-link.active {
          color: #3b82f6;
          background-color: transparent;
          border-bottom: 2px solid #3b82f6;
        }
        @media (max-width: 767.98px) {
          .nav-tabs .nav-link {
            padding: 0.5rem;
            font-size: 0.875rem;
          }
          .nav-tabs .nav-link svg {
            margin-right: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CompanyReport;