import React from 'react'
import AboutAreaTwo from "../components/AboutAreaTwo";
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";
import { Link } from "react-router-dom";

export default function RecordedInterviews() {
  return (
    <>
     {/* Navigation Bar Two*/}
    <NavbarTwo />

{/* Banner  */}
 <div className='about-area bg-gradient-gray pd-top-60'>
        <div className='container'>
          <div className='row align-items-center'>
            <div
              className='col-lg-6 wow animated 'data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='section-title mb-0'>
                <h2 className='title'>
                Recorded interviews for better hiring decisions
                </h2>
                <p className='content mb-4'>
                Get a better understanding of your candidates with our recorded interview feature. Review and analyze interviews at your convenience.
                </p>
                  <Link className='btn btn-border-base' to='/request'>
                                  Request Demo
                                </Link>
              </div>
            </div>
            <div
              className='col-lg-6 ' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='about-thumb-inner mb-4 mb-lg-0 text-center'>
                <img
                  className='main-img'
                  src='assets/img/about/Recorded-Interviews.png'
                  alt='img'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

{/* Outsourcing Technical Interviews*/}
<div className='about-area pd-top-60 pd-bottom-60'>
  <div className='container'>
    <div className='row'>
    <div className='col-lg-12'>
    <div className='section-title mt-5 mt-lg-0 text-center'>
          <h2 className='title'>Recorded Interview Flexibility</h2>
          <p className='content mb-4 mb-xl-5'>
          Review candidate sessions at your convenience for deeper and more flexible evaluation. This approach is ideal for teams that wish to discuss and make collaborative hiring decisions without the constraints of scheduling.
          </p>
        </div>
    </div>
    </div>
    <div className='row align-items-center'>
      <div
        className='col-lg-6 mb-4 mb-lg-0 'data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
      >
        <div className='about-thumb-inner'>
          <img
            className='main-img'
            src='assets/img/about/Recorded-Interviews-1.png'
            alt='img'
          />
        </div>
      </div>
      <div
        className='col-lg-6 ' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
      >
        <div className='section-title mb-0'>
          <h2 className='title'>Who it's for </h2>
          <p className='content mb-4'>Suited for organizations that value thorough review processes and require the flexibility to assess candidate interviews asynchronously, enabling deeper evaluation, collaborative feedback, and improved hiring decisions.</p>
        </div>
      </div>
    </div>
  </div>
</div>
{/* About Area Two */}
<div className='work-process-area pd-top-20 pd-bottom-60'>
  <div className='container'>
    <div className='section-title text-center'>
      <h2 className='title'>
      Key Benefits
      </h2>
      <p>Make Informed Decisions with Recorded Interviews</p>
    </div>
    <div className='row'>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/improvement.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Enhanced Review Capabilities</h5>
            <p className='content'>
            Review interviews at convenience for deeper analysis and more informed hiring decisions, enhancing your recruitment strategy.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/consistency.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Consistency in Evaluation</h5>
            <p className='content'>
            Ensure uniform evaluation conditions with recorded sessions, reducing bias and promoting fairness throughout the hiring process.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/career.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Collaborative Hiring</h5>
            <p className='content'>
            Empower your team to collaboratively review and assess interviews, driving consensus and improving the accuracy of hiring decisions.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/accountability.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Compliance and Accountability</h5>
            <p className='content'>Maintain a secure archive of all interviews to uphold compliance and provide reliable records for audits and legal reviews.
              </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{/* why choose us  */}
{/* counter request demo  */}
 <div className='about-area  pd-bottom-60'>
          <div className='container '>
            <div className='row align-items-center Ready-to-Transform-one img-radius'>
              <div
                className='col-lg-8 Ready-to-Transform'
                data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
              >
                <div className='section-title mb-0'>
                  <h2 className='title mb-40'>
                  Ready to Transform your Hiring Process?
                  </h2>
                      <p className='mt-10 content-mt-20'>Partner with us to ensure your team grows with only the best tech talent. Get started today and experience the efficiency and precision of expert-driven technical interviews.</p>
                  <div className='text-right'>
                   <Link className='btn btn-border-base' to='/Request'>Request Demo</Link>
                   </div>
                </div>
              </div>
              <div className='col-lg-4'>
                <div
                  className='mt-5 mt-lg-0 ms-4 ms-lg-0 text-center'
                 data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
                >
                  <img className='img-margin img-radius' src='assets/img/about/img101.jpg' alt='img'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
{/* Blog Area Two */}
{/* Footer Two */}
<FooterTwo />
    </>
  )
}
