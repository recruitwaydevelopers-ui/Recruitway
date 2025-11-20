import React from 'react'
import AboutAreaTwo from "../components/AboutAreaTwo";
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";
import { Link } from "react-router-dom";

export default function RoleFit() {
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
                Find the perfect match for your team
                </h2>
                <p className='content mb-4'>
                Ensure each hire is precisely what your project needs. Start with us today and see how our Role Fit analysis can streamline your hiring accuracy.
                </p>
                  <Link className='btn btn-border-base' to='/request'>Request Demo </Link>
              </div>
            </div>
            <div
              className='col-lg-6 '
       data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='about-thumb-inner mb-4 mb-lg-0'>
                <img
                  className='main-img'
                  src='assets/img/about/Role-Fit-1.png'
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
          <h2 className='title'>Role Fit Evaluation</h2>
          <p className='content mb-4 mb-xl-5'>
          Ensure that each candidate not only meets the technical qualifications but is also the perfect match for the specific role, enhancing job performance and satisfaction. Our detailed evaluations align candidates' skills with the unique demands of each position.
          </p>
        </div>
    </div>
    </div>
    <div className='row  align-items-center'>
      <div
        className='col-lg-6 mb-4 mb-lg-0 '
        data-aos='fade-right'
        data-aos-delay='100'
        data-aos-duration='1500'
      >
        <div className='about-thumb-inner'>
          <img
            className='main-img'
            src='assets/img/about/roi-1.png'
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
          Perfect for tech companies and HR departments needing to ensure candidates match specific technical roles, improving job performance and satisfaction.
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
      <p>Ensure Each Hire is the Perfect Fit for Your Team</p>
    </div>
    <div className='row'>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/candidate.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Precise Candidate Matching</h5>
            <p className='content'>
            Ensure candidates meet the precise requirements of your roles through our tailored assessments, aligning skills perfectly with job needs.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/turnover.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Reduced Turnover</h5>
            <p className='content'>Our accurate role-fit analysis significantly lowers turnover by matching candidates perfectly to roles, thus stabilizing your workforce, improving retention, and reducing hiring costs.</p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/hiring-1.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Streamlined Hiring Process</h5>
            <p className='content'>
            Optimize your recruitment efforts by focusing only on candidates who closely match the role criteria, thereby saving time and resources in the hiring process.            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/enhancement.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Enhanced Team Performance</h5>
            <p className='content'>Improve project outcomes and team dynamics with candidates who are expertly evaluated to excel in their specific roles, enhancing productivity and satisfaction.
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
