import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/auth-context';
import { Helmet } from 'react-helmet';

const Error404 = () => {
    const navigate = useNavigate()
    const { logout } = useAuthContext()
    return (
        <>
            <Helmet>
                <title>RecruitWay | Page Not Found</title>
            </Helmet>

            <div className="min-vh-100 d-flex flex-column">
                <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                    <div className="container">
                        <Link className="navbar-brand fw-bold text-primary" to="/">
                            <img src="/images/logos/logo.webp" className="light-logo" width="160" alt="RecruitWay" />
                        </Link>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-grow-1 d-flex align-items-center">
                    <div className="container my-5 py-5">
                        <div className="row justify-content-center">
                            <div className="col-lg-8 text-center">
                                {/* Animated 404 Illustration */}
                                <div className="mb-4 position-relative" style={{ height: '200px' }}>
                                    <div className="position-absolute top-50 start-50 translate-middle">
                                        <div className="error-404-animation">
                                            <span className="display-1 fw-bold text-primary">4</span>
                                            <div className="d-inline-block mx-2 mx-sm-3 position-relative">
                                                <div className="error-dot error-dot-1"></div>
                                                <div className="error-dot error-dot-2"></div>
                                            </div>
                                            <span className="display-1 fw-bold text-primary">4</span>
                                        </div>
                                    </div>
                                </div>

                                <h1 className="display-5 fw-bold mb-3">Page Not Found</h1>
                                <p className="lead mb-4">
                                    Oops! The page you're looking for doesn't exist or has been moved.
                                </p>
                                <div className="d-flex flex-wrap justify-content-center gap-3">
                                    <button className="btn btn-primary px-4 py-2" onClick={() => navigate(-1)}>
                                        <i className="bi bi-arrow-left-circle me-2"></i> Go Back
                                    </button>
                                    <button className="btn btn-outline-primary px-4 py-2" onClick={() => { logout(); navigate("/login") }}>
                                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-dark text-white py-4">
                    <div className="container text-center">
                        <p className="mb-0">&copy; {new Date().getFullYear()} RecruitWay. All rights reserved.</p>
                    </div>
                </footer>
            </div>

            {/* CSS for Animation - Can be moved to your stylesheet */}
            <style jsx>{`
        .error-404-animation {
          position: relative;
          display: inline-block;
        }
        .error-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--bs-primary);
          position: absolute;
          animation: bounce 1.5s infinite ease-in-out;
        }
        .error-dot-1 {
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 0s;
        }
        .error-dot-2 {
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 0.3s;
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-15px); }
        }
        @media (max-width: 576px) {
          .error-dot {
            width: 12px;
            height: 12px;
          }
          .error-dot-1 { top: -15px; }
          .error-dot-2 { bottom: -15px; }
        }
      `}</style>
        </>
    );
};

export default Error404;