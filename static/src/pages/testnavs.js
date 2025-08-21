import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const NavbarTwo = () => {
  const [active, setActive] = useState(false);
  const [searchShow, setSearchShow] = useState(false);
  const menuActive = () => {
    setActive(!active);
  };
  const searchActive = () => {
    setSearchShow(!searchShow);
    console.log("hell");
  };

  // Control sidebar navigation
  let items = document.querySelectorAll(".menu-item-has-children > a");
  for (let i in items) {
    if (items.hasOwnProperty(i)) {
      items[i].onclick = function () {
        this.parentElement
          .querySelector(".sub-menu")
          .classList.toggle("active");
        this.classList.toggle("open");
      };
    }
  }
  return (
    <>
      {/* search popup start*/}
      <div
        className={searchShow ? "td-search-popup active" : "td-search-popup "}
        id='td-search-popup'
      >
        <form action='/' className='search-form'>
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              placeholder='Search.....'
            />
          </div>
          <button type='submit' className='submit-btn'>
            <FaSearch />
          </button>
        </form>
      </div>
      {/* search popup end*/}
      <div
        onClick={searchActive}
        className={searchShow ? "body-overlay active" : "body-overlay"}
        id='body-overlay'
      ></div>
      {/* ==================== Navbar Two Start ====================*/}
      <nav className='navbar navbar-area navbar-area-2 navbar-expand-lg'>
        <div className='container nav-container'>
          <div className='responsive-mobile-menu'>
            <button
              onClick={menuActive}
              className={
                active
                  ? "menu toggle-btn d-block d-lg-none open"
                  : "menu toggle-btn d-block d-lg-none"
              }
              data-target='#itech_main_menu'
              aria-expanded='false'
              aria-label='Toggle navigation'
            >
              <span className='icon-left'/>
              <span className='icon-right'/>
            </button>
          </div>
          <div className='logo'>
            <Link to='/'>
              <img src='assets/img/logo-re.png' alt='img' />
            </Link>
          </div>
          <div className='nav-right-part nav-right-part-mobile'>
          </div>
          <div
            className={
              active
                ? "collapse navbar-collapse sopen"
                : "collapse navbar-collapse"
            }
            id='itech_main_menu'
          >
            <ul className='navbar-nav menu-open text-lg-end'>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li className='menu-item-has-children'>
                <a href='#'>Solutions</a>
                <ul className='sub-menu'>
                  <li>
                    <Link to='/InterviewOutsourcing'>Interview Outsourcing</Link>
                  </li>
                  <li>
                    <Link to='/RoleFit'>Role Fit</Link>
                  </li>
                  <li>
                    <Link to='/RecordedInterviews'>Recorded Interviews</Link>
                  </li>
                  <li>
                    <Link to='/RoIanalysis'>ROI Analysis</Link>
                  </li>
                  <li>
                    <Link to='/Assessments'>Assessments</Link>
                  </li>
                  <li>
                    <Link to='/MockInterviews'>Mock Interviews </Link>
                  </li>
                  <li>
                    <Link to='/SeamlesScheduling'>Seamless Scheduling</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to='/Interviewers'>Interviewers</Link>
              </li>
              <li className='menu-item-has-children'>
                <a href='#'>Resources</a>
                <ul className='sub-menu'>
                  <li>
                    <Link to='/Blog'>Blog</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className='nav-right-part nav-right-part-desktop align-self-center d-flex'>
            <div>
            <Link className='btn btn-border-base' to='/Login'>Login
            </Link>
            </div>
            <div>
            <Link className='btn btn-border-base' to='/Request'>Request Demo
            </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* ==================== Navbar Two end ====================*/}
    </>
  );
};
export default NavbarTwo;
