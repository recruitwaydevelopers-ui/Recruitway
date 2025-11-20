import React from 'react'
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";
import Requestdemo from "../components/Requestdemo";
import TestimonialTwo from "../components/TestimonialTwo";
import { Link } from "react-router-dom";

export const RecruitwayInterview = () => {
  return (
    <>
    {/* Navigation Bar Two*/}
    <NavbarTwo />
    {/* Banner*/}
     <div className='about-area bg-gradient-gray pd-top-60 pd-bottom-30'>
            <div className='container'>
              <div className='row align-items-center'>
                <div
                  className='col-lg-6 wow animated 'data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
                  <div className='section-title mb-0'>
                    <h2 className='title'>
                    Next-Gen Technical Interviewing
                    </h2>
                    <p className='content mb-4'>
                    Discover top talent with interviews led by seasoned experts and built on proven methodologies—designed to reveal real-world skills and deliver confident hiring decisions.</p>
                      <Link className='btn btn-border-base' to='/request'>
                      Request Demo
                       </Link>
                  </div>
                </div>
                <div
                  className='col-lg-6 '
                  data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
                >
                  <div className='about-thumb-inner mb-4 mb-lg-0 text-center'>
                    <img
                      className='main-img'
                      src='assets/img/about/Next-Gen-Technical-Interviewing.png'
                      alt='img'
                    />
                  </div>
                </div>
              </div>
            </div>
     </div>
    
    {/* Outsourcing Technical Interviews*/}
    <div className='about-area pd-top-120 pd-bottom-110'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-6'>
              <div
                className='about-thumb-inner p-xl-5 pt-4 '
                data-aos='fade-right'
                data-aos-delay='200'
                data-aos-duration='1500'
              >
                <img
                  className='animate-main-img'
                  src='assets/img/about/14.png'
                  alt='img'
                />
                <img
                  className='main-img m-md-4'
                  src='assets/img/about/img-202.jpg'
                  alt='img'
                />
              </div>
            </div>
            <div
              className='col-lg-6 align-self-center '
              data-aos='fade-left'
              data-aos-delay='250'
              data-aos-duration='1500'
            >
              <div className='section-title mt-5 mt-lg-0'>
                <h6 className='sub-title'>Product details</h6>
                <h2 className='title'>Proven Interview Content</h2>
                <p className='content mb-4 mb-xl-5'>
                Uncover top performers with rigorously designed questions that focus on the skills that actually predict success—no guesswork, just signal.
                </p>
                <div className='media box-shadow p-3 border-radius-5 mb-3'>
                  <div className='media-left me-3'>
                    <img src='assets/img/icons/hiring.png' alt='img' />
                  </div>
                  <div className='media-body'>
                    <div className='single-progressbar'>
                      <h6>Fair, Structured Hiring</h6>
                      <p>Ensure consistency and reduce bias with standardized formats and objective scoring—so every candidate gets a level playing field</p>
                    </div>
                  </div>
                </div>
                <div className='media box-shadow p-3 border-radius-5 mb-3'>
                  <div className='media-left me-3'>
                    <img src='assets/img/icons/expert.png' alt='img' />
                  </div>
                  <div className='media-body'>
                    <div className='single-progressbar'>
                      <h6>Trusted Interview Experts</h6>
                      <p>Free up your engineers by handing off interviews to trained professionals who know how to assess talent—live, human, and certified.</p>
                    </div>
                  </div>
                </div>
                <div className='media box-shadow p-3 border-radius-5 mb-3'>
                  <div className='media-left me-3'>
                    <img src='assets/img/icons/calendar.png' alt='img' />
                  </div>
                  <div className='media-body'>
                    <div className='single-progressbar'>
                      <h6>Anytime Scheduling</h6>
                      <p>Move fast with interviews available on demand—whether it’s same-day, late evening, or over the weekend. You set the pace.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       {/* new section start */}
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
                  Getting started
                </h2>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
              <div className="single-service-inner-3 single-service-inner-3-right">
                <div className="thumb">
                  <div className="thumb-inner pd-8">
                    <h5>Step 01</h5>
                  </div>
                </div>
                <div className="details">
                  <h5 className="mb-3">Define Your Hiring Blueprint</h5>
                  <p className="mb-0">
                  Partner with our solution experts to craft a tailored interview plan—precisely aligned to your tech stack, role seniority, hiring goals, and team dynamics.
                  </p>
                </div>
              </div>
              <div className="single-service-inner-3 single-service-inner-3-right">
                <div className="thumb">
                  <div className="thumb-inner pd-8">
                  <h5>Step 03</h5>
                  </div>
                </div>
                <div className="details">
                  <h5 className="mb-3">Send the Invite, We’ll Do the Rest</h5>
                  <p className="mb-0">
                  ap into our global network of seasoned Interview Engineers to handle technical interviews—freeing your team to focus on building, not screening.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
              <div className="single-service-inner-3 single-service-inner-3-right">
                <div className="thumb">
                  <div className="thumb-inner pd-8">
                  <h5>Step 02</h5>
                  </div>
                </div>
                <div className="details">
                  <h5 className="mb-3">Hire with Certainty</h5>
                  <p className="mb-0">
                  Get clear, data-backed insights that spotlight top performers—so you can confidently move the best candidates forward and make winning offers.
                  </p>
                </div>
              </div>
              <div className="single-service-inner-3 single-service-inner-3-right">
                <div className="thumb">
                  <div className="thumb-inner pd-8">
                  <h5>Step 04</h5>
                  </div>
                </div>
                <div className="details">
                  <h5 className="mb-3">Optimize Engineering Resources</h5>
                  <p className="mb-0">
                  Automate candidate screening with AI interviewers powered by deep learning—freeing up your tech teams to focus on high-impact projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/* new section end  */}
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
    className='faq-area  bg-cover pd-top-90 pd-bottom-60'
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
export default RecruitwayInterview;