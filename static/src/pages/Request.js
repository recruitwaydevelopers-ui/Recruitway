import React from 'react'
import NavbarTwo from "../components/NavbarTwo";
import FooterTwo from "../components/FooterTwo";
import { Link } from "react-router-dom";
export default function Request() {
  return (
    <>
    {/* Navigation Bar Two*/}
    <NavbarTwo />
      {/* Banner Two */}
    <div className='contact-area pd-top-90 pd-bottom-60 res-contact'>
            <div className='container'>
              <div className='row'>
                <div
                  className='col-lg-6 order-lg-end '
                  data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
                >
                  <div className='about-thumb-inner ms-xl-5 p-xl-5 pt-4 '>
                    <img
                      className='main-img'
                      src='assets/img/about/img-41.jpg'
                      alt='img'
                    />
                  </div>
                </div>
                <div
                  className='col-lg-6 order-lg-first bg-gray border-contact-form'
                  data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
                >
                  <div className='section-title mb-0 mt-5 mt-lg-0'>
                    <h6 className='sub-title'>GET IN TOUCH</h6>
                    <h4 className='title'>
                     How Can We Help
                    </h4>
                    <p className='content'>
                    We’re here to assist you! Reach out for any questions or support.
                    </p>
                    <form className='mt-4'>
                      <div className='row'>
                        <div className='col-lg-6'>
                          <div className='single-input-inner style-border'>
                            <input type='text' placeholder='First Name' />
                          </div>
                        </div>
                        <div className='col-lg-6'>
                          <div className='single-input-inner style-border'>
                            <input type='text' placeholder='Last Name' />
                          </div>
                        </div>
                        <div className='col-lg-6'>
                          <div className='single-input-inner style-border'>
                          <input type='email' placeholder='Email Here' />
                          </div>
                        </div>
                        <div className='col-lg-6'>
                          <div className='single-input-inner style-border'>
                            <input type='text' placeholder='Phone Number' />
                          </div>
                        </div>
                        <div className='col-lg-6'>
                          <div className='single-input-inner style-border'>
                            <input type='text' placeholder='Company Name ' />
                          </div>
                        </div>
                        <div className='col-lg-6'>
                          <div className='single-input-inner style-border'>
                            <input type='text' placeholder='Job Title' />
                          </div>
                        </div>
                        <div className='col-lg-12'>
                          <div className='single-input-inner style-border'>
                            <textarea placeholder='Message' defaultValue={""} />
                          </div>
                        </div>
                        <div className='col-12 d-flex justify-content-center'>
                         <span className='btn mt-0 btn-border-base'>Submit</span>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
     {/* Footer Two */}
     <FooterTwo/>
    </>
  )
}
