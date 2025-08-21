const ChatMessage = require('../models/ChatMessage');
const { getUserById } = require('../utils/getUserById');

// Store online users
const onlineUsers = new Set();

// Store state for each room for Interview
const roomStates = {};


const socketHandlers = async (socket, io) => {
    console.log(`User connected: ${socket.userId}`);

    // Add user to online set
    onlineUsers.add(socket.userId);
    io.emit('userStatus', { userId: socket.userId, isOnline: true });

    // Join user to their room
    socket.on("join", ({ userId }) => {
        socket.join(userId);
        socket.userId = userId;
        console.log(`User ${userId} joined room ${userId}`);
    });

    // Handle sendMessage
    socket.on("sendMessage", async ({ text, receiverId, senderId, fileUrl }) => {
        try {
            if ((!text && !fileUrl) || !receiverId || !senderId) {
                return console.warn('Invalid message payload');
            }

            const sender = await getUserById(senderId);
            const receiver = await getUserById(receiverId);

            if (!sender || !receiver) {
                console.warn('Sender or receiver not found');
                return;
            }

            // Disallow company -> company and superadmin -> superadmin
            if (sender.role === "company" && receiver.role === "company") {
                console.log(`Blocked: ${sender.name} (company) tried to message another company`);
                return;
            }

            if (sender.role === "superadmin" && receiver.role === "superadmin") {
                console.log(`Blocked: ${sender.name} (superadmin) tried to message another superadmin`);
                return;
            }

            const roomId = [receiverId, senderId].sort().join("-");

            const message = new ChatMessage({
                roomId,
                sender: senderId,
                receiver: receiverId,
                text,
                fileUrl,
                status: 'delivered',
                reactions: [],
            });

            await message.save();

            const populatedMessage = await ChatMessage.findById(message._id)
                .populate('sender', 'fullname role')
                .populate('receiver', 'fullname role');

            io.to(roomId).emit('newMessage', populatedMessage);
        } catch (error) {
            console.error('Error handling sendMessage:', error);
        }
    });

    // Handle message edit
    socket.on("editMessage", async ({ messageId, newText }) => {
        try {
            const message = await ChatMessage.findById(messageId);
            if (!message || message.sender.toString() !== socket.userId) return;

            message.text = newText;
            message.edited = true;
            await message.save();

            const populatedMessage = await ChatMessage.findById(message._id)
                .populate('sender', 'fullname role')
                .populate('receiver', 'fullname role');

            io.to(message.roomId).emit('messageEdited', populatedMessage);
        } catch (error) {
            console.error('Error handling editMessage:', error);
        }
    });

    // Handle message reaction
    socket.on("addReaction", async ({ messageId, emoji, senderId }) => {
        try {
            const message = await ChatMessage.findById(messageId);
            if (!message) return;

            message.reactions.push({ emoji, senderId });
            await message.save();

            const populatedMessage = await ChatMessage.findById(message._id)
                .populate('sender', 'fullname role')
                .populate('receiver', 'fullname role');

            io.to(message.roomId).emit('messageReacted', populatedMessage);
        } catch (error) {
            console.error('Error handling addReaction:', error);
        }
    });

    // Typing indicator
    socket.on('typing', ({ receiverId, isTyping }) => {
        if (receiverId) {
            socket.to(receiverId).emit('typing', { senderId: socket.userId, isTyping });
        }
    });

    // Mark messages as read
    socket.on('markAsRead', async ({ messageIds, senderId }) => {
        try {
            if (!Array.isArray(messageIds) || !senderId) return;

            await ChatMessage.updateMany(
                { _id: { $in: messageIds }, receiver: socket.userId },
                { $set: { status: 'read' } }
            );

            socket.to(senderId).emit('messagesRead', { messageIds });
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    });


    socket.on('join-room', ({ name, roomId, userId }) => {
        try {
            socket.join(roomId);
            console.log(`${name} (${userId}) joined room: ${roomId}`);

            if (!roomStates[roomId]) {
                roomStates[roomId] = {
                    code: '',
                    task: '',
                    language: 'javascript',
                    theme: 'dark',
                    fontSize: 16,
                    participants: new Set()
                };
            }

            // Track participants
            roomStates[roomId].participants.add(userId);

            // Send full state to the new user
            socket.emit('init-state', {
                code: roomStates[roomId].code,
                task: roomStates[roomId].task,
                language: roomStates[roomId].language,
                theme: roomStates[roomId].theme,
                fontSize: roomStates[roomId].fontSize
            });

            // Notify others about new participant
            socket.to(roomId).emit('participant-joined', { userId, name });
        } catch (error) {
            console.error('Error in join-room:', error);
        }
    });

    const handleRoomUpdate = (roomId, updateFn, eventName) => {
        try {
            if (roomStates[roomId]) {
                updateFn(roomStates[roomId]);
                socket.to(roomId).emit(eventName, roomStates[roomId][eventName.split('-')[0]]);
            }
        } catch (error) {
            console.error(`Error in ${eventName}:`, error);
        }
    };

    socket.on('code-change', ({ roomId, code }) => {
        handleRoomUpdate(roomId, (state) => { state.code = code; }, 'code-update');
    });

    socket.on('task-change', ({ roomId, task }) => {
        handleRoomUpdate(roomId, (state) => { state.task = task; }, 'task-update');
    });

    socket.on('language-change', ({ roomId, language }) => {
        handleRoomUpdate(roomId, (state) => { state.language = language; }, 'language-update');
    });

    socket.on('theme-change', ({ roomId, theme }) => {
        handleRoomUpdate(roomId, (state) => { state.theme = theme; }, 'theme-update');
    });

    socket.on('fontSize-change', ({ roomId, fontSize }) => {
        handleRoomUpdate(roomId, (state) => { state.fontSize = fontSize; }, 'fontSize-update');
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
        onlineUsers.delete(socket.userId);
        io.emit('userStatus', { userId: socket.userId, isOnline: false });

        // Clean up room participation
        Object.entries(roomStates).forEach(([roomId, state]) => {
            if (state.participants.has(socket.userId)) {
                state.participants.delete(socket.userId);
                if (state.participants.size === 0) {
                    // Clean up empty rooms after delay
                    setTimeout(() => {
                        if (roomStates[roomId]?.participants.size === 0) {
                            delete roomStates[roomId];
                        }
                    }, 300000); // 5 minutes
                }
            }
        });
    });
};

module.exports = socketHandlers;
