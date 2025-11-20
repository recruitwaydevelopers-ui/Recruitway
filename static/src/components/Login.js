import React from 'react'
import { Link } from "react-router-dom";

export const login = () => {
    return (
        <>
            <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light">
                {/* Login Card */}
                <div className="col-10 col-md-8 col-lg-6 col-xl-4">
                    <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
                        {/* Header Section */}
                        <div className="card-header bg-primary text-white p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <Link to="/" className="text-white text-decoration-none">
                                    <img
                                        src="./images/logos/logo.webp"
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

                            <form className="needs-validation" noValidate>
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

                                <div className="row">
                                    <div className="col-6 mb-2 mb-sm-0">
                                        <a className="btn btn-white text-dark border fw-normal d-flex align-items-center justify-content-center rounded-2 py-8"
                                            href="javascript:void(0)" role="button">
                                            <img
                                                src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/svgs/google-icon.svg"
                                                alt="" className="img-fluid me-2" width="18" height="18" />
                                            <span className="d-none d-sm-block me-1 flex-shrink-0">Sign in with</span>Google
                                        </a>
                                    </div>
                                    <div className="col-6">
                                        <a className="btn btn-white text-dark border fw-normal d-flex align-items-center justify-content-center rounded-2 py-8"
                                            href="javascript:void(0)" role="button">
                                            <img
                                                src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/svgs/facebook-icon.svg"
                                                alt="" className="img-fluid me-2" width="18" height="18" />
                                            <span className="d-none d-sm-block me-1 flex-shrink-0">Sign in with</span>FB
                                        </a>
                                    </div>
                                </div>
                                {/* <div className="position-relative text-center my-4">
                                    <p className="mb-0 fs-4 px-3 d-inline-block bg-white text-dark z-index-5 position-relative">or sign in
                                        with</p>
                                    <span className="border-top w-100 position-absolute top-50 start-50 translate-middle"></span>
                                </div> */}

                                {/* Sign Up Link */}
                                <div className="text-center small mt-5">
                                    <span className="text-muted">Don't have an account? </span>
                                    <Link to="/register" className="text-decoration-none fw-medium">
                                        Sign up
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
