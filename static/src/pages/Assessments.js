import React from 'react'
import AboutAreaTwo from "../components/AboutAreaTwo";
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";
import { Link } from "react-router-dom";

export default function Assessments() {
  return (
    <>
    {/* Navigation Bar Two*/}
    <NavbarTwo />

{/* Banner  */}
 <div className='about-area bg-gradient-gray pd-top-60 pd-bottom-30'>
        <div className='container'>
          <div className='row align-items-center'>
            <div
              className='col-lg-6 wow animated fadeInRight'
              data-aos='fade-left'
              data-aos-delay='100'
              data-aos-duration='1500'
            >
              <div className='section-title mb-0'>
                <h2 className='title'>
                Custom assessments for your unique needs
                </h2>
                <p className='content mb-4'>
                Utilize our comprehensive suite of technical assessments designed to rigorously evaluate a candidate's skills and proficiency.
                </p>
                <Link className='btn btn-border-base' to='/request'>
                  Request Demo
                </Link>
              </div>
            </div>
            <div
              className='col-lg-6 '
              data-aos='fade-right'
              data-aos-delay='100'
              data-aos-duration='1500'
            >
              <div className='about-thumb-inner  text-center mb-4 mb-lg-0'>
                <img
                  className='main-img'
                  src='assets/img/about/Custom-Assesment.png'
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
          <h2 className='title'>Technical Skills Assessment</h2>
          <p className='content mb-4 mb-xl-5'>
          Provide rigorous testing to accurately gauge the technical abilities of candidates. These tests, crafted by industry experts, reflect the latest technological standards and ensure you hire the best talent.
          </p>
        </div>
    </div>
    </div>
    <div className='row align-items-center'>
      <div
        className='col-lg-6 mb-4 mb-lg-0 '
        data-aos='fade-right'
        data-aos-delay='100'
        data-aos-duration='1500'
      >
        <div className='about-thumb-inner'>
          <img
            className='main-img'
            src='assets/img/about/Custom-Assesment-1.png'
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
          <h2 className='title'>Who it's for </h2>
          <p className='content mb-4'>
          Designed for any tech-oriented organization looking to accurately gauge the technical skills of candidates before making hiring decisions.
          </p>
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
      <p>Custom Assessments for Your Unique Hiring Needs</p>
    </div>
    <div className='row'>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/technical-support.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Tailored Technical Evaluation</h5>
            <p className='content'>
            Our assessments are meticulously designed to test specific technical skills and knowledge, ensuring that candidates are evaluated accurately according to the demands of the role.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/scalability.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Scalable to Any Size</h5>
            <p className='content'>
            Whether you're a startup or a large enterprise, our assessments can scale to meet your organization's needs, offering consistent evaluation standards regardless of the volume of candidates.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/skill.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Comprehensive Skill Analysis</h5>
            <p className='content'>
            Our assessments go beyond surface-level, delving deep into a candidate's technical skills and problem-solving abilities to provide a thorough understanding of their proficiency and potential.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/performance-analysis.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Benchmarking Industry Standards</h5>
            <p className='content'>Stay ahead of the curve by using assessments that reflect the latest industry standards and technological advancements, ensuring your hires are competent in the most current practices.
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
