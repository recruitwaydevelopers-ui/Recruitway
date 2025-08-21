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
            console.log("Failed to fetch user data", error?.message);
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
            logout,
            server,
            socket,
            addressLoading: state.addressLoading,
            address: state.address,
            singleAddress: state.singleAddress,
            updateUser,
            superAdmin: state.superAdmin,
            getSuperAdmin,
            dispatch
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