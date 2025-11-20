// import { useState, useEffect, useRef, useCallback } from 'react';
// import { io } from 'socket.io-client';
// import { useAuthContext } from '../../../context/auth-context';
// import axios from 'axios';
// import EmojiPicker from 'emoji-picker-react';
// import toast from 'react-hot-toast';

// const CompanyChatWithSuperAdmin = () => {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [isTyping, setIsTyping] = useState(false);
//     const [connectionStatus, setConnectionStatus] = useState('disconnected');
//     const [selectedSuperAdmin, setSelectedSuperAdmin] = useState(null);
//     const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//     const [unreadCount, setUnreadCount] = useState(0);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isOnline, setIsOnline] = useState(false);
//     const [editingMessageId, setEditingMessageId] = useState(null);
//     const [editedMessageText, setEditedMessageText] = useState('');

//     const messagesEndRef = useRef(null);
//     const typingTimeoutRef = useRef(null);
//     const fileInputRef = useRef(null);

//     const { server, getSuperAdmin, superAdmin, user: currentUser, token, socket: contextSocket } = useAuthContext();

//     // Use the socket from context if available, otherwise create a new one
//     const socketRef = useRef(contextSocket || null);

//     // Add emoji to message
//     const addEmoji = useCallback((emojiData) => {
//         if (editingMessageId) {
//             setEditedMessageText((prev) => prev + emojiData.emoji);
//         } else {
//             setNewMessage((prev) => prev + emojiData.emoji);
//         }
//         setShowEmojiPicker(false);
//     }, [editingMessageId]);

//     // Handle file upload
//     const handleFileUpload = useCallback(async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         if (!file.type.startsWith('image/')) {
//             toast.error('Only images are allowed');
//             return;
//         }

//         if (file.size > 5 * 1024 * 1024) { // 5MB limit
//             toast.error('File size exceeds 5MB');
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
//                 receiverId: selectedSuperAdmin._id,
//                 senderId: currentUser.userId,
//             });

//             toast.success('Image sent successfully');
//         } catch (error) {
//             console.error('Error uploading file:', error);
//             toast.error('Failed to upload image');
//         }
//     }, [server, token, selectedSuperAdmin, currentUser]);

//     // Get super admin list
//     useEffect(() => {
//         if (token && currentUser?.role === 'company') {
//             getSuperAdmin(token);
//         }
//     }, [token, currentUser, getSuperAdmin]);

//     // Initialize socket connection
//     useEffect(() => {
//         if (!token || !server) return;

//         // Create socket if not already available from context
//         if (!socketRef.current) {
//             socketRef.current = io(server, {
//                 auth: {
//                     token: token
//                 }
//             });
//         }

//         const socket = socketRef.current;

//         socket.on('connect', () => {
//             setConnectionStatus('connected');
//             // Join the user's room after connection
//             if (currentUser?.userId) {
//                 socket.emit('join', { userId: currentUser.userId });
//             }
//         });

//         socket.on('disconnect', () => setConnectionStatus('disconnected'));

//         socket.on('connect_error', (err) => {
//             console.error('Socket connection error:', err);
//             setConnectionStatus('error');
//             toast.error('Connection error, please try again');
//         });

//         socket.on('userStatus', ({ userId, isOnline }) => {
//             if (userId === selectedSuperAdmin?._id) {
//                 setIsOnline(isOnline);
//             }
//         });

//         socket.on('messageEdited', (updatedMessage) => {
//             setMessages((prev) =>
//                 prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
//             );
//         });

//         socket.on('messageReacted', (updatedMessage) => {
//             setMessages((prev) =>
//                 prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
//             );
//         });

//         return () => {
//             // Only disconnect if we created the socket (not from context)
//             if (socket && !contextSocket) {
//                 socket.disconnect();
//             }
//             clearTimeout(typingTimeoutRef.current);
//         };
//     }, [token, server, selectedSuperAdmin, currentUser, contextSocket]);

//     // Join room & listen for messages
//     useEffect(() => {
//         const socket = socketRef.current;
//         if (!socket || !selectedSuperAdmin?._id || !currentUser?.userId) return;

//         const roomId = [selectedSuperAdmin._id, currentUser.userId].sort().join('-');
//         socket.emit('join', { userId: roomId });

//         const handleNewMessage = (message) => {
//             setMessages((prev = []) => [...prev, message]);
//             if (message.sender._id !== currentUser.userId) {
//                 setUnreadCount((prev) => prev + 1);
//                 markAsRead([message._id]);
//             }
//         };

//         const handleTypingEvent = ({ senderId, isTyping }) => {
//             if (senderId === selectedSuperAdmin._id) {
//                 setIsTyping(isTyping);
//             }
//         };

//         const handleMessagesRead = ({ messageIds }) => {
//             setMessages((prev) =>
//                 prev.map((msg) =>
//                     messageIds.includes(msg._id) ? { ...msg, status: 'read' } : msg
//                 )
//             );
//         };

//         socket.on('newMessage', handleNewMessage);
//         socket.on('typing', handleTypingEvent);
//         socket.on('messagesRead', handleMessagesRead);

//         return () => {
//             socket.off('newMessage', handleNewMessage);
//             socket.off('typing', handleTypingEvent);
//             socket.off('messagesRead', handleMessagesRead);
//         };
//     }, [selectedSuperAdmin, currentUser]);

//     // Update tab title with unread count
//     useEffect(() => {
//         document.title = unreadCount > 0 ? `(${unreadCount}) Chat with Admin` : 'Chat with Admin';
//     }, [unreadCount]);

//     // Reset unread count on window focus
//     useEffect(() => {
//         const handleFocus = () => setUnreadCount(0);
//         window.addEventListener('focus', handleFocus);
//         return () => window.removeEventListener('focus', handleFocus);
//     }, []);

//     // Fetch chat history
//     const fetchChatHistory = useCallback(async () => {
//         if (!selectedSuperAdmin?._id) return;

//         try {
//             const response = await axios.get(`${server}/api/v1/chat/${selectedSuperAdmin._id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setMessages(response.data.data);
//         } catch (error) {
//             console.error('Error fetching chat history:', error);
//             toast.error('Failed to fetch chat history');
//         }
//     }, [server, selectedSuperAdmin, token]);

//     useEffect(() => {
//         if (selectedSuperAdmin) fetchChatHistory();
//     }, [selectedSuperAdmin, fetchChatHistory]);

//     // Mark messages as read
//     const markAsRead = useCallback(async (messageIds) => {
//         if (!socketRef.current || !messageIds.length) return;

//         try {
//             await axios.post(
//                 `${server}/api/v1/chat/mark-as-read`,
//                 { messageIds },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             socketRef.current.emit('markAsRead', {
//                 messageIds,
//                 senderId: currentUser._id,
//             });
//         } catch (error) {
//             console.error('Error marking messages as read:', error);
//             toast.error('Error marking messages as read');
//         }
//     }, [server, currentUser, token]);

//     // Delete a message
//     const deleteMessage = useCallback(async (messageId) => {
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
//     }, [server, token]);

//     // Edit a message
//     const editMessage = useCallback(
//         async (messageId) => {
//             if (!editedMessageText.trim()) {
//                 toast.error('Message cannot be empty');
//                 return;
//             }

//             try {
//                 socketRef.current.emit('editMessage', {
//                     messageId,
//                     newText: editedMessageText,
//                 });

//                 setEditingMessageId(null);
//                 setEditedMessageText('');
//                 toast.success('Message edited');
//             } catch (error) {
//                 console.error('Error editing message:', error);
//                 toast.error('Failed to edit message');
//             }
//         },
//         [editedMessageText]
//     );

//     // Add reaction to a message
//     const addReaction = useCallback(
//         (messageId, emoji) => {
//             socketRef.current.emit('addReaction', {
//                 messageId,
//                 emoji,
//                 senderId: currentUser._id,
//             });
//         },
//         [currentUser]
//     );

//     // Send a new message
//     const handleSendMessage = useCallback(() => {
//         if (!newMessage.trim() && !fileInputRef.current?.files?.length) return;

//         socketRef.current.emit('sendMessage', {
//             text: newMessage,
//             receiverId: selectedSuperAdmin._id,
//             senderId: currentUser.userId,
//         });

//         socketRef.current.emit('typing', {
//             receiverId: selectedSuperAdmin._id,
//             isTyping: false,
//         });

//         setNewMessage('');
//         clearTimeout(typingTimeoutRef.current);
//         if (fileInputRef.current) fileInputRef.current.value = '';
//     }, [newMessage, selectedSuperAdmin, currentUser]);

//     // Handle typing indicator
//     const handleTyping = useCallback(
//         (e) => {
//             const val = e.target.value;
//             setNewMessage(val);
//             const socket = socketRef.current;
//             if (!socket) return;

//             clearTimeout(typingTimeoutRef.current);
//             socket.emit('typing', {
//                 receiverId: selectedSuperAdmin._id,
//                 isTyping: val.length > 0,
//             });

//             typingTimeoutRef.current = setTimeout(() => {
//                 socket.emit('typing', {
//                     receiverId: selectedSuperAdmin._id,
//                     isTyping: false,
//                 });
//             }, 2000);
//         },
//         [selectedSuperAdmin]
//     );

//     // Handle key press for editing
//     const handleEditKeyPress = useCallback(
//         (e, messageId) => {
//             if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault();
//                 editMessage(messageId);
//             }
//         },
//         [editMessage]
//     );

//     // Handle key press for sending
//     const handleKeyPress = useCallback(
//         (e) => {
//             if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSendMessage();
//             }
//         },
//         [handleSendMessage]
//     );

//     // Auto-scroll to bottom of messages
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     // Close emoji picker when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (
//                 showEmojiPicker &&
//                 !e.target.closest('.emoji-picker-react') &&
//                 !e.target.closest('.btn-light')
//             ) {
//                 setShowEmojiPicker(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, [showEmojiPicker]);

//     // Filter messages based on search query
//     const filteredMessages = messages.filter((msg) =>
//         msg.text.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     // If no super admins available
//     if (!superAdmin || superAdmin.length === 0) {
//         return (
//             <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
//                 <div className="text-center p-4 bg-white shadow rounded">
//                     <i className="ti ti-user-off text-danger fs-1 mb-3"></i>
//                     <h5 className="text-dark">No Super Admin Available</h5>
//                     <p className="text-muted">Please try again later.</p>
//                 </div>
//             </div>
//         );
//     }

//     // If no super admin selected
//     if (!selectedSuperAdmin) {
//         return (
//             <div className="container-fluid position-relative" style={{ height: '100vh' }}>
//                 <div className="row h-100">
//                     {/* Left sidebar - Super admins list */}
//                     <div className="col-md-4 border-end overflow-auto">
//                         <div className="p-3">
//                             <h5 className="mb-3">💬 Select Super Admin</h5>
//                             <div className="list-group">
//                                 {superAdmin.map((admin) => (
//                                     <button
//                                         key={admin._id}
//                                         className="list-group-item list-group-item-action d-flex align-items-center"
//                                         onClick={() => setSelectedSuperAdmin(admin)}
//                                     >
//                                         <div className="me-3">
//                                             <span className={`badge rounded-circle ${admin.isOnline ? 'bg-success' : 'bg-secondary'}`} style={{ width: '10px', height: '10px' }}></span>
//                                         </div>
//                                         <div>
//                                             <div className="fw-bold">{admin.fullname}</div>
//                                             <small className="text-muted">{admin.role}</small>
//                                         </div>
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right side - Placeholder */}
//                     <div className="col-md-8 d-flex justify-content-center align-items-center">
//                         <div className="text-center text-muted">
//                             <i className="ti ti-message-circle fs-1 text-primary mb-3"></i>
//                             <h5>Select a Super Admin to start chatting</h5>
//                             <p>Choose a Super Admin from the list to begin your conversation</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container-fluid">
//             <div className="row" style={{ height: '100vh' }}>
//                 {/* Left sidebar - Super admins list */}
//                 <div className="col-md-4 border-end overflow-auto">
//                     <div className="p-3">
//                         <h5 className="mb-3">💬 Super Admins</h5>
//                         <div className="list-group">
//                             {superAdmin.map((admin) => (
//                                 <button
//                                     key={admin._id}
//                                     className={`list-group-item list-group-item-action d-flex align-items-center ${selectedSuperAdmin._id === admin._id ? 'active' : ''}`}
//                                     onClick={() => setSelectedSuperAdmin(admin)}
//                                 >
//                                     <div className="me-3">
//                                         <span className={`badge rounded-circle ${admin.isOnline ? 'bg-success' : 'bg-secondary'}`} style={{ width: '10px', height: '10px' }}></span>
//                                     </div>
//                                     <div>
//                                         <div className="fw-bold">{admin.fullname}</div>
//                                         <small className="text-muted">{admin.role}</small>
//                                     </div>
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right side - Chat area */}
//                 <div className="col-md-8 d-flex flex-column">
//                     {/* Chat header */}
//                     <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3 p-3">
//                         <h5 className="mb-0 text-primary">
//                             💬 Chat with {selectedSuperAdmin.fullname}
//                             {unreadCount > 0 && <span className="badge bg-danger ms-2">{unreadCount}</span>}
//                         </h5>
//                         <div className="d-flex align-items-center gap-2">
//                             <span
//                                 className={`badge rounded-circle ${isOnline && connectionStatus === 'connected' ? 'bg-success' : 'bg-secondary'}`}
//                                 style={{ width: '10px', height: '10px' }}
//                             ></span>
//                             <small
//                                 className={`text-${isOnline && connectionStatus === 'connected' ? 'success' : 'secondary'}`}
//                             >
//                                 {isTyping ? 'Typing...' : isOnline && connectionStatus === 'connected' ? 'Online' : 'Offline'}
//                             </small>
//                         </div>
//                     </div>

//                     {/* Search bar */}
//                     <div className="mb-3 px-3">
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Search messages..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                     </div>

//                     {/* Messages area */}
//                     <div className="flex-grow-1 overflow-auto px-2 mb-3">
//                         {filteredMessages.length === 0 ? (
//                             <div className="text-center text-muted py-5">
//                                 <i className="ti ti-message-circle fs-1 text-primary mb-2"></i>
//                                 <p className="mb-0">{searchQuery ? 'No messages found' : 'No messages yet. Say hello 👋'}</p>
//                             </div>
//                         ) : (
//                             filteredMessages.map((message) => (
//                                 <div
//                                     key={message._id}
//                                     className={`d-flex mb-3 ${message.sender._id === currentUser.userId ? 'justify-content-end' : 'justify-content-start'}`}
//                                 >
//                                     <div
//                                         className={`p-3 rounded-3 shadow-sm ${message.sender._id === currentUser.userId ? 'bg-primary text-white' : 'bg-light text-dark'}`}
//                                         style={{ maxWidth: '75%', position: 'relative' }}
//                                     >
//                                         {message.fileUrl && (
//                                             <img
//                                                 src={message.fileUrl}
//                                                 alt="attachment"
//                                                 className="img-fluid rounded mb-2"
//                                                 style={{ maxWidth: '200px' }}
//                                             />
//                                         )}
//                                         <p className="mb-2 text-break" style={{ whiteSpace: 'pre-wrap' }}>
//                                             {message.text}
//                                             {message.edited && <small className="text-muted ms-1">(edited)</small>}
//                                         </p>
//                                         {message?.reactions?.length > 0 && (
//                                             <div className="d-flex gap-1 flex-wrap">
//                                                 {message.reactions.map((reaction, index) => (
//                                                     <span key={index} className="badge bg-secondary">
//                                                         {reaction.emoji}
//                                                     </span>
//                                                 ))}
//                                             </div>
//                                         )}
//                                         <div className="d-flex justify-content-between align-items-center small">
//                                             <span className="text-muted">
//                                                 {new Date(message.createdAt).toLocaleString([], {
//                                                     dateStyle: 'short',
//                                                     timeStyle: 'short',
//                                                 })}
//                                             </span>
//                                             {message.sender._id === currentUser.userId && (
//                                                 <div className="d-flex gap-1">
//                                                     <i
//                                                         className={`ti ${message.status === 'read' ? 'ti-checks' : 'ti-check'} text-${message.sender._id === currentUser.userId ? 'white' : 'muted'} ms-2`}
//                                                     ></i>
//                                                     <button
//                                                         className="btn btn-sm btn-link p-0 text-white"
//                                                         onClick={() => {
//                                                             setEditingMessageId(message._id);
//                                                             setEditedMessageText(message.text);
//                                                         }}
//                                                         title="Edit"
//                                                     >
//                                                         <i className="ti ti-edit"></i>
//                                                     </button>
//                                                     <button
//                                                         className="btn btn-sm btn-link p-0 text-white"
//                                                         onClick={() => deleteMessage(message._id)}
//                                                         title="Delete"
//                                                     >
//                                                         <i className="ti ti-trash"></i>
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </div>
//                                         {editingMessageId === message._id && (
//                                             <div className="mt-2">
//                                                 <input
//                                                     type="text"
//                                                     className="form-control form-control-sm"
//                                                     value={editedMessageText}
//                                                     onChange={(e) => setEditedMessageText(e.target.value)}
//                                                     onKeyDown={(e) => handleEditKeyPress(e, message._id)}
//                                                     placeholder="Edit message..."
//                                                 />
//                                                 <div className="d-flex gap-2 mt-1">
//                                                     <button
//                                                         className="btn btn-sm btn-primary"
//                                                         onClick={() => editMessage(message._id)}
//                                                     >
//                                                         Save
//                                                     </button>
//                                                     <button
//                                                         className="btn btn-sm btn-secondary"
//                                                         onClick={() => setEditingMessageId(null)}
//                                                     >
//                                                         Cancel
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         )}
//                                         <div className="d-flex gap-1 mt-1">
//                                             <button
//                                                 className="btn btn-sm btn-link p-0"
//                                                 onClick={() => addReaction(message._id, '👍')}
//                                             >
//                                                 👍
//                                             </button>
//                                             <button
//                                                 className="btn btn-sm btn-link p-0"
//                                                 onClick={() => addReaction(message._id, '❤️')}
//                                             >
//                                                 ❤️
//                                             </button>
//                                             <button
//                                                 className="btn btn-sm btn-link p-0"
//                                                 onClick={() => addReaction(message._id, '😊')}
//                                             >
//                                                 😊
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                         <div ref={messagesEndRef} />
//                     </div>

//                     {/* Message input area */}
//                     <div className="border-top pt-3 d-flex align-items-center gap-2 position-relative p-3">
//                         <input
//                             type="text"
//                             className="form-control"
//                             value={newMessage}
//                             onChange={handleTyping}
//                             onKeyDown={handleKeyPress}
//                             placeholder="Type a message..."
//                             // disabled={connectionStatus !== 'connected'}
//                         />
//                         <button
//                             className="btn btn-light"
//                             onClick={() => setShowEmojiPicker((prev) => !prev)}
//                             disabled={connectionStatus !== 'connected'}
//                         >
//                             😊
//                         </button>
//                         <button
//                             className="btn btn-light"
//                             onClick={() => fileInputRef.current.click()}
//                             disabled={connectionStatus !== 'connected'}
//                         >
//                             📎
//                         </button>
//                         <input
//                             type="file"
//                             ref={fileInputRef}
//                             style={{ display: 'none' }}
//                             accept="image/*"
//                             onChange={handleFileUpload}
//                         />
//                         <button
//                             className="btn btn-primary rounded-circle"
//                             onClick={handleSendMessage}
//                             title="Send"
//                             disabled={connectionStatus !== 'connected'}
//                         >
//                             <i className="ti ti-send"></i>
//                         </button>
//                         {showEmojiPicker && (
//                             <div
//                                 style={{
//                                     position: 'absolute',
//                                     bottom: '60px',
//                                     right: '60px',
//                                     zIndex: 9999,
//                                     backgroundColor: 'white',
//                                     borderRadius: '10px',
//                                     boxShadow: '0 0 10px rgba(0,0,0,0.2)',
//                                 }}
//                             >
//                                 <EmojiPicker
//                                     onEmojiClick={(_, emojiData) => addEmoji(emojiData)}
//                                     lazyLoadEmojis={true}
//                                     searchDisabled={false}
//                                     skinTonesDisabled={false}
//                                     previewConfig={{ showPreview: false }}
//                                     categories={[
//                                         { category: 'smileys_people', name: 'Smileys & People' },
//                                         { category: 'flags', name: 'Flags' },
//                                         { category: 'animals_nature', name: 'Animals & Nature' },
//                                     ]}
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CompanyChatWithSuperAdmin;














// import { useState, useEffect, useRef } from 'react';
// import { useAuthContext } from '../../../context/auth-context';
// const mockUsers = [
//     { id: 1, fullname: 'Alex Johnson', lastMessage: 'See you tomorrow!', unread: 2, online: true },
//     { id: 2, fullname: 'Sarah Williams', lastMessage: 'Thanks for your help!', unread: 0, online: true },
//     { id: 3, fullname: 'Mich ael Chen', lastMessage: 'Did you see the report?', unread: 5, online: false },
//     { id: 4, fullname: 'Emma Thompson', lastMessage: 'The meeting is at 3 PM', unread: 0, online: true },
//     { id: 5, fullname: 'James Wilson', lastMessage: 'Can we reschedule?', unread: 1, online: false },
//     { id: 6, fullname: 'Olivia Davis', lastMessage: 'I sent you the files', unread: 0, online: true },
//     { id: 7, fullname: 'Olivia Davis', lastMessage: 'I sent you the files', unread: 0, online: true },
//     { id: 8, fullname: 'Olivia Davis', lastMessage: 'I sent you the files', unread: 0, online: true },
// ];
// const mockMessages = {
//     1: [
//         { id: 1, text: 'Hey there! How are you?', sender: 'other', time: '10:30 AM' },
//         { id: 2, text: 'I\'m good, thanks! How about you?', sender: 'me', time: '10:32 AM' },
//         { id: 3, text: 'Doing great! Are we still meeting tomorrow?', sender: 'other', time: '10:35 AM' },
//         { id: 4, text: 'Yes, absolutely! 2 PM at the usual place.', sender: 'me', time: '10:36 AM' },
//         { id: 5, text: 'Perfect! See you tomorrow!', sender: 'other', time: '10:40 AM' },
//     ],
//     2: [
//         { id: 1, text: 'Hi, I need your help with the project', sender: 'other', time: '9:15 AM' },
//         { id: 2, text: 'Sure, what do you need?', sender: 'me', time: '9:20 AM' },
//         { id: 3, text: 'Can you review the design documents?', sender: 'other', time: '9:22 AM' },
//         { id: 4, text: 'I\'ll take a look and get back to you', sender: 'me', time: '9:25 AM' },
//         { id: 5, text: 'Thanks for your help!', sender: 'other', time: '11:45 AM' },
//     ],
//     3: [
//         { id: 1, text: 'Morning! Did you see the report I sent?', sender: 'other', time: '8:45 AM' },
//         { id: 2, text: 'Not yet, I\'ll check it now', sender: 'me', time: '8:50 AM' },
//         { id: 3, text: 'Let me know your thoughts when you\'re done', sender: 'other', time: '8:52 AM' },
//     ],
//     4: [
//         { id: 1, text: 'The meeting today is at 3 PM', sender: 'other', time: 'Yesterday' },
//         { id: 2, text: 'Got it, I\'ll be there', sender: 'me', time: 'Yesterday' },
//     ],
//     5: [
//         { id: 1, text: 'Hi, can we reschedule our meeting?', sender: 'other', time: 'Yesterday' },
//         { id: 2, text: 'Sure, when works for you?', sender: 'me', time: 'Yesterday' },
//     ],
//     6: [
//         { id: 1, text: 'I sent you the files you requested', sender: 'other', time: '2 days ago' },
//         { id: 2, text: 'Received, thanks!', sender: 'me', time: '2 days ago' },
//     ],
// };
// const CompanyChatWithSuperAdmin = () => {
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [showSidebar, setShowSidebar] = useState(true);
//     const [searchQuery, setSearchQuery] = useState('');
//     const { user, loading, getAllUsers, allUsers } = useAuthContext()
//     const [users, setUsers] = useState(allUsers);

//     useEffect(() => {
//         if (user) {
//             getAllUsers(user?.role)
//         }  
//     }, [])

//     // Create a ref for the messages container
//     const messagesEndRef = useRef(null);

//     // Filter users based on search query
//     const filteredUsers = users.filter(user =>
//         user?.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     // Set initial selected user
//     useEffect(() => {
//         if (filteredUsers.length > 0 && !selectedUser) {
//             setSelectedUser(filteredUsers[0]);
//         } else if (filteredUsers.length === 0) {
//             setSelectedUser(null);
//         }
//     }, [filteredUsers, selectedUser]);

//     // Load messages when user is selected
//     useEffect(() => {
//         if (selectedUser) {
//             setMessages(mockMessages[selectedUser.id] || []);
//         }
//     }, [selectedUser]);

//     // Scroll to bottom of messages
//     useEffect(() => {
//         scrollToBottom();
//     }, [messages, selectedUser]);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };

//     // Handle window resize to adjust sidebar visibility
//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth < 768) {
//                 setShowSidebar(false);
//             } else {
//                 setShowSidebar(true);
//             }
//         };

//         // Initial check
//         handleResize();

//         // Add event listener
//         window.addEventListener('resize', handleResize);

//         // Cleanup
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     const handleSendMessage = () => {
//         if (newMessage.trim() === '') return;

//         const newMsg = {
//             id: messages.length + 1,
//             text: newMessage,
//             sender: 'me',
//             time: 'Just now'
//         };

//         setMessages([...messages, newMsg]);
//         setNewMessage('');

//         // Update last message in user list
//         const updatedUsers = users.map(user =>
//             user.id === selectedUser.id
//                 ? { ...user, lastMessage: newMessage, unread: 0 }
//                 : user
//         );
//         setUsers(updatedUsers);
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     };

//     const handleUserSelect = (user) => {
//         setSelectedUser(user);
//         if (window.innerWidth < 768) {
//             setShowSidebar(false);
//         }
//     };

//     const handleBackToUsers = () => {
//         setShowSidebar(true);
//     };

//     const handleClearSearch = () => {
//         setSearchQuery('');
//     };

//     return (
//         <div className="container-fluid">
//             <div className="container">
//                 <div className="chat-container">
//                     <div className="chat-layout">
//                         {/* Sidebar */}
//                         <div className={`sidebar ${showSidebar ? 'show' : 'hide'}`}>
//                             <div className="sidebar-header">
//                                 <div className="d-flex justify-content-between align-items-center">
//                                     <h1 className="h3 mb-0 text-primary">ChatApp</h1>
//                                     <button
//                                         className="btn btn-sm btn-light d-md-none"
//                                         onClick={() => setShowSidebar(false)}
//                                     >
//                                         <i className="bi bi-arrow-right"></i>
//                                     </button>
//                                 </div>
//                                 <div className="position-relative mt-3">
//                                     <input
//                                         type="text"
//                                         placeholder="Search users..."
//                                         className="form-control ps-5"
//                                         value={searchQuery}
//                                         onChange={(e) => setSearchQuery(e.target.value)}
//                                     />
//                                     <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
//                                     {searchQuery && (
//                                         <button
//                                             className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 text-muted"
//                                             onClick={handleClearSearch}
//                                         >
//                                             <i className="bi bi-x-lg"></i>
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="sidebar-content">
//                                 <h6 className="px-3 py-2 text-muted text-uppercase small fw-bold">Recent Chats</h6>
//                                 {filteredUsers.length > 0 ? (
//                                     filteredUsers.map(user => (
//                                         <div
//                                             key={user.id}
//                                             className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
//                                             onClick={() => handleUserSelect(user)}
//                                         >
//                                             <div className="position-relative flex-shrink-0">
//                                                 <div className="user-avatar">
//                                                     {user.fullname.charAt(0)}
//                                                 </div>
//                                                 {user.online && (
//                                                     <div className="online-indicator"></div>
//                                                 )}
//                                             </div>
//                                             <div className="user-info">
//                                                 <div className="d-flex justify-content-between">
//                                                     <h6 className="mb-0 fw-semibold text-truncate">{user.fullname}</h6>
//                                                     <small className="text-muted flex-shrink-0 ms-2">Yesterday</small>
//                                                 </div>
//                                                 <div className="d-flex justify-content-between">
//                                                     <p className="mb-0 text-muted small text-truncate">
//                                                         {user.lastMessage}
//                                                     </p>
//                                                     {user.unread > 0 && (
//                                                         <span className="unread-badge">
//                                                             {user.unread}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <div className="text-center py-4 text-muted">
//                                         <i className="bi bi-person-x fs-1"></i>
//                                         <p className="mt-2">No users found</p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                         {/* Main Chat Area */}
//                         <div className={`main-chat ${showSidebar ? 'hide' : 'show'}`}>
//                             {selectedUser ? (
//                                 <>
//                                     {/* Chat Header */}
//                                     <div className="chat-header">
//                                         <button
//                                             className="btn btn-sm btn-light d-md-none me-2"
//                                             onClick={handleBackToUsers}
//                                         >
//                                             <i className="bi bi-arrow-left"></i>
//                                         </button>
//                                         <div className="position-relative flex-shrink-0">
//                                             <div className="user-avatar">
//                                                 {selectedUser.fullname.charAt(0)}
//                                             </div>
//                                             {selectedUser.online && (
//                                                 <div className="online-indicator"></div>
//                                             )}
//                                         </div>
//                                         <div className="user-details">
//                                             <h5 className="mb-0 fw-semibold text-truncate">{selectedUser.fullname}</h5>
//                                             <p className="mb-0 text-muted small">
//                                                 {selectedUser.online ? 'Online' : 'Offline'}
//                                             </p>
//                                         </div>
//                                         <div className="header-actions">
//                                             <button className="btn btn-sm btn-light rounded-circle">
//                                                 <i className="bi bi-telephone"></i>
//                                             </button>
//                                             <button className="btn btn-sm btn-light rounded-circle">
//                                                 <i className="bi bi-search"></i>
//                                             </button>
//                                             <button className="btn btn-sm btn-light rounded-circle d-none d-sm-inline-block">
//                                                 <i className="bi bi-three-dots-vertical"></i>
//                                             </button>
//                                         </div>
//                                     </div>
//                                     {/* Messages Area */}
//                                     <div className="messages-area">
//                                         <div className="messages-container">
//                                             {messages.map(message => (
//                                                 <div
//                                                     key={message.id}
//                                                     className={`message ${message.sender === 'me' ? 'sent' : 'received'}`}
//                                                 >
//                                                     <div className="message-content">
//                                                         <p className="mb-1">{message.text}</p>
//                                                         <div className="message-time">
//                                                             {message.time}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                             {/* Empty div to scroll to */}
//                                             <div ref={messagesEndRef} />
//                                         </div>
//                                     </div>
//                                     {/* Message Input */}
//                                     <div className="message-input-container">
//                                         <div className="input-actions">
//                                             <button className="btn btn-sm btn-light text-muted">
//                                                 <i className="bi bi-paperclip fs-5"></i>
//                                             </button>
//                                         </div>
//                                         <div className="input-area">
//                                             <textarea
//                                                 className="form-control"
//                                                 placeholder="Type a message..."
//                                                 rows={1}
//                                                 value={newMessage}
//                                                 onChange={(e) => setNewMessage(e.target.value)}
//                                                 onKeyPress={handleKeyPress}
//                                             />
//                                         </div>
//                                         <div className="send-button">
//                                             <button
//                                                 className="btn btn-primary rounded-circle"
//                                                 onClick={handleSendMessage}
//                                             >
//                                                 <i className="bi bi-send-fill"></i>
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <div className="empty-chat">
//                                     <div className="empty-chat-content">
//                                         <div className="empty-chat-icon">
//                                             <i className="bi bi-chat-dots fs-1"></i>
//                                         </div>
//                                         <h4 className="fw-semibold text-secondary">Select a chat to start messaging</h4>
//                                         <p className="text-muted">Choose a user from the list to begin your conversation</p>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     <style>
//                         {`
//                 .chat-container {
//                     position: relative;
//                     display: flex;
//                     flex-direction: column;
//                     height: 85vh; /* Fixed height for the chat container */
//                     overflow: hidden; /* Prevent container from scrolling */
//                 }
//                 .chat-layout {
//                     display: flex;
//                     flex-direction: row;
//                     height: 100%; /* Take full height of parent */
//                     overflow: hidden; /* Prevent layout from scrolling */
//                 }
//                 .sidebar {
//                     width: 100%;
//                     max-width: 300px;
//                     background-color: white;
//                     border-right: 1px solid #dee2e6;
//                     display: flex;
//                     flex-direction: column;
//                     transition: transform 0.3s ease;
//                     height: 100%; /* Take full height of parent */
//                     overflow: hidden; /* Prevent sidebar from scrolling */
//                 }
//                 .sidebar-header {
//                     padding: 1rem;
//                     border-bottom: 1px solid #dee2e6;
//                     flex-shrink: 0; /* Prevent header from shrinking */
//                 }
//                 .sidebar-content {
//                     flex-grow: 1;
//                     overflow-y: auto; /* Only sidebar content scrolls */
//                 }
//                 .user-item {
//                     display: flex;
//                     align-items: center;
//                     padding: 0.75rem 1rem;
//                     border-bottom: 1px solid #dee2e6;
//                     cursor: pointer;
//                     transition: background-color 0.2s;
//                 }
//                 .user-item:hover {
//                     background-color: rgba(0, 0, 0, 0.03);
//                 }
//                 .user-item.active {
//                     background-color: rgba(0, 123, 255, 0.1);
//                 }
//                 .user-avatar {
//                     width: 48px;
//                     height: 48px;
//                     border-radius: 50%;
//                     background-color: rgba(0, 123, 255, 0.1);
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     color: #0d6efd;
//                     font-weight: 600;
//                 }
//                 .online-indicator {
//                     position: absolute;
//                     bottom: 0;
//                     right: 0;
//                     width: 12px;
//                     height: 12px;
//                     background-color: #198754;
//                     border-radius: 50%;
//                     border: 2px solid white;
//                 }
//                 .user-info {
//                     margin-left: 0.75rem;
//                     flex-grow: 1;
//                     min-width: 0;
//                 }
//                 .unread-badge {
//                     background-color: #0d6efd;
//                     color: white;
//                     border-radius: 50%;
//                     width: 20px;
//                     height: 20px;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     font-size: 0.75rem;
//                     flex-shrink: 0;
//                 }
//                 .main-chat {
//                     flex-grow: 1;
//                     display: flex;
//                     flex-direction: column;
//                     background-color: #f8f9fa;
//                     position: relative;
//                     height: 100%; /* Take full height of parent */
//                     overflow: hidden; /* Prevent main chat from scrolling */
//                 }
//                 .chat-header {
//                     background-color: white;
//                     padding: 0.75rem 1rem;
//                     border-bottom: 1px solid #dee2e6;
//                     display: flex;
//                     align-items: center;
//                     flex-shrink: 0; /* Prevent header from shrinking */
//                 }
//                 .user-details {
//                     margin-left: 0.75rem;
//                     min-width: 0;
//                 }
//                 .header-actions {
//                     margin-left: auto;
//                     display: flex;
//                     gap: 0.5rem;
//                 }
//                 .messages-area {
//                     flex-grow: 1;
//                     overflow-y: auto; /* Only messages area scrolls */
//                     padding: 1rem;
//                     padding-bottom: 80px; /* Space for the input container */
//                 }
//                 .messages-container {
//                     display: flex;
//                     flex-direction: column;
//                     gap: 1rem;
//                 }
//                 .message {
//                     display: flex;
//                 }
//                 .message.sent {
//                     justify-content: flex-end;
//                 }
//                 .message.received {
//                     justify-content: flex-start;
//                 }
//                 .message-content {
//                     max-width: 75%;
//                     padding: 0.5rem 0.75rem;
//                     border-radius: 1rem;
//                 }
//                 .message.sent .message-content {
//                     background-color: #0d6efd;
//                     color: white;
//                 }
//                 .message.received .message-content {
//                     background-color: white;
//                     color: #212529;
//                     border: 1px solid #dee2e6;
//                 }
//                 .message-time {
//                     font-size: 0.75rem;
//                     text-align: right;
//                 }
//                 .message.sent .message-time {
//                     color: rgba(255, 255, 255, 0.7);
//                 }
//                 .message.received .message-time {
//                     color: #6c757d;
//                 }
//                 .message-input-container {
//                     position: absolute;
//                     bottom: 0;
//                     left: 0;
//                     right: 0;
//                     background-color: white;
//                     border-top: 1px solid #dee2e6;
//                     padding: 0.75rem;
//                     display: flex;
//                     align-items: flex-end;
//                     z-index: 10;
//                     flex-shrink: 0; /* Prevent input from shrinking */
//                 }
//                 .input-actions {
//                     margin-right: 0.5rem;
//                 }
//                 .input-area {
//                     flex-grow: 1;
//                 }
//                 .send-button {
//                     margin-left: 0.5rem;
//                 }
//                 .empty-chat {
//                     flex-grow: 1;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                 }
//                 .empty-chat-content {
//                     text-align: center;
//                     padding: 2rem;
//                 }
//                 .empty-chat-icon {
//                     width: 96px;
//                     height: 96px;
//                     border-radius: 50%;
//                     background-color: rgba(0, 123, 255, 0.1);
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     color: #0d6efd;
//                     margin: 0 auto 1rem;
//                 }
//                 /* Responsive classes */
//                 @media (min-width: 768px) {
//                     .sidebar {
//                         width: 33.333333%;
//                         max-width: none;
//                     }
//                     .sidebar.hide {
//                         display: flex;
//                     }
//                     .main-chat.hide {
//                         display: flex;
//                     }
//                 }
//                 @media (max-width: 767.98px) {
//                     .sidebar.hide {
//                         transform: translateX(-100%);
//                         position: absolute;
//                         z-index: 10;
//                         height: 100%;
//                     }
//                     .main-chat.show {
//                         display: flex;
//                     }
//                     .main-chat.hide {
//                         display: none;
//                     }
//                 }
//                 `}
//                     </style>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default CompanyChatWithSuperAdmin;

























import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../../context/auth-context';

const CompanyChatWithSuperAdmin = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, loading, getAllUsers, allUsers, getMessages, sendMessage } = useAuthContext();
    const [users, setUsers] = useState([]);

    // Create a ref for the messages container
    const messagesEndRef = useRef(null);

    // Initialize users from context
    useEffect(() => {
        if (user) {
            getAllUsers(user?.role);
        }
    }, [user]);

    // Update users state when allUsers changes
    useEffect(() => {
        if (allUsers && allUsers.length > 0) {
            // Transform allUsers to match the structure we need
            const transformedUsers = allUsers.map(u => ({
                id: u._id, // Use _id instead of id
                fullname: u.profile?.fullname || u.email, // Get fullname from profile or fallback to email
                email: u.email,
                lastMessage: 'No messages yet', // Default message
                unread: 0, // Default unread count
                online: false, // Default online status
                profilePicture: u.profile?.profilePicture || null // Store profile picture URL
            }));
            setUsers(transformedUsers);
        }
    }, [allUsers]);

    // Filter users based on search query
    const filteredUsers = users.filter(user =>
        user?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
            // Fetch real messages for the selected user
            const fetchMessages = async () => {
                try {
                    const messagesData = await getMessages(selectedUser.id);
                    setMessages(messagesData || []);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                    setMessages([]);
                }
            };

            fetchMessages();
        }
    }, [selectedUser, getMessages]);

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

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        const messageData = {
            text: newMessage,
            receiverId: selectedUser.id,
            time: new Date().toISOString()
        };

        try {
            // Send message through context
            const sentMessage = await sendMessage(messageData);

            // Update messages with the sent message
            setMessages([...messages, {
                id: sentMessage.id || messages.length + 1,
                text: newMessage,
                sender: 'me',
                time: 'Just now'
            }]);

            setNewMessage('');

            // Update last message in user list
            const updatedUsers = users.map(user =>
                user.id === selectedUser.id
                    ? { ...user, lastMessage: newMessage, unread: 0 }
                    : user
            );
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error sending message:', error);
        }
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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '85vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

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
                                                    {user.profilePicture ? (
                                                        <img
                                                            src={user.profilePicture}
                                                            alt={user.fullname}
                                                            className="rounded-circle w-100 h-100 object-fit-cover"
                                                        />
                                                    ) : (
                                                        user.fullname.charAt(0)
                                                    )}
                                                </div>
                                                {user.online && (
                                                    <div className="online-indicator"></div>
                                                )}
                                            </div>
                                            <div className="user-info">
                                                <div className="d-flex justify-content-between">
                                                    <h6 className="mb-0 fw-semibold text-truncate">{user.fullname}</h6>
                                                    <small className="text-muted flex-shrink-0 ms-2">
                                                        {user.lastMessageTime || 'Yesterday'}
                                                    </small>
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
                                                {selectedUser.profilePicture ? (
                                                    <img
                                                        src={selectedUser.profilePicture}
                                                        alt={selectedUser.fullname}
                                                        className="rounded-circle w-100 h-100 object-fit-cover"
                                                    />
                                                ) : (
                                                    selectedUser.fullname.charAt(0)
                                                )}
                                            </div>
                                            {selectedUser.online && (
                                                <div className="online-indicator"></div>
                                            )}
                                        </div>
                                        <div className="user-details">
                                            <h5 className="mb-0 fw-semibold text-truncate">{selectedUser.fullname}</h5>
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
                                            {messages.length > 0 ? (
                                                messages.map(message => (
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
                                                ))
                                            ) : (
                                                <div className="text-center py-5 text-muted">
                                                    <p>No messages yet. Start a conversation!</p>
                                                </div>
                                            )}
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
                    overflow: hidden;
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

export default CompanyChatWithSuperAdmin;
