import React, { useState, useEffect } from 'react';

const SuperAdminInterviewerModal = ({ show, onHide, onSave }) => {
    const [formData, setFormData] = useState({
        // fullname: '',
        // email: '',
        // position: ''
        email: '',
        password: ''
    });

    useEffect(() => {
        setFormData({ email: '', password: '' });
    }, []);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSave(formData);
        onHide();
    };

    return (
        <div className={`modal ${show ? 'd-block' : 'd-none'}`} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Interviewer</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        <input className="form-control mb-2" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                        <input className="form-control mb-2" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onHide}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminInterviewerModal;
