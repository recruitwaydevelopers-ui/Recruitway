import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from 'axios';
import { useAuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
  const { server, token, logout } = useAuthContext()
  const navigate = useNavigate()

  const [confirmationInput, setConfirmationInput] = useState("");
  const [password, setPassword] = useState("")
  const [error, setError] = useState();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (confirmationInput !== "DELETE") {
      setError("Please type 'DELETE' to confirm account deletion.");
      return;
    }

    try {
      toast.loading("Please Wait...")
      const response = await axios.delete(`${server}/api/v1/auth/delete-account`,
        {
          data: { password },
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
      const { message } = response.data
      console.log(message);

      logout()
      toast.dismiss()
      toast.success(message)
      navigate("https://recruitway.ai/")
    } catch (error) {
      toast.dismiss()
      toast.error(error.response.data.message)
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="container">
          {error && (
            <div className={'alert alert-danger p-2 small d-flex align-items-center'}>
              <i className="ti ti-lock me-2"></i>
              {error}
            </div>
          )}
          <div className="row justify-content-center">
            <div className="card shadow-sm">
              <div className="card-header bg-danger text-white">
                <h2 className="h6 mb-0 text-center text-white">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Delete Account
                </h2>
              </div>
            </div>
            <div className="card-body">
              <div className="alert p-2 small alert-warning">
                <i className="bi bi-exclamation-octagon-fill me-2"></i>
                Deleting your account is a permanent action and cannot be undone.
              </div>

              <form onSubmit={handleDeleteAccount}>
                <div className="mb-3">
                  <label htmlFor="passwordInput" className="form-label">
                    Please Enter Your Password:
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      id="passwordInput"
                      className="form-control form-control-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmationInput" className="form-label">
                    Type 'DELETE' to confirm:
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-shield-exclamation"></i>
                    </span>
                    <input
                      type="text"
                      id="confirmationInput"
                      className="form-control form-control-sm"
                      value={confirmationInput}
                      onChange={(e) => setConfirmationInput(e.target.value)}
                      placeholder="Type DELETE"
                      required
                    />
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-danger btn-sm"
                  >
                    <i className="bi bi-trash-fill me-2"></i>
                    Delete Account Permanently
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-muted text-center">
              <small>This action cannot be undone. All your data will be permanently deleted.</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteAccount;
