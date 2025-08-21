import React from 'react'
import { Link } from 'react-router-dom'

const WaitingReply = () => {
    return (
        <>
            <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed">
                <div className="position-relative overflow-hidden min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="d-flex align-items-center justify-content-center w-100">
                        <div className="row justify-content-center w-100">
                            <div className="col-lg-5">
                                <div className="text-center">
                                    <img src="/images/logos/logo.webp" alt="Account Verification" className="img-fluid mb-4" />
                                    <h1 className="fw-semibold mb-3 fs-9">Verification in Progress</h1>
                                    <h5 className="fw-normal mb-4 px-3">
                                        Your account is currently under review by our verification team. We are committed to ensuring the security and integrity of all user accounts.
                                    </h5>
                                    <h6 className="fw-light mb-4 px-4 text-muted">
                                        This process typically takes a few minutes. Once the verification is complete, you will receive a confirmation email with the next steps or login instructions.
                                    </h6>
                                    <p className="text-muted mb-4 px-4">
                                        Please check your inbox (and spam folder) for an email from us. If you have any questions in the meantime, feel free to contact our support team.
                                    </p>
                                    <Link className="btn btn-primary" to="/login" role="button">Go to Login</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default WaitingReply