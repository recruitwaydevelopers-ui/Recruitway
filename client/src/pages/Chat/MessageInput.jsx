import { useEffect, useRef, useState } from "react";

export default function MessageInput({ onSend, onTyping, onStopTyping, isMobile = false }) {
    const [text, setText] = useState("");
    const stopTypingTimer = useRef(null);

    const scheduleStopTyping = () => {
        clearTimeout(stopTypingTimer.current);
        stopTypingTimer.current = setTimeout(() => { onStopTyping?.(); }, 900);
    };

    const handleChange = (e) => {
        setText(e.target.value);
        onTyping?.();
        scheduleStopTyping();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        } else {
            onTyping?.();
            scheduleStopTyping();
        }
    };

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setText("");
        onStopTyping?.();
        clearTimeout(stopTypingTimer.current);
    };

    useEffect(() => { return () => clearTimeout(stopTypingTimer.current); }, []);

    return (
        <div style={{
            display: "flex",
            gap: isMobile ? 6 : 8,
            alignItems: "flex-end",
            position: "sticky",
            bottom: 0
        }}>
            <textarea
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message"
                rows={isMobile ? 1 : 1}
                style={{
                    resize: "none",
                    flex: 1,
                    borderRadius: isMobile ? 18 : 20,
                    padding: isMobile ? "8px 12px" : "10px 12px",
                    fontSize: isMobile ? "11px" : "12px",
                    maxHeight: "120px"
                }}
            />
            <button
                className={`btn ${isMobile ? "btn-sm" : ""} btn-success`}
                onClick={handleSend}
                style={{
                    borderRadius: "50%",
                    width: isMobile ? "36px" : "40px",
                    height: isMobile ? "36px" : "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0
                }}
                disabled={!text}
            >
                <i className="bi bi-send-fill"></i>
            </button>
        </div>
    );
}