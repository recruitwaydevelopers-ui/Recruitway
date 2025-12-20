import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const API_URL = process.env.REACT_APP_SERVER || "http://localhost:5000";
const CONSENT_KEY = "cookieConsent_v1";
const ANON_KEY = "anonId";

const CookiesConsent = () => {
    const [visible, setVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const getAnonId = () => {
        let anon = localStorage.getItem(ANON_KEY);
        if (!anon) {
            anon = uuidv4();
            localStorage.setItem(ANON_KEY, anon);
            document.cookie = `anonId=${anon}; Domain=.yourdomain.com; Path=/; SameSite=None; Secure`;
        }
        return anon;
    };

    useEffect(() => {
        const raw = localStorage.getItem(CONSENT_KEY);
        if (!raw) {
            // Small delay to ensure smooth entrance animation
            setTimeout(() => setVisible(true), 300);
        }
    }, []);

    const persistAndSend = async (consent) => {
        setIsClosing(true);
        const payload = { ...consent, savedAt: new Date().toISOString() };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
        
        setTimeout(() => {
            setVisible(false);
        }, 300);

        try {
            await axios.post(`${API_URL}/api/v1/consent`, {
                anonId: getAnonId(),
                consent: payload,
                savedAt: payload.savedAt,
            });
        } catch (err) {
            console.error("Consent save failed", err);
        }
    };

    if (!visible) return null;

    return (
        <div className={`cookie-consent-overlay ${isClosing ? 'closing' : ''}`}>
            <div className="cookie-consent-container">
                <div className="cookie-consent-header">
                    <div className="cookie-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a10 10 0 0 1 7.07 17.07l-2.83-2.83A5 5 0 0 0 12 14a5 5 0 0 0-4.24 4.24A10 10 0 0 1 12 2Z"></path>
                            <path d="M12 12v.01"></path>
                        </svg>
                    </div>
                    <h3 className="cookie-title">We use cookies</h3>
                </div>
                
                <div className="cookie-consent-content">
                    <p className="cookie-message">
                        We use cookies to personalize content and analyze traffic. By continuing to use our site, you agree to our use of cookies.
                    </p>
                </div>
                
                <div className="cookie-consent-actions">
                    <button className="cookie-btn cookie-btn-outline" onClick={() => persistAndSend({ essential: true, analytics: false, marketing: false })}>
                        Decline
                    </button>
                    <button className="cookie-btn cookie-btn-primary" onClick={() => persistAndSend({ essential: true, analytics: true, marketing: true })}>
                        Accept All
                    </button>
                </div>
            </div>
            <style>{`
            .cookie-consent-overlay {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    padding: 20px;
    display: flex;
    justify-content: center;
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.cookie-consent-overlay.closing {
    opacity: 0;
    transform: translateY(20px);
}

.cookie-consent-container {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 100%;
    padding: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.cookie-consent-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.cookie-icon {
    margin-right: 12px;
    color: #4a9eff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(74, 158, 255, 0.1);
    border-radius: 50%;
}

.cookie-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.cookie-consent-content {
    margin-bottom: 20px;
}

.cookie-message {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 0;
    color: rgba(255, 255, 255, 0.8);
}

.cookie-consent-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.cookie-btn {
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cookie-btn-primary {
    background-color: #4a9eff;
    color: white;
}

.cookie-btn-primary:hover {
    background-color: #3a8eef;
    transform: translateY(-2px);
}

.cookie-btn-outline {
    background-color: transparent;
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.cookie-btn-outline:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .cookie-consent-overlay {
        padding: 15px;
    }
    
    .cookie-consent-container {
        padding: 20px;
    }
    
    .cookie-consent-actions {
        flex-direction: column;
        gap: 8px;
    }
    
    .cookie-btn {
        width: 100%;
    }
}
            `}</style>
        </div>
    );
};

export default CookiesConsent;







// import { useEffect, useState } from "react";

// const API = process.env.REACT_APP_API || "http://localhost:4000";

// const CookiesConsent = () => {
//   const [visible, setVisible] = useState(false);
//   const [showDetails, setShowDetails] = useState(false);
//   const [isClosing, setIsClosing] = useState(false);
//   const [choices, setChoices] = useState({
//     essential: true,
//     analytics: false,
//     advertising: false,
//     functional: false,
//   });

//   // Check if cookie consent already exists
//   useEffect(() => {
//     const c = getConsentCookie();
//     if (!c) {
//       // Small delay to ensure smooth entrance animation
//       setTimeout(() => setVisible(true), 300);
//     }
//   }, []);

//   function getConsentCookie() {
//     const m = document.cookie.match(new RegExp("(^| )cookie_consent=([^;]+)"));
//     if (!m) return null;
//     try {
//       return JSON.parse(decodeURIComponent(m[2]));
//     } catch {
//       return null;
//     }
//   }

//   function setConsentCookie(payload) {
//     const val = encodeURIComponent(JSON.stringify(payload));
//     const expires = new Date(Date.now() + 365 * 86400000).toUTCString();
//     document.cookie = `cookie_consent=${val}; expires=${expires}; path=/; samesite=lax`;
//   }

//   async function sendConsent(payload) {
//     try {
//       const res = await fetch(`${API}/api/consent`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           choices: payload,
//           origin: window.location.origin,
//         }),
//       });
//       const data = await res.json();
//       return data;
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   const acceptAll = async () => {
//     const payload = {
//       essential: true,
//       analytics: true,
//       advertising: true,
//       functional: true,
//     };
//     const res = await sendConsent(payload);

//     setConsentCookie({
//       id: res?.consentId || "local",
//       choices: payload,
//       date: new Date(),
//     });

//     setChoices(payload);
//     closeBanner();
//     enableNonEssential(payload);
//   };

//   const rejectAll = async () => {
//     const payload = {
//       essential: true,
//       analytics: false,
//       advertising: false,
//       functional: false,
//     };
//     const res = await sendConsent(payload);

//     setConsentCookie({
//       id: res?.consentId || "local",
//       choices: payload,
//       date: new Date(),
//     });

//     setChoices(payload);
//     closeBanner();
//   };

//   const savePreferences = async () => {
//     const res = await sendConsent(choices);

//     setConsentCookie({
//       id: res?.consentId || "local",
//       choices,
//       date: new Date(),
//     });

//     closeBanner();
//     enableNonEssential(choices);
//   };

//   const closeBanner = () => {
//     setIsClosing(true);
//     setTimeout(() => {
//       setVisible(false);
//     }, 300);
//   };

//   function enableNonEssential(c) {
//     if (c.analytics) {
//       const script = document.createElement("script");
//       script.src = "https://example-analytics.com/analytics.js";
//       script.async = true;
//       document.head.appendChild(script);
//     }

//     // Add advertising or functional scripts conditionally
//   }

//   const handleToggle = (category) => {
//     setChoices(prev => ({
//       ...prev,
//       [category]: !prev[category]
//     }));
//   };

//   if (!visible) return null;

//   return (
//     <div className={`cookie-consent-overlay ${isClosing ? 'closing' : ''}`}>
//       <div className="cookie-consent-container">
//         <div className="cookie-consent-header">
//           <div className="cookie-icon">
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M12 2a10 10 0 0 1 7.07 17.07l-2.83-2.83A5 5 0 0 0 12 14a5 5 0 0 0-4.24 4.24A10 10 0 0 1 12 2Z"></path>
//               <path d="M12 12v.01"></path>
//             </svg>
//           </div>
//           <h3 className="cookie-title">We use cookies</h3>
//         </div>
        
//         <div className="cookie-consent-content">
//           <p className="cookie-message">
//             We use cookies to enhance your experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.
//           </p>
          
//           {showDetails && (
//             <div className="cookie-details">
//               <div className="cookie-category">
//                 <div className="category-header">
//                   <div className="category-info">
//                     <h4 className="category-title">Essential Cookies</h4>
//                     <p className="category-description">Required for the site to function properly.</p>
//                   </div>
//                   <div className="toggle-container">
//                     <input 
//                       type="checkbox" 
//                       id="essential" 
//                       checked={choices.essential}
//                       disabled
//                     />
//                     <label htmlFor="essential" className="toggle-label"></label>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="cookie-category">
//                 <div className="category-header">
//                   <div className="category-info">
//                     <h4 className="category-title">Analytics Cookies</h4>
//                     <p className="category-description">Help us understand how visitors interact with our site.</p>
//                   </div>
//                   <div className="toggle-container">
//                     <input 
//                       type="checkbox" 
//                       id="analytics" 
//                       checked={choices.analytics}
//                       onChange={() => handleToggle('analytics')}
//                     />
//                     <label htmlFor="analytics" className="toggle-label"></label>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="cookie-category">
//                 <div className="category-header">
//                   <div className="category-info">
//                     <h4 className="category-title">Advertising Cookies</h4>
//                     <p className="category-description">Used to deliver advertisements relevant to you.</p>
//                   </div>
//                   <div className="toggle-container">
//                     <input 
//                       type="checkbox" 
//                       id="advertising" 
//                       checked={choices.advertising}
//                       onChange={() => handleToggle('advertising')}
//                     />
//                     <label htmlFor="advertising" className="toggle-label"></label>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="cookie-category">
//                 <div className="category-header">
//                   <div className="category-info">
//                     <h4 className="category-title">Functional Cookies</h4>
//                     <p className="category-description">Enable enhanced functionality and personalization.</p>
//                   </div>
//                   <div className="toggle-container">
//                     <input 
//                       type="checkbox" 
//                       id="functional" 
//                       checked={choices.functional}
//                       onChange={() => handleToggle('functional')}
//                     />
//                     <label htmlFor="functional" className="toggle-label"></label>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
        
//         <div className="cookie-consent-actions">
//           {!showDetails ? (
//             <>
//               <button className="cookie-btn cookie-btn-outline" onClick={rejectAll}>
//                 Reject All
//               </button>
//               <button className="cookie-btn cookie-btn-secondary" onClick={() => setShowDetails(true)}>
//                 Customize
//               </button>
//               <button className="cookie-btn cookie-btn-primary" onClick={acceptAll}>
//                 Accept All
//               </button>
//             </>
//           ) : (
//             <>
//               <button className="cookie-btn cookie-btn-outline" onClick={() => setShowDetails(false)}>
//                 Back
//               </button>
//               <button className="cookie-btn cookie-btn-primary" onClick={savePreferences}>
//                 Save Preferences
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//       <style>{`
//       .cookie-consent-overlay {
//   position: fixed;
//   bottom: 0;
//   left: 0;
//   right: 0;
//   z-index: 9999;
//   padding: 20px;
//   display: flex;
//   justify-content: center;
//   transition: opacity 0.3s ease, transform 0.3s ease;
// }

// .cookie-consent-overlay.closing {
//   opacity: 0;
//   transform: translateY(20px);
// }

// .cookie-consent-container {
//   background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
//   color: #fff;
//   border-radius: 16px;
//   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
//   max-width: 500px;
//   width: 100%;
//   padding: 24px;
//   border: 1px solid rgba(255, 255, 255, 0.1);
//   backdrop-filter: blur(10px);
//   animation: slideUp 0.4s ease-out;
// }

// @keyframes slideUp {
//   from {
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

// .cookie-consent-header {
//   display: flex;
//   align-items: center;
//   margin-bottom: 16px;
// }

// .cookie-icon {
//   margin-right: 12px;
//   color: #4a9eff;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 40px;
//   height: 40px;
//   background: rgba(74, 158, 255, 0.1);
//   border-radius: 50%;
// }

// .cookie-title {
//   font-size: 18px;
//   font-weight: 600;
//   margin: 0;
// }

// .cookie-consent-content {
//   margin-bottom: 20px;
// }

// .cookie-message {
//   font-size: 14px;
//   line-height: 1.5;
//   margin-bottom: 0;
//   color: rgba(255, 255, 255, 0.8);
// }

// .cookie-details {
//   margin-top: 20px;
//   padding-top: 16px;
//   border-top: 1px solid rgba(255, 255, 255, 0.1);
// }

// .cookie-category {
//   margin-bottom: 16px;
// }

// .category-header {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// }

// .category-info {
//   flex: 1;
// }

// .category-title {
//   font-size: 16px;
//   font-weight: 600;
//   margin: 0 0 4px 0;
// }

// .category-description {
//   font-size: 13px;
//   margin: 0;
//   color: rgba(255, 255, 255, 0.6);
// }

// .toggle-container {
//   position: relative;
// }

// .toggle-container input[type="checkbox"] {
//   opacity: 0;
//   width: 0;
//   height: 0;
// }

// .toggle-label {
//   display: block;
//   width: 44px;
//   height: 24px;
//   background-color: rgba(255, 255, 255, 0.2);
//   border-radius: 12px;
//   position: relative;
//   cursor: pointer;
//   transition: background-color 0.3s;
// }

// .toggle-label::after {
//   content: "";
//   position: absolute;
//   width: 18px;
//   height: 18px;
//   border-radius: 50%;
//   background-color: white;
//   top: 3px;
//   left: 3px;
//   transition: transform 0.3s;
// }

// .toggle-container input[type="checkbox"]:checked + .toggle-label {
//   background-color: #4a9eff;
// }

// .toggle-container input[type="checkbox"]:checked + .toggle-label::after {
//   transform: translateX(20px);
// }

// .toggle-container input[type="checkbox"]:disabled + .toggle-label {
//   background-color: #4a9eff;
//   opacity: 0.7;
//   cursor: not-allowed;
// }

// .cookie-consent-actions {
//   display: flex;
//   justify-content: flex-end;
//   gap: 10px;
// }

// .cookie-btn {
//   padding: 8px 16px;
//   border-radius: 8px;
//   font-size: 14px;
//   font-weight: 500;
//   cursor: pointer;
//   transition: all 0.2s ease;
//   border: none;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }

// .cookie-btn-primary {
//   background-color: #4a9eff;
//   color: white;
// }

// .cookie-btn-primary:hover {
//   background-color: #3a8eef;
// }

// .cookie-btn-secondary {
//   background-color: transparent;
//   color: #4a9eff;
// }

// .cookie-btn-secondary:hover {
//   background-color: rgba(74, 158, 255, 0.1);
// }

// .cookie-btn-outline {
//   background-color: transparent;
//   color: rgba(255, 255, 255, 0.7);
//   border: 1px solid rgba(255, 255, 255, 0.3);
// }

// .cookie-btn-outline:hover {
//   background-color: rgba(255, 255, 255, 0.1);
// }

// /* Responsive adjustments */
// @media (max-width: 768px) {
//   .cookie-consent-overlay {
//     padding: 15px;
//   }
  
//   .cookie-consent-container {
//     padding: 20px;
//   }
  
//   .cookie-consent-actions {
//     flex-direction: column;
//     gap: 8px;
//   }
  
//   .cookie-btn {
//     width: 100%;
//   }
  
//   .category-header {
//     flex-direction: column;
//     align-items: flex-start;
//     gap: 10px;
//   }
// }
//       `}</style>
//     </div>
//   );
// };

// export default CookiesConsent;


