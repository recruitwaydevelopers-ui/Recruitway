import React, { useEffect, useState } from 'react';

const LogoAnimation = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    return (
        isLoading && (
            <div
                className="d-flex justify-content-center align-items-center position-absolute w-100 h-100"
                style={{ top: 0, left: 0, backgroundColor: 'rgb(255, 255, 255)', zIndex: 9999 }}
            >
                <img src="/images/logos/favicon.ico" alt="Logo" />
            </div>
        )
    );
};

export default LogoAnimation

