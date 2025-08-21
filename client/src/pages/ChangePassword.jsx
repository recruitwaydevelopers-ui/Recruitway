import React, { useState } from "react";
import axios from 'axios';
import { useAuthContext } from "../context/auth-context";

const ChangePassword = () => {
    const { server, token } = useAuthContext();
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState({ text: "", type: "" });

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        const contain = (password) => {
            const regex = /^(?=.*[A-Z])(?=.*\d).+$/;
            return regex.test(password);
        };

        if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
            setError({ text: "All fields are required", type: "error" });
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError({ text: "New password and confirm password do not match", type: "error" });
            return;
        }

        if (formData.newPassword.length < 8) {
            setError({ text: "Password must be at least 8 characters", type: "error" });
            return;
        }

        if (!contain(formData.newPassword)) {
            return setError({ text: "Password must include a number and uppercase letter.", type: "error" });
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(`${server}/api/v1/auth/change-password`,
                {
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setError({ text: response.data.message, type: "success" });
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error) {
            setError({ text: error.response?.data?.message || "Failed to change password", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="container-fluid">
                <div className="container">
                    {error.text && (
                        <div className={`alert alert-${error.type === 'success' ? 'success' : 'danger'} p-2 small d-flex align-items-center`}>
                            {error.type === 'success' ? <i className="ti ti-check me-2"></i> : <i className="ti ti-lock me-2"></i>}
                            {error.text}
                        </div>
                    )}
                    <div className="row justify-content-center">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h2 className="h6 mb-0 text-center text-white">
                                    <i className="ti ti-key me-2"></i>
                                    Change Password
                                </h2>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleChangePassword}>
                                    {/* Old Password */}
                                    <div className="mb-3">
                                        <label htmlFor="oldPassword" className="form-label">
                                            Current Password
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={showPasswords.old ? "text" : "password"}
                                                className="form-control form-control-sm"
                                                id="oldPassword"
                                                name="oldPassword"
                                                value={formData.oldPassword}
                                                onChange={handleInputChange}
                                                placeholder="Enter current password"
                                                required
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => togglePasswordVisibility('old')}
                                            >
                                                <i className={`ti ti-eye${showPasswords.old ? '-off' : ''}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div className="mb-3">
                                        <label htmlFor="newPassword" className="form-label">
                                            New Password
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={showPasswords.new ? "text" : "password"}
                                                className="form-control form-control-sm"
                                                id="newPassword"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                                placeholder="Enter new password"
                                                required
                                                minLength="8"
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => togglePasswordVisibility('new')}
                                            >
                                                <i className={`ti ti-eye${showPasswords.new ? '-off' : ''}`}></i>
                                            </button>
                                        </div>
                                        <div className="form-text">Must be at least 8 characters</div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            Confirm New Password
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={showPasswords.confirm ? "text" : "password"}
                                                className="form-control form-control-sm"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="Confirm new password"
                                                required
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => togglePasswordVisibility('confirm')}
                                            >
                                                <i className={`ti ti-eye${showPasswords.confirm ? '-off' : ''}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-sm"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Changing...
                                                </>
                                            ) : (
                                                "Change Password"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;



// import React, { useState } from "react";
// import axios from 'axios';
// import { useAuthContext } from "../context/auth-context";
// import toast from "react-hot-toast";

// const ChangePassword = () => {
//     const { server, token } = useAuthContext();
//     const [formData, setFormData] = useState({
//         oldPassword: "",
//         newPassword: "",
//         confirmPassword: ""
//     });
//     const [errors, setErrors] = useState({});
//     const [showPasswords, setShowPasswords] = useState({
//         old: false,
//         new: false,
//         confirm: false
//     });
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const togglePasswordVisibility = (field) => {
//         setShowPasswords(prev => ({
//             ...prev,
//             [field]: !prev[field]
//         }));
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//         setErrors(prev => ({ ...prev, [name]: "" }));
//     };

//     const handleChangePassword = async (e) => {
//         e.preventDefault();
//         const { oldPassword, newPassword, confirmPassword } = formData;
//         const newErrors = {};

//         const contain = (password) => {
//             const regex = /^(?=.*[A-Z])(?=.*\d).+$/;
//             return regex.test(password);
//         };

//         if (!oldPassword) newErrors.oldPassword = "Current password is required.";
//         if (!newPassword) newErrors.newPassword = "New password is required.";
//         if (!confirmPassword) newErrors.confirmPassword = "Please confirm new password.";
//         if (newPassword && newPassword.length < 8) newErrors.newPassword = "Must be at least 8 characters.";
//         if (newPassword && !contain(newPassword)) newErrors.newPassword = "Must include uppercase and number.";
//         if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors);
//             return;
//         }

//         setIsSubmitting(true);
//         try {
//             const res = await axios.post(`${server}/api/v1/auth/change-password`, {
//                 oldPassword,
//                 newPassword
//             }, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             toast.success(res.data.message)
//             setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
//         } catch (error) {
//             setErrors({ oldPassword: error.response?.data?.message || "Failed to change password" });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <>
//             <div className="container-fluid">
//                 <div className="container">
//                     <div className="row justify-content-center">
//                         <div className="card shadow-sm">
//                             <div className="card-header bg-primary text-white text-center">
//                                 <h2 className="h6 mb-0">
//                                     <i className="ti ti-key me-2"></i>
//                                     Change Password
//                                 </h2>
//                             </div>
//                             <div className="card-body p-4">
//                                 <form onSubmit={handleChangePassword} noValidate>
//                                     {/* Current Password */}
//                                     <div className="mb-3">
//                                         <label className="form-label">Current Password</label>
//                                         <div className="input-group">
//                                             <input
//                                                 type={showPasswords.old ? "text" : "password"}
//                                                 name="oldPassword"
//                                                 className={`form-control form-control-sm ${errors.oldPassword ? "is-invalid" : ""}`}
//                                                 value={formData.oldPassword}
//                                                 onChange={handleInputChange}
//                                                 placeholder="Enter current password"
//                                             />
//                                             <button type="button" className="btn btn-outline-secondary" onClick={() => togglePasswordVisibility('old')}>
//                                                 <i className={`ti ti-eye${showPasswords.old ? '-off' : ''}`}></i>
//                                             </button>
//                                             {errors.oldPassword && <div className="invalid-feedback">{errors.oldPassword}</div>}
//                                         </div>
//                                     </div>

//                                     {/* New Password */}
//                                     <div className="mb-3">
//                                         <label className="form-label">New Password</label>
//                                         <div className="input-group">
//                                             <input
//                                                 type={showPasswords.new ? "text" : "password"}
//                                                 name="newPassword"
//                                                 className={`form-control form-control-sm ${errors.newPassword ? "is-invalid" : ""}`}
//                                                 value={formData.newPassword}
//                                                 onChange={handleInputChange}
//                                                 placeholder="Enter new password"
//                                             />
//                                             <button type="button" className="btn btn-outline-secondary" onClick={() => togglePasswordVisibility('new')}>
//                                                 <i className={`ti ti-eye${showPasswords.new ? '-off' : ''}`}></i>
//                                             </button>
//                                             {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
//                                         </div>
//                                     </div>

//                                     {/* Confirm Password */}
//                                     <div className="mb-4">
//                                         <label className="form-label">Confirm New Password</label>
//                                         <div className="input-group">
//                                             <input
//                                                 type={showPasswords.confirm ? "text" : "password"}
//                                                 name="confirmPassword"
//                                                 className={`form-control form-control-sm ${errors.confirmPassword ? "is-invalid" : ""}`}
//                                                 value={formData.confirmPassword}
//                                                 onChange={handleInputChange}
//                                                 placeholder="Confirm new password"
//                                             />
//                                             <button type="button" className="btn btn-outline-secondary" onClick={() => togglePasswordVisibility('confirm')}>
//                                                 <i className={`ti ti-eye${showPasswords.confirm ? '-off' : ''}`}></i>
//                                             </button>
//                                             {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
//                                         </div>
//                                     </div>

//                                     <div className="d-grid">
//                                         <button className="btn btn-primary btn-sm" disabled={isSubmitting}>
//                                             {isSubmitting ? (
//                                                 <>
//                                                     <span className="spinner-border spinner-border-sm me-2"></span>
//                                                     Changing...
//                                                 </>
//                                             ) : "Change Password"}
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ChangePassword;
