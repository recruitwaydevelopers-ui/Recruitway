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
    notifications: [],
    unreadCount: 0
}

const CompanyProvider = ({ children }) => {

    const [state, dispatch] = useReducer(companyReducer, initialState)
    const { server, user, token } = useAuthContext()
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
                dispatch({ type: "SET_ALL_COMPANY_INTERVIEW", payload: { data } })
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
        dispatch({ type: "SET_LOADING" })

        try {
            const response = await axios.get(`${server}/api/v1/company/${interviewId}/report`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const interview = response.data?.data;

            if (!interview) {
                toast.error("Interview report not found.");
                return null;
            }

            const formattedReport = {
                id: interview._id,
                interviewId: interview.interviewId,
                candidate: {
                    name: interview.candidateName,
                    email: interview.candidateEmail,
                },
                position: interview.positionTitle,
                date: interview.interviewDate,
                score: interview.overallScore,
                duration: `${interview.duration} minutes`,
                questions: {
                    answered: interview.questionsAnswered,
                    total: interview.totalQuestions,
                    percentage: interview.totalQuestions > 0
                        ? Math.round((interview.questionsAnswered / interview.totalQuestions) * 100)
                        : 0,
                },
                skills: interview.skills,
                interviewerSummary: interview.interviewerSummary,
                codeTasks: interview.codeTasks,
                createdAt: interview.createdAt,
                updatedAt: interview.updatedAt,
            };

            return formattedReport;

        } catch (err) {
            console.error("Error fetching interview report:", err);
            toast.error("Failed to fetch interview report.");
            return null;
        } finally {
            dispatch({ type: "SET_LOADING_FALSE" });
        }
    };

    const getNotification = async () => {
        dispatch({ type: "SET_LOADING" })
        try {
            const response = await axios.get(`${server}/api/v1/company/getCompanyNotification`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            )
            const { notifications, unreadCount } = response.data
            dispatch({ type: "SET_NOTIFICATION", payload: { notifications, unreadCount } })
        } catch (error) {
            toast.dismiss()
            toast.error(error.response.data.message)
        }
    }

    useEffect(() => {
        if (user && user.role === "company") {
            getNotification();
        }
    }, [user]);


    const markAsRead = async (id) => {
        try {
            const res = await axios.patch(`${server}/api/v1/company/markAsRead/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            )
            getNotification()
            toast.success(res.data.message);
        } catch (error) {
            toast.dismiss()
            toast.error(error.response.data.message)
        }
    }

    return (
        <CompanyContext.Provider value={{
            ...state,
            getAllJobs,
            addJob,
            handleJobEdit,
            handleConfirmDeleteJob,
            getAllApplicantsOnAllJob,
            rejectShortlist,
            getNotification,
            markAsRead,
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