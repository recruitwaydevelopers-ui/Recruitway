import React from 'react'
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";
import Requestdemo from "../components/Requestdemo";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaPlus } from "react-icons/fa";


export default function Interviewers() {
  return (
    <>
    {/* Navigation Bar Two*/}
    <NavbarTwo />

{/* About Area Two */}
 <div className='about-area bg-gradient-gray pd-top-60 pd-bottom-60'>
        <div className='container'>
          <div className='row align-items-center'>
            <div className='col-lg-6 wow animated'data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
              <div className='section-title mb-0'>
                <h2 className='title'>
                Become an Interviewer and Shape the Future of Hiring.
                </h2>
                <p className='content mb-4'>
                Join our expert network and help top companies identify the best tech talent. Share your expertise, earn on your schedule, and make a real impact on how teams are built.
                </p>
                  <Link to='https://www.linkedin.com/company/recruitway' target="_blank">
                  <span className='btn btn-border-base'>Connect with LinkedIn</span>
                  </Link>
              </div>
            </div>
            <div className='col-lg-6 col-md-9' data-aos='fade-up' data-aos-delay='100' data-aos-duration='1500'>
              <div className='banner-thumb-2 mt-4 mt-lg-0 text-center'>
              <video
                className="bg-shape"
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", maxWidth: "450px", paddingTop: "2px", borderRadius: "15px" }}
              >
                <source src="/assets/video/video-4.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          </div>
        </div>
      </div>
     {/* why choose us  */}
     <div className='about-area pd-top-60 pd-bottom-60'>
        <div className='container'>
          <div className='row'>
            <div
              className='col-lg-6 mb-4 mb-lg-0 '
              data-aos='fade-right'
              data-aos-delay='100'
              data-aos-duration='1500'
            >
              <div className='about-thumb-inner'>
                <img
                  className='main-img'
                  src='assets/img/about/Why-Join-Us.png'
                  alt='img'
                />
              </div>
            </div>
            <div
              className='col-lg-6 '
              data-aos='fade-left'
              data-aos-delay='100'
              data-aos-duration='1500'
            >
              <div className='section-title mb-0'>
                <h2 className='title'>
                 Why Join Us as an Interviewer?
                </h2>
                <p className='content mb-4'>
                Join a community of expert interviewers and enjoy these benefits:
                </p>
                <div className='row'>
                  <div className='col-md-6'>
                    <ul className='single-list-inner style-check style-heading style-check mb-3'>
                      <li>
                        <FaCheckCircle /> Professional Growth
                      </li>
                      <li>
                        <FaCheckCircle /> Flexible Schedule
                      </li>
                    </ul>
                  </div>
                  <div className='col-md-6'>
                    <ul className='single-list-inner style-check style-heading style-check mb-3'>
                      <li>
                        <FaCheckCircle /> Competitive Compensation
                      </li>
                      <li>
                        <FaCheckCircle /> Impact
                      </li>
                    </ul>
                  </div>
                </div>
                <p className='content'>Join us as an interviewer to shape the future by identifying top talent, enhancing your leadership skills, gaining industry insights, boosting your personal brand, expanding your professional network, improving decision-making, developing interview techniques, building team culture, inspiring future leaders, and making a meaningful impact—all while contributing to a dynamic, growth-focused, collaborative, innovative, and inclusive environment that values your expertise and experience.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
     {/* end why choose us section  */}
    {/* work process two  */}
      <div className='work-process-area  bg-gray  pd-top-120 pd-bottom-90'>
        <div className='container'>
          <div className='section-title text-center'>
            <h2 className='title'>
              How Does It Work?
            </h2>
            <h5>Follow these simple steps to get started as an interviewer</h5>
          </div>
          <div className='row'>
            <div className='col-xl-4 col-md-6'>
              <div className='single-work-process-inner'>
                <div className='thumb mb-3'>
                  <img src='assets/img/icons/signup.png' alt='img' />
                </div>
                <div className='details'>
                  <h5 className='mb-3'>Sign Up</h5>
                  <p className='content'>
                  Create your profile and fill out your information.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-xl-4 col-md-6'>
              <div className='single-work-process-inner'>
                <div className='thumb mb-3'>
                  <img src='assets/img/icons/availability.png' alt='img' />
                </div>
                <div className='details'>
                  <h5 className='mb-3'>Set Availability</h5>
                  <p className='content'>
                  Select availability for interview scheduling
                  </p>
                </div>
              </div>
            </div>
            <div className='col-xl-4 col-md-6'>
              <div className='single-work-process-inner'>
                <div className='thumb mb-3'>
                  <img src='assets/img/icons/request.png' alt='img' />
                </div>
                <div className='details'>
                  <h5 className='mb-3'>Receive Requests</h5>
                  <p className='content'>
                  Get notified of interview requests for you.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-xl-4 col-md-6'>
              <div className='single-work-process-inner'>
                <div className='thumb mb-3'>
                  <img src='assets/img/icons/interview-1.png' alt='img' />
                </div>
                <div className='details'>
                  <h5 className='mb-3'>Conduct Interviews</h5>
                  <p className='content'>
                  Use our platform to conduct video interviews.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-xl-4 col-md-6'>
              <div className='single-work-process-inner'>
                <div className='thumb mb-3'>
                  <img src='assets/img/icons/feedback.png' alt='img' />
                </div>
                <div className='details'>
                  <h5 className='mb-3'>Submit Feedback</h5>
                  <p className='content'>
                  Provide detailed feedback for each candidate.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-xl-4 col-md-6'>
              <div className='single-work-process-inner'>
                <div className='thumb mb-3'>
                  <img src='assets/img/icons/cashless-payment.png' alt='img' />
                </div>
                <div className='details'>
                  <h5 className='mb-3'>Receive Payment</h5>
                  <p className='content'>
                  Get compensated for your time and expertise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* tools and resouces */}
      <div className='about-area pd-top-120'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
              <div
                className='about-thumb-inner pe-xl-5 me-xl-5 'data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
              >
              <img
                  className='main-img'
                  src='assets/img/about/Tools-&-Resources.png'
                  alt='img'
                />
              </div>
            </div>
            <div
              className='col-lg-6 '
            data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='section-title mt-5 mt-lg-0'>
                <h2 className='title'>
                 Tools and Resources
                </h2>
                <p className='content mb-4 mb-xl-5'>
                We provide all the tools and resources you need to conduct effective technical interviews.
                </p>
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='single-about-inner'>
                      <div className='thumb mb-3'>
                        <img src='assets/img/icons/video-conference.png' alt='img' />
                      </div>
                      <div className='details'>
                        <h5>Video Conferencing</h5>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='single-about-inner'>
                      <div className='thumb mb-3'>
                        <img src='assets/img/icon/3.png' alt='img' />
                      </div>
                      <div className='details'>
                        <h5>Code Editors</h5>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='single-about-inner'>
                      <div className='thumb mb-3'>
                        <img src='assets/img/icons/code-editor.png' alt='img' />
                      </div>
                      <div className='details'>
                        <h5>Interview Templates</h5>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='single-about-inner'>
                      <div className='thumb mb-3'>
                        <img src='assets/img/icons/feedback.png' alt='img' />
                      </div>
                      <div className='details'>
                        <h5>Feedback Forms</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

{/* counter request demo  */}
{/* Blog Area Two */}
<Requestdemo/>
{/* Footer Two */}
<FooterTwo />
    </>
  )
}
