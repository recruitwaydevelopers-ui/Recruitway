import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import InterviewerSidebar from '../../components/Interviewer/InterviewerSidebar/InterviewerSidebar'
import InterviewerNavbar from '../../components/Interviewer/InterviewerHeader/InterviewerNavbar'
// import Customizer from '../../components/Customizer'
import LogoAnimation from '../../components/LogoAnimation'

const Interviewer = () => {
  useEffect(() => {
    // Initialize sidebar settings
    const manageSidebarType = () => {
      const setSidebarType = () => {
        const width = window.innerWidth > 0 ? window.innerWidth : screen.width;
        const mainWrapper = document.getElementById('main-wrapper');

        if (width < 1170) {
          mainWrapper.setAttribute('data-sidebartype', 'mini-sidebar');
          mainWrapper.classList.add('mini-sidebar');
        } else {
          mainWrapper.setAttribute('data-sidebartype', 'full');
          mainWrapper.classList.remove('mini-sidebar');
        }
      };

      window.addEventListener('resize', setSidebarType);
      setSidebarType(); // Initial call

      // Sidebar toggler functionality
      const sidebartogglers = document.querySelectorAll('.sidebartoggler');
      sidebartogglers.forEach(toggler => {
        toggler.addEventListener('click', () => {
          const mainWrapper = document.getElementById('main-wrapper');
          mainWrapper.classList.toggle('mini-sidebar');
          mainWrapper.classList.toggle('show-sidebar');

          if (mainWrapper.classList.contains('mini-sidebar')) {
            toggler.checked = true;
            mainWrapper.setAttribute('data-sidebartype', 'mini-sidebar');
          } else {
            toggler.checked = false;
            mainWrapper.setAttribute('data-sidebartype', 'full');
          }

          // Toggle text-primary class
          const icon = toggler.querySelector('i');
          if (icon) icon.classList.toggle('text-primary');
        });
      });

      // Full sidebar functionality
      const fullsidebar = document.querySelector('.fullsidebar');
      if (fullsidebar) {
        fullsidebar.addEventListener('click', () => {
          const mainWrapper = document.getElementById('main-wrapper');
          mainWrapper.setAttribute('data-sidebartype', 'full');

          const fullsidebarIcon = fullsidebar.querySelector('i');
          if (fullsidebarIcon) {
            fullsidebarIcon.classList.remove('text-dark');
            fullsidebarIcon.classList.add('text-primary');
          }

          const sidebartogglerIcons = document.querySelectorAll('.sidebartoggler i');
          sidebartogglerIcons.forEach(icon => icon.classList.remove('text-primary'));
        });
      }

      return () => {
        window.removeEventListener('resize', setSidebarType);
        sidebartogglers.forEach(toggler => {
          toggler.removeEventListener('click', () => { });
        });
        if (fullsidebar) fullsidebar.removeEventListener('click', () => { });
      };
    };

    // Initialize sidebar position
    const manageSidebarPosition = () => {
      const mainWrapper = document.getElementById('main-wrapper');
      mainWrapper.setAttribute('data-sidebar-position', 'fixed');
      mainWrapper.setAttribute('data-header-position', 'fixed');
    };

    manageSidebarType();
    manageSidebarPosition();
  }, []);

  return (
    <>
      <LogoAnimation />
      <div className="page-wrapper" id="main-wrapper" data-theme="blue_theme" data-layout="vertical" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed">
        <InterviewerSidebar />
        <div className="body-wrapper">
          <InterviewerNavbar />
          <Outlet />
        </div>
      </div>
      {/* <Customizer /> */}
    </>
  )
}

export default Interviewer