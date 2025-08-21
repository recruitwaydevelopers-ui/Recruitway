// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuthContext } from '../context/auth-context';
// import toast from 'react-hot-toast';
// import crypto from 'crypto-js';

// const linkedinClientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
// const redirectUri = `${window.location.origin}/linkedin-callback`;


// const LinkedInLoginButton = () => {
//     const navigate = useNavigate();
//     const { fetchUserData, dispatch } = useAuthContext();
//     const [selectedRole, setSelectedRole] = useState('');

//     const handleLinkedInLogin = () => {
//         if (!linkedinClientId) {
//             toast.error('LinkedIn configuration error. Please contact support.');
//             return;
//         }

//         if (!selectedRole) {
//             toast.error('Please select a role before signing in');
//             return;
//         }

//         const clientId = linkedinClientId;
//         const encodedRedirectUri = encodeURIComponent(redirectUri);
//         const state = crypto.lib.WordArray.random(16).toString(crypto.enc.Hex);
//         const scope = encodeURIComponent('r_liteprofile r_emailaddress');



//         sessionStorage.setItem('linkedin_oauth_state', state);
//         sessionStorage.setItem('linkedin_oauth_role', selectedRole);

//         const oauthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&state=${state}&scope=${scope}`;

//         window.location.href = oauthUrl;
//     };

//     useEffect(() => {
//         const handleCallback = async () => {
//             console.log("handleCallback");

//             const urlParams = new URLSearchParams(window.location.search);
//             const code = urlParams.get('code');
//             const state = urlParams.get('state');
//             const error = urlParams.get('error');
//             const errorDescription = urlParams.get('error_description');
//             const storedState = sessionStorage.getItem('linkedin_oauth_state');
//             const role = sessionStorage.getItem('linkedin_oauth_role');


//             console.log(code);
//             console.log(state);
//             console.log(error);
//             console.log(errorDescription);
//             console.log(storedState);
//             console.log(role);


//             const cleanup = () => {
//                 sessionStorage.removeItem('linkedin_oauth_state');
//                 sessionStorage.removeItem('linkedin_oauth_role');
//             };

//             if (error) {
//                 toast.dismiss();
//                 toast.error(errorDescription || 'LinkedIn login failed. Please try again.');
//                 cleanup();
//                 navigate('/login');
//                 return;
//             }

//             if (code && state && state === storedState && role) {
//                 try {
//                     toast.loading('Signing in with LinkedIn...');
//                     const response = await fetch(`${import.meta.env.VITE_SERVER}/api/v1/auth/linkedin`, {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({ code, role }),
//                     });

//                     const data = await response.json();

//                     if (!response.ok) throw new Error(data.message || 'LinkedIn login failed');

//                     const { token, path } = data;
//                     localStorage.setItem('token', token);
//                     dispatch({ type: 'LOAD_TOKEN', payload: { token } });
//                     await fetchUserData(token);

//                     toast.dismiss();
//                     toast.success('Login successful');
//                     cleanup();
//                     navigate(`/${path}`);
//                     window.history.replaceState({}, document.title, window.location.pathname);
//                 } catch (error) {
//                     toast.dismiss();
//                     toast.error(error.message || 'LinkedIn login failed. Please try again.');
//                     cleanup();
//                     navigate('/login');
//                 }
//             } else if (state && state !== storedState) {
//                 toast.dismiss();
//                 toast.error('Invalid state parameter. Please try again.');
//                 cleanup();
//                 navigate('/login');
//             }
//         };

//         if (window.location.pathname === '/linkedin-callback') {
//             console.log("hello");

//             handleCallback();
//         }
//     }, [navigate, dispatch, fetchUserData]);

//     return (
//         <div className="container-fluid position-relative" style={{ height: '100vh' }}>
//             <div className="position-absolute top-50 start-50 translate-middle text-center">
//                 {!selectedRole ? (
//                     <>
//                         <label className="form-label">Select Role</label>
//                         <select
//                             className="form-select"
//                             onChange={(e) => setSelectedRole(e.target.value)}
//                             defaultValue=""
//                         >
//                             <option value="" disabled>Choose Role</option>
//                             <option value="company">Company</option>
//                             <option value="user">Candidate</option>
//                         </select>
//                     </>
//                 ) : (
//                     <button
//                         onClick={handleLinkedInLogin}
//                         className="btn btn-white text-dark border fw-normal d-flex align-items-center justify-content-center rounded-2 py-2 w-100"
//                     >
//                         <img
//                             src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg"
//                             alt="LinkedIn icon"
//                             className="img-fluid me-2"
//                             width="18"
//                             height="18"
//                         />
//                         <span className="d-none d-sm-block me-1 flex-shrink-0">Sign in with</span>LinkedIn
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default LinkedInLoginButton;










import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/auth-context';
import toast from 'react-hot-toast';
import axios from 'axios';

const linkedinClientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
const redirectUri = `${window.location.origin}/linkedin-callback`;

const LinkedInLoginButton = () => {
    const navigate = useNavigate();
    const { fetchUserData, dispatch } = useAuthContext();
    const [selectedRole, setSelectedRole] = useState('');

    const generateRandomString = (length) => {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
    };

    const handleLinkedInLogin = () => {
        if (!linkedinClientId) {
            toast.error('LinkedIn configuration error. Please contact support.');
            return;
        }

        if (!selectedRole) {
            toast.error('Please select a role before signing in');
            return;
        }

        const clientId = linkedinClientId;
        const encodedRedirectUri = encodeURIComponent(redirectUri);
        const state = generateRandomString(16);
        const scope = encodeURIComponent('profile openid email');

        sessionStorage.setItem('linkedin_oauth_state', state);
        sessionStorage.setItem('linkedin_oauth_role', selectedRole);

        const oauthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&state=${state}&scope=${scope}`;

        window.location.href = oauthUrl;
    };

    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');
            const error = urlParams.get('error');
            const errorDescription = urlParams.get('error_description');
            const storedState = sessionStorage.getItem('linkedin_oauth_state');
            const role = sessionStorage.getItem('linkedin_oauth_role');

            const cleanup = () => {
                sessionStorage.removeItem('linkedin_oauth_state');
                sessionStorage.removeItem('linkedin_oauth_role');
                // Clear query parameters from URL
                window.history.replaceState({}, document.title, '/linkedin-callback');
            };

            if (error) {
                toast.dismiss();
                toast.error(errorDescription || 'LinkedIn login failed. Please try again.');
                cleanup();
                navigate('/login');
                return;
            }

            if (code && state && state === storedState && role) {
                try {
                    toast.loading('Signing in with LinkedIn...');
                    const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/v1/auth/linkedin`,
                        { code, role },
                        {
                            headers: { 'Content-Type': 'application/json' },
                        });

                    const data = response.data;

                    console.log(data);
                    

                    if (!response.ok) throw new Error(data.message || 'LinkedIn login failed');

                    const { token, path } = data;
                    localStorage.setItem('token', token);
                    dispatch({ type: 'LOAD_TOKEN', payload: { token } });
                    await fetchUserData(token);

                    toast.dismiss();
                    toast.success('Login successful');
                    cleanup();
                    navigate(`/${path}`);
                } catch (error) {
                    toast.dismiss();
                    toast.error(error.message || 'LinkedIn login failed. Please try again.');
                    cleanup();
                    navigate('/login');
                }
            } else if (state && state !== storedState) {
                toast.dismiss();
                toast.error('Invalid state parameter. Please try again.');
                cleanup();
                navigate('/login');
            }
        };

        if (window.location.pathname === '/linkedin-callback') {
            handleCallback();
        }
    }, [navigate, dispatch, fetchUserData]);

    return (
        <div className="container-fluid position-relative" style={{ height: '100vh' }}>
            <div className="position-absolute top-50 start-50 translate-middle text-center">
                {!selectedRole ? (
                    <>
                        <label className="form-label">Select Role</label>
                        <select
                            className="form-select"
                            onChange={(e) => setSelectedRole(e.target.value)}
                            value={selectedRole}
                        >
                            <option value="" disabled>Choose Role</option>
                            <option value="company">Company</option>
                            <option value="user">Candidate</option>
                        </select>
                    </>
                ) : (
                    <button
                        onClick={handleLinkedInLogin}
                        className="btn btn-white text-dark border fw-normal d-flex align-items-center justify-content-center rounded-2 py-2 w-100"
                    >
                        <img
                            src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg"
                            alt="LinkedIn icon"
                            className="img-fluid me-2"
                            width="18"
                            height="18"
                        />
                        <span className="d-none d-sm-block me-1 flex-shrink-0">Sign in with</span>LinkedIn
                    </button>
                )}
            </div>
        </div>
    );
};

export default LinkedInLoginButton;

