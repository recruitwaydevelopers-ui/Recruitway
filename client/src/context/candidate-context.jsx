import { createContext, useContext, useReducer } from "react";
import candidateReducer from "../reducer/candidate-reducer";
import { useAuthContext } from "./auth-context";
import axios from "axios";
import toast from "react-hot-toast";

const CandidateContext = createContext()

const initialState = {
    isLoading: false,
    allJobs: [],
    appliedJobs: [],
    shortlistedJobs: [],
    selectedJobDetails: {}
}

const CandidateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(candidateReducer, initialState)
    const { server, token, user } = useAuthContext()

    const getAllJobs = async () => {
        dispatch({ type: "SET_LOADING" })
        try {
            const res = await axios.get(`${server}/api/v1/candidate/getAllJobs`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            const { allJobs } = res.data
            dispatch({ type: "SET_ALL_JOBS", payload: { allJobs } })
        } catch (error) {
            dispatch({ type: "SET_LOADING_FALSE" });
            console.log(error);
        }
    }

    const appllyJobs = async (jobId, companyId) => {
        try {
            const res = await axios.post(`${server}/api/v1/candidate/apply-job`,
                { jobId, companyId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res?.data?.message) {
                toast.dismiss()
                toast.success(res.data.message);
            } else {
                toast.dismiss()
                toast.success("Applied successfully!");
            }
        } catch (error) {
            console.error(error);
            const message =
                error?.response?.data?.message || "Failed to apply for job.";
            toast.dismiss()
            toast.error(message);
        }
    };

    const getAppliedJobs = async () => {
        dispatch({ type: "SET_LOADING" })
        try {
            const res = await axios.get(`${server}/api/v1/candidate/applied-jobs/${user?.userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { appliedJobs } = res.data
            dispatch({ type: "SET_APPLIED_JOBS", payload: { appliedJobs } })
        } catch (error) {
            dispatch({ type: "SET_LOADING_FALSE" });
            console.error(error);
            const message =
                error?.response?.data?.message || "Failed to fetch applied jobs.";
            toast.dismiss()
            toast.error(message);
        }
    };

    const withdrawJobApplication = async (jobId) => {
        try {
            const res = await axios.delete(`${server}/api/v1/candidate/withdraw-job/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.dismiss()
            toast.success(res.data.message || "Withdrawn successfully.");
            await getAppliedJobs();

        } catch (error) {
            console.error(error);
            const message =
                error?.response?.data?.message || "Failed to withdraw application.";
            toast.dismiss()
            toast.error(message);
        }
    };

    const getSelectedJobDetails = async (jobId) => {
        dispatch({ type: "SET_LOADING" });

        try {
            const res = await axios.get(`${server}/api/v1/candidate/get-selected-job-detail/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { selectedJobDetails } = res.data;
            dispatch({ type: "SET_SELECTED_JOBS_DETAILS", payload: selectedJobDetails });
        } catch (error) {
            console.error("Error fetching selected job details:", error);

            const message = error?.response?.data?.message || "Failed to get job details.";
            toast.dismiss();
            toast.error(message);
        } finally {
            dispatch({ type: "SET_LOADING_FALSE" });
        }
    };

    return (
        <CandidateContext.Provider value={{
            ...state,
            getAllJobs,
            appllyJobs,
            getAppliedJobs,
            withdrawJobApplication,
            getSelectedJobDetails
        }}>
            {children}
        </CandidateContext.Provider>
    )
}

const useCandidateContext = () => {
    const CandidateContextValue = useContext(CandidateContext)

    if (!CandidateContextValue) {
        throw new Error("useCandidateContext used outside of the Provider")
    }

    return CandidateContextValue
}

export { CandidateContext, CandidateProvider, useCandidateContext }