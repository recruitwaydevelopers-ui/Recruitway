const companyReducer = (state, action) => {
    switch (action.type) {

        case "SET_LOADING":
            return {
                ...state,
                isLoading: true,
            }

        case "SET_LOADING_FALSE":
            return {
                ...state,
                isLoading: false,
            }

        case "SET_JOBS":
            return {
                ...state,
                isLoading: false,
                jobList: action.payload.jobs
            }

        case "SET_DELETE_JOB":
            return {
                ...state,
                isLoading: false,
                jobList: state.jobList.filter(job => job._id !== action.payload.jobToDeleteId)
            }

        case "SET_ALL_APPLIED_CANDIDATE":
            return {
                ...state,
                isLoading: false,
                allAppliedCandidates: action.payload.applicants
            }

        case "SET_ALL_COMPANY_INTERVIEW":
            return {
                ...state,
                isLoading: false,
                companyInterviews: action.payload.data
            }

        case "SET_REPORTS":
            return {
                ...state,
                isLoading: false,
                reports: action.payload.data
            }

        case "SET_NOTIFICATION":
            return {
                ...state,
                isLoading: false,
                notifications: action.payload.notifications,
                unreadCount: action.payload.unreadCount
            }

        default:
            return state
    }
}

export default companyReducer