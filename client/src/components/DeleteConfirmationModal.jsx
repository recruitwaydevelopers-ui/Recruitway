import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                        <button type="button" className="btn-close bg-primary" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to delete this job post?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-sm btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn btn-sm btn-danger" onClick={onConfirm}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;

