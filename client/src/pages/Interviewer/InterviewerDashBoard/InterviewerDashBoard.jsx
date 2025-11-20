import InterviewerProfileCompletion from './InterviewerProfileCompletion'
import InterviewerInterviewStatusGraph from './InterviewerInterviewStatusGraph'
import InterviewerReportStats from './InterviewerReportStats'

const InterviewerDashBoard = () => {
  return (
    <>
      <div className="container-fluid">
        <InterviewerProfileCompletion />
        <InterviewerInterviewStatusGraph />
        <InterviewerReportStats />
      </div>
    </>
  )
}

export default InterviewerDashBoard