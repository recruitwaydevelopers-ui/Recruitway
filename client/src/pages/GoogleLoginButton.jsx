import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/auth-context';
import toast from 'react-hot-toast';

const server = import.meta.env.VITE_SERVER;
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleLoginButton = () => {
    const buttonRef = useRef(null);
    const navigate = useNavigate();
    const { fetchUserData, dispatch } = useAuthContext();
    const [selectedRole, setSelectedRole] = useState('');

    // Handle Google login success
    const handleGoogleSuccess = async (response) => {
        if (!selectedRole) {
            toast.error('Please select a role before signing in');
            return;
        }

        try {
            toast.loading('Signing in...');
            const res = await axios.post(`${server}/api/v1/auth/google`, {
                token: response.credential,
                role: selectedRole, // Include selected role in the request
            });

            const { token, success, path } = res.data;

            localStorage.setItem('token', token);
            dispatch({ type: 'LOAD_TOKEN', payload: { token } });
            await fetchUserData(token);

            toast.dismiss();
            if (success && path) {
                toast.success('Login successful');
                navigate(`/${path}`);
            } else {
                toast.error('Login failed: Invalid response from server');
            }
        } catch (error) {
            console.error('Google login failed:', error);
            navigate("/")
            toast.dismiss();
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    // Load Google Sign-In script and initialize
    useEffect(() => {
        if (!googleClientId) {
            console.error('Google Client ID is not defined');
            toast.error('Configuration error. Please contact support.');
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;

        script.onload = () => {
            if (window.google?.accounts?.id) {
                window.google.accounts.id.initialize({
                    client_id: googleClientId,
                    callback: handleGoogleSuccess,
                    context: 'signin',
                    ux_mode: 'popup',
                });

                if (buttonRef.current && selectedRole) {
                    window.google.accounts.id.renderButton(buttonRef.current, {
                        theme: 'outline',
                        size: 'large',
                        text: 'signin_with',
                        shape: 'rectangular',
                    });
                }
            } else {
                console.error('Google Sign-In library not loaded');
                toast.error('Failed to load Google Sign-In. Please try again.');
            }
        };

        script.onerror = () => {
            console.error('Failed to load Google Sign-In script');
            toast.error('Failed to load Google Sign-In. Please try again.');
        };

        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [selectedRole]); // Re-run effect when selectedRole changes

    return (
        <div className="container-fluid position-relative" style={{ height: '100vh' }}>
            <div className="position-absolute top-50 start-50 translate-middle text-center">
                {!selectedRole ? (
                    <>
                        <label className="form-label">Select Role</label>
                        <select
                            className="form-select"
                            onChange={(e) => setSelectedRole(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Choose Role
                            </option>
                            <option value="company">Company</option>
                            <option value="user">Candidate</option>
                            <option value="superadmin">Super Admin</option>
                            <option value="interviewer">Interviewer</option>
                        </select>
                    </>
                ) : (
                    <button
                        ref={buttonRef}
                        className="btn btn-white text-dark border fw-normal d-flex align-items-center justify-content-center rounded-2 py-2 w-100"
                    >
                        <img
                            src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/svgs/google-icon.svg"
                            alt="Google icon"
                            className="img-fluid me-2"
                            width="18"
                            height="18"
                        />
                        <span className="d-none d-sm-block me-1 flex-shrink-0">Sign in with</span>Google
                    </button>
                )}
            </div>
        </div>
    );
};

export default GoogleLoginButton;




