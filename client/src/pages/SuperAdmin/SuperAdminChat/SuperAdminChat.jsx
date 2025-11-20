// import { useEffect, useRef, useState, useCallback } from 'react';
// import { useAuthContext } from '../../../context/auth-context';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { io } from 'socket.io-client';
// import EmojiPicker from 'emoji-picker-react';
// import { useSuperAdminContext } from '../../../context/superadmin-context';

// const SuperAdminChat = () => {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [chatList, setChatList] = useState([]);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [isTyping, setIsTyping] = useState(false);
//     const [connectionStatus, setConnectionStatus] = useState('disconnected');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isOnline, setIsOnline] = useState(false);
//     const [editingMessageId, setEditingMessageId] = useState(null);
//     const [editedMessageText, setEditedMessageText] = useState('');
//     const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//     const messagesEndRef = useRef(null);
//     const typingTimeoutRef = useRef(null);
//     const fileInputRef = useRef(null);
//     const socketRef = useRef(null);

//     const { server, user: currentUser, socket: contextSocket } = useAuthContext();
//     const { getAllCompaniesWithVerificationStatus, companies } = useSuperAdminContext();
//     const token = localStorage.getItem('token');

//     // Fetch all companies for chat list
//     const getAllChatPerson = async () => {
//         try {
//             const response = await axios.get(`${server}/api/v1/chat/get-all-chatPerson`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setChatList(response.data.chatList);
//         } catch (error) {
//             toast.error(error?.response?.data?.message || 'Failed to load chat users');
//         }
//     };

//     // Handle file upload
//     const handleFileUpload = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         if (!file.type.startsWith('image/')) {
//             toast.error('Only images are allowed');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', file);

//         try {
//             const response = await axios.post(`${server}/api/v1/upload`, formData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             socketRef.current.emit('sendMessage', {
//                 text: '',
//                 fileUrl: response.data.fileUrl,
//                 receiverId: selectedUser._id,
//                 senderId: currentUser.userId,
//             });

//             toast.success('Image sent successfully');
//         } catch (error) {
//             toast.error('Failed to upload image');
//         }
//     };

//     // Delete a message
//     const deleteMessage = async (messageId) => {
//         try {
//             await axios.delete(`${server}/api/v1/chat/${messageId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
//             toast.success('Message deleted');
//         } catch (error) {
//             console.error('Error deleting message:', error);
//             toast.error('Failed to delete message');
//         }
//     };

//     // Add emoji to message
//     const addEmoji = (emojiData) => {
//         if (editingMessageId) {
//             setEditedMessageText((prev) => prev + emojiData.emoji);
//         } else {
//             setNewMessage((prev) => prev + emojiData.emoji);
//         }
//         setShowEmojiPicker(false);
//     };

//     // Initialize socket connection
//     useEffect(() => {
//         if (!token || !server) return;

//         // Use the socket from context if available, otherwise create a new one
//         socketRef.current = contextSocket || io(server, {
//             auth: {
//                 token: token
//             }
//         });

//         const currentSocket = socketRef.current;

//         currentSocket.on('connect', () => {
//             setConnectionStatus('connected');
//             // Join the user's room after connection
//             if (currentUser?.userId) {
//                 currentSocket.emit('join', { userId: currentUser.userId });
//             }
//         });

//         currentSocket.on('disconnect', () => setConnectionStatus('disconnected'));

//         currentSocket.on('newMessage', (msg) => {
//             setMessages((prev = []) => [...prev, msg]);
//         });

//         currentSocket.on('userStatus', ({ userId, isOnline }) => {
//             if (userId === selectedUser?._id) {
//                 setIsOnline(isOnline);
//             }
//         });

//         currentSocket.on('typing', ({ senderId, isTyping }) => {
//             if (senderId === selectedUser?._id) setIsTyping(isTyping);
//         });

//         currentSocket.on('messagesRead', ({ messageIds }) => {
//             setMessages((prev) =>
//                 prev.map((msg) =>
//                     messageIds.includes(msg._id) ? { ...msg, status: 'read' } : msg
//                 )
//             );
//         });

//         currentSocket.on('messageEdited', (updatedMessage) => {
//             setMessages((prev) =>
//                 prev.map((msg) =>
//                     msg._id === updatedMessage._id ? updatedMessage : msg
//                 )
//             );
//         });

//         currentSocket.on('messageReacted', (updatedMessage) => {
//             setMessages((prev) =>
//                 prev.map((msg) =>
//                     msg._id === updatedMessage._id ? updatedMessage : msg
//                 )
//             );
//         });

//         return () => {
//             if (!currentSocket || contextSocket) return; // Don't disconnect if using context socket
//             currentSocket.disconnect();
//             clearTimeout(typingTimeoutRef.current);
//         };
//     }, [server, token, selectedUser, currentUser, contextSocket]);

//     // Fetch chat list on component mount
//     useEffect(() => {
//         // getAllChatPerson();
//         getAllCompaniesWithVerificationStatus();
//     }, []);

//     // Fetch messages when a user is selected
//     useEffect(() => {
//         if (!selectedUser || !currentUser?.userId) return;

//         const fetchMessages = async () => {
//             try {
//                 const res = await axios.get(`${server}/api/v1/chat/${selectedUser._id}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setMessages(res.data.data);
//             } catch (err) {
//                 toast.error('Failed to fetch messages');
//             }
//         };

//         fetchMessages();

//         // Join the room for this chat
//         if (socketRef.current) {
//             const roomId = [selectedUser._id, currentUser.userId].sort().join("-");
//             socketRef.current.emit('join', { userId: roomId });
//         }
//     }, [selectedUser, currentUser, server, token]);

//     // Send a new message
//     const handleSendMessage = useCallback(() => {
//         if (!newMessage.trim() && !fileInputRef.current?.files?.length) return;

//         socketRef.current.emit('sendMessage', {
//             text: newMessage,
//             receiverId: selectedUser._id,
//             senderId: currentUser.userId,
//         });

//         socketRef.current.emit('typing', {
//             receiverId: selectedUser._id,
//             isTyping: false,
//         });

//         setNewMessage('');
//         clearTimeout(typingTimeoutRef.current);
//         if (fileInputRef.current) fileInputRef.current.value = '';
//     }, [newMessage, selectedUser, currentUser]);

//     // Handle typing indicator
//     const handleTyping = useCallback((e) => {
//         const value = e.target.value;
//         setNewMessage(value);

//         if (!selectedUser || !socketRef.current) return;

//         socketRef.current.emit('typing', {
//             receiverId: selectedUser._id,
//             isTyping: value.length > 0,
//         });

//         clearTimeout(typingTimeoutRef.current);
//         typingTimeoutRef.current = setTimeout(() => {
//             socketRef.current.emit('typing', {
//                 receiverId: selectedUser._id,
//                 isTyping: false,
//             });
//         }, 2000);
//     }, [selectedUser]);

//     // Edit a message
//     const editMessage = useCallback((messageId) => {
//         socketRef.current.emit('editMessage', {
//             messageId,
//             newText: editedMessageText,
//         });

//         setEditingMessageId(null);
//         setEditedMessageText('');
//         toast.success('Message edited');
//     }, [editedMessageText]);

//     // Add reaction to a message
//     const addReaction = useCallback((messageId, emoji) => {
//         socketRef.current.emit('addReaction', {
//             messageId,
//             emoji,
//             senderId: currentUser.userId,
//         });
//     }, [currentUser]);

//     // Handle key press for editing
//     const handleEditKeyPress = useCallback((e, messageId) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             editMessage(messageId);
//         }
//     }, [editMessage]);

//     // Handle key press for sending
//     const handleKeyPress = useCallback((e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     }, [handleSendMessage]);

//     // Auto-scroll to bottom of messages
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     // Filter messages based on search query
//     const filteredMessages = messages.filter((msg) =>
//         msg.text.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return (
//         <div className="container-fluid">
//             <div className="row" style={{ height: '80vh' }}>
//                 {/* Left sidebar - Companies list */}
//                 <div className="col-md-3 border-end overflow-auto">
//                     <h6 className="text-center py-2 border-bottom">💼 Companies</h6>
//                     {companies.length === 0 ? (
//                         <div className="text-center text-muted py-5">
//                             <i className="ti ti-users fs-1 text-primary mb-2"></i>
//                             <p className="mb-0">No companies found</p>
//                         </div>
//                     ) : (
//                         companies.map((user) => (
//                             <button
//                                 key={user._id}
//                                 className={`btn w-100 text-start p-2 ${selectedUser?._id === user._id ? 'btn-primary text-white' : 'btn-light'}`}
//                                 onClick={() => setSelectedUser(user)}
//                             >
//                                 <div className="d-flex align-items-center">
//                                     <div className="me-2">
//                                         <span className={`badge rounded-circle ${user.isOnline ? 'bg-success' : 'bg-secondary'}`} style={{ width: '10px', height: '10px' }}></span>
//                                     </div>
//                                     <div>
//                                         {user.fullname} <br />
//                                         <small className="text-muted">{user.role}</small>
//                                     </div>
//                                 </div>
//                             </button>
//                         ))
//                     )}
//                 </div>

//                 {/* Right side - Chat area */}
//                 <div className="col-md-9 d-flex flex-column">
//                     {selectedUser ? (
//                         <>
//                             {/* Chat header */}
//                             <div className="d-flex justify-content-between align-items-center border-bottom py-2 px-3">
//                                 <h5 className="mb-0 text-primary">
//                                     💬 Chat with {selectedUser.fullname}
//                                 </h5>
//                                 <div className="d-flex align-items-center gap-2">
//                                     <span className={`badge rounded-circle ${isOnline && connectionStatus === 'connected' ? 'bg-success' : 'bg-secondary'}`} style={{ width: '10px', height: '10px' }}></span>
//                                     <small className={`text-${isOnline && connectionStatus === 'connected' ? 'success' : 'secondary'}`}>
//                                         {isTyping ? 'Typing...' : isOnline && connectionStatus === 'connected' ? 'Online' : 'Offline'}
//                                     </small>
//                                 </div>
//                             </div>

//                             {/* Search bar */}
//                             <div className="mb-3 px-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="Search messages..."
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                 />
//                             </div>

//                             {/* Messages area */}
//                             <div className="flex-grow-1 overflow-auto p-3">
//                                 {filteredMessages.length === 0 ? (
//                                     <div className="text-center text-muted py-5">
//                                         <i className="ti ti-message-circle fs-1 text-primary mb-2"></i>
//                                         <p className="mb-0">{searchQuery ? 'No messages found' : 'No messages yet. Say hello 👋'}</p>
//                                     </div>
//                                 ) : (
//                                     filteredMessages.map((msg) => (
//                                         <div
//                                             key={msg._id}
//                                             className={`d-flex mb-2 ${msg.sender._id === currentUser.userId ? 'justify-content-end' : 'justify-content-start'}`}
//                                         >
//                                             <div
//                                                 className={`p-2 rounded shadow-sm ${msg.sender._id === currentUser.userId ? 'bg-primary text-white' : 'bg-light text-dark'}`}
//                                                 style={{ maxWidth: '75%' }}
//                                             >
//                                                 {msg.fileUrl && (
//                                                     <img
//                                                         src={msg.fileUrl}
//                                                         alt="attachment"
//                                                         className="img-fluid rounded mb-2"
//                                                         style={{ maxWidth: '200px' }}
//                                                     />
//                                                 )}
//                                                 <p className="mb-1" style={{ whiteSpace: 'pre-wrap' }}>
//                                                     {msg.text}
//                                                     {msg.edited && <small className="text-muted ms-1">(edited)</small>}
//                                                 </p>
//                                                 {msg?.reactions?.length > 0 && (
//                                                     <div className="d-flex gap-1 flex-wrap">
//                                                         {msg.reactions.map((reaction, index) => (
//                                                             <span key={index} className="badge bg-secondary">
//                                                                 {reaction.emoji}
//                                                             </span>
//                                                         ))}
//                                                     </div>
//                                                 )}
//                                                 <div className="text-end small text-muted">
//                                                     {new Date(msg.createdAt).toLocaleString([], {
//                                                         dateStyle: 'short',
//                                                         timeStyle: 'short',
//                                                     })}
//                                                     {msg.sender._id === currentUser.userId && (
//                                                         <i className={`ms-2 ti ${msg.status === 'read' ? 'ti-checks' : 'ti-check'}`}></i>
//                                                     )}
//                                                 </div>
//                                                 {msg.sender._id === currentUser.userId && (
//                                                     <div className="d-flex gap-1 mt-1">
//                                                         <button
//                                                             className="btn btn-sm btn-link p-0"
//                                                             onClick={() => {
//                                                                 setEditingMessageId(msg._id);
//                                                                 setEditedMessageText(msg.text);
//                                                             }}
//                                                             title="Edit"
//                                                         >
//                                                             <i className="ti ti-edit"></i>
//                                                         </button>
//                                                         <button
//                                                             className="btn btn-sm btn-link p-0"
//                                                             onClick={() => deleteMessage(msg._id)}
//                                                             title="Delete"
//                                                         >
//                                                             <i className="ti ti-trash"></i>
//                                                         </button>
//                                                     </div>
//                                                 )}
//                                                 <div className="d-flex gap-1 mt-1">
//                                                     <button
//                                                         className="btn btn-sm btn-link p-0"
//                                                         onClick={() => addReaction(msg._id, '👍')}
//                                                     >
//                                                         👍
//                                                     </button>
//                                                     <button
//                                                         className="btn btn-sm btn-link p-0"
//                                                         onClick={() => addReaction(msg._id, '❤️')}
//                                                     >
//                                                         ❤️
//                                                     </button>
//                                                     <button
//                                                         className="btn btn-sm btn-link p-0"
//                                                         onClick={() => addReaction(msg._id, '😊')}
//                                                     >
//                                                         😊
//                                                     </button>
//                                                 </div>
//                                                 {editingMessageId === msg._id && (
//                                                     <div className="mt-2">
//                                                         <input
//                                                             type="text"
//                                                             className="form-control form-control-sm"
//                                                             value={editedMessageText}
//                                                             onChange={(e) => setEditedMessageText(e.target.value)}
//                                                             onKeyDown={(e) => handleEditKeyPress(e, msg._id)}
//                                                             placeholder="Edit message..."
//                                                         />
//                                                         <div className="d-flex gap-2 mt-1">
//                                                             <button
//                                                                 className="btn btn-sm btn-primary"
//                                                                 onClick={() => editMessage(msg._id)}
//                                                             >
//                                                                 Save
//                                                             </button>
//                                                             <button
//                                                                 className="btn btn-sm btn-secondary"
//                                                                 onClick={() => setEditingMessageId(null)}
//                                                             >
//                                                                 Cancel
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))
//                                 )}
//                                 <div ref={messagesEndRef} />
//                             </div>

//                             {/* Message input area */}
//                             <div className="border-top p-3 d-flex gap-2">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     value={newMessage}
//                                     onChange={handleTyping}
//                                     onKeyDown={handleKeyPress}
//                                     placeholder="Type a message..."
//                                     disabled={!selectedUser}
//                                 />
//                                 <button
//                                     className="btn btn-light"
//                                     onClick={() => setShowEmojiPicker((prev) => !prev)}
//                                     disabled={!selectedUser}
//                                 >
//                                     😊
//                                 </button>
//                                 <button
//                                     className="btn btn-light"
//                                     onClick={() => fileInputRef.current.click()}
//                                     disabled={!selectedUser}
//                                 >
//                                     📎
//                                 </button>
//                                 <input
//                                     type="file"
//                                     ref={fileInputRef}
//                                     style={{ display: 'none' }}
//                                     accept="image/*"
//                                     onChange={handleFileUpload}
//                                 />
//                                 <button
//                                     className="btn btn-primary"
//                                     onClick={handleSendMessage}
//                                     disabled={!selectedUser}
//                                 >
//                                     <i className="ti ti-send"></i>
//                                 </button>
//                                 {showEmojiPicker && (
//                                     <div
//                                         style={{
//                                             position: 'absolute',
//                                             bottom: '60px',
//                                             right: '60px',
//                                             zIndex: 9999,
//                                             backgroundColor: 'white',
//                                             borderRadius: '10px',
//                                             boxShadow: '0 0 10px rgba(0,0,0,0.2)',
//                                         }}
//                                     >
//                                         <EmojiPicker
//                                             onEmojiClick={(_, emojiData) => addEmoji(emojiData)}
//                                             lazyLoadEmojis={true}
//                                             searchDisabled={false}
//                                             skinTonesDisabled={false}
//                                             previewConfig={{ showPreview: false }}
//                                             categories={[
//                                                 { category: 'smileys_people', name: 'Smileys & People' },
//                                                 { category: 'flags', name: 'Flags' },
//                                                 { category: 'animals_nature', name: 'Animals & Nature' },
//                                             ]}
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         </>
//                     ) : (
//                         /* Placeholder when no company is selected */
//                         <div className="flex-grow-1 d-flex justify-content-center align-items-center">
//                             <div className="text-center text-muted">
//                                 <i className="ti ti-message-circle fs-1 text-primary mb-3"></i>
//                                 <h5>Select a company to start chatting</h5>
//                                 <p>Choose a company from the list to begin your conversation</p>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SuperAdminChat;


















import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../../context/auth-context';
const mockUsers = [
    { id: 1, name: 'Alex Johnson', lastMessage: 'See you tomorrow!', unread: 2, online: true },
    { id: 2, name: 'Sarah Williams', lastMessage: 'Thanks for your help!', unread: 0, online: true },
    { id: 3, name: 'Mich ael Chen', lastMessage: 'Did you see the report?', unread: 5, online: false },
    { id: 4, name: 'Emma Thompson', lastMessage: 'The meeting is at 3 PM', unread: 0, online: true },
    { id: 5, name: 'James Wilson', lastMessage: 'Can we reschedule?', unread: 1, online: false },
    { id: 6, name: 'Olivia Davis', lastMessage: 'I sent you the files', unread: 0, online: true },
    { id: 7, name: 'Olivia Davis', lastMessage: 'I sent you the files', unread: 0, online: true },
    { id: 8, name: 'Olivia Davis', lastMessage: 'I sent you the files', unread: 0, online: true },
];
const mockMessages = {
    1: [
        { id: 1, text: 'Hey there! How are you?', sender: 'other', time: '10:30 AM' },
        { id: 2, text: 'I\'m good, thanks! How about you?', sender: 'me', time: '10:32 AM' },
        { id: 3, text: 'Doing great! Are we still meeting tomorrow?', sender: 'other', time: '10:35 AM' },
        { id: 4, text: 'Yes, absolutely! 2 PM at the usual place.', sender: 'me', time: '10:36 AM' },
        { id: 5, text: 'Perfect! See you tomorrow!', sender: 'other', time: '10:40 AM' },
    ],
    2: [
        { id: 1, text: 'Hi, I need your help with the project', sender: 'other', time: '9:15 AM' },
        { id: 2, text: 'Sure, what do you need?', sender: 'me', time: '9:20 AM' },
        { id: 3, text: 'Can you review the design documents?', sender: 'other', time: '9:22 AM' },
        { id: 4, text: 'I\'ll take a look and get back to you', sender: 'me', time: '9:25 AM' },
        { id: 5, text: 'Thanks for your help!', sender: 'other', time: '11:45 AM' },
    ],
    3: [
        { id: 1, text: 'Morning! Did you see the report I sent?', sender: 'other', time: '8:45 AM' },
        { id: 2, text: 'Not yet, I\'ll check it now', sender: 'me', time: '8:50 AM' },
        { id: 3, text: 'Let me know your thoughts when you\'re done', sender: 'other', time: '8:52 AM' },
    ],
    4: [
        { id: 1, text: 'The meeting today is at 3 PM', sender: 'other', time: 'Yesterday' },
        { id: 2, text: 'Got it, I\'ll be there', sender: 'me', time: 'Yesterday' },
    ],
    5: [
        { id: 1, text: 'Hi, can we reschedule our meeting?', sender: 'other', time: 'Yesterday' },
        { id: 2, text: 'Sure, when works for you?', sender: 'me', time: 'Yesterday' },
    ],
    6: [
        { id: 1, text: 'I sent you the files you requested', sender: 'other', time: '2 days ago' },
        { id: 2, text: 'Received, thanks!', sender: 'me', time: '2 days ago' },
    ],
};
const SuperAdminChat = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, loading, getAllUsers, allUsers } = useAuthContext()
    const [users, setUsers] = useState(allUsers);

    console.log(user);
    console.log(allUsers);

    useEffect(() => {
        if (user) {
            // getAllUsers("superadmin")
            getAllUsers(user?.role)
        }
    }, [])

    // Create a ref for the messages container
    const messagesEndRef = useRef(null);

    // Filter users based on search query
    const filteredUsers = users.filter(user =>
        user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Set initial selected user
    useEffect(() => {
        if (filteredUsers.length > 0 && !selectedUser) {
            setSelectedUser(filteredUsers[0]);
        } else if (filteredUsers.length === 0) {
            setSelectedUser(null);
        }
    }, [filteredUsers, selectedUser]);

    // Load messages when user is selected
    useEffect(() => {
        if (selectedUser) {
            setMessages(mockMessages[selectedUser.id] || []);
        }
    }, [selectedUser]);

    // Scroll to bottom of messages
    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedUser]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle window resize to adjust sidebar visibility
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setShowSidebar(false);
            } else {
                setShowSidebar(true);
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const newMsg = {
            id: messages.length + 1,
            text: newMessage,
            sender: 'me',
            time: 'Just now'
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');

        // Update last message in user list
        const updatedUsers = users.map(user =>
            user.id === selectedUser.id
                ? { ...user, lastMessage: newMessage, unread: 0 }
                : user
        );
        setUsers(updatedUsers);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        if (window.innerWidth < 768) {
            setShowSidebar(false);
        }
    };

    const handleBackToUsers = () => {
        setShowSidebar(true);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div className="container-fluid">
            <div className="container">
                <div className="chat-container">
                    <div className="chat-layout">
                        {/* Sidebar */}
                        <div className={`sidebar ${showSidebar ? 'show' : 'hide'}`}>
                            <div className="sidebar-header">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h1 className="h3 mb-0 text-primary">ChatApp</h1>
                                    <button
                                        className="btn btn-sm btn-light d-md-none"
                                        onClick={() => setShowSidebar(false)}
                                    >
                                        <i className="bi bi-arrow-right"></i>
                                    </button>
                                </div>
                                <div className="position-relative mt-3">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="form-control ps-5"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                    {searchQuery && (
                                        <button
                                            className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 text-muted"
                                            onClick={handleClearSearch}
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="sidebar-content">
                                <h6 className="px-3 py-2 text-muted text-uppercase small fw-bold">Recent Chats</h6>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <div
                                            key={user.id}
                                            className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                                            onClick={() => handleUserSelect(user)}
                                        >
                                            <div className="position-relative flex-shrink-0">
                                                <div className="user-avatar">
                                                    {user.name.charAt(0)}
                                                </div>
                                                {user.online && (
                                                    <div className="online-indicator"></div>
                                                )}
                                            </div>
                                            <div className="user-info">
                                                <div className="d-flex justify-content-between">
                                                    <h6 className="mb-0 fw-semibold text-truncate">{user.name}</h6>
                                                    <small className="text-muted flex-shrink-0 ms-2">Yesterday</small>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <p className="mb-0 text-muted small text-truncate">
                                                        {user.lastMessage}
                                                    </p>
                                                    {user.unread > 0 && (
                                                        <span className="unread-badge">
                                                            {user.unread}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-muted">
                                        <i className="bi bi-person-x fs-1"></i>
                                        <p className="mt-2">No users found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Main Chat Area */}
                        <div className={`main-chat ${showSidebar ? 'hide' : 'show'}`}>
                            {selectedUser ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="chat-header">
                                        <button
                                            className="btn btn-sm btn-light d-md-none me-2"
                                            onClick={handleBackToUsers}
                                        >
                                            <i className="bi bi-arrow-left"></i>
                                        </button>
                                        <div className="position-relative flex-shrink-0">
                                            <div className="user-avatar">
                                                {selectedUser.name.charAt(0)}
                                            </div>
                                            {selectedUser.online && (
                                                <div className="online-indicator"></div>
                                            )}
                                        </div>
                                        <div className="user-details">
                                            <h5 className="mb-0 fw-semibold text-truncate">{selectedUser.name}</h5>
                                            <p className="mb-0 text-muted small">
                                                {selectedUser.online ? 'Online' : 'Offline'}
                                            </p>
                                        </div>
                                        <div className="header-actions">
                                            <button className="btn btn-sm btn-light rounded-circle">
                                                <i className="bi bi-telephone"></i>
                                            </button>
                                            <button className="btn btn-sm btn-light rounded-circle">
                                                <i className="bi bi-search"></i>
                                            </button>
                                            <button className="btn btn-sm btn-light rounded-circle d-none d-sm-inline-block">
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </button>
                                        </div>
                                    </div>
                                    {/* Messages Area */}
                                    <div className="messages-area">
                                        <div className="messages-container">
                                            {messages.map(message => (
                                                <div
                                                    key={message.id}
                                                    className={`message ${message.sender === 'me' ? 'sent' : 'received'}`}
                                                >
                                                    <div className="message-content">
                                                        <p className="mb-1">{message.text}</p>
                                                        <div className="message-time">
                                                            {message.time}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Empty div to scroll to */}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    </div>
                                    {/* Message Input */}
                                    <div className="message-input-container">
                                        <div className="input-actions">
                                            <button className="btn btn-sm btn-light text-muted">
                                                <i className="bi bi-paperclip fs-5"></i>
                                            </button>
                                        </div>
                                        <div className="input-area">
                                            <textarea
                                                className="form-control"
                                                placeholder="Type a message..."
                                                rows={1}
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                            />
                                        </div>
                                        <div className="send-button">
                                            <button
                                                className="btn btn-primary rounded-circle"
                                                onClick={handleSendMessage}
                                            >
                                                <i className="bi bi-send-fill"></i>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="empty-chat">
                                    <div className="empty-chat-content">
                                        <div className="empty-chat-icon">
                                            <i className="bi bi-chat-dots fs-1"></i>
                                        </div>
                                        <h4 className="fw-semibold text-secondary">Select a chat to start messaging</h4>
                                        <p className="text-muted">Choose a user from the list to begin your conversation</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <style>
                        {`
                .chat-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    height: 85vh; /* Fixed height for the chat container */
                    overflow: hidden; /* Prevent container from scrolling */
                }
                .chat-layout {
                    display: flex;
                    flex-direction: row;
                    height: 100%; /* Take full height of parent */
                    overflow: hidden; /* Prevent layout from scrolling */
                }
                .sidebar {
                    width: 100%;
                    max-width: 300px;
                    background-color: white;
                    border-right: 1px solid #dee2e6;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.3s ease;
                    height: 100%; /* Take full height of parent */
                    overflow: hidden; /* Prevent sidebar from scrolling */
                }
                .sidebar-header {
                    padding: 1rem;
                    border-bottom: 1px solid #dee2e6;
                    flex-shrink: 0; /* Prevent header from shrinking */
                }
                .sidebar-content {
                    flex-grow: 1;
                    overflow-y: auto; /* Only sidebar content scrolls */
                }
                .user-item {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid #dee2e6;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .user-item:hover {
                    background-color: rgba(0, 0, 0, 0.03);
                }
                .user-item.active {
                    background-color: rgba(0, 123, 255, 0.1);
                }
                .user-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background-color: rgba(0, 123, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #0d6efd;
                    font-weight: 600;
                }
                .online-indicator {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 12px;
                    height: 12px;
                    background-color: #198754;
                    border-radius: 50%;
                    border: 2px solid white;
                }
                .user-info {
                    margin-left: 0.75rem;
                    flex-grow: 1;
                    min-width: 0;
                }
                .unread-badge {
                    background-color: #0d6efd;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    flex-shrink: 0;
                }
                .main-chat {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    background-color: #f8f9fa;
                    position: relative;
                    height: 100%; /* Take full height of parent */
                    overflow: hidden; /* Prevent main chat from scrolling */
                }
                .chat-header {
                    background-color: white;
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid #dee2e6;
                    display: flex;
                    align-items: center;
                    flex-shrink: 0; /* Prevent header from shrinking */
                }
                .user-details {
                    margin-left: 0.75rem;
                    min-width: 0;
                }
                .header-actions {
                    margin-left: auto;
                    display: flex;
                    gap: 0.5rem;
                }
                .messages-area {
                    flex-grow: 1;
                    overflow-y: auto; /* Only messages area scrolls */
                    padding: 1rem;
                    padding-bottom: 80px; /* Space for the input container */
                }
                .messages-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .message {
                    display: flex;
                }
                .message.sent {
                    justify-content: flex-end;
                }
                .message.received {
                    justify-content: flex-start;
                }
                .message-content {
                    max-width: 75%;
                    padding: 0.5rem 0.75rem;
                    border-radius: 1rem;
                }
                .message.sent .message-content {
                    background-color: #0d6efd;
                    color: white;
                }
                .message.received .message-content {
                    background-color: white;
                    color: #212529;
                    border: 1px solid #dee2e6;
                }
                .message-time {
                    font-size: 0.75rem;
                    text-align: right;
                }
                .message.sent .message-time {
                    color: rgba(255, 255, 255, 0.7);
                }
                .message.received .message-time {
                    color: #6c757d;
                }
                .message-input-container {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: white;
                    border-top: 1px solid #dee2e6;
                    padding: 0.75rem;
                    display: flex;
                    align-items: flex-end;
                    z-index: 10;
                    flex-shrink: 0; /* Prevent input from shrinking */
                }
                .input-actions {
                    margin-right: 0.5rem;
                }
                .input-area {
                    flex-grow: 1;
                }
                .send-button {
                    margin-left: 0.5rem;
                }
                .empty-chat {
                    flex-grow: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .empty-chat-content {
                    text-align: center;
                    padding: 2rem;
                }
                .empty-chat-icon {
                    width: 96px;
                    height: 96px;
                    border-radius: 50%;
                    background-color: rgba(0, 123, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #0d6efd;
                    margin: 0 auto 1rem;
                }
                /* Responsive classes */
                @media (min-width: 768px) {
                    .sidebar {
                        width: 33.333333%;
                        max-width: none;
                    }
                    .sidebar.hide {
                        display: flex;
                    }
                    .main-chat.hide {
                        display: flex;
                    }
                }
                @media (max-width: 767.98px) {
                    .sidebar.hide {
                        transform: translateX(-100%);
                        position: absolute;
                        z-index: 10;
                        height: 100%;
                    }
                    .main-chat.show {
                        display: flex;
                    }
                    .main-chat.hide {
                        display: none;
                    }
                }
                `}
                    </style>
                </div>
            </div>
        </div>
    );
};
export default SuperAdminChat;