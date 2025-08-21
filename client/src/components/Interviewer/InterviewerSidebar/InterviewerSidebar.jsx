import { Link } from 'react-router-dom';

const InterviewerSidebar = () => {
    return (
        <aside className="left-sidebar px-1">
            <div>
                <div className="brand-logo d-flex align-items-center justify-content-between mt-3">
                    <Link to="dashboard" className="text-nowrap logo-img">
                        <img src="/images/logos/logo.png" className="light-logo" width="150" alt="Company Logo" />
                    </Link>
                    <div className="close-btn d-lg-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
                        <i className="ti ti-x fs-8"></i>
                    </div>
                </div>

                <nav className="sidebar-nav mt-5" data-simplebar>
                    <ul id="sidebarnav">
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/interviewer/dashboard" aria-expanded="false">
                                <span><i className="ti ti-layout-dashboard"></i></span>
                                <span className="hide-menu">Dashboard</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/interviewer/interviews-by-job-posts" aria-expanded="false">
                                <span><i className="ti ti-users"></i></span>
                                <span className="hide-menu">All Interviews By Job Posts</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/interviewer/interviews-by-cv" aria-expanded="false">
                                <span><i className="ti ti-users"></i></span>
                                <span className="hide-menu">All Interviews By CV</span>
                            </Link>
                        </li>
                        {/* <li className="sidebar-item">
                            <Link className="sidebar-link" to="/interviewer/InterviewFormate" aria-expanded="false">
                                <span><i className="ti ti-user-check"></i></span>
                                <span className="hide-menu">Interview Formate</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/interviewer/RealTimeNotes" aria-expanded="false">
                                <span><i className="ti ti-user"></i></span>
                                <span className="hide-menu">RealTime Notes</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/interviewer/ScoringSystem" aria-expanded="false">
                                <span><i className="ti ti-briefcase"></i></span>
                                <span className="hide-menu">Scoring System</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/interviewer/InterviewHistory" aria-expanded="false">
                                <span><i className="ti ti-messages"></i></span>
                                <span className="hide-menu">Interview History</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/interviewer/PostInterviewActions" aria-expanded="false">
                                <span><i className="ti ti-messages"></i></span>
                                <span className="hide-menu">PostInterview Actions</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/interviewer/IntegrationTools" aria-expanded="false">
                                <span><i className="ti ti-messages"></i></span>
                                <span className="hide-menu">Integration Tools</span>
                            </Link>
                        </li> */}
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/interviewer/setting" aria-expanded="false">
                                <span><i className="ti ti-settings"></i></span>
                                <span className="hide-menu">Settings</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default InterviewerSidebar;