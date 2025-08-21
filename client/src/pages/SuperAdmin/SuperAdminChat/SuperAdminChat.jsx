import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../../../context/auth-context';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';

const SuperAdminChat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatList, setChatList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [searchQuery, setSearchQuery] = useState('');
    const [isOnline, setIsOnline] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedMessageText, setEditedMessageText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);
    const socketRef = useRef(null);
    const { server, user: currentUser, socket } = useAuthContext();
    const token = localStorage.getItem('token');

    const getAllChatPerson = async () => {
        try {
            const response = await axios.get(`${server}/api/v1/chat/get-all-chatPerson`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChatList(response.data.chatList);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to load chat users');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Only images are allowed');
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
                receiverId: selectedUser._id,
                senderId: currentUser.userId,
            });
            toast.success('Image sent successfully');
        } catch (error) {
            toast.error('Failed to upload image');
        }
    };

    useEffect(() => {
        if (!token || !server) return;

        socketRef.current = socket;

        socket.on('connect', () => setConnectionStatus('connected'));
        socket.on('disconnect', () => setConnectionStatus('disconnected'));

        socket.on('newMessage', (msg) => {
            setMessages((prev = []) => [...prev, msg]);
        });

        socket.on('userStatus', ({ userId, isOnline }) => {
            if (userId === selectedUser?._id) {
                setIsOnline(isOnline);
            }
        });

        socket.on('typing', ({ senderId, isTyping }) => {
            if (senderId === selectedUser?._id) setIsTyping(isTyping);
        });

        socket.on('messagesRead', ({ messageIds }) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    messageIds.includes(msg._id) ? { ...msg, status: 'read' } : msg
                )
            );
        });

        socket.on('messageEdited', (updatedMessage) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === updatedMessage._id ? updatedMessage : msg
                )
            );
        });

        socket.on('messageReacted', (updatedMessage) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === updatedMessage._id ? updatedMessage : msg
                )
            );
        });

        return () => {
            socket.disconnect();
            clearTimeout(typingTimeoutRef.current);
        };
    }, [server, token, selectedUser]);

    useEffect(() => {
        getAllChatPerson();
    }, []);

    useEffect(() => {
        if (!selectedUser || !currentUser?.userId) return;

        const fetchMessages = async () => {
            try {
                const res = await axios.get(`${server}/api/v1/chat/${selectedUser._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessages(res.data.data);
            } catch (err) {
                toast.error('Failed to fetch messages');
            }
        };

        fetchMessages();

        const roomId = [selectedUser._id, currentUser.userId].sort().join("-");
        socketRef.current.emit('join', { userId: roomId });
    }, [selectedUser, currentUser, server, token]);

    const handleSendMessage = () => {
        if (!newMessage.trim() && !fileInputRef.current?.files?.length) return;

        socketRef.current.emit('sendMessage', {
            text: newMessage,
            receiverId: selectedUser._id,
            senderId: currentUser.userId,
        });
        socketRef.current.emit('typing', {
            receiverId: selectedUser._id,
            isTyping: false,
        });
        setNewMessage('');
        clearTimeout(typingTimeoutRef.current);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleTyping = (e) => {
        const value = e.target.value;
        setNewMessage(value);

        if (!selectedUser || !socketRef.current) return;

        socketRef.current.emit('typing', {
            receiverId: selectedUser._id,
            isTyping: value.length > 0,
        });

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current.emit('typing', {
                receiverId: selectedUser._id,
                isTyping: false,
            });
        }, 2000);
    };

    const editMessage = (messageId) => {
        socketRef.current.emit('editMessage', {
            messageId,
            newText: editedMessageText,
        });
        setEditingMessageId(null);
        setEditedMessageText('');
        toast.success('Message edited');
    };

    const addReaction = (messageId, emoji) => {
        socketRef.current.emit('addReaction', {
            messageId,
            emoji,
            senderId: currentUser._id,
        });
    };

    const handleEditKeyPress = (e, messageId) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            editMessage(messageId);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const filteredMessages = messages.filter((msg) =>
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container-fluid">
            <div className="row" style={{ height: '80vh' }}>
                <div className="col-md-3 border-end overflow-auto">
                    <h6 className="text-center py-2 border-bottom">💼 Companies</h6>
                    {chatList.map((user) => (
                        <button
                            key={user._id}
                            className={`btn w-100 text-start p-2 ${selectedUser?._id === user._id ? 'btn-primary text-white' : 'btn-light'}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            {user.fullname} <br />
                            <small className="text-muted">{user.role}</small>
                        </button>
                    ))}
                </div>

                <div className="col-md-9 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center border-bottom py-2 px-3">
                        <h5 className="mb-0 text-primary">
                            💬 Chat with {selectedUser?.fullname || '...'}
                        </h5>
                        <div className="d-flex align-items-center gap-2">
                            <span className={`badge rounded-circle ${isOnline && connectionStatus === 'connected' ? 'bg-success' : 'bg-secondary'}`} style={{ width: '10px', height: '10px' }}></span>
                            <small className={`text-${isOnline && connectionStatus === 'connected' ? 'success' : 'secondary'}`}>
                                {isTyping ? 'Typing...' : isOnline && connectionStatus === 'connected' ? 'Online' : 'Offline'}
                            </small>
                        </div>
                    </div>

                    <div className="mb-3 px-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex-grow-1 overflow-auto p-3">
                        {filteredMessages.length === 0 ? (
                            <div className="text-center text-muted py-5">
                                <i className="ti ti-message-circle fs-1 text-primary mb-2"></i>
                                <p className="mb-0">{searchQuery ? 'No messages found' : 'No messages yet. Say hello 👋'}</p>
                            </div>
                        ) : (
                            filteredMessages.map((msg) => (
                                <div
                                    key={msg._id}
                                    className={`d-flex mb-2 ${msg.sender._id === currentUser._id ? 'justify-content-end' : 'justify-content-start'}`}
                                >
                                    <div
                                        className={`p-2 rounded shadow-sm ${msg.sender._id === currentUser._id ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                                        style={{ maxWidth: '75%' }}
                                    >
                                        {msg.fileUrl && (
                                            <img
                                                src={msg.fileUrl}
                                                alt="attachment"
                                                className="img-fluid rounded mb-2"
                                                style={{ maxWidth: '200px' }}
                                            />
                                        )}
                                        <p className="mb-1" style={{ whiteSpace: 'pre-wrap' }}>
                                            {msg.text}
                                            {msg.edited && <small className="text-muted ms-1">(edited)</small>}
                                        </p>
                                        {msg?.reactions?.length > 0 && (
                                            <div className="d-flex gap-1 flex-wrap">
                                                {msg.reactions.map((reaction, index) => (
                                                    <span key={index} className="badge bg-secondary">
                                                        {reaction.emoji}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="text-end small text-muted">
                                            {new Date(msg.createdAt).toLocaleString([], {
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                            })}
                                            {msg.sender._id === currentUser._id && (
                                                <i className={`ms-2 ti ${msg.status === 'read' ? 'ti-checks' : 'ti-check'}`}></i>
                                            )}
                                        </div>
                                        {msg.sender._id === currentUser._id && (
                                            <div className="d-flex gap-1 mt-1">
                                                <button
                                                    className="btn btn-sm btn-link p-0"
                                                    onClick={() => {
                                                        setEditingMessageId(msg._id);
                                                        setEditedMessageText(msg.text);
                                                    }}
                                                    title="Edit"
                                                >
                                                    <i className="ti ti-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-link p-0"
                                                    onClick={() => deleteMessage(msg._id)}
                                                    title="Delete"
                                                >
                                                    <i className="ti ti-trash"></i>
                                                </button>
                                            </div>
                                        )}
                                        <div className="d-flex gap-1 mt-1">
                                            <button
                                                className="btn btn-sm btn-link p-0"
                                                onClick={() => addReaction(msg._id, '👍')}
                                            >
                                                👍
                                            </button>
                                            <button
                                                className="btn btn-sm btn-link p-0"
                                                onClick={() => addReaction(msg._id, '❤️')}
                                            >
                                                ❤️
                                            </button>
                                            <button
                                                className="btn btn-sm btn-link p-0"
                                                onClick={() => addReaction(msg._id, '😊')}
                                            >
                                                😊
                                            </button>
                                        </div>
                                        {editingMessageId === msg._id && (
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={editedMessageText}
                                                    onChange={(e) => setEditedMessageText(e.target.value)}
                                                    onKeyDown={(e) => handleEditKeyPress(e, msg._id)}
                                                    placeholder="Edit message..."
                                                />
                                                <div className="d-flex gap-2 mt-1">
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => editMessage(msg._id)}
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
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="border-top p-3 d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            value={newMessage}
                            onChange={handleTyping}
                            onKeyDown={handleKeyPress}
                            placeholder="Type a message..."
                            disabled={!selectedUser}
                        />
                        <button
                            className="btn btn-light"
                            onClick={() => setShowEmojiPicker((prev) => !prev)}
                            disabled={!selectedUser}
                        >
                            😊
                        </button>
                        <button
                            className="btn btn-light"
                            onClick={() => fileInputRef.current.click()}
                            disabled={!selectedUser}
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
                            className="btn btn-primary"
                            onClick={handleSendMessage}
                            disabled={!selectedUser}
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
        </div>
    );
};

export default SuperAdminChat;






