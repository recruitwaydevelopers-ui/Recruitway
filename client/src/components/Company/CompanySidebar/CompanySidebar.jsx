import { Link } from 'react-router-dom';

const CompanySidebar = () => {
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
                            <Link className="sidebar-link" to="/company/dashboard" aria-expanded="false">
                                <span><i className="ti ti-layout-dashboard"></i></span>
                                <span className="hide-menu">Dashboard</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/company/candidates" aria-expanded="false">
                                <span><i className="ti ti-users"></i></span>
                                <span className="hide-menu">Candidates</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/company/report" aria-expanded="false">
                                <span><i className="ti ti-user"></i></span>
                                <span className="hide-menu">Report</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/company/job-posts" aria-expanded="false">
                                <span><i className="ti ti-briefcase"></i></span>
                                <span className="hide-menu">Job Posts</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/company/uploaded-cv" aria-expanded="false">
                                <span><i className="ti ti-briefcase"></i></span>
                                <span className="hide-menu">Upload Cvs</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/company/chat-with-superadmin" aria-expanded="false">
                                <span><i className="ti ti-messages"></i></span>
                                <span className="hide-menu">Chat With Super Admin</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/company/setting" aria-expanded="false">
                                <span><i className="ti ti-settings"></i></span>
                                <span className="hide-menu">Settings</span>
                            </Link>
                        </li>
                        {/* <li className="sidebar-item">
                            <Link className="sidebar-link" to="/company/CompanyDetail" aria-expanded="false">
                                <span><i className="ti ti-messages"></i></span>
                                <span className="hide-menu">Company Details</span>
                            </Link>
                        </li> */}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default CompanySidebar;