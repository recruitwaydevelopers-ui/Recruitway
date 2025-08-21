import React, { useState } from 'react';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('change');

  return (
    <>
      <div className="container-fluid">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow">
                <div className="card-header bg-primary">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-shield-lock fs-7 me-2 text-white"></i>
                    <div>
                      <h2 className="h5 mb-0 text-white">Account Security</h2>
                      <p className="text-muted small mb-0 text-white">Manage your password and security settings</p>
                    </div>
                  </div>
                </div>

                <div className="card-body pt-0">
                  <div className="card shadow-sm mb-4">
                    <div className="card-body p-2">
                      <ul className="nav nav-pills gap-2">
                        <li className="nav-item">
                          <button
                            type="button"
                            className={`btn btn-sm ${activeTab === 'change' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                            onClick={() => setActiveTab('change')}
                          >
                            <i className="ti ti-key me-2"></i>
                            Change Password
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            type="button"
                            className={`btn btn-sm ${activeTab === 'delete' ? 'btn-danger' : 'btn-outline-danger'} me-2`}
                            onClick={() => setActiveTab('delete')}
                          >
                            <i className="ti ti-lock me-2"></i>
                            Delete Account
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="tab-content p-3 border-top-0 border">
                  {activeTab === 'change' && (
                    <ChangePassword />
                  )}
                  {activeTab === 'delete' && (
                    <DeleteAccount />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;