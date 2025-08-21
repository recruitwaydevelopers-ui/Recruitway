import React from 'react'
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";
import Requestdemo from "../components/Requestdemo";
import BannerTwo from "../components/BannerTwo";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
export default function SeamlessScheduling() {
  return (
    <>
    {/* Navigation Bar Two*/}
    {/* Navigation Bar Two*/}
    <NavbarTwo />
{/* Banner  */}
 <div className='about-area bg-gradient-gray pd-top-60  pd-bottom-30'>
        <div className='container'>
          <div className='row align-items-center'>
            <div
              className='col-lg-6 wow animated '
              data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='section-title mb-0'>
                <h2 className='title'>
                Simplify your interview process with seamless scheduling
                </h2>
                <p className='content mb-4'>
                Streamline your interview process with our scheduling tool. Coordinate interviews with candidates and interviewers with ease.
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
                  src='assets/img/about/Seamless.png'
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
          <h2 className='title'>Efficient Interview Scheduling</h2>
          <p className='content mb-4 mb-xl-5'>
          Integrate smoothly with your existing tools to automate the interview scheduling process. This efficient approach minimizes administrative tasks and helps maintain a focus on securing top technical talent.
          </p>
        </div>
    </div>
    </div>
    <div className='row align-items-center'>
      <div
        className='col-lg-6 mb-4 mb-lg-0 '
      data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
      >
        <div className='about-thumb-inner'>
          <img
            className='main-img'
            src='assets/img/about/Seamless-1.png'
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
          Best for busy HR departments and recruitment teams in tech companies who need to efficiently manage and coordinate multiple interviews across different time zones.
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
      <p>Simplify Your Interview Process with Seamless Scheduling</p>
    </div>
    <div className='row'>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/cloud.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Calendar Integration</h5>
            <p className='content'>
            Sync interviews with your calendar software seamlessly, preventing scheduling conflicts and ensuring smooth operations for all participants.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/alarm.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Automated Reminders</h5>
            <p className='content'>
            Automatically send reminders to candidates and interviewers, significantly reducing no-shows and enhancing timely participation in scheduled interviews.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/upgrade.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Real-time Updates</h5>
            <p className='content'>
            Instantly receive notifications on any scheduling changes, allowing for timely and effective adjustments to ensure smooth interview processes.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/effortless.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Effortless Time Zone Coordination</h5>
            <p className='content'>We manage time zone differences to ensure scheduling is accurate, making coordination worry-free for all.
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
