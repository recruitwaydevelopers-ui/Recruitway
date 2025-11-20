const candidateReducer = (state, action) => {
    switch (action.type) {

        case "SET_LOADING":
            return {
                ...state,
                isLoading: true
            }

        case "SET_LOADING_FALSE":
            return {
                ...state,
                isLoading: false,
            }

        case "SET_ALL_JOBS":
            return {
                ...state,
                isLoading: false,
                allJobs: action.payload.allJobs || []
            }

        case "SET_APPLIED_JOBS":
            return {
                ...state,
                isLoading: false,
                appliedJobs: action.payload.appliedJobs || []
            }

        case "SET_SELECTED_JOBS_DETAILS":
            return {
                ...state,
                isLoading: false,
                selectedJobDetails: action.payload || {}
            }

        default:
            return state
    }
}

export default candidateReducer