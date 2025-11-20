import NavbarTwo from "../components/NavbarTwo";
import FooterTwo from "../components/FooterTwo";
import { useState } from "react";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiMessageSquare,
  FiLoader,
  FiCheckCircle,
  FiAlertTriangle,
  FiPhone,
} from "react-icons/fi";
const server = process.env.REACT_APP_SERVER;

export default function Request() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({ message: "", type: "" })
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: "", type: "" });
    try {
      const res = await axios.post(`${server}/api/v1/contact/sendContact`, formData);
      setStatus({ message: res.data.message, type: "success" });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.log(error);
      
      setStatus({
        message: "Failed to send message. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      {/* Navigation Bar Two*/}
      <NavbarTwo />
      {/* Banner Two */}
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-4">
        <style>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 600ms linear;
          background-color: rgba(255, 255, 255, 0.7);
        }
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>

        <div className="container bg-white rounded-4 shadow p-4 p-lg-5">
          <div className="row g-5">
            {/* === Left Column === */}
            <div className="col-md-6 d-flex flex-column justify-content-between">
              <div>
                <span className="fw-semibold fs-7 text-secondary">Let's Talk</span>
                <h1 className="fw-bold text-primary fs-7 mt-2">How Can We Help</h1>
                <p className="mt-3 text-muted">
                  We’re here to assist you! Reach out for any questions or support.
                </p>
              </div>
              <div className="mt-5">
                <h5 className="fw-bold text-dark">Contact Information</h5>
                <ul className="list-unstyled mt-3">
                  <li className="d-flex align-items-center mb-2">
                    <FiMail className="me-2 text-primary" />
                    <a href='mailto:info@recruitway.ai'>info@recruitway.ai</a>
                  </li>
                  <li className="d-flex align-items-center">
                    <FiPhone className="me-2 text-primary" />
                    <a href='tel:+353-892061767'>+353-892061767</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* === Right Column: Form === */}
            <div className="col-md-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="mb-3">
                  <label className="form-label">Full name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Your name here"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Your email address here"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control"
                    style={{ resize: "none" }}
                    rows="5"
                    placeholder="Your message here"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  onClick={createRipple}
                  className="btn btn-primary w-100 position-relative overflow-hidden"
                >
                  {isLoading ? <FiLoader className="spinner-border-sm me-2" /> : "Submit"}
                </button>
              </form>

              {status.message && (
                <div
                  className={`alert mt-4 d-flex align-items-center justify-content-center text-center ${status.type === "success" ? "alert-success" : "alert-danger"
                    }`}
                  role="alert"
                >
                  {status.type === "success" ? (
                    <FiCheckCircle className="me-2" />
                  ) : (
                    <FiAlertTriangle className="me-2" />
                  )}
                  {status.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Footer Two */}
      <FooterTwo />
    </>
  )
}
