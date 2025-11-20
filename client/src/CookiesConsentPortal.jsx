import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "./context/auth-context";

const CookiesConsentPortal = () => {
    const { user, server } = useAuthContext();
    const userId = user?.userId;

    const [consent, setConsent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const updateGTMConsent = (consent) => {
        if (!window.gtag) return;
        window.gtag("consent", "update", {
            analytics_storage: consent.analytics ? "granted" : "denied",
            ad_storage: consent.marketing ? "granted" : "denied",
        });
    };

    useEffect(() => {
        const fetchConsent = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const { data } = await axios.get(`${server}/api/v1/consent/${userId}`);
                if (data?.consent) {
                    setConsent(data.consent);
                    updateGTMConsent(data.consent);
                } else {
                    // Migrate anon
                    const anonIdMatch = document.cookie.match(/anonId=([^;]+)/);
                    if (anonIdMatch) {
                        const anonId = anonIdMatch[1];
                        const { data: migrated } = await axios.post(`${server}/api/v1/consent/migrate`, { userId, anonId });
                        if (migrated?.record) {
                            setConsent(migrated.record.consent);
                            updateGTMConsent(migrated.record.consent);
                        }
                    }
                }
            } catch (err) {
                console.error("Consent fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchConsent();
    }, [userId, server]);

    const handleCheckboxChange = (type) => {
        const updated = { ...consent, [type]: !consent[type] };
        setConsent(updated);
        updateGTMConsent(updated);
        axios.post(`${server}/api/v1/consent`, { userId, consent: updated }).catch(console.error);
    };

    if (loading) return null;

    return (
        <>
            <button className="btn btn-warning ms-2" onClick={() => setModalOpen(true)}>🍪 Cookies</button>
            {modalOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
                    <div className="bg-white p-4 rounded shadow" style={{ minWidth: "300px" }}>
                        <h5>Cookie Preferences</h5>
                        <hr />
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="checkbox" checked disabled />
                            <label className="form-check-label">Essential (required)</label>
                        </div>
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="checkbox" checked={consent?.analytics} onChange={() => handleCheckboxChange("analytics")} />
                            <label className="form-check-label">Analytics</label>
                        </div>
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="checkbox" checked={consent?.marketing} onChange={() => handleCheckboxChange("marketing")} />
                            <label className="form-check-label">Marketing</label>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookiesConsentPortal;
