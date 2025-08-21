import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiDownload, FiUser, FiBriefcase, FiCalendar, FiClock, FiAward } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useCompanyContext } from '../../../context/company-context';

const CompanyReport = () => {
  const { getAllDoneInterviewsOfCompany, companyInterviews, isLoading, getInterviewReport } = useCompanyContext()
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('All Positions');
  const [sortOrder, setSortOrder] = useState('newest');

  const [currentPage, setCurrentPage] = useState(1);
  const summariesPerPage = 10;

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
  
  const renderSkills = (skills) => {
    return skills.map((skill, index) => (
      <div key={index} className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <span className="small font-weight-bold">{skill.name}</span>
          <span className="small font-weight-bold">{skill.score}/10</span>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div
            className={`progress-bar ${skill.score >= 8 ? 'bg-success' :
              skill.score >= 6 ? 'bg-warning' : 'bg-danger'
              }`}
            style={{ width: `${skill.score * 10}%` }}
          ></div>
        </div>
      </div>
    ));
  };

  // Handle summary click
  const handleSummaryClick = async (interviewId) => {
    const report = await getInterviewReport(interviewId);
    if (report) {
      setSelectedReport(report);
      setShowReportModal(true);
    }
  };

  function getUniqueJobTitles(companyInterviews) {
    const titles = companyInterviews.map(item => item.jobTitle);
    return [...new Set(titles)];
  }

  const uniqueJobTitles = getUniqueJobTitles(companyInterviews);

  // Filter and sort companyInterviews
  const filteredReports = companyInterviews.filter(report => {
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


  // Add this function to your component
  const downloadReportAsPDF = async () => {
    if (!selectedReport) return;

    try {
      // Create a temporary div to hold the report content
      const reportElement = document.createElement('div');
      reportElement.style.width = '800px';
      reportElement.style.padding = '20px';
      reportElement.style.backgroundColor = 'white';
      reportElement.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';

      // Populate the report content
      reportElement.innerHTML = `
      <div class="report-container">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #3b82f6; margin-bottom: 5px;">Interview Report</h2>
          <p style="color: #6b7280; margin-bottom: 15px;">${selectedReport.interviewId}</p>
          <div style="display: inline-block; padding: 5px 10px; border-radius: 20px; 
              background-color: ${selectedReport.score >= 8 ? '#10b981' :
          selectedReport.score >= 6 ? '#f59e0b' : '#ef4444'
        }; color: white; font-weight: bold;">
            Score: ${selectedReport.score}/10
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap;">
          <div style="width: 48%; margin-bottom: 15px; padding: 15px; border-radius: 8px; background-color: #f9fafb;">
            <h3 style="color: #3b82f6; font-size: 16px; margin-bottom: 10px; display: flex; align-items: center;">
              <span style="margin-right: 8px;">👤</span> Candidate Information
            </h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${selectedReport.candidate.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${selectedReport.candidate.email}</p>
          </div>
          
          <div style="width: 48%; margin-bottom: 15px; padding: 15px; border-radius: 8px; background-color: #f9fafb;">
            <h3 style="color: #3b82f6; font-size: 16px; margin-bottom: 10px; display: flex; align-items: center;">
              <span style="margin-right: 8px;">💼</span> Interview Details
            </h3>
            <p style="margin: 5px 0;"><strong>Position:</strong> ${selectedReport.position}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formatDate(selectedReport.date)}</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> ${selectedReport.duration}</p>
            <p style="margin: 5px 0;"><strong>Questions:</strong> ${selectedReport.questions.answered}/${selectedReport.questions.total} (${selectedReport.questions.percentage}%)</p>
          </div>
        </div>

        ${selectedReport.skills?.length > 0 ? `
        <div style="margin-bottom: 20px; padding: 15px; border-radius: 8px; background-color: #f9fafb;">
          <h3 style="color: #3b82f6; font-size: 16px; margin-bottom: 15px; display: flex; align-items: center;">
            <span style="margin-right: 8px;">📊</span> Skills Evaluation
          </h3>
          ${selectedReport.skills.map(skill => `
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px;">
                <span>${skill.name}</span>
                <span>${skill.score}/10</span>
              </div>
              <div style="height: 8px; background-color: #e5e7eb; border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: ${skill.score * 10}%; background-color: ${skill.score >= 8 ? '#10b981' :
            skill.score >= 6 ? '#f59e0b' : '#ef4444'
          }; border-radius: 4px;"></div>
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${selectedReport.interviewerSummary ? `
        <div style="margin-bottom: 20px; padding: 15px; border-radius: 8px; background-color: #f9fafb;">
          <h3 style="color: #3b82f6; font-size: 16px; margin-bottom: 10px; display: flex; align-items: center;">
            <span style="margin-right: 8px;">📝</span> Interviewer Summary
          </h3>
          <p style="margin: 0; line-height: 1.5;">${selectedReport.interviewerSummary}</p>
        </div>
        ` : ''}

        ${selectedReport.codeTasks?.length > 0 ? `
        <div style="margin-bottom: 20px; padding: 15px; border-radius: 8px; background-color: #f9fafb;">
          <h3 style="color: #3b82f6; font-size: 16px; margin-bottom: 15px; display: flex; align-items: center;">
            <span style="margin-right: 8px;">💻</span> Code Tasks
          </h3>
          ${selectedReport.codeTasks.map((task, index) => `
            <div style="margin-bottom: ${index < selectedReport.codeTasks.length - 1 ? '15px' : '0'}; padding-bottom: ${index < selectedReport.codeTasks.length - 1 ? '15px' : '0'}; ${index < selectedReport.codeTasks.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : ''}">
              <h4 style="margin: 0 0 8px 0; font-size: 14px;">${task.taskName}</h4>
              <div style="display: flex; justify-content: space-between; font-size: 13px; color: #6b7280; margin-bottom: 8px;">
                <span>Score: ${task.score}/10</span>
                <span>Time: ${task.timeTaken} mins</span>
              </div>
              ${task.comments ? `
                <div style="font-size: 13px;">
                  <p style="font-weight: bold; margin: 8px 0 4px 0;">Comments:</p>
                  <p style="margin: 0; line-height: 1.4;">${task.comments}</p>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #9ca3af; margin-top: 20px;">
          <div>Created: ${formatDate(selectedReport.createdAt)}</div>
          <div>Last Updated: ${formatDate(selectedReport.updatedAt)}</div>
        </div>
      </div>
    `;

      // Append to body but keep it invisible
      reportElement.style.position = 'absolute';
      reportElement.style.left = '-9999px';
      document.body.appendChild(reportElement);

      // Convert to canvas then to PDF
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Handle multi-page PDF if content is too long
      let heightLeft = imgHeight;
      let position = 0;
      while (heightLeft >= pageHeight) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(`Interview_Report_${selectedReport.interviewId}.pdf`);

      // Clean up
      document.body.removeChild(reportElement);

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-danger';
  };

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
            {companyInterviews.length === 0 ?
              "You don't have any interview reports yet." :
              "No reports match your criteria."}
          </h5>
          <p className="text-muted small">
            {companyInterviews.length === 0 ?
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

      {/* Report Modal */}
      {selectedReport && (
        <div className={`modal fade ${showReportModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Interview Report - {selectedReport.interviewId}
                  <span className={`px-2 py-1 rounded-pill ml-4 ${getScoreColor(selectedReport?.score)}`}>
                    Score: {selectedReport?.score}/10
                  </span>
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowReportModal(false)}></button>
              </div>
              <div className="modal-body">
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="row mb-4">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <div className="card h-100">
                          <div className="card-body">
                            <h6 className="card-title text-primary">
                              <FiUser className="mr-2" /> Candidate Information
                            </h6>
                            <ul className="list-unstyled mb-0">
                              <li><strong>Name:</strong> {selectedReport.candidate.name}</li>
                              <li><strong>Email:</strong> {selectedReport.candidate.email}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card h-100">
                          <div className="card-body">
                            <h6 className="card-title text-primary">
                              <FiBriefcase className="mr-2" /> Interview Details
                            </h6>
                            <ul className="list-unstyled mb-0">
                              <li><strong>Position:</strong> {selectedReport.position}</li>
                              <li><strong>Date:</strong> {formatDate(selectedReport.date)}</li>
                              <li><strong>Duration:</strong> {selectedReport.duration}</li>
                              <li><strong>Questions:</strong> {selectedReport.questions.answered}/{selectedReport.questions.total} ({selectedReport.questions.percentage}%)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedReport.skills?.length > 0 && (
                      <div className="card mb-4">
                        <div className="card-body">
                          <h6 className="card-title text-primary">Skills Evaluation</h6>
                          {renderSkills(selectedReport.skills)}
                        </div>
                      </div>
                    )}

                    {selectedReport.interviewerSummary && (
                      <div className="card mb-4">
                        <div className="card-body">
                          <h6 className="card-title text-primary">Interviewer Summary</h6>
                          <p className="mb-0">{selectedReport.interviewerSummary}</p>
                        </div>
                      </div>
                    )}

                    {selectedReport.codeTasks?.length > 0 && (
                      <div className="card mb-4">
                        <div className="card-body">
                          <h6 className="card-title text-primary">Code Tasks</h6>
                          <div className="list-group list-group-flush">
                            {selectedReport.codeTasks.map((task, index) => (
                              <div key={index} className="list-group-item">
                                <h6 className="mb-1">{task.taskName}</h6>
                                <div className="d-flex justify-content-between small text-muted mb-2">
                                  <span>Score: {task.score}/10</span>
                                  <span>Time: {task.timeTaken} mins</span>
                                </div>
                                {task.comments && (
                                  <div className="small">
                                    <p className="font-weight-bold mb-1">Comments:</p>
                                    <p className="mb-0">{task.comments}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between small text-muted">
                      <div>Created: {formatDate(selectedReport.createdAt)}</div>
                      <div>Last Updated: {formatDate(selectedReport.updatedAt)}</div>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReportModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={downloadReportAsPDF}>
                  <FiDownload className="mr-2" /> Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
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
      `}</style>
    </div>
  );
};

export default CompanyReport;