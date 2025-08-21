import React from "react";
import {
  FaChevronRight,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const FooterTwo = () => {
  return (
    <>
      {/* ================== Footer Two Start ==================*/}
      <footer className='footer-area footer-area-2 bg-gray mt-0 pd-top-60'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-3 col-md-6'>
              <div className='widget'>
                <div className='thumb'>
                   <Link to='/'><img src='assets/img/logo-re.png' alt='img' /></Link>
                </div>
                <div className='details'>
                  <p>
                    Empowering your tech hiring with precision and integrity. Ensuring the best fit for your team through expert-driven assessments and unbiased evaluations.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-lg-3 col-md-6 ps-xl-5'>
              <div className='widget widget_nav_menu'>
                <h4 className='widget-title'>Our Service</h4>
                <ul>
                  <li>
                    <Link to='/InterviewOutsourcing'>
                      <FaChevronRight /> Interview Outsourcing
                    </Link>
                  </li>
                  <li>
                    <Link to='/RoleFit'>
                      <FaChevronRight /> Role Fit
                    </Link>
                  </li>
                  <li>
                    <Link to='/RecordedInterviews'>
                      <FaChevronRight /> Recorded Interviews
                    </Link>
                  </li>
                  <li>
                    <Link to='/RoIanalysis'>
                      <FaChevronRight /> ROI Analysis
                    </Link>
                  </li>
                  <li>
                    <Link to='/Assessments'>
                      <FaChevronRight /> Assessments
                    </Link>
                  </li>
                  <li>
                    <Link to='/MockInterviews'>
                      <FaChevronRight /> Mock Interviews
                    </Link>
                  </li>
                  <li>
                    <Link to='/SeamlesScheduling'>
                      <FaChevronRight /> Seamless Scheduling
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-lg-3 col-md-6 ps-xl-5'>
              <div className='widget widget_nav_menu'>
                <h4 className='widget-title'>Resources</h4>
                <ul>
                  <li>
                    <Link to='/Interviewers' name="">
                      <FaChevronRight /> Interviewers
                    </Link>
                  </li>
                  <li>
                    <Link to='/Request'>
                      <FaChevronRight /> Contact us
                    </Link>
                  </li>
                  <li>
                    <Link to='/Blog'>
                      <FaChevronRight /> Blog
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-lg-3 col-md-6'>
              <div className='widget widget-recent-post'>
                <h4 className='widget-title'>Contact us</h4>
                <div className='widget widget_contact'>
                  <ul className='details'>
                    <li>
                      <FaMapMarkedAlt />
                      21A, Glenamuck south, Carrickmines, Dublin, Ireland
                    </li>
                    <a href="tel:+353-892061767">
                     <FaPhoneAlt /> +353-892061767
                        </a>
                        <li className='mt-2'>
                        <a href="mailto:inforecruitway.com">
                       <FaEnvelope /> inforecruitway.com
                       </a>
                     </li>
                  </ul>
                  <ul className='social-media mt-4'>
                    <li>
                      <a href='https://www.facebook.com/profile.php?id=61559876019370' target="_blank">
                        <FaFacebookF />
                      </a>
                    </li>
                    <li>
                      <a href='https://x.com/recruitWayAI' target="_blank">
                        <FaTwitter />
                      </a>
                    </li>
                    <li>
                      <a href='https://www.instagram.com/recruitway.ie' target="_blank">
                        <FaInstagram />
                      </a>
                    </li>
                    <li>
                      <a href='https://www.linkedin.com/company/recruitway' target="_blank">
                      <FaLinkedin/>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='footer-bottom'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-6 align-self-center'>
                <p>© 2025 Recruitway | All Rights Reserved</p>
              </div>
              <div className='col-md-6 text-lg-end'>
               <Link to='/PrivacyPolicy'>Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ================== Footer Two  end ==================*/}
    </>
  );
};
export default FooterTwo;
