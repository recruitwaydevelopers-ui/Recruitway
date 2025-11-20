import React from 'react'
import AboutAreaTwo from "../components/AboutAreaTwo";
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";
import { Link } from "react-router-dom";

export default function ROIAnalysis() {
  return (
    <>
    {/* Navigation Bar Two*/}
    <NavbarTwo />

{/* Banner  */}
 <div className='about-area bg-gradient-gray pd-top-60 pd-bottom-30'>
        <div className='container'>
          <div className='row align-items-center'>
            <div
              className='col-lg-6 wow animated '
            data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='section-title mb-0'>
                <h2 className='title'>
                Maximize your hiring ROI with data-driven insights
                </h2>
                <p className='content mb-4'>
                Make data-driven hiring decisions with our ROI Analysis tool. Get insights into your hiring process and optimize for success.
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
                  src='assets/img/about/roiimg1.png'
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
          <h2 className='title'>ROI in Recruitment</h2>
          <p className='content mb-4 mb-xl-5'>
          Measure and enhance the effectiveness of your hiring efforts. Understand the financial and practical returns of your recruitment efforts to optimize investments and drive better strategic decisions.
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
            src='assets/img/about/roiimg2.png'
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
          Ideal for companies that want to measure the effectiveness of their hiring practices and optimize the return on investment in their recruitment processes.
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
      <p>Optimize Your Hiring Process with Data-Driven Insights</p>
    </div>
    <div className='row'>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/efficiency.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Cost-Efficiency Tracking</h5>
            <p className='content'>
            Analyze the cost versus output of each hire to gauge the precise value added to your organization, optimizing your investment in talent.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/decision-making.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Improved Hiring Decisions</h5>
            <p className='content'>
            Leverage data-driven insights to refine recruitment strategies, aligning hiring practices with organizational goals for enhanced returns.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/results.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Quantifiable Outcomes</h5>
            <p className='content'>
            Convert subjective hiring aspects into clear, measurable metrics, making outcomes understandable and actionable across your organization.            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/resource-allocation.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Strategic Resource Allocation</h5>
            <p className='content'>Identify recruitment investments yielding returns and strategically reallocate resources to maximize efficiency and effectiveness.
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
