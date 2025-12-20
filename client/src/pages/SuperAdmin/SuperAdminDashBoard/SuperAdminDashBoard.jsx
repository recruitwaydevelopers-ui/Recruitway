import SuperAdminCompanyStats from './SuperAdminCompanyStats'
import SuperAdminCandidateStats from './SuperAdminCandidateStats'
import SuperAdminJobStats from './SuperAdminJobStats'
import SuperAdminJobApplicationStats from './SuperAdminJobApplicationStats'
import SuperAdminInterviewStats from './SuperAdminInterviewStats'
import SuperAdminReportsStats from './SuperAdminReportsStats'

const SuperAdminDashBoard = () => {
  // return (
  //   <>
  //     <div className="container-fluid">
  //       <SuperAdminCompanyStats />
  //       <SuperAdminCandidateStats />
  //       <SuperAdminInterviewStats />
  //       <SuperAdminJobStats />
  //       <SuperAdminJobApplicationStats />
  //       <SuperAdminReportsStats />
  //     </div>
  //   </>
  // )


  return (
    <div className="container-fluid">

      {/* Company Statistics */}
      <div className="mb-4">
        <SuperAdminCompanyStats />
      </div>

      {/* Candidate Statistics */}
      <div className="mb-4">
        <SuperAdminCandidateStats />
      </div>

      {/* Interview Statistics */}
      <div className="mb-4">
        <SuperAdminInterviewStats />
      </div>

      {/* Job Statistics */}
      <div className="mb-4">
        <SuperAdminJobStats />
      </div>

      {/* Job Application Statistics */}
      <div className="mb-4">
        <SuperAdminJobApplicationStats />
      </div>

      {/* Reports & Feedback Statistics */}
      <div className="mb-4">
        <SuperAdminReportsStats />
      </div>
    </div>
  );
}

export default SuperAdminDashBoard