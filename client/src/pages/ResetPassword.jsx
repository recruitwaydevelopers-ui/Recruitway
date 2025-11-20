import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/auth-context';

const ResetPassword = () => {
  const { token } = useParams();
  const { server } = useAuthContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    newPassword: false,
    confirmPassword: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation

    const contain = (password) => {
      const regex = /^(?=.*[A-Z])(?=.*\d).+$/;
      return regex.test(password);
    };

    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Both password fields are required');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (!contain(formData.newPassword)) {
      return setError("Password must include a number and uppercase letter.");
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${server}/api/v1/auth/reset-password/${token}`,
        { newPassword: formData.newPassword }
      );
      toast.success(response.data.message);
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="position-absolute top-50 start-50 translate-middle w-100">
        <div className="container-fluid">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                {error && (
                  <div className={'alert alert-danger p-2 small d-flex align-items-center'}>
                    <i className="ti ti-lock me-2"></i>
                    {error}
                  </div>
                )}
                <div className="card shadow-sm">
                  <div className="card-header bg-primary">
                    <h2 className="h6 mb-0 text-center text-white">
                      <i className="ti ti-key me-2"></i>
                      Reset Your Password
                    </h2>
                  </div>
                  <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">
                          New Password
                        </label>
                        <div className="input-group">
                          <input
                            type={passwordVisibility.newPassword ? 'text' : 'password'}
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
                            onClick={() => togglePasswordVisibility('newPassword')}
                          >
                            <i className={`ti ti-eye${passwordVisibility.newPassword ? '-off' : ''}`}></i>
                          </button>
                        </div>
                        <div className="form-text">Must be at least 8 characters</div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm Password
                        </label>
                        <div className="input-group">
                          <input
                            type={passwordVisibility.confirmPassword ? 'text' : 'password'}
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
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                          >
                            <i className={`ti ti-eye${passwordVisibility.confirmPassword ? '-off' : ''}`}></i>
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
                              Resetting...
                            </>
                          ) : (
                            'Reset Password'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
