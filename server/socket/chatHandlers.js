const onlineUsers = new Map();

const chatHandlers = (socket, io) => {

    if (socket.user && socket.user._id) {
        const uid = String(socket.user._id);
        onlineUsers.set(uid, socket.id);
        io.emit("online_users", Array.from(onlineUsers.keys()));
    }

    socket.on("user_connected", (userId) => {
        try {
            if (!userId) return;
            onlineUsers.set(String(userId), socket.id);
            io.emit("online_users", Array.from(onlineUsers.keys()));
            console.log("📥 user_connected:", userId, "map size:", onlineUsers.size);
        } catch (e) {
            console.error("Error on user_connected:", e);
        }
    });

    socket.on("send_message", (message) => {
        try {
            if (!message || !message.receiverId) return;
            const receiverSocketId = onlineUsers.get(String(message.receiverId));
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive_message", message);
            }
            socket.emit("message_sent", message);
        } catch (e) {
            console.error("send_message error:", e);
        }
    });

    socket.on("typing", ({ from, to }) => {
        try {
            const recv = onlineUsers.get(String(to));
            if (recv) io.to(recv).emit("typing", { from });
        } catch (e) {
            console.error("typing error:", e);
        }
    });

    socket.on("stop_typing", ({ from, to }) => {
        try {
            const recv = onlineUsers.get(String(to));
            if (recv) io.to(recv).emit("stop_typing", { from });
        } catch (e) {
            console.error("stop_typing error:", e);
        }
    });

    socket.on("disconnect", (reason) => {
        let removedUser = null;
        try {
            for (const [userId, sId] of onlineUsers.entries()) {
                if (sId === socket.id) {
                    removedUser = userId;
                    onlineUsers.delete(userId);
                    break;
                }
            }
            io.emit("online_users", Array.from(onlineUsers.keys()));
            // console.log(`❌ Socket disconnected: ${socket.id}. Removed user: ${removedUser}. Reason: ${reason}`);
        } catch (e) {
            console.error("disconnect cleanup error:", e);
        }
    });
};

module.exports = { chatHandlers };

