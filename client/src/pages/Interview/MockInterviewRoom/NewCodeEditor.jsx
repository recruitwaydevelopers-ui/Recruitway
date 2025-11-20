import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useAuthContext } from "../../../context/auth-context";

const NewCodeEditor = ({ roomId, isInterviewer, socket, state, onStateChange }) => {
    const { user, server, token } = useAuthContext();
    const editorRef = useRef(null);

    // Handle code changes
    const handleChange = (val) => {
        const newState = { ...state, code: val };
        onStateChange(newState);
        socket.emit("codeChange", { roomId, code: val });
    };

    // Handle task description changes
    const handleTaskDescriptionChange = (e) => {
        const newDescription = e.target.value;
        const newState = { ...state, taskDescription: newDescription };
        onStateChange(newState);
        socket.emit("taskDescriptionChange", { roomId, taskDescription: newDescription });
    };

    // Handle editor settings changes
    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        const newSettings = { ...state.editorSettings, language: newLanguage };
        const newState = { ...state, editorSettings: newSettings };
        onStateChange(newState);
        socket.emit("editorSettingsChange", { roomId, editorSettings: newSettings });
    };

    const handleThemeChange = (e) => {
        const newTheme = e.target.value;
        const newSettings = { ...state.editorSettings, theme: newTheme };
        const newState = { ...state, editorSettings: newSettings };
        onStateChange(newState);
        socket.emit("editorSettingsChange", { roomId, editorSettings: newSettings });
    };

    const handleFontSizeChange = (e) => {
        const newFontSize = parseInt(e.target.value);
        const newSettings = { ...state.editorSettings, fontSize: newFontSize };
        const newState = { ...state, editorSettings: newSettings };
        onStateChange(newState);
        socket.emit("editorSettingsChange", { roomId, editorSettings: newSettings });
    };

    // Console functions
    const toggleConsole = () => {
        const newState = { ...state, isConsoleOpen: !state.isConsoleOpen };
        onStateChange(newState);
        socket.emit("consoleToggle", { roomId, isConsoleOpen: newState.isConsoleOpen });
    };

    const clearConsole = () => {
        const newState = { ...state, consoleOutput: "" };
        onStateChange(newState);
        socket.emit("consoleClear", { roomId });
    };

    // Evaluate code using server
    const evaluateCode = () => {
        socket.emit("evaluateCode", {
            roomId,
            taskDescription: state.taskDescription,
            code: state.code,
            language: state.editorSettings.language,
            interview:"mock"
        });
    };

    // Get theme-based colors
    const getThemeColors = () => {
        if (state.editorSettings.theme === "vs") {
            return {
                bgColor: "#ffffff",
                borderColor: "#d1d5db",
                textColor: "#1f2937",
                surfaceColor: "#f3f4f6",
                accentColor: "#3b82f6",
                buttonBg: "#f3f4f6",
                buttonHover: "#e5e7eb"
            };
        } else if (state.editorSettings.theme === "hc-black") {
            return {
                bgColor: "#000000",
                borderColor: "#ffffff",
                textColor: "#ffffff",
                surfaceColor: "#000000",
                accentColor: "#61dafb",
                buttonBg: "#000000",
                buttonHover: "#333333"
            };
        } else { // vs-dark
            return {
                bgColor: "#1e1e1e",
                borderColor: "#3e3e42",
                textColor: "#d4d4d4",
                surfaceColor: "#252526",
                accentColor: "#007acc",
                buttonBg: "#252526",
                buttonHover: "#2d2d30"
            };
        }
    };

    const themeColors = getThemeColors();

    useEffect(() => {
        // Listen for code updates
        socket.on("codeUpdate", (data) => {
            const newState = { ...state, code: data };
            onStateChange(newState);
        });

        // Listen for task description updates
        socket.on("taskDescriptionUpdate", (data) => {
            const newState = { ...state, taskDescription: data };
            onStateChange(newState);
        });

        // Listen for editor settings updates
        socket.on("editorSettingsUpdate", (data) => {
            const newState = { ...state, editorSettings: data };
            onStateChange(newState);
        });

        // Listen for console toggle
        socket.on("consoleToggleUpdate", (data) => {
            const newState = { ...state, isConsoleOpen: data };
            onStateChange(newState);
        });

        // Listen for console clear
        socket.on("consoleClearUpdate", () => {
            const newState = { ...state, consoleOutput: "" };
            onStateChange(newState);
        });

        // Listen for console output updates
        socket.on("consoleOutputUpdate", (data) => {
            const newState = { ...state, consoleOutput: data };
            onStateChange(newState);
        });

        return () => {
            socket.off("codeUpdate");
            socket.off("taskDescriptionUpdate");
            socket.off("editorSettingsUpdate");
            socket.off("consoleToggleUpdate");
            socket.off("consoleClearUpdate");
            socket.off("consoleOutputUpdate");
        };
    }, [roomId, state, onStateChange, socket]);

    return (
        <div className="h-100 d-flex flex-column bg-dark text-white">
            {/* Task Description Section */}
            <div className="task-section">
                <div className="section-header">
                    <div className="d-flex w-100 align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-clipboard-data section-icon"></i>
                            <h2 className="section-title">Task Description</h2>
                        </div>
                        <span className="btn btn-sm btn-secondary">Live Sync</span>
                        {/* <span className="sync-badge">Live Sync</span> */}
                    </div>
                </div>
                <div className="task-content">
                    <textarea
                        className="task-input"
                        value={state.taskDescription}
                        onChange={handleTaskDescriptionChange}
                        placeholder="Enter the coding task description here..."
                        rows={3}
                    />
                    <div className="task-actions">
                        <button
                            onClick={evaluateCode}
                            className="run-button"
                        >
                            <i className="bi bi-play-fill me-2"></i>
                            Run Code
                        </button>
                    </div>
                </div>
            </div>

            {/* Editor Settings Section */}
            <div className="settings-section">
                <div className="section-header">
                    <div className="d-flex w-100 align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-gear section-icon"></i>
                            <h2 className="section-title">Editor Settings</h2>
                        </div>
                        <span className="btn btn-sm btn-secondary">Live Sync</span>
                        {/* <span className="sync-badge">Live Sync</span> */}
                    </div>
                </div>
                <div className="settings-grid">
                    <div className="setting-group">
                        <label className="setting-label">Language</label>
                        <div className="select-wrapper">
                            <select
                                className="setting-select"
                                value={state.editorSettings.language}
                                onChange={handleLanguageChange}
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="csharp">C#</option>
                                <option value="cpp">C++</option>
                                <option value="php">PHP</option>
                                <option value="typescript">TypeScript</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="sql">SQL</option>
                            </select>
                            <i className="bi bi-chevron-down select-icon"></i>
                        </div>
                    </div>
                    <div className="setting-group">
                        <label className="setting-label">Theme</label>
                        <div className="select-wrapper">
                            <select
                                className="setting-select"
                                value={state.editorSettings.theme}
                                onChange={handleThemeChange}
                            >
                                <option value="vs-dark">Dark</option>
                                <option value="vs">Light</option>
                                <option value="hc-black">High Contrast</option>
                            </select>
                            <i className="bi bi-chevron-down select-icon"></i>
                        </div>
                    </div>
                    <div className="setting-group">
                        <label className="setting-label">Font Size</label>
                        <div className="select-wrapper">
                            <select
                                className="setting-select"
                                value={state.editorSettings.fontSize}
                                onChange={handleFontSizeChange}
                            >
                                <option value="10">10px</option>
                                <option value="12">12px</option>
                                <option value="14">14px</option>
                                <option value="16">16px</option>
                                <option value="18">18px</option>
                                <option value="20">20px</option>
                                <option value="22">22px</option>
                                <option value="24">24px</option>
                            </select>
                            <i className="bi bi-chevron-down select-icon"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Monaco Editor */}
            <div className="editor-container">
                <Editor
                    height="100%"
                    language={state.editorSettings.language}
                    theme={state.editorSettings.theme}
                    value={state.code}
                    onChange={handleChange}
                    onMount={(editor) => editorRef.current = editor}
                    options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: state.editorSettings.fontSize,
                        fontFamily: 'Fira Code, monospace',
                        automaticLayout: true,
                        wordWrap: "on",
                        lineNumbers: "on",
                        roundedSelection: true,
                        scrollbar: {
                            vertical: "auto",
                            horizontal: "auto"
                        }
                    }}
                />
            </div>

            {/* Console Button */}
            <div className="console-toggle">
                <button
                    onClick={toggleConsole}
                    className="console-button"
                    style={{
                        backgroundColor: state.isConsoleOpen ? themeColors.accentColor : themeColors.buttonBg,
                        color: state.isConsoleOpen ? 'white' : themeColors.textColor,
                        border: `1px solid ${themeColors.borderColor}`,
                    }}
                >
                    <i className={`bi bi-${state.isConsoleOpen ? 'chevron-down' : 'chevron-up'} me-2`}></i>
                    {state.isConsoleOpen ? 'Hide Console' : 'Show Console'}
                </button>
            </div>

            {/* Console Drawer */}
            {state.isConsoleOpen && (
                <div
                    className="console-drawer"
                    style={{
                        backgroundColor: themeColors.bgColor,
                        borderTop: `1px solid ${themeColors.borderColor}`,
                    }}
                >
                    <div className="console-header">
                        <div className="console-title">
                            <i className="bi bi-terminal me-2"></i>
                            Console Output
                            <span className="console-sync-indicator">
                                <i className="bi bi-arrow-repeat me-1"></i>
                                Synced
                            </span>
                        </div>
                        <div className="console-info">
                            <span className="console-lines">
                                {state.consoleOutput ? `${state.consoleOutput.split('\n').length} lines` : 'No output'}
                            </span>
                            <button
                                onClick={clearConsole}
                                className="clear-button"
                            >
                                <i className="bi bi-trash me-1"></i>
                                Clear
                            </button>
                        </div>
                    </div>
                    <div className="console-body">
                        <pre className="console-output">
                            {state.consoleOutput || '// Run your code to see output here'}
                        </pre>
                    </div>
                </div>
            )}

            <style jsx>{`
                .task-section {
                    background-color: rgba(30, 30, 30, 0.5);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 1rem;
                }
                .settings-section {
                    background-color: rgba(30, 30, 30, 0.3);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 1rem;
                }
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }
                .section-icon {
                    color: #58a6ff;
                    margin-right: 0.5rem;
                    font-size: 1.1rem;
                }
                .section-title {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0;
                    color: #f0f6fc;
                }
                .sync-badge {
                    background-color: #0ea5e9;
                    color: white;
                    font-size: 0.7rem;
                    padding: 0.15rem 0.4rem;
                    border-radius: 12px;
                    font-weight: 500;
                    margin-left: auto;
                }
                .task-input {
                    width: 100%;
                    background-color: #0d1117;
                    border: 1px solid #30363d;
                    color: #f0f6fc;
                    border-radius: 6px;
                    padding: 0.75rem;
                    font-size: 0.9rem;
                    resize: none;
                    margin-bottom: 0.75rem;
                    transition: border-color 0.2s;
                }
                .task-input:focus {
                    border-color: #58a6ff;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2);
                }
                .task-actions {
                    display: flex;
                    justify-content: flex-end;
                }
                .run-button {
                    background-color: #238636;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 0.5rem 1rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .run-button:hover {
                    background-color: #2ea043;
                }
                .settings-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                }
                .setting-group {
                    display: flex;
                    flex-direction: column;
                }
                .setting-label {
                    font-size: 0.8rem;
                    color: #8b949e;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }
                .select-wrapper {
                    position: relative;
                }
                .setting-select {
                    width: 100%;
                    background-color: #0d1117;
                    border: 1px solid #30363d;
                    color: #f0f6fc;
                    border-radius: 6px;
                    padding: 0.5rem 2rem 0.5rem 0.75rem;
                    font-size: 0.875rem;
                    appearance: none;
                    cursor: pointer;
                    transition: border-color 0.2s;
                }
                .setting-select:focus {
                    border-color: #58a6ff;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2);
                }
                .select-icon {
                    position: absolute;
                    right: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #8b949e;
                    pointer-events: none;
                }
                .editor-container {
                    flex: 1;
                    overflow: hidden;
                }
                .console-toggle {
                    background-color: rgba(30, 30, 30, 0.5);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 0.75rem;
                    display: flex;
                    justify-content: center;
                }
                .console-button {
                    border-radius: 6px;
                    padding: 0.5rem 1rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.875rem;
                }
                .console-button:hover {
                    opacity: 0.9;
                }
                .console-drawer {
                    height: 30%;
                    display: flex;
                    flex-direction: column;
                    transition: height 0.3s ease;
                }
                .console-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    background-color: rgba(0, 0, 0, 0.2);
                }
                .console-title {
                    font-weight: 600;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                }
                .console-sync-indicator {
                    margin-left: 0.5rem;
                    font-size: 0.7rem;
                    color: #3fb950;
                    display: flex;
                    align-items: center;
                }
                .console-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .console-lines {
                    font-size: 0.75rem;
                    opacity: 0.7;
                }
                .clear-button {
                    background-color: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: inherit;
                    border-radius: 4px;
                    padding: 0.25rem 0.5rem;
                    font-size: 0.75rem;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .clear-button:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
                .console-body {
                    flex: 1;
                    overflow: auto;
                    padding: 1rem;
                }
                .console-output {
                    margin: 0;
                    font-family: 'Fira Code', 'Consolas', monospace;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    whiteSpace: pre-wrap;
                    wordBreak: break-word;
                }
                @media (max-width: 768px) {
                    .settings-grid {
                        grid-template-columns: 1fr;
                        gap: 0.75rem;
                    }
                    .console-drawer {
                        height: 40% !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default NewCodeEditor;