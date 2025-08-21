import { Link } from 'react-router-dom';

const UserSidebar = () => {
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
                            <Link className="sidebar-link" to="/user/dashboard" aria-expanded="false">
                                <span><i className="ti ti-layout-dashboard"></i></span>
                                <span className="hide-menu">Dashboard</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/user/jobs" aria-expanded="false">
                                <span><i className="ti ti-briefcase"></i></span>
                                <span className="hide-menu">Jobs</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/user/jobs-applied" aria-expanded="false">
                                <span><i className="ti ti-file-check"></i></span>
                                <span className="hide-menu">Jobs Applied</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/user/interviews-by-job-posts" aria-expanded="false">
                                <i className="ti ti-video"></i>
                                <span className="hide-menu">All Interviews By Job Posts</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" to="/user/setting" aria-expanded="false">
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

export default UserSidebar;
