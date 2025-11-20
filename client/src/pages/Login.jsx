import { useState, useEffect } from 'react';
import LogoAnimation from '../components/LogoAnimation';
import { useAuthContext } from '../context/auth-context';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
        rememberMe: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [errors, setErrors] = useState({});

    const { server, loading, login } = useAuthContext();
    const navigate = useNavigate();

    // Check screen size for responsiveness
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: type === "checkbox" ? checked : value
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userInfo.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!userInfo.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const contain = (password) => {
            const regex = /^(?=.*[A-Z])(?=.*\d).+$/;
            return regex.test(password);
        };

        if (userInfo.password.includes(' ')) {
            toast.dismiss();
            return toast.error("Password cannot contain spaces");
        }

        if (userInfo.password.length < 6 || userInfo.password.length > 20) {
            toast.dismiss();
            return toast.error("Password must be 6-20 characters.");
        }

        if (!contain(userInfo.password)) {
            toast.dismiss();
            return toast.error("Password must include a number and uppercase letter.");
        }

        setIsLoading(true);
        try {
            const res = await login(userInfo);
            if (res.success && res.path) {
                navigate(`/${res.path}`);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLinkedinLogin = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(`${server}/api/v1/auth/linkedin?role=${null}`);
            if (data.authUrl) {
                window.location.href = data.authUrl;
            }
        } catch (err) {
            console.error("LinkedIn login error:", err);
            toast.error("Failed to connect with LinkedIn");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(`${server}/api/v1/auth/google?role=${null}`);
            if (data.authUrl) {
                window.location.href = data.authUrl;
            }
        } catch (err) {
            console.error("Google login error:", err);
            toast.error("Failed to connect with Google");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (loading) {
        return <LogoAnimation />;
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-primary">
            <div className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-4 mx-auto">
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                    {/* Header Section with Gradient */}
                    <div className="card-header bg-primary text-white p-4 position-relative">
                        <div className="position-absolute w-100 h-100 top-0 start-0 bg-primary bg-opacity-10"></div>
                        <div className="position-relative z-1 d-flex justify-content-between align-items-center">
                            <Link to="/" className="text-white text-decoration-none">
                                <img
                                    src="/images/logos/logo.png"
                                    alt="RecruitWay Logo"
                                    width={isMobile ? "100" : "140"}
                                    className="d-inline-block align-top"
                                />
                            </Link>
                            <h2 className="mb-0 fs-4 fw-bold text-white">Welcome Back</h2>
                        </div>
                    </div>

                    {/* Body Section */}
                    <div className="card-body p-4 p-md-5">
                        <p className="text-muted mb-4">Sign in to continue to your account</p>

                        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                            {/* Email Field */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-medium">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                        <i className="bi bi-envelope text-muted"></i>
                                    </span>
                                    <input
                                        type="email"
                                        className={`form-control py-2 ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={userInfo.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                        disabled={isLoading}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label fw-medium">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                        <i className="bi bi-lock text-muted"></i>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`form-control py-2 border-end-0 ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        name="password"
                                        value={userInfo.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="input-group-text bg-light border-start-0"
                                        onClick={togglePasswordVisibility}
                                        disabled={isLoading}
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                                    </button>
                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="rememberMe"
                                        name="rememberMe"
                                        checked={userInfo.rememberMe}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                    <label className="form-check-label small text-muted" htmlFor="rememberMe">
                                        Remember me
                                    </label>
                                </div>
                                <Link to="/forgot-password" className="small text-decoration-none text-primary">
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2 mb-3 fw-medium d-flex align-items-center justify-content-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </button>

                            {/* Divider */}
                            <div className="position-relative my-4">
                                <hr className="my-4" />
                                <div className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted small">
                                    Or continue with
                                </div>
                            </div>
                        </form>

                        {/* Social Login Buttons */}
                        <div className="row g-2">
                            <div className="col-6">
                                <button
                                    onClick={handleGoogleLogin}
                                    className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center py-2"
                                    type="button"
                                    disabled={isLoading}
                                >
                                    <i className="bi bi-google me-2"></i>
                                    {!isMobile && <span>Google</span>}
                                </button>
                            </div>
                            <div className="col-6">
                                <button
                                    onClick={handleLinkedinLogin}
                                    className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center py-2"
                                    type="button"
                                    disabled={isLoading}
                                >
                                    <i className="bi bi-linkedin me-2"></i>
                                    {!isMobile && <span>LinkedIn</span>}
                                </button>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center small mt-4 pt-3">
                            <span className="text-muted">Don't have an account? </span>
                            <Link to="/register" className="text-decoration-none fw-medium text-primary">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                .bg-gradient-primary {
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                }
                .bg-gradient-secondary {
                    background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
                }
                .card {
                    transition: transform 0.3s ease;
                }
                .card:hover {
                    transform: translateY(-5px);
                }
                .input-group-text {
                    transition: all 0.2s ease;
                }
                .btn {
                    transition: all 0.2s ease;
                }
                .btn:not(:disabled):hover {
                    transform: translateY(-2px);
                }
            `}
            </style>
        </div>
    );
};

export default Login;