import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Sidebar from "./Sidebar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/auth-context";
import axios from "axios";

export default function Chat() {
    const [activeUser, setActiveUser] = useState(null);
    const [chat, setChat] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [unread, setUnread] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const { user, server, token } = useAuthContext();

    // refs to avoid stale closures inside socket handlers
    const socketRef = useRef(null);
    const activeUserRef = useRef(activeUser);
    const userRef = useRef(user);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    useEffect(() => { activeUserRef.current = activeUser; }, [activeUser]);
    useEffect(() => { userRef.current = user; }, [user]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Single socket connection lifecycle
    useEffect(() => {
        if (!user || !user._id || !token) return;

        // Create socket once and keep in ref
        const socket = io(server, {
            auth: { token, type: "chat" },
            transports: ["websocket"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        // On connect, server's socketAuth middleware will have set socket.user
        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
        });

        // server broadcasts online_users
        socket.on("online_users", (users) => {
            // Expect array of userIds (strings)
            setOnlineUsers(Array.isArray(users) ? users : []);
        });

        // receive message
        socket.on("receive_message", (message) => {
            try {

                const myId = userRef.current?.userId;
                const active = activeUserRef.current;

                const isForActive =
                    active &&
                    ((message.senderId === active._id && message.receiverId === myId) ||
                        (message.receiverId === active._id && message.senderId === myId));

                if (isForActive) {
                    setChat((prev) => [...prev, message]);
                } else if (message.receiverId === myId) {
                    // Incoming to me but not active conversation
                    // toast.success(`New message from ${message.senderName || "someone"}`);
                    setUnread((u) => ({ ...u, [message.senderId]: (u[message.senderId] || 0) + 1 }));
                }
            } catch (e) {
                console.error("Error handling receive_message:", e);
            }
        });

        socket.on("typing", ({ from }) => {
            const active = activeUserRef.current;
            if (active && from === active._id) setIsTyping(true);
        });

        socket.on("stop_typing", ({ from }) => {
            const active = activeUserRef.current;
            if (active && from === active._id) setIsTyping(false);
        });

        socket.on("disconnect", (reason) => {
            console.log("🔌 Socket disconnected:", reason);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id, token, server]);

    // fetch messages when selecting user
    const fetchMessages = async (partnerId) => {
        try {
            const { data } = await axios.get(`${server}/api/v1/chat/${user.userId}/${partnerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChat(data || []);
            // clear unread for this partner
            setUnread((u) => ({ ...u, [partnerId]: 0 }));
        } catch (err) {
            console.error(err);
            toast.error("Failed to load messages");
        }
    };

    const handleSelectUser = (partner) => {
        setActiveUser(partner);
        fetchMessages(partner._id);
        // Close sidebar on mobile after selecting a user
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    // send message: save first then emit saved object
    const handleSend = async (text) => {
        if (!activeUser) {
            toast.error("Select user first");
            return;
        }
        try {
            const { data: saved } = await axios.post(`${server}/api/v1/chat/send`,
                {
                    senderId: user.userId,
                    receiverId: activeUser._id,
                    text,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // emit message (server will forward to receiver)
            socketRef.current?.emit("send_message", saved);

            // append locally
            setChat((prev) => [...prev, saved]);

            // stop typing on send
            socketRef.current?.emit("stop_typing", { from: user._id, to: activeUser._id });
        } catch (err) {
            console.error("Send failed:", err);
            toast.error("Send failed");
        }
    };

    const handleTyping = () => {
        if (!activeUser) return;
        socketRef.current?.emit("typing", { from: user.userId, to: activeUser._id });
    };

    const handleStopTyping = () => {
        if (!activeUser) return;
        socketRef.current?.emit("stop_typing", { from: user.userId, to: activeUser._id });
    };

    // theme
    const theme = {
        background: darkMode ? "#111b21" : "#ece5dd",
        textColor: darkMode ? "#e9edef" : "#111",
    };

    return (
        <>
            <div className="container-fluid">
                <div className="container">
                    <div className="row g-0">
                        <div className="col-12">
                            <div style={{ display: "flex", height: isMobile ? "80vh" : "90vh", background: theme.background, color: theme.textColor, position: "relative" }}>
                                {/* Mobile sidebar overlay */}
                                {isMobile && sidebarOpen && (
                                    <div
                                        style={{
                                            position: "fixed",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: "rgba(0,0,0,0.5)",
                                            zIndex: 1000,
                                        }}
                                        onClick={() => setSidebarOpen(false)}
                                    />
                                )}

                                {/* Sidebar */}
                                <div
                                    style={{
                                        position: isMobile ? "fixed" : "relative",
                                        left: isMobile ? (sidebarOpen ? 0 : "-100%") : 0,
                                        top: 0,
                                        height: isMobile ? "100vh" : "90vh",
                                        width: isMobile ? "80%" : "350px",
                                        maxWidth: isMobile ? "320px" : "none",
                                        zIndex: isMobile ? 1001 : 1,
                                        transition: "left 0.3s ease",
                                        boxShadow: isMobile ? "2px 0 5px rgba(0,0,0,0.2)" : "none",
                                    }}
                                >
                                    <Sidebar
                                        currentUser={user}
                                        onSelectUser={handleSelectUser}
                                        activeUser={activeUser}
                                        onlineUsers={onlineUsers}
                                        darkMode={darkMode}
                                        unread={unread}
                                        isMobile={isMobile}
                                        onCloseSidebar={() => setSidebarOpen(false)}
                                    />
                                </div>

                                {/* Main chat area */}
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
                                    {activeUser ? (
                                        <>
                                            {/* Header */}
                                            <div
                                                style={{
                                                    height: isMobile ? 60 : 68,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    padding: isMobile ? "0 12px" : "0 16px",
                                                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                                                    background: darkMode ? "#202c33" : "#ededed",
                                                }}
                                            >
                                                <div style={{ display: "flex", gap: isMobile ? 8 : 12, alignItems: "center" }}>
                                                    {isMobile && (
                                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setSidebarOpen(true)} style={{ padding: "4px 8px" }}>
                                                            <i className="bi bi-list"></i>
                                                        </button>
                                                    )}
                                                    <img
                                                        src={
                                                            activeUser.profile.profilePicture
                                                                ? activeUser.profile.profilePicture
                                                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(activeUser.profile.fullname)}`
                                                        }
                                                        alt="" width={isMobile ? 40 : 48} height={isMobile ? 40 : 48} style={{ borderRadius: "50%" }} />
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: isMobile ? "16px" : "18px" }}>{activeUser.profile.fullname}</div>
                                                        <div style={{ fontSize: isMobile ? 11 : 13, color: "#8b8b8b" }}>
                                                            {isTyping ? <span style={{ color: "#25d366" }}>typing...</span> : (onlineUsers.includes(activeUser._id) ? "online" : "offline")}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: "flex", gap: isMobile ? 4 : 8 }}>
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setDarkMode((d) => !d)} style={{ padding: isMobile ? "4px 8px" : "5px 10px" }}>
                                                        {darkMode ? "☀️" : "🌙"}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* messages */}
                                            <div style={{ padding: isMobile ? 8 : 12, flex: 1, overflow: "hidden" }}>
                                                <MessageList chat={chat} currentUser={user} darkMode={darkMode} isMobile={isMobile} />
                                            </div>

                                            {/* input */}
                                            <div style={{ padding: isMobile ? 8 : 12, borderTop: "1px solid rgba(0,0,0,0.06)", background: darkMode ? "#202c33" : "#f5f5f5" }}>
                                                <MessageInput onSend={handleSend} onTyping={handleTyping} onStopTyping={handleStopTyping} isMobile={isMobile} />
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#777", flexDirection: "column", gap: "20px" }}>
                                            <div style={{ fontSize: isMobile ? "18px" : "20px" }}>Select a user to start chatting</div>
                                            {isMobile && (
                                                <button className="btn btn-primary" onClick={() => setSidebarOpen(true)}>
                                                    Open Contacts
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
