import { useEffect, useRef } from "react";

export default function MessageList({ chat = [], currentUser, darkMode = false, isMobile = false }) {
    const endRef = useRef(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

    return (
        <div style={{
            height: "100%",
            overflowY: "auto",
            padding: isMobile ? 4 : 8,
            scrollbarWidth: "none", // for Firefox
            msOverflowStyle: "none", // for IE and Edge
        }}>
            {chat.map(msg => {
                const mine = msg.senderId === currentUser.userId;
                return (
                    <div
                        key={msg._id || Math.random()}
                        style={{
                            display: "flex",
                            justifyContent: mine ? "flex-end" : "flex-start",
                            marginBottom: isMobile ? 8 : 10,
                            paddingLeft: isMobile ? 8 : 0,
                            paddingRight: isMobile ? 8 : 0
                        }}
                    >
                        <div style={{
                            maxWidth: isMobile ? "85%" : "72%",
                            padding: isMobile ? "6px 10px" : "8px 12px",
                            borderRadius: 12,
                            background: mine ? (darkMode ? "#005c4b" : "#dcf8c6") : (darkMode ? "#202c33" : "#fff"),
                            color: darkMode ? "#e9edef" : "#000",
                            border: darkMode ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(0,0,0,0.06)",
                            wordBreak: "break-word"
                        }}>
                            <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: isMobile ? "11px" : "12px" }}>
                                {msg.text}
                            </div>
                            <div style={{
                                fontSize: isMobile ? 8 : 8,
                                fontWeight:"bold",
                                marginTop: 4,
                                textAlign: "right",
                                color: darkMode ? "#bfc6c6" : "#666"
                            }}>
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={endRef} />
        </div>
    );
}