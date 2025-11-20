// const evaluateCode = (code) => {
//     try {
//         // Create a new function to isolate the code execution
//         const func = new Function(code);
//         // Capture console.log output
//         const originalLog = console.log;
//         const logs = [];
//         console.log = (...args) => {
//             logs.push(args.map(arg =>
//                 typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
//             ).join(' '));
//         };
//         // Execute the code
//         const result = func();
//         // Restore console.log
//         console.log = originalLog;
//         // Format the output
//         let output = logs.join('\n');
//         if (result !== undefined) {
//             output += (output ? '\n' : '') + `=> ${typeof result === 'object' ? JSON.stringify(result) : result}`;
//         }
//         return { success: true, output: output || "// Code executed successfully with no output" };
//     } catch (error) {
//         return { success: false, output: `Error: ${error.message}` };
//     }
// };





const CodeTask = require("../models/CodeTask-model");
// Store room states
const roomStates = {};
// Store user count for each room
const roomUserCounts = {};
async function saveOrUpdateCodeTask(interviewId, question, code, result, language) {

    try {
        if (!interviewId) throw new Error("interviewId is required");
        if (!question) throw new Error("question is required");
        if (!code) throw new Error("code is required");
        if (!language) throw new Error("language is required");

        // Convert result to string safely
        const resultStr =
            result === undefined || result === null
                ? "No return value"
                : typeof result === "object"
                    ? JSON.stringify(result)
                    : String(result);

        // Find existing document
        let existingDoc = await CodeTask.findOne({ interviewId });

        if (existingDoc) {
            existingDoc.codeTask.push({ question, code, result: resultStr, language });
            return await existingDoc.save();
        } else {
            return await CodeTask.create({
                interviewId,
                codeTask: [{ question, code, result: resultStr, language }]
            });
        }
    } catch (error) {
        console.error("❌ Error in saveOrUpdateCodeTask:", error);
        // Rethrow so caller can handle & send proper response
        throw new Error(`Failed to save code task: ${error.message}`);
    }
}

const evaluateCode = async (code, roomId, taskDescription, language) => {
    let logs = [];
    let result;
    let output = "";
    let errorOccurred = false;

    try {
        // Validate inputs
        if (!roomId) throw new Error("roomId is required");
        if (!taskDescription) throw new Error("taskDescription is required");
        if (!code) throw new Error("code is required");
        if (!language) throw new Error("language is required");

        // Capture console.log output
        const originalLog = console.log;
        console.log = (...args) => {
            logs.push(args.map(arg =>
                typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            ).join(" "));
        };

        try {
            // Execute user code safely
            const func = new Function(code);
            result = func();
        } catch (executionError) {
            errorOccurred = true;
            logs.push(`Execution Error: ${executionError.message}`);
        }

        // Restore console.log
        console.log = originalLog;

        // Build output string
        output = logs.join("\n");
        if (result !== undefined) {
            output += (output ? "\n" : "") + `=> ${typeof result === "object" ? JSON.stringify(result) : result}`;
        }

        // Always save result (even if execution had an error)
        await saveOrUpdateCodeTask(
            roomId,
            taskDescription,
            code,
            errorOccurred ? (logs.length ? logs.join("\n") : "Execution Error occurred") : output,
            language
        );

        return {
            success: !errorOccurred,
            output: output || "// Code executed successfully with no output"
        };
    } catch (error) {
        console.error("❌ Error evaluating code:", error);

        // Save failed execution too for audit/debug
        try {
            await saveOrUpdateCodeTask(roomId, taskDescription, code, `Error: ${error.message}`, language);
        } catch (saveError) {
            console.error("❌ Failed to save error result:", saveError);
        }

        return { success: false, output: `Error: ${error.message}` };
    }
};

const codeEditorHandlers = (socket, io) => {
    // Function to get user count for a room
    const getRoomUserCount = (roomId) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        return room ? room.size : 0;
    };

    // Join a room
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        // Initialize room state if it doesn't exist
        if (!roomStates[roomId]) {
            roomStates[roomId] = {
                showCodeEditor: true,
                showWhiteboard: false,
                editorState: {
                    code: "// Start coding...",
                    taskDescription: "Write a function that reverses a string",
                    editorSettings: {
                        language: "javascript",
                        theme: "vs-dark",
                        fontSize: 14
                    },
                    isConsoleOpen: false,
                    consoleOutput: ""
                },
                whiteboardState: {
                    paths: [],
                    currentPath: null
                }
            };
        }

        // Initialize user count if it doesn't exist
        if (!roomUserCounts[roomId]) {
            roomUserCounts[roomId] = 0;
        }

        // Increment user count
        roomUserCounts[roomId] = getRoomUserCount(roomId);

        // Send current room state to the newly connected client
        socket.emit("roomState", roomStates[roomId]);

        // Send current user count to all clients in the room
        io.to(roomId).emit("userCountUpdate", roomUserCounts[roomId]);
        console.log(`Room ${roomId} user count: ${roomUserCounts[roomId]}`);
    });

    // // Handle joining transcription room
    // socket.on("joinTranscriptionRoom", (roomId) => {
    //     socket.join(roomId);
    //     console.log(`User ${socket.id} joined transcription room ${roomId}`);
    // });

    // // Handle transcription
    // socket.on("transcription", (data) => {
    //     const { roomId, transcript, userId, role } = data;
    //     // Broadcast the transcription to all other users in the room
    //     socket.to(roomId).emit("transcription", {
    //         transcript,
    //         userId,
    //         role
    //     });
    //     console.log(`Transcription from ${role} (${userId}) in room ${roomId}: ${transcript}`);
    // });





    // Join a transcription room
    socket.on("joinTranscriptionRoom", (roomId) => {
        if (!roomId) return;
        socket.join(roomId);
        console.log(`User ${socket.id} joined transcription room ${roomId}`);
        socket.to(roomId).emit("userJoinedRoom", { userId: socket.id });
    });

    // Handle incoming transcription
    socket.on("transcription", async (data) => {
        const { roomId, transcript, userId, role, targetLanguage } = data || {};
        console.log(data);


        if (!roomId || !transcript) return;

        // Optional: send transcript for translation
        let translatedText = transcript;
        if (targetLanguage && targetLanguage !== "en-US") {
            // Replace this stub with your translation API
            translatedText = `[${targetLanguage}] ${transcript}`;
        }

        // Broadcast to other participants
        socket.to(roomId).emit("transcription", {
            transcript,
            translatedText,
            userId,
            role,
            timestamp: new Date().toISOString()
        });

        console.log(
            `Transcription from ${role} (${userId}) in room ${roomId}: ${transcript}`
        );
    });










    // Handle recording status changes
    socket.on("recordingStatusChange", (data) => {
        const { roomId, status, role } = data;
        // Broadcast the recording status to all users in the room (including the sender)
        io.to(roomId).emit("recordingStatusUpdate", {
            status,
            role
        });
        console.log(`Recording status updated in room ${roomId}: ${role} is ${status}`);
    });

    // Handle UI state changes
    socket.on("uiStateChange", (data) => {
        const { roomId, showCodeEditor, showWhiteboard, editorState, whiteboardState } = data;

        // Update room state
        if (roomStates[roomId]) {
            if (showCodeEditor !== undefined) {
                roomStates[roomId].showCodeEditor = showCodeEditor;
            }
            if (showWhiteboard !== undefined) {
                roomStates[roomId].showWhiteboard = showWhiteboard;
            }
            if (editorState) {
                roomStates[roomId].editorState = editorState;
            }
            if (whiteboardState) {
                roomStates[roomId].whiteboardState = whiteboardState;
            }

            // Broadcast updated state to all clients in the room
            io.to(roomId).emit("uiStateChange", roomStates[roomId]);
            console.log(`Room ${roomId} state updated:`, roomStates[roomId]);
        }
    });

    // Handle editor state changes
    socket.on("editorStateChange", (data) => {
        const { roomId, editorState } = data;

        // Update room state
        if (roomStates[roomId]) {
            roomStates[roomId].editorState = editorState;

            // Broadcast editor state to all clients in the room
            io.to(roomId).emit("editorStateUpdate", editorState);
            console.log(`Editor state updated in room ${roomId}`);
        }
    });

    // Handle whiteboard state changes
    socket.on("whiteboardStateChange", (data) => {
        const { roomId, whiteboardState } = data;

        // Update room state
        if (roomStates[roomId]) {
            roomStates[roomId].whiteboardState = whiteboardState;

            // Broadcast whiteboard state to all clients in the room
            io.to(roomId).emit("whiteboardStateUpdate", whiteboardState);
            console.log(`Whiteboard state updated in room ${roomId}`);
        }
    });

    // Handle code changes (room-specific)
    socket.on("codeChange", (data) => {
        const { roomId, code } = data;

        // Update room state
        if (roomStates[roomId]) {
            roomStates[roomId].editorState.code = code;
        }

        // Broadcast code changes to all other clients in the room
        socket.to(roomId).emit("codeUpdate", code);
        console.log(`Code change in room ${roomId}`);
    });

    // Handle task description changes (room-specific)
    socket.on("taskDescriptionChange", (data) => {
        const { roomId, taskDescription } = data;

        // Update room state
        if (roomStates[roomId]) {
            roomStates[roomId].editorState.taskDescription = taskDescription;
        }

        // Broadcast task description changes to all clients in the room
        io.to(roomId).emit("taskDescriptionUpdate", taskDescription);
        console.log(`Task description updated in room ${roomId}`);
    });

    // Handle editor settings changes (room-specific)
    socket.on("editorSettingsChange", (data) => {
        const { roomId, editorSettings } = data;

        // Update room state
        if (roomStates[roomId]) {
            roomStates[roomId].editorState.editorSettings = editorSettings;
        }

        // Broadcast editor settings changes to all clients in the room
        io.to(roomId).emit("editorSettingsUpdate", editorSettings);
        console.log(`Editor settings updated in room ${roomId}`);
    });

    // Handle console toggle (room-specific)
    socket.on("consoleToggle", (data) => {
        const { roomId, isConsoleOpen } = data;

        // Update room state
        if (roomStates[roomId]) {
            roomStates[roomId].editorState.isConsoleOpen = isConsoleOpen;
        }

        // Broadcast console toggle to all clients in the room
        io.to(roomId).emit("consoleToggleUpdate", isConsoleOpen);
        console.log(`Console toggled in room ${roomId}: ${isConsoleOpen}`);
    });

    // Handle console clear (room-specific)
    socket.on("consoleClear", (data) => {
        const { roomId } = data;

        // Update room state
        if (roomStates[roomId]) {
            roomStates[roomId].editorState.consoleOutput = "";
        }

        // Broadcast console clear to all clients in the room
        io.to(roomId).emit("consoleClearUpdate");
        console.log(`Console cleared in room ${roomId}`);
    });

    // Handle console output changes (room-specific)
    socket.on("consoleOutputChange", (data) => {
        const { roomId, consoleOutput } = data;

        // Update room state
        if (roomStates[roomId]) {
            roomStates[roomId].editorState.consoleOutput = consoleOutput;
        }

        // Broadcast console output to all clients in the room
        io.to(roomId).emit("consoleOutputUpdate", consoleOutput);
        console.log(`Console output updated in room ${roomId}`);
    });

    // Handle code evaluation (room-specific)
    socket.on("evaluateCode", async (data) => {

        const { roomId, taskDescription, code, language } = data;
        // console.log(`Evaluating code in room ${roomId}`);

        // Only evaluate JavaScript code for now
        if (language !== "javascript") {
            const result = {
                success: false,
                output: "Code evaluation is currently only supported for JavaScript."
            };

            // Update room state
            if (roomStates[roomId]) {
                roomStates[roomId].editorState.consoleOutput = result.output;
                roomStates[roomId].editorState.isConsoleOpen = true; // Open console for all participants

                // Broadcast console output to all clients in the room
                io.to(roomId).emit("consoleOutputUpdate", result.output);
                // Broadcast console toggle to open console for all participants
                io.to(roomId).emit("consoleToggleUpdate", true);
                console.log(`Console opened and output updated in room ${roomId}`);
            }
            return;
        }

        // Evaluate the code
        const result = await evaluateCode(code, roomId, taskDescription, language);

        // Update room state
        if (roomStates[roomId]) {
            roomStates[roomId].editorState.consoleOutput = result.output;
            roomStates[roomId].editorState.isConsoleOpen = true; // Open console for all participants

            // Broadcast console output to all clients in the room
            io.to(roomId).emit("consoleOutputUpdate", result.output);
            // Broadcast console toggle to open console for all participants
            io.to(roomId).emit("consoleToggleUpdate", true);
            console.log(`Console opened and output updated in room ${roomId}`);
        }

        console.log(`Code evaluation result in room ${roomId}:`, result);
    });

    // Handle drawing events (room-specific)
    socket.on("startDrawing", (data) => {
        const { roomId, path } = data;

        // Update room state
        if (roomStates[roomId]) {
            roomStates[roomId].whiteboardState.paths.push(path);
            roomStates[roomId].whiteboardState.currentPath = path;
        }

        // Broadcast to all other clients in the room
        socket.to(roomId).emit("startDrawing", { path });
    });

    socket.on("draw", (data) => {
        const { roomId, x, y } = data;

        // Update room state
        if (roomStates[roomId] && roomStates[roomId].whiteboardState.currentPath) {
            roomStates[roomId].whiteboardState.currentPath.points.push({ x, y });
        }

        // Broadcast drawing events to all other clients in the room
        socket.to(roomId).emit("draw", { x, y });
    });

    socket.on("stopDrawing", (data) => {
        const { roomId } = data;

        // Update room state
        if (roomStates[roomId]) {
            roomStates[roomId].whiteboardState.currentPath = null;
        }

        // Broadcast to all other clients in the room
        socket.to(roomId).emit("stopDrawing", {});
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);

        // Find all rooms this user was in and update user counts
        for (const roomId of Array.from(socket.rooms)) {
            if (roomId !== socket.id) { // Skip the socket's own room
                // Update user count for this room
                roomUserCounts[roomId] = getRoomUserCount(roomId);

                // Broadcast updated user count to all clients in the room
                io.to(roomId).emit("userCountUpdate", roomUserCounts[roomId]);
                console.log(`Room ${roomId} user count after disconnect: ${roomUserCounts[roomId]}`);
            }
        }
    });
};

module.exports = { codeEditorHandlers };