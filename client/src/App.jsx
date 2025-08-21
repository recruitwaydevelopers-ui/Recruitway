import { Toaster } from 'react-hot-toast'
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register'
import { Navigate, Route, Routes } from 'react-router-dom';
import WaitingReply from './pages/WaitingReply';
import Company from './layout/Company/Company';
import CompanyWrapper from './wrapper/CompanyWrapper';
import SuperAdminWrapper from './wrapper/SuperAdminWrapper';
import SuperAdmin from './layout/SuperAdmin/SuperAdmin';
import InterviewerWrapper from './wrapper/InterviewerWrapper';
import Interviewer from './layout/Interviewer/Interviewer';
import UserWrapper from './wrapper/UserWrapper';
import User from './layout/User/User';
import CompanyDashBoard from './pages/Company/CompanyDashBoard/CompanyDashBoard';
import SuperAdminDashBoard from './pages/SuperAdmin/SuperAdminDashBoard/SuperAdminDashBoard';
import InterviewerDashBoard from './pages/Interviewer/InterviewerDashBoard/InterviewerDashBoard';
import UserDashBoard from './pages/User/UserDashBoard/UserDashBoard';
import CompanyCandidate from './pages/Company/CompanyCandidate/CompanyCandidate';
import CompanyInterviewers from './pages/Company/CompanyInterviewers/CompanyInterviewers';
import CompanyReport from './pages/Company/CompanyReport/CompanyReport';
import CompanyJobPosts from './pages/Company/CompanyJobPosts/CompanyJobPosts';
import CompanyCreateJobPost from './pages/Company/CompanyJobPosts/CompanyCreateJobPost';
import CompanyChatWithSuperAdmin from './pages/Company/CompanyChatWithSuperAdmin/CompanyChatWithSuperAdmin';
import CompanyProfile from './pages/Company/CompanyProfile/CompanyProfile';
import Dashboard from './pages/Interview/JustForTrail/Dashboard';
import Candidates from './pages/Interview/JustForTrail/Candidates';
import InterviewSession from './pages/Interview/JustForTrail/InterviewSession';
import CandidateInterview from './pages/Interview/JustForTrail/CandidateInterview';
import AIInterview from './pages/Interview/JustForTrail/AIInterview';
import DashboardHTML from './pages/Interview/JustForTrail/DashboardHTML';
import OpenAiTest from './pages/Interview/JustForTrail/OpenAiTest';
import SendLinkModal from './pages/Interview/JustForTrail/SendLinkModal';
import Test from './pages/Interview/JustForTrail/Test';
import UserJobs from './pages/User/UserJobs/UserJobs';
import UserJobsApplied from './pages/User/UserJobsApplied/UserJobsApplied';
import UserProfile from './pages/User/UserProfile/UserProfile';
import SettingsPage from './pages/SettingsPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SuperAdminProfile from './pages/SuperAdmin/SuperAdminProfile/SuperAdminProfile';
import SuperAdminAllCandidates from './pages/SuperAdmin/SuperAdminAllCandidates/SuperAdminAllCandidates';
import SuperAdminAllCompanies from './pages/SuperAdmin/SuperAdminAllCompanies/SuperAdminAllCompanies';
import CompanyCandidateProfile from './pages/Company/CompanyCandidate/CompanyCandidateProfile';
import ApplicationDetailPage from './pages/Company/CompanyNotification/ApplicationDetailPage';
import NotificationsPage from './pages/Company/CompanyNotification/NotificationsPage';
import SuperAdminCompaniesProfile from './pages/SuperAdmin/SuperAdminCompaniesProfile/SuperAdminCompaniesProfile';
import SuperAdminCompaniesJobs from './pages/SuperAdmin/SuperAdminCompaniesJobs/SuperAdminCompaniesJobs';
import SuperAdminJobDetailsPage from './pages/SuperAdmin/SuperAdminJobDetailsPage/SuperAdminJobDetailsPage';
import ViewApplicantPage from './pages/SuperAdmin/SuperAdminApplicantsPages/ViewApplicantPage';
import ManageApplicantsPage from './pages/SuperAdmin/SuperAdminApplicantsPages/ManageApplicantsPage';
import AllApplicantsPage from './pages/SuperAdmin/SuperAdminApplicantsPages/AllApplicantsPage';
import SuperAdminScheduleInterview from './pages/SuperAdmin/SuperAdminScheduleInterview/SuperAdminScheduleInterview';
import SuperAdminInterviewer from './pages/SuperAdmin/SuperAdminInterviewer/SuperAdminInterviewer';
import InterviewReportGenerator from './pages/Interviewer/InterviewReportGenerator/InterviewReportGenerator';
import SuperAdminCompaniesCard from './pages/SuperAdmin/SuperAdminCompaniesCard/SuperAdminCompaniesCard';
import SuperAdminAllInterviews from './pages/SuperAdmin/SuperAdminAllInterviews/SuperAdminAllInterviews';
import UserJobDetails from './pages/User/UserJobDetails/UserJobDetails';
import UserAllInterview from './pages/User/UserAllInterview/UserAllInterviewByJobPost';
import SuperAdminAllShortlistedCandidates from './pages/SuperAdmin/SuperAdminAllShortlistedCandidates/SuperAdminAllShortlistedCandidates';
import VerificationPage from './pages/VerificationPage';
import SuperAdminAuthVerify from './pages/SuperAdmin/SuperAdminAuthVerify/SuperAdminAuthVerify';


import InterviewerProfile from './pages/Interviewer/InterviewerProfile/InterviewerProfile';
import SuperAdminInterviewerProfile from './pages/SuperAdmin/SuperAdminInterviewer/SuperAdminInterviewerProfile';
import InterviewerAllInterviewsByJobPosts from './pages/Interviewer/InterviewerAllInterviews/InterviewerAllInterviewsByJobPosts';
import InterviewerAllInterviewsByCV from './pages/Interviewer/InterviewerAllInterviews/InterviewerAllInterviewsByCV';
import SuperAdminReport from './pages/SuperAdmin/SuperAdminReport/SuperAdminReport';
import SuperAdminJoinInterviewModal from './pages/SuperAdmin/SuperAdminAllInterviews/SuperAdminJoinInterviewModal';
import SuperAdminChat from './pages/SuperAdmin/SuperAdminChat/SuperAdminChat';
import GoogleLoginButton from './pages/GoogleLoginButton';
import LinkedInLoginButton from './pages/LinkedInLoginButton';
import RoomPageWithZegoCloud from './pages/Interview/InterviewRoom/RoomPageWithZegoCloud';
import CompanyCVForInterview from './pages/Company/CompanyCVForInterview/CompanyCVForInterview';
import CvUploaded from './pages/Company/CompanyCVForInterview/CvUploaded';
import SuperAdminCVRecived from './pages/SuperAdmin/SuperAdminCVRecived/SuperAdminCVRecived';
import JobDetailsWithCVs from './pages/SuperAdmin/SuperAdminCVRecived/JobDetailsWithCVs';
import ScheduleInterviewWithCV from './pages/SuperAdmin/SuperAdminCVRecived/ScheduleInterviewWithCV';
import SuperAdminAllInterviewsByCV from './pages/SuperAdmin/SuperAdminAllInterviews/SuperAdminAllInterviewsByCV';
import InterviewAccessForCandidate from './pages/User/CandidateVideoRoom/InterviewAccessForCandidate';
import InterviewAccessForInterviewer from './pages/Interviewer/InterviewerVideoRoom/InterviewAccessForInterviewer';
import UserAllInterviewByJobPost from './pages/User/UserAllInterview/UserAllInterviewByJobPost';
import InterviewAccessForRandomCandidate from './pages/User/CandidateVideoRoom/InterviewAccessForRandomCandidate';


function App() {

  return (
    <>
      {/* <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        containerClassName="toast-container fixed-top d-flex justify-content-center"
        containerStyle={{
          zIndex: 99999999,
          width: '100%',
          maxWidth: '360px',
          margin: '0 auto',
          padding: '1rem',
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: 'linear-gradient(135deg, #1e1e2f, #2e2e3e)',
            color: '#f0f0f0',
            fontSize: '15px',
            padding: '14px 24px',
            borderRadius: '10px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            fontFamily: "'Inter', 'Poppins', sans-serif",
            fontWeight: 500,
            letterSpacing: '0.4px',
            transition: 'all 0.3s ease-in-out',
          },
          success: {
            style: {
              background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
              color: '#fff',
            },
            icon: '✅',
            className: 'toast-success',
          },
          error: {
            style: {
              background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
              color: '#fff',
            },
            icon: '❌',
            className: 'toast-error',
          },
          info: {
            style: {
              background: 'linear-gradient(135deg, #2196f3, #6dd5fa)',
              color: '#fff',
            },
            icon: 'ℹ️',
            className: 'toast-info',
          },
        }}
      /> */}

      {/* <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 999999,
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#ffffff",
            color: "#1a1a1a",
            fontSize: "14px",
            padding: "16px 22px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 500,
            lineHeight: "1.5",
            border: "1px solid #f0f0f0",
            boxSizing: "border-box",
            transition: "all 0.2s ease-out",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "auto",
            maxWidth: "min(420px, 90vw)"
          },
          success: {
            style: {
              background: "#ffffff",
              color: "#1a1a1a",
              borderLeft: "4px solid #10b981",
            },
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
          },
          error: {
            style: {
              background: "#ffffff",
              color: "#1a1a1a",
              borderLeft: "4px solid #ef4444",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
          info: {
            style: {
              background: "#ffffff",
              color: "#1a1a1a",
              borderLeft: "4px solid #3b82f6",
            },
            iconTheme: {
              primary: "#3b82f6",
              secondary: "#ffffff",
            },
          },
          loading: {
            style: {
              background: "#ffffff",
              color: "#1a1a1a",
              borderLeft: "4px solid #64748b",
            },
            iconTheme: {
              primary: "#64748b",
              secondary: "#ffffff",
            },
          },
        }}
      /> */}


      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={12}
        containerStyle={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          zIndex: 999999,
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#ffffff",
            color: "#1a1a1a",
            fontSize: "13px",
            padding: "18px 24px",
            borderRadius: "8px",
            boxShadow: "0 2px 16px rgba(0, 0, 0, 0.08)",
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontWeight: 500,
            lineHeight: "1.45",
            border: "1px solid #e5e7eb",
            boxSizing: "border-box",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            width: "auto",
            maxWidth: "min(420px, 90vw)"
          },
          success: {
            style: {
              background: "#f8fafc",
              borderLeft: "4px solid #059669",
              boxShadow: "0 2px 16px rgba(5, 150, 105, 0.1)"
            },
            iconTheme: {
              primary: "#059669",
              secondary: "#f0fdf4"
            }
          },
          error: {
            style: {
              background: "#f8fafc",
              borderLeft: "4px solid #dc2626",
              boxShadow: "0 2px 16px rgba(220, 38, 38, 0.1)"
            },
            iconTheme: {
              primary: "#dc2626",
              secondary: "#fef2f2"
            }
          },
          info: {
            style: {
              background: "#f8fafc",
              borderLeft: "4px solid #2563eb",
              boxShadow: "0 2px 16px rgba(37, 99, 235, 0.1)"
            },
            iconTheme: {
              primary: "#2563eb",
              secondary: "#eff6ff"
            }
          },
          loading: {
            style: {
              background: "#f8fafc",
              borderLeft: "4px solid #4b5563",
              boxShadow: "0 2px 16px rgba(75, 85, 99, 0.1)"
            },
            iconTheme: {
              primary: "#4b5563",
              secondary: "#f3f4f6"
            }
          }
        }}
      />

      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<Login />} />
        <Route path='/login-with-google' element={<GoogleLoginButton />} />
        <Route path='/login-with-linkedin' element={<LinkedInLoginButton />} />
        <Route path="/linkedin-callback" element={<LinkedInLoginButton />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verification' element={<VerificationPage />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path='/waitingReply' element={<WaitingReply />} />
        <Route path="/generateReport" element={<InterviewReportGenerator />} />
        <Route path='/videoroomforCVInterview' element={<InterviewAccessForRandomCandidate />} />
        <Route path="/videoroom/:roomId" element={<RoomPageWithZegoCloud />} />

        <Route path="/" element={<Dashboard />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/interview/:id" element={<InterviewSession />} />
        <Route path="/candidate-interview/:id" element={<CandidateInterview />} />
        <Route path="/ai-interview/:id" element={<AIInterview />} />
        <Route path="/dashboardHTML" element={<DashboardHTML />} />
        <Route path="/openAitest" element={<OpenAiTest />} />
        <Route path="/sendlinkmodel" element={<SendLinkModal />} />
        <Route path="/test" element={<Test />} />
        


        {/* Company Routes */}
        <Route path="/company" element={
          <CompanyWrapper>
            <Company />
          </CompanyWrapper>
        }>
          <Route path='dashboard' element={<CompanyDashBoard />} />
          <Route path='candidates' element={<CompanyCandidate />} />
          <Route path="candidate-profile" element={<CompanyCandidateProfile />} />
          <Route path='interviewers' element={<CompanyInterviewers />} />
          <Route path='report' element={<CompanyReport />} />
          <Route path='job-posts' element={<CompanyJobPosts />} />
          <Route path='uploaded-cv' element={<CvUploaded />} />
          <Route path='upload-cv' element={<CompanyCVForInterview />} />
          <Route path='create-job-post' element={<CompanyCreateJobPost />} />
          <Route path='chat-with-superadmin' element={<CompanyChatWithSuperAdmin />} />
          <Route path='setting' element={<SettingsPage />} />
          <Route path='profile' element={<CompanyProfile />} />
          <Route path="applications/:applicationId" element={<ApplicationDetailPage />} />
          <Route path="notifications" element={<NotificationsPage />} />

        </Route>

        {/* Super Admin Routes */}
        <Route path="/superadmin" element={
          <SuperAdminWrapper>
            <SuperAdmin />
          </SuperAdminWrapper>
        }>
          <Route path='dashboard' element={<SuperAdminDashBoard />} />
          <Route path='profile' element={<SuperAdminProfile />} />
          <Route path='interviewers' element={<SuperAdminInterviewer />} />
          <Route path='chats' element={<SuperAdminChat />} />
          {/* <Route path='allCompanies' element={<SuperAdminAllCompanies />} />
          <Route path='allCandidates' element={<SuperAdminAllCandidates />} /> */}
          <Route path='verifyAuth' element={<SuperAdminAuthVerify />} />
          <Route path='companies' element={<SuperAdminCompaniesCard />} />
          <Route path='allInterviews' element={<SuperAdminAllInterviews />} />
          <Route path='allInterviewsbycv' element={<SuperAdminAllInterviewsByCV />} />
          <Route path='interviewerProfile/:id' element={<SuperAdminInterviewerProfile />} />
          <Route path='companiesProfile' element={<SuperAdminCompaniesProfile />} />
          <Route path='companiesJobs/:companyId' element={<SuperAdminCompaniesJobs />} />
          <Route path='companies-job-details/:jobId' element={<SuperAdminJobDetailsPage />} />
          <Route path='jobs/:id/viewallapplicants' element={<AllApplicantsPage />} />
          <Route path='jobs/:id/applicants' element={<ViewApplicantPage />} />
          <Route path='scheduleInterview' element={<SuperAdminScheduleInterview />} />
          <Route path='shortlistedCandidates' element={<SuperAdminAllShortlistedCandidates />} />
          <Route path='candidate-report' element={<SuperAdminReport />} />
          <Route path='setting' element={<SettingsPage />} />
          <Route path='videoroom' element={<SuperAdminJoinInterviewModal />} />
          <Route path='jobs/:id/manageapplicants' element={<ManageApplicantsPage />} />
          <Route path="cv-received" element={<SuperAdminCVRecived />} />
          <Route path="cv-received/:jobId" element={<JobDetailsWithCVs />} />
          <Route path="schedule-interview-with-cv/:jobId/:encodedCVId" element={<ScheduleInterviewWithCV />} />

        </Route>

        {/* Interviewer Routes */}
        <Route path="/interviewer" element={
          <InterviewerWrapper>
            <Interviewer />
          </InterviewerWrapper>
        }>
          <Route path='dashboard' element={<InterviewerDashBoard />} />
          <Route path='profile' element={<InterviewerProfile />} />
          <Route path='interviews-by-job-posts' element={<InterviewerAllInterviewsByJobPosts />} />
          <Route path='interviews-by-cv' element={<InterviewerAllInterviewsByCV />} />
          <Route path='videoroom' element={<InterviewAccessForInterviewer />} />
          <Route path='setting' element={<SettingsPage />} />

        </Route>

        {/* User Routes */}
        <Route path="/user" element={
          <UserWrapper>
            <User />
          </UserWrapper>
        }>
          <Route path='dashboard' element={<UserDashBoard />} />
          <Route path='jobs' element={<UserJobs />} />
          <Route path='jobs-applied' element={<UserJobsApplied />} />
          <Route path='jobs-applied-details/:jobId' element={<UserJobDetails />} />
          <Route path='interviews-by-job-posts' element={<UserAllInterviewByJobPost />} />
          <Route path='setting' element={<SettingsPage />} />
          <Route path='profile' element={<UserProfile />} />
          <Route path="videoroom" element={<InterviewAccessForCandidate />} />
        </Route>

      </Routes>
    </>

  )
}

export default App
