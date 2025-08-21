import { createContext, useContext, useReducer } from "react";
import superAdminReducer from "../reducer/superadmin-reducer";
import axios from "axios";
import { useAuthContext } from "./auth-context";
import toast from "react-hot-toast";

const SuperAdmminContext = createContext()

const initialState = {
    isLoading: false,
    allCompaniesWithTheirJobs: [],
    companieProfile: [],
    companyJobs: [],
    jobDetails: {},
    applicants: {
        job: {},
        applicant: []
    },
    applicantProfile: {},
    interviewers: [],
    companies: [],
    candidates: [],
    interviewes: [],
    interviewesbycv: [],
    shortlisted: [],
    report: {}
}

const SuperAdminProvider = ({ children }) => {

    const [state, dispatch] = useReducer(superAdminReducer, initialState)
    const { server, token } = useAuthContext()

    // const fetchUsers = async () => {
    //     dispatch({ type: "SET_LOADING" });
    //     try {
    //         const response = await axios.get(`${server}/api/v1/superadmin/getAllAuth`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //         const { auth } = response.data;
    //         dispatch({ type: "SET_ALL_AUTH_FOR_SUPERADMIN", payload: auth });
    //     } catch (err) {
    //         console.log(err.response?.data?.message || 'Failed to fetch users');
    //     } finally {
    //         dispatch({ type: "SET_LOADING_FALSE" });
    //     }
    // };


    const getAllCompaniesWithJobs = async () => {
        dispatch({ type: "SET_LOADING" });

        try {
            const response = await axios.get(`${server}/api/v1/superadmin/get-all-companies-with-jobs`,
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { companiesWithJobs } = response.data;

            dispatch({ type: "SET_ALL_COMPANIES_WITH_JOBS", payload: companiesWithJobs });
        } catch (error) {
            console.error("Error fetching companies:", error);

            dispatch({ type: "SET_LOADING_FALSE" });

            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    };

    const getAllJobOfSingleCompany = async (id) => {
        dispatch({ type: "SET_LOADING" });

        try {
            const response = await axios.get(`${server}/api/v1/superadmin/get-companies-all-jobs/${id}`,
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { jobs } = response.data;
            dispatch({ type: "SET_ALL_JOBS_OF_SINGLE_COMPANIES", payload: jobs });
        } catch (error) {
            console.error("Error fetching companies:", error);

            dispatch({ type: "SET_LOADING_FALSE" });

            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    }

    const getDetailsOfSingleJob = async (jobId) => {
        dispatch({ type: "SET_LOADING" });

        try {
            const response = await axios.get(`${server}/api/v1/superadmin/getJobDetails/${jobId}`,
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { jobDetail } = response.data;
            dispatch({ type: "SET_DETAILS_OF_SINGLE_JOB", payload: jobDetail });
        } catch (error) {
            console.error("Error fetching companies:", error);
            dispatch({ type: "SET_LOADING_FALSE" });
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    }

    const handleChangeStatus = async (status, jobId) => {
        dispatch({ type: "SET_LOADING" });
        try {
            const response = await axios.post(`${server}/api/v1/superadmin/changeJobStatus/${jobId}`,
                { status },
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { message } = response.data;
            toast.dismiss();
            toast.success(message)

            dispatch({ type: "SET_LOADING_FALSE" });
        } catch (error) {
            console.error("Error fetching companies:", error);

            dispatch({ type: "SET_LOADING_FALSE" });

            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    }

    const handleMarkAsFlag = async (jobId) => {
        dispatch({ type: "SET_LOADING" });
        try {
            const response = await axios.patch(`${server}/api/v1/superadmin/mark-as-flagged/${jobId}`,
                {},
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { message } = response.data;
            toast.dismiss();
            toast.success(message)

            dispatch({ type: "SET_LOADING_FALSE" });
        } catch (error) {
            console.error("Error fetching companies:", error);

            dispatch({ type: "SET_LOADING_FALSE" });

            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    }

    const handleMarkAsUnFlag = async (jobId) => {
        dispatch({ type: "SET_LOADING" });
        try {
            const response = await axios.patch(`${server}/api/v1/superadmin/remove-as-flagged/${jobId}`,
                {},
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { message } = response.data;
            toast.dismiss();
            toast.success(message)

            dispatch({ type: "SET_LOADING_FALSE" });
        } catch (error) {
            console.error("Error fetching companies:", error);
            dispatch({ type: "SET_LOADING_FALSE" });
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    }

    const handleConfirmDeleteJob = async (jobId) => {
        dispatch({ type: "SET_LOADING" });
        try {
            const response = await axios.delete(`${server}/api/v1/superadmin/deleteJob/${jobId}`,
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                });
            // getAllCompanies()

            const { message } = response.data;
            toast.dismiss();
            toast.success(message)
            dispatch({ type: "SET_LOADING_FALSE" });
        } catch (error) {
            console.error("Error fetching companies:", error);
            dispatch({ type: "SET_LOADING_FALSE" });
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    }

    const handleApplicants = async (jobId) => {
        dispatch({ type: "SET_LOADING" });
        try {
            const response = await axios.get(`${server}/api/v1/superadmin/getAllApplicants/${jobId}`,
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { job, applicants } = response.data;

            dispatch({ type: "SET_APPLICANTS_DATA", payload: { job, applicants } });
        } catch (error) {
            console.error("Error fetching companies:", error);
            dispatch({ type: "SET_LOADING_FALSE" });
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    }

    const getApplicantsProfile = async (id) => {
        dispatch({ type: "SET_LOADING" });
        try {
            const response = await axios.get(`${server}/api/v1/superadmin/getSingleApplicants/${id}`,
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { applicantProfile } = response.data;

            dispatch({ type: "SET_SINGLE_APPLICANTS_DATA", payload: applicantProfile });
        } catch (error) {
            // console.error("Error fetching companies:", error);
            dispatch({ type: "SET_LOADING_FALSE" });
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    }

    const getAllInterviewers = async () => {
        try {
            dispatch({ type: "SET_LOADING" });
            const res = await axios.get(`${server}/api/v1/superadmin/getAllInterviewers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const { data } = res.data;
            dispatch({ type: "SET_INTERVIEWER", payload: data });

        } catch (error) {
            // console.error("Error fetching interviewers:", error);
            dispatch({ type: "SET_LOADING_FALSE" });
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    };

    const getAllCompaniesWithVerificationStatus = async () => {
        dispatch({ type: "SET_LOADING" });

        try {
            const response = await axios.get(`${server}/api/v1/superadmin/get-all-companies-with-verification-status`,
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { companies } = response.data;

            dispatch({ type: "SET_ALL_COMPANIES_WITH_VERIFICATION_STATUS", payload: companies });
        } catch (error) {
            console.error("Error fetching companies:", error);

            dispatch({ type: "SET_LOADING_FALSE" });

            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    };

    const handleCompanyMakeVerified = async (id) => {
        try {
            const response = await axios.patch(`${server}/api/v1/superadmin/makeCompaniesVerified/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const { message } = response.data;
            toast.dismiss();
            toast.success(message);
            // getAllCompaniesWithVerificationStatus(); // Refresh list
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    };

    const handleCompanyMakeUnVerified = async (id) => {
        try {
            const response = await axios.patch(`${server}/api/v1/superadmin/makeCompaniesUnverified/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const { message } = response.data;
            toast.dismiss();
            toast.success(message);
            // getAllCompaniesWithVerificationStatus(); // Refresh list
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    };

    const getAllCandidatesWithVerificationStatus = async () => {
        dispatch({ type: "SET_LOADING" });

        try {
            const response = await axios.get(`${server}/api/v1/superadmin/get-all-candidates-with-verification-status`,
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { candidates } = response.data;

            dispatch({ type: "SET_ALL_CANDIDATES_WITH_VERIFICATION_STATUS", payload: candidates });
        } catch (error) {
            console.error("Error fetching companies:", error);

            dispatch({ type: "SET_LOADING_FALSE" });

            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    };

    const handleCandidateMakeVerified = async (id) => {
        try {
            const response = await axios.patch(`${server}/api/v1/superadmin/makeCandidateVerified/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const { message } = response.data;
            toast.dismiss();
            toast.success(message);
            // getAllCandidatesWithVerificationStatus(); // Refresh list
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    };

    const handleCandidateMakeUnVerified = async (id) => {
        try {
            const response = await axios.patch(`${server}/api/v1/superadmin/makeCandidateUnverified/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const { message } = response.data;
            toast.dismiss();
            toast.success(message);
            // getAllCandidatesWithVerificationStatus(); // Refresh list
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    };

    const getAllInterviews = async () => {
        dispatch({ type: "SET_LOADING" });
        try {
            const response = await axios.get(`${server}/api/v1/superadmin/get-all-interviews-of-all-candidates`,
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { interviewes } = response.data;

            dispatch({ type: "SET_ALL_INTERVIEWS_OF_ALL_CANDIDATES", payload: interviewes });
        } catch (error) {
            console.error("Error fetching companies:", error);
            dispatch({ type: "SET_LOADING_FALSE" });
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    }

    const getAllInterviewsByCV = async () => {
        dispatch({ type: "SET_LOADING" });
        try {
            const response = await axios.get(`${server}/api/v1/superadmin/get-all-interviews-of-all-candidates-by-cv`,
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { interviewes } = response.data;

            dispatch({ type: "SET_ALL_INTERVIEWS_OF_ALL_CANDIDATES_BY_CV", payload: interviewes });
        } catch (error) {
            console.error("Error fetching companies:", error);
            dispatch({ type: "SET_LOADING_FALSE" });
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    }

    const handleSendEmail = async (interviewId, emailData) => {
        dispatch({ type: "SET_LOADING" });
        try {
            const res = await axios.post(`${server}/api/v1/superadmin/candidateandinterviewer/${interviewId}/send-invite`,
                emailData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { message } = res.data
            toast.dismiss();
            toast.success(message);
            dispatch({ type: "SET_LOADING_FALSE" });
        } catch (error) {
            console.error("Error fetching companies:", error);
            dispatch({ type: "SET_LOADING_FALSE" });
            const errorMessage = error.response?.data?.message || "Failed to send interview link";
            toast.dismiss();
            toast.error(errorMessage);
        }
    };

    const handleSendEmailForCV = async (interviewId, emailData) => {
        dispatch({ type: "SET_LOADING" });
        try {
            const res = await axios.post(`${server}/api/v1/superadmin/candidateandinterviewer/${interviewId}/send-invite/for-cv`,
                emailData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { message } = res.data
            toast.dismiss();
            toast.success(message);
            dispatch({ type: "SET_LOADING_FALSE" });
        } catch (error) {
            console.error("Error fetching companies:", error);
            dispatch({ type: "SET_LOADING_FALSE" });
            const errorMessage = error.response?.data?.message || "Failed to send interview link";
            toast.dismiss();
            toast.error(errorMessage);
        }
    };

    const markAsCancelled = async (interviewId) => {
        dispatch({ type: "SET_LOADING" });
        try {
            const response = await axios.post(`${server}/api/v1/superadmin/markAsCancelled/${interviewId}`,
                {},
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                });

            const { message } = response.data;
            toast.dismiss()
            toast.success(message)
            getAllInterviews()
            dispatch({ type: "SET_LOADING_FALSE" });
        } catch (error) {
            console.error("Error fetching companies:", error);

            dispatch({ type: "SET_LOADING_FALSE" });

            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.dismiss();
            toast.error(errorMessage);
        }
    }

    const markAsCancelledForCV = async (jobId, cvId, formDataId) => {
        console.log(jobId, cvId, formDataId);
        
        try {
            const res = await axios.put(`${server}/api/v1/superadmin/cancelCVInterview/${jobId}/${cvId}/${formDataId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(res.data.message);
        } catch (err) {
            // console.error(err);
            toast.error(err.response?.data?.message || err.message);
        }
    };

    const getAllShortlistedCandidatesOfAllJobs = async () => {
        try {
            dispatch({ type: "SET_LOADING" });
            const response = await axios.get(`${server}/api/v1/superadmin/getAllShortlistedCandidates`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            const { shortlisted } = response.data;
            dispatch({ type: "SET_ALL_SHORTLISTED_CANDIDATES_OF_ALL_JOBS", payload: shortlisted });
        } catch (err) {
            dispatch({ type: "SET_LOADING_FALSE" });
            toast.error(err.response?.data?.message || 'Failed to fetch candidates');
        }
    };

    const getReportOfInterview = async (id) => {
        dispatch({ type: "SET_LOADING" });
        try {
            const response = await axios.get(`${server}/api/v1/interviews/getReport/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const { report } = response.data;
            dispatch({ type: "SET_REPORT_OF_CANDIDATE", payload: report });
        } catch (error) {
            dispatch({ type: "SET_LOADING_FALSE" });
            toast.dismiss()
            toast.error(err.response?.data?.message || 'Failed to fetch candidates');
        }
    };


    return (
        <SuperAdmminContext.Provider value={{
            ...state,
            getAllCompaniesWithJobs,
            getAllJobOfSingleCompany,
            getDetailsOfSingleJob,
            handleChangeStatus,
            handleMarkAsFlag,
            handleMarkAsUnFlag,
            handleConfirmDeleteJob,
            handleApplicants,
            getApplicantsProfile,
            getAllInterviewers,
            getAllCompaniesWithVerificationStatus,
            handleCompanyMakeVerified,
            handleCompanyMakeUnVerified,
            getAllCandidatesWithVerificationStatus,
            handleCandidateMakeVerified,
            handleCandidateMakeUnVerified,
            getAllInterviews,
            getAllInterviewsByCV,
            handleSendEmail,
            handleSendEmailForCV,
            markAsCancelled,
            markAsCancelledForCV,
            getAllShortlistedCandidatesOfAllJobs,
            getReportOfInterview
        }}>
            {children}
        </SuperAdmminContext.Provider>
    )
}

const useSuperAdminContext = () => {
    const SuperAdmminContextValue = useContext(SuperAdmminContext)

    if (!SuperAdmminContextValue) {
        throw new Error("useSuperAdminContext used outside of the Provider")
    }

    return SuperAdmminContextValue
}

export { SuperAdmminContext, SuperAdminProvider, useSuperAdminContext }