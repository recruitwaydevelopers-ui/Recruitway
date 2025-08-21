import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuthContext } from '../../../context/auth-context';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import toast from 'react-hot-toast';

const CompanyChatWithSuperAdmin = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [selectedSuperAdmin, setSelectedSuperAdmin] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [isOnline, setIsOnline] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedMessageText, setEditedMessageText] = useState('');

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);
    // const token = localStorage.getItem('token');
    const { server, getSuperAdmin, superAdmin, user: currentUser, token, socket } = useAuthContext();

    const addEmoji = useCallback((emojiData) => {
        if (editingMessageId) {
            setEditedMessageText((prev) => prev + emojiData.emoji);
        } else {
            setNewMessage((prev) => prev + emojiData.emoji);
        }
        setShowEmojiPicker(false);
    }, [editingMessageId]);

    const handleFileUpload = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Only images are allowed');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('File size exceeds 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${server}/api/v1/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            socketRef.current.emit('sendMessage', {
                text: '',
                fileUrl: response.data.fileUrl,
                receiverId: selectedSuperAdmin._id,
                senderId: currentUser.userId,
            });
            toast.success('Image sent successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to upload image');
        }
    }, [server, token, selectedSuperAdmin, currentUser]);

    useEffect(() => {
        if (token && currentUser?.role === 'company') {
            getSuperAdmin(token);
        }
    }, [token, currentUser, getSuperAdmin]);

    // Connect socket
    const socketRef = useRef(null);
    useEffect(() => {
        if (!token || !server) return;

        socketRef.current = socket;

        socket.on('connect', () => setConnectionStatus('connected'));
        socket.on('disconnect', () => setConnectionStatus('disconnected'));
        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setConnectionStatus('error');
            toast.error('Connection error, please try again');
        });

        socket.on('userStatus', ({ userId, isOnline }) => {
            if (userId === selectedSuperAdmin?._id) {
                setIsOnline(isOnline);
            }
        });

        socket.on('messageEdited', (updatedMessage) => {
            setMessages((prev) =>
                prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
            );
        });

        socket.on('messageReacted', (updatedMessage) => {
            setMessages((prev) =>
                prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
            );
        });

        return () => {
            socket.disconnect();
            clearTimeout(typingTimeoutRef.current);
        };
    }, [token, server, selectedSuperAdmin]);

    // Join room & listen
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket || !selectedSuperAdmin?._id || !currentUser?.userId) return;

        const roomId = [selectedSuperAdmin._id, currentUser.userId].sort().join('-');
        socket.emit('join', { userId: roomId });

        const handleNewMessage = (message) => {
            setMessages((prev = []) => [...prev, message]);
            if (message.sender._id !== currentUser.userId) {
                setUnreadCount((prev) => prev + 1);
                markAsRead([message._id]);
            }
        };

        const handleTypingEvent = ({ senderId, isTyping }) => {
            if (senderId === selectedSuperAdmin._id) {
                setIsTyping(isTyping);
            }
        };

        const handleMessagesRead = ({ messageIds }) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    messageIds.includes(msg._id) ? { ...msg, status: 'read' } : msg
                )
            );
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('typing', handleTypingEvent);
        socket.on('messagesRead', handleMessagesRead);

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('typing', handleTypingEvent);
            socket.off('messagesRead', handleMessagesRead);
        };
    }, [selectedSuperAdmin, currentUser]);

    // Update tab title
    useEffect(() => {
        document.title = unreadCount > 0 ? `(${unreadCount}) Chat with Admin` : 'Chat with Admin';
    }, [unreadCount]);

    // Reset unread count on window focus
    useEffect(() => {
        const handleFocus = () => setUnreadCount(0);
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const fetchChatHistory = useCallback(async () => {
        if (!selectedSuperAdmin?._id) return;
        try {
            const response = await axios.get(`${server}/api/v1/chat/${selectedSuperAdmin._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(response.data.data);
        } catch (error) {
            console.error('Error fetching chat history:', error);
            toast.error('Failed to fetch chat history');
        }
    }, [server, selectedSuperAdmin, token]);

    useEffect(() => {
        if (selectedSuperAdmin) fetchChatHistory();
    }, [selectedSuperAdmin, fetchChatHistory]);

    const markAsRead = useCallback(async (messageIds) => {
        if (!socketRef.current || !messageIds.length) return;
        try {
            await axios.post(
                `${server}/api/v1/chat/mark-as-read`,
                { messageIds },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            socketRef.current.emit('markAsRead', {
                messageIds,
                senderId: currentUser._id,
            });
        } catch (error) {
            console.error('Error marking messages as read:', error);
            toast.error('Error marking messages as read');
        }
    }, [server, currentUser, token]);

    const deleteMessage = useCallback(async (messageId) => {
        try {
            await axios.delete(`${server}/api/v1/chat/${messageId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
            toast.success('Message deleted');
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message');
        }
    }, [server, token]);

    const editMessage = useCallback(
        async (messageId) => {
            if (!editedMessageText.trim()) {
                toast.error('Message cannot be empty');
                return;
            }
            try {
                socketRef.current.emit('editMessage', {
                    messageId,
                    newText: editedMessageText,
                });
                setEditingMessageId(null);
                setEditedMessageText('');
                toast.success('Message edited');
            } catch (error) {
                console.error('Error editing message:', error);
                toast.error('Failed to edit message');
            }
        },
        [editedMessageText]
    );

    const addReaction = useCallback(
        (messageId, emoji) => {
            socketRef.current.emit('addReaction', {
                messageId,
                emoji,
                senderId: currentUser._id,
            });
        },
        [currentUser]
    );

    const handleSendMessage = useCallback(() => {
        if (!newMessage.trim() && !fileInputRef.current?.files?.length) return;

        socketRef.current.emit('sendMessage', {
            text: newMessage,
            receiverId: selectedSuperAdmin._id,
            senderId: currentUser.userId,
        });
        socketRef.current.emit('typing', {
            receiverId: selectedSuperAdmin._id,
            isTyping: false,
        });
        setNewMessage('');
        clearTimeout(typingTimeoutRef.current);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [newMessage, selectedSuperAdmin, currentUser]);

    const handleTyping = useCallback(
        (e) => {
            const val = e.target.value;
            setNewMessage(val);
            const socket = socketRef.current;
            if (!socket) return;

            clearTimeout(typingTimeoutRef.current);

            socket.emit('typing', {
                receiverId: selectedSuperAdmin._id,
                isTyping: val.length > 0,
            });

            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('typing', {
                    receiverId: selectedSuperAdmin._id,
                    isTyping: false,
                });
            }, 2000);
        },
        [selectedSuperAdmin]
    );

    const handleEditKeyPress = useCallback(
        (e, messageId) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                editMessage(messageId);
            }
        },
        [editMessage]
    );

    const handleKeyPress = useCallback(
        (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                showEmojiPicker &&
                !e.target.closest('.emoji-picker-react') &&
                !e.target.closest('.btn-light')
            ) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmojiPicker]);

    const filteredMessages = messages.filter((msg) =>
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!superAdmin) {
        return (
            <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="text-center p-4 bg-white shadow rounded">
                    <i className="ti ti-user-off text-danger fs-1 mb-3"></i>
                    <h5 className="text-dark">No Super Admin Available</h5>
                    <p className="text-muted">Please try again later.</p>
                </div>
            </div>
        );
    }

    if (!selectedSuperAdmin) {
        return (
            <div className="container-fluid position-relative" style={{ height: '100vh' }}>
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <label className="form-label">Select Super Admin</label>
                    <select
                        className="form-select"
                        onChange={(e) => {
                            const admin = superAdmin.find((a) => a._id === e.target.value);
                            setSelectedSuperAdmin(admin);
                        }}
                    >
                        <option value="">Select Super Admin</option>
                        {superAdmin.map((admin) => (
                            <option key={admin._id} value={admin._id}>
                                {admin.fullname}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div
                className="mx-auto p-4 border rounded shadow bg-white"
                style={{ maxWidth: '700px', height: '80vh', display: 'flex', flexDirection: 'column' }}
            >
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <h5 className="mb-0 text-primary">
                        💬 Chat with {selectedSuperAdmin.fullname}
                        {unreadCount > 0 && <span className="badge bg-danger ms-2">{unreadCount}</span>}
                    </h5>
                    <div className="d-flex align-items-center gap-2">
                        <span
                            className={`badge rounded-circle ${isOnline && connectionStatus === 'connected' ? 'bg-success' : 'bg-secondary'
                                }`}
                            style={{ width: '10px', height: '10px' }}
                        ></span>
                        <small
                            className={`text-${isOnline && connectionStatus === 'connected' ? 'success' : 'secondary'
                                }`}
                        >
                            {isTyping ? 'Typing...' : isOnline && connectionStatus === 'connected' ? 'Online' : 'Offline'}
                        </small>
                    </div>
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex-grow-1 overflow-auto px-2 mb-3">
                    {filteredMessages.length === 0 ? (
                        <div className="text-center text-muted py-5">
                            <i className="ti ti-message-circle fs-1 text-primary mb-2"></i>
                            <p className="mb-0">{searchQuery ? 'No messages found' : 'No messages yet. Say hello 👋'}</p>
                        </div>
                    ) : (
                        filteredMessages.map((message) => (
                            <div
                                key={message._id}
                                className={`d-flex mb-3 ${message.sender._id === currentUser._id ? 'justify-content-end' : 'justify-content-start'
                                    }`}
                            >
                                <div
                                    className={`p-3 rounded-3 shadow-sm ${message.sender._id === currentUser._id ? 'bg-primary text-white' : 'bg-light text-dark'
                                        }`}
                                    style={{ maxWidth: '75%', position: 'relative' }}
                                >
                                    {message.fileUrl && (
                                        <img
                                            src={message.fileUrl}
                                            alt="attachment"
                                            className="img-fluid rounded mb-2"
                                            style={{ maxWidth: '200px' }}
                                        />
                                    )}
                                    <p className="mb-2 text-break" style={{ whiteSpace: 'pre-wrap' }}>
                                        {message.text}
                                        {message.edited && <small className="text-muted ms-1">(edited)</small>}
                                    </p>
                                    {message?.reactions?.length > 0 && (
                                        <div className="d-flex gap-1 flex-wrap">
                                            {message.reactions.map((reaction, index) => (
                                                <span key={index} className="badge bg-secondary">
                                                    {reaction.emoji}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between align-items-center small">
                                        <span className="text-muted">
                                            {new Date(message.createdAt).toLocaleString([], {
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                            })}
                                        </span>
                                        {message.sender._id === currentUser._id && (
                                            <div className="d-flex gap-1">
                                                <i
                                                    className={`ti ${message.status === 'read' ? 'ti-checks' : 'ti-check'
                                                        } text-${message.sender._id === currentUser._id ? 'white' : 'muted'} ms-2`}
                                                ></i>
                                                <button
                                                    className="btn btn-sm btn-link p-0 text-white"
                                                    onClick={() => {
                                                        setEditingMessageId(message._id);
                                                        setEditedMessageText(message.text);
                                                    }}
                                                    title="Edit"
                                                >
                                                    <i className="ti ti-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-link p-0 text-white"
                                                    onClick={() => deleteMessage(message._id)}
                                                    title="Delete"
                                                >
                                                    <i className="ti ti-trash"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {editingMessageId === message._id && (
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={editedMessageText}
                                                onChange={(e) => setEditedMessageText(e.target.value)}
                                                onKeyDown={(e) => handleEditKeyPress(e, message._id)}
                                                placeholder="Edit message..."
                                            />
                                            <div className="d-flex gap-2 mt-1">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => editMessage(message._id)}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => setEditingMessageId(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="d-flex gap-1 mt-1">
                                        <button
                                            className="btn btn-sm btn-link p-0"
                                            onClick={() => addReaction(message._id, '👍')}
                                        >
                                            👍
                                        </button>
                                        <button
                                            className="btn btn-sm btn-link p-0"
                                            onClick={() => addReaction(message._id, '❤️')}
                                        >
                                            ❤️
                                        </button>
                                        <button
                                            className="btn btn-sm btn-link p-0"
                                            onClick={() => addReaction(message._id, '😊')}
                                        >
                                            😊
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="border-top pt-3 d-flex align-items-center gap-2 position-relative">
                    <input
                        type="text"
                        className="form-control"
                        value={newMessage}
                        onChange={handleTyping}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        disabled={connectionStatus !== 'connected'}
                    />
                    <button
                        className="btn btn-light"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        disabled={connectionStatus !== 'connected'}
                    >
                        😊
                    </button>
                    <button
                        className="btn btn-light"
                        onClick={() => fileInputRef.current.click()}
                        disabled={connectionStatus !== 'connected'}
                    >
                        📎
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                    <button
                        className="btn btn-primary rounded-circle"
                        onClick={handleSendMessage}
                        title="Send"
                        disabled={connectionStatus !== 'connected'}
                    >
                        <i className="ti ti-send"></i>
                    </button>
                    {showEmojiPicker && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '60px',
                                right: '60px',
                                zIndex: 9999,
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                            }}
                        >
                            <EmojiPicker
                                onEmojiClick={(_, emojiData) => addEmoji(emojiData)}
                                lazyLoadEmojis={true}
                                searchDisabled={false}
                                skinTonesDisabled={false}
                                previewConfig={{ showPreview: false }}
                                categories={[
                                    { category: 'smileys_people', name: 'Smileys & People' },
                                    { category: 'flags', name: 'Flags' },
                                    { category: 'animals_nature', name: 'Animals & Nature' },
                                ]}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyChatWithSuperAdmin;