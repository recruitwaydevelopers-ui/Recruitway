import { createContext, useContext, useEffect, useReducer, useState } from "react";
import companyReducer from "../reducer/company-reducer";
import axios from "axios";
import { useAuthContext } from "./auth-context";
import toast from "react-hot-toast";

const CompanyContext = createContext()

const initialState = {
    isLoading: false,
    jobList: [],
    allAppliedCandidates: [],
    appiledCandidates: [],
    companyInterviews: [],
    companyInterviewsWithCV: [],
}

const CompanyProvider = ({ children }) => {

    const [state, dispatch] = useReducer(companyReducer, initialState)
    const { server, user, token, createNotification } = useAuthContext()
    // const token = localStorage.getItem("token")

    const getAllJobs = async () => {
        dispatch({ type: "SET_LOADING" })
        try {
            const response = await axios.get(`${server}/api/v1/company/get-all-job`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            )

            const { jobs } = response.data
            dispatch({ type: "SET_JOBS", payload: { jobs } })
        } catch (error) {
            // console.log(error);
            dispatch({ type: "SET_LOADING_FALSE" });
            toast.dismiss()
            toast.error(error.response.data.message)
        }
    }

    const addJob = async (jobData) => {
        try {
            const response = await axios.post(`${server}/api/v1/company/create-job-post`,
                jobData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                }
            )
            toast.dismiss()
            toast.success(response.data.message);
        } catch (error) {
            toast.dismiss()
            toast.error(error.response.data.message);
        }
    }

    const handleJobEdit = async (id, data) => {
        try {
            const res = await axios.patch(`${server}/api/v1/company/update-job/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            await getAllJobs()
            toast.success(res.data.message)
        } catch (error) {
            toast.dismiss()
            toast.error(error.response.data.message)
        }
    };

    const handleConfirmDeleteJob = async (jobToDeleteId) => {
        dispatch({ type: "SET_LOADING" })
        try {
            await axios.delete(`${server}/api/v1/company/delete-job/${jobToDeleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: "SET_DELETE_JOB", payload: { jobToDeleteId } })
        } catch (error) {
            // console.error('Error deleting job:', error);
            toast.dismiss()
            toast.error(error.response.data.message)
        }
    };

    const getAllApplicantsOnAllJob = async () => {
        dispatch({ type: "SET_LOADING" })
        try {
            const response = await axios.get(`${server}/api/v1/company/allapplicants`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            )
            const { applicants } = response.data
            dispatch({ type: "SET_ALL_APPLIED_CANDIDATE", payload: { applicants } })
        } catch (error) {
            toast.dismiss()
            toast.error(error.response.data.message)
        }
    }

    const getApplicantsOnJob = async (jobId) => {
        dispatch({ type: "SET_LOADING" })
        try {
            const response = await axios.get(`${server}/api/v1/company/applicants/${jobId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            )
            const { applicants } = response.data
            dispatch({ type: "SET_APPLIED_CANDIDATE", payload: { applicants } })
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const rejectShortlist = async (status, candidateId, applicationId) => {
        try {
            const response = await axios.put(`${server}/api/v1/company/changeStatus/${applicationId}`,
                { status, candidateId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            )
            const { message } = response.data
            toast.dismiss()
            toast.success(message)

            createNotification(candidateId, "SHORTLIST", `${user.fullname} has been ${status} for your job.`) 
        } catch (error) {
            toast.dismiss()
            toast.error(error.response.data.message)
        }
    }

    const getAllDoneInterviewsOfCompany = async () => {
        dispatch({ type: "SET_LOADING" })
        try {
            const response = await axios.get(`${server}/api/v1/company/getAllDoneInterviewsOfCompany`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                const { data } = response.data
                const { interviews, interviewsWithCV } = data
                dispatch({ type: "SET_ALL_COMPANY_INTERVIEW", payload: { interviews, interviewsWithCV } })
            } else {
                toast.warn(`Unexpected response: ${response.status}`);
            }
        } catch (error) {
            const message = error?.response?.data?.message || "Something went wrong while fetching interviews.";
            toast.error(message);
        } finally {
            dispatch({ type: "SET_LOADING_FALSE" });
        }
    };

    const getInterviewReport = async (interviewId) => {
        dispatch({ type: "SET_LOADING" });

        try {
            const response = await axios.get(`${server}/api/v1/company/${interviewId}/report`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const interview = response.data?.data;

            if (!interview) {
                toast.error("Interview report not found.");
                return null;
            }

            return interview;
        } catch (err) {
            console.error("Error fetching interview report:", err);

            // Extract error message from backend if available
            const backendMessage =
                err.response?.data?.message || "Failed to fetch interview report.";

            toast.error(backendMessage);

            return null;
        } finally {
            dispatch({ type: "SET_LOADING_FALSE" });
        }
    };

    return (
        <CompanyContext.Provider value={{
            ...state,
            getAllJobs,
            addJob,
            handleJobEdit,
            handleConfirmDeleteJob,
            getAllApplicantsOnAllJob,
            rejectShortlist,
            getAllDoneInterviewsOfCompany,
            getInterviewReport
        }}>
            {children}
        </CompanyContext.Provider>
    )
}

const useCompanyContext = () => {
    const CompanyContextValue = useContext(CompanyContext)

    if (!CompanyContextValue) {
        throw new Error("useCompanyContext used outside of the Provider")
    }

    return CompanyContextValue
}

export { CompanyContext, CompanyProvider, useCompanyContext }