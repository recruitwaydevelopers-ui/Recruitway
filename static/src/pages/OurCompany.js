import React  from 'react';
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import NavBarTwo from "../components/NavbarTwo";

const OurCompany = () => {
  return (
    <>
    <NavBarTwo/> 
      {/* Navigation Bar */}
      <Breadcrumb title={"Our Company"} />
        {/* About Area One */}
      <div className='about-area pd-top-60 pd-bottom-60'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-6'>
              <div
                className='about-thumb-inner p-xl-5 pt-4 '
                data-aos='fade-up'
                data-aos-delay='200'
                data-aos-duration='1500'
              >
                <img
                  className='main-img m-md-4'
                  src='assets/img/about/img-20.png'
                  alt='img'
                />
              </div>
            </div>
            <div
              className='col-lg-6 align-self-center '
              data-aos='fade-up'
              data-aos-delay='250'
              data-aos-duration='1500'
            >
              <div className='section-title mt-5 mt-lg-0'>
                <h2 className='title'>
                We put the human back into human resources
                </h2>
                <p className='content mb-4 mb-xl-5'>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  {/* end about section  */}

      <div
              className='service-area bg-cover pd-top-60  pd-bottom-60 pd-top-60  pd-bottom-60'
              style={{ backgroundImage: 'url("./assets/img/bg/3.png")',borderRadius:'50px' }}
            >
              <div className='container'>
                <div className='row justify-content-center'>
                  <div className='col-xl-6 col-lg-8' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
                    <div className='section-title text-center'>
                      <h2 className='title'>
                      Our values
                      </h2>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-xl-3 col-md-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='2000'>
                    <div className='single-work-process-inner'>
                      <div className='thumb mb-3'>
                        <img src='assets/img/icon/internet.png' alt='img' />
                      </div>
                      <div className='details'>
                        <h5 className='mb-3'>Lorem Content</h5>
                        <p className='content mb-3'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-3 col-md-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='2000'>
                    <div className='single-work-process-inner'>
                      <div className='thumb mb-3'>
                        <img src='assets/img/icon/role.png' alt='img' />
                      </div>
                      <div className='details'>
                        <h5 className='mb-3'>Lorem Content</h5>
                        <p className='content mb-3'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,                          </p>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-3 col-md-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='2000'>
                    <div className='single-work-process-inner'>
                      <div className='thumb mb-3'>
                        <img src='assets/img/icon/voice-recording.png' alt='img' />
                      </div>
                      <div className='details'>
                        <h5 className='mb-3'>Lorem Content</h5>
                        <p className='content mb-3'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-3 col-md-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='2000'>
                    <div className='single-work-process-inner'>
                      <div className='thumb mb-3'>
                        <img src='assets/img/icon/roi.png' alt='img' />
                      </div>
                      <div className='details'>
                        <h5 className='mb-3'>ROI Analysis</h5>
                        <p className='content mb-3'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* left side  */}
       <div className='about-area pd-top-60 '>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-6'>
              <div
                className='about-thumb-inner p-xl-5 pt-4 '
                data-aos='fade-up'
                data-aos-delay='200'
                data-aos-duration='1500'
              >
                <img
                  className='main-img m-md-4'
                  src='assets/img/about/img-20.png'
                  alt='img'
                />
              </div>
            </div>
            <div
              className='col-lg-6 align-self-center '
              data-aos='fade-up'
              data-aos-delay='250'
              data-aos-duration='1500'
            >
              <div className='section-title mt-5 mt-lg-0'>
                <h2 className='title'>
              Decisions backed by data
                </h2>
                <p className='content mb-4 mb-xl-5'>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* left side */}
      <div className='about-area  pd-bottom-60'>
        <div className='container'>
          <div className='row'>
            <div
              className='col-lg-6 align-self-center '
              data-aos='fade-up'
              data-aos-delay='250'
              data-aos-duration='1500'
            >
              <div className='section-title mt-5 mt-lg-0'>
                <h2 className='title'>
                24/7 Customer Support
                </h2>
                <p className='content mb-4 mb-xl-5'>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
                </p>
              </div>
            
            </div>
            <div className='col-lg-6'>
              <div
                className='about-thumb-inner p-xl-5 pt-4 '
                data-aos='fade-up'
                data-aos-delay='200'
                data-aos-duration='1500'
              >
                <img
                  className='main-img m-md-4'
                  src='assets/img/about/img-20.png'
                  alt='img'
                />
              </div>
            </div>
          </div>
        </div>
      </div>


     


    <FooterTwo/>
    </>
  );
};

export default OurCompany;
