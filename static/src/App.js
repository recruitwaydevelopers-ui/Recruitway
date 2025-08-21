import { BrowserRouter, Routes, Route } from "react-router-dom";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import HomeTwo from "./pages/HomeTwo";
import Interviewers from "./pages/Interviewers";
import InterviewOutsourcing from "./pages/InterviewOutsourcing";
import Assessments  from "./pages/Assessments";
import SeamlesScheduling from "./pages/SeamlessScheduling";
import RecordedInterviews from "./pages/RecordedInterviews";
import RoIanalysis from "./pages/RoIanalysis";
import RoleFit from "./pages/RoleFit";
import MockInterviews from "./pages/MockInterviews";
import Request from "./pages/Request";
import Scrollpage from "./pages/Scrollpage";
import OurCompany from "./pages/OurCompany";
import Timelinescroll from "./pages/Timelinescroll";
import Harnessing from "./pages/Harnessing";
import Breaking from "./pages/Breaking";
import Growing from "./pages/Growing";
import JoinInterview from "./pages/JoinInterview";
import AOS from "aos";
import Recruitwayqualify from "./pages/Recruitwayqualify";
import HiringInsights from "./pages/HiringInsights";
import RecruitwayInterview from "./pages/RecruitwayInterview";
import Pagetopscroll from './pages/Pagetopscroll';
import Candidate from './pages/Candidate';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Login from './pages/Login';
import "aos/dist/aos.css";
import { useEffect } from "react";
import ScrollToTop from "react-scroll-to-top";
function App() {
  useEffect(() => {
    AOS.init({
      offset: 0,
      easing: "ease",
      once: true,
    });
    AOS.refresh();
  }, []);
  return (
    <BrowserRouter>
    <Pagetopscroll/>
      <Routes>
        <Route exact path='/' element={<HomeTwo />} />
        <Route exact path='/Blog' element={<Blog/>} />
        <Route exact path='/BlogDetails' element={<BlogDetails />} />
        <Route exact path='/interviewers' element={<Interviewers />} />
        <Route exact path='/rolefit' element={<RoleFit />} />
        <Route exact path='/interviewOutsourcing' element={<InterviewOutsourcing />} />
        <Route exact path='/assessments' element={<Assessments />} />
        <Route exact path='/seamlesScheduling' element={<SeamlesScheduling />} />
        <Route exact path='/recordedInterviews' element={<RecordedInterviews/>} />
        <Route exact path='/MockInterviews' element={<MockInterviews/>} />
        <Route exact path='/RoIanalysis' element={<RoIanalysis />} />
        <Route exact path='/Request' element={<Request />} />
        <Route exact path='/scrollpage' element={<Scrollpage/>} />
        <Route exact path='/OurCompany' element={<OurCompany/>} />
        <Route exact path='/Harnessing' element={<Harnessing/>} />
        <Route exact path='/Breaking' element={<Breaking/>} />
        <Route exact path='/Growing' element={<Growing/>} />
        <Route exact path='/Recruitwayqualify' element={<Recruitwayqualify/>} />
        <Route exact path='/timelinescroll' element={<Timelinescroll/>} />
        <Route exact path='/HiringInsights' element={<HiringInsights/>} />
        <Route exact path='/RecruitwayInterview' element={<RecruitwayInterview/>} />
        <Route exact path='/JoinInterview' element={<JoinInterview/>} />
        <Route exact path='/Candidate' element={<Candidate/>} />
         <Route exact path='/PrivacyPolicy' element={<PrivacyPolicy/>} />
        <Route exact path='/TermsConditions' element={<TermsConditions/>} />
         <Route exact path='/Login' element={<Login/>} />
      </Routes>
      <ScrollToTop smooth color='#246BFD' />
    </BrowserRouter>
  );
}

export default App;
