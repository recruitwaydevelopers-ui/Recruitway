import { createContext, useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import authReducer from "../reducer/auth-reducer";
import { io } from "socket.io-client";
const server = import.meta.env.VITE_SERVER;
import { useNavigate } from "react-router-dom";

const AuthContext = createContext()

const initialState = {
    loading: false,
    isAuthenticated: false,
    token: null,
    user: null,
    superAdmin: null,
    error: null,
    allUsers: [],
}

const AuthProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, initialState)

    const [socket, setSocket] = useState(null);
    const navigate = useNavigate()

    const fetchUserData = async (token) => {
        dispatch({ type: "AUTH_LOADING" })
        try {
            const response = await axios.get(`${server}/api/v1/auth/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { data } = response.data;
            dispatch({ type: "LOAD_USER_DATA", payload: { data } });
            const socket = io(server, {
                auth: { token },
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });
            setSocket(socket);
        } catch (error) {
            console.log("Failed to fetch user data", error);
            logout();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            dispatch({ type: "LOAD_TOKEN", payload: { token } });
            fetchUserData(token);
        }
    }, []);

    useEffect(() => {
        if (state?.user?.userId) {
            socket.emit("register", state.user.userId);
        }
    }, [state?.user?.userId]);

    const register = async (userdetails) => {
        dispatch({ type: "AUTH_LOADING" })
        try {
            const { data } = await axios.post(`${server}/api/v1/auth/register`,
                userdetails,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

            const { message, path } = data
            toast.dismiss()
            toast.success(message)
            dispatch({ type: "SET_LOADING_FALSE" })
            return path

        } catch (error) {
            dispatch({
                type: "REGISTER_ERROR",
                payload: error.response?.data?.message || "Registration Failed",
            })
            toast.dismiss()
            toast.error(error.response?.data?.message)
        }
    }

    const login = async (userdetails) => {
        dispatch({ type: "AUTH_LOADING" })
        try {
            const { data } = await axios.post(`${server}/api/v1/auth/login`,
                userdetails,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

            const { token, message, success, path } = data

            dispatch({ type: "LOGIN", payload: { token } })
            localStorage.setItem("token", token)
            fetchUserData(token);
            toast.dismiss()
            toast.success(message)

            return { success, path }
        } catch (error) {
            dispatch({
                type: "LOGIN_ERROR",
                payload: error.response?.data?.message || "Login Failed",
            })
            console.log(error);

            toast.dismiss()
            toast.error(error.response?.data?.message)
            return error.response?.data?.success
        }
    }

    const handleLinkedinCallback = async (url) => {
        const params = new URLSearchParams(url);
        const code = params.get("code");
        const role = params.get("state");

        if (!code) {
            toast.error("Missing LinkedIn authorization code");
            navigate("/register");
            return;
        }
        dispatch({ type: "AUTH_LOADING" })

        try {
            const { data } = await axios.get(`${server}/api/v1/auth/linkedin/callback`, {
                params: { code, state: role },
            });

            const { token, user } = data

            dispatch({ type: "LOGIN", payload: { token } })
            localStorage.setItem("token", token)
            fetchUserData(token);

            if (token) {
                if (user.role === "user") {
                    navigate("/user/dashboard");
                } else if (user.role === "company") {
                    navigate("/company/dashboard");
                } else if (user.role === "interviewer") {
                    navigate("/interviewer/dashboard");
                } else if (user.role === "superadmin") {
                    navigate("/superadmin/dashboard");
                } else {
                    navigate("/register");
                }
            } else {
                toast.error("LinkedIn authentication failed");
                navigate("/register");
                // navigate("/login");
            }
        } catch (err) {
            toast.error("Error during LinkedIn login");
            console.error("Auth error:", err.response?.data || err.message);
            navigate("/register");
            navigate("/login");
        } finally {
            dispatch({ type: "SET_LOADING_FALSE" })
        }
    };

    const handleGoogleCallback = async (url) => {
        const params = new URLSearchParams(url);
        const code = params.get("code");
        const role = params.get("state"); // 👈 state contains role

        if (!code) {
            toast.error("Missing Google authorization code");
            navigate("/register");
            return;
        }
        dispatch({ type: "AUTH_LOADING" })
        try {
            const { data } = await axios.get(`${server}/api/v1/auth/google/callback?code=${code}&state=${role}`);

            const { token, user } = data

            dispatch({ type: "LOGIN", payload: { token } })
            localStorage.setItem("token", token)
            fetchUserData(token);

            if (token) {
                if (user.role === "user") {
                    navigate("/user/dashboard");
                } else if (user.role === "company") {
                    navigate("/company/dashboard");
                } else if (user.role === "interviewer") {
                    navigate("/interviewer/dashboard");
                } else if (user.role === "superadmin") {
                    navigate("/superadmin/dashboard");
                } else {
                    navigate("/register");
                }
            } else {
                toast.error("LinkedIn authentication failed");
                navigate("/register");
                // navigate("/login");
            }
        } catch (err) {
            toast.error("Error during LinkedIn login");
            console.error("Auth error:", err.response?.data || err.message);
            navigate("/register");
            navigate("/login");
        } finally {
            dispatch({ type: "SET_LOADING_FALSE" })
        }
    }

    const logout = async () => {
        localStorage.removeItem("token")
        dispatch({ type: "LOGOUT", payload: "Logout Successfully" })
        toast.dismiss()
        toast.success("Logout Successfully")
        navigate("/")
    }

    const getSuperAdmin = async (token) => {
        try {
            const response = await axios.get(`${server}/api/v1/company/superAdmin`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { data } = response.data;
            dispatch({ type: "LOAD_SUPER_ADMIN", payload: { data } });
        } catch (error) {
            console.log("Failed to fetch user data", error?.message);
        }
    }

    const getAllUsers = async (role) => {
        dispatch({ type: "AUTH_LOADING" });

        try {
            const response = await axios.get(`${server}/api/v1/auth/allusers?role=${role}`,
                {
                    headers: {
                        Authorization: `Bearer ${state.token}`,
                    },
                }
            );

            const { data } = response.data;

            dispatch({ type: "LOAD_ALL_USERS", payload: data });
        } catch (error) {
            console.error("Failed to fetch user data:", error?.response?.data || error.message);
        } finally {
            dispatch({ type: "SET_LOADING_FALSE" });
        }
    };

    const updateUser = async (newUserData) => {
        try {
            const { data } = await axios.patch(`${server}/api/v1/auth/update`,
                newUserData,
                {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                }
            );
            const { message } = data;
            fetchUserData(state.token);
            toast.dismiss()
            toast.success(message)
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const createNotification = async (receiverId, type, message) => {
        try {
            const response = await axios.post(`${server}/api/v1/notifications`,
                {
                    senderId: state.user.userId,
                    receiverId,
                    message,
                    type,
                },
                {
                    headers: {
                        Authorization: `Bearer ${state.token}`,
                    },
                }
            );

            // Optional: also emit locally (if you want immediate feedback)
            socket.emit("newNotification", response.data.notification);
        } catch (error) {
            console.error("Error creating notification:", error);
        }
    };

    const getNotifications = async () => {
        try {
            await axios.get(`${server}/api/v1/notifications/${state.userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${state.token}`,
                    },
                }
            );
        } catch (error) {

        }
    }

    return (
        <AuthContext.Provider value={{
            loading: state.loading,
            isAuthenticated: state.isAuthenticated,
            token: state.token,
            user: state.user,
            error: state.error,
            path: state.path,
            fetchUserData,
            register,
            login,
            handleLinkedinCallback,
            handleGoogleCallback,
            logout,
            server,
            socket,
            addressLoading: state.addressLoading,
            address: state.address,
            singleAddress: state.singleAddress,
            updateUser,
            superAdmin: state.superAdmin,
            getSuperAdmin,
            getAllUsers,
            allUsers: state.allUsers,
            dispatch,
            createNotification,
            getNotifications
        }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuthContext = () => {
    const AuthContextValue = useContext(AuthContext)

    if (!AuthContextValue) {
        throw new Error("useAuthContext used outside of the Provider")
    }

    return AuthContextValue
}

export { AuthContext, AuthProvider, useAuthContext }