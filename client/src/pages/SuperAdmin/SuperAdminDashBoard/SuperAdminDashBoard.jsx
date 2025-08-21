import SuperAdminCompanyStats from './SuperAdminCompanyStats'
import SuperAdminCandidateStats from './SuperAdminCandidateStats'
import SuperAdminJobStats from './SuperAdminJobStats'
import SuperAdminJobApplicationStats from './SuperAdminJobApplicationStats'
import SuperAdminInterviewStats from './SuperAdminInterviewStats'
import SuperAdminReportsStats from './SuperAdminReportsStats'

const SuperAdminDashBoard = () => {
  return (
    <>
      <div className="container-fluid">
        <SuperAdminCompanyStats />
        <SuperAdminCandidateStats />
        <SuperAdminInterviewStats />
        <SuperAdminJobStats />
        <SuperAdminJobApplicationStats />
        <SuperAdminReportsStats />
      </div>
    </>
  )
}

export default SuperAdminDashBoard