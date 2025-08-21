import { useEffect, useRef, useState } from "react";

const PasswordCheck = ({ show, onClose, onVerify }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const modalRef = useRef();

    useEffect(() => {
        if (show) {
            const modal = new bootstrap.Modal(modalRef.current);
            modal.show();

            const handleHide = () => {
                setPassword('');
                setError('');
                onClose();
            };

            modalRef.current.addEventListener('hidden.bs.modal', handleHide);

            return () => {
                modalRef.current.removeEventListener('hidden.bs.modal', handleHide);
            };
        }
    }, [show]);

    const handleVerify = () => {
        if (!password) {
            setError('Password is required');
            return;
        }

        setError('');
        onVerify(password);
        const modal = bootstrap.Modal.getInstance(modalRef.current);
        modal.hide();
    };

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm Password</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className={`form-control ${error ? 'is-invalid' : ''}`}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <div className="invalid-feedback">{error}</div>}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            data-bs-dismiss="modal"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={handleVerify}
                        >
                            Verify
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordCheck