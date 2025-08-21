import { useState } from 'react';

const useTemporaryLoading = () => {
    const [loading, setLoading] = useState(false);

    const triggerLoading = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return { loading, triggerLoading };
};

export default useTemporaryLoading;
