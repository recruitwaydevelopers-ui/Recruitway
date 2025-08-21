// import { useEffect, useState } from 'react';
// import CodeMirror from '@uiw/react-codemirror';

// // Language Extensions
// import { javascript } from '@codemirror/lang-javascript';
// import { python } from '@codemirror/lang-python';
// import { cpp } from '@codemirror/lang-cpp';

// // Themes
// import { dracula } from '@uiw/codemirror-theme-dracula';
// import { githubLight } from '@uiw/codemirror-theme-github';


// function EditorPage({ roomId, onShowReport, isInterviewer, setUsers, socket, userId, userName: name }) {
//   const [code, setCode] = useState('');
//   const [task, setTask] = useState('');
//   const [language, setLanguage] = useState('javascript');
//   const [theme, setTheme] = useState('dark');
//   const [fontSize, setFontSize] = useState(16);
//   const [isEvaluating, setIsEvaluating] = useState(false);

//   const getLanguageExtension = () => {
//     switch (language) {
//       case 'python': return [python()];
//       case 'cpp': return [cpp()];
//       default: return [javascript()];
//     }
//   };

//   const getThemeExtension = () => (theme === 'dark' ? dracula : githubLight);

//   useEffect(() => {
//     socket.emit('join-room', { name, roomId });

//     // Handle initial state and all real-time updates
//     socket.on('init-state', (state) => {
//       setCode(state.code);
//       setTask(state.task);
//       setLanguage(state.language);
//       setTheme(state.theme);
//       setFontSize(state.fontSize);
//     });

//     socket.on('code-update', (newCode) => setCode(newCode));
//     socket.on('task-update', (newTask) => setTask(newTask));
//     socket.on('language-update', (newLanguage) => setLanguage(newLanguage));
//     socket.on('theme-update', (newTheme) => setTheme(newTheme));
//     socket.on('fontSize-update', (newFontSize) => setFontSize(newFontSize));

//     return () => {
//       socket.off('init-state');
//       socket.off('code-update');
//       socket.off('task-update');
//       socket.off('language-update');
//       socket.off('theme-update');
//       socket.off('fontSize-update');
//     };
//   }, [roomId, name,socket]);

//   const handleCodeChange = (value) => {
//     setCode(value);
//     socket.emit('code-change', { roomId, code: value });
//   };

//   const handleTaskChange = (e) => {
//     const newTask = e.target.value;
//     setTask(newTask);
//     socket.emit('task-change', { roomId, task: newTask });
//   };

//   const handleLanguageChange = (e) => {
//     const selectedLanguage = e.target.value;
//     setLanguage(selectedLanguage);
//     socket.emit('language-change', { roomId, language: selectedLanguage });
//   };

//   const handleThemeChange = (e) => {
//     const selectedTheme = e.target.value;
//     setTheme(selectedTheme);
//     socket.emit('theme-change', { roomId, theme: selectedTheme });
//   };

//   const handleFontSizeChange = (e) => {
//     const size = Number(e.target.value);
//     setFontSize(size);
//     socket.emit('fontSize-change', { roomId, fontSize: size });
//   };

//   const handleSubmit = async () => {
//     if (!code.trim()) return;

//     setIsEvaluating(true);
//     try {
//       // await onEvaluateCode();
//     } catch (error) {
//       console.error('Evaluation error:', error);
//     } finally {
//       setIsEvaluating(false);
//     }
//   }

//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       padding: '10px',
//       backgroundColor: theme === 'dark' ? '#282c34' : '#f5f5f5'
//     }}>

//       <div className="editor-header">
//         <h3>Collaborative Code Editor</h3>
//         <div className="header-actions">
//           <button
//             onClick={handleSubmit}
//             className="submit-button"
//             disabled={isEvaluating || !code.trim()}
//           >
//             {isEvaluating ? 'Evaluating...' : 'Submit Code'}
//           </button>
//           {isInterviewer && (
//             <button
//               onClick={onShowReport}
//               className="report-button"
//             >
//               Report Form
//             </button>
//           )}
//         </div>
//       </div>
//       {/* Task Section - Now updates in real-time */}
//       <div style={{
//         marginBottom: '15px',
//         padding: '15px',
//         background: theme === 'dark' ? '#2d333b' : '#fff3cd',
//         borderRadius: '8px'
//       }}>
//         <label style={{
//           fontWeight: 'bold',
//           display: 'block',
//           marginBottom: '8px',
//           color: theme === 'dark' ? '#f0f0f0' : '#333'
//         }}>
//           Task Description:
//         </label>
//         <textarea
//           value={task}
//           onChange={handleTaskChange}
//           rows={3}
//           style={{
//             width: '100%',
//             padding: '10px',
//             borderRadius: '6px',
//             border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
//             backgroundColor: theme === 'dark' ? '#1e2227' : 'white',
//             color: theme === 'dark' ? '#f0f0f0' : '#333',
//             fontSize: `${fontSize}px`
//           }}
//           placeholder="Write the task here..."
//         />
//       </div>

//       {/* Toolbar */}
//       <div style={{
//         marginBottom: '15px',
//         padding: '15px',
//         background: theme === 'dark' ? '#2d333b' : '#f0f0f0',
//         borderRadius: '8px',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '20px',
//         flexWrap: 'wrap'
//       }}>
//         <div style={{ flex: 1, color: theme === 'dark' ? '#f0f0f0' : '#333' }}>
//           <strong>Room:</strong> {roomId} | <strong>User:</strong> {name}
//         </div>

//         <div>
//           <label style={{ marginRight: '5px', color: theme === 'dark' ? '#f0f0f0' : '#333' }}>Language: </label>
//           <select
//             value={language}
//             onChange={handleLanguageChange}
//             style={{
//               padding: '5px',
//               borderRadius: '4px',
//               border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
//               backgroundColor: theme === 'dark' ? '#1e2227' : 'white',
//               color: theme === 'dark' ? '#f0f0f0' : '#333'
//             }}
//           >
//             <option value="javascript">JavaScript</option>
//             <option value="python">Python</option>
//             <option value="cpp">C++</option>
//           </select>
//         </div>

//         <div>
//           <label style={{ marginRight: '5px', color: theme === 'dark' ? '#f0f0f0' : '#333' }}>Theme: </label>
//           <select
//             value={theme}
//             onChange={handleThemeChange}
//             style={{
//               padding: '5px',
//               borderRadius: '4px',
//               border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
//               backgroundColor: theme === 'dark' ? '#1e2227' : 'white',
//               color: theme === 'dark' ? '#f0f0f0' : '#333'
//             }}
//           >
//             <option value="light">Light</option>
//             <option value="dark">Dark</option>
//           </select>
//         </div>

//         <div>
//           <label style={{ marginRight: '5px', color: theme === 'dark' ? '#f0f0f0' : '#333' }}>Font Size: </label>
//           <input
//             type="number"
//             value={fontSize}
//             min="10"
//             max="30"
//             onChange={handleFontSizeChange}
//             style={{
//               width: '60px',
//               padding: '5px',
//               borderRadius: '4px',
//               border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
//               backgroundColor: theme === 'dark' ? '#1e2227' : 'white',
//               color: theme === 'dark' ? '#f0f0f0' : '#333'
//             }}
//           />
//         </div>
//       </div>

//       {/* Code Editor */}
//       <div style={{
//         flex: 1,
//         border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
//         borderRadius: '8px',
//         overflow: 'hidden'
//       }}>
//         <CodeMirror
//           value={code}
//           height="100%"
//           extensions={getLanguageExtension()}
//           theme={getThemeExtension()}
//           onChange={handleCodeChange}
//           style={{ fontSize: `${fontSize}px` }}
//         />
//       </div>
//     </div>
//   );
// }

// export default EditorPage;
















// import { useEffect, useState } from 'react';
// import CodeMirror from '@uiw/react-codemirror';

// // Language Extensions
// import { javascript } from '@codemirror/lang-javascript';
// import { python } from '@codemirror/lang-python';
// import { cpp } from '@codemirror/lang-cpp';

// // Themes
// import { dracula } from '@uiw/codemirror-theme-dracula';
// import { githubLight } from '@uiw/codemirror-theme-github';
// import { io } from "socket.io-client";
// import { useAuthContext } from '../../../context/auth-context';


// function EditorPage({ roomId, onShowReport, isInterviewer, setUsers, userId, userName: name }) {
//   const [code, setCode] = useState('');
//   const [task, setTask] = useState('');
//   const [language, setLanguage] = useState('javascript');
//   const [theme, setTheme] = useState('dark');
//   const [fontSize, setFontSize] = useState(16);
//   const [isEvaluating, setIsEvaluating] = useState(false);
//   const { server, token } = useAuthContext();

//   const getLanguageExtension = () => {
//     switch (language) {
//       case 'python': return [python()];
//       case 'cpp': return [cpp()];
//       default: return [javascript()];
//     }
//   };

//   const socket = io(server, {
//     auth: { token },
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000,
//   });

//   const getThemeExtension = () => (theme === 'dark' ? dracula : githubLight);

//   useEffect(() => {
//     socket.emit('join-room', { name, roomId });

//     // Handle initial state and all real-time updates
//     socket.on('init-state', (state) => {
//       setCode(state.code);
//       setTask(state.task);
//       setLanguage(state.language);
//       setTheme(state.theme);
//       setFontSize(state.fontSize);
//     });

//     socket.on('code-update', (newCode) => setCode(newCode));
//     socket.on('task-update', (newTask) => setTask(newTask));
//     socket.on('language-update', (newLanguage) => setLanguage(newLanguage));
//     socket.on('theme-update', (newTheme) => setTheme(newTheme));
//     socket.on('fontSize-update', (newFontSize) => setFontSize(newFontSize));

//     return () => {
//       socket.off('init-state');
//       socket.off('code-update');
//       socket.off('task-update');
//       socket.off('language-update');
//       socket.off('theme-update');
//       socket.off('fontSize-update');
//     };
//   }, [roomId, name, socket]);

//   const handleCodeChange = (value) => {
//     setCode(value);
//     socket.emit('code-change', { roomId, code: value });
//   };

//   const handleTaskChange = (e) => {
//     const newTask = e.target.value;
//     setTask(newTask);
//     socket.emit('task-change', { roomId, task: newTask });
//   };

//   const handleLanguageChange = (e) => {
//     const selectedLanguage = e.target.value;
//     setLanguage(selectedLanguage);
//     socket.emit('language-change', { roomId, language: selectedLanguage });
//   };

//   const handleThemeChange = (e) => {
//     const selectedTheme = e.target.value;
//     setTheme(selectedTheme);
//     socket.emit('theme-change', { roomId, theme: selectedTheme });
//   };

//   const handleFontSizeChange = (e) => {
//     const size = Number(e.target.value);
//     setFontSize(size);
//     socket.emit('fontSize-change', { roomId, fontSize: size });
//   };

//   const handleSubmit = async () => {
//     if (!code.trim()) return;

//     setIsEvaluating(true);
//     try {
//       // await onEvaluateCode();
//     } catch (error) {
//       console.error('Evaluation error:', error);
//     } finally {
//       setIsEvaluating(false);
//     }
//   }

//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       padding: '10px',
//       backgroundColor: theme === 'dark' ? '#282c34' : '#f5f5f5'
//     }}>

//       <div className="editor-header">
//         <h3>Collaborative Code Editor</h3>
//         <div className="header-actions">
//           <button
//             onClick={handleSubmit}
//             className="submit-button"
//             disabled={isEvaluating || !code.trim()}
//           >
//             {isEvaluating ? 'Evaluating...' : 'Submit Code'}
//           </button>
//           {isInterviewer && (
//             <button
//               onClick={onShowReport}
//               className="report-button"
//             >
//               Report Form
//             </button>
//           )}
//         </div>
//       </div>
//       {/* Task Section - Now updates in real-time */}
//       <div style={{
//         marginBottom: '15px',
//         padding: '15px',
//         background: theme === 'dark' ? '#2d333b' : '#fff3cd',
//         borderRadius: '8px'
//       }}>
//         <label style={{
//           fontWeight: 'bold',
//           display: 'block',
//           marginBottom: '8px',
//           color: theme === 'dark' ? '#f0f0f0' : '#333'
//         }}>
//           Task Description:
//         </label>
//         <textarea
//           value={task}
//           onChange={handleTaskChange}
//           rows={3}
//           style={{
//             width: '100%',
//             padding: '10px',
//             borderRadius: '6px',
//             border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
//             backgroundColor: theme === 'dark' ? '#1e2227' : 'white',
//             color: theme === 'dark' ? '#f0f0f0' : '#333',
//             fontSize: `${fontSize}px`
//           }}
//           placeholder="Write the task here..."
//         />
//       </div>

//       {/* Toolbar */}
//       <div style={{
//         marginBottom: '15px',
//         padding: '15px',
//         background: theme === 'dark' ? '#2d333b' : '#f0f0f0',
//         borderRadius: '8px',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '20px',
//         flexWrap: 'wrap'
//       }}>
//         <div style={{ flex: 1, color: theme === 'dark' ? '#f0f0f0' : '#333' }}>
//           <strong>Room:</strong> {roomId} | <strong>User:</strong> {name}
//         </div>

//         <div>
//           <label style={{ marginRight: '5px', color: theme === 'dark' ? '#f0f0f0' : '#333' }}>Language: </label>
//           <select
//             value={language}
//             onChange={handleLanguageChange}
//             style={{
//               padding: '5px',
//               borderRadius: '4px',
//               border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
//               backgroundColor: theme === 'dark' ? '#1e2227' : 'white',
//               color: theme === 'dark' ? '#f0f0f0' : '#333'
//             }}
//           >
//             <option value="javascript">JavaScript</option>
//             <option value="python">Python</option>
//             <option value="cpp">C++</option>
//           </select>
//         </div>

//         <div>
//           <label style={{ marginRight: '5px', color: theme === 'dark' ? '#f0f0f0' : '#333' }}>Theme: </label>
//           <select
//             value={theme}
//             onChange={handleThemeChange}
//             style={{
//               padding: '5px',
//               borderRadius: '4px',
//               border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
//               backgroundColor: theme === 'dark' ? '#1e2227' : 'white',
//               color: theme === 'dark' ? '#f0f0f0' : '#333'
//             }}
//           >
//             <option value="light">Light</option>
//             <option value="dark">Dark</option>
//           </select>
//         </div>

//         <div>
//           <label style={{ marginRight: '5px', color: theme === 'dark' ? '#f0f0f0' : '#333' }}>Font Size: </label>
//           <input
//             type="number"
//             value={fontSize}
//             min="10"
//             max="30"
//             onChange={handleFontSizeChange}
//             style={{
//               width: '60px',
//               padding: '5px',
//               borderRadius: '4px',
//               border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
//               backgroundColor: theme === 'dark' ? '#1e2227' : 'white',
//               color: theme === 'dark' ? '#f0f0f0' : '#333'
//             }}
//           />
//         </div>
//       </div>

//       {/* Code Editor */}
//       <div style={{
//         flex: 1,
//         border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
//         borderRadius: '8px',
//         overflow: 'hidden'
//       }}>
//         <CodeMirror
//           value={code}
//           height="100%"
//           extensions={getLanguageExtension()}
//           theme={getThemeExtension()}
//           onChange={handleCodeChange}
//           style={{ fontSize: `${fontSize}px` }}
//         />
//       </div>
//     </div>
//   );
// }

// export default EditorPage;






















import { useEffect, useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { githubLight } from '@uiw/codemirror-theme-github';
import { io } from "socket.io-client";
import { useAuthContext } from '../../../context/auth-context';

function EditorPage({ roomId, onShowReport, isInterviewer, setUsers, userId, userName: name }) {
  const [code, setCode] = useState('');
  const [task, setTask] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(16);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const { server, token } = useAuthContext();
  const socketRef = useRef(null);

  const getLanguageExtension = () => {
    switch (language) {
      case 'python': return [python()];
      case 'cpp': return [cpp()];
      default: return [javascript()];
    }
  };

  const getThemeExtension = () => (theme === 'dark' ? dracula : githubLight);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(server, {
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('join-room', { name, roomId, userId });
    });

    socket.on('init-state', (state) => {
      setCode(state.code);
      setTask(state.task);
      setLanguage(state.language);
      setTheme(state.theme);
      setFontSize(state.fontSize);
    });

    socket.on('code-update', (newCode) => setCode(newCode));
    socket.on('task-update', (newTask) => setTask(newTask));
    socket.on('language-update', (newLanguage) => setLanguage(newLanguage));
    socket.on('theme-update', (newTheme) => setTheme(newTheme));
    socket.on('fontSize-update', (newFontSize) => setFontSize(newFontSize));

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      socket.off('init-state');
      socket.off('code-update');
      socket.off('task-update');
      socket.off('language-update');
      socket.off('theme-update');
      socket.off('fontSize-update');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [roomId, name, server, token, userId]);

  const emitToSocket = (event, data) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.error('Socket not connected');
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);
    emitToSocket('code-change', { roomId, code: value });
  };

  const handleTaskChange = (e) => {
    const newTask = e.target.value;
    setTask(newTask);
    emitToSocket('task-change', { roomId, task: newTask });
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    emitToSocket('language-change', { roomId, language: selectedLanguage });
  };

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    emitToSocket('theme-change', { roomId, theme: selectedTheme });
  };

  const handleFontSizeChange = (e) => {
    const size = Number(e.target.value);
    setFontSize(size);
    emitToSocket('fontSize-change', { roomId, fontSize: size });
  };

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setIsEvaluating(true);
    try {
      // await onEvaluateCode();
    } catch (error) {
      console.error('Evaluation error:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      padding: '10px',
      backgroundColor: theme === 'dark' ? '#282c34' : '#f5f5f5'
    }}>

      <div className="editor-header">
        <h3>Collaborative Code Editor</h3>
        <div className="header-actions">
          <button
            onClick={handleSubmit}
            className="submit-button"
            disabled={isEvaluating || !code.trim()}
          >
            {isEvaluating ? 'Evaluating...' : 'Submit Code'}
          </button>
          {isInterviewer && (
            <button
              onClick={onShowReport}
              className="report-button"
            >
              Report Form
            </button>
          )}
        </div>
      </div>
      {/* Task Section - Now updates in real-time */}
      <div style={{
        marginBottom: '15px',
        padding: '15px',
        background: theme === 'dark' ? '#2d333b' : '#fff3cd',
        borderRadius: '8px'
      }}>
        <label style={{
          fontWeight: 'bold',
          display: 'block',
          marginBottom: '8px',
          color: theme === 'dark' ? '#f0f0f0' : '#333'
        }}>
          Task Description:
        </label>
        <textarea
          value={task}
          onChange={handleTaskChange}
          rows={3}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
            backgroundColor: theme === 'dark' ? '#1e2227' : 'white',
            color: theme === 'dark' ? '#f0f0f0' : '#333',
            fontSize: `${fontSize}px`
          }}
          placeholder="Write the task here..."
        />
      </div>

      {/* Toolbar */}
      <div style={{
        marginBottom: '15px',
        padding: '15px',
        background: theme === 'dark' ? '#2d333b' : '#f0f0f0',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, color: theme === 'dark' ? '#f0f0f0' : '#333' }}>
          <strong>Room:</strong> {roomId} | <strong>User:</strong> {name}
        </div>

        <div>
          <label style={{ marginRight: '5px', color: theme === 'dark' ? '#f0f0f0' : '#333' }}>Language: </label>
          <select
            value={language}
            onChange={handleLanguageChange}
            style={{
              padding: '5px',
              borderRadius: '4px',
              border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
              backgroundColor: theme === 'dark' ? '#1e2227' : 'white',
              color: theme === 'dark' ? '#f0f0f0' : '#333'
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div>
          <label style={{ marginRight: '5px', color: theme === 'dark' ? '#f0f0f0' : '#333' }}>Theme: </label>
          <select
            value={theme}
            onChange={handleThemeChange}
            style={{
              padding: '5px',
              borderRadius: '4px',
              border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
              backgroundColor: theme === 'dark' ? '#1e2227' : 'white',
              color: theme === 'dark' ? '#f0f0f0' : '#333'
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <label style={{ marginRight: '5px', color: theme === 'dark' ? '#f0f0f0' : '#333' }}>Font Size: </label>
          <input
            type="number"
            value={fontSize}
            min="10"
            max="30"
            onChange={handleFontSizeChange}
            style={{
              width: '60px',
              padding: '5px',
              borderRadius: '4px',
              border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
              backgroundColor: theme === 'dark' ? '#1e2227' : 'white',
              color: theme === 'dark' ? '#f0f0f0' : '#333'
            }}
          />
        </div>
      </div>

      {/* Code Editor */}
      <div style={{
        flex: 1,
        border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <CodeMirror
          value={code}
          height="100%"
          extensions={getLanguageExtension()}
          theme={getThemeExtension()}
          onChange={handleCodeChange}
          style={{ fontSize: `${fontSize}px` }}
        />
      </div>
    </div>
  );
}

export default EditorPage;


