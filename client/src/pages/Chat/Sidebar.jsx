import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/auth-context";

export default function Sidebar({ currentUser, onSelectUser, activeUser, onlineUsers = [], darkMode = false, unread = {}, isMobile = false, onCloseSidebar }) {
    const [q, setQ] = useState("");
    const { getAllUsers, allUsers } = useAuthContext();

    useEffect(() => {
        if (!currentUser) return;
        getAllUsers(currentUser.role);
    }, [currentUser]);

    const filtered = allUsers?.filter(u => u?.profile?.fullname?.toLowerCase().includes(q?.toLowerCase()) || u?.email?.toLowerCase().includes(q.toLowerCase()));

    return (
        <div style={{
            width: "100%",
            height: "100%",
            borderRight: isMobile ? "none" : "1px solid rgba(0,0,0,0.06)",
            backgroundColor: darkMode ? "#111b21" : "#f7f7f7",
            color: darkMode ? "#e9edef" : "#111",
            display: "flex",
            flexDirection: "column",
        }}>
            {/* Header with close button for mobile */}
            <div style={{
                padding: isMobile ? "12px" : "14px",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                gap: 12,
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <img
                        src={
                            currentUser.profilePicture
                                ? currentUser.profilePicture
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullname)}`
                        }
                        alt="me"
                        width={isMobile ? 40 : 44}
                        height={isMobile ? 40 : 44}
                        style={{ borderRadius: "50%" }}
                    />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: isMobile ? "16px" : "18px" }}>{currentUser.fullname}</div>
                        <div style={{ fontSize: isMobile ? 11 : 12, color: "#888" }}>{currentUser.email}</div>
                    </div>
                </div>
                {isMobile && (
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={onCloseSidebar}
                        style={{ padding: "4px 8px" }}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                )}
            </div>

            <div style={{ padding: isMobile ? 10 : 12 }}>
                <input
                    className="form-control"
                    placeholder="Search or start new chat"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    style={{
                        borderRadius: 20,
                        fontSize: isMobile ? "11px" : "12px",
                    }}
                />
            </div>

            <div style={{ overflowY: "auto", flex: 1 }}>

                {filtered.length > 0 ? (
                    filtered.map((u) => (
                        <div
                            key={u._id}
                            onClick={() => onSelectUser(u)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: isMobile ? 10 : 14,
                                padding: isMobile ? "8px 12px" : "10px 16px",
                                borderRadius: 8,
                                cursor: "pointer",
                                background:
                                    activeUser && activeUser._id === u._id
                                        ? darkMode
                                            ? "#2a3942"
                                            : "#e9f7ef"
                                        : "transparent",
                                transition: "background-color 0.2s, transform 0.1s",
                                userSelect: "none",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#2a3942" : "#f0f0f0")}
                            onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                activeUser && activeUser._id === u._id
                                    ? darkMode
                                        ? "#2a3942"
                                        : "#e9f7ef"
                                    : "transparent")
                            }
                        >
                            {/* --- Profile Image + Online Dot --- */}
                            <div style={{ position: "relative" }}>
                                <img
                                    src={
                                        u.profile?.profilePicture
                                            ? u.profile.profilePicture
                                            : `https://ui-avatars.com/api/?background=25D366&color=fff&name=${encodeURIComponent(
                                                u.profile?.fullname || u.name || "User"
                                            )}`
                                    }
                                    alt={u.profile?.fullname || u.name}
                                    width={isMobile ? 42 : 48}
                                    height={isMobile ? 42 : 48}
                                    style={{
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "2px solid #ccc",
                                    }}
                                />
                                {onlineUsers.includes(u._id) && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            bottom: 2,
                                            right: 3,
                                            width: isMobile ? 10 : 12,
                                            height: isMobile ? 10 : 12,
                                            borderRadius: "50%",
                                            background: "#25D366",
                                            border: "2px solid white",
                                        }}
                                    />
                                )}
                            </div>

                            {/* --- User Info --- */}
                            <div
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                {/* Top Row: Name + Unread Count */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight: 600,
                                            fontSize: isMobile ? "13px" : "14px",
                                            color: darkMode ? "#fff" : "#222",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: "75%",
                                        }}
                                    >
                                        {u.profile?.fullname || "Unknown User"}
                                    </div>

                                    {unread[u._id] > 0 && (
                                        <div
                                            style={{
                                                background: "#25D366",
                                                color: "#fff",
                                                padding: "2px 8px",
                                                borderRadius: 12,
                                                fontSize: isMobile ? 10 : 12,
                                                minWidth: 22,
                                                textAlign: "center",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {unread[u._id]}
                                        </div>
                                    )}
                                </div>

                                {/* Email (Secondary Info) */}
                                <div
                                    style={{
                                        fontSize: isMobile ? 12 : 11,
                                        color: darkMode ? "#aaa" : "#555",
                                        marginTop: 2,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {u.email || "No email available"}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div
                        style={{
                            textAlign: "center",
                            color: darkMode ? "#bbb" : "#888",
                            padding: "20px 0",
                        }}
                    >
                        No matches found
                    </div>
                )}

            </div>
        </div>
    );
}



