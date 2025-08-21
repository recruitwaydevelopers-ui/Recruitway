import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from "react-router-dom"
import { useAuthContext } from '../context/auth-context';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { server } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Please Wait...")
    try {
      const response = await axios.post(`${server}/api/v1/auth/forgot-password`,
        { email }
      );
      toast.dismiss()
      toast.success(response.data.message)
    } catch (error) {
      toast.dismiss()
      toast.error(error.response?.data?.message || 'Something went wrong!')
    }
  };

  return (
    <>
      <div className="container-fluid min-vh-100 d-flex align-items-center bg-light">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5">

              <div className="card border-0 shadow-lg overflow-hidden">

                <div className="card-header bg-primary text-white p-4">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-shield-lock me-2" style={{ fontSize: '1.5rem' }}></i>
                    <h2 className="h5 mb-0 text-white">Account Recovery</h2>
                  </div>
                </div>

                <div className="card-body p-4 p-md-5">
                  <div className="text-center mb-4">
                    <div className="d-inline-block p-3 bg-opacity-10 rounded-circle mb-3">
                      <i className="bi bi-question-circle text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h3 className="h4 mb-2">Reset Your Password</h3>
                    <p className="text-muted mb-0">
                      Enter your registered email to receive a secure reset link.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label fw-semibold">
                        Email Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border border-primary">
                          <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control form-control-sm text-black border border-primary"
                          id="email"
                          placeholder="your.email@example.com"
                          required
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-text">
                        We'll send instructions to this email
                      </div>
                    </div>

                    <div className="d-grid mb-4">
                      <button type="submit" className="btn btn-primary btn-sm">
                        <i className="bi bi-send-fill me-2"></i>
                        Send Reset Link
                      </button>
                    </div>
                  </form>

                  <div className="text-center pt-3 border-top">
                    <Link to="/login" className="text-decoration-none btn btn-outline-primary">
                      <i className="bi bi-arrow-left-short me-1"></i>
                      Back to login
                    </Link>
                  </div>
                </div>

                <div className="card-footer bg-white text-center py-3">
                  <p className="small mb-0">
                    Need an account?{' '}
                    <Link to="/register" className="text-decoration-none fw-semibold">
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>

              <div className="text-center mt-4">
                <ul className="list-inline mb-2">
                  <li className="list-inline-item">
                    <Link to="#" className="text-decoration-none small text-primary">
                      Terms
                    </Link>
                  </li>
                  <li className="list-inline-item text-muted small">•</li>
                  <li className="list-inline-item">
                    <Link to="#" className="text-decoration-none small text-primary">
                      Privacy
                    </Link>
                  </li>
                  <li className="list-inline-item text-muted small">•</li>
                  <li className="list-inline-item">
                    <Link to="#" className="text-decoration-none small text-primary">
                      Help
                    </Link>
                  </li>
                </ul>
                <p className="small text-muted mb-0">
                  © {new Date().getFullYear()} Recruitway
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;