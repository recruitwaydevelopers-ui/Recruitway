import { Link } from 'react-router-dom';

const SuperAdminSidebar = () => {
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
                        {/* Dashboard */}
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/dashboard" aria-expanded="false">
                                <span><i className="ti ti-layout-dashboard"></i></span>
                                <span className="hide-menu">Dashboard</span>
                            </Link>
                        </li>

                        {/* User Management */}
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/interviewers" aria-expanded="false">
                                <span><i className="ti ti-user-search"></i></span>
                                <span className="hide-menu">Interviewers</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/verifyAuth" aria-expanded="false">
                                <span><i className="ti ti-shield-check"></i></span>
                                <span className="hide-menu">Verify Auth</span>
                            </Link>
                        </li>

                        {/* Company Management */}
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/companies" aria-expanded="false">
                                <span><i className="ti ti-building"></i></span>
                                <span className="hide-menu">Companies</span>
                            </Link>
                        </li>

                        {/* Candidate Management */}
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/cv-received" aria-expanded="false">
                                <span><i className="ti ti-file-upload"></i></span>
                                <span className="hide-menu">CV Received</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/shortlistedCandidates" aria-expanded="false">
                                <span><i className="ti ti-list-check"></i></span>
                                <span className="hide-menu">Shortlisted Candidates</span>
                            </Link>
                        </li>

                        {/* Interview Management */}
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/allInterviews" aria-expanded="false">
                                <span><i className="ti ti-calendar-event"></i></span>
                                <span className="hide-menu">Interviews By Job</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/allInterviewsbycv" aria-expanded="false">
                                <span><i className="ti ti-calendar-star"></i></span>
                                <span className="hide-menu">Interviews By CV</span>
                            </Link>
                        </li>

                        {/* Communication */}
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/chats" aria-expanded="false">
                                <span><i className="ti ti-message-circle"></i></span>
                                <span className="hide-menu">All Chats</span>
                            </Link>
                        </li>

                        {/* Settings */}
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/setting" aria-expanded="false">
                                <span><i className="ti ti-settings"></i></span>
                                <span className="hide-menu">Settings</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* <nav className="sidebar-nav mt-5" data-simplebar>
                    <ul id="sidebarnav">
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/dashboard" aria-expanded="false">
                                <span><i className="ti ti-layout-dashboard"></i></span>
                                <span className="hide-menu">Dashboard</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/interviewers" aria-expanded="false">
                                <span><i className="ti ti-users"></i></span>
                                <span className="hide-menu">All Interviewers</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/chats" aria-expanded="false">
                                <span><i className="ti ti-building-skyscraper"></i></span>
                                <span className="hide-menu">All Chats</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/cv-received" aria-expanded="false">
                                <span><i className="ti ti-user"></i></span>
                                <span className="hide-menu">CV Recived</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/verifyAuth" aria-expanded="false">
                                <span><i className="ti ti-shield-check"></i></span>
                                <span className="hide-menu">Verify Auth</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/companies" aria-expanded="false">
                                <span><i className="ti ti-building"></i></span>
                                <span className="hide-menu">Companies</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/shortlistedCandidates" aria-expanded="false">
                                <span><i className="ti ti-clipboard-check"></i></span>
                                <span className="hide-menu">ShortListed Candidates</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/allInterviews" aria-expanded="false">
                                <span><i className="ti ti-calendar-time"></i></span>
                                <span className="hide-menu">Interviews By Job Posts</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/allInterviewsbycv" aria-expanded="false">
                                <span><i className="ti ti-calendar-time"></i></span>
                                <span className="hide-menu">Interviews By CV</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/superadmin/setting" aria-expanded="false">
                                <span><i className="ti ti-settings"></i></span>
                                <span className="hide-menu">Settings</span>
                            </Link>
                        </li>
                    </ul>
                </nav> */}
            </div>
        </aside>
    );
};

export default SuperAdminSidebar;


