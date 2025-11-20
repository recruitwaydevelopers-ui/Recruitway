import React from 'react'
import BlogAreaThree from "../components/BlogAreaThree";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";

export const PrivacyPolicy = () => {
  return (
    <>
    {/* Navigation Bar */}
      <NavbarTwo/>
      {/* Navigation Bar */}
      <Breadcrumb title={"Privacy Policy"} />
       <div className='about-area pd-top-60 pd-bottom-60'>
        <div className='container'>
          <div className='row'>
          <div className='col-lg-12'>
          <div className=' mt-4'>
                <p className='content'><span className='policy-content-dt'>Effective Date:</span> May 14, 2025</p>
                <p className='content '><span className='policy-content-dt'>Company: </span> RecruitWay, Inc. ("RecruitWay")</p>
                <p className='content '><span className='policy-content-dt'>Contact:</span> privacy@RecruitWay.ai</p>
                <p className='content'>At RecruitWay, we value your trust and are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, share, and protect your personal information when you interact with our websites, platforms, and services ("Services").</p>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>Information We Collect</h5>
                <p className='content'>We may collect personal information in the following ways:</p>
                <ul>
                  <li>Directly from you (e.g., when you sign up or interact with us)</li>
                  <li>Automatically through our services (e.g., IP address, device/browser type)</li>
                  <li>From third parties (e.g., prospective employers, advertising partners, public sources)</li>
                </ul>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>For Job Candidates:</h5>
                <ul>
                  <li>Contact details (name, email, phone, etc.)</li>
                  <li>Resume and job history</li>
                  <li>Interview videos, recordings, and performance assessments</li>
                  <li>Demographic data (optional)</li>
                  <li>Social media profile information</li>
                </ul>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>For Website Visitors and Customers:</h5>
                <ul>
                  <li>Contact information</li>
                  <li>Web analytics (interactions, referring source, etc.)</li>
                  <li>Social media and location data</li>
                </ul>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>How We Use Your Information</h5>
                <p className='content'>We use the information we collect to:</p>
                <ul>
                  <li>Provide and personalize our services</li>
                  <li>Conduct interviews and performance assessments</li>
                  <li>Improve our platform and offerings</li>
                  <li>Communicate updates, support, and promotional content</li>
                  <li>Comply with legal obligations and protect our users</li>
                </ul>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>Who We Share Your Data With</h5>
                <p className='content'>We may share your data with:</p>
                <ul>
                  <li>Service Providers (e.g., hosting, analytics, support)</li>
                  <li>Prospective and Interested Employers (only with your consent)</li>
                  <li>Advertising and Analytics Partners</li>
                  <li>Legal and regulatory authorities, if required</li>
                  <li>Third parties in the event of a merger or acquisition</li>
                </ul>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>Your Privacy Choices</h5>
                <ul>
                  <li>Opt out of marketing emails by clicking "unsubscribe" in emails</li>
                  <li>Manage cookies and tracking through your browser settings</li>
                  <li>Request access, correction, or deletion of your data by contacting us</li>
                </ul>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>Data Security and Retention</h5>
                <p className='content'>We use technical, organizational, and administrative safeguards to protect your data. Your information is retained only as long as necessary for business purposes or legal compliance.</p>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>Cookies and Tracking Technologies</h5>
                <p className='content'>RecruitWay uses cookies and similar technologies to analyze usage, enhance features, and deliver targeted ads. You can manage or disable cookies through your browser settings.</p>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>Children's Privacy</h5>
                <p className='content'>Our services are not intended for children under 16. We do not knowingly collect personal data from children</p>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>Your Rights by Region</h5>
                <p className='content'>U.S. Residents (Including CA, VA, CO, etc.):</p>
                <p>You have rights to access, delete, correct, or opt-out of certain data uses.</p>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>California Residents (CCPA):</h5>
                <p className='content'>You can opt out of the "sale" or "sharing" of personal information.</p>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>EU, UK, and EEA Residents (GDPR):</h5>
                <p className='content'>You have rights to access, rectify, delete, and restrict the use of your data. We comply with the EU-U.S. and Swiss-U.S. Data Privacy Framework.</p>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>International Data Transfers</h5>
                <p className='content'>We operate globally and may transfer your data to the U.S. and other jurisdictions. We follow required safeguards, including participation in the Data Privacy Framework.</p>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>Updates to This Policy</h5>
                <p className='content'>We may update this Privacy Policy periodically. Changes will be posted on this page, and your continued use of our services constitutes acceptance of the updated terms.</p>
              </div>
              <div className=' mt-4'>
                <h5 className='title'>Contact Us</h5>
                <p className='content'>If you have any questions or concerns about this Privacy Policy or your data, please contact:</p>
                <p className='content'><span className='policy-content-dt'>Email:</span> privacy@RecruitWay.ai</p>
                <p className='content'>If you are located in the EU or UK, additional contact options will be provided upon request.</p>
              </div>
          </div>
          </div>
        </div>
      </div>

      {/* Footer One */}
      <FooterTwo/>
    </>
  )
}
export default PrivacyPolicy;
