const ContactPage = () => {

    const handleSubmit = () => {

    }

    return (
        <main className="d-flex align-items-center justify-content-center min-vh-100 bg-light" style={{ fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }} >
            <div className="container my-3 my-md-5 py-3 py-md-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        {/* Header Section */}
                        <div className="text-center mb-5">
                            <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-4" style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-headset text-primary" style={{ fontSize: '2.5rem' }}></i>
                            </div>
                            <h1 className="display-5 fw-bold mb-3">Contact Support</h1>
                            <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
                                Our dedicated support team is ready to assist you. Reach out through any of the channels below.
                            </p>
                        </div>

                        {/* Contact Form Card */}
                        <div className="card shadow-sm border-0 mb-5 overflow-hidden">
                            <div className="card-header bg-primary text-white py-3">
                                <h4 className="mb-0 fw-semibold">Send us a message</h4>
                            </div>
                            <div className="card-body p-4 p-md-5">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control" id="name" placeholder="Full Name" required />
                                                <label htmlFor="name" className="text-muted">Full Name</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating mb-3">
                                                <input type="email" className="form-control" id="email" placeholder="Email Address" required />
                                                <label htmlFor="email" className="text-muted">Email Address</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control" id="subject" placeholder="Subject" required />
                                                <label htmlFor="subject" className="text-muted">Subject</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <textarea className="form-control" id="message" placeholder="Your Message" style={{ height: '150px' }} required></textarea>
                                                <label htmlFor="message" className="text-muted">Your Message</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-check mb-4">
                                                <input className="form-check-input" type="checkbox" id="copyMe" />
                                                <label className="form-check-label" htmlFor="copyMe">
                                                    Send a copy of this message to my email
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-12 text-center">
                                            <button type="submit" className="btn btn-primary btn-lg px-5 py-3 fw-semibold">
                                                Send Message <i className="bi bi-send-fill ms-2"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Contact Options */}
                        <div className="row g-4 mb-5">
                            <div className="col-md-4">
                                <div className="card h-100 border-0 shadow-sm hover-card">
                                    <div className="card-body text-center p-4">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
                                            <i className="bi bi-envelope-fill text-primary" style={{ fontSize: '1.5rem' }}></i>
                                        </div>
                                        <h5 className="fw-bold mb-2">Email Us</h5>
                                        <p className="mb-0">support@example.com</p>
                                        <p className="text-muted small">Response within 24 hours</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card h-100 border-0 shadow-sm hover-card">
                                    <div className="card-body text-center p-4">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
                                            <i className="bi bi-telephone-fill text-primary" style={{ fontSize: '1.5rem' }}></i>
                                        </div>
                                        <h5 className="fw-bold mb-2">Call Us</h5>
                                        <p className="mb-0">+1 (555) 123-4567</p>
                                        <p className="text-muted small">Mon-Fri 9AM-5PM EST</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card h-100 border-0 shadow-sm hover-card">
                                    <div className="card-body text-center p-4">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
                                            <i className="bi bi-chat-dots-fill text-primary" style={{ fontSize: '1.5rem' }}></i>
                                        </div>
                                        <h5 className="fw-bold mb-2">Live Chat</h5>
                                        <p className="mb-0">Available 24/7</p>
                                        <button className="btn btn-sm btn-outline-primary mt-2">Start Chat</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="card border-0 shadow-sm mb-5">
                            <div className="card-header bg-white py-3">
                                <h4 className="mb-0 fw-semibold">Frequently Asked Questions</h4>
                            </div>
                            <div className="card-body">
                                <div className="accordion" id="faqAccordion">
                                    <div className="accordion-item border-0 mb-3">
                                        <h2 className="accordion-header">
                                            <button className="accordion-button fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq1" aria-expanded="true">
                                                How long does it take to get a response?
                                            </button>
                                        </h2>
                                        <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                                            <div className="accordion-body">
                                                We typically respond to all inquiries within 24 hours. For urgent matters, please use our live chat feature for immediate assistance.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item border-0 mb-3">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq2" aria-expanded="false">
                                                What information should I include in my message?
                                            </button>
                                        </h2>
                                        <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                            <div class="accordion-body">
                                                Please include as much detail as possible about your issue, including any error messages, steps to reproduce the problem, and your account information.
                                            </div>
                                        </div>
                                    </div>
                                    <div class="accordion-item border-0">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq3" aria-expanded="false">
                                                Do you offer phone support?
                                            </button>
                                        </h2>
                                        <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                            <div class="accordion-body">
                                                Yes, we offer phone support Monday through Friday from 9AM to 5PM EST. For urgent issues outside of these hours, please use our live chat feature.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Back Button */}
                        <div className="text-center">
                            <button className="btn btn-outline-secondary px-4 py-2" onClick={() => navigate(-1)}>
                                <i className="bi bi-arrow-left-circle me-2"></i> Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .hover-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .accordion-button:not(.collapsed) {
            color: var(--bs-primary);
            background-color: rgba(67, 97, 238, 0.1);
        }
        
        .accordion-button:focus {
            box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.25);
        }
        
        .form-control:focus, .form-select:focus {
            border-color: var(--bs-primary);
            box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.25);
        }
        
        .btn-primary {
            background-color: var(--bs-primary);
            border-color: var(--bs-primary);
        }
        
        .btn-primary:hover {
            background-color: #3a56d4;
            border-color: #3a56d4;
        }
        
        @media (max-width: 768px) {
            .display-5 {
                font-size: 1.75rem;
            }
            .lead {
                font-size: 1rem;
            }
        }
    `}</style>
        </main>
    )
}

export default ContactPage