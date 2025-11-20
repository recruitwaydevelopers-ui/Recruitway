import { useEffect, useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { githubLight } from '@uiw/codemirror-theme-github';
import { io } from "socket.io-client";
import { useAuthContext } from '../../../context/auth-context';

function CodeEditor1({ roomId, onShowReport, isInterviewer, setUsers, userId, userName: name }) {
  const [code, setCode] = useState('');
  const [task, setTask] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(16);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [users, setLocalUsers] = useState([]);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
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
      setLocalUsers(state.users || []);
    });

    socket.on('code-update', (newCode) => setCode(newCode));
    socket.on('task-update', (newTask) => setTask(newTask));
    socket.on('language-update', (newLanguage) => setLanguage(newLanguage));
    socket.on('theme-update', (newTheme) => setTheme(newTheme));
    socket.on('fontSize-update', (newFontSize) => setFontSize(newFontSize));
    socket.on('user-joined', (user) => {
      setLocalUsers(prev => [...prev, user]);
      setUsers(prev => [...prev, user]);
    });
    socket.on('user-left', (userId) => {
      setLocalUsers(prev => prev.filter(u => u.id !== userId));
      setUsers(prev => prev.filter(u => u.id !== userId));
    });
    socket.on('users-updated', (users) => {
      setLocalUsers(users);
      setUsers(users);
    });

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
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('users-updated');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [roomId, name, server, token, userId, setUsers]);

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
    setConsoleOutput('Evaluating code...\n');
    try {
      // Simulate code evaluation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConsoleOutput(prev => prev + 'Evaluation completed successfully!\n');
      setConsoleOutput(prev => prev + 'Output: Hello, World!\n');
      setConsoleOutput(prev => prev + 'Execution time: 0.25s\n');
    } catch (error) {
      console.error('Evaluation error:', error);
      setConsoleOutput(prev => prev + `Error: ${error.message}\n`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const clearConsole = () => {
    setConsoleOutput('');
  };

  const toggleConsole = () => {
    setIsConsoleOpen(!isConsoleOpen);
  };

  // Theme-based colors
  const bgColor = theme === 'dark' ? '#0d1117' : '#ffffff';
  const surfaceColor = theme === 'dark' ? '#161b22' : '#f6f8fa';
  const borderColor = theme === 'dark' ? '#30363d' : '#d1d9e0';
  const textColor = theme === 'dark' ? '#c9d1d9' : '#24292f';
  const accentColor = '#1f6feb';
  const successColor = '#3fb950';
  const warningColor = '#d29922';
  const errorColor = '#f85149';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      backgroundColor: bgColor,
      color: textColor,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: `1px solid ${borderColor}`,
        backgroundColor: surfaceColor,
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 600,
            color: textColor,
          }}>Collaborative Code Editor</h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '4px',
            fontSize: '14px',
            color: theme === 'dark' ? '#8b949e' : '#656d76',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2z"/>
              </svg>
              <span>Room: {roomId}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
              </svg>
              <span>User: {name}</span>
            </div>
            {users.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                </svg>
                <span>{users.length} {users.length === 1 ? 'user' : 'users'} connected</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSubmit}
            disabled={isEvaluating || !code.trim()}
            style={{
              padding: '8px 16px',
              backgroundColor: isEvaluating || !code.trim() ? '#484f58' : accentColor,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isEvaluating || !code.trim() ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isEvaluating ? (
              <>
                <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Evaluating...
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                </svg>
                Run Code
              </>
            )}
          </button>
          {isInterviewer && (
            <button
              onClick={onShowReport}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: accentColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
              </svg>
              Report Form
            </button>
          )}
        </div>
      </div>

      {/* Task Description */}
      <div style={{
        padding: '16px 24px',
        borderBottom: `1px solid ${borderColor}`,
        backgroundColor: surfaceColor,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 600,
            color: textColor,
          }}>Task Description</h2>
        </div>
        <textarea
          value={task}
          onChange={handleTaskChange}
          rows={3}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: `1px solid ${borderColor}`,
            backgroundColor: bgColor,
            color: textColor,
            fontSize: `${fontSize}px`,
            resize: 'vertical',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
          placeholder="Write the task description here..."
        />
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 24px',
        borderBottom: `1px solid ${borderColor}`,
        backgroundColor: surfaceColor,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: textColor }}>Language:</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: `1px solid ${borderColor}`,
              backgroundColor: bgColor,
              color: textColor,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: textColor }}>Theme:</label>
          <select
            value={theme}
            onChange={handleThemeChange}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: `1px solid ${borderColor}`,
              backgroundColor: bgColor,
              color: textColor,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: textColor }}>Font Size:</label>
          <input
            type="number"
            value={fontSize}
            min="10"
            max="30"
            onChange={handleFontSizeChange}
            style={{
              width: '60px',
              padding: '6px 10px',
              borderRadius: '6px',
              border: `1px solid ${borderColor}`,
              backgroundColor: bgColor,
              color: textColor,
              fontSize: '14px',
            }}
          />
        </div>
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button
            onClick={toggleConsole}
            style={{
              padding: '6px 12px',
              backgroundColor: isConsoleOpen ? accentColor : 'transparent',
              color: isConsoleOpen ? 'white' : textColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
            </svg>
            Console
          </button>
          {isConsoleOpen && (
            <button
              onClick={clearConsole}
              style={{
                padding: '6px 12px',
                backgroundColor: 'transparent',
                color: textColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Editor Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Code Editor */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          borderBottom: isConsoleOpen ? `1px solid ${borderColor}` : 'none',
        }}>
          <CodeMirror
            value={code}
            height="100%"
            extensions={getLanguageExtension()}
            theme={getThemeExtension()}
            onChange={handleCodeChange}
            style={{ fontSize: `${fontSize}px` }}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              highlightSelectionMatches: true,
            }}
          />
        </div>

        {/* Console */}
        {isConsoleOpen && (
          <div style={{
            height: '200px',
            backgroundColor: bgColor,
            borderTop: `1px solid ${borderColor}`,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              padding: '8px 16px',
              borderBottom: `1px solid ${borderColor}`,
              backgroundColor: surfaceColor,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: textColor }}>Console Output</span>
              <span style={{ fontSize: '12px', color: theme === 'dark' ? '#8b949e' : '#656d76' }}>
                {consoleOutput ? `${consoleOutput.split('\n').length} lines` : 'No output'}
              </span>
            </div>
            <pre style={{
              flex: 1,
              padding: '12px 16px',
              overflow: 'auto',
              fontFamily: "'Fira Code', 'Consolas', monospace",
              fontSize: '14px',
              lineHeight: '1.5',
              color: textColor,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {consoleOutput || '// Run your code to see output here'}
            </pre>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 16px',
        backgroundColor: surfaceColor,
        borderTop: `1px solid ${borderColor}`,
        fontSize: '12px',
        color: theme === 'dark' ? '#8b949e' : '#656d76',
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: language === 'javascript' ? '#f7df1e' : 
                               language === 'python' ? '#3776ab' : '#00599c',
            }}></div>
            <span>{language.toUpperCase()}</span>
          </div>
          <div>
            {code.split('\n').length} lines
          </div>
          <div>
            {code.length} characters
          </div>
        </div>
        <div>
          {users.length} {users.length === 1 ? 'user' : 'users'} connected
        </div>
      </div>
    </div>
  );
}

export default CodeEditor1;     