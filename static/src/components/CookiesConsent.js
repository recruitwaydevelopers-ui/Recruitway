// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";

// const CookiesConsent = () => {
//     const [showBanner, setShowBanner] = useState(false);

//     useEffect(() => {
//         const consent = Cookies.get("cookieConsent");
//         if (!consent) {
//             setShowBanner(true);
//         }
//     }, []);

//     const handleAccept = () => {
//         Cookies.set("cookieConsent", "accepted", { expires: 365 });
//         setShowBanner(false);
//     };

//     const handleReject = () => {
//         Cookies.set("cookieConsent", "rejected", { expires: 365 });
//         setShowBanner(false);
//     };

//     if (!showBanner) return null;

//     return (
//         <div
//             style={{
//                 position: "fixed",
//                 bottom: 0,
//                 left: 0,
//                 width: "100%",
//                 background: "#fff",
//                 color: "#000",
//                 padding: "20px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
//                 zIndex: 9999,
//             }}
//         >
//             {/* Text */}
//             <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5" }}>
//                 We use cookies to personalise content and ads, to provide social media
//                 features and to analyse our traffic. We also disclose information about
//                 your use of our site with our social media, advertising and analytics
//                 partners. Additional details are available in our{" "}
//                 <a
//                     href="/PrivacyPolicy"
//                     style={{ color: "#001f3f", fontWeight: "bold", textDecoration: "none" }}
//                 >
//                     Cookie Policy
//                 </a>
//                 .
//             </p>

//             {/* Buttons */}
//             <div style={{ display: "flex", gap: "10px" }}>
//                 <button
//                     onClick={handleReject}
//                     style={{
//                         padding: "8px 16px",
//                         background: "transparent",
//                         border: "1px solid #001f3f",
//                         color: "#001f3f",
//                         borderRadius: "4px",
//                         cursor: "pointer",
//                     }}
//                 >
//                     Accept Cookies
//                 </button>
//                 <button
//                     onClick={handleAccept}
//                     style={{
//                         padding: "8px 16px",
//                         background: "#001f3f",
//                         border: "none",
//                         color: "#fff",
//                         borderRadius: "4px",
//                         cursor: "pointer",
//                         fontWeight: "bold",
//                     }}
//                 >
//                     Reject Cookies
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default CookiesConsent;






    



import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const API_URL = process.env.REACT_APP_SERVER || "http://localhost:5000";
const CONSENT_KEY = "cookieConsent_v1";
const ANON_KEY = "anonId";


const CookiesConsent = () => {
    const [visible, setVisible] = useState(false);

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
        if (!raw) setVisible(true);
    }, []);

    const persistAndSend = async (consent) => {
        const payload = { ...consent, savedAt: new Date().toISOString() };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
        setVisible(false);

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
        <div className="cookie-banner position-fixed bottom-0 start-0 end-0 bg-dark text-white p-3 d-flex justify-content-between align-items-center" style={{ zIndex: 9999 }}>
            <p className="mb-0">We use cookies to personalize content and analyze traffic.</p>
            <div>
                <button className="btn btn-success btn-sm me-2" onClick={() => persistAndSend({ essential: true, analytics: true, marketing: true })}>Accept All</button>
                <button className="btn btn-secondary btn-sm" onClick={() => persistAndSend({ essential: true, analytics: false, marketing: false })}>Decline</button>
            </div>
        </div>
    );
};

export default CookiesConsent;







