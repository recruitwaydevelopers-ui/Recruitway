import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/auth-context';
import toast from 'react-hot-toast';

const VerificationPage = () => {
    const location = useLocation();
    const { email } = location.state || {};
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { server } = useAuthContext()

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Focus next input
        if (value && index < otp.length - 1) {
            const nextInput = document.querySelectorAll('.otp-input')[index + 1];
            nextInput?.focus();
        }
    };

    const handleResend = async () => {
        setLoading(true)
        try {
            const res = await axios.post(`${server}/api/v1/auth/resendCode`,
                { email }
            );

            setCountdown(60); // Restart countdown
            setIsResendDisabled(true);
            setError(''); // Clear any previous errors
            toast.success(res.data.message); // Optional: notify user
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to resend code. Try again.');
            }
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 4) {
            setError('Please enter a 4-digit code');
            return;
        }
        setLoading(true)

        try {
            const response = await axios.post(`${server}/api/v1/auth/verifyCode`,
                { email, code }
            );

            if (response.data.success) {
                navigate(response.data.path);
            } else {
                setError('Invalid or expired code');
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    // Countdown logic
    useEffect(() => {
        if (countdown === 0) {
            setIsResendDisabled(false);
            return;
        }

        const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);


    function maskEmail(email) {
        if (typeof email !== 'string') return '';

        const start = email.slice(0, 4);
        const end = email.slice(-9);
        return `${start}****${end}`;
    }

    const masked = maskEmail(email);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading Please Wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
            <div className="d-flex align-items-center justify-content-center w-100">
                <div className="row justify-content-center w-100">
                    <div className="col-md-8 col-lg-6 col-xxl-3">
                        <div className="card mb-0">
                            <div className="card-body pt-5">
                                <a href="/" className="text-nowrap w-100 logo-img text-center d-block mb-4">
                                    <img src="/images/logos/logo.png" alt="Account Verification" className="img-fluid mb-4" width="180" />
                                </a>
                                <div className="mb-5 text-center">
                                    <p>We sent a verification code to your email. Enter the code below.</p>
                                    <h6 className="fw-bolder" id="masked-phone">{masked}</h6>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Type your 4-digit security code</label>
                                        <div className="d-flex align-items-center gap-2" id="otp-container">
                                            {otp.map((digit, idx) => (
                                                <input
                                                    key={idx}
                                                    type="text"
                                                    className="form-control otp-input text-center"
                                                    maxLength="1"
                                                    value={digit}
                                                    onChange={e => handleChange(e, idx)}
                                                    inputMode="numeric"
                                                    autoComplete="one-time-code"
                                                />
                                            ))}
                                        </div>
                                        {error && <div className="invalid-feedback d-block">{error}</div>}
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 py-2 mb-3" disabled={otp.join('').length !== 4}>Verify My Account</button>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <p className="mb-0 text-dark">Didn't get the code?</p>
                                        <button
                                            type="button"
                                            className="btn btn-link p-0 text-primary"
                                            onClick={handleResend}
                                            disabled={isResendDisabled}
                                        >
                                            Resend {isResendDisabled && `(${countdown}s)`}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;
