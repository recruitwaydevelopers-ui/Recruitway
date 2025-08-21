import React from "react";
import BannerTwo from "../components/BannerTwo";
import BlogAreaTwo from "../components/BlogAreaTwo";
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";
import ServiceAreaFour from "../components/ServiceAreaFour";
import Requestdemo from "../components/Requestdemo";
import Scrollpage from "../pages/Scrollpage";
import { Link } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const HomeTwo = () => {
  return (
    <>
      {/* Navigation Bar Two */}
      <NavbarTwo />
      
      {/* Banner Two */}
      <BannerTwo />
      
      {/* Why Choose Us */}
      <div className="service-area  bg-border-radius bg-gray bg-relative pd-top-60 pd-bottom-60">
        <div className="container">
          <div className="row wow animated animatedFadeInUp fadeInUp">
            <div className="col-lg-12">
              <div className="section-title mb-0">
                <h2
                  className="title mb-40"
                  data-aos="fade-up"
                  data-aos-delay="100"
                  data-aos-duration="1500"
                >
                  We make it easy to hire great engineers
                </h2>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
              <div className="single-service-inner-3 single-service-inner-3-right">
                <div className="thumb">
                  <div className="thumb-inner">
                    <img src="assets/img/service-icon/01.png" alt="Supercharge Hiring with AI" />
                  </div>
                </div>
                <div className="details ml-15">
                  <h5 className="mb-3">Supercharge Hiring with AI</h5>
                  <p className="mb-0">
                    24/7 automated interviews with GenAI-powered insights and unlimited candidate capacity
                  </p>
                </div>
              </div>
              <div className="single-service-inner-3 single-service-inner-3-right">
                <div className="thumb">
                  <div className="thumb-inner">
                    <img src="assets/img/service-icon/02.png" alt="AI-Driven Talent Identification" />
                  </div>
                </div>
                <div className="details ml-15">
                  <h5 className="mb-3">AI-Driven Talent Identification</h5>
                  <p className="mb-0">
                    Advanced GenAI models for predictive hiring, ensuring bias reduction and GDPR compliance
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
              <div className="single-service-inner-3 single-service-inner-3-right">
                <div className="thumb">
                  <div className="thumb-inner">
                    <img src="assets/img/service-icon/03.png" alt="Next-Level Candidate Experience" />
                  </div>
                </div>
                <div className="details ml-15">
                  <h5 className="mb-3">Next-Level Candidate Experience</h5>
                  <p className="mb-0">
                    AI-powered, human-like interactions for fairness, multilingual support, and an engaging experience
                  </p>
                </div>
              </div>
              <div className="single-service-inner-3 single-service-inner-3-right">
                <div className="thumb">
                  <div className="thumb-inner">
                    <img src="assets/img/service-icon/04.png" alt="Optimize Engineering Resources" />
                  </div>
                </div>
                <div className="details ml-15">
                  <h5 className="mb-3">Optimize Engineering Resources</h5>
                  <p className="mb-0">
                    Automate screening with AI interviewers & deep learning, freeing up tech teams for high-impact projects
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Full Support Card Section */}
      <div className="team-areas bg-relative pd-top-60 pb-bottom-60" style={{ backgroundImage: 'url("./assets/img/bg/11.png")' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
              <div className="section-title">
                <h2 className="title">Full support throughout your hiring process.</h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="row">
                <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
                  <div className="main-box-step  colorone mb-3">
                    <h5 className="main-box-step-main">Screen</h5>
                    <div className="img-box">
                      <img src="assets/img/about/Qualify.png" alt="Recruitway Qualify" />
                    </div>
                    <h4 className="main-box-step-one">Recruitway Qualify</h4>
                    <p className="mb-0">Recruitway streamlines candidate qualification with expert solutions.</p>
                    <div className="main-bottom">
                     <Link  to='/Recruitwayqualify'>
                      <div className="circ__inner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 11" fill="none">
                          <path d="M4.5 1L9 5.5M9 5.5L4.5 10M9 5.5H0" stroke="#06101C"></path>
                        </svg>
                      </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="2200">
                  <div className="main-box-step colortwo mb-3">
                    <h5 className="main-box-step-main">Technical Interviews</h5>
                    <div className="img-box">
                      <img src="assets/img/about/Interview.png" alt="Technical Interviews" />
                    </div>
                    <h4 className="main-box-step-one">Recruitway Interviews</h4>
                    <p className="mb-0">Recruitway simplifies candidate qualification.</p>
                    <div className="main-bottom">
                    <Link  to='/RecruitwayInterview'>
                      <div className="circ__inner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 11" fill="none">
                          <path d="M4.5 1L9 5.5M9 5.5L4.5 10M9 5.5H0" stroke="#06101C"></path>
                        </svg>
                      </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="3000">
                  <div className="main-box-step  colorthree mb-3">
                    <h5 className="main-box-step-main">Insights</h5>
                    <div className="img-box">
                      <img src="assets/img/about/hiring.png" alt="Hiring Insights" />
                    </div>
                    <h4 className="main-box-step-one">Hiring Insights</h4>
                    <p className="mb-0">Unlock insights for smarter, data-driven recruitment decisions.</p>
                    <div className="main-bottom">
                    <Link  to='/HiringInsights'>
                      <div className="circ__inner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 11" fill="none">
                          <path d="M4.5 1L9 5.5M9 5.5L4.5 10M9 5.5H0" stroke="#06101C"></path>
                        </svg>
                      </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Area */}
      <div className="about-area pd-top-60 pd-bottom-60">
        <div className="container">
          <div className="row">
          <div className="col-lg-6 d-flex justify-content-center align-items-center">
  <div
    data-aos="fade-up"
    data-aos-delay="200"
    data-aos-duration="1500"
    style={{
      width: "380px",
      height: "380px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <DotLottieReact
      src="assets/img/about/FToCAdvk87.lottie"
      loop
      autoplay
      style={{ width: "100%", height: "100%" }}
    />
  </div>
</div>
            <div className="col-lg-6 align-self-center" data-aos="fade-up" data-aos-delay="250" data-aos-duration="1500">
              <div className="section-title mt-5 mt-lg-0">
                <h6 className="sub-title">Commitment</h6>
                <h2 className="title">Our Commitment</h2>
                <p className="content mb-4 mb-xl-5">
                  At RecruitWay, we are committed to transforming technical recruitment by providing specialized interview protocols focused on evaluating candidates' technical skills. Our platform, operated by expert interviewers from top tech companies like FAANG, integrates advanced coding and evaluation tools to ensure precise assessments.
                  We prioritize fairness and reliability in our processes, using structured formats and scoring systems to reduce bias, while advanced monitoring checks for authenticity during interviews. Our detailed records of each session support informed decision-making, setting new standards in tech hiring for efficiency and integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Area Four */}
      <ServiceAreaFour />

      {/* Scroll Page */}
      <Scrollpage />

      {/* Request Demo */}
      <Requestdemo />

      {/* Blog Area Two */}
      <BlogAreaTwo />

      {/* Footer Two */}
      <FooterTwo />
    </>
  );
};
export default HomeTwo;
