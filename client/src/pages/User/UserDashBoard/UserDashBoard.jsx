import UserInterviewStatusGraph from './UserInterviewStatusGraph'
import UserJobApplicationStats from './UserJobApplicationStats'
import UserProfileCompletion from './UserProfileCompletion'

const UserDashBoard = () => {
  return (
    <>
      <div className="container-fluid">
        <UserProfileCompletion />
        <UserJobApplicationStats />
        <UserInterviewStatusGraph />
      </div>
    </>
  )
}

export default UserDashBoard