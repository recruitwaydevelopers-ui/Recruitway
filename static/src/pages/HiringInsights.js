import React from 'react'
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";
import Requestdemo from "../components/Requestdemo";
import TestimonialTwo from "../components/TestimonialTwo";
import { FaCheckCircle, FaPlus } from "react-icons/fa";

import { Link } from "react-router-dom";

export const HiringInsights = () => {
  return (
    <>
     {/* Navigation Bar Two*/}
     <NavbarTwo />
{/* Banner  */}
 <div className='about-area bg-gradient-gray pd-top-60 pd-bottom-30'>
        <div className='container'>
          <div className='row align-items-center'>
            <div
              className='col-lg-6 wow animated 'data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='section-title mb-0'>
                <h2 className='title'>
                Smarter Hiring Starts Here
                </h2>
                <p className='content mb-4'>
                Unlock better talent by rethinking how you engage candidates from the start. Ditch traditional screening methods and embrace a modern, fair approach that surfaces high-potential applicants faster—and keeps your hiring pipeline flowing with quality.
                 </p>
                  <Link className='btn btn-border-base' to='/request'>
                  Request Demo 
                   </Link>
              </div>
            </div>
            <div
              className='col-lg-6 '
              data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='about-thumb-inner mb-4 mb-lg-0'>
                <img
                  className='main-img'
                  src='assets/img/about/Smarter-Hiring.png'
                  alt='img'
                />
              </div>
            </div>
          </div>
        </div>
 </div>

{/* Outsourcing Technical Interviews*/}
<div className='about-area pd-top-120 pd-bottom-120'>
        <div className='container'>
          <div className='row align-items-center'>
            <div
              className='col-lg-4 mb-4 mb-lg-0 '
              data-aos='fade-right'
              data-aos-delay='100'
              data-aos-duration='1500'
            >
              <div className='about-thumb-inner'>
                <img
                  className='main-img'
                  src='assets/img/about/cloud-solution.png'
                  alt='img'
                />
              </div>
            </div>
            <div
              className='col-lg-8 '
              data-aos='fade-left'
              data-aos-delay='100'
              data-aos-duration='1500'
            >
              <div className='section-title mb-0'>
                <h6 className='sub-title'>Product details</h6>
                <h2 className='title'>
                Empower Your Business with Smart Cloud Solutions
                </h2>
                <p className='content mb-4'>
                With cloud-based tools, you can manage your business from anywhere—whether you’re on your laptop at the office or checking in from your phone on the go. All you need is an internet connection.
                </p>
                <div className='row'>
                  <div className='col-md-6'>
                    <ul className='single-list-inner style-check style-heading style-check mb-3'>
                      <li>
                        <FaCheckCircle />Empower Business with Cloud Solutions
                      </li>
                      <p>With cloud-based tools, manage your business from anywhere—on your laptop, phone, or any device with internet access.</p>
                      <li>
                        <FaCheckCircle /> Streamline Operations
                      </li>
                      <p>Simplify your daily tasks with intuitive tools that work together seamlessly. Spend less time managing and more time growing.</p>
                    </ul>
                  </div>
                  <div className='col-md-6'>
                    <ul className='single-list-inner style-check style-heading style-check mb-3'>
                      <li>
                        <FaCheckCircle /> Build Confidence Through Knowledge
                      </li>
                      <p>Leverage real-time insights to make informed decisions. The more you know, the faster and smarter your business moves.</p>
                      <li>
                        <FaCheckCircle /> Stay Secure, Stay Focused
                      </li>
                      <p>Our cloud solutions ensure data safety with encryption and secure access. Always choose trusted platforms and follow best practices.</p>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

<div className="service-area  bg-border-radius bg-gray bg-relative pd-top-60 pd-bottom-60">
        <div className="container">
          <div className="row wow animated animatedFadeInUp fadeInUp">
            <div className="col-lg-6">
              <div className="section-title mb-0">
                <h2 className="title mb-40" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">Getting started</h2>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-title mb-0">
                <h4>Elevate Your Hiring with Intelligent Automation</h4>
                <p>Explore how smarter tools and AI-powered insights can reshape the way you find, engage, and hire top tech talent.</p>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
              <div className="single-service-inner-3 single-service-inner-3-right">
                <div className="thumb">
                  <div className="thumb-inner">
                    <img src="assets/img/icons/explore.png"   style={{ width: '50px' }}  alt="Supercharge Hiring with AI" />
                  </div>
                </div>
                <div className="details ml-15">
                  <h5 className="mb-3">Explore What’s New</h5>
                  <h6>Dive Into Insights</h6>
                  <p className="mb-0">
                   From trend reports to expert-led webinars, stay ahead with curated content that highlights what’s shaping the future of hiring and engineering talent.
                  </p>
                </div>
              </div>
              <div className="single-service-inner-3 single-service-inner-3-right">
                <div className="thumb">
                  <div className="thumb-inner">
                    <img src="assets/img/icons/intelligence.png" style={{ width: '50px' }} alt="AI-Driven Talent Identification" />
                  </div>
                </div>
                <div className="details ml-15">
                  <h5 className="mb-3">Intelligent Talent Matching</h5>
                  <h6>Partner with Us</h6>
                  <p className="mb-0">
                   Join forces with our team to unlock hiring precision. With data-backed processes and actionable analytics, we help you find the right people—faster.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
              <div className="single-service-inner-3 single-service-inner-3-right">
                <div className="thumb">
                  <div className="thumb-inner">
                    <img src="assets/img/icons/candidate.png" alt="Next-Level Candidate Experience" />
                  </div>
                </div>
                <div className="details ml-15">
                  <h5 className="mb-3">Redefine the Candidate Journey</h5>
                  <h6>Evolve with Every Hire</h6>
                  <p className="mb-0">
                  Through continuous feedback and collaborative improvement, our platform learns and adapts—elevating candidate experience while aligning with your hiring goals.
                  </p>
                </div>
              </div>
              <div className="single-service-inner-3 single-service-inner-3-right">
                <div className="thumb">
                  <div className="thumb-inner">
                    <img src="assets/img/icons/collective.png" alt="Optimize Engineering Resources" />
                  </div>
                </div>
                <div className="details ml-15">
                  <h5 className="mb-3">Maximize Tech Team Impact</h5>
                  <h6>Evolve with Every Hire</h6>
                  <p className="mb-0">
                   Let AI interviewers handle early-stage screening so your engineers can focus on building, not vetting—boosting productivity without sacrificing quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
{/* About Area Two */}
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
{/* why choose us  */}
<div
className='faq-area  bg-cover pd-top-60 pd-bottom-60'
style={{ backgroundImage: 'url("./assets/img/bg/3.png")' }}
>
<div className='container'>
  <div className='row pd-top-60 align-items-center'>
    <div
      className='col-xl-5 col-lg-6 col-md-8 order-lg-last'
      data-aos='fade-left'
      data-aos-delay='100'
      data-aos-duration='1500'
    >
    <div className='about-thumb-inner pt-lg-3 text-center'>
    <img
      className='main-img'
      src='assets/img/about/FAQ-main.png'
      alt='img'
    />
  </div>
    </div>
    <div
      className='col-xl-7 col-lg-6'
      data-aos='fade-right'
      data-aos-delay='100'
      data-aos-duration='1500'
    >
      <div className='section-title mb-0 mt-4 mt-lg-0'>
        <h6 className='sub-title'>SOME FAQ'S</h6>
        <h2 className='title'>
        Frequently asked questions
        </h2>
        <p className='content'>
        We connect tech talent with top companies through curated job listings and recruitment support.
        </p>
      </div>
      <div
        className='accordion accordion-inner style-2 accordion-icon-left mt-3'
        id='accordionExample'
      >
        <div className='accordion-item'>
          <h2 className='accordion-header' id='headingOne'>
            <button
              className='accordion-button'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseOne'
              aria-expanded='true'
              aria-controls='collapseOne'
            >
           What is AI-powered screening?
            </button>
          </h2>
          <div
            id='collapseOne'
            className='accordion-collapse collapse show'
            aria-labelledby='headingOne'
            data-bs-parent='#accordionExample'
          >
            <div className='accordion-body'>
            AI-powered screening uses artificial intelligence and ATS (Applicant Tracking Systems) to quickly evaluate technical candidates by analyzing resumes, coding tests, and key qualifications. It helps identify top talent efficiently, reduces bias, and streamlines the hiring process by focusing on skills that match the role requirements.
            </div>
          </div>
        </div>
        <div className='accordion-item'>
          <h2 className='accordion-header' id='headingTwo'>
            <button
              className='accordion-button collapsed'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseTwo'
              aria-expanded='false'
              aria-controls='collapseTwo'
            >
           Why is AI-powered screening better than traditional ATS or manual screening?
            </button>
          </h2>
          <div
            id='collapseTwo'
            className='accordion-collapse collapse'
            aria-labelledby='headingTwo'
            data-bs-parent='#accordionExample'
          >
            <div className='accordion-body'>
            AI-powered screening goes beyond traditional ATS or manual methods by analyzing not just keywords but also context, skills, and patterns in a candidate’s profile. It can assess coding tests, rank candidates by fit, and learn from hiring outcomes to improve over time. This leads to faster, more accurate shortlisting, reduced bias, and a better match between candidates and technical roles.
            </div>
          </div>
        </div>
        <div className='accordion-item'>
          <h2 className='accordion-header' id='headingThree'>
            <button
              className='accordion-button collapsed'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseThree'
              aria-expanded='false'
              aria-controls='collapseThree'
            >
           How does Recruitway Qualify help in the hiring process?
            </button>
          </h2>
          <div
            id='collapseThree'
            className='accordion-collapse collapse'
            aria-labelledby='headingThree'
            data-bs-parent='#accordionExample'
          >
            <div className='accordion-body'>
            Recruitway Qualify uses AI-powered screening to quickly filter high volumes of technical applications, going beyond keyword matching to assess skills, experience, and coding ability. This ensures a fair, consistent, and efficient way to identify top candidates and speed up your hiring process.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
{/* counter request demo  */}
 <Requestdemo/>
{/* Blog Area Two */}
{/* Footer Two */}
<FooterTwo />
    </>
  )
}
export default HiringInsights;