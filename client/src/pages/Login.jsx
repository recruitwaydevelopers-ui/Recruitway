import React, { useState } from 'react'
import LogoAnimation from '../components/LogoAnimation';
import { useAuthContext } from '../context/auth-context';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SocialLoginButtons from './SocialLoginButtons';

const Login = () => {

    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
        rememberMe: false
    })

    const { login } = useAuthContext()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setUserInfo({
            ...userInfo,
            [name]: type === "checkbox" ? checked : value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

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

        try {
            const res = await login(userInfo)
            if (res.success && res.path) {
                navigate(`/${res.path}`);
            }
        } catch (error) {
            console.log(error.message);
        }

    }

    return (
        <>
            <LogoAnimation />
            <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light">
                {/* Login Card */}
                <div className="col-10 col-md-8 col-lg-6 col-xl-4">
                    <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
                        {/* Header Section */}
                        <div className="card-header bg-primary text-white p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <Link to="/" className="text-white text-decoration-none">
                                    <img
                                        src="/images/logos/logo.png"
                                        alt="RecruitWay Logo"
                                        width="140"
                                        className="d-inline-block align-top"
                                    />
                                </Link>
                                <h2 className="mb-0 fs-4 fw-bold">Welcome Back</h2>
                            </div>
                        </div>

                        {/* Body Section */}
                        <div className="card-body p-4 p-md-5">
                            <p className="text-muted mb-4">Login to your account</p>

                            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                                {/* Email Field */}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-medium">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-transparent">
                                            <i className="bi bi-envelope text-muted"></i>
                                        </span>
                                        <input
                                            type="email"
                                            className="form-control py-2"
                                            id="email"
                                            name="email"
                                            value={userInfo.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-medium">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-transparent">
                                            <i className="bi bi-lock text-muted"></i>
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control py-2"
                                            id="password"
                                            name="password"
                                            value={userInfo.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your password"
                                        />
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
                                            value={userInfo.rememberMe}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label small text-muted" htmlFor="rememberMe">
                                            Remember me
                                        </label>
                                    </div>
                                    <Link to="/forgot-password" className="small text-decoration-none">
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2 mb-3 fw-medium"
                                >
                                    Sign In
                                </button>

                                {/* Divider */}
                                <div className="position-relative my-4">
                                    <div className="border-top"></div>
                                    <div className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">
                                        OR
                                    </div>
                                </div>
                            </form>

                            <div className="row">
                                <div className="col-6 mb-2 mb-sm-0">
                                    <Link to="/login-with-google"
                                        className="btn btn-white text-dark border fw-normal d-flex align-items-center justify-content-center rounded-2 py-8"
                                        role="button">
                                        <img
                                            src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/svgs/google-icon.svg"
                                            alt="" className="img-fluid me-2" width="18" height="18" />
                                        <span className="d-none d-sm-block me-1 flex-shrink-0">Sign in with</span>Google
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/login-with-linkedin"
                                        className="btn btn-white text-dark border fw-normal d-flex align-items-center justify-content-center rounded-2 py-8"
                                        role="button">
                                        <img
                                            src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg"
                                            alt=""
                                            className="img-fluid me-2"
                                            width="18"
                                            height="18"
                                        />
                                        <span className="d-none d-sm-block me-1 flex-shrink-0">Sign in with</span>LinkedIn
                                    </Link>
                                </div>
                            </div >

                            {/* <SocialLoginButtons /> */}

                            <div className="text-center small mt-5">
                                <span className="text-muted">Don't have an account? </span>
                                <Link to="/register" className="text-decoration-none fw-medium">
                                    Sign up
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login