import React from 'react'
import AboutAreaTwo from "../components/AboutAreaTwo";
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";
import { Link } from "react-router-dom";

export default function InterviewOutsourcing() {
  return (
    <>
      {/* Navigation Bar Two*/}
      <NavbarTwo />

      {/* Banner  */}
      <div className='about-area bg-gradient-gray pd-top-60 pd-bottom-30'>
        <div className='container'>
          <div className='row align-items-center'>
            <div
              className='col-lg-6 wow animated ' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='section-title mb-0'>
                <h2 className='title'>
                Expert interview outsourcing for tech roles
                </h2>
                <p className='content mb-4'>
                Leave the challenges of technical recruiting to us Enhance your hiring with industry experts
                </p>
                 <Link className='btn btn-border-base' to='/request'>
                      Request Demo
                    </Link>
              </div>
            </div>
            <div
              className='col-lg-6 'data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='about-thumb-inner mb-4 mb-lg-0'>
                <img
                  className='main-img'
                  src='assets/img/about/Expert-1.png'
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
                <h2 className='title'>Outsourcing Technical Interviews</h2>
                <p className='content mb-4 mb-xl-5'>
                In today's competitive tech industry, finding and securing top talent is more challenging than ever. Allow us to extend your HR team's capabilities by handling the complexities of technical interviews, enabling you to focus on strategic growth.
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
                  src='assets/img/about/outsoursing-1.png'
                  alt='img'
                />
              </div>
            </div>
            <div
              className='col-lg-6 '
             data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='section-title mb-0'>
                <h2 className='title'>Who it's for </h2>
                <p className='content mb-4'>
                This service is ideal for startups, tech companies, and any business looking to hire technical professionals without expanding their internal HR capabilities.
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
      <p>Unlock the Advantages of Expert-Led Technical Assessments</p>
    </div>
    <div className='row'>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/interview-1.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Expert-Led Interviews</h5>
            <p className='content'>
            Benefit from interviews conducted by top industry experts, ensuring high-quality candidate assessments from leading tech professionals.
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
            <h5 className='mb-3'>Scalability</h5>
            <p className='content'>
            Our services flexibly scale to match your hiring needs, supporting both single position fills and large-scale recruitment efforts efficiently.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/efficiency.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Efficiency</h5>
            <p className='content'>
            Streamline your hiring process with our efficient, data-driven methodology designed for speedy and accurate candidate evaluations.            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/quality-assurance.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Quality Assurance</h5>
            <p className='content'>Ensure hiring excellence with our stringent screening processes, confidently presenting only the most qualified and competent candidates.
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
