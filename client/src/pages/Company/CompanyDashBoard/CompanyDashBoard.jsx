import JobDashboard from './JobDashboard'
import InterviewStatusGraph from './InterviewStatusGraph'
import JobApplicationStats from './JobApplicationStats'
import ReportStats from './ReportStats'

const CompanyDashBoard = () => {
  return (
    <>
      <div className="container-fluid">
        <JobDashboard />
        <JobApplicationStats />
        <InterviewStatusGraph />
        <ReportStats />
      </div>
    </>
  )
}

export default CompanyDashBoard


