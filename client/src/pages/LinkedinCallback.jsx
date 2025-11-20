import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/auth-context";

const LinkedinCallback = () => {
    const { server, loading, handleLinkedinCallback } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        handleLinkedinCallback(window.location.search);
    }, [navigate, server]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Processing LinkedIn login...</span>
                </div>
            </div>
        );
    }

    return null;
};

export default LinkedinCallback;
